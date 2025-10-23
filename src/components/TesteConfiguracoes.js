import React, { useState, useEffect } from 'react';
import Layout from './shared/Layout';
import api from '../services/api';

const TesteConfiguracoes = () => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 TESTE: Carregando dados...');
      
      const response = await api.getConfiguracao('tipos-acesso');
      console.log('🔍 TESTE: Resposta completa:', response);
      
      if (response && response.success) {
        console.log('🔍 TESTE: Dados recebidos:', response.data);
        setDados(response.data || []);
      } else {
        console.error('🔍 TESTE: Erro na resposta:', response);
        setError('Erro ao carregar dados');
      }
    } catch (err) {
      console.error('🔍 TESTE: Erro:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return React.createElement(Layout, null,
    React.createElement('div', {
      style: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }
    },
      React.createElement('h1', {
        style: {
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '20px'
        }
      }, 'Teste de Configurações'),
      
      React.createElement('div', {
        style: {
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }
      },
        React.createElement('h2', {
          style: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '20px'
          }
        }, 'Tipos de Acesso'),
        
        loading && React.createElement('div', {
          style: {
            textAlign: 'center',
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
        
        !loading && !error && React.createElement('div', null,
          React.createElement('p', {
            style: {
              marginBottom: '20px',
              color: '#6b7280'
            }
          }, `Encontrados ${dados.length} tipos de acesso`),
          
          dados.length === 0 ? React.createElement('div', {
            style: {
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }
          }, 'Nenhum tipo de acesso cadastrado') : null,
          
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
                  }, item.nome || 'Sem nome'),
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
                  fontSize: '11px',
                  color: '#6b7280'
                }
              }, `ID: ${item.id}`)
            )
          )
        )
      )
    )
  );
};

export default TesteConfiguracoes;
