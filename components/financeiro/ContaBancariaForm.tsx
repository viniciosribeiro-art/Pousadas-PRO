import React, { useState, useEffect } from 'react';
import { ContaBancaria } from '../../types';

interface ContaBancariaFormProps {
    conta: Partial<ContaBancaria> | null;
    onSave: (data: Partial<ContaBancaria>) => void;
    onCancel: () => void;
}

const ContaBancariaForm: React.FC<ContaBancariaFormProps> = ({ conta, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<ContaBancaria>>({
        // FIX: Changed `nome_banco` to `nome_conta` to match ContaBancaria type.
        nome_conta: '',
        agencia: '',
        numero_conta: '',
        saldo_inicial: 0
    });

    useEffect(() => {
        if (conta) {
            setFormData(conta);
        }
    }, [conta]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'saldo_inicial' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Banco/Conta</label>
                {/* FIX: Changed `nome_banco` to `nome_conta` to match ContaBancaria type. */}
                <input name="nome_conta" value={formData.nome_conta || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agência</label>
                    <input name="agencia" value={formData.agencia || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número da Conta</label>
                    <input name="numero_conta" value={formData.numero_conta || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Saldo Inicial (R$)</label>
                <input name="saldo_inicial" type="number" step="0.01" value={formData.saldo_inicial || 0} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary">Salvar Conta</button>
            </div>
        </form>
    );
};

export default ContaBancariaForm;