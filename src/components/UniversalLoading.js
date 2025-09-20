import React from 'react';

function UniversalLoading({ 
  size = 'medium', 
  color = '#7d26d9', 
  overlay = false, 
  message = 'Carregando...',
  showMessage = true 
}) {
  // Tamanhos predefinidos
  const sizes = {
    small: { width: '30px', height: '30px', strokeWidth: '3' },
    medium: { width: '60px', height: '60px', strokeWidth: '4' },
    large: { width: '90px', height: '90px', strokeWidth: '5' },
    xlarge: { width: '120px', height: '120px', strokeWidth: '6' }
  };

  const currentSize = sizes[size] || sizes.medium;

  const loadingContent = React.createElement('div', { 
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px'
    }
  },
    // Loading Z
    React.createElement('div', { 
      style: {
        width: currentSize.width,
        height: currentSize.height,
        position: 'relative'
      }
    },
      React.createElement('svg', { 
        viewBox: '0 0 60 60',
        style: {
          width: '100%',
          height: '100%'
        }
      },
        React.createElement('path', {
          className: 'z-path',
          d: 'M15 15 L45 15 L15 45 L45 45',
          style: {
            fill: 'none',
            stroke: color,
            strokeWidth: currentSize.strokeWidth,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeDasharray: '200',
            strokeDashoffset: '0',
            animation: 'z-draw 2s linear infinite'
          }
        })
      )
    ),
    
    // Mensagem (se habilitada)
    showMessage && React.createElement('div', {
      style: {
        fontSize: size === 'small' ? '12px' : size === 'large' ? '18px' : '16px',
        fontWeight: '500',
        color: '#333',
        textAlign: 'center'
      }
    }, message)
  );

  // Se for overlay, retorna com fundo escuro
  if (overlay) {
    return React.createElement('div', { 
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }
    },
      React.createElement('div', { 
        style: {
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }
      }, loadingContent)
    );
  }

  // Se não for overlay, retorna apenas o loading
  return loadingContent;
}

export default UniversalLoading;
