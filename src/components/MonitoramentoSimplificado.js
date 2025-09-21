import React, { useState, useEffect } from 'react';
import Layout from './shared/Layout';
import ModalDetalhesEquipamento from './ModalDetalhesEquipamento';
import { equipamentosCompletos, getStatusColor, getStatusText, getMetricaColor } from '../data/mockData';

function MonitoramentoSimplificado() {
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [dadosMonitoramento, setDadosMonitoramento] = useState({});

  // Simular atualização periódica dos dados
  useEffect(() => {
    const interval = setInterval(() => {
      setDadosMonitoramento(prev => {
        const novosDados = {};
        equipamentosCompletos.forEach(equipamento => {
          if (equipamento.status !== 'offline') {
            novosDados[equipamento.id] = {
              latencia: Math.floor(Math.random() * 30) + 5,
              cpu: Math.floor(Math.random() * 40) + 10,
              memoria: Math.floor(Math.random() * 50) + 20,
              temperatura: Math.floor(Math.random() * 20) + 40,
              ultimoPing: new Date().toISOString()
            };
          }
        });
        return { ...prev, ...novosDados };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const equipamentosFiltrados = equipamentosCompletos.filter(equipamento => {
    const matchesStatus = filtroStatus === 'todos' || equipamento.status === filtroStatus;
    const matchesTipo = filtroTipo === 'todos' || equipamento.tipo.toLowerCase() === filtroTipo.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      equipamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipamento.ipPrivado.includes(searchTerm) ||
      equipamento.localidade.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesTipo && matchesSearch;
  });

  // Obter tipos únicos de equipamentos para os filtros
  const tiposEquipamentos = [...new Set(equipamentosCompletos.map(eq => eq.tipo))].sort();

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
    return dados || {
      latencia: equipamento.latencia || 0,
      cpu: equipamento.cpu || 0,
      memoria: equipamento.memoria || 0,
      temperatura: equipamento.temperatura || 0,
      ultimoPing: equipamento.ultimoPing
    };
  };

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
        gridTemplateColumns: 'repeat(2, 1fr)',
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

          // Lado direito - Métricas e Status
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }
          },
            // Métricas (apenas se online)
            equipamento.status !== 'offline' && React.createElement('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }
            },
              // Latência (Ping)
              React.createElement('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '4px 6px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  minWidth: '50px'
                }
              },
                React.createElement('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }
                },
                  React.createElement('div', {
                    width: '6px',
                    height: '6px',
                    backgroundColor: getMetricaColor(dadosAtuais.latencia, 'latencia'),
                    borderRadius: '50%'
                  }),
                  React.createElement('span', {
                    style: {
                      fontSize: '9px',
                      fontWeight: '600',
                      color: getMetricaColor(dadosAtuais.latencia, 'latencia')
                    }
                  }, `${dadosAtuais.latencia}ms`)
                ),
                React.createElement('span', {
                  style: {
                    fontSize: '7px',
                    color: '#737373',
                    fontWeight: '500'
                  }
                }, 'Ping')
              ),

              // CPU
              React.createElement('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '4px 6px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  minWidth: '40px'
                }
              },
                React.createElement('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }
                },
                  React.createElement('div', {
                    width: '6px',
                    height: '6px',
                    backgroundColor: getMetricaColor(dadosAtuais.cpu, 'cpu'),
                    borderRadius: '50%'
                  }),
                  React.createElement('span', {
                    style: {
                      fontSize: '9px',
                      fontWeight: '600',
                      color: getMetricaColor(dadosAtuais.cpu, 'cpu')
                    }
                  }, `${dadosAtuais.cpu}%`)
                ),
                React.createElement('span', {
                  style: {
                    fontSize: '7px',
                    color: '#737373',
                    fontWeight: '500'
                  }
                }, 'CPU')
              ),

              // Memória (RAM)
              React.createElement('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '4px 6px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  minWidth: '40px'
                }
              },
                React.createElement('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }
                },
                  React.createElement('div', {
                    width: '6px',
                    height: '6px',
                    backgroundColor: getMetricaColor(dadosAtuais.memoria, 'memoria'),
                    borderRadius: '50%'
                  }),
                  React.createElement('span', {
                    style: {
                      fontSize: '9px',
                      fontWeight: '600',
                      color: getMetricaColor(dadosAtuais.memoria, 'memoria')
                    }
                  }, `${dadosAtuais.memoria}%`)
                ),
                React.createElement('span', {
                  style: {
                    fontSize: '7px',
                    color: '#737373',
                    fontWeight: '500'
                  }
                }, 'RAM')
              ),

              // Temperatura (Temp)
              React.createElement('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '4px 6px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  minWidth: '45px'
                }
              },
                React.createElement('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }
                },
                  React.createElement('div', {
                    width: '6px',
                    height: '6px',
                    backgroundColor: getMetricaColor(dadosAtuais.temperatura, 'temperatura'),
                    borderRadius: '50%'
                  }),
                  React.createElement('span', {
                    style: {
                      fontSize: '9px',
                      fontWeight: '600',
                      color: getMetricaColor(dadosAtuais.temperatura, 'temperatura')
                    }
                  }, `${dadosAtuais.temperatura}°C`)
                ),
                React.createElement('span', {
                  style: {
                    fontSize: '7px',
                    color: '#737373',
                    fontWeight: '500'
                  }
                }, 'Temp')
              )
            ),

            // Status
            React.createElement('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: `${getStatusColor(equipamento.status)}20`,
                borderRadius: '6px',
                border: `1px solid ${getStatusColor(equipamento.status)}40`,
                minWidth: '60px',
                justifyContent: 'center'
              }
            },
              React.createElement('div', {
                width: '6px',
                height: '6px',
                backgroundColor: getStatusColor(equipamento.status),
                borderRadius: '50%'
              }),
              React.createElement('span', {
                style: {
                  fontSize: '9px',
                  fontWeight: '500',
                  color: getStatusColor(equipamento.status)
                }
              }, getStatusText(equipamento.status))
            )
          )
        );
      })
    ),

    // Modal de detalhes
    modalVisible && equipamentoSelecionado && React.createElement(ModalDetalhesEquipamento, {
      equipamento: equipamentoSelecionado,
      onClose: closeModal
    })
  );
}

export default MonitoramentoSimplificado;