# 🔄 Sistema Universal de Loading - Zyra

## 📋 Visão Geral

O sistema de loading universal da Zyra utiliza o **loading em forma de Z** como identidade visual única em todo o sistema. Todos os loadings seguem o mesmo padrão visual e comportamento.

## 🎯 Características

- **Identidade Visual**: Loading em forma de Z (marca Zyra)
- **Animação Contínua**: Sem pausas ou interrupções
- **Sistema Global**: Gerenciado por contexto React
- **Configurável**: Diferentes tamanhos e mensagens
- **Reutilizável**: Um componente para todo o sistema

## 🚀 Como Usar

### 1. **Hook Simples**
```javascript
import { useLoading } from '../contexts/LoadingContext';

function MeuComponente() {
  const { showLoading, hideLoading } = useLoading();
  
  const handleAction = () => {
    showLoading('Processando...');
    // Sua lógica aqui
    setTimeout(() => hideLoading(), 2000);
  };
}
```

### 2. **Hook com Funções Auxiliares**
```javascript
import { useLoadingActions } from '../hooks/useLoading';

function MeuComponente() {
  const { withLoading, simulateLoading } = useLoadingActions();
  
  // Para funções assíncronas
  const handleAsync = () => {
    withLoading(async () => {
      await minhaFuncaoAsync();
    }, 'Carregando dados...');
  };
  
  // Para simular loading
  const handleSimulate = () => {
    simulateLoading(3000, 'Salvando...');
  };
}
```

### 3. **Componente Direto**
```javascript
import UniversalLoading from '../components/UniversalLoading';

// Loading inline (sem overlay)
<UniversalLoading 
  size="medium" 
  message="Carregando..." 
/>

// Loading com overlay
<UniversalLoading 
  overlay={true}
  message="Processando..." 
  size="large"
/>
```

## ⚙️ Configurações

### **Tamanhos Disponíveis**
- `small`: 30x30px
- `medium`: 60x60px (padrão)
- `large`: 90x90px
- `xlarge`: 120x120px

### **Propriedades**
- `size`: Tamanho do loading
- `color`: Cor do Z (padrão: #7d26d9)
- `overlay`: Se deve mostrar overlay escuro
- `message`: Mensagem de texto
- `showMessage`: Se deve mostrar a mensagem

## 🎨 Exemplos de Uso

### **Login/Autenticação**
```javascript
showLoading('Entrando no sistema...');
```

### **Carregamento de Dados**
```javascript
showLoading('Carregando equipamentos...');
```

### **Salvamento**
```javascript
showLoading('Salvando configurações...');
```

### **Processamento**
```javascript
showLoading('Processando dados...');
```

## 🔧 Implementação Técnica

### **Contexto Global**
- `LoadingContext`: Gerencia estado global
- `LoadingProvider`: Provedor do contexto
- `useLoading`: Hook para acessar o contexto

### **Componente Universal**
- `UniversalLoading`: Componente reutilizável
- SVG animado com CSS
- Configurável via props

### **Hooks Auxiliares**
- `useLoadingActions`: Funções auxiliares
- `withLoading`: Wrapper para funções async
- `simulateLoading`: Simulação de loading

## 📱 Responsividade

O loading se adapta automaticamente:
- **Mobile**: Tamanhos menores
- **Desktop**: Tamanhos maiores
- **Overlay**: Sempre centralizado

## 🎯 Benefícios

1. **Consistência Visual**: Mesmo loading em todo o sistema
2. **Identidade da Marca**: Z representa a Zyra
3. **Experiência Uniforme**: Comportamento padronizado
4. **Fácil Manutenção**: Um componente para tudo
5. **Performance**: Animação otimizada

## 🚀 Próximos Passos

- [ ] Adicionar mais tamanhos se necessário
- [ ] Implementar loading em botões específicos
- [ ] Adicionar animações de entrada/saída
- [ ] Criar variações de cor por contexto

---

**Desenvolvido para Zyra - Sistema de Monitoramento**  
*Loading Universal v1.0*
