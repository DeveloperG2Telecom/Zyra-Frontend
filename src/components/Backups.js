import React, { useState, useEffect } from 'react';
import Layout from './shared/Layout';
import { useLoading } from '../contexts/LoadingContext';
import { useCache } from '../contexts/CacheContext';
import api from '../services/api';

function Backups() {
  const { showLoading, hideLoading } = useLoading();
  const { loadEquipamentos } = useCache();
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalBackupVisible, setModalBackupVisible] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [equipamentos, setEquipamentos] = useState([]);
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState('');
  const [notificacao, setNotificacao] = useState({ visible: false, message: '', type: 'success' });
  const [formBackup, setFormBackup] = useState({
    id: null,
    equipamentoId: '',
    dataBackup: '',
    observacoes: '',
    isEdit: false
  });

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const [equipamentosData, backupsData] = await Promise.all([
          loadEquipamentos(),
          carregarBackups()
        ]);
        setEquipamentos(equipamentosData || []);
        setBackups(backupsData || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [loadEquipamentos]);

  // Carregar backups da API
  const carregarBackups = async () => {
    try {
      const response = await api.getBackups();
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Erro ao carregar backups:', error);
      return [];
    }
  };

  // Calcular status do backup baseado na data
  const calcularStatusBackup = (ultimoBackup) => {
    if (!ultimoBackup) return { status: 'critico', diasSemBackup: 999 };
    
    const hoje = new Date();
    const dataBackup = new Date(ultimoBackup);
    const diasSemBackup = Math.floor((hoje - dataBackup) / (1000 * 60 * 60 * 24));
    
    if (diasSemBackup <= 7) return { status: 'em-dia', diasSemBackup };
    if (diasSemBackup <= 30) return { status: 'atrasado', diasSemBackup };
    return { status: 'critico', diasSemBackup };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'em-dia': return '#10b981';
      case 'atrasado': return '#f59e0b';
      case 'critico': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'em-dia': return 'Em Dia';
      case 'atrasado': return 'Atrasado';
      case 'critico': return 'Crítico';
      default: return 'Desconhecido';
    }
  };

  // Combinar equipamentos com dados de backup
  const equipamentosComBackup = equipamentos.map(equipamento => {
    const equipamentoBackups = backups.filter(backup => backup.equipamentoId === equipamento.id);
    const ultimoBackup = equipamentoBackups.length > 0 
      ? equipamentoBackups.sort((a, b) => new Date(b.dataBackup) - new Date(a.dataBackup))[0]
      : null;
    
    const statusInfo = calcularStatusBackup(ultimoBackup?.dataBackup);
    
    return {
      ...equipamento,
      ultimoBackup: ultimoBackup?.dataBackup || null,
      statusBackup: statusInfo.status,
      diasSemBackup: statusInfo.diasSemBackup,
      totalBackups: equipamentoBackups.length
    };
  });

  const equipamentosFiltrados = equipamentosComBackup.filter(equipamento => {
    // Filtro por status
    const statusMatch = filtroStatus === 'todos' || equipamento.statusBackup === filtroStatus;
    
    // Filtro por pesquisa
    const pesquisaMatch = !pesquisa || 
      equipamento.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      equipamento.ipPrivado.toLowerCase().includes(pesquisa.toLowerCase()) ||
      equipamento.localidade?.toLowerCase().includes(pesquisa.toLowerCase());
    
    return statusMatch && pesquisaMatch;
  });

  const handleEquipamentoClick = (equipamento) => {
    setEquipamentoSelecionado(equipamento);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEquipamentoSelecionado(null);
  };

  const executarBackup = async (equipamentoId) => {
    showLoading('Executando backup...');
    
    // Simular execução do backup
    setTimeout(() => {
      hideLoading();
      // Aqui seria a lógica real de backup
      console.log(`Backup executado para equipamento ${equipamentoId}`);
    }, 2000);
  };

  const abrirModalBackup = (equipamentoId, backupId = null) => {
    if (backupId) {
      // Editar backup existente
      const backup = backups.find(b => b.id === backupId);
      setFormBackup({
        id: backup.id,
        equipamentoId: backup.equipamentoId,
        dataBackup: backup.dataBackup,
        observacoes: backup.observacoes || '',
        isEdit: true
      });
    } else {
      // Novo backup
      setFormBackup({
        id: null,
        equipamentoId: equipamentoId || '',
        dataBackup: new Date().toLocaleDateString('en-CA'), // Formato YYYY-MM-DD
        observacoes: '',
        isEdit: false
      });
    }
    setModalBackupVisible(true);
  };

  const fecharModalBackup = () => {
    setModalBackupVisible(false);
    setFormBackup({
      id: null,
      equipamentoId: '',
      dataBackup: new Date().toLocaleDateString('en-CA'), // Sempre data de hoje
      observacoes: '',
      isEdit: false
    });
  };

  const handleInputChange = (field, value) => {
    setFormBackup(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função para mostrar notificação
  const mostrarNotificacao = (message, type = 'success') => {
    setNotificacao({ visible: true, message, type });
    setTimeout(() => {
      setNotificacao({ visible: false, message: '', type: 'success' });
    }, 3000);
  };

  // Função para recarregar dados
  const recarregarDados = async () => {
    try {
      const novosBackups = await carregarBackups();
      setBackups(novosBackups);
    } catch (error) {
      console.error('Erro ao recarregar dados:', error);
    }
  };

  const salvarBackup = async () => {
    if (!formBackup.equipamentoId || !formBackup.dataBackup) {
      mostrarNotificacao('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    showLoading(formBackup.isEdit ? 'Atualizando backup...' : 'Salvando backup...');
    
    try {
      let response;
      if (formBackup.isEdit) {
        // Editar backup existente
        response = await api.updateBackup(formBackup.id, formBackup);
      } else {
        // Criar novo backup
        response = await api.createBackup(formBackup);
      }
      
      if (response.success) {
        // Recarregar dados automaticamente
        await recarregarDados();
        
        hideLoading();
        fecharModalBackup();
        mostrarNotificacao(`Backup ${formBackup.isEdit ? 'atualizado' : 'criado'} com sucesso!`, 'success');
      } else {
        throw new Error(response.message || 'Erro na operação');
      }
    } catch (error) {
      hideLoading();
      console.error('Erro ao salvar backup:', error);
      mostrarNotificacao(`Erro ao ${formBackup.isEdit ? 'atualizar' : 'salvar'} backup. Tente novamente.`, 'error');
    }
  };

  const deletarBackup = async (backupId) => {
    if (!window.confirm('Tem certeza que deseja excluir este backup?')) {
      return;
    }

    showLoading('Excluindo backup...');
    
    try {
      const response = await api.deleteBackup(backupId);
      
      if (response.success) {
        // Recarregar dados automaticamente
        await recarregarDados();
        
        hideLoading();
        mostrarNotificacao('Backup excluído com sucesso!', 'success');
      } else {
        throw new Error(response.message || 'Erro ao excluir');
      }
    } catch (error) {
      hideLoading();
      console.error('Erro ao excluir backup:', error);
      mostrarNotificacao('Erro ao excluir backup. Tente novamente.', 'error');
    }
  };

  return React.createElement(Layout, { currentPage: '/backups' },
    // CSS para animação da notificação
    React.createElement('style', null, `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `),
    
    // Background Animado
    React.createElement('div', { 
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        overflow: 'hidden',
        zIndex: -1
      }
    },
      // Grid animado
      React.createElement('div', { 
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(125, 38, 217, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125, 38, 217, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }
      })
    ),
    
    // Navbar fixa superior
    React.createElement('div', { 
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(125, 38, 217, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }
    },
      // Logo e título
      React.createElement('div', { 
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }
      },
        React.createElement('img', { 
          src: '/logo-sem-fundo.png', 
          alt: 'Zyra Logo', 
          style: {
            width: '32px',
            height: '32px',
            objectFit: 'contain'
          }
        }),
        React.createElement('div', null,
          React.createElement('h1', { 
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#7d26d9',
              margin: 0,
              lineHeight: 1
            }
          }, 'Zyra'),
          React.createElement('p', { 
            style: {
              fontSize: '9px',
              color: '#737373',
              fontWeight: '500',
              margin: 0,
              lineHeight: 1
            }
          }, 'Sistema de Monitoramento')
        )
      ),
      
      // Menu de navegação horizontal
      React.createElement('nav', { 
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }
      },
        React.createElement('button', {
          onClick: () => window.location.href = '/home',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#404040',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('rect', { x: '3', y: '3', width: '7', height: '7' }),
            React.createElement('rect', { x: '14', y: '3', width: '7', height: '7' }),
            React.createElement('rect', { x: '14', y: '14', width: '7', height: '7' }),
            React.createElement('rect', { x: '3', y: '14', width: '7', height: '7' })
          ),
          'Dashboard'
        ),
        React.createElement('button', {
          onClick: () => window.location.href = '/equipamentos',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#404040',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2', ry: '2' }),
            React.createElement('line', { x1: '8', y1: '21', x2: '16', y2: '21' }),
            React.createElement('line', { x1: '12', y1: '17', x2: '12', y2: '21' })
          ),
          'Equipamentos'
        ),
        React.createElement('button', {
          onClick: () => window.location.href = '/topologia',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#404040',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
            React.createElement('line', { x1: '2', y1: '12', x2: '22', y2: '12' }),
            React.createElement('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
          ),
          'Topologia'
        ),
        React.createElement('button', {
          onClick: () => window.location.href = '/teste-conexao',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#404040',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('path', { d: 'M9 12l2 2 4-4' }),
            React.createElement('path', { d: 'M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3' }),
            React.createElement('path', { d: 'M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3' }),
            React.createElement('path', { d: 'M13 12h3a2 2 0 0 1 2 2v1' }),
            React.createElement('path', { d: 'M13 12h-3a2 2 0 0 0-2 2v1' })
          ),
          'Teste Conexão'
        ),
        React.createElement('button', {
          onClick: () => window.location.href = '/alertas',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#404040',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('path', { d: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' }),
            React.createElement('path', { d: 'M13.73 21a2 2 0 0 1-3.46 0' })
          ),
          'Alertas'
        ),
        React.createElement('button', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'rgba(125, 38, 217, 0.1)',
            color: '#7d26d9',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('path', { d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' }),
            React.createElement('polyline', { points: '3.27,6.96 12,12.01 20.73,6.96' }),
            React.createElement('line', { x1: '12', y1: '22.08', x2: '12', y2: '12' })
          ),
          'Backups'
        )
      ),
      
      // Status e logout
      React.createElement('div', { 
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }
      },
        React.createElement('div', { 
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '16px',
            color: '#10b981',
            fontSize: '11px',
            fontWeight: '500'
          }
        },
          React.createElement('svg', {
            width: '8',
            height: '8',
            viewBox: '0 0 24 24',
            fill: 'currentColor'
          },
            React.createElement('circle', { cx: '12', cy: '12', r: '10' })
          ),
          'Online'
        ),
        React.createElement('button', {
          onClick: () => window.location.href = '/login',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'rgba(251, 143, 55, 0.1)',
            color: '#fb8f37',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
            React.createElement('polyline', { points: '16,17 21,12 16,7' }),
            React.createElement('line', { x1: '21', y1: '12', x2: '9', y2: '12' })
          ),
          'Sair'
        )
      )
    ),
    
    // Layout principal
    React.createElement('div', { 
      style: {
        paddingTop: '60px',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 10
      }
    },
      // Conteúdo principal
      React.createElement('div', { 
        style: {
          padding: '24px',
          minHeight: 'calc(100vh - 60px)',
          overflow: 'auto'
        }
      },
        // Header
        React.createElement('div', { 
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }
        },
          React.createElement('div', null,
            React.createElement('h2', { 
              style: {
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '4px'
              }
            }, 'Gestão de Backups'),
            React.createElement('p', { 
              style: {
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }, `${equipamentosFiltrados.length} equipamentos encontrados`)
          ),
          
          // Filtros e botão de backup manual
          React.createElement('div', { 
            style: {
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }
          },
            React.createElement('button', {
              onClick: () => abrirModalBackup(null),
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(125, 38, 217, 0.1)',
                color: '#7d26d9',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }
            },
              React.createElement('svg', {
                width: '12',
                height: '12',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              },
                React.createElement('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
                React.createElement('polyline', { points: '14,2 14,8 20,8' }),
                React.createElement('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
                React.createElement('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
                React.createElement('polyline', { points: '10,9 9,9 8,9' })
              ),
              'Registrar Backup Manual'
            ),
            React.createElement('button', {
              onClick: () => setFiltroStatus('todos'),
              style: {
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: filtroStatus === 'todos' ? 'rgba(125, 38, 217, 0.1)' : 'transparent',
                color: filtroStatus === 'todos' ? '#7d26d9' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }
            }, 'Todos'),
            React.createElement('button', {
              onClick: () => setFiltroStatus('em-dia'),
              style: {
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: filtroStatus === 'em-dia' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                color: filtroStatus === 'em-dia' ? '#10b981' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }
            }, 'Em Dia'),
            React.createElement('button', {
              onClick: () => setFiltroStatus('atrasado'),
              style: {
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: filtroStatus === 'atrasado' ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                color: filtroStatus === 'atrasado' ? '#f59e0b' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }
            }, 'Atrasado'),
            React.createElement('button', {
              onClick: () => setFiltroStatus('critico'),
              style: {
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: filtroStatus === 'critico' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                color: filtroStatus === 'critico' ? '#ef4444' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }
            }, 'Crítico')
          )
        ),
        
        // Campo de pesquisa
        React.createElement('div', { 
          style: {
            marginBottom: '20px'
          }
        },
          React.createElement('div', { 
            style: {
              position: 'relative',
              maxWidth: '400px'
            }
          },
            React.createElement('input', {
              type: 'text',
              value: pesquisa,
              onChange: (e) => setPesquisa(e.target.value),
              placeholder: 'Pesquisar equipamentos...',
              style: {
                width: '100%',
                padding: '12px 16px 12px 40px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid rgba(125, 38, 217, 0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                outline: 'none',
                transition: 'all 0.2s',
                color: '#404040'
              }
            }),
            React.createElement('div', { 
              style: {
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#737373',
                fontSize: '16px'
              }
            }, '🔍')
          )
        ),
        
        // Lista de equipamentos
        loading ? React.createElement('div', { 
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px'
          }
        }, 'Carregando equipamentos...') : React.createElement('div', { 
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '12px'
          }
        },
          equipamentosFiltrados.map(equipamento =>
            React.createElement('div', {
              key: equipamento.id,
              onClick: () => handleEquipamentoClick(equipamento),
              style: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                padding: '10px',
                cursor: 'pointer',
                border: '1px solid rgba(125, 38, 217, 0.1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s'
              }
            },
              // Header do card
              React.createElement('div', { 
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }
              },
                React.createElement('div', { 
                  style: {
                    flex: 1
                  }
                },
                  React.createElement('h3', { 
                    style: {
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#404040',
                      marginBottom: '3px',
                      lineHeight: '1.2'
                    }
                  }, equipamento.nome),
                  React.createElement('p', { 
                    style: {
                      fontSize: '9px',
                      color: '#737373',
                      margin: 0,
                      lineHeight: '1.2'
                    }
                  }, `${equipamento.ipPrivado} • ${equipamento.localidade}`)
                ),
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 6px',
                    backgroundColor: `${getStatusColor(equipamento.statusBackup)}20`,
                    borderRadius: '4px',
                    border: `1px solid ${getStatusColor(equipamento.statusBackup)}40`
                  }
                },
                  React.createElement('div', { 
                    style: {
                      width: '4px',
                      height: '4px',
                      backgroundColor: getStatusColor(equipamento.statusBackup),
                      borderRadius: '50%'
                    }
                  }),
                  React.createElement('span', { 
                    style: {
                      fontSize: '8px',
                      fontWeight: '500',
                      color: getStatusColor(equipamento.statusBackup)
                    }
                  }, getStatusText(equipamento.statusBackup))
                )
              ),
              
              // Informações do backup
              React.createElement('div', { 
                style: {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  marginBottom: '8px'
                }
              },
                React.createElement('div', null,
                  React.createElement('span', { 
                    style: {
                      fontSize: '8px',
                      color: '#737373',
                      display: 'block',
                      marginBottom: '1px'
                    }
                  }, 'Último Backup'),
                  React.createElement('span', { 
                    style: {
                      fontSize: '10px',
                      fontWeight: '500',
                      color: '#404040'
                    }
                  }, new Date(equipamento.ultimoBackup).toLocaleDateString('pt-BR'))
                ),
                React.createElement('div', null,
                  React.createElement('span', { 
                    style: {
                      fontSize: '8px',
                      color: '#737373',
                      display: 'block',
                      marginBottom: '1px'
                    }
                  }, 'Total de Backups'),
                  React.createElement('span', { 
                    style: {
                      fontSize: '10px',
                      fontWeight: '500',
                      color: '#404040'
                    }
                  }, equipamento.totalBackups)
                )
              ),
              
              // Alerta de pendência
              equipamento.statusBackup !== 'em-dia' && React.createElement('div', { 
                style: {
                  backgroundColor: equipamento.statusBackup === 'critico' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  border: `1px solid ${equipamento.statusBackup === 'critico' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  borderRadius: '4px',
                  padding: '6px',
                  marginBottom: '8px'
                }
              },
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }
                },
                  React.createElement('svg', {
                    width: '10',
                    height: '10',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: equipamento.statusBackup === 'critico' ? '#ef4444' : '#f59e0b',
                    strokeWidth: '2',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round'
                  },
                    React.createElement('path', { d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' }),
                    React.createElement('line', { x1: '12', y1: '9', x2: '12', y2: '13' }),
                    React.createElement('line', { x1: '12', y1: '17', x2: '12.01', y2: '17' })
                  ),
                  React.createElement('span', { 
                    style: {
                      fontSize: '8px',
                      fontWeight: '500',
                      color: equipamento.statusBackup === 'critico' ? '#ef4444' : '#f59e0b'
                    }
                  }, `${equipamento.diasSemBackup} dias sem backup`)
                )
              ),
              
              // Footer
              React.createElement('div', { 
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(125, 38, 217, 0.1)'
                }
              },
                React.createElement('span', { 
                  style: {
                    fontSize: '8px',
                    color: '#737373'
                  }
                }, `${equipamento.totalBackups} backups`),
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    gap: '6px'
                  }
                },
                React.createElement('button', {
                  onClick: (e) => {
                    e.stopPropagation();
                    executarBackup(equipamento.id);
                  },
                  style: {
                    padding: '3px 6px',
                    borderRadius: '3px',
                    border: 'none',
                    background: 'rgba(125, 38, 217, 0.1)',
                    color: '#7d26d9',
                    fontSize: '8px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }
                  }, 'Executar'),
                  React.createElement('button', {
                    onClick: (e) => {
                      e.stopPropagation();
                      abrirModalBackup(equipamento.id);
                    },
                    style: {
                      padding: '3px 6px',
                      borderRadius: '3px',
                      border: 'none',
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981',
                      fontSize: '8px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }
                  }, 'Registrar')
                )
              )
            )
          )
        )
      )
    ),
    
    // Modal de detalhes
    modalVisible && equipamentoSelecionado && React.createElement('div', { 
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      },
      onClick: closeModal
    },
      React.createElement('div', { 
        style: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        },
        onClick: (e) => e.stopPropagation()
      },
        // Header do modal
        React.createElement('div', { 
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e5e5e5'
          }
        },
          React.createElement('div', null,
            React.createElement('h3', { 
              style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#404040',
                marginBottom: '4px'
              }
            }, equipamentoSelecionado.nome),
            React.createElement('p', { 
              style: {
                fontSize: '12px',
                color: '#737373',
                margin: 0
              }
            }, `${equipamentoSelecionado.ipPrivado} • ${equipamentoSelecionado.localidade}`)
          ),
          React.createElement('button', {
            onClick: closeModal,
            style: {
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: '#737373',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }
          }, '×')
        ),
        
        // Histórico de backups
        React.createElement('div', null,
          React.createElement('div', { 
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }
          },
          React.createElement('h4', { 
            style: {
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#404040',
                margin: 0
            }
          }, 'Histórico de Backups'),
            React.createElement('button', {
              onClick: () => abrirModalBackup(equipamentoSelecionado.id),
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }
            },
              React.createElement('svg', {
                width: '12',
                height: '12',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              },
                React.createElement('path', { d: 'M12 5v14' }),
                React.createElement('path', { d: 'M5 12h14' })
              ),
              'Novo Backup'
            )
          ),
          React.createElement('div', { 
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: '300px',
              overflowY: 'auto'
            }
          },
            backups.filter(backup => backup.equipamentoId === equipamentoSelecionado.id)
              .sort((a, b) => new Date(b.dataBackup) - new Date(a.dataBackup))
              .map((backup, index) =>
              React.createElement('div', {
                key: backup.id,
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }
              },
                React.createElement('div', { 
                  style: {
                    flex: 1
                  }
                },
                  React.createElement('div', { 
                    style: {
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#404040',
                      marginBottom: '2px'
                    }
                  }, new Date(backup.dataBackup).toLocaleDateString('pt-BR')),
                  backup.observacoes && React.createElement('div', { 
                    style: {
                      fontSize: '10px',
                      color: '#737373',
                      fontStyle: 'italic',
                      marginTop: '2px'
                    }
                  }, backup.observacoes)
                ),
                  React.createElement('div', { 
                    style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }
                },
                  React.createElement('button', {
                    onClick: () => abrirModalBackup(null, backup.id),
                    style: {
                      padding: '4px 8px',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      color: '#3b82f6',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '4px',
                      fontSize: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }
                  }, 'Editar'),
                  React.createElement('button', {
                    onClick: () => deletarBackup(backup.id),
                    style: {
                      padding: '4px 8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '4px',
                      fontSize: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }
                  }, 'Excluir')
                )
              )
            )
          )
        )
      )
    ),
    
    // Modal de Backup Manual
    modalBackupVisible && React.createElement('div', { 
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      },
      onClick: fecharModalBackup
                },
                React.createElement('div', { 
                  style: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '500px',
          width: '100%',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        },
        onClick: (e) => e.stopPropagation()
      },
        // Header do modal
        React.createElement('div', { 
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e5e5e5'
                  }
                },
                  React.createElement('div', { 
                    style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }
          },
            React.createElement('div', {
              style: {
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }
            }, '📝'),
            React.createElement('div', null,
              React.createElement('h3', { 
                style: {
                  fontSize: '18px',
                  fontWeight: 'bold',
                      color: '#404040',
                      marginBottom: '2px'
                    }
              }, formBackup.isEdit ? 'Editar Backup' : 'Registrar Backup Manual'),
              React.createElement('p', { 
                    style: {
                  fontSize: '12px',
                  color: '#737373',
                  margin: 0
                }
              }, formBackup.isEdit ? 'Edite os dados do backup' : 'Insira os dados do backup realizado')
            )
          ),
          React.createElement('button', {
            onClick: fecharModalBackup,
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(115, 115, 115, 0.1)',
              border: '1px solid rgba(115, 115, 115, 0.2)',
              borderRadius: '6px',
              color: '#737373',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '16px',
              fontWeight: 'bold'
            }
          }, '×')
        ),
        
        // Formulário
        React.createElement('form', { 
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }
        },
          // Seleção de equipamento
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Equipamento *'),
            React.createElement('select', {
              value: formBackup.equipamentoId,
              onChange: (e) => handleInputChange('equipamentoId', e.target.value),
              style: {
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'white'
              }
            },
              React.createElement('option', { value: '' }, 'Selecione o equipamento...'),
              equipamentos.map(equipamento => 
                React.createElement('option', { 
                  key: equipamento.id, 
                  value: equipamento.id 
                }, equipamento.nome)
              )
            )
          ),
          
          // Data do backup
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Data do Backup *'),
            React.createElement('input', {
              type: 'date',
              value: formBackup.dataBackup,
              onChange: (e) => handleInputChange('dataBackup', e.target.value),
              style: {
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }
            })
          ),
          
          
          // Observações
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Observações'),
            React.createElement('textarea', {
              value: formBackup.observacoes,
              onChange: (e) => handleInputChange('observacoes', e.target.value),
              placeholder: 'Observações sobre o backup (opcional)',
              rows: 3,
              style: {
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                resize: 'vertical'
              }
            })
          ),
          
          // Botões
          React.createElement('div', { 
            style: {
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e5e5'
            }
          },
            React.createElement('button', {
              type: 'button',
              onClick: fecharModalBackup,
              style: {
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: '#737373',
                border: '1px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }
            }, 'Cancelar'),
            React.createElement('button', {
              type: 'button',
              onClick: salvarBackup,
              style: {
                padding: '10px 20px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }
            }, formBackup.isEdit ? 'Atualizar Backup' : 'Salvar Backup')
          )
        )
      )
    ),
    
    // Notificação sutil no canto da tela
    notificacao.visible && React.createElement('div', { 
      style: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: notificacao.type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
        fontSize: '14px',
        fontWeight: '500',
        maxWidth: '300px',
        animation: 'slideInRight 0.3s ease-out'
      }
    },
      React.createElement('div', { 
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }
      },
        React.createElement('div', { 
          style: {
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }
        }, notificacao.type === 'success' ? '✓' : '⚠'),
        React.createElement('span', null, notificacao.message)
      )
    )
  );
}

export default Backups;
