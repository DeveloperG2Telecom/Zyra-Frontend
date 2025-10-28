import React from 'react';
import BackgroundAnimado from './BackgroundAnimado';
import Navbar from './Navbar';
import NotificationContainer from './NotificationContainer';

function Layout({ children, currentPage = '' }) {
  return React.createElement('div', { 
    style: {
      minHeight: '100vh',
      position: 'relative'
    }
  },
    React.createElement(BackgroundAnimado),
    React.createElement(Navbar, { currentPage }),
    React.createElement(NotificationContainer),
    React.createElement('div', { 
      style: {
        paddingTop: '60px',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 10
      }
    }, children)
  );
}

export default Layout;
