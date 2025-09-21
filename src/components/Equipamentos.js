import React, { useState } from 'react';
import Layout from './shared/Layout';

function Equipamentos() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnimating, setSidebarAnimating] = useState(false);
  const [sidebarAnimatingOut, setSidebarAnimatingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipamento, setSelectedEquipamento] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Dados mock dos equipamentos
  const equipamentos = [
    {
      id: 1,
      nome: 'Router Principal - Matriz',
      modelo: 'RB4011iGS+RM',
      fabricante: 'Mikrotik',
      serial: '7C2E8D123456',
      mac: '48:8F:5A:2E:8D:12',
      ipPublico: '200.160.2.100',
      ipPrivado: '192.168.1.1',
      foto: '/logo-sem-fundo.png', // Placeholder
      portas: 10,
      alimentacao: 'PoE+ 24V, 30W',
      dataAquisicao: '2023-01-15',
      garantia: '24 meses',
      firmware: 'RouterOS 7.10.2',
      localidade: 'São Paulo - SP',
      equipamentoAnterior: null, // Primeiro da sequência
      equipamentoProximo: {
        id: 2,
        nome: 'Switch Core - Data Center',
        ipPrivado: '192.168.1.2'
      }
    },
    {
      id: 2,
      nome: 'Switch Core - Data Center',
      modelo: 'CRS326-24G-2S+RM',
      fabricante: 'Mikrotik',
      serial: '7C2E8D789012',
      mac: '48:8F:5A:2E:8D:78',
      ipPublico: '200.160.2.101',
      ipPrivado: '192.168.1.2',
      foto: '/logo-sem-fundo.png',
      portas: 26,
      alimentacao: 'AC 100-240V, 20W',
      dataAquisicao: '2023-02-20',
      garantia: '36 meses',
      firmware: 'RouterOS 7.10.2',
      localidade: 'São Paulo - SP',
      equipamentoAnterior: {
        id: 1,
        nome: 'Router Principal - Matriz',
        ipPrivado: '192.168.1.1'
      },
      equipamentoProximo: {
        id: 3,
        nome: 'AP WiFi - Piso 1',
        ipPrivado: '192.168.1.10'
      }
    },
    {
      id: 3,
      nome: 'AP WiFi - Piso 1',
      modelo: 'cAP ac',
      fabricante: 'Mikrotik',
      serial: '7C2E8D345678',
      mac: '48:8F:5A:2E:8D:34',
      ipPublico: '200.160.2.102',
      ipPrivado: '192.168.1.10',
      foto: '/logo-sem-fundo.png',
      portas: 1,
      alimentacao: 'PoE 24V, 6W',
      dataAquisicao: '2023-03-10',
      garantia: '24 meses',
      firmware: 'RouterOS 7.10.2',
      localidade: 'São Paulo - SP',
      equipamentoAnterior: {
        id: 2,
        nome: 'Switch Core - Data Center',
        ipPrivado: '192.168.1.2'
      },
      equipamentoProximo: {
        id: 4,
        nome: 'Router Filial - Rio',
        ipPrivado: '192.168.2.1'
      }
    },
    {
      id: 4,
      nome: 'Router Filial - Rio',
      modelo: 'RB750Gr3',
      fabricante: 'Mikrotik',
      serial: '7C2E8D901234',
      mac: '48:8F:5A:2E:8D:90',
      ipPublico: '200.160.3.100',
      ipPrivado: '192.168.2.1',
      foto: '/logo-sem-fundo.png',
      portas: 5,
      alimentacao: 'AC 100-240V, 8W',
      dataAquisicao: '2023-04-05',
      garantia: '24 meses',
      firmware: 'RouterOS 7.9.2',
      localidade: 'Rio de Janeiro - RJ',
      equipamentoAnterior: {
        id: 3,
        nome: 'AP WiFi - Piso 1',
        ipPrivado: '192.168.1.10'
      },
      equipamentoProximo: {
        id: 5,
        nome: 'Switch Edge - Filial BH',
        ipPrivado: '192.168.3.1'
      }
    },
    {
      id: 5,
      nome: 'Switch Edge - Filial BH',
      modelo: 'CRS112-8P-4S-IN',
      fabricante: 'Mikrotik',
      serial: '7C2E8D567890',
      mac: '48:8F:5A:2E:8D:56',
      ipPublico: '200.160.4.100',
      ipPrivado: '192.168.3.1',
      foto: '/logo-sem-fundo.png',
      portas: 12,
      alimentacao: 'PoE 24V, 15W',
      dataAquisicao: '2023-05-12',
      garantia: '24 meses',
      firmware: 'RouterOS 7.8.5',
      localidade: 'Belo Horizonte - MG',
      equipamentoAnterior: {
        id: 4,
        nome: 'Router Filial - Rio',
        ipPrivado: '192.168.2.1'
      },
      equipamentoProximo: null // Último da sequência
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

  const handleEquipamentoClick = (equipamento) => {
    setSelectedEquipamento(equipamento);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEquipamento(null);
  };

  // Fechar menu de opções quando clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOptionsMenu && !event.target.closest('[data-options-menu]')) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptionsMenu]);

  const filteredEquipamentos = equipamentos.filter(equipamento =>
    equipamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipamento.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipamento.fabricante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipamento.ipPrivado.includes(searchTerm) ||
    equipamento.localidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return React.createElement(Layout, { currentPage: '/equipamentos' },
    // Background Animado (mesmo da tela de login)
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
          onClick: () => window.location.href = '/monitoramento',
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
            React.createElement('path', { d: 'M22 12h-4l-3 9L9 3l-3 9H2' })
          ),
          'Monitoramento'
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
        // Filtros específicos para equipamentos
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
            }, 'Pesquisar Equipamento'),
            React.createElement('input', {
              type: 'text',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              placeholder: 'Nome, modelo, IP, localidade...',
              style: {
                width: '100%',
                padding: '8px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '11px',
                outline: 'none',
                transition: 'border-color 0.2s',
                marginBottom: '16px'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
            })
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
            }, 'Filtros por Fabricante'),
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
                React.createElement('span', { style: { fontSize: '12px' } }, '🔧'),
                'Mikrotik'
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
                React.createElement('span', { style: { fontSize: '12px' } }, '📡'),
                'Huawei'
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
                'Ubiquiti'
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
            }, 'Status'),
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
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontSize: '10px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }
              },
                React.createElement('span', { style: { fontSize: '12px' } }, '✅'),
                'Online'
              ),
              React.createElement('button', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: '#f59e0b',
                  fontSize: '10px',
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
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  fontSize: '10px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }
              },
                React.createElement('span', { style: { fontSize: '12px' } }, '❌'),
                'Offline'
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
            }, 'Equipamentos'),
            React.createElement('p', { 
              style: {
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }, `${filteredEquipamentos.length} equipamentos encontrados`)
          ),
          React.createElement('div', { 
            'data-options-menu': true,
            style: {
              position: 'relative'
            }
          },
            React.createElement('button', {
              onClick: () => setShowOptionsMenu(!showOptionsMenu),
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                backgroundColor: 'rgba(125, 38, 217, 0.2)',
                border: '1px solid rgba(125, 38, 217, 0.3)',
                borderRadius: '8px',
                color: 'white',
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
                React.createElement('circle', { cx: '12', cy: '12', r: '3' }),
                React.createElement('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' })
              )
            ),
            
            // Menu de opções
            showOptionsMenu && React.createElement('div', { 
              style: {
                position: 'absolute',
                top: '40px',
                right: '0',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(125, 38, 217, 0.1)',
                minWidth: '160px',
                zIndex: 1000
              }
            },
              React.createElement('button', {
                onClick: () => {
                  setShowOptionsMenu(false);
                  // Aqui seria a lógica para adicionar equipamento
                },
                style: {
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#404040',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  borderBottom: '1px solid rgba(125, 38, 217, 0.1)'
                }
              },
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }
                },
                  React.createElement('svg', {
                    width: '14',
                    height: '14',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: '2',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round'
                  },
                    React.createElement('line', { x1: '12', y1: '5', x2: '12', y2: '19' }),
                    React.createElement('line', { x1: '5', y1: '12', x2: '19', y2: '12' })
                  ),
                  'Adicionar Equipamento'
                )
              ),
              React.createElement('button', {
                onClick: () => {
                  setShowOptionsMenu(false);
                  // Aqui seria a lógica para importar equipamentos
                },
                style: {
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#404040',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  borderBottom: '1px solid rgba(125, 38, 217, 0.1)'
                }
              },
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }
                },
                  React.createElement('svg', {
                    width: '14',
                    height: '14',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: '2',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round'
                  },
                    React.createElement('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
                    React.createElement('polyline', { points: '7,10 12,15 17,10' }),
                    React.createElement('line', { x1: '12', y1: '15', x2: '12', y2: '3' })
                  ),
                  'Importar Equipamentos'
                )
              ),
              React.createElement('button', {
                onClick: () => {
                  setShowOptionsMenu(false);
                  // Aqui seria a lógica para exportar equipamentos
                },
                style: {
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#404040',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  borderBottom: '1px solid rgba(125, 38, 217, 0.1)'
                }
              },
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }
                },
                  React.createElement('svg', {
                    width: '14',
                    height: '14',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: '2',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round'
                  },
                    React.createElement('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
                    React.createElement('polyline', { points: '17,8 12,3 7,8' }),
                    React.createElement('line', { x1: '12', y1: '3', x2: '12', y2: '15' })
                  ),
                  'Exportar Equipamentos'
                )
              ),
              React.createElement('button', {
                onClick: () => {
                  setShowOptionsMenu(false);
                  // Aqui seria a lógica para configurações
                },
                style: {
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#404040',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }
              },
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }
                },
                  React.createElement('svg', {
                    width: '14',
                    height: '14',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: '2',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round'
                  },
                    React.createElement('circle', { cx: '12', cy: '12', r: '3' }),
                    React.createElement('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' })
                  ),
                  'Configurações'
                )
              )
            )
          )
        ),
        
        // Lista de equipamentos
        React.createElement('div', { 
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '12px'
          }
        },
          filteredEquipamentos.map(equipamento =>
            React.createElement('div', {
              key: equipamento.id,
              onClick: () => handleEquipamentoClick(equipamento),
              style: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer',
                border: '1px solid rgba(125, 38, 217, 0.1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }
            },
              React.createElement('div', { 
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }
              },
                React.createElement('div', { 
                  style: {
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'rgba(125, 38, 217, 0.1)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }
                }, '🖥️'),
                React.createElement('div', { 
                  style: {
                    flex: 1,
                    minWidth: 0
                  }
                },
                  React.createElement('h3', { 
                    style: {
                      fontSize: '12px',
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
                      margin: 0
                    }
                  }, `${equipamento.fabricante} ${equipamento.modelo}`)
                )
              ),
              React.createElement('div', { 
                style: {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  fontSize: '10px',
                  color: '#525252'
                }
              },
                React.createElement('div', null,
                  React.createElement('span', { 
                    style: {
                      fontWeight: '500',
                      color: '#404040'
                    }
                  }, 'IP: '),
                  equipamento.ipPrivado
                ),
                React.createElement('div', null,
                  React.createElement('span', { 
                    style: {
                      fontWeight: '500',
                      color: '#404040'
                    }
                  }, 'Local: '),
                  equipamento.localidade
                )
              ),
              React.createElement('div', { 
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(125, 38, 217, 0.1)'
                }
              },
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '9px',
                    color: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }
                },
                  React.createElement('div', { 
                    style: {
                      width: '4px',
                      height: '4px',
                      backgroundColor: '#10b981',
                      borderRadius: '50%'
                    }
                  }),
                  'Online'
                ),
                React.createElement('span', { 
                  style: {
                    fontSize: '9px',
                    color: '#737373'
                  }
                }, `${equipamento.portas} portas`)
              )
            )
          )
        )
      )
    ),
    
    // Modal de detalhes
    modalVisible && React.createElement('div', { 
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
          maxWidth: '900px',
          width: '100%',
          maxHeight: '85vh',
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
                backgroundColor: 'rgba(125, 38, 217, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }
            }, '🖥️'),
            React.createElement('div', null,
              React.createElement('h3', { 
                style: {
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#404040',
                  marginBottom: '2px'
                }
              }, selectedEquipamento?.nome),
              React.createElement('p', { 
                style: {
                  fontSize: '12px',
                  color: '#737373',
                  margin: 0
                }
              }, `${selectedEquipamento?.fabricante} ${selectedEquipamento?.modelo}`)
            )
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
        
        // Conteúdo do modal
        React.createElement('div', { 
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }
        },
          // Coluna esquerda
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
              }, 'Serial/MAC'),
              React.createElement('p', { 
                style: {
                  fontSize: '12px',
                  color: '#525252',
                  margin: 0,
                  fontFamily: 'monospace'
                }
              }, `${selectedEquipamento?.serial} / ${selectedEquipamento?.mac}`)
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
              }, 'IP Público'),
              React.createElement('p', { 
                style: {
                  fontSize: '12px',
                  color: '#525252',
                  margin: 0,
                  fontFamily: 'monospace'
                }
              }, selectedEquipamento?.ipPublico)
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
              }, 'IP Privado'),
              React.createElement('p', { 
                style: {
                  fontSize: '12px',
                  color: '#525252',
                  margin: 0,
                  fontFamily: 'monospace'
                }
              }, selectedEquipamento?.ipPrivado)
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
              }, selectedEquipamento?.localidade)
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
              }, 'Quantidade de Portas'),
              React.createElement('p', { 
                style: {
                  fontSize: '12px',
                  color: '#525252',
                  margin: 0
                }
              }, selectedEquipamento?.portas)
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
              }, 'Equipamento Anterior'),
              React.createElement('p', { 
                style: {
                  fontSize: '12px',
                  color: '#525252',
                  margin: 0
                }
              }, selectedEquipamento?.equipamentoAnterior ? 
                `${selectedEquipamento.equipamentoAnterior.nome} (${selectedEquipamento.equipamentoAnterior.ipPrivado})` : 
                'Nenhum (Primeiro da sequência)')
            )
          ),
          
          // Coluna direita
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
              }, 'Alimentação'),
              React.createElement('p', { 
                style: {
                  fontSize: '12px',
                  color: '#525252',
                  margin: 0
                }
              }, selectedEquipamento?.alimentacao)
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
              }, 'Data de Aquisição'),
              React.createElement('p', { 
                style: {
                  fontSize: '12px',
                  color: '#525252',
                  margin: 0
                }
              }, new Date(selectedEquipamento?.dataAquisicao).toLocaleDateString('pt-BR'))
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
              }, 'Tempo de Garantia'),
              React.createElement('p', { 
                style: {
                  fontSize: '12px',
                  color: '#525252',
                  margin: 0
                }
              }, selectedEquipamento?.garantia)
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
              }, 'Versão de Firmware'),
              React.createElement('p', { 
                style: {
                  fontSize: '12px',
                  color: '#525252',
                  margin: 0,
                  fontFamily: 'monospace'
                }
              }, selectedEquipamento?.firmware)
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
              }, 'Equipamento Próximo'),
              React.createElement('p', { 
                style: {
                  fontSize: '12px',
                  color: '#525252',
                  margin: 0
                }
              }, selectedEquipamento?.equipamentoProximo ? 
                `${selectedEquipamento.equipamentoProximo.nome} (${selectedEquipamento.equipamentoProximo.ipPrivado})` : 
                'Nenhum (Último da sequência)')
            )
          )
        ),
        
        // Foto do equipamento
        React.createElement('div', { 
          style: {
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e5e5'
          }
        },
          React.createElement('label', { 
            style: {
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#404040',
              display: 'block',
              marginBottom: '8px'
            }
          }, 'Foto do Equipamento'),
          React.createElement('div', { 
            style: {
              width: '100%',
              height: '120px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #d4d4d4'
            }
          },
            React.createElement('div', { 
              style: {
                textAlign: 'center',
                color: '#737373'
              }
            },
              React.createElement('div', { 
                style: {
                  fontSize: '24px',
                  marginBottom: '8px'
                }
              }, '📷'),
              React.createElement('p', { 
                style: {
                  fontSize: '11px',
                  margin: 0
                }
              }, 'Foto será carregada do Firebase Storage')
            )
          )
        )
      )
    )
  );
}

export default Equipamentos;
