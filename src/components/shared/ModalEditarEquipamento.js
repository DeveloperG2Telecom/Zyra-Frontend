import React, { useState, useEffect } from 'react';

const ModalEditarEquipamento = ({ isVisible, equipamento, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    modelo: '',
    serialMac: '',
    ipPrivado: '',
    ipPublico: '',
    localidade: { lat: '', lng: '', endereco: '' },
    quantidadePortas: '',
    alimentacao: '',
    dataAquisicao: '',
    tempoGarantia: '',
    versaoFirmware: '',
    modoAcesso: '',
    funcoes: [],
    status: 'Ativo',
    pop: '',
    redeRural: '',
    equipamentoAnterior: '',
    equipamentoPosterior: '',
    fotoEquipamento: '',
    observacoes: ''
  });
  const [funcaoInput, setFuncaoInput] = useState('');

  // Preencher formulário quando equipamento mudar
  useEffect(() => {
    if (equipamento) {
      setFormData({
        nome: equipamento.nome || '',
        tipo: equipamento.tipo || '',
        modelo: equipamento.modelo || '',
        serialMac: equipamento.serialMac || '',
        ipPrivado: equipamento.ipPrivado || '',
        ipPublico: equipamento.ipPublico || '',
        localidade: {
          lat: equipamento.localidade?.lat || '',
          lng: equipamento.localidade?.lng || '',
          endereco: equipamento.localidade?.endereco || ''
        },
        quantidadePortas: equipamento.quantidadePortas || '',
        alimentacao: equipamento.alimentacao || '',
        dataAquisicao: equipamento.dataAquisicao ? new Date(equipamento.dataAquisicao).toISOString().split('T')[0] : '',
        tempoGarantia: equipamento.tempoGarantia || '',
        versaoFirmware: equipamento.versaoFirmware || '',
        modoAcesso: equipamento.modoAcesso || '',
        funcoes: equipamento.funcoes || [],
        status: equipamento.status || 'Ativo',
        pop: equipamento.pop || '',
        redeRural: equipamento.redeRural || '',
        equipamentoAnterior: equipamento.equipamentoAnterior || '',
        equipamentoPosterior: equipamento.equipamentoPosterior || '',
        fotoEquipamento: equipamento.fotoEquipamento || '',
        observacoes: equipamento.observacoes || ''
      });
    }
  }, [equipamento]);

  if (!isVisible || !equipamento) {
    return null;
  }

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddFuncao = (e) => {
    e.preventDefault();
    if (funcaoInput.trim() && !formData.funcoes.includes(funcaoInput.trim())) {
      setFormData(prev => ({
        ...prev,
        funcoes: [...prev.funcoes, funcaoInput.trim()]
      }));
      setFuncaoInput('');
    }
  };

  const handleRemoveFuncao = (funcaoToRemove) => {
    setFormData(prev => ({
      ...prev,
      funcoes: prev.funcoes.filter(f => f !== funcaoToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulário de edição submetido!', formData);
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      nome: '',
      modelo: '',
      serialMac: '',
      ipPrivado: '',
      ipPublico: '',
      localidade: { lat: '', lng: '', endereco: '' },
      quantidadePortas: '',
      alimentacao: '',
      dataAquisicao: '',
      tempoGarantia: '',
      versaoFirmware: '',
      modoAcesso: '',
      funcoes: [],
      status: 'Ativo',
      pop: '',
      redeRural: '',
      equipamentoAnterior: '',
      equipamentoPosterior: '',
      fotoEquipamento: '',
      observacoes: ''
    });
    setFuncaoInput('');
    onClose();
  };

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
      zIndex: 1000,
      padding: '20px'
    }
  },
    React.createElement('div', {
      style: {
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }
    },
      // Header
      React.createElement('div', {
        style: {
          padding: '20px',
          borderBottom: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }
      },
        React.createElement('h2', {
          style: {
            color: 'white',
            margin: 0,
            fontSize: '24px',
            fontWeight: '600'
          }
        }, 'Editar Equipamento'),
        React.createElement('button', {
          onClick: handleClose,
          style: {
            background: 'none',
            border: 'none',
            color: '#666',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            transition: 'all 0.2s'
          },
          onMouseEnter: (e) => {
            e.target.style.backgroundColor = '#333';
            e.target.style.color = 'white';
          },
          onMouseLeave: (e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#666';
          }
        }, '×')
      ),

      // Form
      React.createElement('form', {
        onSubmit: handleSubmit,
        style: {
          padding: '20px',
          overflowY: 'auto',
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }
      },
        // Coluna Esquerda
        React.createElement('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }
        },
          // Nome do Equipamento
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'Nome do Equipamento *'),
            React.createElement('input', {
              type: 'text',
              value: formData.nome,
              onChange: (e) => handleInputChange('nome', e.target.value),
              placeholder: 'Ex: Roteador Principal',
              required: true,
              style: {
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              },
              onFocus: (e) => {
                e.target.style.borderColor = '#3b82f6';
              },
              onBlur: (e) => {
                e.target.style.borderColor = '#444';
              }
            })
          ),

          // Tipo do Equipamento
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'Tipo do Equipamento *'),
            React.createElement('select', {
              value: formData.tipo,
              onChange: (e) => handleInputChange('tipo', e.target.value),
              required: true,
              style: {
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              },
              onFocus: (e) => {
                e.target.style.borderColor = '#3b82f6';
              },
              onBlur: (e) => {
                e.target.style.borderColor = '#444';
              }
            },
              React.createElement('option', { value: '' }, 'Selecione o tipo...'),
              React.createElement('option', { value: 'MIKROTIK' }, 'MIKROTIK'),
              React.createElement('option', { value: 'MK CONCENTRADOR' }, 'MK CONCENTRADOR'),
              React.createElement('option', { value: 'RADIO PTP' }, 'RADIO PTP'),
              React.createElement('option', { value: 'AP' }, 'AP'),
              React.createElement('option', { value: 'MIMOSA' }, 'MIMOSA'),
              React.createElement('option', { value: 'OLT' }, 'OLT'),
              React.createElement('option', { value: 'ROTEADOR' }, 'ROTEADOR'),
              React.createElement('option', { value: 'OUTROS' }, 'OUTROS')
            )
          ),

          // Modelo
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'Modelo'),
            React.createElement('input', {
              type: 'text',
              value: formData.modelo,
              onChange: (e) => handleInputChange('modelo', e.target.value),
              placeholder: 'Ex: TP-Link Archer C7',
              style: {
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }
            })
          ),

          // Serial/MAC
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'Serial/MAC'),
            React.createElement('input', {
              type: 'text',
              value: formData.serialMac,
              onChange: (e) => handleInputChange('serialMac', e.target.value),
              placeholder: 'Ex: 00:11:22:33:44:55',
              style: {
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }
            })
          ),

          // IP Privado
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'IP Privado'),
            React.createElement('input', {
              type: 'text',
              value: formData.ipPrivado,
              onChange: (e) => handleInputChange('ipPrivado', e.target.value),
              placeholder: 'Ex: 192.168.1.1',
              style: {
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }
            })
          ),

          // IP Público
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'IP Público'),
            React.createElement('input', {
              type: 'text',
              value: formData.ipPublico,
              onChange: (e) => handleInputChange('ipPublico', e.target.value),
              placeholder: 'Ex: 200.160.2.1',
              style: {
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }
            })
          ),

          // Localização
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'Localização'),
            React.createElement('div', {
              style: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '8px'
              }
            },
              React.createElement('input', {
                type: 'number',
                value: formData.localidade.lat,
                onChange: (e) => handleInputChange('localidade.lat', e.target.value),
                placeholder: 'Latitude',
                step: '0.000001',
                style: {
                  padding: '12px',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }
              }),
              React.createElement('input', {
                type: 'number',
                value: formData.localidade.lng,
                onChange: (e) => handleInputChange('localidade.lng', e.target.value),
                placeholder: 'Longitude',
                step: '0.000001',
                style: {
                  padding: '12px',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }
              })
            ),
            React.createElement('input', {
              type: 'text',
              value: formData.localidade.endereco,
              onChange: (e) => handleInputChange('localidade.endereco', e.target.value),
              placeholder: 'Endereço completo',
              style: {
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }
            })
          )
        ),

        // Coluna Direita
        React.createElement('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }
        },
          // Quantidade de Portas
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'Quantidade de Portas'),
            React.createElement('input', {
              type: 'text',
              value: formData.quantidadePortas,
              onChange: (e) => handleInputChange('quantidadePortas', e.target.value),
              placeholder: 'Ex: 8',
              style: {
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }
            })
          ),

          // Alimentação
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'Alimentação'),
            React.createElement('input', {
              type: 'text',
              value: formData.alimentacao,
              onChange: (e) => handleInputChange('alimentacao', e.target.value),
              placeholder: 'Ex: 12V 2A',
              style: {
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }
            })
          ),

          // Data de Aquisição
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'Data de Aquisição'),
            React.createElement('input', {
              type: 'date',
              value: formData.dataAquisicao,
              onChange: (e) => handleInputChange('dataAquisicao', e.target.value),
              style: {
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }
            })
          ),

          // Tempo de Garantia
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'Tempo de Garantia'),
            React.createElement('input', {
              type: 'text',
              value: formData.tempoGarantia,
              onChange: (e) => handleInputChange('tempoGarantia', e.target.value),
              placeholder: 'Ex: 2 anos',
              style: {
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }
            })
          ),

          // Versão do Firmware
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'Versão do Firmware'),
            React.createElement('input', {
              type: 'text',
              value: formData.versaoFirmware,
              onChange: (e) => handleInputChange('versaoFirmware', e.target.value),
              placeholder: 'Ex: v1.2.3',
              style: {
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }
            })
          ),

          // Modo de Acesso
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'Modo de Acesso'),
            React.createElement('select', {
              value: formData.modoAcesso,
              onChange: (e) => handleInputChange('modoAcesso', e.target.value),
              style: {
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }
            },
              React.createElement('option', { value: '' }, 'Selecione o modo'),
              React.createElement('option', { value: 'SSH' }, 'SSH'),
              React.createElement('option', { value: 'Telnet' }, 'Telnet'),
              React.createElement('option', { value: 'Web Interface' }, 'Web Interface'),
              React.createElement('option', { value: 'ETHERNET' }, 'ETHERNET'),
              React.createElement('option', { value: 'Outro' }, 'Outro')
            )
          ),

          // Funções
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'Funções'),
            React.createElement('div', {
              style: {
                display: 'flex',
                gap: '8px',
                marginBottom: '8px'
              }
            },
              React.createElement('input', {
                type: 'text',
                value: funcaoInput,
                onChange: (e) => setFuncaoInput(e.target.value),
                placeholder: 'Adicionar função',
                style: {
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }
              }),
              React.createElement('button', {
                type: 'button',
                onClick: handleAddFuncao,
                style: {
                  padding: '12px 16px',
                  backgroundColor: '#3b82f6',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                },
                onMouseEnter: (e) => {
                  e.target.style.backgroundColor = '#2563eb';
                },
                onMouseLeave: (e) => {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }, 'Adicionar')
            ),
            formData.funcoes.length > 0 && React.createElement('div', {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }
            },
              formData.funcoes.map((funcao, index) => React.createElement('span', {
                key: index,
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '500'
                }
              },
                funcao,
                React.createElement('button', {
                  type: 'button',
                  onClick: () => handleRemoveFuncao(funcao),
                  style: {
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '0',
                    marginLeft: '4px'
                  }
                }, '×')
              ))
            )
          ),

          // Status
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                display: 'block',
                color: 'white',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }
            }, 'Status'),
            React.createElement('select', {
              value: formData.status,
              onChange: (e) => handleInputChange('status', e.target.value),
              style: {
                width: '100%',
                padding: '12px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }
            },
              React.createElement('option', { value: 'Ativo' }, 'Ativo'),
              React.createElement('option', { value: 'Em Manutenção' }, 'Em Manutenção'),
              React.createElement('option', { value: 'Reserva' }, 'Reserva'),
              React.createElement('option', { value: 'Descartado' }, 'Descartado'),
              React.createElement('option', { value: 'Em Teste' }, 'Em Teste')
            )
          )
        ),

        // Botões de Ação
        React.createElement('div', {
          style: {
            gridColumn: '1 / -1',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '20px',
            borderTop: '1px solid #333'
          }
        },
          React.createElement('button', {
            type: 'button',
            onClick: handleClose,
            style: {
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: '1px solid #444',
              borderRadius: '8px',
              color: '#ccc',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            },
            onMouseEnter: (e) => {
              e.target.style.borderColor = '#666';
              e.target.style.color = 'white';
            },
            onMouseLeave: (e) => {
              e.target.style.borderColor = '#444';
              e.target.style.color = '#ccc';
            }
          }, 'Cancelar'),
          React.createElement('button', {
            type: 'submit',
            style: {
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            },
            onMouseEnter: (e) => {
              e.target.style.backgroundColor = '#2563eb';
            },
            onMouseLeave: (e) => {
              e.target.style.backgroundColor = '#3b82f6';
            }
          }, 'Salvar Alterações')
        )
      )
    )
  );
};

export default ModalEditarEquipamento;
