
import React, { useState, useEffect } from 'react';
import { Hospede } from '../../types';

interface HospedeFormProps {
  hospede: Partial<Hospede> | null;
  onSave: (hospede: Partial<Hospede>) => void;
  onCancel: () => void;
}

const HospedeForm: React.FC<HospedeFormProps> = ({ hospede, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Hospede>>({
    nome: '',
    sobrenome: '',
    cpf: '',
    data_nascimento: '',
    email: '',
    telefone: '',
    endereco: '',
    preferencias: ''
  });

  useEffect(() => {
    if (hospede) {
      setFormData({
        ...hospede,
        data_nascimento: hospede.data_nascimento ? hospede.data_nascimento.split('T')[0] : ''
      });
    } else {
      // Reset form for new hospede
      setFormData({
        nome: '',
        sobrenome: '',
        cpf: '',
        data_nascimento: '',
        email: '',
        telefone: '',
        endereco: '',
        preferencias: ''
      });
    }
  }, [hospede]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
  );

  const InputField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean; className?: string }> = 
    ({ name, label, value, onChange, type = 'text', required = false, className = '' }) => (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormSection title="Dados Pessoais">
        <InputField name="nome" label="Nome" value={formData.nome!} onChange={handleChange} required className="md:col-span-1" />
        <InputField name="sobrenome" label="Sobrenome" value={formData.sobrenome!} onChange={handleChange} required className="md:col-span-1" />
        <InputField name="cpf" label="CPF" value={formData.cpf!} onChange={handleChange} className="md:col-span-1" />
        <InputField name="data_nascimento" label="Data de Nascimento" value={formData.data_nascimento!} onChange={handleChange} type="date" className="md:col-span-1" />
      </FormSection>

      <FormSection title="Informações de Contato">
        <InputField name="email" label="Email" value={formData.email!} onChange={handleChange} type="email" className="md:col-span-1" />
        <InputField name="telefone" label="Telefone" value={formData.telefone!} onChange={handleChange} className="md:col-span-1" />
        <InputField name="endereco" label="Endereço" value={formData.endereco!} onChange={handleChange} className="md:col-span-2" />
      </FormSection>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Preferências</h3>
        <label htmlFor="preferencias" className="block text-sm font-medium text-gray-700 mb-1">Observações e Preferências</label>
        <textarea
            id="preferencias"
            name="preferencias"
            rows={3}
            value={formData.preferencias || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
        />
      </div>

      <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300">
          Cancelar
        </button>
        <button type="submit" className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition duration-300">
          Salvar Hóspede
        </button>
      </div>
    </form>
  );
};

export default HospedeForm;
