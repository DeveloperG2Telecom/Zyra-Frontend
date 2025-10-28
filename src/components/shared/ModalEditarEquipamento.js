import React, { useState, useEffect } from 'react';
import { useCache } from '../../contexts/CacheContext';

// Estilos reutilizáveis
const styles = {
  label: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#404040',
    display: 'block',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #d4d4d4',
    borderRadius: '6px',
    fontSize: '12px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #d4d4d4',
    borderRadius: '6px',
    fontSize: '12px',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: 'white'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #d4d4d4',
    borderRadius: '6px',
    fontSize: '12px',
    outline: 'none',
    transition: 'border-color 0.2s',
    resize: 'vertical'
  }
};

// Componente de Input reutilizável
const FormInput = ({ label, type = 'text', value, onChange, placeholder, required = false, min, step, accept, rows, style: customStyle = {} }) => {
  const inputStyle = type === 'textarea' ? styles.textarea : styles.input;
  const finalStyle = { ...inputStyle, ...customStyle };
  
  return (
    <div>
      <label style={styles.label}>
        {label} {required && '*'}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          style={finalStyle}
          onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
          onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          step={step}
          accept={accept}
          style={finalStyle}
          onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
          onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
          required={required}
        />
      )}
    </div>
  );
};

// Componente de Select reutilizável
const FormSelect = ({ label, value, onChange, options, placeholder, required = false }) => (
  <div>
    <label style={styles.label}>
      {label} {required && '*'}
    </label>
    <select
      value={value}
      onChange={onChange}
      style={styles.select}
      onFocus={(e) => e.target.style.borderColor = '#7d26d9'}
      onBlur={(e) => e.target.style.borderColor = '#d4d4d4'}
      required={required}
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.id || option.value} value={option.value || option.nome}>
          {option.label || option.nome}
        </option>
      ))}
    </select>
  </div>
);

