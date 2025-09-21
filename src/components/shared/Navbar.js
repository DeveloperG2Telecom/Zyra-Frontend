import React from 'react';
import { useLoading } from '../../contexts/LoadingContext';

function Navbar({ currentPage = '' }) {
  const { showLoading, hideLoading } = useLoading();

  const handleLogout = () => {
    showLoading('Saindo do sistema...');
    setTimeout(() => {
      hideLoading();
      window.location.href = '/login';
    }, 1500);
  };
  const navItems = [
    { path: '/home', label: 'Dashboard', icon: 'dashboard' },
    { path: '/equipamentos', label: 'Equipamentos', icon: 'equipamentos' },
    { path: '/topologia', label: 'Topologia', icon: 'topologia' },
    { path: '/teste-conexao', label: 'Teste Conexão', icon: 'teste' },
    { path: '/backups', label: 'Backups', icon: 'backups' },
    { path: '/monitoramento', label: 'Monitoramento', icon: 'monitoramento' }
  ];

  const getIcon = (iconType) => {
    const icons = {
      dashboard: React.createElement('svg', {
        width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'
      },
        React.createElement('rect', { x: '3', y: '3', width: '7', height: '7' }),
        React.createElement('rect', { x: '14', y: '3', width: '7', height: '7' }),
        React.createElement('rect', { x: '14', y: '14', width: '7', height: '7' }),
        React.createElement('rect', { x: '3', y: '14', width: '7', height: '7' })
      ),
      equipamentos: React.createElement('svg', {
        width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'
      },
        React.createElement('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2', ry: '2' }),
        React.createElement('line', { x1: '8', y1: '21', x2: '16', y2: '21' }),
        React.createElement('line', { x1: '12', y1: '17', x2: '12', y2: '21' })
      ),
      topologia: React.createElement('svg', {
        width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'
      },
        React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
        React.createElement('line', { x1: '2', y1: '12', x2: '22', y2: '12' }),
        React.createElement('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
      ),
      teste: React.createElement('svg', {
        width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'
      },
        React.createElement('path', { d: 'M9 12l2 2 4-4' }),
        React.createElement('path', { d: 'M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3' }),
        React.createElement('path', { d: 'M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3' }),
        React.createElement('path', { d: 'M13 12h3a2 2 0 0 1 2 2v1' }),
        React.createElement('path', { d: 'M13 12h-3a2 2 0 0 0-2 2v1' })
      ),
      backups: React.createElement('svg', {
        width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'
      },
        React.createElement('path', { d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' }),
        React.createElement('polyline', { points: '3.27,6.96 12,12.01 20.73,6.96' }),
        React.createElement('line', { x1: '12', y1: '22.08', x2: '12', y2: '12' })
      ),
      monitoramento: React.createElement('svg', {
        width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round'
      },
        React.createElement('path', { d: 'M22 12h-4l-3 9L9 3l-3 9H2' })
      )
    };
    return icons[iconType] || icons.dashboard;
  };

  return React.createElement('div', { 
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(125, 38, 217, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }
  },
    // Logo e título
    React.createElement('div', { 
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }
    },
      React.createElement('img', { 
        src: '/logo-sem-fundo.png', 
        alt: 'Zyra Logo', 
        style: {
          width: '32px',
          height: '32px',
          objectFit: 'contain'
        }
      }),
      React.createElement('div', null,
        React.createElement('h1', { 
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#7d26d9',
            margin: 0,
            lineHeight: 1
          }
        }, 'Zyra'),
        React.createElement('p', { 
          style: {
            fontSize: '9px',
            color: '#737373',
            fontWeight: '500',
            margin: 0,
            lineHeight: 1
          }
        }, 'Sistema de Monitoramento')
      )
    ),
    
    // Menu de navegação horizontal
    React.createElement('nav', { 
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    },
      ...navItems.map(item => 
        React.createElement('button', {
          key: item.path,
          onClick: () => window.location.href = item.path,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: currentPage === item.path ? 'rgba(125, 38, 217, 0.1)' : 'transparent',
            color: currentPage === item.path ? '#7d26d9' : '#404040',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }
        },
          getIcon(item.icon),
          item.label
        )
      )
    ),
    
    // Status e logout
    React.createElement('div', { 
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }
    },
      React.createElement('div', { 
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '16px',
          color: '#10b981',
          fontSize: '11px',
          fontWeight: '500'
        }
      },
        React.createElement('svg', {
          width: '8',
          height: '8',
          viewBox: '0 0 24 24',
          fill: 'currentColor'
        },
          React.createElement('circle', { cx: '12', cy: '12', r: '10' })
        ),
        'Online'
      ),
      React.createElement('button', {
        onClick: handleLogout,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '6px',
          border: 'none',
          background: 'rgba(251, 143, 55, 0.1)',
          color: '#fb8f37',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s'
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
          React.createElement('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
          React.createElement('polyline', { points: '16,17 21,12 16,7' }),
          React.createElement('line', { x1: '21', y1: '12', x2: '9', y2: '12' })
        ),
        'Sair'
      )
    )
  );
}

export default Navbar;
