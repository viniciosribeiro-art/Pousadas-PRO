
import React, { useState } from 'react';
import { TipoQuarto } from '../../types';
import { mockTiposQuarto } from '../../data/mockData';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import { PlusIcon, EditIcon, TrashIcon } from '../icons/Icons';

// Form component for adding/editing room types
const TipoQuartoForm: React.FC<{
    tipoQuarto: Partial<TipoQuarto> | null;
    onSave: (data: Partial<TipoQuarto>) => void;
    onCancel: () => void;
}> = ({ tipoQuarto, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<TipoQuarto>>({
        nome_tipo: '',
        capacidade_maxima: 2,
        preco_base: 100.00,
        descricao: ''
    });

    React.useEffect(() => {
        if (tipoQuarto) {
            setFormData(tipoQuarto);
        } else {
             setFormData({
                nome_tipo: '',
                capacidade_maxima: 2,
                preco_base: 100.00,
                descricao: ''
            });
        }
    }, [tipoQuarto]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label>Nome do Tipo</label>
                <input name="nome_tipo" value={formData.nome_tipo || ''} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>Capacidade Máxima</label>
                    <input type="number" name="capacidade_maxima" min="1" value={formData.capacidade_maxima || ''} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
                <div>
                    <label>Preço Base (R$)</label>
                    <input type="number" name="preco_base" min="0" step="0.01" value={formData.preco_base || ''} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
            </div>
            <div>
                <label>Descrição</label>
                <textarea name="descricao" rows={3} value={formData.descricao || ''} onChange={handleChange} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary">Salvar</button>
            </div>
        </form>
    );
};

// Main page component
const TiposQuartoAdminPage: React.FC = () => {
    const [tiposQuarto, setTiposQuarto] = useState<TipoQuarto[]>(mockTiposQuarto);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTipo, setSelectedTipo] = useState<TipoQuarto | null>(null);

    const handleOpenForm = (tipo?: TipoQuarto) => {
        setSelectedTipo(tipo || null);
        setIsFormOpen(true);
    };

    const handleSave = (data: Partial<TipoQuarto>) => {
        if (selectedTipo) {
            setTiposQuarto(tiposQuarto.map(t => t.id_tipo_quarto === selectedTipo.id_tipo_quarto ? { ...t, ...data } as TipoQuarto : t));
        } else {
            const newTipo: TipoQuarto = {
                id_tipo_quarto: Math.max(...tiposQuarto.map(t => t.id_tipo_quarto), 0) + 1,
                ...data
            } as TipoQuarto;
            setTiposQuarto([...tiposQuarto, newTipo]);
        }
        setIsFormOpen(false);
    };

    const handleDelete = (tipo: TipoQuarto) => {
        setSelectedTipo(tipo);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (selectedTipo) {
            // Note: In a real app, you should check if this room type is in use by any room before deleting.
            setTiposQuarto(tiposQuarto.filter(t => t.id_tipo_quarto !== selectedTipo.id_tipo_quarto));
        }
        setIsDeleteOpen(false);
        setSelectedTipo(null);
    };

    return (
        <Card title="Gerenciar Tipos de Quartos">
            <div className="flex justify-end mb-4">
                <button onClick={() => handleOpenForm()} className="flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary">
                    <PlusIcon className="w-5 h-5" />
                    Novo Tipo de Quarto
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Nome</th>
                            <th className="px-6 py-3">Capacidade</th>
                            <th className="px-6 py-3">Preço Base</th>
                            <th className="px-6 py-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tiposQuarto.map(tipo => (
                            <tr key={tipo.id_tipo_quarto} className="border-b bg-white hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{tipo.nome_tipo}</td>
                                <td className="px-6 py-4">{tipo.capacidade_maxima}</td>
                                <td className="px-6 py-4">R$ {tipo.preco_base.toFixed(2)}</td>
                                <td className="px-6 py-4 flex gap-4">
                                    <button onClick={() => handleOpenForm(tipo)}><EditIcon className="w-5 h-5 text-brand-secondary" /></button>
                                    <button onClick={() => handleDelete(tipo)}><TrashIcon className="w-5 h-5 text-red-500" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedTipo ? 'Editar Tipo de Quarto' : 'Novo Tipo de Quarto'}>
                    <TipoQuartoForm tipoQuarto={selectedTipo} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
                </Modal>
            )}

            {isDeleteOpen && (
                <ConfirmationDialog
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir o tipo de quarto "${selectedTipo?.nome_tipo}"?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setIsDeleteOpen(false)}
                />
            )}
        </Card>
    );
};

export default TiposQuartoAdminPage;
