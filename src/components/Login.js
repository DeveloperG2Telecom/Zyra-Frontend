import React, { useState } from 'react';
import { useLoading } from '../contexts/LoadingContext';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { loading, showLoading, hideLoading } = useLoading();

  const handleSubmit = (e) => {
    e.preventDefault();
    showLoading('Entrando no sistema...');
    console.log('Login:', { usuario, senha });
    
    // Simular loading por 2 segundos e redirecionar para home
    setTimeout(() => {
      hideLoading();
      // Redirecionar para a página home sem verificação de credenciais
      window.location.href = '/home';
    }, 2000);
  };

  return React.createElement('div', { 
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative'
    }
  },
    // Background Animado Completo
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
            width: '8px',
            height: '8px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 20px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite',
            top: '20%',
            left: '10%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 20px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 0.5s',
            top: '30%',
            left: '80%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 20px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 1s',
            top: '60%',
            left: '20%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 20px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 1.5s',
            top: '70%',
            left: '70%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 20px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 2s',
            top: '40%',
            left: '50%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 20px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 2.5s',
            top: '80%',
            left: '40%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 20px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 3s',
            top: '15%',
            left: '60%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 20px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 3.5s',
            top: '50%',
            left: '90%'
          }
        })
      ),
      
      // Linhas de conexão com fluxo de dados
      React.createElement('div', { 
        style: {
          position: 'absolute',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #7d26d9, transparent)',
          animation: 'data-flow 3s ease-in-out infinite',
          top: '25%',
          left: '10%',
          width: '70%',
          transform: 'rotate(15deg)'
        }
      }),
      React.createElement('div', { 
        style: {
          position: 'absolute',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #7d26d9, transparent)',
          animation: 'data-flow 3s ease-in-out infinite 1s',
          top: '45%',
          left: '20%',
          width: '50%',
          transform: 'rotate(-20deg)'
        }
      }),
      React.createElement('div', { 
        style: {
          position: 'absolute',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #7d26d9, transparent)',
          animation: 'data-flow 3s ease-in-out infinite 2s',
          top: '65%',
          left: '30%',
          width: '40%',
          transform: 'rotate(10deg)'
        }
      }),
      
      // Ícones de equipamentos flutuantes
      React.createElement('div', { 
        style: {
          position: 'absolute',
          color: 'rgba(251, 143, 55, 0.3)',
          fontSize: '24px',
          animation: 'float 6s ease-in-out infinite',
          top: '10%',
          left: '5%'
        }
      }, '📡'),
      React.createElement('div', { 
        style: {
          position: 'absolute',
          color: 'rgba(251, 143, 55, 0.3)',
          fontSize: '24px',
          animation: 'float 6s ease-in-out infinite 2s',
          top: '25%',
          right: '10%'
        }
      }, '🌐'),
      React.createElement('div', { 
        style: {
          position: 'absolute',
          color: 'rgba(251, 143, 55, 0.3)',
          fontSize: '24px',
          animation: 'float 6s ease-in-out infinite 4s',
          bottom: '20%',
          left: '15%'
        }
      }, '📶'),
      React.createElement('div', { 
        style: {
          position: 'absolute',
          color: 'rgba(251, 143, 55, 0.3)',
          fontSize: '24px',
          animation: 'float 6s ease-in-out infinite 1s',
          bottom: '30%',
          right: '20%'
        }
      }, '🔌')
    ),
    
    // Layout principal
    React.createElement('div', { 
      style: {
        display: 'flex',
        width: '100%',
        maxWidth: '1200px',
        gap: '40px',
        alignItems: 'center'
      }
    },
      // Seção de propaganda/slogan (esquerda)
      React.createElement('div', { 
        style: {
          flex: 1,
          color: 'white',
          textAlign: 'left',
          padding: '40px'
        }
      },
        React.createElement('div', { 
          style: {
            marginBottom: '40px'
          }
        },
          React.createElement('img', { 
            src: '/logo-sem-fundo.png', 
            alt: 'Zyra Logo', 
            style: {
              width: '120px',
              height: '120px',
              marginBottom: '24px',
              objectFit: 'contain'
            }
          }),
          React.createElement('h1', { 
            style: {
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '12px',
              background: 'linear-gradient(45deg, #7d26d9, #fb8f37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }
          }, 'Zyra'),
          React.createElement('h2', { 
            style: {
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '24px',
              color: 'rgba(255, 255, 255, 0.9)'
            }
          }, 'Sistema de Monitoramento de Equipamentos')
        ),
        
        React.createElement('div', { 
          style: {
            fontSize: '12px',
            lineHeight: '1.5',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '24px'
          }
        },
          React.createElement('p', { style: { marginBottom: '8px' } }, '🎯 Controle total da sua infraestrutura de rede'),
          React.createElement('p', { style: { marginBottom: '8px' } }, '📊 Monitoramento em tempo real'),
          React.createElement('p', { style: { marginBottom: '8px' } }, '🔔 Alertas inteligentes'),
          React.createElement('p', { style: { marginBottom: '8px' } }, '💾 Gestão de backups'),
          React.createElement('p', { style: { marginBottom: '8px' } }, '🌐 Topologia visual da rede')
        ),
        
        React.createElement('div', { 
          style: {
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontStyle: 'italic'
          }
        }, '"Conectando o futuro da sua rede"')
      ),
      
      // Card de Login (direita)
      React.createElement('div', { 
        style: {
          flex: '0 0 400px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          zIndex: 10
        }
      },
        React.createElement('div', { 
          style: { textAlign: 'center', marginBottom: '32px' }
        },
          React.createElement('h3', { 
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#7d26d9',
              marginBottom: '6px'
            }
          }, 'Entrar'),
          React.createElement('p', { 
            style: {
              fontSize: '11px',
              color: '#737373'
            }
          }, 'Acesse sua conta para continuar')
        ),
        
        React.createElement('form', { 
          onSubmit: handleSubmit,
          style: { display: 'flex', flexDirection: 'column', gap: '20px' }
        },
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
            React.createElement('label', { 
              style: {
                fontSize: '11px',
                fontWeight: '500',
                color: '#404040'
              }
            }, 'Usuário'),
            React.createElement('input', {
              type: 'text',
              value: usuario,
              onChange: (e) => setUsuario(e.target.value),
              style: {
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '8px',
                fontSize: '11px',
                outline: 'none',
                transition: 'border-color 0.2s'
              },
              placeholder: 'Digite seu usuário',
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
            })
          ),
          
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
            React.createElement('label', { 
              style: {
                fontSize: '11px',
                fontWeight: '500',
                color: '#404040'
              }
            }, 'Senha'),
            React.createElement('div', { 
              style: { position: 'relative' }
            },
              React.createElement('input', {
                type: mostrarSenha ? 'text' : 'password',
                value: senha,
                onChange: (e) => setSenha(e.target.value),
                style: {
                  padding: '10px 40px 10px 12px',
                  border: '2px solid #d4d4d4',
                  borderRadius: '8px',
                  fontSize: '11px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  width: '100%'
                },
                placeholder: 'Digite sua senha',
                onFocus: (e) => e.target.style.borderColor = '#7d26d9',
                onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
              }),
              React.createElement('button', {
                type: 'button',
                onClick: () => setMostrarSenha(!mostrarSenha),
                style: {
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#737373',
                  padding: '4px',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }, 
                mostrarSenha ? 
                  React.createElement('svg', {
                    width: '20',
                    height: '20',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: '2',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round'
                  },
                    React.createElement('path', { d: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' }),
                    React.createElement('line', { x1: '1', y1: '1', x2: '23', y2: '23' })
                  ) :
                  React.createElement('svg', {
                    width: '20',
                    height: '20',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: '2',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round'
                  },
                    React.createElement('path', { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' }),
                    React.createElement('circle', { cx: '12', cy: '12', r: '3' })
                  )
              )
            )
          ),
          
          React.createElement('button', { 
            type: 'submit',
            disabled: loading,
            style: {
              padding: '10px 20px',
              backgroundColor: loading ? '#a3a3a3' : '#7d26d9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              width: '100%'
            },
            onMouseOver: (e) => {
              if (!loading) e.target.style.backgroundColor = '#6b1bc7';
            },
            onMouseOut: (e) => {
              if (!loading) e.target.style.backgroundColor = '#7d26d9';
            }
          }, loading ? 'Entrando...' : 'Entrar'),
          
          // Link para cadastro
          React.createElement('div', { 
            style: {
              textAlign: 'center',
              marginTop: '16px'
            }
          },
            React.createElement('p', { 
              style: {
                fontSize: '11px',
                color: '#737373'
              }
            }, 'Não tem uma conta? '),
            React.createElement('a', {
              href: '/register',
              style: {
                color: '#7d26d9',
                textDecoration: 'none',
                fontWeight: '500'
              }
            }, 'Criar conta')
          )
        )
      )
    )
  );
}

export default Login;