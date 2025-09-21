// Dados mock centralizados para todo o sistema
export const equipamentos = [
  {
    id: 1,
    nome: 'Router Principal - Matriz',
    modelo: 'RB4011iGS+RM',
    fabricante: 'Mikrotik',
    serial: '7C2E8D123456',
    mac: '48:8F:5A:2E:8D:12',
    ipPublico: '200.160.2.100',
    ipPrivado: '192.168.1.1',
    foto: '/logo-sem-fundo.png',
    portas: 10,
    alimentacao: 'PoE+ 24V, 30W',
    dataAquisicao: '2023-01-15',
    garantia: '24 meses',
    firmware: 'RouterOS 7.10.2',
    localidade: 'São Paulo - SP',
    status: 'online',
    tipo: 'Router',
    posicao: { x: 200, y: 150 },
    conexoes: [2],
    equipamentoAnterior: null,
    equipamentoProximo: {
      id: 2,
      nome: 'Switch Core - Data Center',
      ipPrivado: '192.168.1.2'
    },
    // Dados de monitoramento
    ultimoPing: new Date().toISOString(),
    latencia: Math.floor(Math.random() * 20) + 5,
    cpu: Math.floor(Math.random() * 30) + 10,
    memoria: Math.floor(Math.random() * 40) + 20,
    temperatura: Math.floor(Math.random() * 15) + 45,
    uptime: '15 dias, 8 horas',
    // Dados de backup
    ultimoBackup: '2024-01-10T10:30:00Z',
    statusBackup: 'em-dia',
    diasSemBackup: 0,
    responsavelUltimoBackup: 'João Silva',
    totalBackups: 12,
    // Campos adicionais
    endereco: {
      cidade: 'São Paulo',
      estado: 'SP',
      endereco: 'Av. Paulista, 1000',
      torre: 'Torre A - 15º andar',
      salaTecnica: 'Sala Técnica 01',
      rack: 'Rack 01 - Posição 15U',
      coordenadasGPS: '-23.5505, -46.6333'
    },
    localizacao: {
      latitude: -23.5505,
      longitude: -46.6333
    },
    funcaoRede: 'Gateway Principal - Roteamento de Tráfego',
    statusAtual: 'ativo',
    observacoesTecnicas: 'Equipamento principal da rede. Configurado com BGP e OSPF. Backup automático diário.',
    portaAcesso: '22',
    modoAcesso: 'SSH',
    origemSinal: 'POP Principal - Provedor XYZ',
    destinoSinal: 'Rede Interna - VLAN 100',
    redeAssociada: {
      vlan: 'VLAN 100',
      subrede: '192.168.1.0/24',
      pppoe: 'N/A',
      bgp: 'ASN 12345',
      outros: 'OSPF Area 0'
    },
    capacidadeMaxima: '10 Gbps',
    responsavelTecnico: {
      instalador: 'João Silva',
      mantenedor: 'Maria Santos'
    },
    fornecedor: 'TechNet Distribuidora',
    notaFiscal: 'NF-2023-001234',
    numeroPedido: 'PED-2023-001',
    contratoGarantia: 'SLA 99.9% - Suporte 24/7',
    historicoManutencoes: [
      {
        data: '2023-03-15',
        tipo: 'Upgrade',
        descricao: 'Atualização do firmware para RouterOS 7.10.2',
        responsavel: 'João Silva'
      },
      {
        data: '2023-06-20',
        tipo: 'Manutenção',
        descricao: 'Limpeza e verificação de conectores',
        responsavel: 'Maria Santos'
      }
    ],
    logsAlteracoes: [
      {
        data: '2024-01-14T10:30:00Z',
        usuario: 'João Silva',
        acao: 'Atualização de configuração BGP',
        detalhes: 'Adicionada nova rota para 10.0.0.0/8'
      },
      {
        data: '2024-01-10T14:15:00Z',
        usuario: 'Maria Santos',
        acao: 'Alteração de senha',
        detalhes: 'Senha de acesso SSH alterada'
      }
    ]
  },
  {
    id: 2,
    nome: 'Switch Core - Data Center',
    modelo: 'CRS326-24G-2S+RM',
    fabricante: 'Mikrotik',
    serial: '7C2E8D789012',
    mac: '48:8F:5A:2E:8D:78',
    ipPublico: '200.160.2.101',
    ipPrivado: '192.168.1.2',
    foto: '/logo-sem-fundo.png',
    portas: 26,
    alimentacao: 'AC 100-240V, 20W',
    dataAquisicao: '2023-02-20',
    garantia: '36 meses',
    firmware: 'RouterOS 7.12.1',
    localidade: 'São Paulo - SP',
    status: 'online',
    tipo: 'Switch',
    posicao: { x: 400, y: 150 },
    conexoes: [1, 3],
    equipamentoAnterior: {
      id: 1,
      nome: 'Router Principal - Matriz',
      ipPrivado: '192.168.1.1'
    },
    equipamentoProximo: {
      id: 3,
      nome: 'AP WiFi - Piso 1',
      ipPrivado: '192.168.1.10'
    },
    // Dados de monitoramento
    ultimoPing: new Date().toISOString(),
    latencia: Math.floor(Math.random() * 15) + 3,
    cpu: Math.floor(Math.random() * 25) + 5,
    memoria: Math.floor(Math.random() * 30) + 15,
    temperatura: Math.floor(Math.random() * 10) + 40,
    uptime: '22 dias, 12 horas',
    // Dados de backup
    ultimoBackup: '2024-01-12T14:15:00Z',
    statusBackup: 'em-dia',
    diasSemBackup: 0,
    responsavelUltimoBackup: 'Maria Santos',
    totalBackups: 8,
    // Campos adicionais
    endereco: {
      cidade: 'São Paulo',
      estado: 'SP',
      endereco: 'Av. Paulista, 2000',
      torre: 'Torre B - 20º andar',
      salaTecnica: 'Sala Técnica 02',
      rack: 'Rack 02 - Posição 10U',
      coordenadasGPS: '-23.5505, -46.6333'
    },
    localizacao: {
      latitude: -23.5505,
      longitude: -46.6333
    },
    funcaoRede: 'Switch Core - Distribuição de Tráfego',
    statusAtual: 'ativo',
    observacoesTecnicas: 'Switch principal do data center. Configurado com VLANs e trunking.',
    portaAcesso: '22',
    modoAcesso: 'SSH',
    origemSinal: 'Router Principal',
    destinoSinal: 'Switches de Acesso',
    redeAssociada: {
      vlan: 'VLAN 200',
      subrede: '192.168.2.0/24',
      pppoe: 'N/A',
      bgp: 'N/A',
      outros: 'STP, VTP'
    },
    capacidadeMaxima: '1 Gbps',
    responsavelTecnico: {
      instalador: 'Maria Santos',
      mantenedor: 'Carlos Lima'
    },
    fornecedor: 'TechNet Distribuidora',
    notaFiscal: 'NF-2023-001235',
    numeroPedido: 'PED-2023-002',
    contratoGarantia: 'SLA 99.5% - Suporte 8x5',
    historicoManutencoes: [
      {
        data: '2023-04-10',
        tipo: 'Manutenção',
        descricao: 'Limpeza de ventiladores e verificação de temperatura',
        responsavel: 'Maria Santos'
      }
    ],
    logsAlteracoes: [
      {
        data: '2024-01-12T09:15:00Z',
        usuario: 'Carlos Lima',
        acao: 'Configuração de VLAN',
        detalhes: 'Criada VLAN 200 para departamento de TI'
      }
    ]
  },
  {
    id: 3,
    nome: 'AP WiFi - Piso 1',
    modelo: 'cAP ac',
    fabricante: 'Mikrotik',
    serial: '7C2E8D345678',
    mac: '48:8F:5A:2E:8D:34',
    ipPublico: '200.160.2.102',
    ipPrivado: '192.168.1.10',
    foto: '/logo-sem-fundo.png',
    portas: 1,
    alimentacao: 'PoE 24V, 6W',
    dataAquisicao: '2023-03-10',
    garantia: '12 meses',
    firmware: 'RouterOS 7.11.3',
    localidade: 'São Paulo - SP',
    status: 'atencao',
    tipo: 'Access Point',
    posicao: { x: 300, y: 300 },
    conexoes: [2],
    equipamentoAnterior: {
      id: 2,
      nome: 'Switch Core - Data Center',
      ipPrivado: '192.168.1.2'
    },
    equipamentoProximo: {
      id: 4,
      nome: 'Router Filial - Rio',
      ipPrivado: '192.168.2.1'
    },
    // Dados de monitoramento
    ultimoPing: new Date().toISOString(),
    latencia: Math.floor(Math.random() * 50) + 20,
    cpu: Math.floor(Math.random() * 60) + 30,
    memoria: Math.floor(Math.random() * 50) + 40,
    temperatura: Math.floor(Math.random() * 20) + 50,
    uptime: '8 dias, 3 horas',
    // Dados de backup
    ultimoBackup: '2023-12-15T09:45:00Z',
    statusBackup: 'pendente',
    diasSemBackup: 31,
    responsavelUltimoBackup: 'Carlos Lima',
    totalBackups: 5
  },
  {
    id: 4,
    nome: 'Router Filial - Rio',
    modelo: 'RB750Gr3',
    fabricante: 'Mikrotik',
    serial: '7C2E8D901234',
    mac: '48:8F:5A:2E:8D:90',
    ipPublico: '200.160.3.100',
    ipPrivado: '192.168.2.1',
    foto: '/logo-sem-fundo.png',
    portas: 5,
    alimentacao: 'AC 100-240V, 8W',
    dataAquisicao: '2023-04-05',
    garantia: '24 meses',
    firmware: 'RouterOS 7.9.5',
    localidade: 'Rio de Janeiro - RJ',
    status: 'online',
    tipo: 'Router',
    posicao: { x: 600, y: 200 },
    conexoes: [5],
    equipamentoAnterior: {
      id: 3,
      nome: 'AP WiFi - Piso 1',
      ipPrivado: '192.168.1.10'
    },
    equipamentoProximo: {
      id: 5,
      nome: 'Switch Edge - Filial BH',
      ipPrivado: '192.168.3.1'
    },
    // Dados de monitoramento
    ultimoPing: new Date().toISOString(),
    latencia: Math.floor(Math.random() * 30) + 10,
    cpu: Math.floor(Math.random() * 35) + 15,
    memoria: Math.floor(Math.random() * 35) + 25,
    temperatura: Math.floor(Math.random() * 12) + 42,
    uptime: '12 dias, 6 horas',
    // Dados de backup
    ultimoBackup: '2024-01-08T16:20:00Z',
    statusBackup: 'em-dia',
    diasSemBackup: 0,
    responsavelUltimoBackup: 'Ana Costa',
    totalBackups: 6
  },
  {
    id: 5,
    nome: 'Switch Edge - Filial BH',
    modelo: 'CRS125-24G-1S-2HnD-IN',
    fabricante: 'Mikrotik',
    serial: '7C2E8D567890',
    mac: '48:8F:5A:2E:8D:56',
    ipPublico: '200.160.4.100',
    ipPrivado: '192.168.3.1',
    foto: '/logo-sem-fundo.png',
    portas: 24,
    alimentacao: 'AC 100-240V, 15W',
    dataAquisicao: '2023-05-12',
    garantia: '24 meses',
    firmware: 'RouterOS 7.8.2',
    localidade: 'Belo Horizonte - MG',
    status: 'offline',
    tipo: 'Switch',
    posicao: { x: 500, y: 400 },
    conexoes: [4],
    equipamentoAnterior: {
      id: 4,
      nome: 'Router Filial - Rio',
      ipPrivado: '192.168.2.1'
    },
    equipamentoProximo: null,
    // Dados de monitoramento
    ultimoPing: null,
    latencia: null,
    cpu: null,
    memoria: null,
    temperatura: null,
    uptime: '0 dias, 0 horas',
    // Dados de backup
    ultimoBackup: '2023-11-20T11:30:00Z',
    statusBackup: 'critico',
    diasSemBackup: 56,
    responsavelUltimoBackup: 'Pedro Oliveira',
    totalBackups: 3
  },
  {
    id: 6,
    nome: 'OLT Principal - Data Center',
    modelo: 'MA5800-X17',
    fabricante: 'Huawei',
    serial: 'HUAWEI123456',
    mac: '00:E0:FC:12:34:56',
    ipPublico: '200.160.5.100',
    ipPrivado: '192.168.5.1',
    foto: '/logo-sem-fundo.png',
    portas: 16,
    alimentacao: 'AC 100-240V, 150W',
    dataAquisicao: '2023-06-15',
    garantia: '36 meses',
    firmware: 'V800R019C00SPC200',
    localidade: 'São Paulo - SP',
    status: 'online',
    tipo: 'OLT',
    posicao: { x: 100, y: 100 },
    conexoes: [],
    equipamentoAnterior: null,
    equipamentoProximo: null,
    ultimoPing: new Date().toISOString(),
    latencia: Math.floor(Math.random() * 10) + 2,
    cpu: Math.floor(Math.random() * 20) + 5,
    memoria: Math.floor(Math.random() * 30) + 10,
    temperatura: Math.floor(Math.random() * 10) + 40,
    uptime: '45 dias, 12 horas',
    ultimoBackup: '2024-01-14T08:00:00Z',
    statusBackup: 'em-dia',
    diasSemBackup: 0,
    responsavelUltimoBackup: 'João Silva',
    totalBackups: 15
  },
  {
    id: 7,
    nome: 'PTP Link - Torre A para Torre B',
    modelo: 'PowerBeam M5-400',
    fabricante: 'Ubiquiti',
    serial: 'UBIQUITI789',
    mac: '24:5A:4C:78:90:12',
    ipPublico: '200.160.6.100',
    ipPrivado: '192.168.6.1',
    foto: '/logo-sem-fundo.png',
    portas: 1,
    alimentacao: 'PoE 24V, 8W',
    dataAquisicao: '2023-07-20',
    garantia: '24 meses',
    firmware: 'v8.7.0.42988',
    localidade: 'São Paulo - SP',
    status: 'online',
    tipo: 'PTP',
    posicao: { x: 700, y: 200 },
    conexoes: [],
    equipamentoAnterior: null,
    equipamentoProximo: null,
    ultimoPing: new Date().toISOString(),
    latencia: Math.floor(Math.random() * 5) + 1,
    cpu: Math.floor(Math.random() * 15) + 5,
    memoria: Math.floor(Math.random() * 20) + 10,
    temperatura: Math.floor(Math.random() * 15) + 35,
    uptime: '30 dias, 8 horas',
    ultimoBackup: '2024-01-13T16:30:00Z',
    statusBackup: 'em-dia',
    diasSemBackup: 0,
    responsavelUltimoBackup: 'Maria Santos',
    totalBackups: 8
  },
  {
    id: 8,
    nome: 'Firewall Corporativo',
    modelo: 'ASA 5525-X',
    fabricante: 'Cisco',
    serial: 'CISCO987654',
    mac: '00:1B:0C:98:76:54',
    ipPublico: '200.160.7.100',
    ipPrivado: '192.168.7.1',
    foto: '/logo-sem-fundo.png',
    portas: 8,
    alimentacao: 'AC 100-240V, 60W',
    dataAquisicao: '2023-08-10',
    garantia: '36 meses',
    firmware: '9.16(4)',
    localidade: 'São Paulo - SP',
    status: 'online',
    tipo: 'Firewall',
    posicao: { x: 300, y: 100 },
    conexoes: [],
    equipamentoAnterior: null,
    equipamentoProximo: null,
    ultimoPing: new Date().toISOString(),
    latencia: Math.floor(Math.random() * 8) + 2,
    cpu: Math.floor(Math.random() * 25) + 10,
    memoria: Math.floor(Math.random() * 35) + 15,
    temperatura: Math.floor(Math.random() * 12) + 42,
    uptime: '25 dias, 4 horas',
    ultimoBackup: '2024-01-12T12:00:00Z',
    statusBackup: 'em-dia',
    diasSemBackup: 0,
    responsavelUltimoBackup: 'Carlos Lima',
    totalBackups: 10
  }
];

