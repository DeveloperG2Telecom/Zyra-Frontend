import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import UniversalLoading from './components/UniversalLoading';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Equipamentos from './components/Equipamentos';
import TopologiaRede from './components/TopologiaRede';
import TesteConexao from './components/TesteConexao';
import Backups from './components/Backups';
import MonitoramentoSimplificado from './components/MonitoramentoSimplificado';

function AppContent() {
  const { loading } = useLoading();
  
  return React.createElement('div', { className: 'App' },
        React.createElement(Routes, null,
          React.createElement(Route, { path: '/', element: React.createElement(Login) }),
          React.createElement(Route, { path: '/login', element: React.createElement(Login) }),
          React.createElement(Route, { path: '/register', element: React.createElement(Register) }),
          React.createElement(Route, { path: '/home', element: React.createElement(Home) }),
          React.createElement(Route, { path: '/equipamentos', element: React.createElement(Equipamentos) }),
          React.createElement(Route, { path: '/topologia', element: React.createElement(TopologiaRede) }),
          React.createElement(Route, { path: '/teste-conexao', element: React.createElement(TesteConexao) }),
          React.createElement(Route, { path: '/backups', element: React.createElement(Backups) }),
          React.createElement(Route, { path: '/monitoramento', element: React.createElement(MonitoramentoSimplificado) })
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
