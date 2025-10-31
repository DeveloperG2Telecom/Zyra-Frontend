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
import { FiSearch, FiFilter, FiX, FiRefreshCw, FiPlus } from 'react-icons/fi';

const Equipamentos = React.memo(() => {
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
  
  // Filtros
  const [filtros, setFiltros] = useState({
    pop: '',
    tipo: '',
    funcao: '',
    status: ''
  });
  const [showFiltros, setShowFiltros] = useState(false);

  // Usar hook personalizado para equipamentos
  const { equipamentos, loading, error, loadEquipamentos, refreshEquipamentos, createEquipamento, updateEquipamento, deleteEquipamento } = useEquipamentos();
  
  // Hook para notificações
  const { notifications, showSuccess, showError, removeNotification } = useNotification();
  
  // Carregar equipamentos quando o componente monta (sem paginação)
  useEffect(() => {
    console.log('🔄 Equipamentos: Componente montado, carregando equipamentos...');
    loadEquipamentos({}, 1, 1000); // Buscar todos os equipamentos
  }, [loadEquipamentos]);
  
  // Debounce da pesquisa para melhor performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filtro otimizado com debounce
  const filteredEquipamentos = React.useMemo(() => {
    console.log('🔍 Equipamentos: Calculando filtros com', equipamentos.length, 'equipamentos');
    
    let filtered = equipamentos;
    
    // Filtro por pesquisa
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(equipamento =>
        equipamento.nome?.toLowerCase().includes(searchLower) ||
        equipamento.modelo?.toLowerCase().includes(searchLower) ||
        equipamento.serialMac?.toLowerCase().includes(searchLower) ||
        equipamento.ipPrivado?.toLowerCase().includes(searchLower) ||
        equipamento.ipPublico?.toLowerCase().includes(searchLower) ||
        (typeof equipamento.pop === 'string' ? equipamento.pop : equipamento.pop?.nome)?.toLowerCase().includes(searchLower) ||
        equipamento.localidade?.endereco?.toLowerCase().includes(searchLower) ||
        equipamento.fabricante?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtro por POP
    if (filtros.pop) {
      filtered = filtered.filter(equipamento => {
        const popValue = typeof equipamento.pop === 'string' ? equipamento.pop : equipamento.pop?.nome;
        return popValue?.toLowerCase().includes(filtros.pop.toLowerCase());
      });
    }
    
    // Filtro por tipo
    if (filtros.tipo) {
      filtered = filtered.filter(equipamento => 
        equipamento.tipo?.toLowerCase().includes(filtros.tipo.toLowerCase())
      );
    }
    
    // Filtro por função
    if (filtros.funcao) {
      filtered = filtered.filter(equipamento => 
        equipamento.funcoes?.some(funcao => 
          funcao.toLowerCase().includes(filtros.funcao.toLowerCase())
        )
      );
    }
    
    if (filtros.status) {
      filtered = filtered.filter(equipamento => 
        equipamento.status?.toLowerCase().includes(filtros.status.toLowerCase())
      );
    }
    
    // Ordenar alfabeticamente por nome
    filtered.sort((a, b) => {
      const nomeA = (a.nome || '').toLowerCase();
      const nomeB = (b.nome || '').toLowerCase();
      return nomeA.localeCompare(nomeB, 'pt-BR');
    });
    
    return filtered;
  }, [equipamentos, debouncedSearchTerm, filtros]);

  // Obter valores únicos para os filtros
  const valoresUnicos = React.useMemo(() => {
    const pops = [...new Set(equipamentos.map(e => typeof e.pop === 'string' ? e.pop : e.pop?.nome).filter(Boolean))];
    const tipos = [...new Set(equipamentos.map(e => e.tipo).filter(Boolean))];
    const funcoes = [...new Set(equipamentos.flatMap(e => e.funcoes || []))];
    const status = [...new Set(equipamentos.map(e => e.status).filter(Boolean))];
    
    return { pops, tipos, funcoes, status };
  }, [equipamentos]);

  // Função para limpar filtros
  const limparFiltros = () => {
    setFiltros({ pop: '', tipo: '', funcao: '', status: '' });
    setSearchTerm('');
  };

  // Função para abrir modal de adicionar (limpar dados)
  const handleAbrirModalAdicionar = () => {
    setEquipamentoParaEditar(null); // Garantir que não há dados do último equipamento
    setShowAddModal(true);
  };

  // Função para abrir modal de editar
  const handleAbrirModalEditar = (equipamento) => {
    setEquipamentoParaEditar(equipamento);
    setShowEditModal(true);
  };

  // Função para fechar modais
  const handleFecharModais = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEquipamentoParaEditar(null);
  };

  // Função para salvar equipamento
  const handleSaveEquipamento = async (equipamentoData) => {
    try {
      console.log('💾 Salvando equipamento:', equipamentoData);
      console.log('💾 Tipo dos dados:', typeof equipamentoData);
      console.log('💾 Campos presentes:', Object.keys(equipamentoData));
      console.log('💾 Dados serializados:', JSON.stringify(equipamentoData, null, 2));
      
      const response = await createEquipamento(equipamentoData);
      
      if (response.success) {
        showSuccess('Equipamento adicionado com sucesso!');
        handleFecharModais();
        await refreshEquipamentos(); // Recarregar lista
      } else {
        throw new Error(response.error || 'Erro ao adicionar equipamento');
      }
    } catch (err) {
      console.error('Erro ao salvar equipamento:', err);
      showError(`Erro ao salvar equipamento: ${err.message}`);
    }
  };

  // Função para atualizar equipamento
  const handleUpdateEquipamento = async (id, equipamentoData) => {
    try {
      console.log('🔄 Atualizando equipamento:', id, equipamentoData);
      
      const response = await updateEquipamento(id, equipamentoData);
      
      if (response.success) {
        showSuccess('Equipamento atualizado com sucesso!');
        handleFecharModais();
        await refreshEquipamentos(); // Recarregar lista
      } else {
        throw new Error(response.error || 'Erro ao atualizar equipamento');
      }
    } catch (err) {
      console.error('Erro ao atualizar equipamento:', err);
      showError(`Erro ao atualizar equipamento: ${err.message}`);
    }
  };

  // Função para deletar equipamento
  const handleDeleteEquipamento = async (id) => {
    try {
      console.log('🗑️ Deletando equipamento:', id);
      
      const response = await deleteEquipamento(id);
      
      if (response.success) {
        showSuccess('Equipamento deletado com sucesso!');
        // Não precisa chamar refreshEquipamentos() aqui pois deleteEquipamento já faz o reload
      } else {
        throw new Error(response.error || 'Erro ao deletar equipamento');
      }
    } catch (err) {
      console.error('Erro ao deletar equipamento:', err);
      showError(`Erro ao deletar equipamento: ${err.message}`);
    }
  };

  // Função para abrir sidebar
  const handleOpenSidebar = () => {
    setSidebarVisible(true);
    setSidebarAnimating(true);
    setSidebarAnimatingOut(false);
  };

  // Função para fechar sidebar
  const handleCloseSidebar = () => {
    setSidebarAnimatingOut(true);
    setTimeout(() => {
      setSidebarVisible(false);
      setSidebarAnimating(false);
      setSidebarAnimatingOut(false);
    }, 300);
  };

  // Função para abrir modal de detalhes
  const handleEquipamentoClick = (equipamento) => {
    setSelectedEquipamento(equipamento);
    setModalVisible(true);
  };

  // Função para fechar modal de detalhes
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEquipamento(null);
  };

  // Loading spinner
  if (loading) {
    return (
      <Layout currentPage="/equipamentos">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando equipamentos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout currentPage="/equipamentos">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-gray-600 mb-4">Erro ao carregar equipamentos</p>
            <button 
              onClick={() => loadEquipamentos({}, 1, 1000)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="/equipamentos">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Equipamentos</h1>
            <p className="text-white/70">
              {filteredEquipamentos.length} de {equipamentos.length} equipamentos
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => loadEquipamentos({}, 1, 1000)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Atualizar</span>
            </button>
            <button
              onClick={handleAbrirModalAdicionar}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
            >
              <FiPlus className="w-4 h-4" />
              <span>Adicionar Equipamento</span>
            </button>
          </div>
        </div>

        {/* Barra de pesquisa e filtros */}
        <div className="bg-white/95 backdrop-blur-custom rounded-xl p-4 mb-6 border border-purple-100 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Campo de pesquisa */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Pesquisar equipamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Botão de filtros */}
            <button
              onClick={() => setShowFiltros(!showFiltros)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span>Filtros</span>
              {(filtros.pop || filtros.tipo || filtros.funcao || filtros.status) && (
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  {[filtros.pop, filtros.tipo, filtros.funcao, filtros.status].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Limpar filtros */}
            {(filtros.pop || filtros.tipo || filtros.funcao || filtros.status || searchTerm) && (
              <button
                onClick={limparFiltros}
                className="flex items-center space-x-2 px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-700 text-sm transition-colors"
              >
                <FiX className="w-4 h-4" />
                <span>Limpar</span>
              </button>
            )}
          </div>

          {/* Filtros expandidos com animação */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showFiltros ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Filtro por POP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">POP</label>
                <select
                  value={filtros.pop}
                  onChange={(e) => setFiltros(prev => ({ ...prev, pop: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">Todos os POPs</option>
                  {valoresUnicos.pops.map(pop => (
                    <option key={pop} value={pop}>{pop}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={filtros.tipo}
                  onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">Todos os tipos</option>
                  {valoresUnicos.tipos.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por Função */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                <select
                  value={filtros.funcao}
                  onChange={(e) => setFiltros(prev => ({ ...prev, funcao: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">Todas as funções</option>
                  {valoresUnicos.funcoes.map(funcao => (
                    <option key={funcao} value={funcao}>{funcao}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filtros.status}
                  onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">Todos os status</option>
                  {valoresUnicos.status.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de equipamentos */}
        {filteredEquipamentos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm || filtros.pop || filtros.tipo || filtros.funcao || filtros.status
                ? 'Nenhum equipamento encontrado' 
                : 'Nenhum equipamento cadastrado'
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filtros.pop || filtros.tipo || filtros.funcao || filtros.status
                ? 'Tente ajustar os filtros ou termo de pesquisa'
                : 'Adicione o primeiro equipamento para começar'
              }
            </p>
            {!searchTerm && !filtros.pop && !filtros.tipo && !filtros.funcao && !filtros.status && (
              <button
                onClick={handleAbrirModalAdicionar}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Adicionar Equipamento
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEquipamentos.map((equipamento) => (
              <EquipamentoCard
                key={equipamento.id}
                equipamento={equipamento}
                onClick={handleEquipamentoClick}
                onEdit={handleAbrirModalEditar}
                onDelete={handleDeleteEquipamento}
              />
            ))}
          </div>
        )}

        {/* Modais */}
        {modalVisible && selectedEquipamento && (
          <EquipamentoModal
            equipamento={selectedEquipamento}
            onClose={handleCloseModal}
          />
        )}

        {showAddModal && (
          <ModalAdicionarEquipamento
            isVisible={showAddModal}
            onClose={handleFecharModais}
            onSave={handleSaveEquipamento}
          />
        )}

        {showEditModal && equipamentoParaEditar && (
          <ModalEditarEquipamento
            isVisible={showEditModal}
            equipamento={equipamentoParaEditar}
            onClose={handleFecharModais}
            onSave={handleUpdateEquipamento}
          />
        )}

        {/* Notificações */}
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </Layout>
  );
});

export default Equipamentos;