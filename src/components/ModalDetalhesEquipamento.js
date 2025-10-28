import React from 'react';

// Funções utilitárias locais
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

function ModalDetalhesEquipamento({ equipamento, onClose }) {
  if (!equipamento) return null;

  const closeModal = () => {
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        padding: '32px',
        maxWidth: '95vw',
        width: '95vw',
        maxHeight: '90vh',
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
          marginBottom: '32px',
          paddingBottom: '20px',
          borderBottom: '2px solid #e5e7eb'
        }
      },
        React.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }
        },
          React.createElement('div', {
            style: {
              width: '16px',
              height: '16px',
              backgroundColor: getStatusColor(equipamento.status),
              borderRadius: '50%'
            }
          }),
          React.createElement('h2', {
            style: {
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0
            }
          }, equipamento.nome),
          React.createElement('div', {
            style: {
              padding: '4px 12px',
              backgroundColor: `${getStatusColor(equipamento.status)}20`,
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              color: getStatusColor(equipamento.status),
              textTransform: 'uppercase'
            }
          }, getStatusText(equipamento.status))
        ),
        React.createElement('button', {
          onClick: closeModal,
          style: {
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '8px',
            borderRadius: '6px',
            transition: 'all 0.2s'
          },
          onMouseOver: (e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.color = '#374151';
          },
          onMouseOut: (e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#6b7280';
          }
        }, '×')
      ),

      // Conteúdo principal em grid
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px'
        }
      },
        // Seção 1: Informações Básicas
        React.createElement('div', {
          style: {
            backgroundColor: '#f8fafc',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }
        },
          React.createElement('h3', {
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid #cbd5e1'
            }
          }, '📋 Informações Básicas'),
          
          React.createElement('div', {
            style: {
              display: 'grid',
              gap: '12px'
            }
          },
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e2e8f0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '13px'
                }
              }, 'Nome/Identificação:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, equipamento.nome)
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e2e8f0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '13px'
                }
              }, 'Modelo:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, equipamento.modelo)
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e2e8f0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '13px'
                }
              }, 'Fabricante:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, equipamento.fabricante)
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e2e8f0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '13px'
                }
              }, 'Serial:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }
              }, equipamento.serial)
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e2e8f0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '13px'
                }
              }, 'MAC:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }
              }, equipamento.mac)
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e2e8f0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '13px'
                }
              }, 'IP Público:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }
              }, equipamento.ipPublico)
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e2e8f0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '13px'
                }
              }, 'IP Privado:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }
              }, equipamento.ipPrivado)
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e2e8f0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '13px'
                }
              }, 'Portas:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, equipamento.portas)
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e2e8f0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '13px'
                }
              }, 'Alimentação:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, equipamento.alimentacao)
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e2e8f0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '13px'
                }
              }, 'Data Aquisição:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, formatDate(equipamento.dataAquisicao))
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e2e8f0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '13px'
                }
              }, 'Garantia:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, equipamento.garantia)
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '13px'
                }
              }, 'Firmware:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }
              }, equipamento.firmware)
            )
          )
        ),

        // Seção 2: Localização e Endereço
        React.createElement('div', {
          style: {
            backgroundColor: '#f0f9ff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #bae6fd'
          }
        },
          React.createElement('h3', {
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid #7dd3fc'
            }
          }, '📍 Localização e Endereço'),
          
          React.createElement('div', {
            style: {
              display: 'grid',
              gap: '12px'
            }
          },
            equipamento.endereco ? [
              React.createElement('div', {
                key: 'cidade',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #bae6fd'
                }
              },
                React.createElement('span', {
                  style: {
                    fontWeight: '600',
                    color: '#0369a1',
                    fontSize: '13px'
                  }
                }, 'Cidade:'),
                React.createElement('span', {
                  style: {
                    color: '#1e293b',
                    fontSize: '13px'
                  }
                }, `${equipamento.endereco.cidade} - ${equipamento.endereco.estado}`)
              ),
              React.createElement('div', {
                key: 'endereco',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #bae6fd'
                }
              },
                React.createElement('span', {
                  style: {
                    fontWeight: '600',
                    color: '#0369a1',
                    fontSize: '13px'
                  }
                }, 'Endereço:'),
                React.createElement('span', {
                  style: {
                    color: '#1e293b',
                    fontSize: '13px'
                  }
                }, equipamento.endereco.endereco)
              ),
              React.createElement('div', {
                key: 'torre',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #bae6fd'
                }
              },
                React.createElement('span', {
                  style: {
                    fontWeight: '600',
                    color: '#0369a1',
                    fontSize: '13px'
                  }
                }, 'Torre:'),
                React.createElement('span', {
                  style: {
                    color: '#1e293b',
                    fontSize: '13px'
                  }
                }, equipamento.endereco.torre)
              ),
              React.createElement('div', {
                key: 'sala',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #bae6fd'
                }
              },
                React.createElement('span', {
                  style: {
                    fontWeight: '600',
                    color: '#0369a1',
                    fontSize: '13px'
                  }
                }, 'Sala Técnica:'),
                React.createElement('span', {
                  style: {
                    color: '#1e293b',
                    fontSize: '13px'
                  }
                }, equipamento.endereco.salaTecnica)
              ),
              React.createElement('div', {
                key: 'rack',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #bae6fd'
                }
              },
                React.createElement('span', {
                  style: {
                    fontWeight: '600',
                    color: '#0369a1',
                    fontSize: '13px'
                  }
                }, 'Rack:'),
                React.createElement('span', {
                  style: {
                    color: '#1e293b',
                    fontSize: '13px'
                  }
                }, equipamento.endereco.rack)
              ),
              React.createElement('div', {
                key: 'gps',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #bae6fd'
                }
              },
                React.createElement('span', {
                  style: {
                    fontWeight: '600',
                    color: '#0369a1',
                    fontSize: '13px'
                  }
                }, 'Coordenadas GPS:'),
                React.createElement('span', {
                  style: {
                    color: '#1e293b',
                    fontSize: '13px',
                    fontFamily: 'monospace'
                  }
                }, equipamento.endereco.coordenadasGPS)
              ),
              React.createElement('div', {
                key: 'lat',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #bae6fd'
                }
              },
                React.createElement('span', {
                  style: {
                    fontWeight: '600',
                    color: '#0369a1',
                    fontSize: '13px'
                  }
                }, 'Latitude:'),
                React.createElement('span', {
                  style: {
                    color: '#1e293b',
                    fontSize: '13px',
                    fontFamily: 'monospace'
                  }
                }, equipamento.localizacao?.latitude || 'N/A')
              ),
              React.createElement('div', {
                key: 'lng',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0'
                }
              },
                React.createElement('span', {
                  style: {
                    fontWeight: '600',
                    color: '#0369a1',
                    fontSize: '13px'
                  }
                }, 'Longitude:'),
                React.createElement('span', {
                  style: {
                    color: '#1e293b',
                    fontSize: '13px',
                    fontFamily: 'monospace'
                  }
                }, equipamento.localizacao?.longitude || 'N/A')
              )
            ] : [
              React.createElement('div', {
                key: 'localidade',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0'
                }
              },
                React.createElement('span', {
                  style: {
                    fontWeight: '600',
                    color: '#0369a1',
                    fontSize: '13px'
                  }
                }, 'POP:'),
                React.createElement('span', {
                  style: {
                    color: '#1e293b',
                    fontSize: '13px'
                  }
                }, (typeof equipamento.pop === 'string' ? equipamento.pop : equipamento.pop?.nome) || 
                    equipamento.localidade?.endereco || 
                    equipamento.cidade || 
                    equipamento.endereco?.cidade ||
                    'Não informado')
              )
            ]
          )
        ),

        // Seção 3: Rede e Conectividade
        React.createElement('div', {
          style: {
            backgroundColor: '#f0fdf4',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #bbf7d0'
          }
        },
          React.createElement('h3', {
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid #86efac'
            }
          }, '🌐 Rede e Conectividade'),
          
          React.createElement('div', {
            style: {
              display: 'grid',
              gap: '12px'
            }
          },
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #bbf7d0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#166534',
                  fontSize: '13px'
                }
              }, 'Função na Rede:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, equipamento.funcaoRede || equipamento.tipo)
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #bbf7d0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#166534',
                  fontSize: '13px'
                }
              }, 'Status Atual:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px',
                  textTransform: 'capitalize'
                }
              }, equipamento.statusAtual || equipamento.status)
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #bbf7d0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#166534',
                  fontSize: '13px'
                }
              }, 'Porta de Acesso:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }
              }, equipamento.portaAcesso || 'N/A')
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #bbf7d0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#166534',
                  fontSize: '13px'
                }
              }, 'Modo de Acesso:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, equipamento.modoAcesso || 'N/A')
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #bbf7d0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#166534',
                  fontSize: '13px'
                }
              }, 'Origem do Sinal:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, equipamento.origemSinal || 'N/A')
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #bbf7d0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#166534',
                  fontSize: '13px'
                }
              }, 'Destino do Sinal:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, equipamento.destinoSinal || 'N/A')
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #bbf7d0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#166534',
                  fontSize: '13px'
                }
              }, 'Capacidade Máxima:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, equipamento.capacidadeMaxima || 'N/A')
            ),
            equipamento.redeAssociada ? [
              React.createElement('div', {
                key: 'vlan',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #bbf7d0'
                }
              },
                React.createElement('span', {
                  style: {
                    fontWeight: '600',
                    color: '#166534',
                    fontSize: '13px'
                  }
                }, 'VLAN:'),
                React.createElement('span', {
                  style: {
                    color: '#1e293b',
                    fontSize: '13px'
                  }
                }, equipamento.redeAssociada.vlan)
              ),
              React.createElement('div', {
                key: 'subrede',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #bbf7d0'
                }
              },
                React.createElement('span', {
                  style: {
                    fontWeight: '600',
                    color: '#166534',
                    fontSize: '13px'
                  }
                }, 'Sub-rede:'),
                React.createElement('span', {
                  style: {
                    color: '#1e293b',
                    fontSize: '13px',
                    fontFamily: 'monospace'
                  }
                }, equipamento.redeAssociada.subrede)
              ),
              React.createElement('div', {
                key: 'bgp',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0'
                }
              },
                React.createElement('span', {
                  style: {
                    fontWeight: '600',
                    color: '#166534',
                    fontSize: '13px'
                  }
                }, 'BGP/ASN:'),
                React.createElement('span', {
                  style: {
                    color: '#1e293b',
                    fontSize: '13px',
                    fontFamily: 'monospace'
                  }
                }, equipamento.redeAssociada.bgp)
              )
            ] : null
          )
        ),

        // Seção 4: Comercial e Suporte
        React.createElement('div', {
          style: {
            backgroundColor: '#fefce8',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #fde047'
          }
        },
          React.createElement('h3', {
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid #facc15'
            }
          }, '💼 Comercial e Suporte'),
          
          React.createElement('div', {
            style: {
              display: 'grid',
              gap: '12px'
            }
          },
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #fde047'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#a16207',
                  fontSize: '13px'
                }
              }, 'Responsável Técnico:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, equipamento.responsavelTecnico ? 
                `${equipamento.responsavelTecnico.instalador} / ${equipamento.responsavelTecnico.mantenedor}` : 
                'N/A')
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #fde047'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#a16207',
                  fontSize: '13px'
                }
              }, 'Fornecedor:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, equipamento.fornecedor || 'N/A')
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #fde047'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#a16207',
                  fontSize: '13px'
                }
              }, 'Nota Fiscal:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }
              }, equipamento.notaFiscal || 'N/A')
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #fde047'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#a16207',
                  fontSize: '13px'
                }
              }, 'Nº do Pedido:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px',
                  fontFamily: 'monospace'
                }
              }, equipamento.numeroPedido || 'N/A')
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0'
              }
            },
              React.createElement('span', {
                style: {
                  fontWeight: '600',
                  color: '#a16207',
                  fontSize: '13px'
                }
              }, 'Contrato/SLA:'),
              React.createElement('span', {
                style: {
                  color: '#1e293b',
                  fontSize: '13px'
                }
              }, equipamento.contratoGarantia || 'N/A')
            )
          )
        ),

        // Seção 5: Observações Técnicas
        React.createElement('div', {
          style: {
            backgroundColor: '#fdf2f8',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #f9a8d4'
          }
        },
          React.createElement('h3', {
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid #f472b6'
            }
          }, '📝 Observações Técnicas'),
          
          React.createElement('div', {
            style: {
              backgroundColor: 'white',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #f9a8d4',
              minHeight: '80px'
            }
          },
            React.createElement('p', {
              style: {
                color: '#1e293b',
                fontSize: '13px',
                lineHeight: '1.5',
                margin: 0
              }
            }, equipamento.observacoesTecnicas || 'Nenhuma observação técnica registrada.')
          )
        ),

        // Seção 6: Histórico de Manutenções
        equipamento.historicoManutencoes && equipamento.historicoManutencoes.length > 0 ? 
        React.createElement('div', {
          style: {
            backgroundColor: '#f0f9ff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #bae6fd'
          }
        },
          React.createElement('h3', {
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid #7dd3fc'
            }
          }, '🔧 Histórico de Manutenções'),
          
          React.createElement('div', {
            style: {
              display: 'grid',
              gap: '12px'
            }
          },
            equipamento.historicoManutencoes.map((manutencao, index) =>
              React.createElement('div', {
                key: index,
                style: {
                  backgroundColor: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #bae6fd'
                }
              },
                React.createElement('div', {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }
                },
                  React.createElement('span', {
                    style: {
                      fontWeight: '600',
                      color: '#0369a1',
                      fontSize: '12px'
                    }
                  }, formatDate(manutencao.data)),
                  React.createElement('span', {
                    style: {
                      padding: '2px 8px',
                      backgroundColor: '#dbeafe',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#1d4ed8',
                      textTransform: 'uppercase'
                    }
                  }, manutencao.tipo)
                ),
                React.createElement('p', {
                  style: {
                    color: '#1e293b',
                    fontSize: '12px',
                    margin: '0 0 4px 0'
                  }
                }, manutencao.descricao),
                React.createElement('p', {
                  style: {
                    color: '#64748b',
                    fontSize: '11px',
                    margin: 0,
                    fontStyle: 'italic'
                  }
                }, `Responsável: ${manutencao.responsavel}`)
              )
            )
          )
        ) : null,

        // Seção 7: Logs de Alterações
        equipamento.logsAlteracoes && equipamento.logsAlteracoes.length > 0 ? 
        React.createElement('div', {
          style: {
            backgroundColor: '#f8fafc',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }
        },
          React.createElement('h3', {
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid #cbd5e1'
            }
          }, '📋 Logs de Alterações'),
          
          React.createElement('div', {
            style: {
              display: 'grid',
              gap: '12px'
            }
          },
            equipamento.logsAlteracoes.map((log, index) =>
              React.createElement('div', {
                key: index,
                style: {
                  backgroundColor: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }
              },
                React.createElement('div', {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }
                },
                  React.createElement('span', {
                    style: {
                      fontWeight: '600',
                      color: '#475569',
                      fontSize: '12px'
                    }
                  }, formatDateTime(log.data)),
                  React.createElement('span', {
                    style: {
                      fontWeight: '600',
                      color: '#1e293b',
                      fontSize: '12px'
                    }
                  }, log.usuario)
                ),
                React.createElement('p', {
                  style: {
                    color: '#1e293b',
                    fontSize: '12px',
                    margin: '0 0 4px 0',
                    fontWeight: '500'
                  }
                }, log.acao),
                React.createElement('p', {
                  style: {
                    color: '#64748b',
                    fontSize: '11px',
                    margin: 0,
                    fontStyle: 'italic'
                  }
                }, log.detalhes)
              )
            )
          )
        ) : null
      )
    )
  );
}

export default ModalDetalhesEquipamento;
