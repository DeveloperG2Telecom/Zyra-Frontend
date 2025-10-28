import React, { useState, useEffect, useMemo } from 'react';
import Layout from './shared/Layout';
import { useEquipamentos } from '../hooks/useEquipamentos';
import { FiRefreshCw, FiMaximize2, FiMinimize2, FiInfo, FiEdit3, FiSave, FiX } from 'react-icons/fi';

const TopologiaRede = () => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedPop, setDraggedPop] = useState(null);
  const [popPositions, setPopPositions] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Usar hook de equipamentos
  const { equipamentos, loading, error, loadEquipamentos } = useEquipamentos();

  // Carregar equipamentos apenas se não há dados
  useEffect(() => {
    if (equipamentos.length === 0 && !loading) {
      loadEquipamentos({}, 1, 1000);
    }
  }, []); // Dependências vazias para executar apenas uma vez

  // Adicionar event listeners para zoom e pan
  useEffect(() => {
    const container = document.getElementById('topology-container');
    if (!container) return;

    const handleWheelEvent = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.max(0.3, Math.min(5, prev * delta)));
    };

    const handleMouseDownEvent = (e) => {
      // Permitir arrastar com qualquer botão do mouse
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMoveEvent = (e) => {
      if (isDragging) {
        e.preventDefault();
        if (isEditMode && draggedPop) {
          handlePopDragMove(e);
        } else {
          setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
          });
        }
      }
    };

    const handleMouseUpEvent = (e) => {
      e.preventDefault();
      if (isEditMode && draggedPop) {
        handlePopDragEnd();
      } else {
        setIsDragging(false);
      }
    };

    // Adicionar event listeners com passive: false
    container.addEventListener('wheel', handleWheelEvent, { passive: false });
    container.addEventListener('mousedown', handleMouseDownEvent, { passive: false });
    document.addEventListener('mousemove', handleMouseMoveEvent, { passive: false });
    document.addEventListener('mouseup', handleMouseUpEvent, { passive: false });
    document.addEventListener('mouseleave', handleMouseUpEvent, { passive: false });

    // Cleanup
    return () => {
      container.removeEventListener('wheel', handleWheelEvent);
      container.removeEventListener('mousedown', handleMouseDownEvent);
      document.removeEventListener('mousemove', handleMouseMoveEvent);
      document.removeEventListener('mouseup', handleMouseUpEvent);
      document.removeEventListener('mouseleave', handleMouseUpEvent);
    };
  }, [isDragging, dragStart, pan, isEditMode, draggedPop]);

  // Funções para modo de edição de POPs
  const handleEditModeToggle = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      // Entrando no modo de edição - salvar posições atuais dos POPs
      const currentPopPositions = {};
      Object.entries(topologiaData.popGroups || {}).forEach(([popKey, popNodes]) => {
        if (popNodes.length > 0) {
          const centerX = popNodes.reduce((sum, n) => sum + n.x, 0) / popNodes.length;
          const centerY = popNodes.reduce((sum, n) => sum + n.y, 0) / popNodes.length;
          currentPopPositions[popKey] = { x: centerX, y: centerY };
        }
      });
      setPopPositions(currentPopPositions);
    }
  };

  const handlePopDragStart = (e, popKey) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    // Calcular posição atual do POP
    const popNodes = topologiaData.popGroups[popKey] || [];
    if (popNodes.length === 0) return;
    
    const centerX = popNodes.reduce((sum, n) => sum + n.x, 0) / popNodes.length;
    const centerY = popNodes.reduce((sum, n) => sum + n.y, 0) / popNodes.length;
    
    // Calcular posição atual na tela (considerando zoom e pan)
    const screenX = centerX * zoom + pan.x;
    const screenY = centerY * zoom + pan.y;
    
    setDraggedPop(popKey);
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - screenX, 
      y: e.clientY - screenY 
    });
  };

  const handlePopDragMove = (e) => {
    if (!isEditMode || !draggedPop || !isDragging) return;
    e.preventDefault();
    
    // Calcular nova posição baseada no offset inicial
    const newX = (e.clientX - dragStart.x) / zoom;
    const newY = (e.clientY - dragStart.y) / zoom;
    
    // Atualizar posição do POP
    setPopPositions(prev => ({
      ...prev,
      [draggedPop]: { x: newX, y: newY }
    }));
  };

  const handlePopDragEnd = () => {
    if (!isEditMode) return;
    setDraggedPop(null);
    setIsDragging(false);
  };

  const handleSavePositions = async () => {
    setIsSaving(true);
    try {
      // Aqui você pode implementar a lógica para salvar as posições no backend
      console.log('Salvando posições dos POPs:', popPositions);
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Salvar no localStorage como exemplo
      localStorage.setItem('topologyPopPositions', JSON.stringify(popPositions));
      
      alert('Posições dos POPs salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar posições:', error);
      alert('Erro ao salvar posições');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPositions = () => {
    setPopPositions({});
    setIsEditMode(false);
  };

  // Processar dados para topologia
  const topologiaData = useMemo(() => {
    if (!equipamentos || equipamentos.length === 0) return { nodes: [], connections: [], levels: [] };

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
        connections: 0, // Será calculado depois
        level: 0, // Nível hierárquico
        x: 0,
        y: 0
      };
    });

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
            // Contar conexões
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
            // Contar conexões
            node.connections++;
            posteriorNode.connections++;
          }
        }
      }
    });

    // Algoritmo de layout simplificado e organizado
    const containerWidth = 1400;
    const containerHeight = 900;
    const margin = 80;
    const popSpacing = 320; // Espaçamento maior entre POPs
    const nodeSpacing = 120; // Espaçamento entre equipamentos

    // 1. Agrupar equipamentos por POP
    const popGroups = {};
    nodes.forEach(node => {
      const popKey = node.pop || 'Não informado';
      if (!popGroups[popKey]) {
        popGroups[popKey] = [];
      }
      popGroups[popKey].push(node);
    });

    // 2. Encontrar equipamento central primeiro (sempre necessário)
    const mostConnectedNode = nodes.reduce((max, node) => 
      node.connections > max.connections ? node : max, nodes[0] || { connections: 0 }
    );

    // 3. Verificar se há posições salvas dos POPs
    const hasSavedPopPositions = Object.keys(popPositions).length > 0;
    
    if (hasSavedPopPositions && isEditMode) {
      // Usar posições salvas dos POPs
      Object.entries(popGroups).forEach(([popKey, popNodes]) => {
        if (popPositions[popKey]) {
          const popCenterX = popPositions[popKey].x;
          const popCenterY = popPositions[popKey].y;
          
          // Manter layout circular dos equipamentos dentro do POP
          const radius = Math.max(60, popNodes.length * 12);
          popNodes.forEach((node, nodeIndex) => {
            if (popNodes.length === 1) {
              node.x = popCenterX;
              node.y = popCenterY;
            } else {
              const angle = (nodeIndex / popNodes.length) * 2 * Math.PI;
              node.x = popCenterX + Math.cos(angle) * radius;
              node.y = popCenterY + Math.sin(angle) * radius;
            }
          });
        }
      });
    } else {
      // 4. Layout em estrela com equipamento central no meio
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      
      // Colocar equipamento central no meio da tela
      mostConnectedNode.x = centerX;
      mostConnectedNode.y = centerY;
      mostConnectedNode.isCentral = true;

    // 4. Organizar outros equipamentos por POP em círculo ao redor do central
    const popKeys = Object.keys(popGroups);
    const centralPop = mostConnectedNode.popGroup;
    const otherPops = popKeys.filter(pop => pop !== centralPop);
    
    // Calcular raio base para distribuição
    const baseRadius = Math.min(containerWidth, containerHeight) * 0.3;
    const angleStep = (2 * Math.PI) / Math.max(otherPops.length, 1);
    
    otherPops.forEach((popKey, popIndex) => {
      const popNodes = popGroups[popKey];
      const angle = popIndex * angleStep;
      const popCenterX = centerX + Math.cos(angle) * baseRadius;
      const popCenterY = centerY + Math.sin(angle) * baseRadius;
      
      // Layout circular para equipamentos do POP
      const radius = Math.max(60, popNodes.length * 12);
      
      popNodes.forEach((node, nodeIndex) => {
        if (popNodes.length === 1) {
          node.x = popCenterX;
          node.y = popCenterY;
    } else {
          const nodeAngle = (nodeIndex / popNodes.length) * 2 * Math.PI;
          node.x = popCenterX + Math.cos(nodeAngle) * radius;
          node.y = popCenterY + Math.sin(nodeAngle) * radius;
        }
        node.popGroup = popKey;
      });
    });

      // 5. Adicionar equipamentos do POP central (exceto o central) em círculo ao redor
      if (centralPop && popGroups[centralPop]) {
        const centralPopNodes = popGroups[centralPop].filter(node => node.id !== mostConnectedNode.id);
        const centralRadius = Math.max(80, centralPopNodes.length * 15);
        
        centralPopNodes.forEach((node, nodeIndex) => {
          const angle = (nodeIndex / centralPopNodes.length) * 2 * Math.PI;
          node.x = centerX + Math.cos(angle) * centralRadius;
          node.y = centerY + Math.sin(angle) * centralRadius;
          node.popGroup = centralPop;
        });
      }
    }

    // 3. Ajustar posições para evitar sobreposição (mais suave)
    const adjustPositions = () => {
      const minDistance = 110;
      const maxIterations = 3;
      
      for (let iter = 0; iter < maxIterations; iter++) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const node1 = nodes[i];
            const node2 = nodes[j];
            
            const dx = node2.x - node1.x;
            const dy = node2.y - node1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance && distance > 0) {
              const separation = (minDistance - distance) / 2;
              const angle = Math.atan2(dy, dx);
              
              // Movimento mais suave
              const factor = 0.3;
              node1.x -= Math.cos(angle) * separation * factor;
              node1.y -= Math.sin(angle) * separation * factor;
              node2.x += Math.cos(angle) * separation * factor;
              node2.y += Math.sin(angle) * separation * factor;
            }
          }
        }
      }
    };

    adjustPositions();

    return { nodes, connections, mostConnectedNode, popGroups };
  }, [equipamentos, popPositions, isEditMode]);

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
    
    // Escolher o ponto mais próximo do ponto de destino
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
              onClick={handleEditModeToggle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${
                isEditMode 
                  ? 'bg-orange-500/80 hover:bg-orange-500' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <FiEdit3 className="w-4 h-4" />
              <span>{isEditMode ? 'Sair da Edição' : 'Editar POPs'}</span>
            </button>
            
            {isEditMode && (
              <>
                <button
                  onClick={handleSavePositions}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500/80 hover:bg-green-500 rounded-lg text-white disabled:opacity-50"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
                </button>
                
                <button
                  onClick={handleResetPositions}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white"
                >
                  <FiX className="w-4 h-4" />
                  <span>Resetar</span>
                </button>
              </>
            )}
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            >
              {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
              <span>{isFullscreen ? 'Sair' : 'Tela Cheia'}</span>
            </button>
          </div>
        </div>

        {/* Mapa de topologia */}
        <div 
          id="topology-container"
          className={`bg-white/95 backdrop-blur-custom rounded-xl border border-purple-100 shadow-lg relative overflow-hidden topology-bg ${
            isFullscreen ? 'fixed inset-4 z-50' : ''
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${
            isEditMode ? 'ring-2 ring-orange-400 ring-opacity-50' : ''
          }`}
          style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : '600px' }}
        >
          {/* Indicador de modo de edição */}
          {isEditMode && (
            <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
              Modo de Edição - Arraste os POPs
            </div>
          )}
          {/* SVG para conexões e linhas de nível */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {/* Divisões por POP - Visual simplificado */}
            {Object.entries(topologiaData.popGroups || {}).map(([popKey, popNodes], popIndex) => {
              if (popNodes.length === 0) return null;
              
              // Calcular centro do POP
              const centerX = popNodes.reduce((sum, n) => sum + n.x, 0) / popNodes.length;
              const centerY = popNodes.reduce((sum, n) => sum + n.y, 0) / popNodes.length;
              const radius = Math.max(100, popNodes.length * 20);
              
              return (
                <g key={`pop-${popKey}`}>
                  {/* Círculo de fundo do POP - arrastável no modo de edição */}
                  <circle
                    cx={centerX * zoom + pan.x}
                    cy={centerY * zoom + pan.y}
                    r={radius * zoom}
                    fill={isEditMode ? "rgba(125, 38, 217, 0.15)" : "rgba(125, 38, 217, 0.08)"}
                    stroke={isEditMode ? "rgba(125, 38, 217, 0.6)" : "rgba(125, 38, 217, 0.3)"}
                    strokeWidth={isEditMode ? "3" : "2"}
                    strokeDasharray="8,4"
                    style={{ 
                      cursor: isEditMode ? 'move' : 'default',
                      pointerEvents: isEditMode ? 'all' : 'none'
                    }}
                    onMouseDown={(e) => handlePopDragStart(e, popKey)}
                  />
                  
                  {/* Label do POP na parte superior */}
                  <text
                    x={centerX * zoom + pan.x}
                    y={centerY * zoom + pan.y - radius * zoom - 15}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#7d26d9"
                    fontWeight="600"
                    style={{ 
                      textShadow: '1px 1px 2px rgba(255,255,255,0.9)',
                      pointerEvents: 'none'
                    }}
                  >
                    {popKey}
                  </text>
                  
                  {/* Contador de equipamentos */}
                  <text
                    x={centerX * zoom + pan.x}
                    y={centerY * zoom + pan.y - radius * zoom - 5}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#7d26d9"
                    fontWeight="500"
                    style={{ pointerEvents: 'none' }}
                  >
                    {popNodes.length} equipamento{popNodes.length > 1 ? 's' : ''}
                  </text>
                </g>
              );
            })}
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
              <marker
                id="arrowhead-bidirectional"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#7d26d9"
                  opacity="0.6"
                />
              </marker>
            </defs>

            {topologiaData.connections.map(connection => {
              const fromNode = topologiaData.nodes.find(n => n.id === connection.from);
              const toNode = topologiaData.nodes.find(n => n.id === connection.to);
              
              if (!fromNode || !toNode) return null;

              // Calcular posições com zoom e pan
              const fromX = fromNode.x * zoom + pan.x;
              const fromY = fromNode.y * zoom + pan.y;
              const toX = toNode.x * zoom + pan.x;
              const toY = toNode.y * zoom + pan.y;

              // Raio do equipamento (50px = metade do tamanho do card 100px)
              const nodeRadius = 50;

              // Calcular pontos de interseção com as bordas dos equipamentos
              const fromIntersection = getLineIntersection(
                toX, toY, fromX, fromY, 
                fromX, fromY, nodeRadius
              );
              
              const toIntersection = getLineIntersection(
                fromX, fromY, toX, toY, 
                toX, toY, nodeRadius
              );

              // Ajustar a seta para ficar exatamente na borda do equipamento de destino
              const arrowLength = 8;
              const dx = toIntersection.x - fromIntersection.x;
              const dy = toIntersection.y - fromIntersection.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > 0) {
                const unitX = dx / distance;
                const unitY = dy / distance;
                
                // Mover a seta para dentro da borda
                const adjustedToX = toIntersection.x - (unitX * arrowLength);
                const adjustedToY = toIntersection.y - (unitY * arrowLength);
                
                toIntersection.x = adjustedToX;
                toIntersection.y = adjustedToY;
              }

              // Calcular ângulo da linha para a seta
              const angle = Math.atan2(toIntersection.y - fromIntersection.y, toIntersection.x - fromIntersection.x);

              return (
                <g key={connection.id}>
                  {/* Linha de conexão simplificada */}
                  <line
                    x1={fromIntersection.x}
                    y1={fromIntersection.y}
                    x2={toIntersection.x}
                    y2={toIntersection.y}
                    stroke="#7d26d9"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    opacity="0.7"
                    markerEnd="url(#arrowhead)"
                  />
                </g>
              );
            })}
          </svg>

          {/* Equipamentos */}
            {topologiaData.nodes.map(node => {
              const isMostConnected = topologiaData.mostConnectedNode?.id === node.id;
              const isRoot = !node.equipamentoAnterior;
              const isLeaf = !node.equipamentoPosterior;
              const isCentral = node.isCentral;
              
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedEquipment(node)}
                  className={`absolute transition-all duration-300 cursor-pointer hover:scale-105 ${
                    isMostConnected ? 'ring-4 ring-purple-400 ring-opacity-60' : ''
                  }`}
                  style={{
                    left: node.x * zoom + pan.x - 50,
                    top: node.y * zoom + pan.y - 50,
                    width: '100px',
                    height: '100px',
                    zIndex: isMostConnected ? 3 : 2
                  }}
                >
                <div
                  className="bg-white rounded-xl border-2 shadow-lg p-2 h-full flex flex-col items-center justify-center text-center relative overflow-hidden"
                  style={{
                    borderColor: isCentral ? '#7d26d9' : getStatusColor(node.status),
                    borderWidth: isCentral ? '3px' : '2px',
                    background: isCentral 
                      ? 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)'
                      : isMostConnected 
                        ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                  }}
                >
                  
                  {/* Indicador de tipo de nó */}
                  <div className="absolute top-1 right-1">
                    {isRoot && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="Nó Raiz"></div>
                    )}
                    {isLeaf && !isRoot && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" title="Nó Folha"></div>
                    )}
                    {!isRoot && !isLeaf && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full" title="Nó Intermediário"></div>
                    )}
                  </div>
                  
                  {/* Ícone do equipamento */}
                  <div className="text-lg mb-1">
                    {getEquipmentIcon(node.tipo)}
                  </div>
                  
                  {/* Nome do equipamento */}
                  <div 
                    className="font-bold text-gray-800 mb-1 leading-tight text-center"
                    style={{ fontSize: '10px' }}
                    title={node.nome}
                  >
                    {node.nome}
                  </div>
                  
                  {/* IP */}
                  <div 
                    className="text-gray-600 font-mono mb-1 bg-gray-100 px-1 py-0.5 rounded text-center"
                    style={{ fontSize: '7px' }}
                    title={node.ipPrivado || node.ipPublico || 'Sem IP'}
                  >
                    {node.ipPrivado || node.ipPublico || 'Sem IP'}
                  </div>
                  
                  {/* Status */}
                  <div 
                    className="text-xs font-semibold mb-1 px-1.5 py-0.5 rounded-full"
                    style={{ 
                      color: getStatusColor(node.status),
                      backgroundColor: `${getStatusColor(node.status)}20`
                    }}
                  >
                    {getStatusText(node.status)}
                  </div>
                  
                  {/* Indicador de conexões */}
                  {node.connections > 0 && (
                    <div className="text-xs text-purple-600 font-medium bg-purple-100 px-1.5 py-0.5 rounded-full">
                      {node.connections} conexão{node.connections > 1 ? 'ões' : ''}
                    </div>
                  )}
                  
                  {/* Indicador de equipamento central */}
                  {isCentral && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                      CENTRAL
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Legenda */}
          <div className="absolute top-4 right-4 bg-white/95 rounded-xl p-3 shadow-xl z-10 max-w-44">
            <h4 className="text-xs font-bold text-gray-800 mb-3">Legenda</h4>
            
            {/* Status dos equipamentos */}
            <div className="mb-3">
              <h5 className="text-xs font-semibold text-gray-600 mb-1">Status</h5>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-gray-700">Atenção</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-700">Offline</span>
                </div>
              </div>
            </div>

            {/* Tipos de nós */}
            <div className="mb-3">
              <h5 className="text-xs font-semibold text-gray-600 mb-1">Tipos de Nós</h5>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-700">Nó Raiz</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-xs text-gray-700">Intermediário</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-700">Nó Folha</span>
                </div>
              </div>
            </div>

            {/* Conexões */}
            <div className="mb-3">
              <h5 className="text-xs font-semibold text-gray-600 mb-1">Conexões</h5>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-0.5 bg-purple-500 relative">
                    <div className="absolute right-0 top-0 w-0 h-0 border-l-4 border-l-purple-500 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                  </div>
                  <span className="text-xs text-gray-700">Conexão</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-purple-400 rounded-2xl"></div>
                  <span className="text-xs text-gray-700">Equipamento Central</span>
                </div>
              </div>
            </div>

            {/* POPs */}
            <div>
              <h5 className="text-xs font-semibold text-gray-600 mb-1">POPs</h5>
              <div className="space-y-1">
                {Object.keys(topologiaData.popGroups || {}).map((popKey, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-xs text-gray-700 truncate" title={popKey}>
                      {popKey.length > 15 ? `${popKey.substring(0, 15)}...` : popKey}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({topologiaData.popGroups[popKey]?.length || 0})
                    </span>
                  </div>
                ))}
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

          {/* Instruções de navegação */}
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
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getEquipmentIcon(selectedEquipment.tipo)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedEquipment.nome}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedEquipment.fabricante} {selectedEquipment.modelo}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEquipment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700">IP Privado</label>
                  <p className="text-sm text-gray-900 font-mono">
                    {selectedEquipment.ipPrivado || 'Não informado'}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-700">IP Público</label>
                  <p className="text-sm text-gray-900 font-mono">
                    {selectedEquipment.ipPublico || 'Não informado'}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-700">POP</label>
                  <p className="text-sm text-gray-900">
                    {selectedEquipment.pop}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-700">Status</label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(selectedEquipment.status) }}
                    ></div>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: getStatusColor(selectedEquipment.status) }}
                    >
                      {getStatusText(selectedEquipment.status)}
                    </span>
                  </div>
                </div>

                {selectedEquipment.equipamentoAnterior && (
                  <div>
                    <label className="text-xs font-bold text-gray-700">Equipamento Anterior</label>
                    <p className="text-sm text-gray-900">
                      {selectedEquipment.equipamentoAnterior}
                    </p>
                  </div>
                )}

                {selectedEquipment.equipamentoPosterior && (
                  <div>
                    <label className="text-xs font-bold text-gray-700">Equipamento Posterior</label>
                    <p className="text-sm text-gray-900">
                      {selectedEquipment.equipamentoPosterior}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TopologiaRede;