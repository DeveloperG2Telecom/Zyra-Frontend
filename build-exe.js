#!/usr/bin/env node

/**
 * Script auxiliar para build do executável do Frontend
 * Facilita o processo de criação do executável com pkg
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Iniciando build do executável Zyra Frontend...\n');

// Verificar se o build existe
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  console.log('📦 Build não encontrado. Executando build do React...\n');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('\n✅ Build do React concluído!\n');
  } catch (error) {
    console.error('\n❌ Erro ao fazer build do React:', error.message);
    process.exit(1);
  }
}

// Verificar se o pkg está instalado
try {
  require.resolve('pkg');
} catch (e) {
  console.error('❌ Erro: pkg não está instalado!');
  console.log('📦 Instalando pkg...');
  execSync('npm install --save-dev pkg', { stdio: 'inherit' });
}

// Criar diretório dist se não existir
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('📁 Diretório dist criado');
}

// Detectar sistema operacional
const platform = process.platform;
let target = '';

switch (platform) {
  case 'win32':
    target = 'node18-win-x64';
    console.log('🪟 Sistema detectado: Windows');
    break;
  case 'linux':
    target = 'node18-linux-x64';
    console.log('🐧 Sistema detectado: Linux');
    break;
  case 'darwin':
    target = 'node18-macos-x64';
    console.log('🍎 Sistema detectado: macOS');
    break;
  default:
    console.log('⚠️  Sistema não reconhecido, usando todos os targets');
    target = 'node18-win-x64,node18-linux-x64,node18-macos-x64';
}

console.log(`\n🎯 Target: ${target}`);
console.log('📦 Iniciando empacotamento...\n');

try {
  // Executar pkg usando npx (para garantir que use a versão local)
  const entryFile = path.resolve(__dirname, 'server.js');
  const outputName = platform === 'win32' ? 'zyra-frontend.exe' : 'zyra-frontend';
  
  // No Windows, usar barras normais no comando
  const entryFileNormalized = entryFile.replace(/\\/g, '/');
  const distPathNormalized = path.resolve(__dirname, 'dist').replace(/\\/g, '/');
  
  const command = `npx pkg "${entryFileNormalized}" --targets ${target} --output-path "${distPathNormalized}" --output "${outputName}"`;
  execSync(command, { stdio: 'inherit', shell: true });
  
  console.log('\n✅ Build concluído com sucesso!');
  console.log(`📦 Executável gerado em: ${distDir}`);
  
  // Copiar pasta build para dist
  const buildDest = path.join(distDir, 'build');
  if (fs.existsSync(buildDest)) {
    // Remover build antigo se existir
    fs.rmSync(buildDest, { recursive: true, force: true });
  }
  
  console.log('📁 Copiando pasta build para dist...');
  copyDirectory(buildDir, buildDest);
  
  // Listar arquivos gerados
  const files = fs.readdirSync(distDir);
  console.log('\n📄 Arquivos gerados:');
  files.forEach(file => {
    const filePath = path.join(distDir, file);
    if (fs.statSync(filePath).isFile()) {
      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`   - ${file} (${sizeMB} MB)`);
    } else {
      console.log(`   - ${file}/ (diretório)`);
    }
  });
  
  console.log('\n💡 Próximos passos:');
  console.log('   1. Execute o executável');
  console.log('   2. Acesse http://localhost:10000 no navegador');
  console.log('   3. Configure a URL da API no arquivo .env se necessário');
  
} catch (error) {
  console.error('\n❌ Erro durante o build:', error.message);
  process.exit(1);
}

// Função auxiliar para copiar diretório
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

