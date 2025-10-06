import React, { useState } from 'react';
import { ContaBancaria } from '../../types';

interface TransferBalanceModalProps {
    contas: ContaBancaria[];
    onTransfer: (fromId: number, toId: number, amount: number, description: string) => void;
    onCancel: () => void;
}

const TransferBalanceModal: React.FC<TransferBalanceModalProps> = ({ contas, onTransfer, onCancel }) => {
    const [fromId, setFromId] = useState<number | undefined>(contas[0]?.id_conta);
    const [toId, setToId] = useState<number | undefined>(contas[1]?.id_conta);
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (fromId && toId && amount > 0 && fromId !== toId) {
            onTransfer(fromId, toId, amount, description);
        } else {
            alert("Por favor, preencha todos os campos corretamente. A conta de origem e destino devem ser diferentes.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="fromId" className="block text-sm font-medium text-gray-700 mb-1">De:</label>
                <select id="fromId" value={fromId || ''} onChange={e => setFromId(parseInt(e.target.value))} className="w-full p-2 border rounded">
                    {/* FIX: Changed `nome_banco` to `nome_conta` to match ContaBancaria type. */}
                    {contas.map(c => <option key={c.id_conta} value={c.id_conta}>{c.nome_conta}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="toId" className="block text-sm font-medium text-gray-700 mb-1">Para:</label>
                <select id="toId" value={toId || ''} onChange={e => setToId(parseInt(e.target.value))} className="w-full p-2 border rounded">
                     {/* FIX: Changed `nome_banco` to `nome_conta` to match ContaBancaria type. */}
                     {contas.map(c => <option key={c.id_conta} value={c.id_conta}>{c.nome_conta}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Valor (R$):</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 0)} min="0.01" step="0.01" className="w-full p-2 border rounded" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional):</label>
                <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
                <button type="submit" className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg">Confirmar Transferência</button>
            </div>
        </form>
    );
};

export default TransferBalanceModal;