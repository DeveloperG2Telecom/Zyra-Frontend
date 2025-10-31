/**
 * Funções auxiliares para topologia
 */

/**
 * Retorna o ícone emoji para um tipo de equipamento
 * @param {string} tipo - Tipo do equipamento
 * @returns {string} Ícone emoji
 */
export const getEquipmentIcon = (tipo) => {
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

/**
 * Retorna a cor do status do equipamento
 * @param {string} status - Status do equipamento
 * @returns {string} Código hexadecimal da cor
 */
export const getStatusColor = (status) => {
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

/**
 * Retorna o texto formatado do status
 * @param {string} status - Status do equipamento
 * @returns {string} Texto do status formatado
 */
export const getStatusText = (status) => {
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

