import React, { useState } from 'react';
import Layout from './shared/Layout';
import { useLoading } from '../contexts/LoadingContext';

function TesteConexao() {
  const { showLoading, hideLoading } = useLoading();
  const [resultados, setResultados] = useState([]);
  const [host, setHost] = useState('google.com');
  const [executando, setExecutando] = useState(false);
  const [tipoResultado, setTipoResultado] = useState('');


  const simularPing = async (host) => {
    const resultados = [];
    for (let i = 0; i < 4; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const tempo = Math.floor(Math.random() * 50) + 10;
      const sucesso = Math.random() > 0.1; // 90% de sucesso
      
      resultados.push({
        sequencia: i + 1,
        host: host,
        tempo: sucesso ? `${tempo}ms` : 'timeout',
        sucesso: sucesso,
        timestamp: new Date().toLocaleTimeString()
      });
    }
    return resultados;
  };

  const simularTracert = async (host) => {
    const resultados = [];
    const hops = Math.floor(Math.random() * 8) + 5; // 5-12 hops
    
    for (let i = 1; i <= hops; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const tempo1 = Math.floor(Math.random() * 30) + 10;
      const tempo2 = Math.floor(Math.random() * 30) + 10;
      const tempo3 = Math.floor(Math.random() * 30) + 10;
      
      let ip = '';
      let hostname = '';
      
      if (i === 1) {
        ip = '192.168.1.1';
        hostname = 'gateway.local';
      } else if (i === hops) {
        ip = host;
        hostname = host;
      } else {
        ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        hostname = `router-${i}.isp.com`;
      }
      
      resultados.push({
        hop: i,
        ip: ip,
        hostname: hostname,
        tempo1: `${tempo1}ms`,
        tempo2: `${tempo2}ms`,
        tempo3: `${tempo3}ms`,
        timestamp: new Date().toLocaleTimeString()
      });
    }
    return resultados;
  };


  const executarPing = async () => {
    if (!host.trim()) return;
    
    setExecutando(true);
    setResultados([]);
    setTipoResultado('ping');
    showLoading('Executando PING...');

    try {
      const resultado = await simularPing(host);
      setResultados(resultado);
    } catch (error) {
      console.error('Erro ao executar ping:', error);
    } finally {
      setExecutando(false);
      hideLoading();
    }
  };

  const executarTracert = async () => {
    if (!host.trim()) return;
    
    setExecutando(true);
    setResultados([]);
    setTipoResultado('tracert');
    showLoading('Executando TRACERT...');

    try {
      const resultado = await simularTracert(host);
      setResultados(resultado);
    } catch (error) {
      console.error('Erro ao executar tracert:', error);
    } finally {
      setExecutando(false);
      hideLoading();
    }
  };


  const limparResultados = () => {
    setResultados([]);
  };

  return React.createElement(Layout, { currentPage: '/teste-conexao' },
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
        })
      )
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
            }, 'Teste de Conexão'),
            React.createElement('p', { 
              style: {
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }, 'Ferramentas de diagnóstico de rede')
          )
        ),
        
        // Painel de controle
        React.createElement('div', { 
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            border: '1px solid rgba(125, 38, 217, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        },
          React.createElement('div', { 
            style: {
              display: 'flex',
              alignItems: 'end',
              gap: '16px'
            }
          },
            // Campo de host
            React.createElement('div', { 
              style: {
                flex: 1
              }
            },
              React.createElement('label', { 
                style: {
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#404040',
                  display: 'block',
                  marginBottom: '6px'
                }
              }, 'Host/Domínio'),
              React.createElement('input', {
                type: 'text',
                value: host,
                onChange: (e) => setHost(e.target.value),
                placeholder: 'Ex: google.com, 8.8.8.8',
                style: {
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #d4d4d4',
                  borderRadius: '6px',
                  fontSize: '12px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                },
                onFocus: (e) => e.target.style.borderColor = '#7d26d9',
                onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
              })
            ),
            
            // Botões de teste
            React.createElement('div', { 
              style: {
                display: 'flex',
                gap: '12px'
              }
            },
              // Botão PING
              React.createElement('button', {
                onClick: executarPing,
                disabled: executando || !host.trim(),
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: executando ? '#d4d4d4' : 'rgba(16, 185, 129, 0.9)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: executando ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  minWidth: '80px'
                }
              }, 'PING'),
              
              // Botão TRACERT
              React.createElement('button', {
                onClick: executarTracert,
                disabled: executando || !host.trim(),
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: executando ? '#d4d4d4' : 'rgba(59, 130, 246, 0.9)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: executando ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  minWidth: '80px'
                }
              }, 'TRACERT')
            ),
            
            // Botão limpar
            React.createElement('button', {
              onClick: limparResultados,
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #d4d4d4',
                background: 'white',
                color: '#404040',
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
                React.createElement('path', { d: 'M3 6h18' }),
                React.createElement('path', { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' }),
                React.createElement('path', { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' })
              ),
              'Limpar'
            )
          )
        ),
        
        // Resultados
        resultados.length > 0 && React.createElement('div', { 
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(125, 38, 217, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        },
          React.createElement('div', { 
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }
          },
            React.createElement('h3', { 
              style: {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#404040',
                margin: 0
              }
            }, `Resultados do ${tipoResultado.toUpperCase()}`),
            React.createElement('span', { 
              style: {
                fontSize: '10px',
                color: '#737373',
                backgroundColor: 'rgba(125, 38, 217, 0.1)',
                padding: '4px 8px',
                borderRadius: '4px'
              }
            }, `${resultados.length} ${resultados.length === 1 ? 'resultado' : 'resultados'}`)
          ),
          
          // Conteúdo dos resultados baseado no tipo de teste
          tipoResultado === 'ping' && React.createElement('div', { 
            style: {
              fontFamily: 'monospace',
              fontSize: '11px',
              lineHeight: 1.6
            }
          },
            React.createElement('div', { 
              style: {
                color: '#404040',
                marginBottom: '8px'
              }
            }, `Pingando ${host} com 32 bytes de dados:`),
            resultados.map((resultado, index) =>
              React.createElement('div', {
                key: index,
                style: {
                  color: resultado.sucesso ? '#10b981' : '#ef4444',
                  marginBottom: '4px'
                }
              }, 
                `Resposta de ${resultado.host}: bytes=32 tempo=${resultado.tempo} TTL=64`
              )
            ),
            React.createElement('div', { 
              style: {
                color: '#404040',
                marginTop: '12px',
                paddingTop: '8px',
                borderTop: '1px solid #e5e5e5'
              }
            }, 
              `Estatísticas do Ping para ${host}:`,
              React.createElement('br'),
              `    Pacotes: Enviados = 4, Recebidos = ${resultados.filter(r => r.sucesso).length}, Perdidos = ${resultados.filter(r => !r.sucesso).length} (${Math.round((resultados.filter(r => !r.sucesso).length / resultados.length) * 100)}% de perda)`
            )
          ),
          
          tipoResultado === 'tracert' && React.createElement('div', { 
            style: {
              fontFamily: 'monospace',
              fontSize: '11px',
              lineHeight: 1.6
            }
          },
            React.createElement('div', { 
              style: {
                color: '#404040',
                marginBottom: '12px'
              }
            }, `Rastreamento da rota para ${host} [${host}]`),
            React.createElement('div', { 
              style: {
                color: '#404040',
                marginBottom: '8px'
              }
            }, 'máximo de 30 saltos:'),
            resultados.map((resultado, index) =>
              React.createElement('div', {
                key: index,
                style: {
                  color: '#404040',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }
              },
                React.createElement('span', { 
                  style: { 
                    minWidth: '20px',
                    color: '#7d26d9',
                    fontWeight: 'bold'
                  }
                }, `${resultado.hop}`),
                React.createElement('span', { 
                  style: { 
                    minWidth: '120px',
                    color: '#10b981'
                  }
                }, `${resultado.tempo1} ${resultado.tempo2} ${resultado.tempo3}`),
                React.createElement('span', { 
                  style: { 
                    minWidth: '150px',
                    color: '#404040'
                  }
                }, resultado.hostname),
                React.createElement('span', { 
                  style: { 
                    color: '#737373'
                  }
                }, `[${resultado.ip}]`)
              )
            )
          ),
          
        )
      )
    )
  );
}

export default TesteConexao;