// Gerar mais equipamentos para simular os 100 equipamentos
const gerarEquipamentosAdicionais = () => {
  const equipamentosAdicionais = [];
  const fabricantes = ['Mikrotik', 'Huawei', 'Ubiquiti', 'Cisco', 'TP-Link'];
  const tipos = ['Router', 'Switch', 'Access Point', 'OLT', 'ONU', 'PTP', 'PTMP', 'Firewall', 'UPS', 'Servidor'];
  const cidades = ['São Paulo - SP', 'Rio de Janeiro - RJ', 'Belo Horizonte - MG', 'Salvador - BA', 'Brasília - DF', 'Fortaleza - CE', 'Manaus - AM', 'Recife - PE'];
  const statuses = ['online', 'online', 'online', 'atencao', 'offline']; // Mais online para simular realidade
  
  for (let i = 6; i <= 100; i++) {
    const fabricante = fabricantes[Math.floor(Math.random() * fabricantes.length)];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const cidade = cidades[Math.floor(Math.random() * cidades.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    equipamentosAdicionais.push({
      id: i,
      nome: `${tipo} ${fabricante} - ${cidade.split(' - ')[0]} ${i}`,
      modelo: `${fabricante} ${tipo} ${Math.floor(Math.random() * 1000) + 100}`,
      fabricante: fabricante,
      serial: `${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
      mac: `${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}`,
      ipPublico: `200.160.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}`,
      ipPrivado: `192.168.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}`,
      foto: '/logo-sem-fundo.png',
      portas: Math.floor(Math.random() * 48) + 1,
      alimentacao: 'AC 100-240V, ' + (Math.floor(Math.random() * 50) + 5) + 'W',
      dataAquisicao: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      garantia: `${Math.floor(Math.random() * 36) + 12} meses`,
      firmware: `${fabricante} OS ${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 20) + 1}.${Math.floor(Math.random() * 10) + 1}`,
      localidade: cidade,
      status: status,
      tipo: tipo,
      posicao: { x: Math.floor(Math.random() * 800) + 100, y: Math.floor(Math.random() * 600) + 100 },
      conexoes: [],
      equipamentoAnterior: null,
      equipamentoProximo: null,
      // Dados de monitoramento
      ultimoPing: status !== 'offline' ? new Date().toISOString() : null,
      latencia: status !== 'offline' ? Math.floor(Math.random() * 100) + 5 : null,
      cpu: status !== 'offline' ? Math.floor(Math.random() * 80) + 5 : null,
      memoria: status !== 'offline' ? Math.floor(Math.random() * 80) + 10 : null,
      temperatura: status !== 'offline' ? Math.floor(Math.random() * 30) + 35 : null,
      uptime: status !== 'offline' ? `${Math.floor(Math.random() * 30) + 1} dias, ${Math.floor(Math.random() * 24)} horas` : '0 dias, 0 horas',
      // Dados de backup
      ultimoBackup: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`,
      statusBackup: Math.random() > 0.7 ? 'pendente' : 'em-dia',
      diasSemBackup: Math.floor(Math.random() * 60),
      responsavelUltimoBackup: ['João Silva', 'Maria Santos', 'Carlos Lima', 'Ana Costa', 'Pedro Oliveira'][Math.floor(Math.random() * 5)],
      totalBackups: Math.floor(Math.random() * 20) + 1
    });
  }
  
  return equipamentosAdicionais;
};

