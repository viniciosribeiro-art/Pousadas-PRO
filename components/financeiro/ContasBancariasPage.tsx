import React, { useState } from 'react';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import { mockContasBancarias, mockLancamentos } from '../../data/mockData';
import { ContaBancaria, Lancamento } from '../../types';
import { calculateAccountBalance } from '../../utils/finance';
import { PlusIcon, ArrowPathIcon } from '../icons/Icons';
import ContaBancariaForm from './ContaBancariaForm';
import TransferBalanceModal from './TransferBalanceModal';

const ContasBancariasPage: React.FC = () => {
    const [contas, setContas] = useState<ContaBancaria[]>(mockContasBancarias);
    const [lancamentos, setLancamentos] = useState<Lancamento[]>(mockLancamentos);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [selectedConta, setSelectedConta] = useState<ContaBancaria | null>(null);

    const handleSave = (data: Partial<ContaBancaria>) => {
        // In a real app, you would have logic to save/update the account
        if (selectedConta) {
            setContas(contas.map(c => c.id_conta === selectedConta.id_conta ? {...c, ...data} as ContaBancaria : c));
        } else {
            const newConta = {
                id_conta: Math.max(...contas.map(c => c.id_conta)) + 1,
                ...data
            } as ContaBancaria;
            setContas([...contas, newConta]);
        }
        setIsFormOpen(false);
    };
    
    const handleTransfer = (fromId: number, toId: number, amount: number, description: string) => {
        // FIX: Changed `nome_banco` to `nome_conta` to match the ContaBancaria type.
        const descFrom = description || `Transferência para ${contas.find(c=>c.id_conta === toId)?.nome_conta}`;
        // FIX: Changed `nome_banco` to `nome_conta` to match the ContaBancaria type.
        const descTo = description || `Transferência de ${contas.find(c=>c.id_conta === fromId)?.nome_conta}`;
        const newId = Math.max(...lancamentos.map(l => l.id_lancamento), 0) + 1;
        
        const transferenciaSaida: Lancamento = {
            id_lancamento: newId,
            data: new Date().toISOString(),
            descricao: descFrom,
            valor: amount,
            tipo: 'despesa',
            categoria: 'Transferência',
            // FIX: Corrected property from `id_conta_bancaria` to `id_conta` to match Lancamento type.
            id_conta: fromId
        };
         const transferenciaEntrada: Lancamento = {
            id_lancamento: newId + 1,
            data: new Date().toISOString(),
            descricao: descTo,
            valor: amount,
            tipo: 'receita',
            categoria: 'Transferência',
            // FIX: Corrected property from `id_conta_bancaria` to `id_conta` to match Lancamento type.
            id_conta: toId
        };
        setLancamentos([...lancamentos, transferenciaSaida, transferenciaEntrada]);
        setIsTransferOpen(false);
    };

    return (
        <Card title="Contas Bancárias">
             <div className="flex justify-end gap-4 mb-4">
                 <button onClick={() => setIsTransferOpen(true)} className="flex items-center gap-2 bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600">
                    <ArrowPathIcon className="w-5 h-5"/>
                    Transferir Saldo
                </button>
                 <button onClick={() => { setSelectedConta(null); setIsFormOpen(true); }} className="flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary">
                    <PlusIcon className="w-5 h-5"/>
                    Nova Conta
                </button>
            </div>
            <div className="space-y-4">
                {contas.map(conta => {
                    const saldo = calculateAccountBalance(conta, lancamentos);
                    return (
                        <div key={conta.id_conta} className="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
                            <div>
                                {/* FIX: Changed `nome_banco` to `nome_conta` to match the ContaBancaria type. */}
                                <p className="font-bold text-lg text-gray-800">{conta.nome_conta}</p>
                                <p className="text-sm text-gray-500">Ag: {conta.agencia} / Conta: {conta.numero_conta}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 text-right">Saldo Atual</p>
                                <p className={`text-xl font-bold ${saldo >= 0 ? 'text-gray-800' : 'text-red-600'}`}>R$ {saldo.toFixed(2)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isFormOpen && (
                <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedConta ? "Editar Conta" : "Nova Conta Bancária"}>
                    <ContaBancariaForm conta={selectedConta} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
                </Modal>
            )}

            {isTransferOpen && (
                <Modal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} title="Transferir Saldo Entre Contas">
                   <TransferBalanceModal contas={contas} onTransfer={handleTransfer} onCancel={() => setIsTransferOpen(false)} />
                </Modal>
            )}
        </Card>
    );
};

export default ContasBancariasPage;