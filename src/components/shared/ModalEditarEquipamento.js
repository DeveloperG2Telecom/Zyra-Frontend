import React, { useState, useEffect } from 'react';

const ModalEditarEquipamento = ({ isVisible, equipamento, onClose, onSave }) => {
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
    console.log('🔍 MODAL: Formulário de edição submetido!', formData);
    console.log('🔍 MODAL: Função onSave:', onSave);
    console.log('🔍 MODAL: Dados completos do formData:', JSON.stringify(formData, null, 2));
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
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
    setFuncaoInput('');
    onClose();
  };

  if (!isVisible || !equipamento) {
    console.log('Modal não está visível ou equipamento não fornecido');
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
          }, '✏️'),
          React.createElement('div', null,
            React.createElement('h3', { 
              style: {
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#404040',
                marginBottom: '2px'
              }
            }, 'Editar Equipamento'),
            React.createElement('p', { 
              style: {
                fontSize: '12px',
                color: '#737373',
                margin: 0
              }
            }, 'Atualize os dados do equipamento')
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
                transition: 'border-color 0.2s',
                backgroundColor: 'white'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4',
              required: true
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
                transition: 'border-color 0.2s',
                backgroundColor: 'white'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
            })
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
              placeholder: 'Ex: 1234567890',
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
                backgroundColor: 'white'
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
                backgroundColor: 'white'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
            })
          ),

          // Localização - Endereço
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Endereço'),
            React.createElement('input', {
              type: 'text',
              value: formData.localidade.endereco,
              onChange: (e) => handleInputChange('localidade.endereco', e.target.value),
              placeholder: 'Ex: Rua das Flores, 123 - Centro',
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
            })
          ),

          // Coordenadas
          React.createElement('div', { 
            style: {
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }
          },
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
                onChange: (e) => handleInputChange('localidade.lat', e.target.value),
                placeholder: 'Ex: -23.5505',
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
              })
            ),
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
                onChange: (e) => handleInputChange('localidade.lng', e.target.value),
                placeholder: 'Ex: -46.6333',
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
              })
            )
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
            })
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
            React.createElement('input', {
              type: 'text',
              value: formData.alimentacao,
              onChange: (e) => handleInputChange('alimentacao', e.target.value),
              placeholder: 'Ex: 24V DC, 2A',
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
            })
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
                transition: 'border-color 0.2s',
                backgroundColor: 'white'
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
              placeholder: 'Ex: 24 meses',
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
              placeholder: 'Ex: 7.11.2',
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
            })
          ),

          // Equipamento Anterior
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Equipamento Anterior'),
            React.createElement('input', {
              type: 'text',
              value: formData.equipamentoAnterior,
              onChange: (e) => handleInputChange('equipamentoAnterior', e.target.value),
              placeholder: 'Ex: Router Antigo - Desativado',
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
            })
          ),

          // Equipamento Posterior
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Equipamento Posterior'),
            React.createElement('input', {
              type: 'text',
              value: formData.equipamentoPosterior,
              onChange: (e) => handleInputChange('equipamentoPosterior', e.target.value),
              placeholder: 'Ex: Router Futuro - Planejado',
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
            })
          ),

          // Foto do Equipamento
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Foto do Equipamento'),
            React.createElement('input', {
              type: 'file',
              accept: 'image/*',
              onChange: (e) => {
                const file = e.target.files[0];
                if (file) {
                  // Aqui você pode implementar upload para Firebase Storage
                  console.log('Arquivo selecionado:', file);
                }
              },
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
              placeholder: 'Observações técnicas importantes...',
              rows: 4,
              style: {
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'white',
                resize: 'vertical',
                fontFamily: 'inherit'
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
              React.createElement('option', { value: 'Ethernet' }, 'Ethernet'),
              React.createElement('option', { value: 'Winbox' }, 'Winbox'),
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
                placeholder: 'Ex: Roteamento, Firewall',
                style: {
                  flex: 1,
                  padding: '8px 10px',
                  border: '2px solid #d4d4d4',
                  borderRadius: '6px',
                  fontSize: '12px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white'
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
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                },
                onMouseEnter: (e) => e.target.style.backgroundColor = '#6b1fb8',
                onMouseLeave: (e) => e.target.style.backgroundColor = '#7d26d9'
              }, 'Adicionar')
            ),
            React.createElement('div', { 
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }
            },
              formData.funcoes.map((funcao, index) => 
                React.createElement('span', {
                  key: index,
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#374151'
                  }
                },
                  React.createElement('span', null, funcao),
                  React.createElement('button', {
                    type: 'button',
                    onClick: () => handleRemoveFuncao(index),
                    style: {
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }, '×')
                )
              )
            )
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

          // POP
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'POP'),
            React.createElement('input', {
              type: 'text',
              value: formData.pop,
              onChange: (e) => handleInputChange('pop', e.target.value),
              placeholder: 'Ex: POP Central',
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
            })
          ),

          // Rede Rural
          React.createElement('div', null,
            React.createElement('label', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }
            }, 'Rede Rural'),
            React.createElement('input', {
              type: 'text',
              value: formData.redeRural,
              onChange: (e) => handleInputChange('redeRural', e.target.value),
              placeholder: 'Ex: Rede Rural Norte',
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
            })
          )
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
          borderTop: '1px solid #e5e5e5'
        }
      },
        React.createElement('button', {
          type: 'button',
          onClick: handleClose,
          style: {
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: '#737373',
            border: '2px solid #d4d4d4',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          },
          onMouseEnter: (e) => {
            e.target.style.backgroundColor = '#f5f5f5';
            e.target.style.borderColor = '#a3a3a3';
            e.target.style.color = '#404040';
          },
          onMouseLeave: (e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = '#d4d4d4';
            e.target.style.color = '#737373';
          }
        }, 'Cancelar'),
        React.createElement('button', {
          type: 'submit',
          style: {
            padding: '10px 20px',
            backgroundColor: '#7d26d9',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          },
          onMouseEnter: (e) => e.target.style.backgroundColor = '#6b1fb8',
          onMouseLeave: (e) => e.target.style.backgroundColor = '#7d26d9'
        }, 'Salvar Alterações')
      )
    )
  );
};

export default ModalEditarEquipamento;