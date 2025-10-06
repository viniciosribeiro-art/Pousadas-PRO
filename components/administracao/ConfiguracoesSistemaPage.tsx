
import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { PousadaConfig } from '../../types';
import { InformationCircleIcon, PaintBrushIcon, PhoneIcon, ShareIcon, ShieldCheckIcon } from '../icons/Icons';

interface ConfiguracoesSistemaPageProps {
    config: PousadaConfig | null;
    setConfig: (config: PousadaConfig) => void;
}

type SettingsTab = 'geral' | 'aparencia' | 'contato' | 'redesSociais' | 'seguranca';

const settingsTabs = [
    { id: 'geral', label: 'Geral', icon: InformationCircleIcon },
    { id: 'aparencia', label: 'Aparência', icon: PaintBrushIcon },
    { id: 'contato', label: 'Contato', icon: PhoneIcon },
    { id: 'redesSociais', label: 'Redes Sociais', icon: ShareIcon },
    { id: 'seguranca', label: 'Segurança', icon: ShieldCheckIcon },
];

const initialConfig: PousadaConfig = {
    geral: { nomePousada: 'PousadaPro', cnpj: '', endereco: '' },
    aparencia: { corPrimaria: '#0D47A1', corSecundaria: '#1976D2', logoUrl: '' },
    contato: { telefone: '', emailReservas: '', whatsapp: '' },
    redesSociais: { instagram: '', facebook: '', twitter: '' },
    seguranca: { timeoutSessao: 30 }
};

const ConfiguracoesSistemaPage: React.FC<ConfiguracoesSistemaPageProps> = ({ config: propConfig, setConfig: setAppConfig }) => {
    const [config, setConfig] = useState<PousadaConfig>(propConfig || initialConfig);
    const [activeTab, setActiveTab] = useState<SettingsTab>('geral');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

    useEffect(() => {
        if (propConfig) {
            setConfig(propConfig);
        }
    }, [propConfig]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const [section, field] = name.split('.');
        setConfig(prev => ({
            ...prev,
            [section]: {
                // @ts-ignore
                ...prev[section],
                [field]: type === 'number' ? parseInt(value) || 0 : value,
            }
        }));
    };

    const handleSave = () => {
        localStorage.setItem('pousadaConfig', JSON.stringify(config));
        setAppConfig(config); // Update app-level state
        setSaveStatus('success');
        // This is a bit of a hack to force Tailwind to re-evaluate colors
        setTimeout(() => window.location.reload(), 500);
    };

    const renderForm = () => {
        switch (activeTab) {
            case 'geral':
                return (
                    <>
                        <InputField name="geral.nomePousada" label="Nome da Pousada" value={config.geral.nomePousada} onChange={handleChange} />
                        <InputField name="geral.cnpj" label="CNPJ" value={config.geral.cnpj} onChange={handleChange} />
                        <InputField name="geral.endereco" label="Endereço Completo" value={config.geral.endereco} onChange={handleChange} />
                    </>
                );
            case 'aparencia':
                return (
                    <>
                         <InputField name="aparencia.corPrimaria" label="Cor Primária" type="color" value={config.aparencia.corPrimaria} onChange={handleChange} />
                         <InputField name="aparencia.corSecundaria" label="Cor Secundária" type="color" value={config.aparencia.corSecundaria} onChange={handleChange} />
                         <InputField name="aparencia.logoUrl" label="URL do Logo" value={config.aparencia.logoUrl} onChange={handleChange} />
                    </>
                );
            case 'contato':
                 return (
                    <>
                         <InputField name="contato.telefone" label="Telefone" value={config.contato.telefone} onChange={handleChange} />
                         <InputField name="contato.emailReservas" label="Email de Reservas" type="email" value={config.contato.emailReservas} onChange={handleChange} />
                         <InputField name="contato.whatsapp" label="WhatsApp (com código do país)" value={config.contato.whatsapp} onChange={handleChange} />
                    </>
                );
            case 'redesSociais':
                 return (
                    <>
                         <InputField name="redesSociais.instagram" label="Instagram (URL)" value={config.redesSociais.instagram} onChange={handleChange} />
                         <InputField name="redesSociais.facebook" label="Facebook (URL)" value={config.redesSociais.facebook} onChange={handleChange} />
                         <InputField name="redesSociais.twitter" label="Twitter/X (URL)" value={config.redesSociais.twitter} onChange={handleChange} />
                    </>
                );
            case 'seguranca':
                return (
                    <>
                        <InputField name="seguranca.timeoutSessao" label="Tempo de Inatividade para Logout (minutos)" type="number" value={String(config.seguranca.timeoutSessao)} onChange={handleChange} />
                    </>
                )
            default: return null;
        }
    };
    
    return (
        <Card title="Configurações do Sistema">
             <div className="flex flex-col md:flex-row gap-6">
                 <aside className="md:w-1/4">
                     <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
                        {settingsTabs.map(tab => (
                             <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as SettingsTab)}
                                className={`flex items-center gap-3 w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-brand-light text-brand-primary'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <tab.icon className="w-5 h-5 flex-shrink-0" />
                                <span className="whitespace-nowrap">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                 </aside>
                 <main className="flex-1 space-y-4">
                    {renderForm()}
                    <div className="flex justify-end items-center gap-4 pt-4 border-t">
                        {saveStatus === 'success' && <span className="text-green-600 text-sm">Configurações salvas! A página será recarregada.</span>}
                        <button onClick={handleSave} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary">
                            Salvar Alterações
                        </button>
                    </div>
                 </main>
             </div>
        </Card>
    )
};

const InputField: React.FC<{ name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string }> = 
({ name, label, value, onChange, type = 'text' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value || ''} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent" />
    </div>
);


export default ConfiguracoesSistemaPage;
