import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Layout from './shared/Layout';
import ModalEditarEquipamento from './shared/ModalEditarEquipamento';
import { useEquipamentos } from '../hooks/useEquipamentos';
import { FiRefreshCw, FiMaximize2, FiMinimize2, FiInfo, FiEdit3, FiSave, FiX, FiRotateCcw, FiDownload, FiUpload } from 'react-icons/fi';
import api from '../services/api';

const TopologiaRede = () => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  
  // Debug: Log quando selectedEquipment muda
  useEffect(() => {
    if (selectedEquipment) {
      console.log('📱 Modal aberto para:', selectedEquipment.nome);
    }
  }, [selectedEquipment]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConnections, setShowConnections] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [equipamentoParaEditar, setEquipamentoParaEditar] = useState(null);
  
  // Refs para controle de animações
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // Usar hook de equipamentos
  const { equipamentos, loading, error, loadEquipamentos, updateEquipamento, refreshEquipamentos } = useEquipamentos();

  // Carregar equipamentos apenas se não há dados
  useEffect(() => {
    if (equipamentos.length === 0 && !loading) {
      loadEquipamentos({}, 1, 1000);
    }
  }, []);

  // Layout simples - sem necessidade de carregar posições salvas

  // Layout simples - sem funções de edição complexas

  // Handlers simples de zoom e pan via props do container
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev * delta)));
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('[data-equipment]')) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan.x, pan.y]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart.x, dragStart.y]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
  }, [isDragging]);

  // Layout simples - sem edição de posições

  // Processar dados para topologia
  const topologiaData = useMemo(() => {
    if (!equipamentos || equipamentos.length === 0) return { nodes: [], connections: [], levels: [], pops: [] };

    // Criar nós dos equipamentos
    const nodes = equipamentos.map((equipamento, index) => {
      return {
        id: equipamento.id,
        nome: equipamento.nome,
        tipo: equipamento.tipo,
        fabricante: equipamento.fabricante,
        modelo: equipamento.modelo,
        ipPrivado: equipamento.ipPrivado,
        ipPublico: equipamento.ipPublico,
        status: equipamento.status || 'Desconhecido',
        pop: (typeof equipamento.pop === 'string' ? equipamento.pop : equipamento.pop?.nome) ||
             equipamento.localidade?.endereco ||
             equipamento.cidade ||
             'Não informado',
        equipamentoAnterior: equipamento.equipamentoAnterior,
        equipamentoPosterior: equipamento.equipamentoPosterior,
        connections: 0,
        level: 0,
        x: 0,
        y: 0
      };
    });

    // Agrupar equipamentos por POP
    const popGroups = {};
    nodes.forEach(node => {
      if (!popGroups[node.pop]) {
        popGroups[node.pop] = [];
      }
      popGroups[node.pop].push(node);
    });

    // Criar grupos de POPs
    const pops = Object.keys(popGroups).map((popName, index) => ({
      id: `pop-${index}`,
      nome: popName,
      equipamentos: popGroups[popName],
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }));

    // Criar conexões baseadas nos campos de equipamento anterior e posterior
    const connections = [];
    const processedConnections = new Set();

    nodes.forEach(node => {
      // Conexão com equipamento anterior
      if (node.equipamentoAnterior) {
        const anteriorNode = nodes.find(n => 
          n.nome === node.equipamentoAnterior || 
          n.id === node.equipamentoAnterior
        );
        if (anteriorNode) {
          const connectionId = `${anteriorNode.id}-${node.id}`;
          if (!processedConnections.has(connectionId)) {
            connections.push({
              id: connectionId,
              from: anteriorNode.id,
              to: node.id,
              fromName: anteriorNode.nome,
              toName: node.nome,
              direction: 'anterior'
            });
            processedConnections.add(connectionId);
            anteriorNode.connections++;
            node.connections++;
          }
        }
      }

      // Conexão com equipamento posterior
      if (node.equipamentoPosterior) {
        const posteriorNode = nodes.find(n => 
          n.nome === node.equipamentoPosterior || 
          n.id === node.equipamentoPosterior
        );
        if (posteriorNode) {
          const connectionId = `${node.id}-${posteriorNode.id}`;
          if (!processedConnections.has(connectionId)) {
            connections.push({
              id: connectionId,
              from: node.id,
              to: posteriorNode.id,
              fromName: node.nome,
              toName: posteriorNode.nome,
              direction: 'posterior'
            });
            processedConnections.add(connectionId);
            node.connections++;
            posteriorNode.connections++;
          }
        }
      }
    });

    // Layout organizado por POPs
    const containerWidth = 1200;
    const containerHeight = 600;
    const margin = 80;
    const popSpacing = 200; // Espaçamento entre POPs
    const nodeSpacing = 100; // Espaçamento entre equipamentos dentro do POP
    const popPadding = 40; // Padding interno do POP

    // Função para calcular posição dos equipamentos dentro de um POP
    const getPopLayout = (equipamentos, popIndex, totalPops) => {
      const equipamentosCount = equipamentos.length;
      if (equipamentosCount === 0) return;

      // Calcular dimensões do POP baseado no número de equipamentos
      const cols = Math.max(1, Math.ceil(Math.sqrt(equipamentosCount)));
      const rows = Math.max(1, Math.ceil(equipamentosCount / cols));

      const popWidth = Math.max(220, cols * nodeSpacing + popPadding * 2);
      const popHeight = Math.max(180, rows * nodeSpacing + popPadding * 2);

      // Posição do POP na tela
      const popsPerRow = Math.max(1, Math.ceil(Math.sqrt(totalPops)));
      const popRow = Math.floor(popIndex / popsPerRow);
      const popCol = popIndex % popsPerRow;

      const popX = margin + popCol * (popWidth + popSpacing);
      const popY = margin + popRow * (popHeight + popSpacing);

      // Atualizar dimensões do POP
      const pop = pops[popIndex];
      pop.x = popX;
      pop.y = popY;
      pop.width = popWidth;
      pop.height = popHeight;

      // Posicionar equipamentos dentro do POP (coordenadas absolutas)
      equipamentos.forEach((equipamento, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        equipamento.x = popX + popPadding + col * nodeSpacing;
        equipamento.y = popY + popPadding + row * nodeSpacing;
      });
    };

    // Aplicar layout para cada POP
    pops.forEach((pop, index) => {
      getPopLayout(pop.equipamentos, index, pops.length);
    });

    // Calcular direção média das conexões externas por POP
    const nodeIdToPop = new Map();
    pops.forEach(pop => {
      pop.equipamentos.forEach(eq => nodeIdToPop.set(eq.id, pop));
    });

    const getRectIntersection = (rx, ry, rw, rh, x1, y1, x2, y2) => {
      // Parametric line clipping (Liang–Barsky simplificado)
      const left = rx, right = rx + rw, top = ry, bottom = ry + rh;
      const dx = x2 - x1, dy = y2 - y1;
      let t0 = 0, t1 = 1;
      const clip = (p, q) => {
        if (p === 0) return q < 0 ? false : true;
        const r = q / p;
        if (p < 0) {
          if (r > t1) return false; if (r > t0) t0 = r;
        } else {
          if (r < t0) return false; if (r < t1) t1 = r;
        }
        return true;
      };
      if (!clip(-dx, x1 - left)) return null;
      if (!clip(dx, right - x1)) return null;
      if (!clip(-dy, y1 - top)) return null;
      if (!clip(dy, bottom - y1)) return null;
      const ix = x1 + dx * t1;
      const iy = y1 + dy * t1;
      return { x: ix, y: iy };
    };

    pops.forEach(pop => {
      // Alvos: centros dos nós conectados fora deste POP
      const targets = [];
      pop.equipamentos.forEach(node => {
        connections.forEach(conn => {
          if (conn.from === node.id || conn.to === node.id) {
            const otherId = conn.from === node.id ? conn.to : conn.from;
            const otherNode = nodes.find(n => n.id === otherId);
            if (!otherNode) return;
            const otherPop = nodeIdToPop.get(otherId);
            if (!otherPop || otherPop === pop) return; // apenas conexões externas
            targets.push({ x: otherNode.x, y: otherNode.y });
          }
        });
      });

      if (targets.length === 0) {
        pop.arrow = null;
        return;
      }

      // Centro do POP
      const cx = pop.x + pop.width / 2;
      const cy = pop.y + pop.height / 2;

      // Média dos alvos
      const avg = targets.reduce((acc, t) => ({ x: acc.x + t.x, y: acc.y + t.y }), { x: 0, y: 0 });
      const tx = avg.x / targets.length;
      const ty = avg.y / targets.length;

      const inter = getRectIntersection(pop.x, pop.y, pop.width, pop.height, cx, cy, tx, ty);
      if (!inter) {
        pop.arrow = null;
        return;
      }

      const angle = Math.atan2(ty - cy, tx - cx) * 180 / Math.PI; // graus
      pop.arrow = { x: inter.x, y: inter.y, angle };
    });

    return { nodes, connections, pops };
  }, [equipamentos]);

  // Função para calcular interseção da linha com a borda do equipamento
  const getLineIntersection = (x1, y1, x2, y2, centerX, centerY, radius) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dr = Math.sqrt(dx * dx + dy * dy);
    
    if (dr === 0) return { x: x2, y: y2 };
    
    const D = x1 * y2 - x2 * y1;
    const discriminant = radius * radius * dr * dr - D * D;
    
    if (discriminant < 0) return { x: x2, y: y2 };
    
    const x1_intersect = (D * dy + Math.sign(dy) * dx * Math.sqrt(discriminant)) / (dr * dr);
    const y1_intersect = (-D * dx + Math.abs(dy) * Math.sqrt(discriminant)) / (dr * dr);
    const x2_intersect = (D * dy - Math.sign(dy) * dx * Math.sqrt(discriminant)) / (dr * dr);
    const y2_intersect = (-D * dx - Math.abs(dy) * Math.sqrt(discriminant)) / (dr * dr);
    
    const dist1 = Math.sqrt((x1_intersect - x2) ** 2 + (y1_intersect - y2) ** 2);
    const dist2 = Math.sqrt((x2_intersect - x2) ** 2 + (y2_intersect - y2) ** 2);
    
    return dist1 < dist2 ? 
      { x: x1_intersect + centerX, y: y1_intersect + centerY } : 
      { x: x2_intersect + centerX, y: y2_intersect + centerY };
  };

  // Funções auxiliares
  const getEquipmentIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'roteador':
      case 'router':
        return '🖥️';
      case 'switch':
        return '🔀';
      case 'ap':
      case 'access-point':
        return '📶';
      case 'firewall':
        return '🛡️';
      case 'servidor':
        return '🖥️';
      case 'antena':
        return '📡';
      case 'mikrotik':
        return '🔧';
      default:
        return '🖥️';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
      case 'online':
        return '#10b981';
      case 'em manutenção':
      case 'atenção':
      case 'warning':
        return '#f59e0b';
      case 'offline':
      case 'inativo':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
      case 'online':
        return 'Online';
      case 'em manutenção':
      case 'atenção':
        return 'Atenção';
      case 'offline':
      case 'inativo':
        return 'Offline';
      default:
        return 'Desconhecido';
    }
  };

  if (loading) {
    return (
      <Layout currentPage="/topologia">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-white">Carregando topologia...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && equipamentos.length === 0) {
    return (
      <Layout currentPage="/topologia">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-white mb-4">Erro ao carregar equipamentos</p>
            <p className="text-white/70 mb-6 text-sm">
              {error.includes('Rate limit') 
                ? 'Muitas requisições. Aguarde alguns minutos antes de tentar novamente.'
                : error
              }
            </p>
            <button 
              onClick={() => loadEquipamentos({}, 1, 1000, true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              disabled={error.includes('Rate limit')}
            >
              {error.includes('Rate limit') ? 'Aguarde...' : 'Tentar novamente'}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="/topologia">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Topologia de Rede</h1>
            <p className="text-white/70">Mapa visual das conexões entre equipamentos</p>
            {error && error.includes('Rate limit') && (
              <div className="mt-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  ⚠️ Rate limit atingido. Dados podem estar desatualizados.
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-white/70 text-sm">
              {topologiaData.nodes.length} equipamentos • {topologiaData.connections.length} conexões
            </div>
            <button
              onClick={() => loadEquipamentos({}, 1, 1000, true)}
              disabled={error && error.includes('Rate limit')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className={`w-4 h-4 ${error && error.includes('Rate limit') ? 'animate-spin' : ''}`} />
              <span>{error && error.includes('Rate limit') ? 'Aguarde...' : 'Atualizar'}</span>
            </button>
            
            <button
              onClick={() => {
                // Ajustar zoom e pan para mostrar todos os equipamentos
                if (topologiaData.pops.length > 0) {
                  const containerWidth = 1200;
                  const containerHeight = 600;
                  const viewportWidth = isFullscreen ? window.innerWidth - 32 : 1200;
                  const viewportHeight = isFullscreen ? window.innerHeight - 32 : 600;
                  
                  const scaleX = viewportWidth / containerWidth;
                  const scaleY = viewportHeight / containerHeight;
                  const newZoom = Math.min(scaleX, scaleY) * 0.9; // 90% para dar margem
                  
                  setZoom(newZoom);
                  setPan({ x: 0, y: 0 });
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            >
              <FiRotateCcw className="w-4 h-4" />
              <span>Ajustar Visualização</span>
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            >
              {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
              <span>{isFullscreen ? 'Sair' : 'Tela Cheia'}</span>
            </button>
          </div>
        </div>

        {/* Controles simples de visualização */}
        <div className="mb-4 bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Controles de Visualização</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={showConnections}
                  onChange={(e) => setShowConnections(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Mostrar Conexões</span>
              </label>
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Mostrar Labels</span>
              </label>
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Mostrar Grade</span>
              </label>
            </div>
          </div>
        </div>

        {/* Mapa de topologia */}
        <div 
          ref={containerRef}
          id="topology-container"
          className={`bg-white/95 backdrop-blur-custom rounded-xl border border-purple-100 shadow-lg relative overflow-hidden topology-bg topology-container ${
            isFullscreen ? 'fixed inset-4 z-50' : ''
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : '600px' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grade de fundo */}
          {showGrid && (
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle, #7d26d9 1px, transparent 1px)`,
                backgroundSize: `20px 20px`
              }}
            />
          )}

          {/* Layout simples - sem indicadores complexos */}

          {/* SVG para conexões simples */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 2 }}
          >

            {/* Definir marcadores de seta */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#7d26d9"
                  opacity="0.8"
                />
              </marker>
            </defs>

            {/* Conexões simples */}
            {showConnections && topologiaData.connections.map(connection => {
              const fromNode = topologiaData.nodes.find(n => n.id === connection.from);
              const toNode = topologiaData.nodes.find(n => n.id === connection.to);
              
              if (!fromNode || !toNode) return null;

              const fromX = fromNode.x * zoom + pan.x;
              const fromY = fromNode.y * zoom + pan.y;
              const toX = toNode.x * zoom + pan.x;
              const toY = toNode.y * zoom + pan.y;

              return (
                <line
                  key={connection.id}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#7d26d9"
                  strokeWidth="2"
                  opacity="0.6"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
          </svg>

          {/* POPs */}
          {topologiaData.pops.map(pop => (
            <div
              key={pop.id}
              className="absolute border-2 border-purple-300 rounded-lg bg-purple-50/80 backdrop-blur-sm"
              style={{
                left: pop.x * zoom + pan.x,
                top: pop.y * zoom + pan.y,
                width: pop.width * zoom,
                height: pop.height * zoom,
                zIndex: 1
              }}
            >
              {/* Título do POP */}
              <div className="absolute -top-6 left-0 bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                {pop.nome}
              </div>

              {/* Equipamentos do POP */}
              {pop.equipamentos.map(node => (
                <div
                  key={node.id}
                  data-equipment={node.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Equipamento clicado:', node.nome);
                    setSelectedEquipment(node);
                  }}
                  className="absolute transition-all duration-300 cursor-pointer hover:scale-105"
                  style={{
                    left: (node.x - pop.x) * zoom - 30,
                    top: (node.y - pop.y) * zoom - 30,
                    width: '60px',
                    height: '60px',
                    zIndex: 3
                  }}
                >
                  <div
                    className="bg-white rounded-lg border-2 shadow-lg p-1 h-full flex flex-col items-center justify-center text-center"
                    style={{
                      borderColor: getStatusColor(node.status),
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                    }}
                  >
                    {/* Ícone do equipamento */}
                    <div className="text-lg mb-1">
                      {getEquipmentIcon(node.tipo)}
                    </div>
                    
                    {/* Nome do equipamento */}
                  <div 
                    className="font-bold text-gray-800 text-[8px] leading-tight text-center break-words"
                    title={node.nome}
                  >
                    {node.nome}
                  </div>
                    
                    {/* Status - apenas cor, sem texto */}
                    <div 
                      className="w-1.5 h-1.5 rounded-full mt-0.5"
                      style={{ 
                        backgroundColor: getStatusColor(node.status)
                      }}
                      title={getStatusText(node.status)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Legenda simples */}
          <div className="absolute top-4 right-4 bg-white/95 rounded-xl p-3 shadow-xl z-10 max-w-48">
            <h4 className="text-sm font-bold text-gray-800 mb-3">Legenda</h4>
            
            {/* Status dos equipamentos */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-700">Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-700">Atenção</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-700">Offline</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-4 h-0.5 bg-purple-500 relative">
                  <div className="absolute right-0 top-0 w-0 h-0 border-l-4 border-l-purple-500 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                </div>
                <span className="text-xs text-gray-700">Conexão</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-4 h-4 border-2 border-purple-300 rounded bg-purple-50/80"></div>
                <span className="text-xs text-gray-700">POP</span>
              </div>
            </div>
          </div>

          {/* Controles de zoom */}
          <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg p-2 shadow-lg z-10">
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => setZoom(prev => Math.min(5, prev + 0.2))}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                +
              </button>
              <span className="text-xs text-center text-gray-600">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(prev => Math.max(0.3, prev - 0.2))}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                -
              </button>
            </div>
          </div>

          {/* Instruções simples */}
          <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 shadow-lg z-10">
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🖱️</span>
                <span>Arraste para mover</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🔍</span>
                <span>Scroll para zoom</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">📦</span>
                <span>Equipamentos agrupados por POP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de detalhes do equipamento */}
        {selectedEquipment && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEquipment(null)}
          >
            <div 
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedEquipment.nome}
                </h3>
                <button
                  onClick={() => setSelectedEquipment(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Tipo:</label>
                  <p className="text-gray-900">{selectedEquipment.tipo}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Status:</label>
                  <p className="text-gray-900">{getStatusText(selectedEquipment.status)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">IP Privado:</label>
                  <p className="text-gray-900 font-mono">{selectedEquipment.ipPrivado || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">POP:</label>
                  <p className="text-gray-900">{selectedEquipment.pop}</p>
                </div>

                
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => {
                    setEquipamentoParaEditar(selectedEquipment);
                    setShowEditModal(true);
                    setSelectedEquipment(null);
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => setSelectedEquipment(null)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edição - mesmo usado na tela de Equipamentos */}
        {showEditModal && equipamentoParaEditar && (
          <ModalEditarEquipamento
            isVisible={showEditModal}
            equipamento={equipamentoParaEditar}
            onClose={() => { setShowEditModal(false); setEquipamentoParaEditar(null); }}
            onSave={async (id, data) => {
              try {
                const resp = await updateEquipamento(id, data);
                if (resp?.success) {
                  setShowEditModal(false);
                  setEquipamentoParaEditar(null);
                  await refreshEquipamentos();
                }
              } catch (e) {
                console.error('Erro ao atualizar equipamento pela Topologia:', e);
              }
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default TopologiaRede;