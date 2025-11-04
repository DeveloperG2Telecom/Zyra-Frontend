import React, { useState, useEffect } from 'react';
import Layout from './shared/Layout';
import ModalDetalhesMonitoramento from './ModalDetalhesMonitoramento';
import api from '../services/api';

// Funções utilitárias locais
const getStatusColor = (status) => {
  switch (status) {
    case 'online': return '#10b981';
    case 'atencao': return '#f59e0b';
    case 'offline': return '#ef4444';
    default: return '#6b7280';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'online': return 'Online';
    case 'atencao': return 'Atenção';
    case 'offline': return 'Offline';
    default: return 'Desconhecido';
  }
};

const getMetricaColor = (valor, tipo) => {
  switch (tipo) {
    case 'latencia':
      if (valor >= 1 && valor <= 20) return '#10b981'; // Verde
      if (valor >= 21 && valor <= 30) return '#f59e0b'; // Laranja
      if (valor >= 31) return '#ef4444'; // Vermelho
      return '#6b7280'; // Cinza para valores inválidos ou 0
    default: return '#6b7280';
  }
};

function MonitoramentoSimplificado() {
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [dadosMonitoramento, setDadosMonitoramento] = useState({});
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [executandoPing, setExecutandoPing] = useState(false); // Indica se o ping está sendo executado

  // Carregar equipamentos da API apenas uma vez na inicialização
  useEffect(() => {
    const loadEquipamentos = async () => {
      try {
        setLoading(true);
        const data = await api.getEquipamentos();
        // Garantir que equipamentos seja sempre um array
        const equipamentosArray = Array.isArray(data) ? data : (data?.data || []);
        setEquipamentos(equipamentosArray);
        console.log('📊 Monitoramento: Equipamentos carregados uma vez na inicialização:', equipamentosArray.length);
      } catch (err) {
        console.error('❌ Monitoramento: Erro ao carregar equipamentos:', err);
        setError(err.message);
        setEquipamentos([]); // Garantir que seja um array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };

    loadEquipamentos();
  }, []); // Executar apenas uma vez na montagem do componente

  // Buscar dados de monitoramento apenas uma vez na inicialização
  // Dados de monitoramento são atualizados pelo backend, não precisamos buscar repetidamente
  useEffect(() => {
    if (!Array.isArray(equipamentos) || equipamentos.length === 0) return;
    
    // Função para buscar dados de monitoramento (apenas uma vez)
    const buscarDadosMonitoramento = async () => {
      try {
        setExecutandoPing(true);
        const response = await api.getDadosMonitoramento();
        if (response.success && response.data && response.data.dados) {
          // Converter dados para o formato esperado pelo componente
          const novosDados = {};
          Object.keys(response.data.dados).forEach(equipamentoId => {
            const dados = response.data.dados[equipamentoId];
            novosDados[equipamentoId] = {
              latencia: dados.latencia || 0,
              online: dados.online || false,
              ultimoPing: dados.ultimoPing || new Date().toISOString(),
              erro: dados.erro || null
            };
          });
          
          setDadosMonitoramento(prev => ({ ...prev, ...novosDados }));
          console.log('📊 Monitoramento: Dados de monitoramento carregados uma vez');
        }
      } catch (error) {
        console.error('Erro ao buscar dados de monitoramento:', error);
      } finally {
        setExecutandoPing(false);
      }
    };
    
    // Buscar apenas uma vez na inicialização
    buscarDadosMonitoramento();
    
    // Removido: polling automático - dados serão atualizados apenas quando necessário
    // Os dados serão atualizados apenas quando o usuário clicar em "Atualizar" ou quando houver alterações
  }, [equipamentos.length]); // Executar apenas quando equipamentos forem carregados

  const equipamentosFiltrados = Array.isArray(equipamentos) ? equipamentos.filter(equipamento => {
    const statusReal = dadosMonitoramento[equipamento.id] 
      ? (dadosMonitoramento[equipamento.id].online ? 
          (dadosMonitoramento[equipamento.id].latencia > 0 && dadosMonitoramento[equipamento.id].latencia < 50 ? 'online' : 'atencao') 
          : 'offline')
      : (equipamento.status?.toLowerCase() || 'offline');
    const matchesStatus = filtroStatus === 'todos' || statusReal === filtroStatus;
    const matchesTipo = filtroTipo === 'todos' || (equipamento.tipo && equipamento.tipo.toLowerCase() === filtroTipo.toLowerCase());
    const matchesSearch = searchTerm === '' || 
      equipamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipamento.ipPrivado.includes(searchTerm) ||
      (equipamento.localidade && equipamento.localidade.endereco && equipamento.localidade.endereco.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesTipo && matchesSearch;
  }) : [];

  // Obter tipos únicos de equipamentos para os filtros (usar campo tipo, não modelo)
  const tiposEquipamentos = Array.isArray(equipamentos) 
    ? [...new Set(equipamentos.filter(eq => eq.tipo).map(eq => eq.tipo))].sort() 
    : [];

  const handleEquipamentoClick = (equipamento) => {
    setEquipamentoSelecionado(equipamento);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEquipamentoSelecionado(null);
  };

  const getDadosAtuais = (equipamento) => {
    const dados = dadosMonitoramento[equipamento.id];
    if (dados) {
      return dados;
    }
    // Se não houver dados ainda, retornar valores padrão
    return {
      latencia: 0,
      online: false,
      ultimoPing: null,
      erro: 'Aguardando primeiro ping...'
    };
  };

  // Determinar status do equipamento baseado no ping
  const getStatusEquipamento = (equipamento) => {
    const dados = getDadosAtuais(equipamento);
    
    // Se temos dados de ping, usar eles para determinar o status
    if (dados.ultimoPing) {
      if (dados.online) {
        // Online, mas verificar latência para determinar se está OK ou com atenção
        if (dados.latencia > 0) {
          if (dados.latencia < 50) {
            return 'online';
          } else if (dados.latencia < 100) {
            return 'atencao';
          } else {
            return 'atencao'; // Latência alta
          }
        }
        return 'online';
      } else {
        return 'offline';
      }
    }
    
    // Se não há dados de ping ainda, usar o status do cadastro
    return equipamento.status?.toLowerCase() || 'offline';
  };

  // Estados de loading e error
  if (loading) {
    return React.createElement(Layout, { activeTab: 'monitoramento' },
      React.createElement('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: 'white'
        }
      }, 'Carregando equipamentos...')
    );
  }

  if (error) {
    return React.createElement(Layout, { activeTab: 'monitoramento' },
      React.createElement('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: '#ef4444'
        }
      }, `Erro ao carregar equipamentos: ${error}`)
    );
  }

  return React.createElement(Layout, { activeTab: 'monitoramento' },
    // Título e estatísticas
    React.createElement('div', {
      style: {
        marginBottom: '24px'
      }
    },
      React.createElement('h1', {
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '8px'
        }
      }, 'Monitoramento de Equipamentos'),
      React.createElement('p', {
        style: {
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }, `${equipamentosFiltrados.length} equipamentos monitorados`)
    ),
    
    // Filtros
    React.createElement('div', { 
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '24px'
      }
    },
      // Filtros de Status
      React.createElement('div', { 
        style: {
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }
      },
        React.createElement('span', { 
          style: {
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '500',
            marginRight: '8px'
          }
        }, 'Status:'),
        ['todos', 'online', 'atencao', 'offline'].map(status => 
          React.createElement('button', {
            key: status,
            onClick: () => setFiltroStatus(status),
            style: {
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: filtroStatus === status ? 
                (status === 'todos' ? 'rgba(125, 38, 217, 0.1)' :
                 status === 'online' ? 'rgba(16, 185, 129, 0.1)' :
                 status === 'atencao' ? 'rgba(245, 158, 11, 0.1)' :
                 'rgba(239, 68, 68, 0.1)') : 'transparent',
              color: filtroStatus === status ? 
                (status === 'todos' ? '#7d26d9' :
                 status === 'online' ? '#10b981' :
                 status === 'atencao' ? '#f59e0b' :
                 '#ef4444') : 'rgba(255, 255, 255, 0.7)',
              fontSize: '11px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'capitalize'
            }
          }, status === 'todos' ? 'Todos' : 
             status === 'online' ? 'Online' :
             status === 'atencao' ? 'Atenção' : 'Offline')
        )
      ),
      
      // Filtros de Tipo
      React.createElement('div', { 
        style: {
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }
      },
        React.createElement('span', { 
          style: {
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '500',
            marginRight: '8px'
          }
        }, 'Tipo:'),
        ['todos', ...tiposEquipamentos].map(tipo => 
          React.createElement('button', {
            key: tipo,
            onClick: () => setFiltroTipo(tipo),
            style: {
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: filtroTipo === tipo ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              color: filtroTipo === tipo ? '#3b82f6' : 'rgba(255, 255, 255, 0.7)',
              fontSize: '11px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'capitalize'
            }
          }, tipo === 'todos' ? 'Todos' : tipo)
        )
      )
    ),
    
    // Campo de pesquisa
    React.createElement('div', { 
      style: {
        marginBottom: '24px'
      }
    },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Pesquisar equipamentos...',
        value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value),
        style: {
          width: '100%',
          maxWidth: '400px',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          fontSize: '14px',
          backdropFilter: 'blur(10px)'
        }
      })
    ),

    // Grid de equipamentos
    React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px'
      }
    },
      equipamentosFiltrados.map(equipamento => {
        const dadosAtuais = getDadosAtuais(equipamento);
        
        return React.createElement('div', {
          key: equipamento.id,
          onClick: () => handleEquipamentoClick(equipamento),
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            padding: '12px',
            cursor: 'pointer',
            border: '1px solid rgba(125, 38, 217, 0.1)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minHeight: '60px'
          }
        },
          // Lado esquerdo - Nome e IP
          React.createElement('div', {
            style: {
              flex: 1,
              minWidth: 0
            }
          },
            React.createElement('h3', {
              style: {
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#404040',
                marginBottom: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }
            }, equipamento.nome),
            React.createElement('p', {
              style: {
                fontSize: '10px',
                color: '#737373',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }
            }, equipamento.ipPrivado)
          ),

          // Lado direito - Latência (Ping)
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }
          },
            // Latência (Ping)
            React.createElement('div', {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '6px 10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                minWidth: '60px'
              }
            },
              React.createElement('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }
              },
                React.createElement('div', {
                  style: {
                    width: '8px',
                    height: '8px',
                    backgroundColor: dadosAtuais.latencia > 0 ? getMetricaColor(dadosAtuais.latencia, 'latencia') : '#6b7280',
                    borderRadius: '50%'
                  }
                }),
                React.createElement('span', {
                  style: {
                    fontSize: '12px',
                    fontWeight: '700',
                    color: dadosAtuais.latencia > 0 ? getMetricaColor(dadosAtuais.latencia, 'latencia') : '#6b7280',
                    fontFamily: 'monospace'
                  }
                }, dadosAtuais.latencia > 0 ? `${dadosAtuais.latencia}ms` : dadosAtuais.erro ? '--' : '...')
              ),
              React.createElement('span', {
                style: {
                  fontSize: '8px',
                  color: '#737373',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }
              }, 'Ping')
            )
          )
        );
      })
    ),

    // Modal de detalhes
    modalVisible && equipamentoSelecionado && React.createElement(ModalDetalhesMonitoramento, {
      equipamento: equipamentoSelecionado,
      dadosMonitoramento: dadosMonitoramento,
      onClose: closeModal
    }),

    // Botão de atualizar manual no canto inferior direito
    React.createElement('div', {
      style: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }
    },
      React.createElement('button', {
        onClick: async () => {
          try {
            setExecutandoPing(true);
            const response = await api.getDadosMonitoramento();
            if (response.success && response.data && response.data.dados) {
              const novosDados = {};
              Object.keys(response.data.dados).forEach(equipamentoId => {
                const dados = response.data.dados[equipamentoId];
                novosDados[equipamentoId] = {
                  latencia: dados.latencia || 0,
                  online: dados.online || false,
                  ultimoPing: dados.ultimoPing || new Date().toISOString(),
                  erro: dados.erro || null
                };
              });
              setDadosMonitoramento(prev => ({ ...prev, ...novosDados }));
            }
          } catch (error) {
            console.error('Erro ao atualizar dados de monitoramento:', error);
          } finally {
            setExecutandoPing(false);
          }
        },
        disabled: executandoPing,
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          color: executandoPing ? '#f59e0b' : 'rgba(255, 255, 255, 0.9)',
          fontSize: '14px',
          fontWeight: '500',
          cursor: executandoPing ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s'
        }
      },
        executandoPing && React.createElement('div', {
          style: {
            width: '8px',
            height: '8px',
            backgroundColor: '#f59e0b',
            borderRadius: '50%',
            animation: 'pulse 1.5s ease-in-out infinite'
          }
        }),
        executandoPing ? 'Atualizando...' : 'Atualizar Dados'
      )
    ),

    // Estilos de animação
    React.createElement('style', null, `
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.5;
          transform: scale(1.2);
        }
      }
    `)
  );
}

export default MonitoramentoSimplificado;