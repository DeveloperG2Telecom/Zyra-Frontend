import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import UniversalLoading from './components/UniversalLoading';
import Login from './components/Login';
import Register from './components/Register';

function AppContent() {
  const { loading } = useLoading();
  
  return React.createElement('div', { className: 'App' },
    React.createElement(Routes, null,
      React.createElement(Route, { path: '/', element: React.createElement(Login) }),
      React.createElement(Route, { path: '/login', element: React.createElement(Login) }),
      React.createElement(Route, { path: '/register', element: React.createElement(Register) })
    ),
    loading && React.createElement(UniversalLoading, { overlay: true })
  );
}

function App() {
  return React.createElement(LoadingProvider, null,
    React.createElement(Router, null,
      React.createElement(AppContent, null)
    )
  );
}

export default App;
