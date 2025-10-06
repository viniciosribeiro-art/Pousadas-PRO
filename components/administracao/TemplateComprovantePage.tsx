import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { TemplateConfig } from '../../types';

const TemplateComprovantePage: React.FC = () => {
    const [config, setConfig] = useState<TemplateConfig>({
        headerText: '',
        footerText: ''
    });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        try {
            const storedConfig = localStorage.getItem('receiptTemplate');
            if (storedConfig) {
                setConfig(JSON.parse(storedConfig));
            } else {
                // Default values if nothing is stored
                setConfig({
                    headerText: 'PousadaPro - Comprovante de Reserva',
                    footerText: 'Agradecemos a sua preferência! Contato: (XX) XXXX-XXXX | email@pousadapro.com'
                });
            }
        } catch (error) {
            console.error("Failed to load template from localStorage:", error);
            setSaveStatus('error');
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        try {
            localStorage.setItem('receiptTemplate', JSON.stringify(config));
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000); // Reset status after 3 seconds
        } catch (error) {
            console.error("Failed to save template to localStorage:", error);
            setSaveStatus('error');
        }
    };

    return (
        <Card title="Personalizar Template do Comprovante de Reserva">
            <div className="space-y-6">
                <div>
                    <label htmlFor="headerText" className="block text-sm font-medium text-gray-700 mb-1">
                        Texto do Cabeçalho
                    </label>
                    <input
                        type="text"
                        id="headerText"
                        name="headerText"
                        value={config.headerText}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        placeholder="Ex: Nome da sua Pousada - Recibo"
                    />
                    <p className="text-xs text-gray-500 mt-1">Este texto aparecerá no topo de cada comprovante impresso.</p>
                </div>

                <div>
                    <label htmlFor="footerText" className="block text-sm font-medium text-gray-700 mb-1">
                        Texto do Rodapé
                    </label>
                    <textarea
                        id="footerText"
                        name="footerText"
                        rows={4}
                        value={config.footerText}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        placeholder="Ex: Endereço, telefone, website, etc."
                    />
                    <p className="text-xs text-gray-500 mt-1">Este texto aparecerá na parte inferior de cada comprovante.</p>
                </div>
                
                <div className="flex items-center justify-end gap-4">
                    {saveStatus === 'success' && <p className="text-sm text-green-600">Alterações salvas com sucesso!</p>}
                    {saveStatus === 'error' && <p className="text-sm text-red-600">Ocorreu um erro ao salvar.</p>}
                    <button
                        onClick={handleSave}
                        className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition duration-300"
                    >
                        Salvar Template
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default TemplateComprovantePage;
