import React, { useState } from 'react';
import Layout from './shared/Layout';

function TopologiaRede() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnimating, setSidebarAnimating] = useState(false);
  const [sidebarAnimatingOut, setSidebarAnimatingOut] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // Dados dos equipamentos com posições no mapa
  const equipamentos = [
    {
      id: 1,
      nome: 'Router Principal - Matriz',
      modelo: 'RB4011iGS+RM',
      fabricante: 'Mikrotik',
      ipPrivado: '192.168.1.1',
      localidade: 'São Paulo - SP',
      tipo: 'router',
      status: 'online',
      posicao: { x: 200, y: 150 },
      conexoes: [2, 3]
    },
    {
      id: 2,
      nome: 'Switch Core - Data Center',
      modelo: 'CRS326-24G-2S+RM',
      fabricante: 'Mikrotik',
      ipPrivado: '192.168.1.2',
      localidade: 'São Paulo - SP',
      tipo: 'switch',
      status: 'online',
      posicao: { x: 400, y: 200 },
      conexoes: [1, 4, 5]
    },
    {
      id: 3,
      nome: 'AP WiFi - Piso 1',
      modelo: 'cAP ac',
      fabricante: 'Mikrotik',
      ipPrivado: '192.168.1.10',
      localidade: 'São Paulo - SP',
      tipo: 'access-point',
      status: 'online',
      posicao: { x: 150, y: 300 },
      conexoes: [1]
    },
    {
      id: 4,
      nome: 'Router Filial - Rio',
      modelo: 'RB750Gr3',
      fabricante: 'Mikrotik',
      ipPrivado: '192.168.2.1',
      localidade: 'Rio de Janeiro - RJ',
      tipo: 'router',
      status: 'online',
      posicao: { x: 600, y: 400 },
      conexoes: [2]
    },
    {
      id: 5,
      nome: 'Switch Edge - Filial BH',
      modelo: 'CRS112-8P-4S-IN',
      fabricante: 'Mikrotik',
      ipPrivado: '192.168.3.1',
      localidade: 'Belo Horizonte - MG',
      tipo: 'switch',
      status: 'warning',
      posicao: { x: 500, y: 500 },
      conexoes: [2]
    }
  ];

  const toggleSidebar = () => {
    if (sidebarVisible) {
      setSidebarAnimatingOut(true);
      setTimeout(() => {
        setSidebarVisible(false);
        setSidebarAnimatingOut(false);
      }, 300);
    } else {
      setSidebarVisible(true);
      setSidebarAnimating(true);
      setTimeout(() => {
        setSidebarAnimating(false);
      }, 300);
    }
  };

  const getEquipmentIcon = (tipo) => {
    switch (tipo) {
      case 'router':
        return '🖥️';
      case 'switch':
        return '🔀';
      case 'access-point':
        return '📶';
      default:
        return '🖥️';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'offline':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'warning':
        return 'Atenção';
      case 'offline':
        return 'Offline';
      default:
        return 'Desconhecido';
    }
  };

  return React.createElement(Layout, { currentPage: '/topologia' },
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
      }),
      
      // Nós de rede pulsantes
      React.createElement('div', { 
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%'
        }
      },
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 15px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite',
            top: '15%',
            left: '8%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 15px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 0.5s',
            top: '25%',
            left: '85%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 15px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 1s',
            top: '55%',
            left: '15%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 15px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 1.5s',
            top: '65%',
            left: '75%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 15px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 2s',
            top: '35%',
            left: '45%'
          }
        })
      ),
      
      // Linhas de conexão
      React.createElement('div', { 
        style: {
          position: 'absolute',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #7d26d9, transparent)',
          animation: 'data-flow 3s ease-in-out infinite',
          top: '20%',
          left: '8%',
          width: '77%',
          transform: 'rotate(12deg)'
        }
      }),
      React.createElement('div', { 
        style: {
          position: 'absolute',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #7d26d9, transparent)',
          animation: 'data-flow 3s ease-in-out infinite 1.5s',
          top: '50%',
          left: '15%',
          width: '60%',
          transform: 'rotate(-15deg)'
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
            React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
            React.createElement('line', { x1: '2', y1: '12', x2: '22', y2: '12' }),
            React.createElement('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
          ),
          'Topologia'
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
        )
      ),
      
      // Status, filtro e logout
      React.createElement('div', { 
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }
      },
        // Botão de filtro
        React.createElement('button', {
          onClick: toggleSidebar,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: sidebarVisible ? 'rgba(125, 38, 217, 0.1)' : 'transparent',
            color: sidebarVisible ? '#7d26d9' : '#404040',
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
            React.createElement('polygon', { points: '22,3 2,3 10,12.46 10,19 14,21 14,12.46' })
          ),
          'Filtros'
        ),
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
    
    // Layout principal com padding para navbar
    React.createElement('div', { 
      style: {
        paddingTop: '60px',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 10
      }
    },
      // Sidebar (condicional)
      (sidebarVisible || sidebarAnimating || sidebarAnimatingOut) && React.createElement('div', { 
        style: {
          width: '280px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(125, 38, 217, 0.1)',
          padding: '24px 0',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: '60px',
          left: 0,
          height: 'calc(100vh - 60px)',
          overflowY: 'auto',
          zIndex: 999,
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
          transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
          animation: sidebarAnimating ? 'slideInLeft 0.3s ease-out' : sidebarAnimatingOut ? 'slideOutLeft 0.3s ease-in' : 'none'
        }
      },
        // Filtros específicos para topologia
        React.createElement('div', { 
          style: {
            flex: 1,
            padding: '0 16px'
          }
        },
          React.createElement('div', { 
            style: {
              marginBottom: '24px'
            }
          },
            React.createElement('h3', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                marginBottom: '12px'
              }
            }, 'Filtros de Topologia'),
            React.createElement('div', { 
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }
            },
              React.createElement('button', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontSize: '11px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }
              },
                React.createElement('span', { style: { fontSize: '12px' } }, '✅'),
                'Todos Online'
              ),
              React.createElement('button', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: '#f59e0b',
                  fontSize: '11px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }
              },
                React.createElement('span', { style: { fontSize: '12px' } }, '⚠️'),
                'Com Alertas'
              ),
              React.createElement('button', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6',
                  fontSize: '11px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }
              },
                React.createElement('span', { style: { fontSize: '12px' } }, '🔄'),
                'Em Manutenção'
              )
            )
          ),
          
          React.createElement('div', { 
            style: {
              marginBottom: '24px'
            }
          },
            React.createElement('h3', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                marginBottom: '12px'
              }
            }, 'Tipos de Equipamento'),
            React.createElement('div', { 
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }
            },
              React.createElement('button', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(125, 38, 217, 0.1)',
                  color: '#7d26d9',
                  fontSize: '10px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }
              },
                React.createElement('span', { style: { fontSize: '12px' } }, '🖥️'),
                'Routers'
              ),
              React.createElement('button', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6',
                  fontSize: '10px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }
              },
                React.createElement('span', { style: { fontSize: '12px' } }, '🔀'),
                'Switches'
              ),
              React.createElement('button', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontSize: '10px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }
              },
                React.createElement('span', { style: { fontSize: '12px' } }, '📶'),
                'Access Points'
              )
            )
          )
        )
      ),
      
      // Conteúdo principal
      React.createElement('div', { 
        style: {
          marginLeft: (sidebarVisible || sidebarAnimating || sidebarAnimatingOut) ? '280px' : '0',
          padding: '24px',
          minHeight: 'calc(100vh - 60px)',
          overflow: 'auto',
          transition: 'margin-left 0.3s ease-out'
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
            }, 'Topologia de Rede'),
            React.createElement('p', { 
              style: {
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }, 'Mapa visual da infraestrutura de rede')
          ),
          React.createElement('div', { 
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }
          },
            React.createElement('div', { 
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                color: 'white',
                fontSize: '12px'
              }
            },
              React.createElement('div', { 
                style: {
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%'
                }
              }),
              'Rede Ativa'
            ),
            React.createElement('div', { 
              style: {
                color: 'white',
                fontSize: '12px',
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px'
              }
            }, `${equipamentos.length} equipamentos`)
          )
        ),
        
        // Mapa de topologia
        React.createElement('div', { 
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            minHeight: '600px',
            overflow: 'hidden'
          }
        },
          // SVG para as conexões
          React.createElement('svg', {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
              pointerEvents: 'none'
            }
          },
            // Linhas de conexão
            equipamentos.map(equipamento => 
              equipamento.conexoes.map(conexaoId => {
                const equipamentoConexao = equipamentos.find(e => e.id === conexaoId);
                if (!equipamentoConexao) return null;
                
                return React.createElement('line', {
                  key: `${equipamento.id}-${conexaoId}`,
                  x1: equipamento.posicao.x,
                  y1: equipamento.posicao.y,
                  x2: equipamentoConexao.posicao.x,
                  y2: equipamentoConexao.posicao.y,
                  stroke: '#7d26d9',
                  strokeWidth: '2',
                  strokeDasharray: '5,5',
                  opacity: 0.6
                });
              })
            )
          ),
          
          // Equipamentos no mapa
          equipamentos.map(equipamento =>
            React.createElement('div', {
              key: equipamento.id,
              onClick: () => setSelectedEquipment(equipamento),
              style: {
                position: 'absolute',
                left: equipamento.posicao.x - 40,
                top: equipamento.posicao.y - 40,
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: `3px solid ${getStatusColor(equipamento.status)}`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                zIndex: 2
              },
              onMouseOver: (e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.25)';
              },
              onMouseOut: (e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
              }
            },
              React.createElement('div', { 
                style: {
                  fontSize: '24px',
                  marginBottom: '4px'
                }
              }, getEquipmentIcon(equipamento.tipo)),
              React.createElement('div', { 
                style: {
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: '#404040',
                  textAlign: 'center',
                  lineHeight: 1
                }
              }, equipamento.nome.split(' ')[0]),
              React.createElement('div', { 
                style: {
                  fontSize: '6px',
                  color: '#525252',
                  fontWeight: '500',
                  marginTop: '2px',
                  fontFamily: 'monospace'
                }
              }, equipamento.ipPrivado),
              React.createElement('div', { 
                style: {
                  fontSize: '7px',
                  color: getStatusColor(equipamento.status),
                  fontWeight: '500',
                  marginTop: '2px'
                }
              }, getStatusText(equipamento.status))
            )
          ),
          
          // Legenda
          React.createElement('div', { 
            style: {
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              zIndex: 3
            }
          },
            React.createElement('h4', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                marginBottom: '12px'
              }
            }, 'Legenda'),
            React.createElement('div', { 
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
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
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#10b981',
                    borderRadius: '2px'
                  }
                }),
                React.createElement('span', { 
                  style: {
                    fontSize: '10px',
                    color: '#404040'
                  }
                }, 'Online')
              ),
              React.createElement('div', { 
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }
              },
                React.createElement('div', { 
                  style: {
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#f59e0b',
                    borderRadius: '2px'
                  }
                }),
                React.createElement('span', { 
                  style: {
                    fontSize: '10px',
                    color: '#404040'
                  }
                }, 'Atenção')
              ),
              React.createElement('div', { 
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }
              },
                React.createElement('div', { 
                  style: {
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#ef4444',
                    borderRadius: '2px'
                  }
                }),
                React.createElement('span', { 
                  style: {
                    fontSize: '10px',
                    color: '#404040'
                  }
                }, 'Offline')
              )
            )
          )
        )
      )
    ),
    
    // Modal de detalhes do equipamento
    selectedEquipment && React.createElement('div', { 
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
      onClick: () => setSelectedEquipment(null)
    },
      React.createElement('div', { 
        style: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        },
        onClick: (e) => e.stopPropagation()
      },
        React.createElement('button', {
          onClick: () => setSelectedEquipment(null),
          style: {
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            color: '#737373',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }
        }, '×'),
        
        React.createElement('div', { 
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }
        },
          React.createElement('div', { 
            style: {
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(125, 38, 217, 0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }
          }, getEquipmentIcon(selectedEquipment.tipo)),
          React.createElement('div', null,
            React.createElement('h3', { 
              style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#404040',
                marginBottom: '2px'
              }
            }, selectedEquipment.nome),
            React.createElement('p', { 
              style: {
                fontSize: '12px',
                color: '#737373',
                margin: 0
              }
            }, `${selectedEquipment.fabricante} ${selectedEquipment.modelo}`)
          )
        ),
        
        React.createElement('div', { 
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }
        },
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '4px'
              }
            }, 'IP Privado'),
            React.createElement('p', { 
              style: {
                fontSize: '12px',
                color: '#525252',
                margin: 0,
                fontFamily: 'monospace'
              }
            }, selectedEquipment.ipPrivado)
          ),
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '4px'
              }
            }, 'Localidade'),
            React.createElement('p', { 
              style: {
                fontSize: '12px',
                color: '#525252',
                margin: 0
              }
            }, selectedEquipment.localidade)
          ),
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '4px'
              }
            }, 'Status'),
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
                  backgroundColor: getStatusColor(selectedEquipment.status),
                  borderRadius: '50%'
                }
              }),
              React.createElement('span', { 
                style: {
                  fontSize: '12px',
                  color: getStatusColor(selectedEquipment.status),
                  fontWeight: '500'
                }
              }, getStatusText(selectedEquipment.status))
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '4px'
              }
            }, 'Conexões'),
            React.createElement('div', { 
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }
            },
              selectedEquipment.conexoes.map(conexaoId => {
                const equipamentoConexao = equipamentos.find(e => e.id === conexaoId);
                return equipamentoConexao ? React.createElement('div', {
                  key: conexaoId,
                  style: {
                    fontSize: '11px',
                    color: '#525252',
                    padding: '4px 8px',
                    backgroundColor: 'rgba(125, 38, 217, 0.1)',
                    borderRadius: '4px'
                  }
                }, equipamentoConexao.nome) : null;
              })
            )
          )
        )
      )
    )
  );
}

export default TopologiaRede;
