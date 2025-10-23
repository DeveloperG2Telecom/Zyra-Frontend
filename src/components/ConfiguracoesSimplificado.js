import React, { useState, useEffect } from 'react';
import Layout from './shared/Layout';
import ModalConfiguracao from './shared/ModalConfiguracao';
import api from '../services/api';

const ConfiguracoesSimplificado = () => {
  const [activeTab, setActiveTab] = useState('tipos-acesso');
  const [showModal, setShowModal] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuração dos tipos de dados
  const configs = {
    'tipos-acesso': {
      title: 'Tipos de Acesso',
      icon: '🔐',
      endpoint: 'tipos-acesso',
      fields: [
        { name: 'nome', label: 'Nome', type: 'text', required: true, placeholder: 'Ex: SSH, Telnet' },
        { name: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Descrição do tipo de acesso...' },
        { name: 'ativo', label: 'Status', type: 'select', defaultValue: true, options: [
          { value: true, label: 'Ativo' },
          { value: false, label: 'Inativo' }
        ]}
      ]
    },
    'funcoes': {
      title: 'Funções',
      icon: '⚙️',
      endpoint: 'funcoes',
      fields: [
        { name: 'nome', label: 'Nome', type: 'text', required: true, placeholder: 'Ex: Roteamento, Firewall' },
        { name: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Descrição da função...' },
        { name: 'ativo', label: 'Status', type: 'select', defaultValue: true, options: [
          { value: true, label: 'Ativo' },
          { value: false, label: 'Inativo' }
        ]}
      ]
    }
  };

  const currentConfig = configs[activeTab];

  // Carregar dados da API
  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.request(`/configuracoes/${currentConfig.endpoint}`);
      if (response.success) {
        setDados(response.data || []);
      } else {
        setError('Erro ao carregar dados');
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [activeTab]);

  const handleAdicionar = () => {
    setItemEditando(null);
    setShowModal(true);
  };

  const handleEditar = (item) => {
    setItemEditando(item);
    setShowModal(true);
  };

  const handleSalvar = async (dadosForm) => {
    try {
      setLoading(true);
      let response;
      
      if (itemEditando) {
        response = await api.request(`/configuracoes/${currentConfig.endpoint}/${itemEditando.id}`, {
          method: 'PUT',
          body: JSON.stringify(dadosForm)
        });
      } else {
        response = await api.request(`/configuracoes/${currentConfig.endpoint}`, {
          method: 'POST',
          body: JSON.stringify(dadosForm)
        });
      }
      
      if (response.success) {
        await carregarDados();
        setShowModal(false);
        setItemEditando(null);
      } else {
        alert('Erro ao salvar: ' + response.error);
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este item?')) {
      try {
        setLoading(true);
        const response = await api.request(`/configuracoes/${currentConfig.endpoint}/${id}`, {
          method: 'DELETE'
        });
        
        if (response.success) {
          await carregarDados();
        } else {
          alert('Erro ao deletar: ' + response.error);
        }
      } catch (err) {
        console.error('Erro ao deletar:', err);
        alert('Erro ao conectar com o servidor');
      } finally {
        setLoading(false);
      }
    }
  };

  const tabs = [
    { id: 'tipos-acesso', label: 'Tipos de Acesso', icon: '🔐' },
    { id: 'funcoes', label: 'Funções', icon: '⚙️' }
  ];

  return React.createElement(Layout, null,
    React.createElement('div', {
      style: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }
    },
      // Header
      React.createElement('div', {
        style: {
          marginBottom: '30px'
        }
      },
        React.createElement('h1', {
          style: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px'
          }
        }, 'Configurações'),
        React.createElement('p', {
          style: {
            fontSize: '16px',
            color: '#6b7280',
            margin: 0
          }
        }, 'Gerencie os dados mestres do sistema')
      ),

      // Tabs
      React.createElement('div', {
        style: {
          display: 'flex',
          borderBottom: '2px solid #e5e7eb',
          marginBottom: '30px'
        }
      },
        tabs.map(tab => 
          React.createElement('button', {
            key: tab.id,
            onClick: () => setActiveTab(tab.id),
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? '#7d26d9' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#6b7280',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid #7d26d9' : '2px solid transparent',
              transition: 'all 0.2s ease'
            },
            onMouseEnter: (e) => {
              if (activeTab !== tab.id) {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.color = '#374151';
              }
            },
            onMouseLeave: (e) => {
              if (activeTab !== tab.id) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6b7280';
              }
            }
          },
            React.createElement('span', { style: { fontSize: '16px' } }, tab.icon),
            tab.label
          )
        )
      ),

      // Content
      React.createElement('div', {
        style: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }
      },
        // Header da seção
        React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }
        },
          React.createElement('h2', {
            style: {
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }
          }, currentConfig.title),
          React.createElement('button', {
            onClick: handleAdicionar,
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: '#7d26d9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            },
            onMouseEnter: (e) => e.target.style.backgroundColor = '#6b1fb8',
            onMouseLeave: (e) => e.target.style.backgroundColor = '#7d26d9'
          },
            React.createElement('span', null, '➕'),
            'Adicionar'
          )
        ),

        // Loading/Error states
        loading && React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: '#6b7280'
          }
        }, 'Carregando...'),
        
        error && React.createElement('div', {
          style: {
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            color: '#dc2626'
          }
        }, `Erro: ${error}`),
        
        // Lista de itens
        !loading && !error && React.createElement('div', {
          style: {
            display: 'grid',
            gap: '12px'
          }
        },
          dados.map((item, index) =>
            React.createElement('div', {
              key: index,
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
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
                    backgroundColor: item.ativo ? '#7d26d9' : '#9ca3af',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }
                }, item.nome.charAt(0)),
                React.createElement('div', null,
                  React.createElement('h3', {
                    style: {
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: '0 0 4px 0'
                    }
                  }, item.nome),
                  React.createElement('p', {
                    style: {
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: '0 0 4px 0'
                    }
                  }, item.descricao),
                  React.createElement('span', {
                    style: {
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: item.ativo ? '#dcfce7' : '#fef3c7',
                      color: item.ativo ? '#166534' : '#92400e'
                    }
                  }, item.ativo ? 'Ativo' : 'Inativo')
                )
              ),
              React.createElement('div', {
                style: {
                  display: 'flex',
                  gap: '8px'
                }
              },
                React.createElement('button', {
                  onClick: () => handleEditar(item),
                  style: {
                    padding: '8px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  },
                  onMouseEnter: (e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                    e.target.style.borderColor = '#9ca3af';
                  },
                  onMouseLeave: (e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.borderColor = '#d1d5db';
                  }
                }, '✏️ Editar'),
                React.createElement('button', {
                  onClick: () => handleDeletar(item.id),
                  style: {
                    padding: '8px 12px',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  },
                  onMouseEnter: (e) => {
                    e.target.style.backgroundColor = '#fee2e2';
                    e.target.style.borderColor = '#fca5a5';
                  },
                  onMouseLeave: (e) => {
                    e.target.style.backgroundColor = '#fef2f2';
                    e.target.style.borderColor = '#fecaca';
                  }
                }, '🗑️ Deletar')
              )
            )
          )
        )
      ),

      // Modal genérico
      React.createElement(ModalConfiguracao, {
        isVisible: showModal,
        item: itemEditando,
        title: itemEditando ? `Editar ${currentConfig.title}` : `Adicionar ${currentConfig.title}`,
        fields: currentConfig.fields,
        onClose: () => {
          setShowModal(false);
          setItemEditando(null);
        },
        onSave: handleSalvar
      })
    )
  );
};

export default ConfiguracoesSimplificado;
