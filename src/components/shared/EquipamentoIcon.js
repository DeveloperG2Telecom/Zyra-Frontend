import React from 'react';

const EquipamentoIcon = ({ tipo, size = 24, color = '#3b82f6' }) => {
  const getIcon = () => {
    const iconProps = {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    };

    switch (tipo.toLowerCase()) {

      case 'radio':
        return React.createElement('svg', iconProps,
          // Antena
          React.createElement('path', { d: 'M12 2L8 6h8l-4-4z' }),
          // Corpo do rádio
          React.createElement('rect', { x: '7', y: '8', width: '10', height: '10', rx: '2' }),
          // Display
          React.createElement('rect', { x: '9', y: '10', width: '6', height: '3', rx: '1' }),
          // Botões
          React.createElement('circle', { cx: '9', cy: '15', r: '1' }),
          React.createElement('circle', { cx: '12', cy: '15', r: '1' }),
          React.createElement('circle', { cx: '15', cy: '15', r: '1' }),
          // Antena lateral
          React.createElement('path', { d: 'M17 10v4' }),
          React.createElement('path', { d: 'M19 10v4' })
        );

      case 'torre':
        return React.createElement('svg', iconProps,
          // Base da torre
          React.createElement('path', { d: 'M12 22L8 18h8l-4 4z' }),
          // Estrutura da torre
          React.createElement('path', { d: 'M12 18L10 16h4l-2 2z' }),
          React.createElement('path', { d: 'M12 16L10 14h4l-2 2z' }),
          React.createElement('path', { d: 'M12 14L10 12h4l-2 2z' }),
          // Antenas na torre
          React.createElement('path', { d: 'M8 12h8' }),
          React.createElement('path', { d: 'M8 10h8' }),
          React.createElement('path', { d: 'M8 8h8' }),
          // Sinal
          React.createElement('path', { d: 'M6 8l2-2' }),
          React.createElement('path', { d: 'M18 8l-2-2' })
        );

      case 'concentrador':
        return React.createElement('svg', iconProps,
          // Corpo principal
          React.createElement('rect', { x: '6', y: '8', width: '12', height: '8', rx: '2' }),
          // Display
          React.createElement('rect', { x: '8', y: '10', width: '8', height: '2', rx: '1' }),
          // Portas (muitas)
          React.createElement('rect', { x: '7', y: '14', width: '1', height: '1' }),
          React.createElement('rect', { x: '9', y: '14', width: '1', height: '1' }),
          React.createElement('rect', { x: '11', y: '14', width: '1', height: '1' }),
          React.createElement('rect', { x: '13', y: '14', width: '1', height: '1' }),
          React.createElement('rect', { x: '15', y: '14', width: '1', height: '1' }),
          React.createElement('rect', { x: '17', y: '14', width: '1', height: '1' }),
          // LEDs de status
          React.createElement('circle', { cx: '8', cy: '16', r: '0.5' }),
          React.createElement('circle', { cx: '10', cy: '16', r: '0.5' }),
          React.createElement('circle', { cx: '12', cy: '16', r: '0.5' }),
          React.createElement('circle', { cx: '14', cy: '16', r: '0.5' }),
          React.createElement('circle', { cx: '16', cy: '16', r: '0.5' })
        );

      case 'roteador':
        return React.createElement('svg', iconProps,
          // Corpo do roteador
          React.createElement('rect', { x: '6', y: '8', width: '12', height: '8', rx: '2' }),
          // Antenas
          React.createElement('path', { d: 'M8 6L8 8' }),
          React.createElement('path', { d: 'M12 6L12 8' }),
          React.createElement('path', { d: 'M16 6L16 8' }),
          // Portas LAN
          React.createElement('rect', { x: '7', y: '14', width: '2', height: '1' }),
          React.createElement('rect', { x: '10', y: '14', width: '2', height: '1' }),
          React.createElement('rect', { x: '13', y: '14', width: '2', height: '1' }),
          React.createElement('rect', { x: '16', y: '14', width: '2', height: '1' }),
          // Porta WAN
          React.createElement('rect', { x: '7', y: '16', width: '2', height: '1' }),
          // LEDs
          React.createElement('circle', { cx: '9', cy: '12', r: '0.5' }),
          React.createElement('circle', { cx: '12', cy: '12', r: '0.5' }),
          React.createElement('circle', { cx: '15', cy: '12', r: '0.5' })
        );

      case 'ap':
      case 'access point':
        return React.createElement('svg', iconProps,
          // Corpo do AP
          React.createElement('rect', { x: '8', y: '10', width: '8', height: '6', rx: '2' }),
          // Antena principal
          React.createElement('path', { d: 'M12 8L12 10' }),
          // Sinal de WiFi
          React.createElement('path', { d: 'M6 12c2-2 4-2 6 0' }),
          React.createElement('path', { d: 'M6 14c1-1 2-1 3 0' }),
          React.createElement('path', { d: 'M6 16c0.5-0.5 1-0.5 1.5 0' }),
          // LEDs
          React.createElement('circle', { cx: '10', cy: '12', r: '0.5' }),
          React.createElement('circle', { cx: '12', cy: '12', r: '0.5' }),
          React.createElement('circle', { cx: '14', cy: '12', r: '0.5' })
        );

      default:
        // Ícone genérico para equipamentos não identificados
        return React.createElement('svg', iconProps,
          React.createElement('rect', { x: '6', y: '8', width: '12', height: '8', rx: '2' }),
          React.createElement('circle', { cx: '9', cy: '12', r: '1' }),
          React.createElement('circle', { cx: '12', cy: '12', r: '1' }),
          React.createElement('circle', { cx: '15', cy: '12', r: '1' }),
          React.createElement('rect', { x: '7', y: '14', width: '2', height: '1' }),
          React.createElement('rect', { x: '10', y: '14', width: '2', height: '1' }),
          React.createElement('rect', { x: '13', y: '14', width: '2', height: '1' })
        );
    }
  };

  return getIcon();
};

