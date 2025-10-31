/**
 * Funções utilitárias para cálculos geométricos na topologia
 */

/**
 * Verifica se há colisão entre dois retângulos expandidos
 * @param {number} x - Posição X do retângulo 1
 * @param {number} y - Posição Y do retângulo 1
 * @param {number} width - Largura do retângulo 1
 * @param {number} height - Altura do retângulo 1
 * @param {Array} existingPops - Array de POPs já posicionados
 * @param {number} minPadding - Padding mínimo entre retângulos
 * @returns {boolean} true se há colisão
 */
export const checkCollision = (x, y, width, height, existingPops, minPadding = 150) => {
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

/**
 * Verifica se uma linha intersecta um retângulo
 * @param {number} x1 - Coordenada X inicial da linha
 * @param {number} y1 - Coordenada Y inicial da linha
 * @param {number} x2 - Coordenada X final da linha
 * @param {number} y2 - Coordenada Y final da linha
 * @param {number} rx - Posição X do retângulo
 * @param {number} ry - Posição Y do retângulo
 * @param {number} rw - Largura do retângulo
 * @param {number} rh - Altura do retângulo
 * @returns {boolean} true se há interseção
 */
export const lineIntersectsRect = (x1, y1, x2, y2, rx, ry, rw, rh) => {
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

/**
 * Verifica se duas linhas se intersectam
 * @param {number} x1 - Coordenada X inicial da linha 1
 * @param {number} y1 - Coordenada Y inicial da linha 1
 * @param {number} x2 - Coordenada X final da linha 1
 * @param {number} y2 - Coordenada Y final da linha 1
 * @param {number} x3 - Coordenada X inicial da linha 2
 * @param {number} y3 - Coordenada Y inicial da linha 2
 * @param {number} x4 - Coordenada X final da linha 2
 * @param {number} y4 - Coordenada Y final da linha 2
 * @returns {boolean} true se há interseção
 */
export const linesIntersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (denom === 0) return false;
  
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
  
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
};

/**
 * Calcula interseção de linha com retângulo (Liang–Barsky simplificado)
 * @param {number} rx - Posição X do retângulo
 * @param {number} ry - Posição Y do retângulo
 * @param {number} rw - Largura do retângulo
 * @param {number} rh - Altura do retângulo
 * @param {number} x1 - Coordenada X inicial da linha
 * @param {number} y1 - Coordenada Y inicial da linha
 * @param {number} x2 - Coordenada X final da linha
 * @param {number} y2 - Coordenada Y final da linha
 * @returns {Object|null} Ponto de interseção ou null
 */
export const getRectIntersection = (rx, ry, rw, rh, x1, y1, x2, y2) => {
  const left = rx, right = rx + rw, top = ry, bottom = ry + rh;
  const dx = x2 - x1, dy = y2 - y1;
  let t0 = 0, t1 = 1;
  
  const clip = (p, q) => {
    if (p === 0) return q < 0 ? false : true;
    const r = q / p;
    if (p < 0) {
      if (r > t1) return false; 
      if (r > t0) t0 = r;
    } else {
      if (r < t0) return false; 
      if (r < t1) t1 = r;
    }
    return true;
  };
  
  if (!clip(-dx, x1 - left)) return null;
  if (!clip(dx, right - x1)) return null;
  if (!clip(-dy, y1 - top)) return null;
  if (!clip(dy, bottom - y1)) return null;
  
กรณ์  const ix = x1 + dx * t1;
  const iy = y1 + dy * t1;
  return { x: ix, y: iy };
};

/**
 * Calcula interseção da linha com a borda de um círculo (equipamento)
 * @param {number} x1 - Coordenada X inicial da linha
 * @param {number} y1 - Coordenada Y inicial da linha
 * @param {number} x2 - Coordenada X final da linha
 * @param {number} y2 - Coordenada Y final da linha
 * @param {number} centerX - Coordenada X do centro do círculo
 * @param {number} centerY - Coordenada Y do centro do círculo
 * @param {number} radius - Raio do círculo
 * @returns {Object} Ponto de interseção
 */
export const getLineIntersection = (x1, y1, x2, y2, centerX, centerY, radius) => {
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

