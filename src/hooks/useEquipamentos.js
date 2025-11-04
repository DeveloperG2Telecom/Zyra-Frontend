import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { useCache } from '../contexts/CacheContext';

export const useEquipamentos = () => {
  const { addToCache, removeFromCache, updateCacheItem } = useCache();
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Controle de requisições para evitar loops
  const lastRequestTime = useRef(0);
  const requestTimeout = useRef(null);
  const isRequesting = useRef(false);
  const CACHE_DURATION = Infinity; // Cache permanente - só buscar na inicialização ou quando forçado
  const MIN_REQUEST_INTERVAL = 60000; // Mínimo 60 segundos entre requisições (só para segurança)

  const loadEquipamentos = useCallback(async (filters = {}, page = 1, limit = 'all', forceRefresh = false) => {
    const now = Date.now();
    
    // Verificar se já está fazendo uma requisição
    if (isRequesting.current) {
      console.log('⏳ USEEQUIPAMENTOS: Requisição já em andamento, ignorando...');
      return;
    }

    // Verificar se há dados em cache - só buscar se não houver dados ou se for forçado
    if (!forceRefresh && equipamentos.length > 0) {
      console.log('💾 USEEQUIPAMENTOS: Usando dados do cache (não há necessidade de buscar novamente)');
      return;
    }

    // Verificar intervalo mínimo entre requisições (apenas para segurança)
    if (!forceRefresh && (now - lastRequestTime.current) < MIN_REQUEST_INTERVAL) {
      console.log('⏳ USEEQUIPAMENTOS: Muito cedo para nova requisição, aguardando...');
      return;
    }

    console.log('🔄 USEEQUIPAMENTOS: ===== INICIANDO LOAD =====');
    console.log('🔄 USEEQUIPAMENTOS: Filters:', filters);
    console.log('🔄 USEEQUIPAMENTOS: Page:', page, 'Limit:', limit);
    console.log('🔄 USEEQUIPAMENTOS: ForceRefresh:', forceRefresh);
    
    try {
      isRequesting.current = true;
      setLoading(true);
      setError(null);
      
      console.log('🌐 USEEQUIPAMENTOS: Fazendo requisição para API...');
      console.log('🌐 USEEQUIPAMENTOS: URL será: /equipamentos?page=' + page + '&limit=' + limit);
      
      // Buscar dados reais do banco de dados
      const response = await api.getEquipamentos(filters, page, limit);
      
      console.log('📡 USEEQUIPAMENTOS: ===== RESPOSTA RECEBIDA =====');
      console.log('📡 USEEQUIPAMENTOS: Resposta completa:', JSON.stringify(response, null, 2));
      console.log('📡 USEEQUIPAMENTOS: Success:', response.success);
      console.log('📡 USEEQUIPAMENTOS: Data length:', response.data?.length || 0);
      console.log('📡 USEEQUIPAMENTOS: Pagination:', response.pagination);
      
      if (response.success) {
        console.log('✅ USEEQUIPAMENTOS: Dados carregados com sucesso!');
        console.log('✅ USEEQUIPAMENTOS: Equipamentos encontrados:', response.data?.length || 0);
        console.log('✅ USEEQUIPAMENTOS: Primeiros 3 itens:', response.data?.slice(0, 3) || 'Nenhum item');
        
        setEquipamentos(response.data || []);
        setPagination(response.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: response.data?.length || 0,
          itemsPerPage: limit,
          hasNextPage: false,
          hasPrevPage: false
        });
        
        lastRequestTime.current = now;
      } else {
        console.error('❌ USEEQUIPAMENTOS: Erro na resposta da API:', response.error);
        throw new Error(response.error || 'Erro ao carregar equipamentos');
      }
      
    } catch (err) {
      console.error('💥 Erro ao carregar equipamentos:', err);
      console.error('💥 Stack trace:', err.stack);
      
      // Se for erro de rate limit, não limpar os dados existentes
      if (err.message.includes('Rate limit') || err.message.includes('429')) {
        console.log('⏳ USEEQUIPAMENTOS: Rate limit atingido, mantendo dados existentes');
        setError('Rate limit atingido. Aguarde alguns minutos antes de tentar novamente.');
        return;
      }
      
      setEquipamentos([]);
      setPagination({
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPrevPage: false
      });
      setError(`Erro ao carregar equipamentos: ${err.message}`);
    } finally {
      setLoading(false);
      isRequesting.current = false;
    }
  }, [equipamentos.length, CACHE_DURATION, MIN_REQUEST_INTERVAL]);

  const createEquipamento = useCallback(async (equipamentoData) => {
    try {
      const response = await api.createEquipamento(equipamentoData);
      
      if (response.success) {
        // Adicionar ao cache em vez de recarregar tudo
        addToCache('equipamentos', response.data);
        setEquipamentos(prev => [...prev, response.data]);
        return response;
      }
      throw new Error(response.error?.message || 'Erro ao criar equipamento');
    } catch (err) {
      throw err;
    }
  }, [addToCache]);

  const updateEquipamento = useCallback(async (id, equipamentoData) => {
    try {
      const response = await api.updateEquipamento(id, equipamentoData);
      if (response.success) {
        // Atualizar cache em vez de recarregar tudo
        updateCacheItem('equipamentos', response.data);
        setEquipamentos(prev => prev.map(eq => eq.id === id ? response.data : eq));
        return response;
      }
      throw new Error(response.error?.message || 'Erro ao atualizar equipamento');
    } catch (err) {
      throw err;
    }
  }, [updateCacheItem]);

  const deleteEquipamento = useCallback(async (id) => {
    try {
      console.log('🗑️ USEEQUIPAMENTOS: Deletando equipamento:', id);
      const response = await api.deleteEquipamento(id);
      if (response.success) {
        console.log('✅ USEEQUIPAMENTOS: Equipamento deletado com sucesso, removendo da lista...');
        // Remover do estado local em vez de recarregar tudo
        setEquipamentos(prev => prev.filter(eq => eq.id !== id));
        removeFromCache('equipamentos', id);
        return response;
      }
      throw new Error(response.error?.message || 'Erro ao excluir equipamento');
    } catch (err) {
      console.error('❌ USEEQUIPAMENTOS: Erro ao deletar equipamento:', err);
      throw err;
    }
  }, [removeFromCache]);

  // Carregamento inicial apenas uma vez quando o componente monta
  useEffect(() => {
    // Só carregar se realmente não houver dados (primeira vez)
    if (equipamentos.length === 0 && !loading && !isRequesting.current) {
      console.log('🔄 USEEQUIPAMENTOS: Carregamento inicial - buscando dados do banco');
      loadEquipamentos();
    }
  }, []); // Dependências vazias - executar apenas uma vez na montagem

  // Função para forçar atualização
  const refreshEquipamentos = useCallback(async () => {
    await loadEquipamentos({}, pagination.currentPage, pagination.itemsPerPage, true);
  }, [loadEquipamentos, pagination.currentPage, pagination.itemsPerPage]);

  // Função para mudar página
  const changePage = useCallback(async (newPage) => {
    await loadEquipamentos({}, newPage, pagination.itemsPerPage);
  }, [loadEquipamentos, pagination.itemsPerPage]);

  return {
    equipamentos,
    loading,
    error,
    pagination,
    loadEquipamentos,
    refreshEquipamentos,
    changePage,
    createEquipamento,
    updateEquipamento,
    deleteEquipamento
  };
};
