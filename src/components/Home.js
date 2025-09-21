import React, { useState } from 'react';
import Layout from './shared/Layout';

function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnimating, setSidebarAnimating] = useState(false);
  const [sidebarAnimatingOut, setSidebarAnimatingOut] = useState(false);

  const toggleSidebar = () => {
    if (sidebarVisible) {
      // Fechando sidebar
      setSidebarAnimatingOut(true);
      setTimeout(() => {
        setSidebarVisible(false);
        setSidebarAnimatingOut(false);
      }, 300);
    } else {
      // Abrindo sidebar
      setSidebarVisible(true);
      setSidebarAnimating(true);
      setTimeout(() => {
        setSidebarAnimating(false);
      }, 300);
    }
  };

  return React.createElement(Layout, { currentPage: '/home' },
    // Sidebar (condicional)
    (sidebarVisible || sidebarAnimating || sidebarAnimatingOut) && React.createElement('div', {
      style: {
        position: 'fixed',
        top: '60px',
        left: 0,
        width: '280px',
        height: 'calc(100vh - 60px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(125, 38, 217, 0.1)',
        zIndex: 999,
        padding: '24px',
        overflow: 'auto',
        animation: sidebarAnimatingOut ? 'slideOutLeft 0.3s ease-in' : 
                  sidebarAnimating ? 'slideInLeft 0.3s ease-out' : 'none'
      }
    },
      React.createElement('h3', {
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#404040',
          marginBottom: '20px'
        }
      }, 'Filtros'),
      
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
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: '#737373',
              marginBottom: '6px'
            }
          }, 'Status dos Equipamentos'),
          React.createElement('select', {
            style: {
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              fontSize: '12px',
              backgroundColor: 'white'
            }
          },
            React.createElement('option', { value: 'todos' }, 'Todos'),
            React.createElement('option', { value: 'online' }, 'Online'),
            React.createElement('option', { value: 'atencao' }, 'Atenção'),
            React.createElement('option', { value: 'offline' }, 'Offline')
          )
        ),
        
        React.createElement('div', null,
          React.createElement('label', {
            style: {
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: '#737373',
              marginBottom: '6px'
            }
          }, 'Tipo de Equipamento'),
          React.createElement('select', {
            style: {
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              fontSize: '12px',
              backgroundColor: 'white'
            }
          },
            React.createElement('option', { value: 'todos' }, 'Todos'),
            React.createElement('option', { value: 'router' }, 'Router'),
            React.createElement('option', { value: 'switch' }, 'Switch'),
            React.createElement('option', { value: 'access-point' }, 'Access Point'),
            React.createElement('option', { value: 'olt' }, 'OLT'),
            React.createElement('option', { value: 'onu' }, 'ONU')
          )
        ),
        
        React.createElement('div', null,
          React.createElement('label', {
            style: {
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: '#737373',
              marginBottom: '6px'
            }
          }, 'Localização'),
          React.createElement('select', {
            style: {
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              fontSize: '12px',
              backgroundColor: 'white'
            }
          },
            React.createElement('option', { value: 'todos' }, 'Todas'),
            React.createElement('option', { value: 'sao-paulo' }, 'São Paulo - SP'),
            React.createElement('option', { value: 'rio-janeiro' }, 'Rio de Janeiro - RJ'),
            React.createElement('option', { value: 'belo-horizonte' }, 'Belo Horizonte - MG')
          )
        )
      )
    ),

    // Conteúdo principal
    React.createElement('div', {
      style: {
        padding: '24px'
      }
    },
      // Header com título e botão de filtro
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px'
        }
      },
        React.createElement('div', null,
          React.createElement('h1', {
            style: {
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px'
            }
          }, 'Dashboard'),
          React.createElement('p', {
            style: {
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }, 'Visão geral do sistema de monitoramento')
        ),
        
        React.createElement('button', {
          onClick: toggleSidebar,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backdropFilter: 'blur(10px)'
          }
        },
          React.createElement('svg', {
            width: '18',
            height: '18',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('polygon', { points: '22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3' })
          ),
          'Filtros'
        )
      ),

      // Cards de estatísticas
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }
      },
        // Card Total de Equipamentos
        React.createElement('div', {
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(125, 38, 217, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }
          },
            React.createElement('div', {
              style: {
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(125, 38, 217, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }
            },
              React.createElement('svg', {
                width: '24',
                height: '24',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: '#7d26d9',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              },
                React.createElement('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2', ry: '2' }),
                React.createElement('line', { x1: '8', y1: '21', x2: '16', y2: '21' }),
                React.createElement('line', { x1: '12', y1: '17', x2: '12', y2: '21' })
              )
            ),
            React.createElement('div', {
              style: {
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#7d26d9'
              }
            }, '100')
          ),
          React.createElement('h3', {
            style: {
              fontSize: '16px',
              fontWeight: '600',
              color: '#404040',
              marginBottom: '4px'
            }
          }, 'Total de Equipamentos'),
          React.createElement('p', {
            style: {
              fontSize: '12px',
              color: '#737373',
              margin: 0
            }
          }, 'Equipamentos cadastrados no sistema')
        ),

        // Card Equipamentos Online
        React.createElement('div', {
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(16, 185, 129, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }
          },
            React.createElement('div', {
              style: {
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }
            },
              React.createElement('svg', {
                width: '24',
                height: '24',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: '#10b981',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              },
                React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
                React.createElement('path', { d: 'M8 14s1.5 2 4 2 4-2 4-2' }),
                React.createElement('line', { x1: '9', y1: '9', x2: '9.01', y2: '9' }),
                React.createElement('line', { x1: '15', y1: '9', x2: '15.01', y2: '9' })
              )
            ),
            React.createElement('div', {
              style: {
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#10b981'
              }
            }, '85')
          ),
          React.createElement('h3', {
            style: {
              fontSize: '16px',
              fontWeight: '600',
              color: '#404040',
              marginBottom: '4px'
            }
          }, 'Equipamentos Online'),
          React.createElement('p', {
            style: {
              fontSize: '12px',
              color: '#737373',
              margin: 0
            }
          }, '85% dos equipamentos operacionais')
        ),

        // Card Equipamentos em Atenção
        React.createElement('div', {
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(245, 158, 11, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }
          },
            React.createElement('div', {
              style: {
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }
            },
              React.createElement('svg', {
                width: '24',
                height: '24',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: '#f59e0b',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              },
                React.createElement('path', { d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' }),
                React.createElement('line', { x1: '12', y1: '9', x2: '12', y2: '13' }),
                React.createElement('line', { x1: '12', y1: '17', x2: '12.01', y2: '17' })
              )
            ),
            React.createElement('div', {
              style: {
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#f59e0b'
              }
            }, '12')
          ),
          React.createElement('h3', {
            style: {
              fontSize: '16px',
              fontWeight: '600',
              color: '#404040',
              marginBottom: '4px'
            }
          }, 'Em Atenção'),
          React.createElement('p', {
            style: {
              fontSize: '12px',
              color: '#737373',
              margin: 0
            }
          }, 'Equipamentos com alertas')
        ),

        // Card Equipamentos Offline
        React.createElement('div', {
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(239, 68, 68, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }
          },
            React.createElement('div', {
              style: {
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }
            },
              React.createElement('svg', {
                width: '24',
                height: '24',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: '#ef4444',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              },
                React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
                React.createElement('line', { x1: '15', y1: '9', x2: '9', y2: '15' }),
                React.createElement('line', { x1: '9', y1: '9', x2: '15', y2: '15' })
              )
            ),
            React.createElement('div', {
              style: {
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#ef4444'
              }
            }, '3')
          ),
          React.createElement('h3', {
            style: {
              fontSize: '16px',
              fontWeight: '600',
              color: '#404040',
              marginBottom: '4px'
            }
          }, 'Offline'),
          React.createElement('p', {
            style: {
              fontSize: '12px',
              color: '#737373',
              margin: 0
            }
          }, 'Equipamentos sem comunicação')
        )
      ),

      // Seção de atividades recentes
      React.createElement('div', {
        style: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(125, 38, 217, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }
      },
        React.createElement('h2', {
          style: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#404040',
            marginBottom: '20px'
          }
        }, 'Atividades Recentes'),
        
        React.createElement('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
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
            React.createElement('div', {
              style: {
                flex: 1
              }
            },
              React.createElement('p', {
                style: {
                  fontSize: '13px',
                  color: '#404040',
                  margin: '0 0 2px 0'
                }
              }, 'Router Principal - Matriz voltou online'),
              React.createElement('p', {
                style: {
                  fontSize: '11px',
                  color: '#737373',
                  margin: 0
                }
              }, 'Há 2 minutos')
            )
          ),
          
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }
          },
            React.createElement('div', {
              style: {
                width: '8px',
                height: '8px',
                backgroundColor: '#f59e0b',
                borderRadius: '50%'
              }
            }),
            React.createElement('div', {
              style: {
                flex: 1
              }
            },
              React.createElement('p', {
                style: {
                  fontSize: '13px',
                  color: '#404040',
                  margin: '0 0 2px 0'
                }
              }, 'Switch Core - Data Center com alta temperatura'),
              React.createElement('p', {
                style: {
                  fontSize: '11px',
                  color: '#737373',
                  margin: 0
                }
              }, 'Há 15 minutos')
            )
          ),
          
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }
          },
            React.createElement('div', {
              style: {
                width: '8px',
                height: '8px',
                backgroundColor: '#7d26d9',
                borderRadius: '50%'
              }
            }),
            React.createElement('div', {
              style: {
                flex: 1
              }
            },
              React.createElement('p', {
                style: {
                  fontSize: '13px',
                  color: '#404040',
                  margin: '0 0 2px 0'
                }
              }, 'Backup automático realizado em 15 equipamentos'),
              React.createElement('p', {
                style: {
                  fontSize: '11px',
                  color: '#737373',
                  margin: 0
                }
              }, 'Há 1 hora')
            )
          )
        )
      )
    )
  );
}

export default Home;