/**
 * Constantes de configuração para a topologia de rede
 */

// Dimensões do container
export const CONTAINER_WIDTH = 1200;
export const CONTAINER_HEIGHT = 600;

// Espaçamentos
export const NODE_SPACING = 100; // Espaçamento entre equipamentos dentro do POP
export const POP_PADDING = 40; // Padding interno do POP
export const MIN_PADDING = 150; // Espaçamento mínimo entre POPs

// Layout radial
export const RADIAL_RADIUS = 600; // Raio base para POPs ao redor do central
export const EXTERNAL_RADIUS = RADIAL_RADIUS + 500; // Raio para POPs externos
export const MAX_PLACEMENT_ATTEMPTS = 30; // Máximo de tentativas para posicionar POP
export const RADIUS_INCREMENT = 100; // Incremento de raio ao evitar colisão

// Zoom e Pan
export const MIN_ZOOM = 0.3;
export const MAX_ZOOM = 3;
export const ZOOM_STEP = 0.2;
export const ZOOM_SENSITIVITY = 0.1; // Multiplicador para scroll

// Cores
export const CONNECTION_COLOR = '#7d26d9';
export const CONNECTION_OPACITY = 0.6;
export const POP_BORDER_COLOR = 'border-purple-300';
export const POP_BG_COLOR = 'bg-purple-50/80';

// Tamanhos
export const EQUIPMENT_NODE_SIZE = 60;
export const CONNECTION_STROKE_WIDTH = 2;
export const CONNECTION_CLICKABLE_WIDTH = 14;

// Configuração de curvas
export const CURVE_OFFSET_MULTIPLIER = 0.3;
export const MAX_CURVE_OFFSET = 100;

// Nome do POP central
export const CENTRAL_POP_NAMES = ['torre miracema', 'miracema'];

