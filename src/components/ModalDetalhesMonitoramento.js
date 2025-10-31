import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const getMetricaColor = (valor) => {
  if (valor >= 1 && valor <= 20) return '#10b981'; // Verde
  if (valor >= 21 && valor <= 30) return '#f59e0b'; // Laranja
  if (valor >= 31) return '#ef4444'; // Vermelho
  return '#6b7280'; // Cinza
};

const getStatusColor = (online) => {
  return online ? '#10b981' : '#ef4444';
};

function ModalDetalhesMonitoramento({ equipamento, dadosMonitoramento, onClose }) {
  const [historico, setHistorico] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(true);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [animarGrafico, setAnimarGrafico] = useState(true);
  const [chaveGrafico, setChaveGrafico] = useState(0);

  const carregarHistorico = async (animar = false) => {
    try {
      setLoadingHistorico(true);
      const response = await api.getHistoricoPing(equipamento.id, 50);
      if (response.success && response.data && response.data.historico) {
        const historicoOrdenado = [...response.data.historico].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setHistorico(historicoOrdenado);
        
        // Preparar dados para o gráfico
        const dados = historicoOrdenado.map((item, index) => ({
          name: `#${index + 1}`,
          latencia: item.online && item.latencia ? item.latencia : null,
          timestamp: new Date(item.timestamp).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })
        }));
        
        setDadosGrafico(dados);
        
        // Se deve animar, atualizar chave e ativar animação
        if (animar) {
          // Aguardar um pouco para garantir que os dados foram atualizados
          setTimeout(() => {
            setChaveGrafico(prev => prev + 1);
            setAnimarGrafico(true);
            
            // Após 3 segundos (1s de animação + 2s estático), desativar animação
            setTimeout(() => {
              setAnimarGrafico(false);
            }, 3000);
          }, 100);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setHistorico([]);
    } finally {
      setLoadingHistorico(false);
    }
  };

  useEffect(() => {
    if (equipamento && equipamento.id) {
      carregarHistorico(true); // Primeira carga com animação
    }
  }, [equipamento]);

  // Atualiza automaticamente quando um novo ping for registrado (mudança no ultimoPing)
  useEffect(() => {
    const ultimo = dadosMonitoramento?.[equipamento?.id]?.ultimoPing;
    if (!equipamento || !equipamento.id) return;
    if (!ultimo) return;
    
    // Carregar histórico com animação
    carregarHistorico(true);
  }, [dadosMonitoramento?.[equipamento?.id]?.ultimoPing, equipamento]);

  if (!equipamento) return null;

  const dadosAtuais = dadosMonitoramento[equipamento.id] || {
    latencia: 0,
    online: false,
    ultimoPing: null,
    erro: null
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    },
    onClick: onClose
  },
    React.createElement('div', {
      style: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      },
      onClick: (e) => e.stopPropagation()
    },
      // Header
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '2px solid #e5e7eb'
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
              width: '12px',
              height: '12px',
              backgroundColor: getStatusColor(dadosAtuais.online),
              borderRadius: '50%'
            }
          }),
          React.createElement('h2', {
            style: {
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0
            }
          }, equipamento.nome || 'Equipamento')
        ),
        React.createElement('button', {
          onClick: onClose,
          style: {
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '4px 8px',
            borderRadius: '6px',
            lineHeight: 1
          }
        }, '×')
      ),

      // Informações Principais
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }
      },
        React.createElement('div', {
          style: {
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }
        },
          React.createElement('div', {
            style: {
              fontSize: '12px',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '4px'
            }
          }, 'IP Privado'),
          React.createElement('div', {
            style: {
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b',
              fontFamily: 'monospace'
            }
          }, equipamento.ipPrivado || 'Não informado')
        ),
        React.createElement('div', {
          style: {
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }
        },
          React.createElement('div', {
            style: {
              fontSize: '12px',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '4px'
            }
          }, 'Latência Atual'),
          React.createElement('div', {
            style: {
              fontSize: '18px',
              fontWeight: 'bold',
              color: dadosAtuais.latencia > 0 ? getMetricaColor(dadosAtuais.latencia) : '#6b7280',
              fontFamily: 'monospace'
            }
          }, dadosAtuais.latencia > 0 ? `${dadosAtuais.latencia}ms` : dadosAtuais.erro ? 'Offline' : '--')
        ),
        React.createElement('div', {
          style: {
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }
        },
          React.createElement('div', {
            style: {
              fontSize: '12px',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '4px'
            }
          }, 'Status'),
          React.createElement('div', {
            style: {
              fontSize: '14px',
              fontWeight: '600',
              color: getStatusColor(dadosAtuais.online)
            }
          }, dadosAtuais.online ? 'Online' : 'Offline')
        ),
        React.createElement('div', {
          style: {
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }
        },
          React.createElement('div', {
            style: {
              fontSize: '12px',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '4px'
            }
          }, 'Último Ping'),
          React.createElement('div', {
            style: {
              fontSize: '12px',
              color: '#475569'
            }
          }, dadosAtuais.ultimoPing ? formatTime(dadosAtuais.ultimoPing) : 'N/A')
        )
      ),

      // Tipo e Modelo (se disponível)
      (equipamento.tipo || equipamento.modelo) && React.createElement('div', {
        style: {
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          padding: '12px',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px'
        }
      },
        equipamento.tipo && React.createElement('div', null,
          React.createElement('span', {
            style: {
              fontSize: '12px',
              fontWeight: '600',
              color: '#64748b',
              marginRight: '8px'
            }
          }, 'Tipo:'),
          React.createElement('span', {
            style: {
              fontSize: '13px',
              color: '#1e293b'
            }
          }, equipamento.tipo)
        ),
        equipamento.modelo && React.createElement('div', null,
          React.createElement('span', {
            style: {
              fontSize: '12px',
              fontWeight: '600',
              color: '#64748b',
              marginRight: '8px'
            }
          }, 'Modelo:'),
          React.createElement('span', {
            style: {
              fontSize: '13px',
              color: '#1e293b'
            }
          }, equipamento.modelo)
        )
      ),

      // Gráfico de Latência
      React.createElement('div', {
        style: {
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }
      },
        React.createElement('h3', {
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '16px'
          }
        }, '📊 Histórico de Latência (Últimos 50 pings)'),
        loadingHistorico ? React.createElement('div', {
          style: {
            padding: '40px',
            textAlign: 'center',
            color: '#64748b'
          }
        }, 'Carregando histórico...') : dadosGrafico.length > 0 ? React.createElement(ResponsiveContainer, {
          width: '100%',
          height: 250,
          key: `container-${chaveGrafico}`
        },
          React.createElement(LineChart, {
            data: dadosGrafico,
            margin: { top: 5, right: 20, left: 0, bottom: 5 },
            key: `chart-${chaveGrafico}`
          },
            React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#e2e8f0' }),
            React.createElement(XAxis, {
              dataKey: 'name',
              tick: { fontSize: 10 },
              interval: Math.floor(dadosGrafico.length / 10)
            }),
            React.createElement(YAxis, {
              label: { value: 'Latência (ms)', angle: -90, position: 'insideLeft' },
              tick: { fontSize: 10 }
            }),
            React.createElement(Tooltip, {
              labelFormatter: (value, payload) => {
                if (payload && payload[0] && payload[0].payload) {
                  return `Ping #${payload[0].payload.name.replace('#', '')} - ${payload[0].payload.timestamp}`;
                }
                return value;
              },
              formatter: (value) => value ? [`${value}ms`, 'Latência'] : ['Offline', 'Status']
            }),
            React.createElement(Line, {
              type: 'monotone',
              dataKey: 'latencia',
              stroke: '#3b82f6',
              strokeWidth: 2,
              dot: false,
              activeDot: { r: 4 },
              isAnimationActive: animarGrafico,
              animationDuration: 1000,
              animationEasing: 'ease-in-out'
            })
          )
        ) : React.createElement('div', {
          style: {
            padding: '40px',
            textAlign: 'center',
            color: '#64748b'
          }
        }, 'Nenhum histórico disponível ainda')
      ),

      // Lista de Histórico
      React.createElement('div', {
        style: {
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }
      },
        React.createElement('h3', {
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '16px'
          }
        }, '📋 Histórico Detalhado'),
        loadingHistorico ? React.createElement('div', {
          style: {
            padding: '20px',
            textAlign: 'center',
            color: '#64748b'
          }
        }, 'Carregando...') : historico.length > 0 ? React.createElement('div', {
          style: {
            maxHeight: '300px',
            overflowY: 'auto'
          }
        },
          historico.slice().reverse().map((item, index) => (
            React.createElement('div', {
              key: item.id || index,
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                marginBottom: '8px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }
            },
              React.createElement('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flex: 1
                }
              },
                React.createElement('div', {
                  style: {
                    width: '8px',
                    height: '8px',
                    backgroundColor: item.online ? getMetricaColor(item.latencia || 0) : '#ef4444',
                    borderRadius: '50%'
                  }
                }),
                React.createElement('div', {
                  style: {
                    fontSize: '12px',
                    color: '#64748b',
                    minWidth: '120px'
                  }
                }, formatDateTime(item.timestamp))
              ),
              React.createElement('div', {
                style: {
                  fontSize: '13px',
                  fontWeight: '600',
                  color: item.online ? getMetricaColor(item.latencia || 0) : '#ef4444',
                  fontFamily: 'monospace',
                  minWidth: '80px',
                  textAlign: 'right'
                }
              }, item.online && item.latencia ? `${item.latencia}ms` : 'Offline'),
              item.erro && React.createElement('div', {
                style: {
                  fontSize: '11px',
                  color: '#ef4444',
                  fontStyle: 'italic',
                  marginLeft: '12px'
                }
              }, item.erro)
            )
          ))
        ) : React.createElement('div', {
          style: {
            padding: '20px',
            textAlign: 'center',
            color: '#64748b'
          }
        }, 'Nenhum histórico disponível ainda')
      )
    )
  );
}

export default ModalDetalhesMonitoramento;

