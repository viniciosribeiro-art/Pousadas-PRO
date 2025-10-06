import React, { useState } from 'react';
import { Quarto, TipoQuarto } from '../../types';
import { mockQuartos, mockTiposQuarto, mockReservas, mockHospedes } from '../../data/mockData';
import { PlusIcon, EditIcon, TrashIcon } from '../icons/Icons';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import Drawer from '../ui/Drawer';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import QuartoForm from './QuartoForm';
import QuartoDetails from './QuartoDetails';
import { ROOM_STATUS_COLORS } from '../../constants';

const QuartosPage: React.FC = () => {
    const [quartos, setQuartos] = useState<Quarto[]>(mockQuartos);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedQuarto, setSelectedQuarto] = useState<Quarto | null>(null);

    const getTipoQuarto = (id: number): TipoQuarto => {
        return mockTiposQuarto.find(t => t.id_tipo_quarto === id) || mockTiposQuarto[0];
    };

    const handleOpenForm = (quarto?: Quarto) => {
        setSelectedQuarto(quarto || null);
        setIsFormModalOpen(true);
    };
    
    const handleOpenDetails = (quarto: Quarto) => {
        setSelectedQuarto(quarto);
        setIsDetailsDrawerOpen(true);
    };

    const handleSaveQuarto = (quartoData: Partial<Quarto>) => {
        if (selectedQuarto) {
            // Edit
            setQuartos(quartos.map(q => q.id_quarto === selectedQuarto.id_quarto ? { ...q, ...quartoData } as Quarto : q));
        } else {
            // Add
            const newQuarto: Quarto = {
                id_quarto: Math.max(...quartos.map(q => q.id_quarto), 0) + 1,
                ...quartoData
            } as Quarto;
            setQuartos([...quartos, newQuarto]);
        }
        setIsFormModalOpen(false);
        setSelectedQuarto(null);
    };
    
    const handleDelete = (quarto: Quarto) => {
        setSelectedQuarto(quarto);
        setIsDeleteModalOpen(true);
    };
    
    const confirmDelete = () => {
        if (selectedQuarto) {
            setQuartos(quartos.filter(q => q.id_quarto !== selectedQuarto.id_quarto));
        }
        setIsDeleteModalOpen(false);
        setSelectedQuarto(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Quartos</h1>
                <button 
                    onClick={() => handleOpenForm()}
                    className="flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition duration-300"
                >
                    <PlusIcon className="w-5 h-5" />
                    Novo Quarto
                </button>
            </div>
            <Card>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Número</th>
                                <th scope="col" className="px-6 py-3">Tipo</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quartos.map(quarto => (
                                <tr key={quarto.id_quarto} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <button onClick={() => handleOpenDetails(quarto)} className="hover:underline">
                                           {quarto.numero_quarto}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">{getTipoQuarto(quarto.id_tipo_quarto).nome_tipo}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ROOM_STATUS_COLORS[quarto.status_quarto]}`}>
                                            {quarto.status_quarto}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        <button onClick={() => handleOpenForm(quarto)} className="text-brand-secondary hover:text-brand-primary">
                                            <EditIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(quarto)} className="text-red-500 hover:text-red-700">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isFormModalOpen && (
                <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={selectedQuarto ? 'Editar Quarto' : 'Novo Quarto'}>
                    <QuartoForm 
                        quarto={selectedQuarto}
                        onSave={handleSaveQuarto}
                        onCancel={() => setIsFormModalOpen(false)}
                        tiposQuarto={mockTiposQuarto}
                    />
                </Modal>
            )}

            {selectedQuarto && isDetailsDrawerOpen && (
                 <Drawer isOpen={isDetailsDrawerOpen} onClose={() => setIsDetailsDrawerOpen(false)} title={`Detalhes do Quarto ${selectedQuarto.numero_quarto}`}>
                    <QuartoDetails 
                        quarto={selectedQuarto}
                        tipoQuarto={getTipoQuarto(selectedQuarto.id_tipo_quarto)}
                        reservas={mockReservas.filter(r => r.id_quarto === selectedQuarto.id_quarto)}
                        hospedes={mockHospedes}
                    />
                </Drawer>
            )}

            {isDeleteModalOpen && (
                <ConfirmationDialog 
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir o quarto ${selectedQuarto?.numero_quarto}?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    );
};

export default QuartosPage;
