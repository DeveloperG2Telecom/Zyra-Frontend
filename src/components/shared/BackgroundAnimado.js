import React from 'react';

function BackgroundAnimado() {
  return React.createElement('div', { 
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      overflow: 'hidden',
      zIndex: -1
    }
  },
    React.createElement('div', { 
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(rgba(125, 38, 217, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(125, 38, 217, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'grid-move 20s linear infinite'
      }
    })
  );
}

export default BackgroundAnimado;
