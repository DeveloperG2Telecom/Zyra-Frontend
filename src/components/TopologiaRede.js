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
  const [edgeLabels, setEdgeLabels] = useState({});
  const [savedPositions, setSavedPositions] = useState({}); // Posições salvas dos POPs
  const [isDraggingPop, setIsDraggingPop] = useState(false);
  const [draggedPopIndex, setDraggedPopIndex] = useState(null);
  const [draggedPopName, setDraggedPopName] = useState(null); // Nome do POP sendo arrastado
  const [dragPopStart, setDragPopStart] = useState({ x: 0, y: 0 });
  
  // Refs para controle de animações
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // Usar hook de equipamentos
  const { equipamentos, loading, error, loadEquipamentos, updateEquipamento, refreshEquipamentos } = useEquipamentos();

  // Carregar equipamentos apenas se não há dados (sem limite)
  useEffect(() => {
    if (equipamentos.length === 0 && !loading) {
      loadEquipamentos({}, 1, 'all');
    }
  }, []);

  // Layout simples - sem necessidade de carregar posições salvas

  // Layout simples - sem funções de edição complexas

  // Carregar etiquetas de conexões do Firebase
  useEffect(() => {
    const loadEdgeLabels = async () => {
      try {
        console.log('🔍 TOPOLOGIA: Carregando etiquetas das conexões do Firebase...');
        const response = await api.getTopologiaConexoes();
        if (response.success && response.data) {
          setEdgeLabels(response.data);
          console.log('✅ TOPOLOGIA: Etiquetas carregadas:', Object.keys(response.data).length);
        }
      } catch (error) {
        console.error('❌ TOPOLOGIA: Erro ao carregar etiquetas:', error);
        // Em caso de erro, continua sem etiquetas
      }
    };
    loadEdgeLabels();
  }, []);

  // Carregar posições salvas dos POPs do Firebase
  useEffect(() => {
    const loadSavedPositions = async () => {
      try {
        console.log('🔍 TOPOLOGIA: Carregando posições salvas dos POPs...');
        const response = await api.getTopologiaPosicoes();
        if (response.success && response.data) {
          setSavedPositions(response.data);
          console.log('✅ TOPOLOGIA: Posições carregadas:', Object.keys(response.data).length);
        }
      } catch (error) {
        console.error('❌ TOPOLOGIA: Erro ao carregar posições:', error);
        // Em caso de erro, continua sem posições salvas
      }
    };
    loadSavedPositions();
  }, []);

  // Salvar etiqueta no Firebase
  const saveEdgeLabel = useCallback(async (edgeId, text) => {
    // Atualizar estado local imediatamente (otimista)
    setEdgeLabels(prev => {
      const next = { ...prev, [edgeId]: text };
      return next;
    });

    // Salvar no Firebase
    try {
      console.log(`💾 TOPOLOGIA: Salvando etiqueta para conexão ${edgeId}:`, text);
      const response = await api.saveTopologiaConexaoLabel(edgeId, text);
      if (response.success) {
        console.log('✅ TOPOLOGIA: Etiqueta salva com sucesso');
      } else {
        console.error('❌ TOPOLOGIA: Falha ao salvar etiqueta:', response.error);
      }
    } catch (error) {
      console.error('❌ TOPOLOGIA: Erro ao salvar etiqueta no Firebase:', error);
      // Reverter mudança local se falhar
      setEdgeLabels(prev => {
        const next = { ...prev };
        delete next[edgeId];
        return next;
      });
    }
  }, []);

  // Handlers simples de zoom e pan via props do container
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev * delta)));
  }, []);

  const handleMouseDown = useCallback((e) => {
    // Verificar se está clicando em um POP (caixa do POP, não equipamento)
    const popElement = e.target.closest('[data-pop]');
    if (popElement) {
      const popIndex = parseInt(popElement.getAttribute('data-pop'), 10);
      const popName = popElement.getAttribute('data-pop-name');
      if (!isNaN(popIndex) && popName) {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingPop(true);
        setDraggedPopIndex(popIndex);
        setDraggedPopName(popName);
        const rect = popElement.getBoundingClientRect();
        setDragPopStart({ 
          x: e.clientX - (rect.left + rect.width / 2), 
          y: e.clientY - (rect.top + rect.height / 2) 
        });
        return;
      }
    }
    
    // Verificar se está clicando em um equipamento
    if (e.target.closest('[data-equipment]')) return;
    
    // Caso contrário, arrastar a view inteira
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan.x, pan.y]);

  const handleMouseMove = useCallback((e) => {
    // Se está arrastando um POP
    if (isDraggingPop && draggedPopIndex !== null && draggedPopName) {
      e.preventDefault();
      e.stopPropagation();
      
      // Calcular nova posição esperando zoom e pan
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const svgX = (e.clientX - containerRect.left - pan.x) / zoom;
        const svgY = (e.clientY - containerRect.top - pan.y) / zoom;
        
        // Atualizar posição no estado
        setSavedPositions(prev => ({
          ...prev,
          [draggedPopName]: { 
            x: svgX - dragPopStart.x, 
            y: svgY - dragPopStart.y 
          }
        }));
      }
      return;
    }
    
    // Se está arrastando a view inteira
    if (!isDragging) return;
    e.preventDefault();
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, isDraggingPop, draggedPopIndex, draggedPopName, dragStart.x, dragStart.y, dragPopStart.x, dragPopStart.y, pan.x, pan.y, zoom]);

  const handleMouseUp = useCallback(async () => {
    // Se estava arrastando um POP, salvar posição
    if (isDraggingPop && draggedPopIndex !== null && draggedPopName) {
      const currentPos = savedPositions[draggedPopName];
      
      if (currentPos) {
        try {
          await api.updateTopologiaPosicao(draggedPopName, currentPos.x, currentPos.y);
          console.log(`✅ TOPOLOGIA: Posição do POP ${draggedPopName} salva:`, { x: currentPos.x, y: currentPos.y });
        } catch (error) {
          console.error(`❌ TOPOLOGIA: Erro ao salvar posição do POP ${draggedPopName}:`, error);
        }
      }
      
      setIsDraggingPop(false);
      setDraggedPopIndex(null);
      setDraggedPopName(null);
    }
    
    // Se estava arrastando a view
    if (!isDragging) return;
    setIsDragging(false);
  }, [isDragging, isDraggingPop, draggedPopIndex, draggedPopName, savedPositions]);

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

      const popWidth = Math.max(500, cols * nodeSpacing + popPadding * 2);
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

    // Criar mapa de conexões e hierarquia baseada em equipamento anterior
    const nodeIdToPop = new Map();
    pops.forEach(pop => {
      pop.equipamentos.forEach(eq => nodeIdToPop.set(eq.id, pop));
    });

    // Mapear equipamento anterior para cada nó
    const nodeToPreviousNode = new Map();
    nodes.forEach(node => {
      if (node.equipamentoAnterior) {
        const previousNode = nodes.find(n => 
          n.nome === node.equipamentoAnterior || 
          n.id === node.equipamentoAnterior
        );
        if (previousNode) {
          nodeToPreviousNode.set(node.id, previousNode.id);
        }
      }
    });

    // PRIMEIRO: Mapear conexões diretas entre POPs através de conexões de equipamentos
    const popDirectConnections = new Map();
    pops.forEach((pop, index) => {
      popDirectConnections.set(index, new Set());
    });
    
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      if (!fromNode || !toNode) return;
      
      const fromPop = nodeIdToPop.get(fromNode.id);
      const toPop = nodeIdToPop.get(toNode.id);
      
      if (fromPop && toPop && fromPop !== toPop) {
        const fromPopIndex = pops.indexOf(fromPop);
        const toPopIndex = pops.indexOf(toPop);
        if (fromPopIndex >= 0 && toPopIndex >= 0) {
          popDirectConnections.get(fromPopIndex).add(toPopIndex);
          popDirectConnections.get(toPopIndex).add(fromPopIndex);
        }
      }
    });

    // Calcular níveis hierárquicos (distância do POP central)
    // Nível 0 = POP central (Torre Miracema)
    // Nível 1 = POPs conectados diretamente ao central (através de conexões OU equipamento anterior)
    // Nível 2 = POPs conectados aos de nível 1, etc.
    const popLevels = new Map();
    const MAX_LEVEL = 5; // Limite máximo de níveis
    
    // Encontrar POP central
    const centralPopIndex = pops.findIndex(pop => 
      pop.nome.toLowerCase().includes('torre miracema') || 
      pop.nome.toLowerCase().includes('miracema')
    );
    
    if (centralPopIndex >= 0) {
      const centralPop = pops[centralPopIndex];
      // Nível 0: POP central
      popLevels.set(centralPopIndex, 0);
      
      // Busca em largura (BFS) para determinar níveis
      const queue = [centralPopIndex];
      const visited = new Set([centralPopIndex]);
      
      while (queue.length > 0) {
        const currentPopIndex = queue.shift();
        const currentLevel = popLevels.get(currentPopIndex) || 0;
        
        // Encontrar POPs conectados através de equipamentos
        const currentPop = pops[currentPopIndex];
        const connectedPops = new Set();
        
        // 1. Usar conexões diretas entre POPs (através de conexões de equipamentos)
        const directConnections = popDirectConnections.get(currentPopIndex);
        if (directConnections) {
          directConnections.forEach(connectedIndex => {
            if (!visited.has(connectedIndex)) {
              connectedPops.add(connectedIndex);
            }
          });
        }
        
        // 2. Verificar todos os equipamentos do POP atual
        currentPop.equipamentos.forEach(equipamento => {
          // Encontrar equipamentos que têm este como anterior
          nodes.forEach(node => {
            if (nodeToPreviousNode.get(node.id) === equipamento.id) {
              const connectedPop = nodeIdToPop.get(node.id);
              if (connectedPop && connectedPop !== currentPop) {
                const connectedPopIndex = pops.indexOf(connectedPop);
                if (connectedPopIndex >= 0 && !visited.has(connectedPopIndex)) {
                  connectedPops.add(connectedPopIndex);
                }
              }
            }
            
            // Também verificar se o equipamento atual tem um anterior
            if (equipamento.equipamentoAnterior) {
              const previousNode = nodes.find(n => 
                n.nome === equipamento.equipamentoAnterior || 
                n.id === equipamento.equipamentoAnterior
              );
              if (previousNode) {
                const previousPop = nodeIdToPop.get(previousNode.id);
                if (previousPop && previousPop !== currentPop) {
                  const previousPopIndex = pops.indexOf(previousPop);
                  if (previousPopIndex >= 0 && !visited.has(previousPopIndex)) {
                    connectedPops.add(previousPopIndex);
                  }
                }
              }
            }
          });
        });
        
        // Atribuir níveis e adicionar à fila
        connectedPops.forEach(popIndex => {
          if (!popLevels.has(popIndex)) {
            popLevels.set(popIndex, currentLevel + 1);
            queue.push(popIndex);
            visited.add(popIndex);
          }
        });
      }
    }
    
    // POPs não visitados recebem nível máximo limitado
    pops.forEach((pop, index) => {
      if (!popLevels.has(index)) {
        popLevels.set(index, MAX_LEVEL); // Nível máximo limitado
      }
    });


    // Configuração do sistema solar
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const ORBIT_BASE_RADIUS = 350; // Raio da primeira órbita
    const ORBIT_SPACING = 280; // Espaçamento entre órbitas (reduzido para evitar distâncias muito grandes)
    const MAX_ORBIT_RADIUS = 2000; // Raio máximo da órbita (limite para evitar POPs muito distantes)

    // Calcular dimensões de cada POP primeiro
    pops.forEach(pop => {
      const equipamentosCount = pop.equipamentos.length;
      if (equipamentosCount === 0) {
        pop.width = 220;
        pop.height = 180;
        return;
      }
      const cols = Math.max(1, Math.ceil(Math.sqrt(equipamentosCount)));
      const rows = Math.max(1, Math.ceil(equipamentosCount / cols));
      // Aumentar largura mínima para caber melhor o título
      pop.width = Math.max(500, cols * nodeSpacing + popPadding * 2);
      pop.height = Math.max(180, rows * nodeSpacing + popPadding * 2);
    });

    // Posicionar POP central
    if (centralPopIndex >= 0) {
      const centralPop = pops[centralPopIndex];
      centralPop.x = centerX - centralPop.width / 2;
      centralPop.y = centerY - centralPop.height / 2;
    }

    // Constantes de layout
    const MIN_PADDING = 150;
    const RADIAL_RADIUS = 600;
    const EXTERNAL_RADIUS = RADIAL_RADIUS + 500;
    const MAX_ATTEMPTS = 30;
    const RADIUS_INCREMENT = 100;

    // Função para verificar colisão entre POPs
    const checkCollision = (x, y, width, height, existingPops, minPadding = MIN_PADDING) => {
      for (const existingPop of existingPops) {
        if (!existingPop.x || !existingPop.y) continue;
        
        const expandedX1 = x - minPadding;
        const expandedY1 = y - minPadding;
        const expandedRight1 = x + width + minPadding;
        const expandedBottom1 = y + height + minPadding;
        
        const expandedX2 = existingPop.x - minPadding;
        const expandedY2 = existingPop.y - minPadding;
        const expandedRight2 = existingPop.x + existingPop.width + minPadding;
        const expandedBottom2 = existingPop.y + existingPop.height + minPadding;
        
        if (!(expandedRight1 < expandedX2 || expandedRight2 < expandedX1 || 
              expandedBottom1 < expandedY2 || expandedBottom2 < expandedY1)) {
          return true;
        }
      }
      return false;
    };

    // Função auxiliar para posicionar POP evitando colisão
    const placePopAvoidingCollision = (pop, angle, startDistance, placedPops) => {
      let attemptDistance = startDistance;
      let finalAngle = angle;
      let attempts = 0;
      
      // RI Limitar distância máxima para evitar POPs muito distantes
      const maxDistance = Math.min(startDistance + (MAX_ATTEMPTS * RADIUS_INCREMENT), MAX_ORBIT_RADIUS);
      
      while (attempts < MAX_ATTEMPTS) {
        // Limitar distância para não ultrapassar o máximo
        const clampedDistance = Math.min(attemptDistance, maxDistance);
        const testX = centerX + Math.cos(finalAngle) * clampedDistance - pop.width / 2;
        const testY = centerY + Math.sin(finalAngle) * clampedDistance - pop.height / 2;
        
        if (!checkCollision(testX, testY, pop.width, pop.height, placedPops, MIN_PADDING)) {
          pop.x = testX;
          pop.y = testY;
          placedPops.push(pop);
          return;
        }
        
        attempts++;
        // Incremento menor para evitar empurrar muito longe
        attemptDistance += Math.min(RADIUS_INCREMENT, 80);
        if (attempts % 3 === 0) {
          // Ajustar ângulo para tentar outra posição
          finalAngle += 0.3;
        }
        
        // Se atingiu o limite de distância, parar
        if (attemptDistance >= maxDistance) break;
      }
      
      // Fallback: colocar na posição final (limitada)
      const finalDistance = Math.min(attemptDistance, maxDistance);
      pop.x = centerX + Math.cos(angle) * finalDistance - pop.width / 2;
      pop.y = centerY + Math.sin(angle) * finalDistance - pop.height / 2;
      placedPops.push(pop);
    };

    // Layout tipo sistema solar: cada POP orbita ao redor do POP que contém seu equipamento anterior ou está conectado
    const placedPops = centralPopIndex >= 0 ? [pops[centralPopIndex]] : [];
    
    // Identificar POPs conectados DIRETAMENTE ao POP central (primeiro estágio radial)
    // IMPORTANTE: Apenas POPs de nível 1 devem estar aqui
    const popsConnectedToCentral = new Set();
    if (centralPopIndex >= 0) {
      // Verificar conexões diretas E garantir que sejam nível 1
      const centralConnections = popDirectConnections.get(centralPopIndex);
      if (centralConnections) {
        centralConnections.forEach(connectedPopIndex => {
          const level = popLevels.get(connectedPopIndex);
          if (level === 1) {
            popsConnectedToCentral.add(connectedPopIndex);
          }
        });
      }
      
      // Também verificar POPs de nível 1 através de equipamento anterior no POP central
      popLevels.forEach((level, popIndex) => {
        if (level === 1 && popIndex !== centralPopIndex) {
          const pop = pops[popIndex];
          pop.equipamentos.forEach(equipamento => {
            if (equipamento.equipamentoAnterior) {
              const previousNode = nodes.find(n => 
                n.nome === equipamento.equipamentoAnterior || 
                n.id === equipamento.equipamentoAnterior
              );
              if (previousNode) {
                const previousPop = nodeIdToPop.get(previousNode.id);
                if (previousPop && pops.indexOf(previousPop) === centralPopIndex) {
                  popsConnectedToCentral.add(popIndex);
                }
              }
            }
          });
        }
      });
    }
    
    // 3. Mapear qual POP é "pai" de cada POP baseado em:
    //    - Conexões diretas ao POP central (prioridade máxima - primeiro estágio)
    //    - Equipamento anterior em outro POP
    const popToParentPop = new Map();
    pops.forEach((pop, popIndex) => {
      if (popIndex === centralPopIndex) return; // POP central não tem pai
      
      // PRIORIDADE 1: Se está conectado diretamente ao POP central, pai é o central
      if (popsConnectedToCentral.has(popIndex)) {
        popToParentPop.set(popIndex, centralPopIndex);
        return;
      }
      
      // PRIORIDADE 2: Verificar equipamento anterior em outro POP
      pop.equipamentos.forEach(equipamento => {
        if (equipamento.equipamentoAnterior) {
          const previousNode = nodes.find(n => 
            n.nome === equipamento.equipamentoAnterior || 
            n.id === equipamento.equipamentoAnterior
          );
          
          if (previousNode) {
            const parentPop = nodeIdToPop.get(previousNode.id);
            if (parentPop && parentPop !== pop) {
              const parentPopIndex = pops.indexOf(parentPop);
              if (parentPopIndex >= 0) {
                // Este POP tem um pai - o POP que contém o equipamento anterior
                popToParentPop.set(popIndex, parentPopIndex);
                return; // Uma relação de pai já é suficiente
              }
            }
          }
        }
      });
      
      // PRIORIDADE 3: Se não tem equipamento anterior mas tem conexão direta, usar a primeira conexão
      if (!popToParentPop.has(popIndex)) {
        const directConnections = popDirectConnections.get(popIndex);
        if (directConnections && directConnections.size > 0) {
          // Pegar a primeira conexão (priorizar central se existir)
          let parentIdx = null;
          if (directConnections.has(centralPopIndex)) {
            parentIdx = centralPopIndex;
          } else {
            // Pegar o primeiro POP conectado que já foi processado ou é o central
            for (const connectedIdx of directConnections) {
              if (connectedIdx === centralPopIndex || placedPops.includes(pops[connectedIdx])) {
                parentIdx = connectedIdx;
                break;
              }
            }
          }
          if (parentIdx !== null && parentIdx >= 0) {
            popToParentPop.set(popIndex, parentIdx);
          }
        }
      }
    });
    
    // Função para posicionar POP ao redor do seu pai (ou do centro se não tiver pai)
    const positionPopAroundParent = (popIndex, parentPopIndex) => {
      const pop = pops[popIndex];
      let parentPop, parentCenterX, parentCenterY;
      
      if (parentPopIndex !== null && parentPopIndex >= 0 && placedPops.includes(pops[parentPopIndex])) {
        // Posicionar ao redor do POP pai
        parentPop = pops[parentPopIndex];
        parentCenterX = parentPop.x + parentPop.width / 2;
        parentCenterY = parentPop.y + parentPop.height / 2;
      } else {
        // Posicionar ao redor do centro (ou POP central se existir)
        parentCenterX = centerX;
        parentCenterY = centerY;
        parentPop = null;
      }
      
      // IMPORTANTE: Usar o nível hierárquico calculado para determinar a distância
      // POPs de nível 1 ficam no primeiro estágio, nível 2 no segundo, etc.
      const level = popLevels.get(popIndex) || MAX_LEVEL;
      
      // Calcular raio da órbita baseado no nível hierárquico
      let orbitRadius;
      
      if (level === 1 && parentPopIndex === centralPopIndex) {
        // POPs de nível 1 conectados diretamente ao central: primeiro estágio radial
        orbitRadius = ORBIT_BASE_RADIUS;
      } else if (level === 1) {
        // POPs de nível 1 mas não conectados diretamente ao central (caso raro)
        orbitRadius = ORBIT_BASE_RADIUS;
      } else if (parentPop && parentPopIndex !== centralPopIndex) {
        // POPs de nível 2+: orbitar ao redor do pai com distância baseada no nível
        const parentLevel = popLevels.get(parentPopIndex) || 0;
        const parentSize = Math.max(parentPop.width, parentPop.height);
        // Raio do pai + espaçamento baseado no nível
        orbitRadius = parentSize / 2 + (level - parentLevel) * ORBIT_SPACING;
      } else {
        // Fallback: usar nível hierárquico para calcular distância do centro
        orbitRadius = ORBIT_BASE_RADIUS + ((level - 1) * ORBIT_SPACING);
      }
      
      // Garantir que POPs de nível 2+ não fiquem muito próximos
      if (level >= 2 && orbitRadius < ORBIT_BASE_RADIUS + ORBIT_SPACING) {
        orbitRadius = ORBIT_BASE_RADIUS + ((level - 1) * ORBIT_SPACING);
      }
      
      // Limitar raio máximo
      orbitRadius = Math.min(orbitRadius, MAX_ORBIT_RADIUS);
      
      // Encontrar quantos POPs filhos o pai já tem (para distribuição angular)
      const siblings = [];
      popToParentPop.forEach((parentIdx, childIdx) => {
        if (parentIdx === parentPopIndex || (parentPopIndex === null && !popToParentPop.has(childIdx))) {
          if (childIdx !== popIndex && placedPops.includes(pops[childIdx])) {
            siblings.push(childIdx);
          }
        }
      });
      
      // Calcular ângulo baseado na posição entre irmãos
      const siblingIndex = siblings.length;
      const totalSiblings = siblings.length + 1; // +1 para incluir o POP atual
      const baseAngle = (siblingIndex / Math.max(1, totalSiblings)) * 2 * Math.PI - Math.PI / 2;
      
      // Posicionar usando o centro do pai como referência
      const testX = parentCenterX + Math.cos(baseAngle) * orbitRadius - pop.width / 2;
      const testY = parentCenterY + Math.sin(baseAngle) * orbitRadius - pop.height / 2;
      
      // Ajustar para evitar colisão
      if (!checkCollision(testX, testY, pop.width, pop.height, placedPops, MIN_PADDING)) {
        pop.x = testX;
        pop.y = testY;
      } else {
        // Usar função de colisão com centro do pai como referência
        placePopAroundCenter(pop, baseAngle, orbitRadius, parentCenterX, parentCenterY, placedPops);
      }
      
      placedPops.push(pop);
    };
    
    // Função auxiliar para posicionar POP ao redor de um centro específico
    const placePopAroundCenter = (pop, angle, startDistance, centerRefX, centerRefY, placedPops) => {
      let attemptDistance = startDistance;
      let finalAngle = angle;
      let attempts = 0;
      const maxDistance = Math.min(startDistance + (MAX_ATTEMPTS * 80), MAX_ORBIT_RADIUS);
      
      while (attempts < MAX_ATTEMPTS) {
        const clampedDistance = Math.min(attemptDistance, maxDistance);
        const testX = centerRefX + Math.cos(finalAngle) * clampedDistance - pop.width / 2;
        const testY = centerRefY + Math.sin(finalAngle) * clampedDistance - pop.height / 2;
        
        if (!checkCollision(testX, testY, pop.width, pop.height, placedPops, MIN_PADDING)) {
          pop.x = testX;
          pop.y = testY;
          return;
        }
        
        attempts++;
        attemptDistance += 80;
        if (attempts % 3 === 0) {
          finalAngle += 0.3;
        }
        if (attemptDistance >= maxDistance) break;
      }
      
      const finalDistance = Math.min(attemptDistance, maxDistance);
      pop.x = centerRefX + Math.cos(angle) * finalDistance - pop.width / 2;
      pop.y = centerRefY + Math.sin(angle) * finalDistance - pop.height / 2;
    };
    
    // Posicionar POPs em ordem hierárquica (filhos depois dos pais)
    // PRIORIDADE 1: POPs conectados diretamente ao central (primeiro estágio radial)
    // PRIORIDADE 2: POPs filhos dos POPs do primeiro estágio
    // PRIORIDADE 3: POPs restantes
    
    const queue = [];
    const processed = new Set();
    
    // Adicionar POP central à fila primeiro
    if (centralPopIndex >= 0) {
      queue.push(centralPopIndex);
      processed.add(centralPopIndex);
    }
    
    // PRIMEIRO: Processar todos os POPs conectados diretamente ao central
    const centralChildren = [];
    popToParentPop.forEach((parentIdx, childIdx) => {
      if (parentIdx === centralPopIndex && !processed.has(childIdx)) {
        centralChildren.push(childIdx);
      }
    });
    
    // Posicionar POPs do primeiro estágio radial ao redor do central
    centralChildren.forEach(childIndex => {
      positionPopAroundParent(childIndex, centralPopIndex);
      processed.add(childIndex);
      queue.push(childIndex);
    });
    
    // SEGUNDO: Processar POPs restantes em ordem BFS (filhos depois dos pais)
    while (queue.length > 0) {
      const currentPopIndex = queue.shift();
      
      // Encontrar todos os POPs filhos deste POP (POPs que têm este como pai)
      const children = [];
      popToParentPop.forEach((parentIdx, childIdx) => {
        if (parentIdx === currentPopIndex && !processed.has(childIdx)) {
          children.push(childIdx);
        }
      });
      
      // Posicionar cada filho ao redor do pai atual
      children.forEach(childIndex => {
        positionPopAroundParent(childIndex, currentPopIndex);
        processed.add(childIndex);
        queue.push(childIndex);
      });
    }
    
    // TERCEIRO: Processar POPs restantes que não foram conectados à hierarquia
    pops.forEach((pop, index) => {
      if (!processed.has(index)) {
        const parentIdx = popToParentPop.get(index);
        // Se não tem pai definido, tentar usar o central como referência
        positionPopAroundParent(index, parentIdx !== undefined ? parentIdx : (centralPopIndex >= 0 ? centralPopIndex : null));
      }
    });

    // Aplicar posições salvas antes de posicionar equipamentos
    pops.forEach((pop, index) => {
      const popKey = pop.nome || `pop_${index}`;
      const savedPos = savedPositions[popKey];
      if (savedPos && typeof savedPos.x === 'number' && typeof savedPos.y === 'number') {
        pop.x = savedPos.x;
        pop.y = savedPos.y;
      } else if (!pop.x || !pop.y) {
        pop.x = centerX;
        pop.y = centerY;
      }
    });

    // Posicionar equipamentos dentro de cada POP
    pops.forEach((pop) => {
      
      const equipamentosCount = pop.equipamentos.length;
      if (equipamentosCount === 0) return;

      const cols = Math.max(1, Math.ceil(Math.sqrt(equipamentosCount)));
      const rows = Math.max(1, Math.ceil(equipamentosCount / cols));

      pop.equipamentos.forEach((equipamento, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        equipamento.x = pop.x + popPadding + col * nodeSpacing;
        equipamento.y = pop.y + popPadding + row * nodeSpacing;
      });
    });

    // Recalcular direção média das conexões externas por POP (para setas)

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
  }, [equipamentos, savedPositions]);

  // Função para verificar se uma linha intersecta um retângulo (POP)
  const lineIntersectsRect = (x1, y1, x2, y2, rx, ry, rw, rh) => {
    // Verifica se algum dos pontos está dentro do retângulo
    if ((x1 >= rx && x1 <= rx + rw && y1 >= ry && y1 <= ry + rh) ||
        (x2 >= rx && x2 <= rx + rw && y2 >= ry && y2 <= ry + rh)) {
      return true;
    }
    
    // Verifica interseção com cada borda do retângulo
    const edges = [
      { x1: rx, y1: ry, x2: rx + rw, y2: ry }, // topo
      { x1: rx + rw, y1: ry, x2: rx + rw, y2: ry + rh }, // direita
      { x1: rx + rw, y1: ry + rh, x2: rx, y2: ry + rh }, // baixo
      { x1: rx, y1: ry + rh, x2: rx, y2: ry } // esquerda
    ];
    
    for (const edge of edges) {
      if (linesIntersect(x1, y1, x2, y2, edge.x1, edge.y1, edge.x2, edge.y2)) {
        return true;
      }
    }
    
    return false;
  };
  
  // Função para verificar se duas linhas se intersectam
  const linesIntersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) return false;
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
    
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  };
  
  // Função para calcular caminho da conexão evitando POPs
  const calculateConnectionPath = useCallback((fromX, fromY, toX, toY, pops, zoom, pan) => {
    // Primeiro, verifica se a linha reta passa por algum POP
    let intersectsAnyPop = false;
    let intersectingPops = [];
    
    pops.forEach(pop => {
      const popX = pop.x * zoom + pan.x;
      const popY = pop.y * zoom + pan.y;
      const popW = pop.width * zoom;
      const popH = pop.height * zoom;
      
      // Evitar verificar se os pontos estão dentro do mesmo POP (conexão interna)
      const fromInPop = fromX >= popX && fromX <= popX + popW && fromY >= popY && fromY <= popY + popH;
      const toInPop = toX >= popX && toX <= popX + popW && toY >= popY && toY <= popY + popH;
      
      if (fromInPop || toInPop) return; // Skip se for conexão interna ao POP
      
      if (lineIntersectsRect(fromX, fromY, toX, toY, popX, popY, popW, popH)) {
        intersectsAnyPop = true;
        intersectingPops.push({ x: popX, y: popY, width: popW, height: popH });
      }
    });
    
    // Se não intersecta nenhum POP, retorna linha reta
    if (!intersectsAnyPop) {
      return `M ${fromX} ${fromY} L ${toX} ${toY}`;
    }
    
    // Calcula curva Bézier para contornar os POPs
    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const offset = Math.min(distance * 0.3, 100); // Offset máximo de 100px
    
    // Calcula pontos de controle para curvar a linha
    // Usa perpendicular ao vetor da linha para curvar ao redor dos POPs
    const perpX = -dy / distance * offset;
    const perpY = dx / distance * offset;
    
    // Ponto médio deslocado
    const midX = (fromX + toX) / 2 + perpX;
    const midY = (fromY + toY) / 2 + perpY;
    
    // Usa curva Bézier quadrática suave
    return `M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`;
  }, []);

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
              onClick={() => loadEquipamentos({}, 1, 'all', true)}
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
              onClick={() => loadEquipamentos({}, 1, 'all', true)}
              disabled={error && error.includes('Rate limit')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className={`w-4 h-4 ${error && error.includes('Rate limit') ? 'animate-spin' : ''}`} />
              <span>{error && error.includes('Rate limit') ? 'Aguarde...' : 'Atualizar'}</span>
            </button>
            
            <button
              onClick={() => {
                // Ajustar zoom e pan para centralizar no POP "Torre Miracema - Servidor" e mostrar todos os equipamentos
                if (topologiaData.pops.length > 0) {
                  // Encontrar o POP "Torre Miracema - Servidor"
                  const targetPop = topologiaData.pops.find(pop => 
                    pop.nome.toLowerCase().includes('torre miracema') || 
                    pop.nome.toLowerCase().includes('miracema')
                  );
                  
                  const viewportWidth = isFullscreen ? window.innerWidth - 32 : 1200;
                  const viewportHeight = isFullscreen ? window.innerHeight - 32 : 600;
                  
                  // Calcular bounding box de todos os POPs
                  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                  topologiaData.pops.forEach(pop => {
                    minX = Math.min(minX, pop.x);
                    minY = Math.min(minY, pop.y);
                    maxX = Math.max(maxX, pop.x + pop.width);
                    maxY = Math.max(maxY, pop.y + pop.height);
                  });
                  
                  const totalWidth = maxX - minX;
                  const totalHeight = maxY - minY;
                  
                  // Calcular zoom para mostrar tudo (com margem de 10%)
                  const scaleX = viewportWidth / (totalWidth * 1.1);
                  const scaleY = viewportHeight / (totalHeight * 1.1);
                  const newZoom = Math.min(scaleX, scaleY, 3); // Limitar zoom máximo a 3x
                  
                  // Centralizar no POP alvo ou no centro de todos os POPs
                  let centerX, centerY;
                  if (targetPop) {
                    centerX = targetPop.x + targetPop.width / 2;
                    centerY = targetPop.y + targetPop.height / 2;
                  } else {
                    centerX = (minX + maxX) / 2;
                    centerY = (minY + maxY) / 2;
                  }
                  
                  // Calcular pan para centralizar
                  const newPanX = viewportWidth / 2 - centerX * newZoom;
                  const newPanY = viewportHeight / 2 - centerY * newZoom;
                  
                  setZoom(newZoom);
                  setPan({ x: newPanX, y: newPanY });
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
              // Calcular caminho da conexão (pode ser linha reta ou curva)
              const pathData = calculateConnectionPath(fromX, fromY, toX, toY, topologiaData.pops, zoom, pan);
              
              // Extrair ponto médio para o rótulo
              // Para curvas Bézier, calcular ponto médio aproximado
              const isCurve = pathData.includes('Q');
              let midX, midY;
              if (isCurve) {
                // Extrair ponto de controle da curva Q
                const match = pathData.match(/Q\s+([\d.]+)\s+([\d.]+)/);
                if (match) {
                  const cx = parseFloat(match[1]);
                  const cy = parseFloat(match[2]);
                  // Ponto médio em t=0.5 da curva Bézier quadrática
                  midX = 0.25 * fromX + 0.5 * cx + 0.25 * toX;
                  midY = 0.25 * fromY + 0.5 * cy + 0.25 * toY;
                } else {
                  midX = (fromX + toX) / 2;
                  midY = (fromY + toY) / 2;
                }
              } else {
                midX = (fromX + toX) / 2;
                midY = (fromY + toY) / 2;
              }

              return (
                <g key={connection.id}>
                  {/* Caminho visível (linha reta ou curva) */}
                  <path
                    d={pathData}
                  stroke="#7d26d9"
                  strokeWidth="2"
                    fill="none"
                  opacity="0.6"
                  markerEnd="url(#arrowhead)"
                />
                  {/* Área clicável para editar etiqueta (caminho invisível, mais espesso) */}
                  <path
                    d={pathData}
                    stroke="transparent"
                    strokeWidth="14"
                    fill="none"
                    style={{ pointerEvents: 'auto', cursor: 'text' }}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      const current = edgeLabels[connection.id] || '';
                      const text = window.prompt('Etiqueta da conexão', current);
                      if (text !== null) {
                        saveEdgeLabel(connection.id, text.trim());
                      }
                    }}
                  />
                  {/* Rótulo no meio da linha */}
                  {showLabels && edgeLabels[connection.id] && edgeLabels[connection.id].length > 0 && (
                    <g>
                      {/* Halo para legibilidade */}
                      <text x={midX} y={midY - 2} textAnchor="middle" fontSize="10" stroke="#ffffff" strokeWidth="3" paintOrder="stroke" fill="#111827">
                        {edgeLabels[connection.id]}
                      </text>
                      <text x={midX} y={midY - 2} textAnchor="middle" fontSize="10" fill="#111827">
                        {edgeLabels[connection.id]}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* POPs */}
          {topologiaData.pops.map((pop, popIndex) => (
            <div
              key={pop.id}
              data-pop={popIndex}
              data-pop-name={pop.nome}
              className="absolute border-2 border-purple-300 rounded-lg bg-purple-50/80 backdrop-blur-sm cursor-move"
              style={{
                left: pop.x * zoom + pan.x,
                top: pop.y * zoom + pan.y,
                width: pop.width * zoom,
                height: pop.height * zoom,
                zIndex: 1,
                pointerEvents: 'auto'
              }}
            >
              {/* Título do POP */}
              <div 
                className="absolute -top-6 left-0 bg-purple-600 text-white px-2 py-1 rounded font-semibold"
                style={{
                  width: `${pop.width * zoom}px`,
                  fontSize: zoom < 0.6 ? `${Math.max(12, 12 * (1.2 - zoom))}px` : zoom < 1 ? `${12 / Math.sqrt(zoom)}px` : '12px'
                }}
              >
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
                    left: (node.x - pop.x) * zoom - (zoom < 1 ? 25 * zoom : 30),
                    top: (node.y - pop.y) * zoom - (zoom < 1 ? 25 * zoom : 30),
                    width: zoom < 1 ? `${60 * zoom}px` : '60px',
                    height: zoom < 1 ? `${60 * zoom}px` : '60px',
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
                    <div className="mb-1" style={{ fontSize: zoom < 1 ? `${16 * zoom}px` : '18px' }}>
                      {getEquipmentIcon(node.tipo)}
                    </div>
                    
                    {/* Nome do equipamento */}
                  <div 
                    className="font-bold text-gray-800 leading-tight text-center break-words"
                    style={{ fontSize: zoom < 1 ? `${7 * zoom}px` : '8px' }}
                    title={node.nome}
                  >
                    {node.nome}
                  </div>
                    
                    {/* Status - apenas cor, sem texto */}
                    <div 
                      className="rounded-full mt-0.5"
                      style={{ 
                        backgroundColor: getStatusColor(node.status),
                        width: zoom < 1 ? `${1.5 * zoom}px` : '1.5px',
                        height: zoom < 1 ? `${1.5 * zoom}px` : '1.5px'
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
                  // Recarregar TODOS os equipamentos (sem limite)
                  await loadEquipamentos({}, 1, 'all', true);
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