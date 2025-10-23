import React, { useState, useEffect } from 'react';
import Layout from './shared/Layout';
import ModalConfiguracao from './shared/ModalConfiguracao';
import api from '../services/api';

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState('tipos-acesso');
  const [showModal, setShowModal] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSalvando, setLoadingSalvando] = useState(false);
  const [loadingRecarregando, setLoadingRecarregando] = useState(false);
  const [error, setError] = useState(null);

  // Configuração dos tipos de dados
  const configs = {
    'tipos-acesso': {
      title: 'Tipos de Acesso',
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
    'pops': {
      title: 'POPs',
      endpoint: 'pops',
      fields: [
        { name: 'nome', label: 'Nome', type: 'text', required: true, placeholder: 'Ex: POP Central' },
        { name: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Descrição do POP...' },
        { name: 'ativo', label: 'Status', type: 'select', defaultValue: true, options: [
          { value: true, label: 'Ativo' },
          { value: false, label: 'Inativo' }
        ]}
      ]
    },
    'funcoes': {
      title: 'Funções',
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
      console.log(`🔍 CONFIGURAÇÕES: Carregando ${currentConfig.title}...`);
      console.log(`🔍 CONFIGURAÇÕES: Endpoint:`, currentConfig.endpoint);
      console.log(`🔍 CONFIGURAÇÕES: URL completa:`, `/configuracoes/${currentConfig.endpoint}`);
      console.log(`🔍 CONFIGURAÇÕES: Estado atual dos dados:`, dados);
      
      // Limpar dados antigos imediatamente
      setDados([]);
      console.log(`🔍 CONFIGURAÇÕES: Dados antigos limpos`);
      
      // Aguardar mais tempo para garantir que o backend processou a edição completamente
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await api.getConfiguracao(currentConfig.endpoint);
      console.log(`🔍 CONFIGURAÇÕES: Resposta da API:`, response);
      
      if (response && response.success) {
        console.log(`🔍 CONFIGURAÇÕES: Dados recebidos:`, response.data);
        console.log(`🔍 CONFIGURAÇÕES: Quantidade de itens:`, response.data?.length || 0);
        const novosDados = response.data || [];
        console.log(`🔍 CONFIGURAÇÕES: Definindo novos dados:`, novosDados);
        console.log(`🔍 CONFIGURAÇÕES: Dados atuais antes da atualização:`, dados);
        
        // Forçar limpeza completa do estado
        setDados([]);
        console.log(`🔍 CONFIGURAÇÕES: Estado limpo, aguardando...`);
        
        // Aguardar um pouco para garantir que o estado foi limpo
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Definir novos dados
        setDados(novosDados);
        console.log(`🔍 CONFIGURAÇÕES: Estado atualizado com novos dados:`, novosDados);
        
        // Aguardar para garantir que o React renderizou os dados
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`🔍 CONFIGURAÇÕES: Interface renderizada com dados atualizados`);
        
      } else {
        console.error(`🔍 CONFIGURAÇÕES: Erro na resposta:`, response);
        setError(`Erro ao carregar ${currentConfig.title.toLowerCase()}`);
      }
    } catch (err) {
      console.error(`🔍 CONFIGURAÇÕES: Erro ao carregar ${currentConfig.title.toLowerCase()}:`, err);
      setError('Erro ao conectar com o servidor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
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
      // Primeiro loading: salvando no banco
      setLoadingSalvando(true);
      console.log(`🔍 CONFIGURAÇÕES: Salvando ${currentConfig.title.toLowerCase()}...`);
      console.log(`🔍 CONFIGURAÇÕES: Dados do formulário:`, dadosForm);
      console.log(`🔍 CONFIGURAÇÕES: Item editando:`, itemEditando);
      
      let response;
      
      if (itemEditando) {
        // Editar
        console.log(`🔍 CONFIGURAÇÕES: Editando item ID:`, itemEditando.id);
        response = await api.updateConfiguracao(currentConfig.endpoint, itemEditando.id, dadosForm);
        console.log(`🔍 CONFIGURAÇÕES: Resposta da edição:`, response);
      } else {
        // Adicionar
        console.log(`🔍 CONFIGURAÇÕES: Criando novo item`);
        response = await api.createConfiguracao(currentConfig.endpoint, dadosForm);
        console.log(`🔍 CONFIGURAÇÕES: Resposta da criação:`, response);
      }
      
      if (response && response.success) {
        console.log(`🔍 CONFIGURAÇÕES: Salvo com sucesso no banco!`);
        
        // Fechar modal
        setShowModal(false);
        setItemEditando(null);
        
        // Desativar loading de salvamento
        setLoadingSalvando(false);
        
        // Ativar loading de recarregamento
        setLoadingRecarregando(true);
        console.log(`🔍 CONFIGURAÇÕES: Iniciando recarregamento de dados...`);
        
        // Aguardar mais tempo para garantir que o backend processou completamente
        setTimeout(async () => {
          console.log(`🔍 CONFIGURAÇÕES: Iniciando busca de dados atualizados...`);
          await carregarDados();
          console.log(`🔍 CONFIGURAÇÕES: Dados recarregados com sucesso!`);
          
          // Só desativar loading DEPOIS de buscar e renderizar os dados
          setLoadingRecarregando(false);
          console.log(`🔍 CONFIGURAÇÕES: Loading de recarregamento desativado - dados atualizados na tela`);
        }, 1000); // Aumentado para 1000ms (1 segundo) para garantir processamento completo
        
      } else {
        console.error(`🔍 CONFIGURAÇÕES: Erro na resposta:`, response);
        alert('Erro ao salvar: ' + (response?.error || 'Resposta inválida'));
        setLoadingSalvando(false);
      }
    } catch (err) {
      console.error(`🔍 CONFIGURAÇÕES: Erro ao salvar ${currentConfig.title.toLowerCase()}:`, err);
      alert('Erro ao conectar com o servidor: ' + err.message);
      setLoadingSalvando(false);
    }
  };

  const handleDeletar = async (id) => {
    console.log(`🔍 CONFIGURAÇÕES: Tentando deletar ${currentConfig.title.toLowerCase()}:`, id);
    
    if (window.confirm(`Tem certeza que deseja deletar este ${currentConfig.title.toLowerCase()}?`)) {
      try {
        setLoading(true);
        console.log('🔍 CONFIGURAÇÕES: Chamando API para deletar...');
        const response = await api.deleteConfiguracao(currentConfig.endpoint, id);
        console.log('🔍 CONFIGURAÇÕES: Resposta da API:', response);
        
        if (response.success) {
          console.log('🔍 CONFIGURAÇÕES: Deletado com sucesso, recarregando lista...');
          // Recarregar lista após deletar
          await carregarDados();
        } else {
          console.error('🔍 CONFIGURAÇÕES: Erro na resposta:', response.error);
          alert('Erro ao deletar: ' + response.error);
        }
      } catch (err) {
        console.error(`🔍 CONFIGURAÇÕES: Erro ao deletar ${currentConfig.title.toLowerCase()}:`, err);
        alert('Erro ao conectar com o servidor: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const tabs = [
    { id: 'tipos-acesso', label: 'Tipos de Acesso', icon: '' },
    { id: 'pops', label: 'POPs', icon: '' },
    { id: 'funcoes', label: 'Funções', icon: '' }
  ];

  return React.createElement(Layout, null,
    React.createElement('style', null, `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `),
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
            tab.icon && React.createElement('span', { style: { fontSize: '16px' } }, tab.icon),
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

        // Loading de salvamento no banco
        loadingSalvando && React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            margin: '16px 0',
            color: '#92400e',
            fontSize: '14px',
            fontWeight: '500'
          }
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }
          },
            React.createElement('div', {
              style: {
                width: '16px',
                height: '16px',
                border: '2px solid #f59e0b',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }
            }),
            'Salvando no banco de dados...'
          )
        ),

        // Loading de recarregamento de dados
        loadingRecarregando && React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '8px',
            margin: '16px 0',
            color: '#0369a1',
            fontSize: '14px',
            fontWeight: '500'
          }
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }
          },
            React.createElement('div', {
              style: {
                width: '16px',
                height: '16px',
                border: '2px solid #0ea5e9',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }
            }),
            'Recarregando dados da tela...'
          )
        ),
        
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
        
        // Lista de dados
        !loading && !loadingSalvando && !loadingRecarregando && !error && React.createElement('div', {
          style: {
            display: 'grid',
            gap: '12px'
          }
        },
          dados.length === 0 ? React.createElement('div', {
            style: {
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }
          }, `Nenhum ${currentConfig.title.toLowerCase()} cadastrado. Clique em "Adicionar" para criar o primeiro.`) : null,
          dados.map((item, index) =>
            React.createElement('div', {
              key: index,
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                marginBottom: '8px'
              }
            },
              React.createElement('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }
              },
                React.createElement('div', null,
                  React.createElement('span', {
                    style: {
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937'
                    }
                  }, item.nome),
                  item.descricao && React.createElement('span', {
                    style: {
                      fontSize: '12px',
                      color: '#6b7280',
                      marginLeft: '8px'
                    }
                  }, `- ${item.descricao}`)
                ),
                React.createElement('span', {
                  style: {
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: item.ativo ? '#dcfce7' : '#fef3c7',
                    color: item.ativo ? '#166534' : '#92400e'
                  }
                }, item.ativo ? 'Ativo' : 'Inativo')
              ),
              React.createElement('div', {
                style: {
                  display: 'flex',
                  gap: '6px'
                }
              },
                React.createElement('button', {
                  onClick: () => handleEditar(item),
                  style: {
                    padding: '6px 10px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '11px',
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
                }, 'Editar'),
                React.createElement('button', {
                  onClick: () => handleDeletar(item.id),
                  style: {
                    padding: '6px 10px',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: '4px',
                    fontSize: '11px',
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
                }, 'Deletar')
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

export default Configuracoes;