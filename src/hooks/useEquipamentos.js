import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';
import { useCache } from '../contexts/CacheContext';

export const useEquipamentos = () => {
  const { loadEquipamentos: loadFromCache, updateCacheData, addToCache, removeFromCache, updateCacheItem } = useCache();
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEquipamentos = useCallback(async (filters = {}, forceRefresh = false) => {
    try {
      console.log('🔄 HOOK: Carregando equipamentos...', filters);
      setLoading(true);
      setError(null);
      
      // Usar cache inteligente
      const data = await loadFromCache(forceRefresh);
      console.log('✅ HOOK: Equipamentos carregados do cache:', data);
      console.log('✅ HOOK: Tipo dos dados:', typeof data);
      console.log('✅ HOOK: É array?', Array.isArray(data));
      
      setEquipamentos(data || []);
      console.log('✅ HOOK: Estado equipamentos atualizado');
    } catch (err) {
      console.error('❌ HOOK: Erro ao carregar equipamentos:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  }, [loadFromCache]);

  const createEquipamento = useCallback(async (equipamentoData) => {
    try {
      console.log('Criando equipamento...', equipamentoData);
      const response = await api.createEquipamento(equipamentoData);
      console.log('Resposta da API:', response);
      
      if (response.success) {
        console.log('Equipamento criado com sucesso, atualizando cache...');
        // Adicionar ao cache em vez de recarregar tudo
        addToCache('equipamentos', response.data);
        setEquipamentos(prev => [...prev, response.data]);
        console.log('Cache atualizado');
        return response;
      }
      throw new Error(response.error?.message || 'Erro ao criar equipamento');
    } catch (err) {
      console.error('Erro ao criar equipamento:', err);
      throw err;
    }
  }, [addToCache]);

  const updateEquipamento = useCallback(async (id, equipamentoData) => {
    try {
      const response = await api.updateEquipamento(id, equipamentoData);
      if (response.success) {
        console.log('Equipamento atualizado, atualizando cache...');
        // Atualizar cache em vez de recarregar tudo
        updateCacheItem('equipamentos', response.data);
        setEquipamentos(prev => prev.map(eq => eq.id === id ? response.data : eq));
        console.log('Cache atualizado');
        return response;
      }
      throw new Error(response.error?.message || 'Erro ao atualizar equipamento');
    } catch (err) {
      console.error('Erro ao atualizar equipamento:', err);
      throw err;
    }
  }, [updateCacheItem]);

  const deleteEquipamento = useCallback(async (id) => {
    try {
      const response = await api.deleteEquipamento(id);
      if (response.success) {
        console.log('Equipamento deletado, atualizando cache...');
        // Remover do cache em vez de recarregar tudo
        removeFromCache('equipamentos', id);
        setEquipamentos(prev => prev.filter(eq => eq.id !== id));
        console.log('Cache atualizado');
        return response;
      }
      throw new Error(response.error?.message || 'Erro ao excluir equipamento');
    } catch (err) {
      console.error('Erro ao excluir equipamento:', err);
      throw err;
    }
  }, [removeFromCache]);

  // Carregamento inicial e recarregamento automático
  useEffect(() => {
    console.log('Hook useEquipamentos: Carregando equipamentos iniciais...');
    loadEquipamentos();
  }, [loadEquipamentos]);

  // Função para forçar atualização
  const refreshEquipamentos = useCallback(async () => {
    console.log('Forçando atualização dos equipamentos...');
    await loadEquipamentos({}, true); // Forçar refresh
  }, [loadEquipamentos]);

  return {
    equipamentos,
    loading,
    error,
    loadEquipamentos,
    refreshEquipamentos,
    createEquipamento,
    updateEquipamento,
    deleteEquipamento
  };
};
