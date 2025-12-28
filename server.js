const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Porta padrão
const PORT = process.env.PORT || 10000;

// Determinar o caminho da pasta build
// Quando executado como executável, o build pode estar na mesma pasta do executável
let buildPath = path.join(__dirname, 'build');

// Se não encontrar na pasta padrão, tentar na pasta do executável (dist)
if (!fs.existsSync(buildPath)) {
  // Quando executado como exe, __dirname pode apontar para o executável
  // Tentar encontrar build na mesma pasta do executável
  const possiblePaths = [
    path.join(process.cwd(), 'build'),
    path.join(__dirname, '..', 'build'),
    path.join(path.dirname(process.execPath), 'build')
  ];
  
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      buildPath = possiblePath;
      break;
    }
  }
}

// Verificar se a pasta build existe
if (!fs.existsSync(buildPath)) {
  console.error('❌ ERRO: Pasta build não encontrada!');
  console.error('Execute "npm run build" primeiro para gerar os arquivos estáticos.');
  process.exit(1);
}

console.log(`📁 Servindo arquivos de: ${buildPath}`);

// Servir arquivos estáticos da pasta build
app.use(express.static(buildPath));

// Todas as rotas não-API redirecionam para index.html (SPA)
app.get('*', (req, res) => {
  // Ignorar requisições para /api
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API não disponível neste servidor' });
  }
  
  const indexPath = path.join(buildPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return res.status(404).send('Arquivo index.html não encontrado');
  }
  
  res.sendFile(indexPath);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Zyra Frontend rodando na porta ${PORT}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'production'}`);
});

// Tratamento de erros
process.on('uncaughtException', (err) => {
  console.error('Erro não capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Promise rejeitada não tratada:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Fechando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido. Fechando servidor...');
  process.exit(0);
});

module.exports = app;

