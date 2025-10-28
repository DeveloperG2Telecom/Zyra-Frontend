import React, { useState } from 'react';
import { setToken } from '../utils/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação básica
      if (!email || !password) {
        alert('Por favor, preencha email e senha');
        return;
      }

      // Simular login (em produção, fazer requisição real)
      if (email && password) {
        // Gerar token mock
        const mockToken = 'mock-token-' + Date.now();
        setToken(mockToken);
        
        // Redirecionar para dashboard
        window.location.href = '/home';
      } else {
        alert('Por favor, preencha email e senha');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background moderno com efeitos geométricos */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 20%, rgba(139, 69, 255, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, rgba(139, 69, 255, 0.05) 0%, rgba(255, 107, 53, 0.05) 100%)
        `,
        backgroundSize: '600px 600px, 800px 800px, 400px 400px, 100% 100%',
        animation: 'backgroundShift 15s ease-in-out infinite'
      }} />
      
      {/* Grid moderno */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite'
      }} />
      
      {/* Formas geométricas flutuantes */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* Círculos grandes */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(139, 69, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '-150px',
          right: '-150px',
          animation: 'floatCircle 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '-100px',
          left: '-100px',
          animation: 'floatCircle 12s ease-in-out infinite reverse'
        }} />
        
        {/* Triângulos */}
        <div style={{
          position: 'absolute',
          width: '0',
          height: '0',
          borderLeft: '50px solid transparent',
          borderRight: '50px solid transparent',
          borderBottom: '87px solid rgba(59, 130, 246, 0.1)',
          top: '20%',
          right: '10%',
          animation: 'floatTriangle 10s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '0',
          height: '0',
          borderLeft: '30px solid transparent',
          borderRight: '30px solid transparent',
          borderBottom: '52px solid rgba(139, 69, 255, 0.1)',
          bottom: '30%',
          left: '15%',
          animation: 'floatTriangle 14s ease-in-out infinite reverse'
        }} />
      </div>
      
      {/* Partículas modernas */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              background: `rgba(${Math.random() > 0.5 ? '139, 69, 255' : '255, 107, 53'}, ${Math.random() * 0.5 + 0.3})`,
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `floatModern ${Math.random() * 4 + 3}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + 's',
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {/* Título Zyra no canto superior esquerdo */}
      <div style={{
        position: 'absolute',
        top: '50px',
        left: '50px',
        zIndex: 10,
        maxWidth: '500px'
      }}>
        <div style={{
          position: 'relative',
          display: 'inline-block',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}>
          <h1 style={{
            fontSize: '64px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #ff6b35 0%, #8b45ff 50%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            letterSpacing: '-3px',
            lineHeight: '0.9',
            textShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            zIndex: 2,
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #ff8c42 0%, #a855f7 50%, #60a5fa 100%)';
            e.target.style.textShadow = '0 12px 40px rgba(255, 107, 53, 0.4)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #ff6b35 0%, #8b45ff 50%, #3b82f6 100%)';
            e.target.style.textShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            e.target.style.transform = 'translateY(0)';
          }}>
            Zyra
          </h1>
          {/* Efeito de brilho atrás do texto */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(139, 69, 255, 0.2) 50%, rgba(59, 130, 246, 0.2) 100%)',
            filter: 'blur(20px)',
            zIndex: 1,
            borderRadius: '20px',
            transform: 'scale(1.1)'
          }} />
        </div>
        
        <div style={{
          marginTop: '20px',
          position: 'relative',
          zIndex: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(10px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
        }}>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.95)',
            margin: '0 0 8px 0',
            fontWeight: '400',
            letterSpacing: '0.5px',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'rgba(255, 255, 255, 1)';
            e.target.style.textShadow = '0 4px 12px rgba(255, 107, 53, 0.4)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'rgba(255, 255, 255, 0.95)';
            e.target.style.textShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
            e.target.style.transform = 'translateY(0)';
          }}>
            Sistema de Monitoramento
          </p>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: '0 0 8px 0',
            fontWeight: '300',
            letterSpacing: '0.3px',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'rgba(255, 255, 255, 0.9)';
            e.target.style.textShadow = '0 2px 8px rgba(139, 69, 255, 0.3)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'rgba(255, 255, 255, 0.7)';
            e.target.style.textShadow = 'none';
            e.target.style.transform = 'translateY(0)';
          }}>
            de Equipamentos de Rede
          </p>
          <div style={{
            width: '60px',
            height: '3px',
            background: 'linear-gradient(90deg, #ff6b35 0%, #8b45ff 100%)',
            borderRadius: '2px',
            marginTop: '15px',
            boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.width = '80px';
            e.target.style.background = 'linear-gradient(90deg, #ff8c42 0%, #a855f7 100%)';
            e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.width = '60px';
            e.target.style.background = 'linear-gradient(90deg, #ff6b35 0%, #8b45ff 100%)';
            e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.3)';
          }} />
        </div>
      </div>

      {/* Lista de funcionalidades no canto esquerdo */}
      <div style={{
        position: 'absolute',
        left: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10
      }}>
        <div style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '18px',
          lineHeight: '2.5',
          fontWeight: '300'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: 'linear-gradient(135deg, #ff6b35 0%, #8b45ff 100%)',
              borderRadius: '50%',
              marginRight: '15px'
            }} />
            Monitoramento em Tempo Real
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: 'linear-gradient(135deg, #8b45ff 0%, #ff6b35 100%)',
              borderRadius: '50%',
              marginRight: '15px'
            }} />
            Dashboard Interativo
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: 'linear-gradient(135deg, #ff6b35 0%, #8b45ff 100%)',
              borderRadius: '50%',
              marginRight: '15px'
            }} />
            Gestão de Equipamentos
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: 'linear-gradient(135deg, #8b45ff 0%, #ff6b35 100%)',
              borderRadius: '50%',
              marginRight: '15px'
            }} />
            Relatórios Avançados
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: 'linear-gradient(135deg, #ff6b35 0%, #8b45ff 100%)',
              borderRadius: '50%',
              marginRight: '15px'
            }} />
            Alertas Inteligentes
          </div>
        </div>
      </div>

      {/* Modal de credenciais no canto direito */}
      <div style={{
        position: 'absolute',
        right: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        width: '400px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #ff6b35 0%, #8b45ff 100%)',
            borderRadius: '15px',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(139, 69, 255, 0.3)'
          }}>
            <span style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white'
            }}>Z</span>
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ff6b35 0%, #8b45ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Acesso ao Sistema
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0
          }}>
            Digite suas credenciais para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '8px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#8b45ff';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 255, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '8px'
            }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#8b45ff';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 255, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'linear-gradient(135deg, #ff6b35 0%, #8b45ff 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading 
                ? 'none' 
                : '0 10px 30px rgba(139, 69, 255, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 40px rgba(139, 69, 255, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 30px rgba(139, 69, 255, 0.3)';
              }
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: 'rgba(139, 69, 255, 0.1)',
          borderRadius: '8px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center',
          border: '1px solid rgba(139, 69, 255, 0.2)'
        }}>
          <strong>Modo Desenvolvimento:</strong><br />
          Digite qualquer email e senha para entrar
        </div>
      </div>

      <style jsx>{`
        @keyframes backgroundShift {
          0%, 100% { 
            background-position: 0% 0%, 100% 100%, 50% 50%, 0% 0%;
            opacity: 1;
          }
          50% { 
            background-position: 100% 100%, 0% 0%, 100% 0%, 100% 100%;
            opacity: 0.8;
          }
        }
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes floatCircle {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.1;
          }
          50% { 
            transform: translate(30px, -30px) scale(1.1);
            opacity: 0.2;
          }
        }
        @keyframes floatTriangle {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.1;
          }
          50% { 
            transform: translate(-20px, 20px) rotate(180deg);
            opacity: 0.2;
          }
        }
        @keyframes floatModern {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-30px) rotate(180deg) scale(1.2);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;