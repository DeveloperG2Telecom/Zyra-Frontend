import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

export const useEquipamentos = () => {
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEquipamentos = useCallback(async (filters = {}) => {
    try {
      console.log('🔄 HOOK: Carregando equipamentos...', filters);
      setLoading(true);
      setError(null);
      const response = await api.getEquipamentos(filters);
      console.log('🔄 HOOK: Resposta da API getEquipamentos:', response);
      
      if (response.success) {
        console.log('✅ HOOK: Equipamentos carregados com sucesso:', response.data);
        console.log('✅ HOOK: Quantidade de equipamentos:', response.data?.length || 0);
        setEquipamentos(response.data || []);
        console.log('✅ HOOK: Estado equipamentos atualizado');
      } else {
        console.error('❌ HOOK: Erro na resposta da API:', response);
        setError('Erro ao carregar equipamentos');
      }
    } catch (err) {
      console.error('❌ HOOK: Erro ao carregar equipamentos:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEquipamento = useCallback(async (equipamentoData) => {
    try {
      console.log('Criando equipamento...', equipamentoData);
      const response = await api.createEquipamento(equipamentoData);
      console.log('Resposta da API:', response);
      
      if (response.success) {
        console.log('Equipamento criado com sucesso, recarregando lista...');
        await loadEquipamentos(); // Recarregar lista
        console.log('Lista recarregada');
        return response;
      }
      throw new Error(response.error?.message || 'Erro ao criar equipamento');
    } catch (err) {
      console.error('Erro ao criar equipamento:', err);
      throw err;
    }
  }, [loadEquipamentos]);

  const updateEquipamento = useCallback(async (id, equipamentoData) => {
    try {
      const response = await api.updateEquipamento(id, equipamentoData);
      if (response.success) {
        await loadEquipamentos(); // Recarregar lista
        return response;
      }
      throw new Error(response.error?.message || 'Erro ao atualizar equipamento');
    } catch (err) {
      console.error('Erro ao atualizar equipamento:', err);
      throw err;
    }
  }, [loadEquipamentos]);

  const deleteEquipamento = useCallback(async (id) => {
    try {
      const response = await api.deleteEquipamento(id);
      if (response.success) {
        await loadEquipamentos(); // Recarregar lista
        return response;
      }
      throw new Error(response.error?.message || 'Erro ao excluir equipamento');
    } catch (err) {
      console.error('Erro ao excluir equipamento:', err);
      throw err;
    }
  }, [loadEquipamentos]);

  // Carregamento inicial e recarregamento automático
  useEffect(() => {
    console.log('Hook useEquipamentos: Carregando equipamentos iniciais...');
    loadEquipamentos();
  }, [loadEquipamentos]);

  // Função para forçar atualização
  const refreshEquipamentos = useCallback(async () => {
    console.log('Forçando atualização dos equipamentos...');
    await loadEquipamentos();
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
