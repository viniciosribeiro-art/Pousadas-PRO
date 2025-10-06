import React, { useState } from 'react';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import LancamentoForm from './LancamentoForm';
import { mockLancamentos, mockContasBancarias } from '../../data/mockData';
import { Lancamento } from '../../types';
import { PlusIcon, EditIcon, TrashIcon } from '../icons/Icons';

const LancamentosFinanceiros: React.FC = () => {
    const [lancamentos, setLancamentos] = useState<Lancamento[]>(mockLancamentos);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedLancamento, setSelectedLancamento] = useState<Lancamento | null>(null);

    const handleOpenForm = (lancamento?: Lancamento) => {
        setSelectedLancamento(lancamento || null);
        setIsFormOpen(true);
    };

    const handleSave = (data: Partial<Lancamento>) => {
        if (selectedLancamento) {
            setLancamentos(lancamentos.map(l => l.id_lancamento === selectedLancamento.id_lancamento ? { ...l, ...data } as Lancamento : l));
        } else {
            const newLancamento: Lancamento = {
                id_lancamento: Math.max(...lancamentos.map(l => l.id_lancamento)) + 1,
                ...data
            } as Lancamento;
            setLancamentos([...lancamentos, newLancamento]);
        }
        setIsFormOpen(false);
    };
    
    const handleDelete = (lancamento: Lancamento) => {
        setSelectedLancamento(lancamento);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if(selectedLancamento){
            setLancamentos(lancamentos.filter(l => l.id_lancamento !== selectedLancamento.id_lancamento));
        }
        setIsDeleteOpen(false);
    };

    return (
        <Card title="Todos os Lançamentos">
            <div className="flex justify-end mb-4">
                 <button onClick={() => handleOpenForm()} className="flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary">
                    <PlusIcon className="w-5 h-5"/>
                    Novo Lançamento
                </button>
            </div>
            <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Data</th>
                            <th className="px-6 py-3">Descrição</th>
                            <th className="px-6 py-3">Valor</th>
                            <th className="px-6 py-3">Tipo</th>
                            <th className="px-6 py-3">Categoria</th>
                            <th className="px-6 py-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lancamentos.sort((a,b) => new Date(b.data).getTime() - new Date(a.data).getTime()).map(l => (
                            <tr key={l.id_lancamento} className="border-b bg-white hover:bg-gray-50">
                                <td className="px-6 py-4">{new Date(l.data).toLocaleDateString('pt-BR')}</td>
                                <td className="px-6 py-4">{l.descricao}</td>
                                <td className={`px-6 py-4 font-semibold ${l.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                                    {l.tipo === 'despesa' && '-'} R$ {l.valor.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">{l.tipo}</td>
                                <td className="px-6 py-4">{l.categoria}</td>
                                <td className="px-6 py-4 flex gap-4">
                                     <button onClick={() => handleOpenForm(l)}><EditIcon className="w-5 h-5 text-brand-secondary"/></button>
                                     <button onClick={() => handleDelete(l)}><TrashIcon className="w-5 h-5 text-red-500"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>

            {isFormOpen && (
                <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedLancamento ? 'Editar Lançamento' : 'Novo Lançamento'}>
                    <LancamentoForm lancamento={selectedLancamento} onSave={handleSave} onCancel={() => setIsFormOpen(false)} contas={mockContasBancarias} />
                </Modal>
            )}
             {isDeleteOpen && (
                <ConfirmationDialog
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir o lançamento "${selectedLancamento?.descricao}"?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setIsDeleteOpen(false)}
                />
            )}
        </Card>
    );
};

export default LancamentosFinanceiros;
