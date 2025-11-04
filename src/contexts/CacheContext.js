import React, { createContext, useContext, useState } from 'react';
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

  // Cache não expira automaticamente - só será invalidado manualmente após alterações
  // Isso evita leituras desnecessárias ao banco de dados
  const CACHE_EXPIRY = Infinity; // Cache permanente até invalidação manual

  // Verificar se o cache está válido
  const isCacheValid = (key) => {
    const item = cache[key];
    if (!item || !item.data || !item.timestamp) return false;
    
    // Cache sempre válido até ser invalidado manualmente
    return true;
  };

  // Carregar dados com cache inteligente
  const loadData = async (key, fetchFunction, forceRefresh = false) => {
    // Verificar se api está definido
    if (!api || !api.baseURL) {
      throw new Error('API não está disponível');
    }
    
    // Verificar se a chave existe no cache
    if (!cache[key]) {
      console.warn(`Chave '${key}' não encontrada no cache. Inicializando...`);
      setCache(prev => ({
        ...prev,
        [key]: { data: null, timestamp: null, loading: false }
      }));
    }
    
    // Se já está carregando, aguardar
    if (cache[key] && cache[key].loading) {
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!cache[key] || !cache[key].loading) {
            resolve(cache[key]?.data || []);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    // Se cache é válido e não é refresh forçado, usar cache
    if (!forceRefresh && isCacheValid(key)) {
      const cachedData = cache[key]?.data;
      return Array.isArray(cachedData) ? cachedData : [];
    }

    // Carregar dados
    setCache(prev => ({
      ...prev,
      [key]: { ...(prev[key] || { data: null, timestamp: null, loading: false }), loading: true }
    }));

    try {
      const data = await fetchFunction();
      const timestamp = Date.now();
      
      setCache(prev => ({
        ...prev,
        [key]: { data, timestamp, loading: false }
      }));

      // Garantir que sempre retorna um array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      setCache(prev => ({
        ...prev,
        [key]: { ...(prev[key] || { data: null, timestamp: null, loading: false }), loading: false }
      }));
      throw error;
    }
  };

  // Funções específicas para cada tipo de dados
  const loadEquipamentos = (forceRefresh = false) => 
    loadData('equipamentos', async () => {
      const response = await api.getEquipamentos();
      
      // Extrair apenas os dados do array
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    }, forceRefresh);

  const loadTiposAcesso = (forceRefresh = false) => 
    loadData('tiposAcesso', async () => {
      const response = await api.getConfiguracao('tipos-acesso');
      
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    }, forceRefresh);

  const loadPops = (forceRefresh = false) => 
    loadData('pops', async () => {
      const response = await api.getConfiguracao('pops');
      
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    }, forceRefresh);

  const loadFuncoes = (forceRefresh = false) => 
    loadData('funcoes', async () => {
      const response = await api.getConfiguracao('funcoes');
      
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    }, forceRefresh);

  const loadRedesRurais = (forceRefresh = false) => 
    loadData('redesRurais', async () => {
      return await api.getRedesRurais();
    }, forceRefresh);

  const loadCidades = (forceRefresh = false) => 
    loadData('cidades', async () => {
      return await api.getCidades();
    }, forceRefresh);

  // Invalidar cache específico
  const invalidateCache = (key) => {
    setCache(prev => ({
      ...prev,
      [key]: { data: null, timestamp: null, loading: false }
    }));
  };

  // Invalidar todos os caches
  const invalidateAllCache = () => {
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
    setCache(prev => ({
      ...prev,
      [key]: { data: newData, timestamp: Date.now(), loading: false }
    }));
  };

  // Adicionar item ao cache
  const addToCache = (key, newItem) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { data: null, timestamp: null, loading: false }),
        data: [...(prev[key]?.data || []), newItem],
        timestamp: Date.now()
      }
    }));
  };

  // Remover item do cache
  const removeFromCache = (key, itemId) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { data: null, timestamp: null, loading: false }),
        data: (prev[key]?.data || []).filter(item => item.id !== itemId),
        timestamp: Date.now()
      }
    }));
  };

  // Atualizar item no cache
  const updateCacheItem = (key, updatedItem) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { data: null, timestamp: null, loading: false }),
        data: (prev[key]?.data || []).map(item => 
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
