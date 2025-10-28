import React, { useState, useEffect } from 'react';
import Layout from './shared/Layout';
import { useEquipamentos } from '../hooks/useEquipamentos';

function Monitoramento() {
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [dadosMonitoramento, setDadosMonitoramento] = useState({});

  // Usar hook para buscar equipamentos reais
  const { equipamentos, loading, error } = useEquipamentos();

  // Dados mock apenas para métricas de monitoramento (que não existem no banco ainda)
  const equipamentosComMetricas = equipamentos.map(equipamento => ({
    ...equipamento,
    ultimoPing: new Date().toISOString(),
    latencia: Math.floor(Math.random() * 20) + 5,
    cpu: Math.floor(Math.random() * 30) + 10,
    memoria: Math.floor(Math.random() * 40) + 20,
    temperatura: Math.floor(Math.random() * 15) + 45,
    uptime: `${Math.floor(Math.random() * 30) + 1} dias, ${Math.floor(Math.random() * 24)} horas`,
    localidade: (typeof equipamento.pop === 'string' ? equipamento.pop : equipamento.pop?.nome) || 
                equipamento.localidade?.endereco || 
                equipamento.cidade || 
                equipamento.endereco?.cidade ||
                'Local não informado'
  }));

  // Simular atualização periódica dos dados
  useEffect(() => {
    const interval = setInterval(() => {
      setDadosMonitoramento(prev => {
        const novosDados = {};
        equipamentosComMetricas.forEach(equipamento => {
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
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval);
  }, [equipamentosComMetricas]);

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
    if (tipo === 'latencia') {
      if (valor < 20) return '#10b981';
      if (valor < 50) return '#f59e0b';
      return '#ef4444';
    }
    if (tipo === 'cpu' || tipo === 'memoria') {
      if (valor < 50) return '#10b981';
      if (valor < 80) return '#f59e0b';
      return '#ef4444';
    }
    if (tipo === 'temperatura') {
      if (valor < 50) return '#10b981';
      if (valor < 60) return '#f59e0b';
      return '#ef4444';
    }
    return '#6b7280';
  };

  const equipamentosFiltrados = Array.isArray(equipamentos) ? equipamentos.filter(equipamento => {
    if (filtroStatus === 'todos') return true;
    return equipamento.status === filtroStatus;
  }) : [];

  const handleEquipamentoClick = (equipamento) => {
    setEquipamentoSelecionado(equipamento);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEquipamentoSelecionado(null);
  };

  const getDadosAtuais = (equipamento) => {
    const dadosAtualizados = dadosMonitoramento[equipamento.id];
    if (dadosAtualizados) {
      return {
        ...equipamento,
        latencia: dadosAtualizados.latencia,
        cpu: dadosAtualizados.cpu,
        memoria: dadosAtualizados.memoria,
        temperatura: dadosAtualizados.temperatura,
        ultimoPing: dadosAtualizados.ultimoPing
      };
    }
    return equipamento;
  };

  return React.createElement(Layout, { currentPage: '/monitoramento' },
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
          onClick: () => window.location.href = '/backups',
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
            React.createElement('path', { d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' }),
            React.createElement('polyline', { points: '3.27,6.96 12,12.01 20.73,6.96' }),
            React.createElement('line', { x1: '12', y1: '22.08', x2: '12', y2: '12' })
          ),
          'Backups'
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
            React.createElement('path', { d: 'M22 12h-4l-3 9L9 3l-3 9H2' })
          ),
          'Monitoramento'
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
            }, 'Monitoramento em Tempo Real'),
            React.createElement('p', { 
              style: {
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }, `${equipamentosFiltrados.length} equipamentos monitorados`)
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
              onClick: () => setFiltroStatus('online'),
              style: {
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: filtroStatus === 'online' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                color: filtroStatus === 'online' ? '#10b981' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }
            }, 'Online'),
            React.createElement('button', {
              onClick: () => setFiltroStatus('atencao'),
              style: {
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: filtroStatus === 'atencao' ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                color: filtroStatus === 'atencao' ? '#f59e0b' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }
            }, 'Atenção'),
            React.createElement('button', {
              onClick: () => setFiltroStatus('offline'),
              style: {
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: filtroStatus === 'offline' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                color: filtroStatus === 'offline' ? '#ef4444' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }
            }, 'Offline')
          )
        ),
        
        // Lista de equipamentos
        React.createElement('div', { 
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '16px'
          }
        },
          equipamentosFiltrados.map(equipamento => {
            const dadosAtuais = getDadosAtuais(equipamento);
            return React.createElement('div', {
              key: equipamento.id,
              onClick: () => handleEquipamentoClick(dadosAtuais),
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
                  marginBottom: '16px'
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
                  }, `${equipamento.ipPrivado} • ${equipamento.localidade?.endereco || equipamento.cidade || 'Local não informado'}`)
                ),
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    backgroundColor: `${getStatusColor(equipamento.status)}20`,
                    borderRadius: '6px',
                    border: `1px solid ${getStatusColor(equipamento.status)}40`
                  }
                },
                  React.createElement('div', { 
                    style: {
                      width: '6px',
                      height: '6px',
                      backgroundColor: getStatusColor(equipamento.status),
                      borderRadius: '50%'
                    }
                  }),
                  React.createElement('span', { 
                    style: {
                      fontSize: '10px',
                      fontWeight: '500',
                      color: getStatusColor(equipamento.status)
                    }
                  }, getStatusText(equipamento.status))
                )
              ),
              
              // Métricas
              equipamento.status !== 'offline' && React.createElement('div', { 
                style: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginBottom: '16px'
                }
              },
                // Latência
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px'
                  }
                },
                  React.createElement('div', { 
                    style: {
                      width: '8px',
                      height: '8px',
                      backgroundColor: getMetricaColor(dadosAtuais.latencia, 'latencia'),
                      borderRadius: '50%'
                    }
                  }),
                  React.createElement('div', { 
                    style: {
                      flex: 1
                    }
                  },
                    React.createElement('div', { 
                      style: {
                        fontSize: '10px',
                        color: '#737373',
                        marginBottom: '2px'
                      }
                    }, 'Latência'),
                    React.createElement('div', { 
                      style: {
                        fontSize: '12px',
                        fontWeight: '600',
                        color: getMetricaColor(dadosAtuais.latencia, 'latencia')
                      }
                    }, `${dadosAtuais.latencia}ms`)
                  )
                ),
                
                // CPU
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px'
                  }
                },
                  React.createElement('div', { 
                    style: {
                      width: '8px',
                      height: '8px',
                      backgroundColor: getMetricaColor(dadosAtuais.cpu, 'cpu'),
                      borderRadius: '50%'
                    }
                  }),
                  React.createElement('div', { 
                    style: {
                      flex: 1
                    }
                  },
                    React.createElement('div', { 
                      style: {
                        fontSize: '10px',
                        color: '#737373',
                        marginBottom: '2px'
                      }
                    }, 'CPU'),
                    React.createElement('div', { 
                      style: {
                        fontSize: '12px',
                        fontWeight: '600',
                        color: getMetricaColor(dadosAtuais.cpu, 'cpu')
                      }
                    }, `${dadosAtuais.cpu}%`)
                  )
                ),
                
                // Memória
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px'
                  }
                },
                  React.createElement('div', { 
                    style: {
                      width: '8px',
                      height: '8px',
                      backgroundColor: getMetricaColor(dadosAtuais.memoria, 'memoria'),
                      borderRadius: '50%'
                    }
                  }),
                  React.createElement('div', { 
                    style: {
                      flex: 1
                    }
                  },
                    React.createElement('div', { 
                      style: {
                        fontSize: '10px',
                        color: '#737373',
                        marginBottom: '2px'
                      }
                    }, 'Memória'),
                    React.createElement('div', { 
                      style: {
                        fontSize: '12px',
                        fontWeight: '600',
                        color: getMetricaColor(dadosAtuais.memoria, 'memoria')
                      }
                    }, `${dadosAtuais.memoria}%`)
                  )
                ),
                
                // Temperatura
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px'
                  }
                },
                  React.createElement('div', { 
                    style: {
                      width: '8px',
                      height: '8px',
                      backgroundColor: getMetricaColor(dadosAtuais.temperatura, 'temperatura'),
                      borderRadius: '50%'
                    }
                  }),
                  React.createElement('div', { 
                    style: {
                      flex: 1
                    }
                  },
                    React.createElement('div', { 
                      style: {
                        fontSize: '10px',
                        color: '#737373',
                        marginBottom: '2px'
                      }
                    }, 'Temperatura'),
                    React.createElement('div', { 
                      style: {
                        fontSize: '12px',
                        fontWeight: '600',
                        color: getMetricaColor(dadosAtuais.temperatura, 'temperatura')
                      }
                    }, `${dadosAtuais.temperatura}°C`)
                  )
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
                }, `Uptime: ${equipamento.uptime}`),
                React.createElement('span', { 
                  style: {
                    fontSize: '10px',
                    color: '#737373'
                  }
                }, `Último ping: ${dadosAtuais.ultimoPing ? new Date(dadosAtuais.ultimoPing).toLocaleTimeString() : 'N/A'}`)
              )
            );
          })
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
          maxWidth: '800px',
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
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e5e5e5'
          }
        },
          React.createElement('div', null,
            React.createElement('h3', { 
              style: {
                fontSize: '18px',
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
        
        // Métricas detalhadas
        React.createElement('div', { 
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '24px'
          }
        },
          // Latência
          React.createElement('div', { 
            style: {
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }
          },
            React.createElement('div', { 
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }
            },
              React.createElement('div', { 
                style: {
                  width: '12px',
                  height: '12px',
                  backgroundColor: getMetricaColor(equipamentoSelecionado.latencia, 'latencia'),
                  borderRadius: '50%'
                }
              }),
              React.createElement('h4', { 
                style: {
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#404040',
                  margin: 0
                }
              }, 'Latência')
            ),
            React.createElement('div', { 
              style: {
                fontSize: '24px',
                fontWeight: 'bold',
                color: getMetricaColor(equipamentoSelecionado.latencia, 'latencia'),
                marginBottom: '4px'
              }
            }, `${equipamentoSelecionado.latencia}ms`),
            React.createElement('div', { 
              style: {
                fontSize: '11px',
                color: '#737373'
              }
            }, 'Tempo de resposta do ping')
          ),
          
          // CPU
          React.createElement('div', { 
            style: {
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }
          },
            React.createElement('div', { 
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }
            },
              React.createElement('div', { 
                style: {
                  width: '12px',
                  height: '12px',
                  backgroundColor: getMetricaColor(equipamentoSelecionado.cpu, 'cpu'),
                  borderRadius: '50%'
                }
              }),
              React.createElement('h4', { 
                style: {
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#404040',
                  margin: 0
                }
              }, 'CPU')
            ),
            React.createElement('div', { 
              style: {
                fontSize: '24px',
                fontWeight: 'bold',
                color: getMetricaColor(equipamentoSelecionado.cpu, 'cpu'),
                marginBottom: '4px'
              }
            }, `${equipamentoSelecionado.cpu}%`),
            React.createElement('div', { 
              style: {
                fontSize: '11px',
                color: '#737373'
              }
            }, 'Uso do processador')
          ),
          
          // Memória
          React.createElement('div', { 
            style: {
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }
          },
            React.createElement('div', { 
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }
            },
              React.createElement('div', { 
                style: {
                  width: '12px',
                  height: '12px',
                  backgroundColor: getMetricaColor(equipamentoSelecionado.memoria, 'memoria'),
                  borderRadius: '50%'
                }
              }),
              React.createElement('h4', { 
                style: {
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#404040',
                  margin: 0
                }
              }, 'Memória')
            ),
            React.createElement('div', { 
              style: {
                fontSize: '24px',
                fontWeight: 'bold',
                color: getMetricaColor(equipamentoSelecionado.memoria, 'memoria'),
                marginBottom: '4px'
              }
            }, `${equipamentoSelecionado.memoria}%`),
            React.createElement('div', { 
              style: {
                fontSize: '11px',
                color: '#737373'
              }
            }, 'Uso da memória RAM')
          ),
          
          // Temperatura
          React.createElement('div', { 
            style: {
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }
          },
            React.createElement('div', { 
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }
            },
              React.createElement('div', { 
                style: {
                  width: '12px',
                  height: '12px',
                  backgroundColor: getMetricaColor(equipamentoSelecionado.temperatura, 'temperatura'),
                  borderRadius: '50%'
                }
              }),
              React.createElement('h4', { 
                style: {
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#404040',
                  margin: 0
                }
              }, 'Temperatura')
            ),
            React.createElement('div', { 
              style: {
                fontSize: '24px',
                fontWeight: 'bold',
                color: getMetricaColor(equipamentoSelecionado.temperatura, 'temperatura'),
                marginBottom: '4px'
              }
            }, `${equipamentoSelecionado.temperatura}°C`),
            React.createElement('div', { 
              style: {
                fontSize: '11px',
                color: '#737373'
              }
            }, 'Temperatura do equipamento')
          )
        ),
        
        // Informações adicionais
        React.createElement('div', { 
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px'
          }
        },
          React.createElement('div', null,
            React.createElement('h4', { 
              style: {
                fontSize: '14px',
                fontWeight: '600',
                color: '#404040',
                marginBottom: '8px'
              }
            }, 'Status'),
            React.createElement('div', { 
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: `${getStatusColor(equipamentoSelecionado.status)}20`,
                borderRadius: '6px',
                border: `1px solid ${getStatusColor(equipamentoSelecionado.status)}40`
              }
            },
              React.createElement('div', { 
                style: {
                  width: '8px',
                  height: '8px',
                  backgroundColor: getStatusColor(equipamentoSelecionado.status),
                  borderRadius: '50%'
                }
              }),
              React.createElement('span', { 
                style: {
                  fontSize: '12px',
                  fontWeight: '500',
                  color: getStatusColor(equipamentoSelecionado.status)
                }
              }, getStatusText(equipamentoSelecionado.status))
            )
          ),
          React.createElement('div', null,
            React.createElement('h4', { 
              style: {
                fontSize: '14px',
                fontWeight: '600',
                color: '#404040',
                marginBottom: '8px'
              }
            }, 'Uptime'),
            React.createElement('div', { 
              style: {
                fontSize: '12px',
                color: '#404040',
                padding: '8px 12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #e9ecef'
              }
            }, equipamentoSelecionado.uptime)
          )
        )
      )
    )
  );
}

export default Monitoramento;