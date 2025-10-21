import React from 'react';

const EquipamentoModal = ({ equipamento, isVisible, onClose, onEdit, onDelete }) => {
  if (!isVisible || !equipamento) return null;

  return React.createElement('div', { 
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
    onClick: onClose
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
            }, equipamento.nome),
            React.createElement('p', { 
              style: {
                fontSize: '12px',
                color: '#737373',
                margin: 0
              }
            }, equipamento.modelo)
          )
        ),
        React.createElement('div', { 
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }
        },
          // Botão de editar
          React.createElement('button', {
            onClick: (e) => {
              e.stopPropagation();
              if (onEdit) {
                onEdit(equipamento);
              } else {
                console.log('Editar equipamento:', equipamento.id);
                alert(`Editar equipamento: ${equipamento.nome}`);
              }
            },
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '6px',
              color: '#3b82f6',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '12px',
              fontWeight: '500'
            },
            onMouseEnter: (e) => {
              e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
              e.target.style.transform = 'translateY(-1px)';
            },
            onMouseLeave: (e) => {
              e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
              e.target.style.transform = 'translateY(0)';
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
              React.createElement('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
              React.createElement('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' })
            ),
            'Editar'
          ),
          // Botão de deletar
          React.createElement('button', {
            onClick: (e) => {
              e.stopPropagation();
              if (window.confirm(`Tem certeza que deseja deletar o equipamento "${equipamento.nome}"?\n\nEsta ação não pode ser desfeita.`)) {
                if (onDelete) {
                  onDelete(equipamento.id);
                  onClose();
                } else {
                  console.log('Deletar equipamento:', equipamento.id);
                  alert(`Equipamento "${equipamento.nome}" será deletado!`);
                  onClose();
                }
              }
            },
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '6px',
              color: '#ef4444',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '12px',
              fontWeight: '500'
            },
            onMouseEnter: (e) => {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
              e.target.style.transform = 'translateY(-1px)';
            },
            onMouseLeave: (e) => {
              e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.target.style.transform = 'translateY(0)';
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
              React.createElement('polyline', { points: '3,6 5,6 21,6' }),
              React.createElement('path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }),
              React.createElement('line', { x1: '10', y1: '11', x2: '10', y2: '17' }),
              React.createElement('line', { x1: '14', y1: '11', x2: '14', y2: '17' })
            ),
            'Deletar'
          ),
          // Botão de fechar
          React.createElement('button', {
            onClick: onClose,
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(115, 115, 115, 0.1)',
              border: '1px solid rgba(115, 115, 115, 0.2)',
              borderRadius: '6px',
              color: '#737373',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '16px',
              fontWeight: 'bold'
            },
            onMouseEnter: (e) => {
              e.target.style.backgroundColor = 'rgba(115, 115, 115, 0.2)';
              e.target.style.color = '#404040';
            },
            onMouseLeave: (e) => {
              e.target.style.backgroundColor = 'rgba(115, 115, 115, 0.1)';
              e.target.style.color = '#737373';
            }
          }, '×')
        )
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
            }, equipamento.serialMac || 'Não informado')
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
            }, equipamento.ipPublico)
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
            }, equipamento.ipPrivado)
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
            }, equipamento.localidade?.endereco || equipamento.localidade || 'Não informado')
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
            }, 'Modo de Acesso'),
            React.createElement('p', { 
              style: {
                fontSize: '12px',
                color: '#525252',
                margin: 0
              }
            }, equipamento.modoAcesso || 'Não informado')
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
            }, 'Funções'),
            React.createElement('p', { 
              style: {
                fontSize: '12px',
                color: '#525252',
                margin: 0
              }
            }, equipamento.funcoes ? equipamento.funcoes.join(', ') : 'Não informado')
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
            }, equipamento.alimentacao)
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
            }, equipamento.dataAquisicao ? new Date(equipamento.dataAquisicao).toLocaleDateString('pt-BR') : 'Não informado')
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
            }, equipamento.tempoGarantia || 'Não informado')
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
            }, equipamento.versaoFirmware || 'Não informado')
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
            }, equipamento.quantidadePortas)
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
  );
};

export default EquipamentoModal;
