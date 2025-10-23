import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CacheContext = createContext();

export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache deve ser usado dentro de um CacheProvider');
  }
  return context;
};

export const CacheProvider = ({ children }) => {
  // Estados do cache
  const [cache, setCache] = useState({
    equipamentos: { data: null, timestamp: null, loading: false },
    tiposAcesso: { data: null, timestamp: null, loading: false },
    pops: { data: null, timestamp: null, loading: false },
    funcoes: { data: null, timestamp: null, loading: false },
    redesRurais: { data: null, timestamp: null, loading: false },
    cidades: { data: null, timestamp: null, loading: false }
  });

  // Tempo de expiração do cache (5 minutos)
  const CACHE_EXPIRY = 5 * 60 * 1000;

  // Verificar se o cache está válido
  const isCacheValid = (key) => {
    const item = cache[key];
    if (!item || !item.data || !item.timestamp) return false;
    
    const now = Date.now();
    const age = now - item.timestamp;
    return age < CACHE_EXPIRY;
  };

  // Carregar dados com cache inteligente
  const loadData = async (key, fetchFunction, forceRefresh = false) => {
    console.log(`🔍 CACHE: Verificando ${key}...`);
    console.log(`🔍 CACHE: API instance:`, api);
    console.log(`🔍 CACHE: API baseURL:`, api?.baseURL);
    
    // Verificar se api está definido
    if (!api) {
      console.error(`❌ CACHE: API não está definido`);
      throw new Error('API não está disponível');
    }
    
    if (!api.baseURL) {
      console.error(`❌ CACHE: API baseURL não está definido`);
      throw new Error('API baseURL não está disponível');
    }
    
    // Se já está carregando, aguardar
    if (cache[key].loading) {
      console.log(`⏳ CACHE: ${key} já está carregando, aguardando...`);
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!cache[key].loading) {
            resolve(cache[key].data);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    // Se cache é válido e não é refresh forçado, usar cache
    if (!forceRefresh && isCacheValid(key)) {
      console.log(`✅ CACHE: Usando cache válido para ${key}`);
      const cachedData = cache[key].data;
      return Array.isArray(cachedData) ? cachedData : [];
    }

    // Carregar dados
    console.log(`🔄 CACHE: Carregando ${key} do servidor...`);
    setCache(prev => ({
      ...prev,
      [key]: { ...prev[key], loading: true }
    }));

    try {
      const data = await fetchFunction();
      const timestamp = Date.now();
      
      console.log(`🔍 CACHE: Dados recebidos do servidor para ${key}:`, data);
      console.log(`🔍 CACHE: Tipo dos dados:`, typeof data);
      console.log(`🔍 CACHE: É array?`, Array.isArray(data));
      
      setCache(prev => ({
        ...prev,
        [key]: { data, timestamp, loading: false }
      }));

      console.log(`✅ CACHE: ${key} carregado e armazenado`);
      // Garantir que sempre retorna um array
      const result = Array.isArray(data) ? data : [];
      console.log(`✅ CACHE: Retornando para ${key}:`, result);
      return result;
    } catch (error) {
      console.error(`❌ CACHE: Erro ao carregar ${key}:`, error);
      setCache(prev => ({
        ...prev,
        [key]: { ...prev[key], loading: false }
      }));
      throw error;
    }
  };

  // Funções específicas para cada tipo de dados
  const loadEquipamentos = (forceRefresh = false) => 
    loadData('equipamentos', async () => {
      console.log('🔍 CACHE: Chamando api.getEquipamentos()...');
      const response = await api.getEquipamentos();
      console.log('🔍 CACHE: Resposta da API:', response);
      
      // Extrair apenas os dados do array
      if (response && response.success && Array.isArray(response.data)) {
        console.log('🔍 CACHE: Extraindo dados do array:', response.data);
        return response.data;
      }
      
      console.log('🔍 CACHE: Resposta inválida, retornando array vazio');
      return [];
    }, forceRefresh);

  const loadTiposAcesso = (forceRefresh = false) => 
    loadData('tiposAcesso', async () => {
      console.log('🔍 CACHE: Chamando api.getConfiguracao(tipos-acesso)...');
      const response = await api.getConfiguracao('tipos-acesso');
      console.log('🔍 CACHE: Resposta da API tipos-acesso:', response);
      
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    }, forceRefresh);

  const loadPops = (forceRefresh = false) => 
    loadData('pops', async () => {
      console.log('🔍 CACHE: Chamando api.getConfiguracao(pops)...');
      const response = await api.getConfiguracao('pops');
      console.log('🔍 CACHE: Resposta da API pops:', response);
      
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    }, forceRefresh);

  const loadFuncoes = (forceRefresh = false) => 
    loadData('funcoes', async () => {
      console.log('🔍 CACHE: Chamando api.getConfiguracao(funcoes)...');
      const response = await api.getConfiguracao('funcoes');
      console.log('🔍 CACHE: Resposta da API funcoes:', response);
      
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    }, forceRefresh);

  const loadRedesRurais = (forceRefresh = false) => 
    loadData('redesRurais', async () => {
      console.log('🔍 CACHE: Chamando api.getRedesRurais()...');
      return await api.getRedesRurais();
    }, forceRefresh);

  const loadCidades = (forceRefresh = false) => 
    loadData('cidades', async () => {
      console.log('🔍 CACHE: Chamando api.getCidades()...');
      return await api.getCidades();
    }, forceRefresh);

  // Invalidar cache específico
  const invalidateCache = (key) => {
    console.log(`🗑️ CACHE: Invalidando ${key}`);
    setCache(prev => ({
      ...prev,
      [key]: { data: null, timestamp: null, loading: false }
    }));
  };

  // Invalidar todos os caches
  const invalidateAllCache = () => {
    console.log(`🗑️ CACHE: Invalidando todos os caches`);
    setCache({
      equipamentos: { data: null, timestamp: null, loading: false },
      tiposAcesso: { data: null, timestamp: null, loading: false },
      pops: { data: null, timestamp: null, loading: false },
      funcoes: { data: null, timestamp: null, loading: false },
      redesRurais: { data: null, timestamp: null, loading: false },
      cidades: { data: null, timestamp: null, loading: false }
    });
  };

  // Atualizar dados específicos no cache
  const updateCacheData = (key, newData) => {
    console.log(`🔄 CACHE: Atualizando dados de ${key}`);
    setCache(prev => ({
      ...prev,
      [key]: { data: newData, timestamp: Date.now(), loading: false }
    }));
  };

  // Adicionar item ao cache
  const addToCache = (key, newItem) => {
    console.log(`➕ CACHE: Adicionando item a ${key}`);
    setCache(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        data: [...(prev[key].data || []), newItem],
        timestamp: Date.now()
      }
    }));
  };

  // Remover item do cache
  const removeFromCache = (key, itemId) => {
    console.log(`➖ CACHE: Removendo item ${itemId} de ${key}`);
    setCache(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        data: (prev[key].data || []).filter(item => item.id !== itemId),
        timestamp: Date.now()
      }
    }));
  };

  // Atualizar item no cache
  const updateCacheItem = (key, updatedItem) => {
    console.log(`🔄 CACHE: Atualizando item em ${key}`);
    setCache(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        data: (prev[key].data || []).map(item => 
          item.id === updatedItem.id ? updatedItem : item
        ),
        timestamp: Date.now()
      }
    }));
  };

  const value = {
    cache,
    loadEquipamentos,
    loadTiposAcesso,
    loadPops,
    loadFuncoes,
    loadRedesRurais,
    loadCidades,
    invalidateCache,
    invalidateAllCache,
    updateCacheData,
    addToCache,
    removeFromCache,
    updateCacheItem,
    isCacheValid
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
};

export default CacheContext;
