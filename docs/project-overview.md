# 🏗 Zyra - Sistema de Documentação e Monitoramento de Equipamentos para Provedora de Internet

## 📋 Visão Geral

O **Zyra** é um sistema completo de inventário, monitoramento e gestão de equipamentos de rede para provedoras de internet. O sistema evolui de um simples inventário para um NMS (Network Management System) completo, oferecendo controle total sobre a infraestrutura de rede.

## 🎯 Ordem de Desenvolvimento

1. **Criação do banco de dados no Firebase** na conta Google da G2
2. **Back-end conectado no banco**, com rotas de API
3. **Desenvolvimento dos módulos** (em modo desenvolvimento):
   - Gestão Operacional
   - Monitoramento em Tempo Real
   - Alertas e Notificações

## 📌 Funcionalidades Principais

### 1. 📦 Inventário de Equipamentos (Dados Estáticos)

Cada equipamento terá as seguintes informações no cadastro:

- **Identificação**
  - Nome/identificação
  - Modelo
  - Fabricante (Mikrotik, Huawei, Ubiquiti, etc.)
  - Serial/MAC
  - IP público
  - IP privado
  - Foto do equipamento (Firebase Storage)

- **Especificações Técnicas**
  - Quantidade de portas
  - Alimentação (tipo, tensão ou consumo)
  - Data de aquisição
  - Tempo de garantia
  - Versão de firmware/software

- **Localização**
  - Endereço (cidade, endereço, torre, sala técnica, rack)
  - Coordenadas GPS (latitude e longitude)

- **Configuração**
  - Função na rede (OLT, ONU, Switch, Roteador, Rádio, Firewall, etc.)
  - Status atual (ativo, em manutenção, reserva, descartado)
  - Observações técnicas (campo livre)
  - Porta de acesso (opcional)
  - Modo de acesso (telnet, ssh, web, winbox, etc.)

### 2. 🌐 Conectividade e Rede

Documentação das relações entre equipamentos:

- **Conexões**
  - Origem do sinal (ex: POP, torre, servidor de borda)
  - Destino do sinal
  - Rede associada (VLAN, Sub-rede, PPPoE, BGP, ASN)
  - Capacidade máxima suportada (Mbps/Gbps)
  - Histórico de links

- **Topologia da Rede**
  - Tela gráfica para montar diagramas da rede
  - Edição manual da topologia
  - Visualização de conexões (X → Y → Z)

### 3. 🔧 Gestão Operacional

- **Responsabilidade**
  - Responsável técnico (instalador, mantenedor)
  - Fornecedor (revendedor ou fabricante)
  - Nota fiscal / nº do pedido
  - Contrato de garantia ou suporte (SLA)

- **Histórico**
  - Histórico de manutenções (trocas, reparos, upgrades)
  - Logs de alterações (quem editou, quando e o que mudou)

### 4. 📊 Monitoramento em Tempo Real

Evolução para NMS (Network Management System):

- **Coleta Automática**
  - Ping (ICMP) → status online/offline, tempo de resposta
  - SNMP/API/SSH → métricas de CPU, memória, temperatura, tráfego por porta

- **Configuração**
  - Tempo de ping configurável
  - Limite de latência aceitável
  - Parâmetros de coleta personalizáveis

- **Dashboard**
  - Tempo médio de ping por equipamento
  - Quantidade de cada tipo de equipamento
  - Gráficos de tráfego e latência
  - Alertas automáticos

### 5. 🚨 Alertas e Notificações

- **Condições Configuráveis**
  - Ping alto
  - CPU alta
  - Porta saturada
  - Equipamento offline

- **Notificações**
  - Registro de alertas no banco
  - Modal de aviso no sistema
  - Notificações externas (Telegram, WhatsApp, Email)

### 6. 💾 Gestão de Backups

- **Sistema de Backups**
  - Seção própria para cada equipamento
  - Arquivos armazenados no Firebase Storage
  - Registro de data e responsável
  - Histórico completo de backups

- **Sistema de Pendências**
  - Alertas de backup em atraso
  - Dashboard de equipamentos pendentes
  - Configuração de dias limite

### 7. 🔍 Filtros Avançados

Sistema de filtros para facilitar a busca:

- Tipo de equipamento
- Cidade
- Data de aquisição
- Status atual
- Modo de acesso
- Origem do sinal

## 🗄️ Estrutura do Banco de Dados (Firebase Firestore)

```
cidades → lista de cidades atendidas
locais → POPs, torres, racks
tiposEquipamento → switch, roteador, OLT, ONU, rádio
equipamentos → todos os dados estáticos
├── equipamentos/{id}/links → conexões entre equipamentos
├── equipamentos/{id}/metricasPing → histórico de ping
├── equipamentos/{id}/metricasInterface → tráfego por porta
├── equipamentos/{id}/metricasRecurso → CPU, memória, temperatura
└── equipamentos/{id}/backups → arquivos de backup vinculados
alertas → eventos críticos ou pendências
configuracoes → parâmetros gerais
```

## 🛠️ Stack Tecnológica

- **Frontend**: React
- **Backend/API**: Node.js + Express
- **Banco de Dados**: Firebase Firestore
- **Armazenamento**: Firebase Storage
- **Coletor de Métricas**: Scripts Node.js/Python (execução periódica)

## 💼 Exemplo Prático de Uso

### Dashboard Principal
O técnico acessa e visualiza:
- Ping médio dos equipamentos
- Quantidade de switches, rádios e roteadores
- Alertas ativos (ex: "Switch Torre A acima de 200ms de latência")

### Gestão de Backups
- Último backup de cada equipamento
- Pendências (ex: "Faz 45 dias sem backup do Roteador POP Central")

### Topologia de Rede
- Edição de conexões em tempo real
- Redirecionamento de equipamentos
- Visualização gráfica da rede

### Configurações
- Ajuste de parâmetros globais
- Configuração de alertas
- Definição de limites de monitoramento

## 🚀 Próximos Passos

1. Configuração do ambiente Firebase
2. Desenvolvimento da API backend
3. Implementação do frontend React
4. Integração dos módulos de monitoramento
5. Testes e deploy

---

**Desenvolvido para G2 - Provedora de Internet**  
*Sistema completo de gestão e monitoramento de infraestrutura de rede*
