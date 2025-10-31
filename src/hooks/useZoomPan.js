import { useState, useCallback } from 'react';
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP, ZOOM_SENSITIVITY, CENTRAL_POP_NAMES } from '../constants/topology';

/**
 * Hook para gerenciar zoom e pan (arrastar) na topologia
 * @returns {Object} Objeto com estado e handlers de zoom/pan
 */
export const useZoomPan = () => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handler para zoom com scroll
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 - ZOOM_SENSITIVITY : 1 + ZOOM_SENSITIVITY;
    setZoom(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev * delta)));
  }, []);

  // Handler para iniciar arrasto
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('[data-equipment]')) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan.x, pan.y]);

  // Handler para mover durante arrasto
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart.x, dragStart.y]);

  // Handler para finalizar arrasto
  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
  }, [isDragging]);

  // Função para aumentar zoom
  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  }, []);

  // Função para diminuir zoom
  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
  }, []);

  // Função para resetar zoom e pan
  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Função para ajustar visualização para mostrar todos os elementos
  const fitToView = useCallback((topologiaData, isFullscreen = false) => {
    if (!topologiaData.pops || topologiaData.pops.length === 0) return;

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
    const newZoom = Math.min(scaleX, scaleY, MAX_ZOOM);

    // Encontrar POP central
    const targetPop = topologiaData.pops.find(pop => 
      CENTRAL_POP_NAMES.some(name => 
        pop.nome.toLowerCase().includes(name)
      )
    );

    // Calcular centro
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
  }, []);

  return {
    zoom,
    pan,
    isDragging,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    zoomIn,
    zoomOut,
    resetView,
    fitToView,
    setZoom,
    setPan
  };
};

