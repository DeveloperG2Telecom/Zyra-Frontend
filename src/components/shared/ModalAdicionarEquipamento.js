import React, { useState, useEffect } from 'react';
import { useCache } from '../../contexts/CacheContext';

const ModalAdicionarEquipamento = ({ isVisible, onClose, onSave }) => {
  const { loadTiposAcesso, loadPops, loadFuncoes } = useCache();
  const [masterData, setMasterData] = useState({
    tiposAcesso: [],
    pops: [],
    funcoes: []
  });

  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    modelo: '',
    serialMac: '',
    ipPrivado: '',
    ipPublico: '',
    localidade: {
      lat: '',
      lng: '',
      endereco: ''
    },
    quantidadePortas: '',
    alimentacao: '',
    dataAquisicao: '',
    tempoGarantia: '',
    versaoFirmware: '',
    modoAcesso: '',
    funcoes: [],
    status: 'Ativo',
    pop: '',
    redeRural: '',
    equipamentoAnterior: '',
    equipamentoPosterior: '',
    fotoEquipamento: '',
    observacoes: ''
  });

  const [funcaoInput, setFuncaoInput] = useState('');

  // Carregar dados mestres quando o modal abrir
  useEffect(() => {
    if (isVisible) {
      const loadMasterData = async () => {
        try {
          console.log('🔍 MODAL: Carregando dados mestres...');
          const [tiposAcesso, pops, funcoes] = await Promise.all([
            loadTiposAcesso(),
            loadPops(),
            loadFuncoes()
          ]);
          
          setMasterData({
            tiposAcesso: tiposAcesso || [],
            pops: pops || [],
            funcoes: funcoes || []
          });
          
          console.log('✅ MODAL: Dados mestres carregados:', { tiposAcesso, pops, funcoes });
        } catch (error) {
          console.error('❌ MODAL: Erro ao carregar dados mestres:', error);
        }
      };
      
      loadMasterData();
    }
  }, [isVisible, loadTiposAcesso, loadPops, loadFuncoes]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFuncao = () => {
    if (funcaoInput.trim()) {
      setFormData(prev => ({
        ...prev,
        funcoes: [...prev.funcoes, funcaoInput.trim()]
      }));
      setFuncaoInput('');
    }
  };

  const handleRemoveFuncao = (index) => {
    setFormData(prev => ({
      ...prev,
      funcoes: prev.funcoes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🔍 MODAL: Formulário submetido!', formData);
    console.log('🔍 MODAL: Função onSave:', onSave);
    console.log('🔍 MODAL: Dados completos do formData:', JSON.stringify(formData, null, 2));
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      nome: '',
      tipo: '',
      modelo: '',
      serialMac: '',
      ipPrivado: '',
      ipPublico: '',
      localidade: {
        lat: '',
        lng: '',
        endereco: ''
      },
      quantidadePortas: '',
      alimentacao: '',
      dataAquisicao: '',
      tempoGarantia: '',
      versaoFirmware: '',
      modoAcesso: '',
      funcoes: [],
      status: 'Ativo',
      pop: '',
      redeRural: '',
      equipamentoAnterior: '',
      equipamentoPosterior: '',
      fotoEquipamento: '',
      observacoes: ''
    });
    setFuncaoInput('');
    onClose();
  };

  if (!isVisible) {
    return null;
  }
  
  return (
    <div 
      style={{
      position: 'fixed',
        top: '60px',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
      }}
      onClick={handleClose}
    >
      <div 
        style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '1000px',
        width: '100%',
        maxHeight: 'calc(100vh - 100px)',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do modal */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e5e5'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(125, 38, 217, 0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              ➕
            </div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#404040',
                marginBottom: '2px'
              }}>
                Adicionar Equipamento
              </h3>
              <p style={{
                fontSize: '12px',
                color: '#737373',
                margin: 0
              }}>
                Preencha os dados do novo equipamento
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(115, 115, 115, 0.1)',
            border: '1px solid rgba(115, 115, 115, 0.2)',
            borderRadius: '6px',
            color: '#737373',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '16px',
            fontWeight: 'bold'
            }}
            onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(115, 115, 115, 0.2)';
            e.target.style.color = '#404040';
            }}
            onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(115, 115, 115, 0.1)';
            e.target.style.color = '#737373';
            }}
          >
            ×
          </button>
        </div>
        
        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
          }}
        >
          {/* Coluna esquerda */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Nome do Equipamento */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Nome do Equipamento *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Ex: Router Principal - Matriz"
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
                required
              />
            </div>

            {/* Tipo do Equipamento */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Tipo do Equipamento *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value)}
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
                required
              >
                <option value="">Selecione o tipo...</option>
                <option value="MIKROTIK">MIKROTIK</option>
                <option value="MK CONCENTRADOR">MK CONCENTRADOR</option>
                <option value="RADIO PTP">RADIO PTP</option>
                <option value="AP">AP</option>
                <option value="MIMOSA">MIMOSA</option>
                <option value="OLT">OLT</option>
                <option value="ROTEADOR">ROTEADOR</option>
                <option value="OUTROS">OUTROS</option>
              </select>
            </div>
            
            {/* Modelo */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Modelo
              </label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => handleInputChange('modelo', e.target.value)}
                placeholder="Ex: RB4011iGS+RM"
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              />
            </div>

            {/* Status */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              >
                <option value="Ativo">Ativo</option>
                <option value="Em Manutenção">Em Manutenção</option>
                <option value="Reserva">Reserva</option>
                <option value="Descartado">Descartado</option>
                <option value="Em Teste">Em Teste</option>
              </select>
            </div>
            
            {/* Serial/MAC */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Serial/MAC
              </label>
              <input
                type="text"
                value={formData.serialMac}
                onChange={(e) => handleInputChange('serialMac', e.target.value)}
                placeholder="Ex: 1234567890ABCD"
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'monospace'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              />
            </div>
            
            {/* IP Privado */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                IP Privado
              </label>
              <input
                type="text"
                value={formData.ipPrivado}
                onChange={(e) => handleInputChange('ipPrivado', e.target.value)}
                placeholder="Ex: 192.168.1.1"
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'monospace'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              />
            </div>
            
            {/* IP Público */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                IP Público
              </label>
              <input
                type="text"
                value={formData.ipPublico}
                onChange={(e) => handleInputChange('ipPublico', e.target.value)}
                placeholder="Ex: 200.123.45.67"
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'monospace'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              />
            </div>
            
            {/* Endereço da Localidade */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Endereço da Localidade
              </label>
              <input
                type="text"
                value={formData.localidade.endereco}
                onChange={(e) => handleInputChange('localidade', { ...formData.localidade, endereco: e.target.value })}
                placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo - SP"
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              />
            </div>
            
            {/* Endereço Completo */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Endereço Completo
              </label>
              <textarea
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                placeholder="Ex: Rua das Flores, 123 - Centro"
                rows={3}
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              />
            </div>

            {/* Coordenadas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <div>
                <label style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#404040',
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.localidade.lat}
                  onChange={(e) => handleInputChange('localidade', { ...formData.localidade, lat: parseFloat(e.target.value) || '' })}
                  placeholder="Ex: -23.5505"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #d4d4d4',
                    borderRadius: '6px',
                    fontSize: '12px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                  onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
                />
              </div>
              <div>
                <label style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#404040',
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.localidade.lng}
                  onChange={(e) => handleInputChange('localidade', { ...formData.localidade, lng: parseFloat(e.target.value) || '' })}
                  placeholder="Ex: -46.6333"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #d4d4d4',
                    borderRadius: '6px',
                    fontSize: '12px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                  onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
                />
              </div>
            </div>

            {/* Quantidade de Portas */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Quantidade de Portas
              </label>
              <input
                type="number"
                value={formData.quantidadePortas}
                onChange={(e) => handleInputChange('quantidadePortas', e.target.value)}
                placeholder="Ex: 24"
                min={0}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #d4d4d4',
                  borderRadius: '6px',
                  fontSize: '12px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              />
            </div>

            {/* Alimentação */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Alimentação
              </label>
              <select
                value={formData.alimentacao}
                onChange={(e) => handleInputChange('alimentacao', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #d4d4d4',
                  borderRadius: '6px',
                  fontSize: '12px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              >
                <option value="">Selecione a alimentação</option>
                <option value="PoE">PoE (Power over Ethernet)</option>
                <option value="AC">AC (Corrente Alternada)</option>
                <option value="DC">DC (Corrente Contínua)</option>
                <option value="Bateria">Bateria</option>
                <option value="Solar">Solar</option>
              </select>
            </div>

            {/* POP */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                POP
              </label>
              <select
                value={formData.pop}
                onChange={(e) => handleInputChange('pop', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #d4d4d4',
                  borderRadius: '6px',
                  fontSize: '12px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              >
                <option value="">Selecione um POP...</option>
                {masterData.pops.map(pop => (
                  <option key={pop.id} value={pop.nome}>
                    {pop.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Rede Rural */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Rede Rural
              </label>
              <input
                type="text"
                value={formData.redeRural}
                onChange={(e) => handleInputChange('redeRural', e.target.value)}
                placeholder="Ex: Rede Rural Centro"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #d4d4d4',
                  borderRadius: '6px',
                  fontSize: '12px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              />
            </div>
          </div>
          
          {/* Coluna direita */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Modo de Acesso */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Modo de Acesso
              </label>
              <select
                value={formData.modoAcesso}
                onChange={(e) => handleInputChange('modoAcesso', e.target.value)}
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              >
                <option value="">Selecione o modo</option>
                {masterData.tiposAcesso.map(tipo => (
                  <option key={tipo.id} value={tipo.nome}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Funções */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Funções do Equipamento
              </label>
              <select
                value=""
                onChange={(e) => {
                  const selectedFuncao = e.target.value;
                  if (selectedFuncao && !formData.funcoes.includes(selectedFuncao)) {
                    setFormData(prev => ({
                      ...prev,
                      funcoes: [...prev.funcoes, selectedFuncao]
                    }));
                  }
                }}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '2px solid #d4d4d4',
                  borderRadius: '4px',
                  fontSize: '11px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              >
                <option value="">Selecione uma função...</option>
                {masterData.funcoes.map(funcao => (
                  <option key={funcao.id} value={funcao.nome}>
                    {funcao.nome}
                  </option>
                ))}
              </select>
              
              {/* Lista de funções selecionadas */}
              {formData.funcoes.length > 0 && (
                <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                  gap: '6px',
                  marginTop: '8px'
                }}>
                  {formData.funcoes.map((funcao, index) => (
                    <div
                      key={index}
                      style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'rgba(125, 38, 217, 0.1)',
                    color: '#7d26d9',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px'
                      }}
                    >
                      <span>{funcao}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFuncao(index)}
                        style={{
                      background: 'none',
                      border: 'none',
                      color: '#7d26d9',
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '0',
                      marginLeft: '4px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Data de Aquisição */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Data de Aquisição
              </label>
              <input
                type="date"
                value={formData.dataAquisicao}
                onChange={(e) => handleInputChange('dataAquisicao', e.target.value)}
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              />
            </div>
            
            {/* Tempo de Garantia */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Tempo de Garantia
              </label>
              <input
                type="text"
                value={formData.tempoGarantia}
                onChange={(e) => handleInputChange('tempoGarantia', e.target.value)}
                placeholder="Ex: 12 meses, 2 anos"
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              />
            </div>
            
            {/* Versão de Firmware */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Versão de Firmware
              </label>
              <input
                type="text"
                value={formData.versaoFirmware}
                onChange={(e) => handleInputChange('versaoFirmware', e.target.value)}
                placeholder="Ex: 7.8.1"
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'monospace'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              />
            </div>

            {/* Equipamento Anterior */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Equipamento Anterior
              </label>
              <input
                type="text"
                value={formData.equipamentoAnterior}
                onChange={(e) => handleInputChange('equipamentoAnterior', e.target.value)}
                placeholder="Ex: Router Antigo - Desativado"
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              />
            </div>

            {/* Equipamento Posterior */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Equipamento Posterior
              </label>
              <input
                type="text"
                value={formData.equipamentoPosterior}
                onChange={(e) => handleInputChange('equipamentoPosterior', e.target.value)}
                placeholder="Ex: Router Futuro - Planejado"
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              />
            </div>

            {/* Foto do Equipamento */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
              }}>
                Foto do Equipamento
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    console.log('Arquivo selecionado:', file);
                  }
                }}
                style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
                onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
              />
            </div>
          </div>

          {/* Observações (ocupando as duas colunas) */}
          <div style={{
            gridColumn: '1 / -1',
            marginTop: '16px'
          }}>
            <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#404040',
                display: 'block',
                marginBottom: '6px'
            }}>
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Informações adicionais sobre o equipamento..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #d4d4d4',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                resize: 'vertical'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
              onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
            />
          </div>
        </form>

        {/* Botões de ação */}
        <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '16px',
          borderTop: '1px solid #e5e5e5'
        }}>
          <button
            type="button"
            onClick={handleClose}
            style={{
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: '#737373',
            border: '1px solid #d4d4d4',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e5e5e5';
            }}
            onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={(e) => {
            e.preventDefault();
            console.log('Botão salvar clicado!');
            console.log('Dados do formulário:', formData);
            handleSubmit(e);
            }}
            style={{
            padding: '10px 20px',
            backgroundColor: '#7d26d9',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#6b1bb8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#7d26d9'}
          >
            Salvar Equipamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAdicionarEquipamento;