import React, { useState, useEffect } from 'react';
import { Lancamento, ContaBancaria } from '../../types';

interface LancamentoFormProps {
    lancamento: Partial<Lancamento> | null;
    onSave: (data: Partial<Lancamento>) => void;
    onCancel: () => void;
    contas: ContaBancaria[];
}

const LancamentoForm: React.FC<LancamentoFormProps> = ({ lancamento, onSave, onCancel, contas }) => {
    const [formData, setFormData] = useState<Partial<Lancamento>>({
        data: new Date().toISOString().split('T')[0],
        descricao: '',
        valor: 0,
        tipo: 'despesa',
        categoria: '',
        // FIX: Changed `id_conta_bancaria` to `id_conta` to match Lancamento type.
        id_conta: contas[0]?.id_conta
    });

    useEffect(() => {
        if (lancamento) {
            setFormData({
                ...lancamento,
                data: lancamento.data ? new Date(lancamento.data).toISOString().split('T')[0] : ''
            });
        }
    }, [lancamento]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // FIX: Changed `id_conta_bancaria` to `id_conta` to match Lancamento type.
        const isNumberField = ['valor', 'id_conta'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumberField ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input type="text" id="descricao" name="descricao" value={formData.descricao || ''} onChange={handleChange} required className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input type="date" id="data" name="data" value={formData.data || ''} onChange={handleChange} required className="w-full p-2 border rounded" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                    <input type="number" id="valor" name="valor" step="0.01" value={formData.valor || ''} onChange={handleChange} required className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select id="tipo" name="tipo" value={formData.tipo || 'despesa'} onChange={handleChange} required className="w-full p-2 border rounded">
                        <option value="despesa">Despesa</option>
                        <option value="receita">Receita</option>
                    </select>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <input type="text" id="categoria" name="categoria" value={formData.categoria || ''} onChange={handleChange} required className="w-full p-2 border rounded" />
                </div>
                <div>
                    {/* FIX: Changed `id_conta_bancaria` to `id_conta` to match Lancamento type. */}
                    <label htmlFor="id_conta" className="block text-sm font-medium text-gray-700 mb-1">Conta Bancária</label>
                    <select id="id_conta" name="id_conta" value={formData.id_conta || ''} onChange={handleChange} required className="w-full p-2 border rounded">
                        {/* FIX: Changed `nome_banco` to `nome_conta` to match the ContaBancaria type. */}
                        {contas.map(c => <option key={c.id_conta} value={c.id_conta}>{c.nome_conta} - {c.numero_conta}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
                <button type="submit" className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg">Salvar Lançamento</button>
            </div>
        </form>
    );
}

export default LancamentoForm;