import React, { useState, useEffect } from 'react';
import Layout from './shared/Layout';
import EquipamentoCard from './shared/EquipamentoCard';
import EquipamentoModal from './shared/EquipamentoModal';
import ModalAdicionarEquipamento from './shared/ModalAdicionarEquipamento';
import ModalEditarEquipamento from './shared/ModalEditarEquipamento';
import { useEquipamentos } from '../hooks/useEquipamentos';
import { useDebounce } from '../hooks/useDebounce';
import { useNotification } from '../hooks/useNotification';
import Notification from './shared/Notification';

function Equipamentos() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnimating, setSidebarAnimating] = useState(false);
  const [sidebarAnimatingOut, setSidebarAnimatingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipamento, setSelectedEquipamento] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [equipamentoParaEditar, setEquipamentoParaEditar] = useState(null);

  // Usar hook personalizado para equipamentos
  const { equipamentos, loading, error, loadEquipamentos, refreshEquipamentos, createEquipamento, updateEquipamento, deleteEquipamento } = useEquipamentos();
  
  // Hook para notificações
  const { notifications, showSuccess, showError, removeNotification } = useNotification();
  
  // Debug: Log dos equipamentos
  React.useEffect(() => {
    console.log('📊 COMPONENTE: Equipamentos atualizados:', equipamentos);
    console.log('📊 COMPONENTE: Quantidade de equipamentos:', equipamentos?.length || 0);
    console.log('📊 COMPONENTE: Loading:', loading);
    console.log('📊 COMPONENTE: Error:', error);
  }, [equipamentos, loading, error]);

  // Carregamento inicial apenas uma vez
  React.useEffect(() => {
    console.log('Componente Equipamentos montado');
  }, []);
  
  // Debounce da pesquisa para melhor performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filtro otimizado com debounce
  const filteredEquipamentos = React.useMemo(() => {
    console.log('🔍 FILTRO: Aplicando filtro...');
    console.log('🔍 FILTRO: Equipamentos originais:', equipamentos?.length || 0);
    console.log('🔍 FILTRO: Termo de busca:', debouncedSearchTerm);
    
    if (!debouncedSearchTerm) {
      console.log('🔍 FILTRO: Sem termo de busca, retornando todos os equipamentos');
      return equipamentos;
    }
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    const filtered = equipamentos.filter(equipamento =>
      equipamento.nome?.toLowerCase().includes(searchLower) ||
      equipamento.modelo?.toLowerCase().includes(searchLower) ||
      equipamento.serialMac?.toLowerCase().includes(searchLower) ||
      equipamento.ipPrivado?.includes(debouncedSearchTerm) ||
      equipamento.ipPublico?.includes(debouncedSearchTerm) ||
      (equipamento.localidade?.endereco?.toLowerCase().includes(searchLower)) ||
      equipamento.modoAcesso?.toLowerCase().includes(searchLower) ||
      (equipamento.funcoes?.some(funcao => funcao.toLowerCase().includes(searchLower)))
    );
    
    console.log('🔍 FILTRO: Equipamentos filtrados:', filtered.length);
    return filtered;
  }, [equipamentos, debouncedSearchTerm]);

  // Fechar menu de opções quando clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOptionsMenu && !event.target.closest('[data-options-menu]')) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptionsMenu]);

  if (loading) {
    return React.createElement(Layout, { currentPage: '/equipamentos' },
      React.createElement('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: 'white',
          fontSize: '18px'
        }
      }, 'Carregando equipamentos...')
    );
  }

  if (error) {
    return React.createElement(Layout, { currentPage: '/equipamentos' },
      React.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: 'white',
          textAlign: 'center',
          padding: '20px'
        }
      },
        React.createElement('h2', { style: { marginBottom: '16px' } }, 'Erro ao carregar equipamentos'),
        React.createElement('p', { style: { marginBottom: '20px', color: 'rgba(255, 255, 255, 0.7)' } }, error),
        React.createElement('button', {
          onClick: loadEquipamentos,
          style: {
            padding: '10px 20px',
            backgroundColor: '#7d26d9',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }
        }, 'Tentar Novamente')
      )
    );
  }

  const toggleSidebar = () => {
    if (sidebarVisible) {
      setSidebarAnimatingOut(true);
      setTimeout(() => {
        setSidebarVisible(false);
        setSidebarAnimatingOut(false);
      }, 300);
    } else {
      setSidebarVisible(true);
      setSidebarAnimating(true);
      setTimeout(() => {
        setSidebarAnimating(false);
      }, 300);
    }
  };

  const handleEquipamentoClick = (equipamento) => {
    setSelectedEquipamento(equipamento);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEquipamento(null);
  };

  const handleSaveEquipamento = async (equipamentoData) => {
    console.log('handleSaveEquipamento chamada com:', equipamentoData);
    try {
      // Validação apenas do campo obrigatório
      if (!equipamentoData.nome || equipamentoData.nome.trim() === '') {
        showError('Por favor, preencha o nome do equipamento.');
        return;
      }

      if (!equipamentoData.tipo || equipamentoData.tipo.trim() === '') {
        showError('Por favor, selecione o tipo do equipamento.');
        return;
      }

      // Função auxiliar para converter valores vazios em null
      const toNullIfEmpty = (value) => {
        if (value === '' || value === undefined || value === null) return null;
        return value;
      };

      // Função auxiliar para converter coordenadas
      const parseCoordinate = (value) => {
        if (!value || value === '') return null;
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
      };

      // Preparar dados conforme schema do backend (apenas nome obrigatório)
      const dadosParaSalvar = {
        nome: equipamentoData.nome.trim(),
        tipo: equipamentoData.tipo.trim(),
        modelo: toNullIfEmpty(equipamentoData.modelo),
        serialMac: toNullIfEmpty(equipamentoData.serialMac),
        ipPublico: toNullIfEmpty(equipamentoData.ipPublico),
        ipPrivado: toNullIfEmpty(equipamentoData.ipPrivado),
        localidade: equipamentoData.localidade && (equipamentoData.localidade.lat || equipamentoData.localidade.lng || equipamentoData.localidade.endereco) ? {
          lat: parseCoordinate(equipamentoData.localidade.lat),
          lng: parseCoordinate(equipamentoData.localidade.lng),
          endereco: toNullIfEmpty(equipamentoData.localidade.endereco)
        } : null,
        quantidadePortas: toNullIfEmpty(equipamentoData.quantidadePortas),
        alimentacao: toNullIfEmpty(equipamentoData.alimentacao),
        dataAquisicao: equipamentoData.dataAquisicao ? new Date(equipamentoData.dataAquisicao).toISOString() : null,
        tempoGarantia: toNullIfEmpty(equipamentoData.tempoGarantia),
        versaoFirmware: toNullIfEmpty(equipamentoData.versaoFirmware),
        modoAcesso: toNullIfEmpty(equipamentoData.modoAcesso),
        funcoes: equipamentoData.funcoes && equipamentoData.funcoes.length > 0 ? equipamentoData.funcoes : null,
        status: toNullIfEmpty(equipamentoData.status) || 'Ativo',
        equipamentoAnterior: toNullIfEmpty(equipamentoData.equipamentoAnterior),
        equipamentoPosterior: toNullIfEmpty(equipamentoData.equipamentoPosterior),
        fotoEquipamento: toNullIfEmpty(equipamentoData.fotoEquipamento),
        pop: toNullIfEmpty(equipamentoData.pop),
        redeRural: toNullIfEmpty(equipamentoData.redeRural)
      };

      console.log('🔍 EQUIPAMENTOS: Dados do equipamento a ser salvo (formatados):', dadosParaSalvar);
      console.log('🔍 EQUIPAMENTOS: JSON stringify dos dados:', JSON.stringify(dadosParaSalvar, null, 2));
      
      const response = await createEquipamento(dadosParaSalvar);
      
      if (response.success) {
        setShowAddModal(false);
        showSuccess('Equipamento adicionado com sucesso!');
      } else {
        throw new Error(response.error?.message || 'Erro ao criar equipamento');
      }
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error);
      showError(`Erro ao salvar equipamento: ${error.message || 'Tente novamente.'}`);
    }
  };

  const handleEditEquipamento = (equipamento) => {
    console.log('Editar equipamento:', equipamento);
    // Fechar modal de visualização se estiver aberto
    setModalVisible(false);
    setSelectedEquipamento(null);
    // Abrir modal de edição
    setEquipamentoParaEditar(equipamento);
    setShowEditModal(true);
  };

  const handleSaveEditEquipamento = async (equipamentoData) => {
    console.log('handleSaveEditEquipamento chamada com:', equipamentoData);
    try {
      if (!equipamentoData.nome || equipamentoData.nome.trim() === '') {
        showError('Por favor, preencha o nome do equipamento.');
        return;
      }

      if (!equipamentoData.tipo || equipamentoData.tipo.trim() === '') {
        showError('Por favor, selecione o tipo do equipamento.');
        return;
      }

      const toNullIfEmpty = (value) => {
        if (value === '' || value === undefined || value === null) return null;
        return value;
      };

      const parseCoordinate = (value) => {
        if (!value || value === '') return null;
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
      };

      const dadosParaSalvar = {
        nome: equipamentoData.nome.trim(),
        tipo: equipamentoData.tipo.trim(),
        modelo: toNullIfEmpty(equipamentoData.modelo),
        serialMac: toNullIfEmpty(equipamentoData.serialMac),
        ipPublico: toNullIfEmpty(equipamentoData.ipPublico),
        ipPrivado: toNullIfEmpty(equipamentoData.ipPrivado),
        localidade: equipamentoData.localidade && (equipamentoData.localidade.lat || equipamentoData.localidade.lng || equipamentoData.localidade.endereco) ? {
          lat: parseCoordinate(equipamentoData.localidade.lat),
          lng: parseCoordinate(equipamentoData.localidade.lng),
          endereco: toNullIfEmpty(equipamentoData.localidade.endereco)
        } : null,
        quantidadePortas: toNullIfEmpty(equipamentoData.quantidadePortas),
        alimentacao: toNullIfEmpty(equipamentoData.alimentacao),
        dataAquisicao: equipamentoData.dataAquisicao ? new Date(equipamentoData.dataAquisicao).toISOString() : null,
        tempoGarantia: toNullIfEmpty(equipamentoData.tempoGarantia),
        versaoFirmware: toNullIfEmpty(equipamentoData.versaoFirmware),
        modoAcesso: toNullIfEmpty(equipamentoData.modoAcesso),
        funcoes: equipamentoData.funcoes && equipamentoData.funcoes.length > 0 ? equipamentoData.funcoes : null,
        status: toNullIfEmpty(equipamentoData.status) || 'Ativo',
        equipamentoAnterior: toNullIfEmpty(equipamentoData.equipamentoAnterior),
        equipamentoPosterior: toNullIfEmpty(equipamentoData.equipamentoPosterior),
        fotoEquipamento: toNullIfEmpty(equipamentoData.fotoEquipamento),
        pop: toNullIfEmpty(equipamentoData.pop),
        redeRural: toNullIfEmpty(equipamentoData.redeRural)
      };

      console.log('Dados do equipamento a ser atualizado (formatados):', dadosParaSalvar);
      
      const response = await updateEquipamento(equipamentoParaEditar.id, dadosParaSalvar);
      
      if (response.success) {
        setShowEditModal(false);
        setEquipamentoParaEditar(null);
        showSuccess('Equipamento atualizado com sucesso!');
        refreshEquipamentos();
      } else {
        throw new Error(response.error?.message || 'Erro ao atualizar equipamento');
      }
    } catch (error) {
      console.error('Erro ao atualizar equipamento:', error);
      showError(`Erro ao atualizar equipamento: ${error.message || 'Tente novamente.'}`);
    }
  };

  const handleDeleteEquipamento = async (equipamentoId) => {
    try {
      const response = await deleteEquipamento(equipamentoId);
      
      if (response.success) {
        showSuccess('Equipamento deletado com sucesso!');
      } else {
        throw new Error(response.error?.message || 'Erro ao deletar equipamento');
      }
    } catch (error) {
      console.error('Erro ao deletar equipamento:', error);
      showError(`Erro ao deletar equipamento: ${error.message || 'Tente novamente.'}`);
    }
  };

  return React.createElement(Layout, { currentPage: '/equipamentos' },
    // CSS para animação de loading
    React.createElement('style', null, `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `),
    
    // Background Animado (mesmo da tela de login)
    React.createElement('div', { 
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        overflow: 'hidden',
        zIndex: -1
      }
    },
      // Grid animado
      React.createElement('div', { 
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(125, 38, 217, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125, 38, 217, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }
      }),
      
      // Nós de rede pulsantes
      React.createElement('div', { 
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%'
        }
      },
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 15px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite',
            top: '15%',
            left: '8%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 15px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 0.5s',
            top: '25%',
            left: '85%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 15px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 1s',
            top: '55%',
            left: '15%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 15px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 1.5s',
            top: '65%',
            left: '75%'
          }
        }),
        React.createElement('div', { 
          style: {
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: '#7d26d9',
            borderRadius: '50%',
            boxShadow: '0 0 15px #7d26d9',
            animation: 'pulse 2s ease-in-out infinite 2s',
            top: '35%',
            left: '45%'
          }
        })
      ),
      
      // Linhas de conexão
      React.createElement('div', { 
        style: {
          position: 'absolute',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #7d26d9, transparent)',
          animation: 'data-flow 3s ease-in-out infinite',
          top: '20%',
          left: '8%',
          width: '77%',
          transform: 'rotate(12deg)'
        }
      }),
      React.createElement('div', { 
        style: {
          position: 'absolute',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #7d26d9, transparent)',
          animation: 'data-flow 3s ease-in-out infinite 1.5s',
          top: '50%',
          left: '15%',
          width: '60%',
          transform: 'rotate(-15deg)'
        }
      })
    ),
    
    // Navbar fixa superior
    React.createElement('div', { 
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(125, 38, 217, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }
    },
      // Logo e título
      React.createElement('div', { 
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }
      },
        React.createElement('img', { 
          src: '/logo-sem-fundo.png', 
          alt: 'Zyra Logo', 
          style: {
            width: '32px',
            height: '32px',
            objectFit: 'contain'
          }
        }),
        React.createElement('div', null,
          React.createElement('h1', { 
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#7d26d9',
              margin: 0,
              lineHeight: 1
            }
          }, 'Zyra'),
          React.createElement('p', { 
            style: {
              fontSize: '9px',
              color: '#737373',
              fontWeight: '500',
              margin: 0,
              lineHeight: 1
            }
          }, 'Sistema de Monitoramento')
        )
      ),
      
      // Menu de navegação horizontal
      React.createElement('nav', { 
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }
      },
        React.createElement('button', {
          onClick: () => window.location.href = '/home',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#404040',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('rect', { x: '3', y: '3', width: '7', height: '7' }),
            React.createElement('rect', { x: '14', y: '3', width: '7', height: '7' }),
            React.createElement('rect', { x: '14', y: '14', width: '7', height: '7' }),
            React.createElement('rect', { x: '3', y: '14', width: '7', height: '7' })
          ),
          'Dashboard'
        ),
        React.createElement('button', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'rgba(125, 38, 217, 0.1)',
            color: '#7d26d9',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2', ry: '2' }),
            React.createElement('line', { x1: '8', y1: '21', x2: '16', y2: '21' }),
            React.createElement('line', { x1: '12', y1: '17', x2: '12', y2: '21' })
          ),
          'Equipamentos'
        ),
        React.createElement('button', {
          onClick: () => window.location.href = '/pops',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#404040',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
            React.createElement('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
          ),
          'POPs'
        ),
        React.createElement('button', {
          onClick: () => window.location.href = '/topologia',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#404040',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
            React.createElement('line', { x1: '2', y1: '12', x2: '22', y2: '12' }),
            React.createElement('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
          ),
          'Topologia'
        ),
        React.createElement('button', {
          onClick: () => window.location.href = '/teste-conexao',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#404040',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('path', { d: 'M9 12l2 2 4-4' }),
            React.createElement('path', { d: 'M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3' }),
            React.createElement('path', { d: 'M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3' }),
            React.createElement('path', { d: 'M13 12h3a2 2 0 0 1 2 2v1' }),
            React.createElement('path', { d: 'M13 12h-3a2 2 0 0 0-2 2v1' })
          ),
          'Teste Conexão'
        ),
        React.createElement('button', {
          onClick: () => window.location.href = '/monitoramento',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#404040',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('path', { d: 'M22 12h-4l-3 9L9 3l-3 9H2' })
          ),
          'Monitoramento'
        ),
        React.createElement('button', {
          onClick: () => window.location.href = '/backups',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#404040',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('path', { d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' }),
            React.createElement('polyline', { points: '3.27,6.96 12,12.01 20.73,6.96' }),
            React.createElement('line', { x1: '12', y1: '22.08', x2: '12', y2: '12' })
          ),
          'Backups'
        )
      ),
      
      // Status, filtro e logout
      React.createElement('div', { 
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }
      },
        // Botão de filtro
        React.createElement('button', {
          onClick: toggleSidebar,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: sidebarVisible ? 'rgba(125, 38, 217, 0.1)' : 'transparent',
            color: sidebarVisible ? '#7d26d9' : '#404040',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('polygon', { points: '22,3 2,3 10,12.46 10,19 14,21 14,12.46' })
          ),
          'Filtros'
        ),
        React.createElement('div', { 
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '16px',
            color: '#10b981',
            fontSize: '11px',
            fontWeight: '500'
          }
        },
          React.createElement('svg', {
            width: '8',
            height: '8',
            viewBox: '0 0 24 24',
            fill: 'currentColor'
          },
            React.createElement('circle', { cx: '12', cy: '12', r: '10' })
          ),
          'Online'
        ),
        React.createElement('button', {
          onClick: () => window.location.href = '/login',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'rgba(251, 143, 55, 0.1)',
            color: '#fb8f37',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
            React.createElement('polyline', { points: '16,17 21,12 16,7' }),
            React.createElement('line', { x1: '21', y1: '12', x2: '9', y2: '12' })
          ),
          'Sair'
        )
      )
    ),
    
    // Layout principal com padding para navbar
    React.createElement('div', { 
      style: {
        paddingTop: '60px',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 10
      }
    },
      // Sidebar (condicional)
      (sidebarVisible || sidebarAnimating || sidebarAnimatingOut) && React.createElement('div', { 
        style: {
          width: '280px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(125, 38, 217, 0.1)',
          padding: '24px 0',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: '60px',
          left: 0,
          height: 'calc(100vh - 60px)',
          overflowY: 'auto',
          zIndex: 999,
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
          transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
          animation: sidebarAnimating ? 'slideInLeft 0.3s ease-out' : sidebarAnimatingOut ? 'slideOutLeft 0.3s ease-in' : 'none'
        }
      },
        // Filtros específicos para equipamentos
        React.createElement('div', { 
          style: {
            flex: 1,
            padding: '0 16px'
          }
        },
          React.createElement('div', { 
            style: {
              marginBottom: '24px'
            }
          },
            React.createElement('h3', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                marginBottom: '12px'
              }
            }, 'Pesquisar Equipamento'),
            React.createElement('input', {
              type: 'text',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              placeholder: 'Nome, modelo, IP, localidade...',
              style: {
                width: '100%',
                padding: '8px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '11px',
                outline: 'none',
                transition: 'border-color 0.2s',
                marginBottom: '16px'
              },
              onFocus: (e) => e.target.style.borderColor = '#7d26d9',
              onBlur: (e) => e.target.style.borderColor = '#d4d4d4'
            })
          ),
          
          React.createElement('div', { 
            style: {
              marginBottom: '24px'
            }
          },
            React.createElement('h3', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                marginBottom: '12px'
              }
            }, 'Filtros por Fabricante'),
            React.createElement('div', { 
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }
            },
              React.createElement('button', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(125, 38, 217, 0.1)',
                  color: '#7d26d9',
                  fontSize: '10px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }
              },
                React.createElement('span', { style: { fontSize: '12px' } }, '🔧'),
                'Mikrotik'
              ),
              React.createElement('button', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6',
                  fontSize: '10px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }
              },
                React.createElement('span', { style: { fontSize: '12px' } }, '📡'),
                'Huawei'
              ),
              React.createElement('button', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontSize: '10px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }
              },
                React.createElement('span', { style: { fontSize: '12px' } }, '📶'),
                'Ubiquiti'
              )
            )
          ),
          
          React.createElement('div', { 
            style: {
              marginBottom: '24px'
            }
          },
            React.createElement('h3', { 
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                marginBottom: '12px'
              }
            }, 'Status'),
            React.createElement('div', { 
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }
            },
              React.createElement('button', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontSize: '10px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }
              },
                React.createElement('span', { style: { fontSize: '12px' } }, '✅'),
                'Online'
              ),
              React.createElement('button', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: '#f59e0b',
                  fontSize: '10px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }
              },
                React.createElement('span', { style: { fontSize: '12px' } }, '⚠️'),
                'Com Alertas'
              ),
              React.createElement('button', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  fontSize: '10px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }
              },
                React.createElement('span', { style: { fontSize: '12px' } }, '❌'),
                'Offline'
              )
            )
          )
        )
      ),
      
      // Conteúdo principal
      React.createElement('div', { 
        style: {
          marginLeft: (sidebarVisible || sidebarAnimating || sidebarAnimatingOut) ? '280px' : '0',
          padding: '24px',
          minHeight: 'calc(100vh - 60px)',
          overflow: 'auto',
          transition: 'margin-left 0.3s ease-out'
        }
      },
        // Header
        React.createElement('div', { 
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }
        },
          React.createElement('div', null,
            React.createElement('h2', { 
              style: {
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '4px'
              }
            }, 'Equipamentos'),
            React.createElement('p', { 
              style: {
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }, `${filteredEquipamentos.length} equipamentos encontrados`)
          ),
          React.createElement('div', { 
            'data-options-menu': true,
            style: {
              position: 'relative'
            }
          },
            // Botão de teste direto
            React.createElement('button', {
              onClick: async () => {
                console.log('🧪 TESTE: Testando conexão direta com backend...');
                try {
                  const response = await fetch('http://localhost:3002/api/v1/equipamentos', {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  console.log('🧪 TESTE: Status:', response.status);
                  const data = await response.json();
                  console.log('🧪 TESTE: Dados recebidos:', data);
                  alert(`Teste direto: ${response.status} - ${data?.data?.length || 0} equipamentos`);
                } catch (error) {
                  console.error('🧪 TESTE: Erro:', error);
                  alert(`Erro no teste: ${error.message}`);
                }
              },
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginRight: '8px'
              }
            },
              React.createElement('svg', {
                width: '16',
                height: '16',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              },
                React.createElement('path', { d: 'M9 12l2 2 4-4' }),
                React.createElement('path', { d: 'M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.9.37 4.13 1.02' })
              )
            ),

            // Botão de refresh
            React.createElement('button', {
              onClick: () => {
                console.log('Refresh manual solicitado pelo usuário');
                refreshEquipamentos();
              },
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginRight: '8px'
              }
            },
              React.createElement('svg', {
                width: '16',
                height: '16',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              },
                React.createElement('path', { d: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' }),
                React.createElement('path', { d: 'M21 3v5h-5' }),
                React.createElement('path', { d: 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' }),
                React.createElement('path', { d: 'M3 21v-5h5' })
              )
            ),

            React.createElement('button', {
              onClick: () => setShowOptionsMenu(!showOptionsMenu),
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                backgroundColor: 'rgba(125, 38, 217, 0.2)',
                border: '1px solid rgba(125, 38, 217, 0.3)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }
            },
              React.createElement('svg', {
                width: '16',
                height: '16',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              },
                React.createElement('line', { x1: '12', y1: '5', x2: '12', y2: '19' }),
                React.createElement('line', { x1: '5', y1: '12', x2: '19', y2: '12' })
              )
            ),
            
            // Menu de opções
            showOptionsMenu && React.createElement('div', { 
              style: {
                position: 'absolute',
                top: '40px',
                right: '0',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(125, 38, 217, 0.1)',
                minWidth: '160px',
                zIndex: 1000
              }
            },
              React.createElement('button', {
                onClick: () => {
                  console.log('Botão adicionar clicado');
                  setShowOptionsMenu(false);
                  setShowAddModal(true);
                  console.log('showAddModal definido como true');
                },
                style: {
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #7d26d9 0%, #9f3ffd 100%)',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderBottom: '1px solid rgba(125, 38, 217, 0.1)',
                  borderRadius: '6px 6px 0 0',
                  fontWeight: '500',
                  boxShadow: '0 2px 8px rgba(125, 38, 217, 0.2)'
                },
                onMouseEnter: (e) => {
                  e.target.style.background = 'linear-gradient(135deg, #6b1bb8 0%, #8b2ce8 100%)';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(125, 38, 217, 0.3)';
                },
                onMouseLeave: (e) => {
                  e.target.style.background = 'linear-gradient(135deg, #7d26d9 0%, #9f3ffd 100%)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(125, 38, 217, 0.2)';
                }
              },
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
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
                    React.createElement('line', { x1: '12', y1: '5', x2: '12', y2: '19' }),
                    React.createElement('line', { x1: '5', y1: '12', x2: '19', y2: '12' })
                  ),
                  'Adicionar Equipamento'
                )
              ),
              React.createElement('button', {
                onClick: () => {
                  setShowOptionsMenu(false);
                  // Aqui seria a lógica para importar equipamentos
                  console.log('Importar equipamentos');
                  // Aqui você pode implementar a lógica para abrir um seletor de arquivo
                  alert('Abrir seletor de arquivo para importar equipamentos');
                },
                style: {
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#404040',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderBottom: '1px solid rgba(125, 38, 217, 0.1)'
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
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
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
                    React.createElement('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
                    React.createElement('polyline', { points: '7,10 12,15 17,10' }),
                    React.createElement('line', { x1: '12', y1: '15', x2: '12', y2: '3' })
                  ),
                  'Importar Equipamentos'
                )
              ),
              React.createElement('button', {
                onClick: () => {
                  setShowOptionsMenu(false);
                  // Aqui seria a lógica para exportar equipamentos
                  console.log('Exportar equipamentos');
                  // Aqui você pode implementar a lógica para gerar e baixar um arquivo
                  alert('Gerar e baixar arquivo com lista de equipamentos');
                },
                style: {
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#404040',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderBottom: '1px solid rgba(125, 38, 217, 0.1)'
                },
                onMouseEnter: (e) => {
                  e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                  e.target.style.color = '#10b981';
                },
                onMouseLeave: (e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#404040';
                }
              },
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
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
                    React.createElement('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
                    React.createElement('polyline', { points: '17,8 12,3 7,8' }),
                    React.createElement('line', { x1: '12', y1: '3', x2: '12', y2: '15' })
                  ),
                  'Exportar Equipamentos'
                )
              ),
              React.createElement('button', {
                onClick: () => {
                  setShowOptionsMenu(false);
                  // Aqui seria a lógica para configurações
                  console.log('Configurações');
                  // Aqui você pode implementar a lógica para abrir configurações
                  alert('Abrir painel de configurações dos equipamentos');
                },
                style: {
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#404040',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderRadius: '0 0 6px 6px'
                },
                onMouseEnter: (e) => {
                  e.target.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                  e.target.style.color = '#f59e0b';
                },
                onMouseLeave: (e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#404040';
                }
              },
                React.createElement('div', { 
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
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
                    React.createElement('circle', { cx: '12', cy: '12', r: '3' }),
                    React.createElement('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' })
                  ),
                  'Configurações'
                )
              )
            )
          )
        ),
        
        // Indicador de carregamento
        loading && React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: '#737373',
            fontSize: '14px'
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
                width: '20px',
                height: '20px',
                border: '2px solid #e5e5e5',
                borderTop: '2px solid #7d26d9',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }
            }),
            'Carregando equipamentos...'
          )
        ),

        // Mensagem de erro
        error && React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: '#ef4444',
            fontSize: '14px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            margin: '20px 0'
          }
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }
          },
            React.createElement('svg', {
              width: '20',
              height: '20',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '2',
              strokeLinecap: 'round',
              strokeLinejoin: 'round'
            },
              React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
              React.createElement('line', { x1: '15', y1: '9', x2: '9', y2: '15' }),
              React.createElement('line', { x1: '9', y1: '9', x2: '15', y2: '15' })
            ),
            error
          )
        ),

        // Lista de equipamentos otimizada
        !loading && !error && React.createElement('div', { 
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '12px'
          }
        },
          (() => {
            console.log('🎨 RENDER: Renderizando lista de equipamentos...');
            console.log('🎨 RENDER: Equipamentos filtrados para renderizar:', filteredEquipamentos?.length || 0);
            console.log('🎨 RENDER: Dados dos equipamentos:', filteredEquipamentos);
            
            if (!filteredEquipamentos || filteredEquipamentos.length === 0) {
              console.log('🎨 RENDER: Nenhum equipamento para renderizar');
              return React.createElement('div', {
                style: {
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '40px',
                  color: '#737373',
                  fontSize: '14px'
                }
              }, 'Nenhum equipamento encontrado');
            }
            
            return filteredEquipamentos.map((equipamento, index) => {
              console.log(`🎨 RENDER: Renderizando equipamento ${index + 1}:`, equipamento.nome);
              return React.createElement(EquipamentoCard, {
                key: equipamento.id,
                equipamento: equipamento,
                onClick: handleEquipamentoClick,
                onEdit: handleEditEquipamento,
                onDelete: handleDeleteEquipamento
              });
            });
          })()
        )
      )
    ),
    
    // Modal de detalhes otimizado
    React.createElement(EquipamentoModal, {
      equipamento: selectedEquipamento,
      isVisible: modalVisible,
      onClose: closeModal,
      onEdit: handleEditEquipamento,
      onDelete: handleDeleteEquipamento
    }),
    
    // Modal de adição de equipamento
          React.createElement(ModalAdicionarEquipamento, {
            isVisible: showAddModal,
            onClose: () => {
              console.log('Fechando modal');
              setShowAddModal(false);
            },
            onSave: handleSaveEquipamento
          }),
          React.createElement(ModalEditarEquipamento, {
            isVisible: showEditModal,
            equipamento: equipamentoParaEditar,
            onClose: () => {
              console.log('Fechando modal de edição');
              setShowEditModal(false);
              setEquipamentoParaEditar(null);
            },
            onSave: handleSaveEditEquipamento
          }),
          
          // Sistema de notificações
          notifications.map(notification => 
            React.createElement(Notification, {
              key: notification.id,
              message: notification.message,
              type: notification.type,
              duration: notification.duration,
              onClose: () => removeNotification(notification.id)
            })
          )
  );
}

export default Equipamentos;