// Função para obter o tipo de equipamento baseado no campo tipo
export const detectarTipoEquipamento = (equipamento) => {
  // Se o equipamento tem o campo tipo, usar diretamente
  if (equipamento.tipo) {
    const tipo = equipamento.tipo.toUpperCase();
    
    // Mapear tipos do sistema para ícones
    switch (tipo) {
      case 'MIKROTIK':
        return 'equipamento'; // Ícone genérico
      case 'MK CONCENTRADOR':
        return 'concentrador';
      case 'RADIO PTP':
        return 'radio';
      case 'AP':
        return 'ap';
      case 'MIMOSA':
        return 'ap'; // MIMOSA é um tipo de AP
      case 'OLT':
        return 'equipamento'; // Ícone genérico
      case 'ROTEADOR':
        return 'roteador';
      case 'SWITCH':
        return 'concentrador';
      case 'OUTROS':
        return 'equipamento';
      default:
        return 'equipamento';
    }
  }

  // Fallback para detecção por nome/modelo (compatibilidade)
  const nome = (equipamento.nome || '').toLowerCase();
  const modelo = (equipamento.modelo || '').toLowerCase();
  const textoCompleto = `${nome} ${modelo}`;

  // Detecção por palavras-chave
  if (textoCompleto.includes('mikrotik') || textoCompleto.includes('routeros')) {
    return 'mikrotik';
  }
  
  if (textoCompleto.includes('radio') || textoCompleto.includes('wireless') || textoCompleto.includes('bridge')) {
    return 'radio';
  }
  
  if (textoCompleto.includes('torre') || textoCompleto.includes('tower') || textoCompleto.includes('mast')) {
    return 'torre';
  }
  
  if (textoCompleto.includes('concentrador') || textoCompleto.includes('hub') || textoCompleto.includes('switch')) {
    return 'concentrador';
  }
  
  if (textoCompleto.includes('roteador') || textoCompleto.includes('router') || textoCompleto.includes('gateway')) {
    return 'roteador';
  }
  
  if (textoCompleto.includes('ap') || textoCompleto.includes('access point') || textoCompleto.includes('wifi') || textoCompleto.includes('wireless ap')) {
    return 'ap';
  }

  // Detecção por padrões específicos
  if (modelo.includes('rb') || modelo.includes('ccr') || modelo.includes('chr')) {
    return 'mikrotik';
  }
  
  if (modelo.includes('ubnt') || modelo.includes('unifi')) {
    return 'ap';
  }
  
  if (modelo.includes('tp-link') || modelo.includes('tplink')) {
    return 'roteador';
  }

  // Padrão genérico
  return 'equipamento';
};

export default EquipamentoIcon;
