import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  FiMonitor, 
  FiAlertTriangle, 
  FiXCircle, 
  FiRefreshCw,
  FiTrendingUp,
  FiMapPin,
  FiServer,
  FiActivity,
  FiCheckCircle
} from 'react-icons/fi';
import Layout from './shared/Layout';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cores para gráficos
  const COLORS = {
    primary: '#7d26d9',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    purple: '#8b5cf6',
    pink: '#ec4899',
    indigo: '#6366f1'
  };

  const CHART_COLORS = [
    COLORS.primary,
    COLORS.success,
    COLORS.warning,
    COLORS.danger,
    COLORS.info,
    COLORS.purple,
    COLORS.pink,
    COLORS.indigo
  ];

  // Função para buscar dados do dashboard
  const fetchDashboardData = useCallback(async () => {
    try {
      console.log('🔄 DASHBOARD: Iniciando carregamento de dados...');
      setIsRefreshing(true);
      setLoading(true);
      
      // Buscar equipamentos diretamente da API
      const response = await api.getEquipamentos({}, 1, 1000); // Buscar todos os equipamentos
      console.log('📡 DASHBOARD: Resposta da API:', response);
      
      if (response.success && response.data) {
        const equipamentos = response.data;
        console.log('✅ DASHBOARD: Equipamentos carregados:', equipamentos.length);
        
        // Processar dados para o dashboard
        const processedData = processDashboardData(equipamentos);
        setDashboardData(processedData);
        setLastUpdate(new Date());
        console.log('✅ DASHBOARD: Dados processados:', processedData);
      } else {
        throw new Error('Erro ao carregar equipamentos');
      }
    } catch (error) {
      console.error('❌ DASHBOARD: Erro ao carregar dados:', error);
      
      // Fallback com dados vazios
      setDashboardData({
        resumo: {
          totalEquipamentos: 0,
          equipamentosAtivos: 0,
          equipamentosOffline: 0,
          totalPOPs: 0,
          totalFuncoes: 0,
          totalModosAcesso: 0
        },
        equipamentosPorTipo: [],
        equipamentosPorPOP: [],
        equipamentosPorFuncao: [],
        equipamentosPorModoAcesso: []
      });
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, []);

  // Processar dados dos equipamentos para o dashboard
  const processDashboardData = (equipamentos) => {
    console.log('🔄 DASHBOARD: Processando dados de', equipamentos.length, 'equipamentos');
    
    // Contar por tipo
    const tipoCount = {};
    // Contar por POP
    const popCount = {};
    // Contar por função
    const funcaoCount = {};
    // Contar por modo de acesso
    const modoAcessoCount = {};
    
    equipamentos.forEach(equipamento => {
      // Tipo
      const tipo = equipamento.tipo || 'Desconhecido';
      tipoCount[tipo] = (tipoCount[tipo] || 0) + 1;
      
      // POP - usar a mesma lógica dos cards
      const popValue = (typeof equipamento.pop === 'string' ? equipamento.pop : equipamento.pop?.nome) ||
                      equipamento.localidade?.endereco ||
                      equipamento.cidade ||
                      equipamento.endereco?.cidade ||
                      'Não informado';
      popCount[popValue] = (popCount[popValue] || 0) + 1;
      
      // Funções - equipamento.funcoes é um array
      if (equipamento.funcoes && Array.isArray(equipamento.funcoes)) {
        equipamento.funcoes.forEach(funcao => {
          if (funcao && funcao.trim() !== '') {
            funcaoCount[funcao] = (funcaoCount[funcao] || 0) + 1;
          }
        });
      } else if (equipamento.funcao && equipamento.funcao.trim() !== '') {
        // Fallback para equipamento.funcao (string única)
        funcaoCount[equipamento.funcao] = (funcaoCount[equipamento.funcao] || 0) + 1;
      }
      
      // Modo de acesso
      const modoAcesso = equipamento.modoAcesso || equipamento.tipoAcesso || 'Não informado';
      modoAcessoCount[modoAcesso] = (modoAcessoCount[modoAcesso] || 0) + 1;
    });
    
    // Converter para arrays para gráficos
    const equipamentosPorTipo = Object.entries(tipoCount).map(([tipo, quantidade]) => ({
      tipo,
      quantidade
    }));
    
    const equipamentosPorPOP = Object.entries(popCount).map(([pop, quantidade]) => ({
      pop,
      quantidade: Number(quantidade) // Garantir que é número
    }));
    
    console.log('🔍 DASHBOARD: popCount processado:', popCount);
    console.log('🔍 DASHBOARD: equipamentosPorPOP final:', equipamentosPorPOP);
    
    const equipamentosPorFuncao = Object.entries(funcaoCount).map(([funcao, quantidade]) => ({
      funcao,
      quantidade
    }));
    
    const equipamentosPorModoAcesso = Object.entries(modoAcessoCount).map(([modoAcesso, quantidade]) => ({
      modoAcesso,
      quantidade
    }));
    
    // Resumo
    const resumo = {
      totalEquipamentos: equipamentos.length,
      equipamentosAtivos: equipamentos.filter(e => e.status === 'Ativo').length,
      equipamentosOffline: equipamentos.filter(e => e.status && e.status !== 'Ativo').length,
      totalPOPs: Object.keys(popCount).length,
      totalFuncoes: Object.keys(funcaoCount).length,
      totalModosAcesso: Object.keys(modoAcessoCount).length
    };
    
    return {
      resumo,
      equipamentosPorTipo,
      equipamentosPorPOP,
      equipamentosPorFuncao,
      equipamentosPorModoAcesso
    };
  };

  // Carregar dados iniciais apenas uma vez na montagem do componente
  useEffect(() => {
    // Só buscar se não houver dados ainda
    if (!dashboardData && !loading) {
      fetchDashboardData();
    }
  }, []); // Dependências vazias - executar apenas uma vez

  // Função para formatar números
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Função para formatar porcentagem
  const formatPercentage = (value, total) => {
    if (total === 0) return '0%';
    return Math.round((value / total) * 100) + '%';
  };

  // Função para obter cor do status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
      case 'online':
        return COLORS.success;
      case 'em manutenção':
      case 'atenção':
        return COLORS.warning;
      case 'offline':
      case 'inativo':
        return COLORS.danger;
      default:
        return COLORS.info;
    }
  };

  // Componente de card de estatística
  const StatCard = ({ title, value, subtitle, icon, color, trend, trendValue }) => (
    <div className="bg-white/95 backdrop-blur-custom rounded-xl p-6 border border-purple-100 shadow-lg stat-card dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}20` }}>
          <div style={{ color }} className="text-2xl">
            {icon}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <FiTrendingUp className={`w-4 h-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(value)}</h3>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );

  // Componente de gráfico de barras
  const BarChartComponent = ({ data, dataKey, nameKey, title, color = COLORS.primary }) => (
    <div className="bg-white/95 backdrop-blur-custom rounded-xl p-6 border border-purple-100 shadow-lg dashboard-chart">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey={nameKey} 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar 
            dataKey={dataKey} 
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  // Componente de gráfico de pizza
  const PieChartComponent = ({ data, dataKey, nameKey, title, colors = CHART_COLORS }) => (
    <div className="bg-white/95 backdrop-blur-custom rounded-xl p-6 border border-purple-100 shadow-lg dashboard-chart">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  // Componente de lista de atividades
  const ActivityList = ({ activities, title }) => (
    <div className="bg-white/95 backdrop-blur-custom rounded-xl p-6 border border-purple-100 shadow-lg dashboard-activity">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg activity-item">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: getStatusColor(activity.status) }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.nome || activity.title}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.cidade || activity.location} • {activity.status}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                {activity.criadoEm ? new Date(activity.criadoEm).toLocaleDateString('pt-BR') : 'Agora'}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FiActivity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma atividade encontrada</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout currentPage="/home">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout currentPage="/home">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FiXCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Erro ao carregar dashboard</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { resumo, equipamentosPorTipo, equipamentosPorPOP, equipamentosPorFuncao, equipamentosPorModoAcesso } = dashboardData;

  return (
    <Layout currentPage="/home">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-white/70">Visão geral do sistema de monitoramento</p>
          </div>
          <div className="flex items-center space-x-4">
            {lastUpdate && (
              <div className="text-white/70 text-sm">
                Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
              </div>
            )}
            <button
              onClick={fetchDashboardData}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg refresh-button disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'loading-spinner' : ''}`} />
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Equipamentos"
            value={resumo.totalEquipamentos || 0}
            subtitle="Equipamentos cadastrados"
            icon={<FiMonitor />}
            color={COLORS.primary}
          />
          <StatCard
            title="Equipamentos Ativos"
            value={resumo.equipamentosAtivos || 0}
            subtitle={`${formatPercentage(resumo.equipamentosAtivos || 0, resumo.totalEquipamentos || 1)} operacionais`}
            icon={<FiCheckCircle />}
            color={COLORS.success}
          />
          <StatCard
            title="POPs Ativos"
            value={resumo.totalPOPs || 0}
            subtitle="Pontos de presença"
            icon={<FiMapPin />}
            color={COLORS.info}
          />
          <StatCard
            title="Funções Únicas"
            value={resumo.totalFuncoes || 0}
            subtitle="Tipos de função"
            icon={<FiServer />}
            color={COLORS.purple}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {equipamentosPorTipo && equipamentosPorTipo.length > 0 ? (
            <BarChartComponent
              data={equipamentosPorTipo}
              dataKey="quantidade"
              nameKey="tipo"
              title="Equipamentos por Tipo"
              color={COLORS.primary}
            />
          ) : (
            <div className="bg-white/95 backdrop-blur-custom rounded-xl p-6 border border-purple-100 shadow-lg empty-chart dashboard-chart">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipamentos por Tipo</h3>
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <FiMonitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum dado disponível</p>
                </div>
              </div>
            </div>
          )}
          
          {equipamentosPorPOP && equipamentosPorPOP.length > 0 ? (
            <div className="bg-white/95 backdrop-blur-custom rounded-xl p-6 border border-purple-100 shadow-lg dashboard-chart">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipamentos por POP</h3>
              {console.log('🔍 DASHBOARD: Dados equipamentosPorPOP:', equipamentosPorPOP)}
              
              {/* Gráfico customizado de barras horizontais */}
              <div className="space-y-3">
                {equipamentosPorPOP.map((item, index) => {
                  const maxValue = Math.max(...equipamentosPorPOP.map(d => d.quantidade));
                  const percentage = (item.quantidade / maxValue) * 100;
                  
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-48 text-sm font-medium text-gray-700 truncate" title={item.pop}>
                        {item.pop}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                        <div 
                          className="bg-green-500 h-6 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                          {item.quantidade}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-custom rounded-xl p-6 border border-purple-100 shadow-lg empty-chart dashboard-chart">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipamentos por POP</h3>
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <FiMapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum dado disponível</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {equipamentosPorFuncao && equipamentosPorFuncao.length > 0 ? (
            <BarChartComponent
              data={equipamentosPorFuncao}
              dataKey="quantidade"
              nameKey="funcao"
              title="Equipamentos por Função"
              color={COLORS.warning}
            />
          ) : (
            <div className="bg-white/95 backdrop-blur-custom rounded-xl p-6 border border-purple-100 shadow-lg empty-chart dashboard-chart">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipamentos por Função</h3>
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <FiServer className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum dado disponível</p>
                </div>
              </div>
            </div>
          )}
          
          {equipamentosPorModoAcesso && equipamentosPorModoAcesso.length > 0 ? (
            <BarChartComponent
              data={equipamentosPorModoAcesso}
              dataKey="quantidade"
              nameKey="modoAcesso"
              title="Equipamentos por Modo de Acesso"
              color={COLORS.purple}
            />
          ) : (
            <div className="bg-white/95 backdrop-blur-custom rounded-xl p-6 border border-purple-100 shadow-lg empty-chart dashboard-chart">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipamentos por Modo de Acesso</h3>
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <FiActivity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum dado disponível</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;