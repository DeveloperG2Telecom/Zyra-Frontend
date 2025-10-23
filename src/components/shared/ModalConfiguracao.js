import React, { useState, useEffect } from 'react';

const ModalConfiguracao = ({ isVisible, item, onClose, onSave, title, fields = [] }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      const data = {};
      fields.forEach(field => {
        data[field.name] = item[field.name] || field.defaultValue || '';
      });
      setFormData(data);
    } else {
      const data = {};
      fields.forEach(field => {
        data[field.name] = field.defaultValue || '';
      });
      setFormData(data);
    }
  }, [item, fields]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    const requiredFields = fields.filter(f => f.required);
    for (const field of requiredFields) {
      if (!formData[field.name] || formData[field.name].toString().trim() === '') {
        alert(`${field.label} é obrigatório`);
        return;
      }
    }
    
    onSave(formData);
  };

  const handleClose = () => {
    const data = {};
    fields.forEach(field => {
      data[field.name] = field.defaultValue || '';
    });
    setFormData(data);
    onClose();
  };

  if (!isVisible) return null;

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
    onClick: handleClose
  },
    React.createElement('div', {
      style: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '100%',
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
          }, '⚙️'),
          React.createElement('div', null,
            React.createElement('h3', {
              style: {
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#404040',
                marginBottom: '2px'
              }
            }, title),
            React.createElement('p', {
              style: {
                fontSize: '12px',
                color: '#737373',
                margin: 0
              }
            }, item ? 'Atualize os dados' : 'Preencha os dados')
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

      // Form
      React.createElement('form', {
        onSubmit: handleSubmit,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }
      },
        // Renderizar campos dinamicamente
        fields.map(field => 
          React.createElement('div', { key: field.name },
            React.createElement('label', {
              style: {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '8px'
              }
            }, field.label + (field.required ? ' *' : '')),
            
            field.type === 'textarea' 
              ? React.createElement('textarea', {
                  value: formData[field.name] || '',
                  onChange: (e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value })),
                  placeholder: field.placeholder || '',
                  rows: field.rows || 3,
                  style: {
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #d4d4d4',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  },
                  onFocus: (e) => e.target.style.borderColor = '#7d26d9',
                  onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
                })
              : field.type === 'select'
              ? React.createElement('select', {
                  value: formData[field.name] || '',
                  onChange: (e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value })),
                  style: {
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #d4d4d4',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white'
                  },
                  onFocus: (e) => e.target.style.borderColor = '#7d26d9',
                  onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
                },
                  field.options?.map(option => 
                    React.createElement('option', { key: option.value, value: option.value }, option.label)
                  )
                )
              : React.createElement('input', {
                  type: field.type || 'text',
                  value: formData[field.name] || '',
                  onChange: (e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value })),
                  placeholder: field.placeholder || '',
                  style: {
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #d4d4d4',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white'
                  },
                  onFocus: (e) => e.target.style.borderColor = '#7d26d9',
                  onBlur: (e) => e.target.style.borderColor = '#d4d4d4',
                  required: field.required
                })
          )
        ),

        // Botões
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
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#737373',
              border: '2px solid #d4d4d4',
              borderRadius: '8px',
              fontSize: '14px',
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
              padding: '12px 24px',
              backgroundColor: '#7d26d9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            },
            onMouseEnter: (e) => e.target.style.backgroundColor = '#6b1fb8',
            onMouseLeave: (e) => e.target.style.backgroundColor = '#7d26d9'
          }, item ? 'Salvar Alterações' : 'Adicionar')
        )
      )
    )
  );
};

export default ModalConfiguracao;
