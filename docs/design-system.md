# 🎨 Zyra - Design System

## 🎯 Cores Principais

### Paleta de Cores
- **Primary (Roxo)**: `#7d26d9` - Cor principal da marca
- **Secondary (Laranja)**: `#fb8f37` - Cor de destaque e ações
- **Neutral (Cinza)**: `#ebeaeb` - Cor de fundo e elementos neutros

### Variações das Cores
```css
/* Primary - Roxo */
primary-50: #f3f0ff
primary-100: #e9e3ff
primary-200: #d6ccff
primary-300: #b8a6ff
primary-400: #9373ff
primary-500: #7d26d9 (COR PRINCIPAL)
primary-600: #6b1bc7
primary-700: #5a15a8
primary-800: #4a1288
primary-900: #3e0f6f

/* Secondary - Laranja */
secondary-50: #fef7f0
secondary-100: #fdeee0
secondary-200: #fad9c0
secondary-300: #f6be96
secondary-400: #f19a6a
secondary-500: #fb8f37 (COR PRINCIPAL)
secondary-600: #ec7a2b
secondary-700: #c56225
secondary-800: #9e4f25
secondary-900: #804221

/* Neutral - Cinza */
neutral-50: #fafafa
neutral-100: #f5f5f5
neutral-200: #ebeaeb (COR PRINCIPAL)
neutral-300: #d4d4d4
neutral-400: #a3a3a3
neutral-500: #737373
neutral-600: #525252
neutral-700: #404040
neutral-800: #262626
neutral-900: #171717
```

## 🔤 Tipografia

### Fonte Principal
- **Família**: Roboto
- **Pesos**: 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold)

### Tamanhos de Texto
```css
text-xs: 12px
text-sm: 14px
text-base: 16px
text-lg: 18px
text-xl: 20px
text-2xl: 24px
text-3xl: 30px
text-4xl: 36px
```

## 🎨 Componentes

### Botões
```css
/* Botão Primário */
.btn-primary {
  background: #7d26d9;
  hover: #6b1bc7;
  cor: branco;
  padding: 12px 24px;
  border-radius: 12px;
}

/* Botão Secundário */
.btn-secondary {
  background: #fb8f37;
  hover: #ec7a2b;
  cor: branco;
  padding: 12px 24px;
  border-radius: 12px;
}

/* Botão Outline */
.btn-outline {
  border: 2px solid #7d26d9;
  cor: #7d26d9;
  hover: fundo #7d26d9, texto branco;
}
```

### Inputs
```css
.input-primary {
  padding: 12px 16px;
  border: 2px solid #d4d4d4;
  border-radius: 12px;
  focus: border #7d26d9;
  background: branco;
}
```

### Cards
```css
.card {
  background: branco;
  border-radius: 16px;
  box-shadow: suave;
  padding: 24px;
}

.card-medium {
  background: branco;
  border-radius: 16px;
  box-shadow: média;
  padding: 32px;
}

.card-strong {
  background: branco;
  border-radius: 16px;
  box-shadow: forte;
  padding: 32px;
}
```

## 📱 Layout Responsivo

### Breakpoints
- **Mobile**: até 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

### Containers
```css
/* Desktop */
.container-custom {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
}

/* Mobile */
.container-mobile {
  max-width: 384px;
  margin: 0 auto;
  padding: 0 16px;
}
```

### Espaçamentos
```css
/* Mobile */
- padding: 16px
- margin: 16px
- gap: 16px

/* Desktop */
- padding: 24px-32px
- margin: 24px-32px
- gap: 24px-32px
```

## 🎯 Princípios de Design

### 1. Simplicidade
- Interface limpa e minimalista
- Foco na funcionalidade
- Menos é mais

### 2. Consistência
- Uso padronizado das cores
- Espaçamentos uniformes
- Componentes reutilizáveis

### 3. Responsividade
- Mobile-first approach
- Adaptação fluida entre dispositivos
- Touch-friendly em mobile

### 4. Acessibilidade
- Contraste adequado
- Tamanhos de toque apropriados
- Navegação por teclado

## 📋 Guia de Uso

### Quando usar cada cor:
- **Primary (#7d26d9)**: Botões principais, links, elementos de destaque
- **Secondary (#fb8f37)**: Ações secundárias, alertas, notificações
- **Neutral (#ebeaeb)**: Fundos, bordas, elementos neutros

### Quando usar cada componente:
- **btn-primary**: Ações principais (salvar, confirmar, entrar)
- **btn-secondary**: Ações secundárias (cancelar, voltar)
- **btn-outline**: Ações terciárias (editar, visualizar)
- **card**: Conteúdo principal
- **card-medium**: Conteúdo com mais destaque
- **card-strong**: Conteúdo de máxima importância

### Mobile:
- Botões maiores (py-4 px-8)
- Inputs maiores (py-4)
- Cards com padding reduzido (p-4)
- Border-radius menor (rounded-xl)

---

**Desenvolvido para Zyra - Sistema de Monitoramento**  
*Design System v1.0*
