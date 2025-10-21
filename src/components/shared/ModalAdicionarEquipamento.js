import React, { useState } from 'react';

const ModalAdicionarEquipamento = ({ isVisible, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    modelo: '',
    serialMac: '',
    ipPrivado: '',
    ipPublico: '',
    localidade: {
      lat: '',
      lng: '',
      endereco: ''
    },
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFuncao = () => {
    if (funcaoInput.trim()) {
      setFormData(prev => ({
        ...prev,
        funcoes: [...prev.funcoes, funcaoInput.trim()]
      }));
      setFuncaoInput('');
    }
  };

  const handleRemoveFuncao = (index) => {
    setFormData(prev => ({
      ...prev,
      funcoes: prev.funcoes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulário submetido!', formData);
    console.log('Função onSave:', onSave);
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      nome: '',
      modelo: '',
      serialMac: '',
      ipPrivado: '',
      ipPublico: '',
      localidade: {
        lat: '',
        lng: '',
        endereco: ''
      },
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

  if (!isVisible) {
    console.log('Modal não está visível');
    return null;
  }
  
  console.log('Modal está visível, renderizando...');

  return React.createElement('div', { 
    style: {
      position: 'fixed',
      top: '60px', // Abaixo do cabeçalho
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
    onClick: handleClose
  },
    React.createElement('div', { 
      style: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '1000px',
        width: '100%',
        maxHeight: 'calc(100vh - 100px)',
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
          marginBottom: '24px',
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
          }, '➕'),
          React.createElement('div', null,
            React.createElement('h3', { 
              style: {
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#404040',
                marginBottom: '2px'
              }
            }, 'Adicionar Equipamento'),
            React.createElement('p', { 
              style: {
                fontSize: '12px',
                color: '#737373',
                margin: 0
              }
            }, 'Preencha os dados do novo equipamento')
          )
        ),
        React.createElement('button', {
          onClick: handleClose,
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
      ),
      
      // Formulário
      React.createElement('form', {
        onSubmit: handleSubmit,
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }
      },
        // Coluna esquerda
        React.createElement('div', { 
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }
        },
          // Nome
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Nome do Equipamento *'),
            React.createElement('input', {
              type: 'text',
              value: formData.nome,
              onChange: (e) => handleInputChange('nome', e.target.value),
              placeholder: 'Ex: Router Principal - Matriz',
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

          // Tipo do Equipamento
          React.createElement('div', null,
            React.createElement('label', {
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Tipo do Equipamento *'),
            React.createElement('select', {
              value: formData.tipo,
              onChange: (e) => handleInputChange('tipo', e.target.value),
              style: {
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'white'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4',
              required: true
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
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Modelo'),
            React.createElement('input', {
              type: 'text',
              value: formData.modelo,
              onChange: (e) => handleInputChange('modelo', e.target.value),
              placeholder: 'Ex: RB4011iGS+RM',
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
          
          // Status
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Status'),
            React.createElement('select', {
              value: formData.status,
              onChange: (e) => handleInputChange('status', e.target.value),
              style: {
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'white'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
            },
              React.createElement('option', { value: 'Ativo' }, 'Ativo'),
              React.createElement('option', { value: 'Em Manutenção' }, 'Em Manutenção'),
              React.createElement('option', { value: 'Reserva' }, 'Reserva'),
              React.createElement('option', { value: 'Descartado' }, 'Descartado'),
              React.createElement('option', { value: 'Em Teste' }, 'Em Teste')
            )
          ),
          
          // Serial/MAC
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Serial/MAC'),
            React.createElement('input', {
              type: 'text',
              value: formData.serialMac,
              onChange: (e) => handleInputChange('serialMac', e.target.value),
              placeholder: 'Ex: 1234567890ABCD',
              style: {
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'monospace'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
            })
          ),
          
          // IP Privado
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'IP Privado'),
            React.createElement('input', {
              type: 'text',
              value: formData.ipPrivado,
              onChange: (e) => handleInputChange('ipPrivado', e.target.value),
              placeholder: 'Ex: 192.168.1.1',
              style: {
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'monospace'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
            })
          ),
          
          // IP Público
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'IP Público'),
            React.createElement('input', {
              type: 'text',
              value: formData.ipPublico,
              onChange: (e) => handleInputChange('ipPublico', e.target.value),
              placeholder: 'Ex: 200.123.45.67',
              style: {
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'monospace'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
            })
          ),
          
          // Endereço da Localidade
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Endereço da Localidade'),
            React.createElement('input', {
              type: 'text',
              value: formData.localidade.endereco,
              onChange: (e) => handleInputChange('localidade', { ...formData.localidade, endereco: e.target.value }),
              placeholder: 'Ex: Rua das Flores, 123 - Centro, São Paulo - SP',
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
          
          // Endereço
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Endereço Completo'),
            React.createElement('textarea', {
              value: formData.endereco,
              onChange: (e) => handleInputChange('endereco', e.target.value),
              placeholder: 'Ex: Rua das Flores, 123 - Centro',
              rows: 3,
              style: {
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                resize: 'vertical'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
            })
          )
        ),
        
        // Coluna direita
        React.createElement('div', { 
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }
        },
          // Modo de Acesso
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Modo de Acesso'),
            React.createElement('select', {
              value: formData.modoAcesso,
              onChange: (e) => handleInputChange('modoAcesso', e.target.value),
              style: {
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'white'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
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
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Funções do Equipamento'),
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
                placeholder: 'Ex: Router, Switch, AP',
                style: {
                  flex: 1,
                  padding: '8px 10px',
                  border: '2px solid #d4d4d4',
                  borderRadius: '4px',
                  fontSize: '11px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                },
                onFocus: (e) => e.target.style.borderColor = '#7d26d9',
                onBlur: (e) => e.target.style.borderColor = '#d4d4d4',
                onKeyPress: (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFuncao();
                  }
                }
              }),
              React.createElement('button', {
                type: 'button',
                onClick: handleAddFuncao,
                style: {
                  padding: '8px 12px',
                  backgroundColor: '#7d26d9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                },
                onMouseEnter: (e) => e.target.style.backgroundColor = '#6b1bb8',
                onMouseLeave: (e) => e.target.style.backgroundColor = '#7d26d9'
              }, 'Adicionar')
            ),
            // Lista de funções
            formData.funcoes.length > 0 && React.createElement('div', { 
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }
            },
              formData.funcoes.map((funcao, index) =>
                React.createElement('div', {
                  key: index,
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'rgba(125, 38, 217, 0.1)',
                    color: '#7d26d9',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px'
                  }
                },
                  React.createElement('span', null, funcao),
                  React.createElement('button', {
                    type: 'button',
                    onClick: () => handleRemoveFuncao(index),
                    style: {
                      background: 'none',
                      border: 'none',
                      color: '#7d26d9',
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '0',
                      marginLeft: '4px'
                    }
                  }, '×')
                )
              )
            )
          ),
          
          // Alimentação
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Alimentação'),
            React.createElement('select', {
              value: formData.alimentacao,
              onChange: (e) => handleInputChange('alimentacao', e.target.value),
              style: {
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'white'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
            },
              React.createElement('option', { value: '' }, 'Selecione a alimentação'),
              React.createElement('option', { value: 'PoE' }, 'PoE (Power over Ethernet)'),
              React.createElement('option', { value: 'AC' }, 'AC (Corrente Alternada)'),
              React.createElement('option', { value: 'DC' }, 'DC (Corrente Contínua)'),
              React.createElement('option', { value: 'Bateria' }, 'Bateria'),
              React.createElement('option', { value: 'Solar' }, 'Solar')
            )
          ),
          
          // Data de Aquisição
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Data de Aquisição'),
            React.createElement('input', {
              type: 'date',
              value: formData.dataAquisicao,
              onChange: (e) => handleInputChange('dataAquisicao', e.target.value),
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
          
          // Tempo de Garantia
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Tempo de Garantia'),
            React.createElement('input', {
              type: 'text',
              value: formData.tempoGarantia,
              onChange: (e) => handleInputChange('tempoGarantia', e.target.value),
              placeholder: 'Ex: 12 meses, 2 anos',
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
          
          // Versão de Firmware
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Versão de Firmware'),
            React.createElement('input', {
              type: 'text',
              value: formData.versaoFirmware,
              onChange: (e) => handleInputChange('versaoFirmware', e.target.value),
              placeholder: 'Ex: 7.8.1',
              style: {
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'monospace'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
            })
          ),
          
          // Quantidade de Portas
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Quantidade de Portas'),
            React.createElement('input', {
              type: 'number',
              value: formData.quantidadePortas,
              onChange: (e) => handleInputChange('quantidadePortas', e.target.value),
              placeholder: 'Ex: 24',
              min: 0,
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
          
          // Latitude
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Latitude'),
            React.createElement('input', {
              type: 'number',
              step: 'any',
              value: formData.localidade.lat,
              onChange: (e) => handleInputChange('localidade', { ...formData.localidade, lat: parseFloat(e.target.value) || '' }),
              placeholder: 'Ex: -23.5505',
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
          
          // Longitude
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Longitude'),
            React.createElement('input', {
              type: 'number',
              step: 'any',
              value: formData.localidade.lng,
              onChange: (e) => handleInputChange('localidade', { ...formData.localidade, lng: parseFloat(e.target.value) || '' }),
              placeholder: 'Ex: -46.6333',
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
          
          // Observações
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Observações'),
            React.createElement('textarea', {
              value: formData.observacoes,
              onChange: (e) => handleInputChange('observacoes', e.target.value),
              placeholder: 'Informações adicionais sobre o equipamento...',
              rows: 3,
              style: {
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                resize: 'vertical'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
            })
          )
        ),
        
        // Botões de ação
        React.createElement('div', { 
          style: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e5e5',
            gridColumn: '1 / -1' // Ocupar toda a largura do grid
          }
        },
        React.createElement('button', {
          type: 'button',
          onClick: handleClose,
          style: {
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: '#737373',
            border: '1px solid #d4d4d4',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          },
          onMouseEnter: (e) => {
            e.target.style.backgroundColor = '#f5f5f5';
            e.target.style.borderColor = '#a3a3a3';
          },
          onMouseLeave: (e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = '#d4d4d4';
          }
        }, 'Cancelar'),
        React.createElement('button', {
          type: 'submit',
          onClick: (e) => {
            e.preventDefault();
            console.log('Botão salvar clicado!');
            console.log('Dados do formulário:', formData);
            handleSubmit(e);
          },
          style: {
            padding: '10px 20px',
            backgroundColor: '#7d26d9',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: '500'
          },
          onMouseEnter: (e) => e.target.style.backgroundColor = '#6b1bb8',
          onMouseLeave: (e) => e.target.style.backgroundColor = '#7d26d9'
        }, 'Salvar Equipamento')
        )
      )
    )
  );
};

export default ModalAdicionarEquipamento;