// Adicionar equipamentos gerados à lista principal
export const equipamentosCompletos = [...equipamentos, ...gerarEquipamentosAdicionais()];

// Histórico de backups mock
export const historicoBackups = {
  1: [
    { data: '2024-01-10T10:30:00Z', responsavel: 'João Silva', tamanho: '2.3 MB', status: 'sucesso' },
    { data: '2024-01-03T10:30:00Z', responsavel: 'João Silva', tamanho: '2.1 MB', status: 'sucesso' },
    { data: '2023-12-27T10:30:00Z', responsavel: 'Maria Santos', tamanho: '2.0 MB', status: 'sucesso' }
  ],
  2: [
    { data: '2024-01-12T14:15:00Z', responsavel: 'Maria Santos', tamanho: '1.8 MB', status: 'sucesso' },
    { data: '2024-01-05T14:15:00Z', responsavel: 'Maria Santos', tamanho: '1.7 MB', status: 'sucesso' }
  ],
  3: [
    { data: '2023-12-15T09:45:00Z', responsavel: 'Carlos Lima', tamanho: '0.9 MB', status: 'sucesso' },
    { data: '2023-12-01T09:45:00Z', responsavel: 'Carlos Lima', tamanho: '0.8 MB', status: 'sucesso' }
  ],
  4: [
    { data: '2024-01-08T16:20:00Z', responsavel: 'Ana Costa', tamanho: '1.2 MB', status: 'sucesso' },
    { data: '2024-01-01T16:20:00Z', responsavel: 'Ana Costa', tamanho: '1.1 MB', status: 'sucesso' }
  ],
  5: [
    { data: '2023-11-20T11:30:00Z', responsavel: 'Pedro Oliveira', tamanho: '1.5 MB', status: 'sucesso' },
    { data: '2023-11-06T11:30:00Z', responsavel: 'Pedro Oliveira', tamanho: '1.4 MB', status: 'sucesso' }
  ]
};

// Funções utilitárias
export const getStatusColor = (status) => {
  switch (status) {
    case 'online': return '#10b981';
    case 'atencao': return '#f59e0b';
    case 'offline': return '#ef4444';
    default: return '#6b7280';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'online': return 'Online';
    case 'atencao': return 'Atenção';
    case 'offline': return 'Offline';
    default: return 'Desconhecido';
  }
};

export const getMetricaColor = (valor, tipo) => {
  if (tipo === 'latencia') {
    if (valor < 20) return '#10b981';
    if (valor < 50) return '#f59e0b';
    return '#ef4444';
  }
  if (tipo === 'cpu' || tipo === 'memoria') {
    if (valor < 50) return '#10b981';
    if (valor < 80) return '#f59e0b';
    return '#ef4444';
  }
  if (tipo === 'temperatura') {
    if (valor < 50) return '#10b981';
    if (valor < 60) return '#f59e0b';
    return '#ef4444';
  }
  return '#6b7280';
};
