import React, { useState } from 'react';
import Layout from './shared/Layout';
import { useLoading } from '../contexts/LoadingContext';

function Backups() {
  const { showLoading, hideLoading } = useLoading();
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Dados mock dos equipamentos com status de backup
  const equipamentos = [
    {
      id: 1,
      nome: 'Router Principal - Matriz',
      ipPrivado: '192.168.1.1',
      localidade: 'São Paulo - SP',
      ultimoBackup: '2024-01-15',
      statusBackup: 'em-dia', // em-dia, atrasado, critico
      diasSemBackup: 0,
      responsavelUltimoBackup: 'João Silva',
      totalBackups: 12
    },
    {
      id: 2,
      nome: 'Switch Core - Data Center',
      ipPrivado: '192.168.1.2',
      localidade: 'São Paulo - SP',
      ultimoBackup: '2024-01-10',
      statusBackup: 'atrasado',
      diasSemBackup: 5,
      responsavelUltimoBackup: 'Maria Santos',
      totalBackups: 8
    },
    {
      id: 3,
      nome: 'AP WiFi - Piso 1',
      ipPrivado: '192.168.1.10',
      localidade: 'São Paulo - SP',
      ultimoBackup: '2023-12-20',
      statusBackup: 'critico',
      diasSemBackup: 26,
      responsavelUltimoBackup: 'Pedro Costa',
      totalBackups: 5
    },
    {
      id: 4,
      nome: 'Router Filial - Rio',
      ipPrivado: '192.168.2.1',
      localidade: 'Rio de Janeiro - RJ',
      ultimoBackup: '2024-01-14',
      statusBackup: 'em-dia',
      diasSemBackup: 1,
      responsavelUltimoBackup: 'Ana Lima',
      totalBackups: 15
    },
    {
      id: 5,
      nome: 'Switch Edge - Filial BH',
      ipPrivado: '192.168.3.1',
      localidade: 'Belo Horizonte - MG',
      ultimoBackup: '2023-11-30',
      statusBackup: 'critico',
      diasSemBackup: 46,
      responsavelUltimoBackup: 'Carlos Oliveira',
      totalBackups: 3
    }
  ];

  // Histórico de backups mock
  const historicoBackups = {
    1: [
      { data: '2024-01-15', responsavel: 'João Silva', tamanho: '2.3 MB', status: 'sucesso' },
      { data: '2024-01-08', responsavel: 'João Silva', tamanho: '2.1 MB', status: 'sucesso' },
      { data: '2024-01-01', responsavel: 'Maria Santos', tamanho: '2.0 MB', status: 'sucesso' }
    ],
    2: [
      { data: '2024-01-10', responsavel: 'Maria Santos', tamanho: '1.8 MB', status: 'sucesso' },
      { data: '2024-01-03', responsavel: 'Pedro Costa', tamanho: '1.7 MB', status: 'sucesso' },
      { data: '2023-12-27', responsavel: 'Maria Santos', tamanho: '1.6 MB', status: 'sucesso' }
    ],
    3: [
      { data: '2023-12-20', responsavel: 'Pedro Costa', tamanho: '0.5 MB', status: 'sucesso' },
      { data: '2023-12-13', responsavel: 'Ana Lima', tamanho: '0.4 MB', status: 'sucesso' },
      { data: '2023-12-06', responsavel: 'Pedro Costa', tamanho: '0.5 MB', status: 'sucesso' }
    ],
    4: [
      { data: '2024-01-14', responsavel: 'Ana Lima', tamanho: '1.2 MB', status: 'sucesso' },
      { data: '2024-01-07', responsavel: 'Carlos Oliveira', tamanho: '1.1 MB', status: 'sucesso' },
      { data: '2023-12-31', responsavel: 'Ana Lima', tamanho: '1.0 MB', status: 'sucesso' }
    ],
    5: [
      { data: '2023-11-30', responsavel: 'Carlos Oliveira', tamanho: '0.8 MB', status: 'sucesso' },
      { data: '2023-11-23', responsavel: 'João Silva', tamanho: '0.7 MB', status: 'sucesso' },
      { data: '2023-11-16', responsavel: 'Carlos Oliveira', tamanho: '0.8 MB', status: 'sucesso' }
    ]
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

  const equipamentosFiltrados = equipamentos.filter(equipamento => {
    if (filtroStatus === 'todos') return true;
    return equipamento.statusBackup === filtroStatus;
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

  return React.createElement(Layout, { currentPage: '/backups' },
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
          
          // Filtros
          React.createElement('div', { 
            style: {
              display: 'flex',
              gap: '8px'
            }
          },
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
        
        // Lista de equipamentos
        React.createElement('div', { 
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '16px'
          }
        },
          equipamentosFiltrados.map(equipamento =>
            React.createElement('div', {
              key: equipamento.id,
              onClick: () => handleEquipamentoClick(equipamento),
              style: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                border: '1px solid rgba(125, 38, 217, 0.1)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s'
              }
            },
              // Header do card
              React.createElement('div', { 
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }
              },
                React.createElement('div', { 
                  style: {
                    flex: 1
                  }
                },
                  React.createElement('h3', { 
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#404040',
                      marginBottom: '4px'
                    }
                  }, equipamento.nome),
                  React.createElement('p', { 
                    style: {
                      fontSize: '11px',
                      color: '#737373',
                      margin: 0
                    }
                  }, `${equipamento.ipPrivado} • ${equipamento.localidade}`)
                ),
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    backgroundColor: `${getStatusColor(equipamento.statusBackup)}20`,
                    borderRadius: '6px',
                    border: `1px solid ${getStatusColor(equipamento.statusBackup)}40`
                  }
                },
                  React.createElement('div', { 
                    style: {
                      width: '6px',
                      height: '6px',
                      backgroundColor: getStatusColor(equipamento.statusBackup),
                      borderRadius: '50%'
                    }
                  }),
                  React.createElement('span', { 
                    style: {
                      fontSize: '10px',
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
                  gap: '12px',
                  marginBottom: '12px'
                }
              },
                React.createElement('div', null,
                  React.createElement('span', { 
                    style: {
                      fontSize: '10px',
                      color: '#737373',
                      display: 'block',
                      marginBottom: '2px'
                    }
                  }, 'Último Backup'),
                  React.createElement('span', { 
                    style: {
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#404040'
                    }
                  }, new Date(equipamento.ultimoBackup).toLocaleDateString('pt-BR'))
                ),
                React.createElement('div', null,
                  React.createElement('span', { 
                    style: {
                      fontSize: '10px',
                      color: '#737373',
                      display: 'block',
                      marginBottom: '2px'
                    }
                  }, 'Responsável'),
                  React.createElement('span', { 
                    style: {
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#404040'
                    }
                  }, equipamento.responsavelUltimoBackup)
                )
              ),
              
              // Alerta de pendência
              equipamento.statusBackup !== 'em-dia' && React.createElement('div', { 
                style: {
                  backgroundColor: equipamento.statusBackup === 'critico' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  border: `1px solid ${equipamento.statusBackup === 'critico' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  borderRadius: '6px',
                  padding: '8px',
                  marginBottom: '12px'
                }
              },
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }
                },
                  React.createElement('svg', {
                    width: '12',
                    height: '12',
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
                      fontSize: '10px',
                      fontWeight: '500',
                      color: equipamento.statusBackup === 'critico' ? '#ef4444' : '#f59e0b'
                    }
                  }, `Passaram ${equipamento.diasSemBackup} dias sem backup`)
                )
              ),
              
              // Footer
              React.createElement('div', { 
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(125, 38, 217, 0.1)'
                }
              },
                React.createElement('span', { 
                  style: {
                    fontSize: '10px',
                    color: '#737373'
                  }
                }, `${equipamento.totalBackups} backups realizados`),
                React.createElement('button', {
                  onClick: (e) => {
                    e.stopPropagation();
                    executarBackup(equipamento.id);
                  },
                  style: {
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: 'rgba(125, 38, 217, 0.1)',
                    color: '#7d26d9',
                    fontSize: '10px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }
                }, 'Executar Backup')
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
          React.createElement('h4', { 
            style: {
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#404040',
              marginBottom: '12px'
            }
          }, 'Histórico de Backups'),
          React.createElement('div', { 
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }
          },
            historicoBackups[equipamentoSelecionado.id]?.map((backup, index) =>
              React.createElement('div', {
                key: index,
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
                  }, new Date(backup.data).toLocaleDateString('pt-BR')),
                  React.createElement('div', { 
                    style: {
                      fontSize: '10px',
                      color: '#737373'
                    }
                  }, `Responsável: ${backup.responsavel}`)
                ),
                React.createElement('div', { 
                  style: {
                    textAlign: 'right'
                  }
                },
                  React.createElement('div', { 
                    style: {
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#404040',
                      marginBottom: '2px'
                    }
                  }, backup.tamanho),
                  React.createElement('div', { 
                    style: {
                      fontSize: '10px',
                      color: '#10b981',
                      fontWeight: '500'
                    }
                  }, backup.status)
                )
              )
            )
          )
        )
      )
    )
  );
}

export default Backups;
