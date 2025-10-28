import React, { useState } from 'react';
import ModalConfirmacao from './ModalConfirmacao';

const EquipamentoCard = React.memo(({ equipamento, onClick, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Função para confirmar exclusão
  const handleConfirmDelete = () => {
    setShowConfirmModal(false);
    if (onDelete) {
      onDelete(equipamento.id);
    } else {
      console.log('Deletar equipamento:', equipamento.id);
    }
  };

  // Função para cancelar exclusão
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  // Fechar menu quando clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('[data-card-menu]')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return React.createElement('div', {
    onClick: () => onClick(equipamento),
    style: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '8px',
      padding: '12px',
      cursor: 'pointer',
      border: '1px solid rgba(125, 38, 217, 0.1)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      position: 'relative',
      zIndex: 1,
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }
    }
  },
    // Header do card
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
        }, equipamento.modelo)
      )
    ),
    
    // Detalhes do equipamento
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
        }, 'POP: '),
        (typeof equipamento.pop === 'string' ? equipamento.pop : equipamento.pop?.nome) || 
        equipamento.localidade?.endereco || 
        equipamento.cidade || 
        equipamento.endereco?.cidade ||
        'Não informado'
      )
    ),
    
    // Footer do card
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
      React.createElement('div', { 
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }
      },
        React.createElement('span', { 
          style: {
            fontSize: '9px',
            color: '#737373'
          }
        }, `${equipamento.quantidadePortas} portas`),
        
        // Menu de 3 pontos
        React.createElement('div', { 
          'data-card-menu': true,
          style: {
            position: 'relative'
          }
        },
          React.createElement('button', {
            onClick: (e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            },
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              backgroundColor: 'rgba(115, 115, 115, 0.1)',
              border: '1px solid rgba(115, 115, 115, 0.2)',
              borderRadius: '4px',
              color: '#737373',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '12px'
            },
            onMouseEnter: (e) => {
              e.target.style.backgroundColor = 'rgba(115, 115, 115, 0.2)';
              e.target.style.color = '#404040';
            },
            onMouseLeave: (e) => {
              e.target.style.backgroundColor = 'rgba(115, 115, 115, 0.1)';
              e.target.style.color = '#737373';
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
              React.createElement('circle', { cx: '12', cy: '12', r: '1' }),
              React.createElement('circle', { cx: '19', cy: '12', r: '1' }),
              React.createElement('circle', { cx: '5', cy: '12', r: '1' })
            )
          ),
          
          // Menu dropdown
          showMenu && React.createElement('div', { 
            style: {
              position: 'absolute',
              top: '28px',
              right: '0',
              backgroundColor: 'white',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(125, 38, 217, 0.1)',
              minWidth: '120px',
              zIndex: 9999,
              overflow: 'hidden'
            }
          },
            React.createElement('button', {
              onClick: (e) => {
                e.stopPropagation();
                setShowMenu(false);
                if (onEdit) {
                  onEdit(equipamento);
                } else {
                  console.log('Editar equipamento:', equipamento.id);
                  alert(`Editar equipamento: ${equipamento.nome}`);
                }
              },
              style: {
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                fontSize: '11px',
                color: '#404040',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderBottom: '1px solid rgba(125, 38, 217, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              },
              onMouseEnter: (e) => {
                e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                e.target.style.color = '#3b82f6';
              },
              onMouseLeave: (e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#404040';
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
                React.createElement('path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
                React.createElement('path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' })
              ),
              'Editar'
            ),
            React.createElement('button', {
              onClick: (e) => {
                e.stopPropagation();
                setShowMenu(false);
                setShowConfirmModal(true);
              },
              style: {
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                fontSize: '11px',
                color: '#404040',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              },
              onMouseEnter: (e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                e.target.style.color = '#ef4444';
              },
              onMouseLeave: (e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#404040';
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
                React.createElement('polyline', { points: '3,6 5,6 21,6' }),
                React.createElement('path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }),
                React.createElement('line', { x1: '10', y1: '11', x2: '10', y2: '17' }),
                React.createElement('line', { x1: '14', y1: '11', x2: '14', y2: '17' })
              ),
              'Deletar'
            )
          )
        )
      )
    ),
    
    // Modal de confirmação
    React.createElement(ModalConfirmacao, {
      isVisible: showConfirmModal,
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja deletar o equipamento "${equipamento.nome}"?\n\nEsta ação não pode ser desfeita.`,
      onConfirm: handleConfirmDelete,
      onCancel: handleCancelDelete,
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      type: 'danger'
    })
  );
});

export default EquipamentoCard;