const ModalEditarEquipamento = ({ isVisible, equipamento, onClose, onSave }) => {
  const { loadTiposAcesso, loadPops, loadFuncoes, loadEquipamentos } = useCache();
  const [masterData, setMasterData] = useState({
    tiposAcesso: [],
    pops: [],
    funcoes: [],
    equipamentos: []
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

  // Carregar dados do equipamento quando o modal abrir
  useEffect(() => {
    if (isVisible && equipamento) {
      console.log('🔍 MODAL EDITAR: Carregando dados do equipamento:', equipamento);
      
      setFormData({
        nome: equipamento.nome || '',
        tipo: equipamento.tipo || '',
        modelo: equipamento.modelo || '',
        serialMac: equipamento.serialMac || '',
        ipPrivado: equipamento.ipPrivado || '',
        ipPublico: equipamento.ipPublico || '',
        localidade: {
          lat: equipamento.localidade?.lat || '',
          lng: equipamento.localidade?.lng || '',
          endereco: equipamento.localidade?.endereco || ''
        },
        quantidadePortas: equipamento.quantidadePortas || '',
        alimentacao: equipamento.alimentacao || '',
        dataAquisicao: equipamento.dataAquisicao || '',
        tempoGarantia: equipamento.tempoGarantia || '',
        versaoFirmware: equipamento.versaoFirmware || '',
        modoAcesso: equipamento.modoAcesso || '',
        funcoes: equipamento.funcoes || [],
        status: equipamento.status || 'Ativo',
        pop: typeof equipamento.pop === 'string' ? equipamento.pop : equipamento.pop?.nome || '',
        redeRural: equipamento.redeRural || '',
        equipamentoAnterior: equipamento.equipamentoAnterior || '',
        equipamentoPosterior: equipamento.equipamentoPosterior || '',
        fotoEquipamento: equipamento.fotoEquipamento || '',
        observacoes: equipamento.observacoes || ''
      });
      setFuncaoInput('');
    }
  }, [isVisible, equipamento]);

  // Carregar dados mestres quando o modal abrir
  useEffect(() => {
    if (isVisible) {
      const loadMasterData = async () => {
        try {
          console.log('🔍 MODAL EDITAR: Carregando dados mestres...');
          const [tiposAcesso, pops, funcoes, equipamentos] = await Promise.all([
            loadTiposAcesso(),
            loadPops(),
            loadFuncoes(),
            loadEquipamentos()
          ]);
          
          setMasterData({
            tiposAcesso: tiposAcesso || [],
            pops: pops || [],
            funcoes: funcoes || [],
            equipamentos: equipamentos || []
          });
          
          console.log('✅ MODAL EDITAR: Dados mestres carregados:', {
            tiposAcesso: tiposAcesso?.length || 0,
            pops: pops?.length || 0,
            funcoes: funcoes?.length || 0,
            equipamentos: equipamentos?.length || 0
          });
        } catch (error) {
          console.error('❌ MODAL EDITAR: Erro ao carregar dados mestres:', error);
        }
      };
      
      loadMasterData();
    }
  }, [isVisible, loadTiposAcesso, loadPops, loadFuncoes, loadEquipamentos]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddFuncao = () => {
    if (funcaoInput.trim() && !formData.funcoes.includes(funcaoInput.trim())) {
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
    console.log('🔍 MODAL EDITAR: Formulário de edição submetido!', formData);
    console.log('🔍 MODAL EDITAR: Função onSave:', onSave);
    console.log('🔍 MODAL EDITAR: Dados completos do formData:', JSON.stringify(formData, null, 2));
    
    // Verificar se onSave é uma função
    if (typeof onSave === 'function') {
      console.log('🔍 MODAL EDITAR: Chamando onSave com ID:', equipamento?.id);
      onSave(equipamento?.id, formData);
    } else {
      console.error('❌ MODAL EDITAR: onSave não é uma função:', typeof onSave);
    }
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

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '95vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 24px 0 24px',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '24px'
        }}>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0,
              marginBottom: '4px'
            }}>
              Editar Equipamento
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              Atualize as informações do equipamento
            </p>
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
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 24px'
        }}>
          <form
            onSubmit={handleSubmit}
            style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            paddingBottom: '20px'
            }}
          >
          {/* Coluna esquerda */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <FormInput
              label="Nome do Equipamento"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Ex: Router Principal - Matriz"
              required
            />

            <FormSelect
              label="Tipo do Equipamento"
              value={formData.tipo}
              onChange={(e) => handleInputChange('tipo', e.target.value)}
              placeholder="Selecione o tipo..."
              options={[
                { value: 'MIKROTIK', label: 'MIKROTIK' },
                { value: 'MK CONCENTRADOR', label: 'MK CONCENTRADOR' },
                { value: 'RADIO PTP', label: 'RADIO PTP' },
                { value: 'AP', label: 'AP' },
                { value: 'MIMOSA', label: 'MIMOSA' },
                { value: 'OLT', label: 'OLT' },
                { value: 'ROTEADOR', label: 'ROTEADOR' },
                { value: 'SWITCH', label: 'SWITCH' },
                { value: 'OUTROS', label: 'OUTROS' }
              ]}
              required
            />
            
            <FormInput
              label="Modelo"
              value={formData.modelo}
              onChange={(e) => handleInputChange('modelo', e.target.value)}
              placeholder="Ex: RB4011iGS+RM"
            />

            <FormSelect
              label="Status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              placeholder="Selecione o status"
              options={[
                { value: 'Ativo', label: 'Ativo' },
                { value: 'Em Manutenção', label: 'Em Manutenção' },
                { value: 'Reserva', label: 'Reserva' },
                { value: 'Descartado', label: 'Descartado' },
                { value: 'Em Teste', label: 'Em Teste' }
              ]}
            />
            
            <FormInput
              label="Serial/MAC"
              value={formData.serialMac}
              onChange={(e) => handleInputChange('serialMac', e.target.value)}
              placeholder="Ex: 1234567890ABCD"
              style={{ fontFamily: 'monospace' }}
            />
            
            <FormInput
              label="IP Privado"
              value={formData.ipPrivado}
              onChange={(e) => handleInputChange('ipPrivado', e.target.value)}
              placeholder="Ex: 192.168.1.1"
              style={{ fontFamily: 'monospace' }}
            />
            
            <FormInput
              label="IP Público"
              value={formData.ipPublico}
              onChange={(e) => handleInputChange('ipPublico', e.target.value)}
              placeholder="Ex: 200.123.45.67"
              style={{ fontFamily: 'monospace' }}
            />
            
            <FormInput
              label="Endereço da Localidade"
              value={formData.localidade.endereco}
              onChange={(e) => handleInputChange('localidade', { ...formData.localidade, endereco: e.target.value })}
              placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo - SP"
            />
            

            {/* Coordenadas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <FormInput
                label="Latitude"
                type="number"
                step="any"
                value={formData.localidade.lat}
                onChange={(e) => handleInputChange('localidade', { ...formData.localidade, lat: parseFloat(e.target.value) || '' })}
                placeholder="Ex: -23.5505"
              />
              <FormInput
                label="Longitude"
                type="number"
                step="any"
                value={formData.localidade.lng}
                onChange={(e) => handleInputChange('localidade', { ...formData.localidade, lng: parseFloat(e.target.value) || '' })}
                placeholder="Ex: -46.6333"
              />
            </div>

            <FormInput
              label="Rede Rural"
              value={formData.redeRural}
              onChange={(e) => handleInputChange('redeRural', e.target.value)}
              placeholder="Ex: Rede Rural Centro"
            />


          </div>
          
          {/* Coluna direita */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <FormInput
              label="Quantidade de Portas"
              type="number"
              value={formData.quantidadePortas}
              onChange={(e) => handleInputChange('quantidadePortas', e.target.value)}
              placeholder="Ex: 24"
              min={0}
            />

            <FormSelect
              label="Alimentação"
              value={formData.alimentacao}
              onChange={(e) => handleInputChange('alimentacao', e.target.value)}
              placeholder="Selecione a alimentação"
              options={[
                { value: 'PoE', label: 'PoE (Power over Ethernet)' },
                { value: 'AC', label: 'AC (Corrente Alternada)' },
                { value: 'DC', label: 'DC (Corrente Contínua)' },
                { value: 'Bateria', label: 'Bateria' },
                { value: 'Solar', label: 'Solar' }
              ]}
            />

            <FormSelect
              label="Modo de Acesso"
              value={formData.modoAcesso}
              onChange={(e) => handleInputChange('modoAcesso', e.target.value)}
              placeholder="Selecione o modo"
              options={masterData.tiposAcesso}
            />
            
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
            
            <FormInput
              label="Data de Aquisição"
              type="date"
              value={formData.dataAquisicao}
              onChange={(e) => handleInputChange('dataAquisicao', e.target.value)}
            />
            
            <FormInput
              label="Tempo de Garantia"
              value={formData.tempoGarantia}
              onChange={(e) => handleInputChange('tempoGarantia', e.target.value)}
              placeholder="Ex: 12 meses, 2 anos"
            />
            
            <FormInput
              label="Versão de Firmware"
              value={formData.versaoFirmware}
              onChange={(e) => handleInputChange('versaoFirmware', e.target.value)}
              placeholder="Ex: 7.8.1"
              style={{ fontFamily: 'monospace' }}
            />

            <FormSelect
              label="Equipamento Anterior"
              value={formData.equipamentoAnterior}
              onChange={(e) => handleInputChange('equipamentoAnterior', e.target.value)}
              placeholder="Selecione o equipamento anterior..."
              options={masterData.equipamentos}
            />

            <FormSelect
              label="Equipamento Posterior"
              value={formData.equipamentoPosterior}
              onChange={(e) => handleInputChange('equipamentoPosterior', e.target.value)}
              placeholder="Selecione o equipamento posterior..."
              options={masterData.equipamentos}
            />

            <FormSelect
              label="POP"
              value={formData.pop}
              onChange={(e) => handleInputChange('pop', e.target.value)}
              placeholder="Selecione um POP..."
              options={masterData.pops}
            />

            <FormInput
              label="Foto do Equipamento"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  console.log('Arquivo selecionado:', file);
                }
              }}
            />
          </div>

          {/* Observações (ocupando as duas colunas) */}
          <div style={{
            gridColumn: '1 / -1',
            marginTop: '16px'
          }}>
            <FormInput
              label="Observações"
              type="textarea"
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Informações adicionais sobre o equipamento..."
              rows={3}
            />
          </div>
          </form>
        </div>

        {/* Botões de ação */}
        <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '16px 24px',
            borderTop: '1px solid #e5e5e5',
            backgroundColor: '#f9fafb'
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
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarEquipamento;