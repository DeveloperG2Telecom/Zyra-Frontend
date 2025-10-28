import React, { useState, useEffect } from 'react';

const Notification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      setAnimating(true);
      
      const timer = setTimeout(() => {
        setAnimating(false);
        setTimeout(() => {
          setVisible(false);
          if (onClose) onClose();
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return React.createElement('svg', {
          width: '20',
          height: '20',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        },
          React.createElement('path', { d: 'M9 12l2 2 4-4' }),
          React.createElement('path', { d: 'M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.9.37 4.13 1.02' })
        );
      case 'error':
        return React.createElement('svg', {
          width: '20',
          height: '20',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        },
          React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
          React.createElement('line', { x1: '15', y1: '9', x2: '9', y2: '15' }),
          React.createElement('line', { x1: '9', y1: '9', x2: '15', y2: '15' })
        );
      case 'info':
        return React.createElement('svg', {
          width: '20',
          height: '20',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        },
          React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
          React.createElement('path', { d: 'M12 16v-4' }),
          React.createElement('path', { d: 'M12 8h.01' })
        );
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: '#10b981',
          icon: '#ffffff'
        };
      case 'error':
        return {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          border: '#ef4444',
          icon: '#ffffff'
        };
      case 'info':
        return {
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          border: '#3b82f6',
          icon: '#ffffff'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #6b7280, #4b5563)',
          border: '#6b7280',
          icon: '#ffffff'
        };
    }
  };

  const colors = getColors();

  return React.createElement('div', {
    style: {
      transform: animating ? 'translateX(0)' : 'translateX(100%)',
      opacity: animating ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      maxWidth: '400px',
      minWidth: '300px'
    }
  },
    React.createElement('div', {
      style: {
        background: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        backdropFilter: 'blur(10px)'
      }
    },
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          flexShrink: 0
        }
      }, getIcon()),
      React.createElement('div', {
        style: {
          flex: 1,
          lineHeight: '1.4'
        }
      }, message),
      React.createElement('button', {
        onClick: () => {
          setAnimating(false);
          setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
          }, 100);
        },
        style: {
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.8)',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          flexShrink: 0
        },
        onMouseEnter: (e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          e.target.style.color = 'white';
        },
        onMouseLeave: (e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = 'rgba(255, 255, 255, 0.8)';
        }
      },
        React.createElement('svg', {
          width: '16',
          height: '16',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        },
          React.createElement('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
          React.createElement('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
        )
      )
    )
  );
};

export default Notification;
