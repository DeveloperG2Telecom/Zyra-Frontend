const API_BASE_URL = 'http://localhost:3002/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 segundo
  }

  // Cache helper
  getCacheKey(endpoint, options = {}) {
    return `${endpoint}:${JSON.stringify(options)}`;
  }

  getFromCache(key) {
    // Desabilitar cache para equipamentos temporariamente
    if (key.includes('equipamentos')) {
      console.log('🚫 Cache desabilitado para equipamentos:', key);
      return null;
    }
    
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('✅ Cache hit:', key);
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Requisição simples sem retry
  async retryRequest(url, config, attempt = 1) {
    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit atingido. Aguarde alguns minutos antes de tentar novamente.');
        }
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Método genérico para fazer requisições (otimizado)
  async request(endpoint, options = {}) {
    let url = `${this.baseURL}${endpoint}`;
    // Anexar query params se fornecidos
    if (options.params && typeof options.params === 'object') {
      const queryParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      const qs = queryParams.toString();
      if (qs) {
        url += (url.includes('?') ? '&' : '?') + qs;
      }
      // Não enviar params no corpo/opções da requisição
      delete options.params;
    }
    
    // Verificar cache para GET requests
    if (!options.method || options.method === 'GET') {
      const cacheKey = this.getCacheKey(endpoint, options);
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const data = await this.retryRequest(url, config);
      
      // Salvar no cache para GET requests (exceto equipamentos temporariamente)
      if ((!options.method || options.method === 'GET') && !endpoint.includes('/equipamentos')) {
        const cacheKey = this.getCacheKey(endpoint, options);
        this.setCache(cacheKey, data);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Método para requisições sem autenticação (para topologia)
  async requestWithoutAuth(endpoint, options = {}) {
    let url = `${this.baseURL}${endpoint}`;
    // Anexar query params se fornecidos
    if (options.params && typeof options.params === 'object') {
      const queryParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      const qs = queryParams.toString();
      if (qs) {
        url += (url.includes('?') ? '&' : '?') + qs;
      }
      delete options.params;
    }
    
    // Verificar cache para GET requests
    if (!options.method || options.method === 'GET') {
      const cacheKey = this.getCacheKey(endpoint, options);
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const data = await this.retryRequest(url, config);
      
      // Salvar no cache para GET requests
      if (!options.method || options.method === 'GET') {
        const cacheKey = this.getCacheKey(endpoint, options);
        this.setCache(cacheKey, data);
      }

      return data;
    } catch (error) {
      console.error('API Error (sem auth):', error);
      throw error;
    }
  }

  // Limpar cache
  clearCache() {
    this.cache.clear();
  }

  // Limpar cache por padrão
  clearCacheByPattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // Métodos de autenticação
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Métodos para equipamentos (por padrão sem limite)
  async getEquipamentos(filters = {}, page = 1, limit = 'all') {
    return this.request('/equipamentos', {
      method: 'GET',
      params: { ...filters, page, limit }
    });
  }

  async getEquipamentoById(id) {
    return this.request(`/equipamentos/${id}`);
  }

  async createEquipamento(equipamentoData) {
    console.log('🔍 API: Dados sendo enviados para criar equipamento:', equipamentoData);
    console.log('🔍 API: JSON stringify:', JSON.stringify(equipamentoData));
    console.log('🔍 API: Tipo dos dados:', typeof equipamentoData);
    console.log('🔍 API: Campos presentes:', Object.keys(equipamentoData));
    
    const result = await this.request('/equipamentos', {
      method: 'POST',
      body: JSON.stringify(equipamentoData),
    });
    
    // Limpar cache de equipamentos imediatamente
    this.clearCacheByPattern('equipamentos');
    console.log('Cache de equipamentos limpo após criação');
    return result;
  }

  async updateEquipamento(id, equipamentoData) {
    console.log('🔍 API: Atualizando equipamento:', id, equipamentoData);
    console.log('🔍 API: Tipo do ID:', typeof id);
    console.log('🔍 API: ID é válido?', id && id !== 'undefined' && id !== 'null');
    
    try {
      const url = `${this.baseURL}/equipamentos/${id}`;
      
      console.log('🔍 API: URL:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(equipamentoData),
      });
      
      console.log('🔍 API: Status da resposta:', response.status);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit atingido. Aguarde alguns minutos.');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('🔍 API: Equipamento atualizado:', data);
      
      return data;
    } catch (error) {
      console.error('🔍 API: Erro ao atualizar equipamento:', error);
      throw error;
    }
  }

  async deleteEquipamento(id) {
    console.log('🔍 API: Deletando equipamento:', id);
    
    try {
      const url = `${this.baseURL}/equipamentos/${id}`;
      
      console.log('🔍 API: URL:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('🔍 API: Status da resposta:', response.status);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit atingido. Aguarde alguns minutos.');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('🔍 API: Equipamento deletado:', data);
      
      return data;
    } catch (error) {
      console.error('🔍 API: Erro ao deletar equipamento:', error);
      throw error;
    }
  }

  async getEquipamentosByPop(popId) {
    return this.request(`/equipamentos/pop/${popId}`);
  }

  async getEquipamentosByRedeRural(redeRuralId) {
    return this.request(`/equipamentos/rede-rural/${redeRuralId}`);
  }

  // Métodos para POPs
  async getPops(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/pops?${queryString}` : '/pops';
    
    return this.request(endpoint);
  }

  async getPopById(id) {
    return this.request(`/pops/${id}`);
  }

  async createPop(popData) {
    return this.request('/pops', {
      method: 'POST',
      body: JSON.stringify(popData),
    });
  }

  async updatePop(id, popData) {
    return this.request(`/pops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(popData),
    });
  }

  async deletePop(id) {
    return this.request(`/pops/${id}`, {
      method: 'DELETE',
    });
  }

  async getPopsByTipo(tipo) {
    return this.request(`/pops/tipo/${tipo}`);
  }

  async getPopsAtivos() {
    return this.request('/pops/ativos');
  }

  // Métodos para Redes Rurais
  async getRedesRurais(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/redes-rurais?${queryString}` : '/redes-rurais';
    
    return this.request(endpoint);
  }

  async getRedeRuralById(id) {
    return this.request(`/redes-rurais/${id}`);
  }

  async createRedeRural(redeRuralData) {
    return this.request('/redes-rurais', {
      method: 'POST',
      body: JSON.stringify(redeRuralData),
    });
  }

  async updateRedeRural(id, redeRuralData) {
    return this.request(`/redes-rurais/${id}`, {
      method: 'PUT',
      body: JSON.stringify(redeRuralData),
    });
  }

  async deleteRedeRural(id) {
    return this.request(`/redes-rurais/${id}`, {
      method: 'DELETE',
    });
  }

  async getRedesRuraisByTipo(tipo) {
    return this.request(`/redes-rurais/tipo/${tipo}`);
  }

  async getRedesRuraisAtivas() {
    return this.request('/redes-rurais/ativas');
  }

  async getRedesRuraisByTecnologia(tecnologia) {
    return this.request(`/redes-rurais/tecnologia/${tecnologia}`);
  }

  // Métodos unificados para configurações
  async getConfiguracao(endpoint) {
    // Desabilitar cache para configurações para sempre buscar dados atualizados
    const url = `${this.baseURL}/configuracoes/${endpoint}`;
    console.log(`🔍 API: Buscando configuração sem cache:`, url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`🔍 API: Resposta da configuração:`, data);
    return data;
  }

  async getConfiguracaoById(endpoint, id) {
    return this.request(`/configuracoes/${endpoint}/${id}`);
  }

  async createConfiguracao(endpoint, dados) {
    return this.request(`/configuracoes/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }

  async updateConfiguracao(endpoint, id, dados) {
    return this.request(`/configuracoes/${endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  }

  async deleteConfiguracao(endpoint, id) {
    return this.request(`/configuracoes/${endpoint}/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos específicos para compatibilidade
  async getTiposAcesso() {
    return this.getConfiguracao('tipos-acesso');
  }

  async getFuncoes() {
    return this.getConfiguracao('funcoes');
  }

  // Métodos para backups
  async getBackups(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/backups?${queryString}` : '/backups';
    
    return this.request(endpoint);
  }

  async getBackupById(id) {
    return this.request(`/backups/${id}`);
  }

  async createBackup(backupData) {
    return this.request('/backups', {
      method: 'POST',
      body: JSON.stringify(backupData),
    });
  }

  async updateBackup(id, backupData) {
    return this.request(`/backups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backupData),
    });
  }

  async deleteBackup(id) {
    return this.request(`/backups/${id}`, {
      method: 'DELETE',
    });
  }

  async getBackupsByEquipamento(equipamentoId) {
    return this.request(`/backups/equipamento/${equipamentoId}`);
  }

  // Métodos para dashboard removidos - dashboard agora usa dados diretos dos equipamentos

  // Métodos para topologia (sem autenticação)
  async getTopologiaPosicoes() {
    return this.requestWithoutAuth('/topologia/posicoes');
  }

  async saveTopologiaPosicoes(posicoes, modificados = null) {
    return this.requestWithoutAuth('/topologia/posicoes', {
      method: 'POST',
      body: JSON.stringify({ posicoes, modificados }),
    });
  }

  async updateTopologiaPosicao(popKey, x, y) {
    return this.requestWithoutAuth(`/topologia/posicoes/${popKey}`, {
      method: 'PUT',
      body: JSON.stringify({ x, y }),
    });
  }

  async clearTopologiaPosicoes() {
    return this.requestWithoutAuth('/topologia/posicoes', {
      method: 'DELETE',
    });
  }

  async getTopologiaEquipamentos() {
    return this.requestWithoutAuth('/topologia/equipamentos');
  }

  // Métodos para etiquetas de conexões
  async getTopologiaConexoes() {
    return this.requestWithoutAuth('/topologia/conexoes');
  }

  async saveTopologiaConexaoLabel(connectionId, label) {
    return this.requestWithoutAuth('/topologia/conexoes', {
      method: 'POST',
      body: JSON.stringify({ connectionId, label }),
    });
  }

  async updateTopologiaConexaoLabel(connectionId, label) {
    return this.requestWithoutAuth(`/topologia/conexoes/${connectionId}`, {
      method: 'PUT',
      body: JSON.stringify({ label }),
    });
  }

  async deleteTopologiaConexaoLabel(connectionId) {
    return this.requestWithoutAuth(`/topologia/conexoes/${connectionId}`, {
      method: 'DELETE',
    });
  }

  // Método para verificar saúde da API
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();
