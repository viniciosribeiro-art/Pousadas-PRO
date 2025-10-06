
import React, { useState, useMemo } from 'react';
import { Hospede, Reserva, Pedido, Comprovante } from '../../types';
import { mockHospedes, mockReservas, mockPedidos, mockComprovantes } from '../../data/mockData';
import HospedeDetails from './HospedeDetails';
import HospedeForm from './HospedeForm';
import Modal from '../ui/Modal';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import { PlusIcon, SearchIcon, UserGroupIcon } from '../icons/Icons';
import Card from '../ui/Card';


const HospedesPage: React.FC = () => {
    const [hospedes, setHospedes] = useState<Hospede[]>(mockHospedes);
    const [selectedHospede, setSelectedHospede] = useState<Hospede | null>(hospedes[0] || null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [hospedeToEdit, setHospedeToEdit] = useState<Partial<Hospede> | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const filteredHospedes = useMemo(() =>
        hospedes.filter(h =>
            `${h.nome} ${h.sobrenome}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.email.toLowerCase().includes(searchTerm.toLowerCase())
        ), [hospedes, searchTerm]
    );

    const handleSelectHospede = (hospede: Hospede) => {
        setSelectedHospede(hospede);
    };
    
    const handleOpenForm = (hospede?: Hospede) => {
        setHospedeToEdit(hospede || null);
        setIsFormModalOpen(true);
    };

    const handleSaveHospede = (hospedeData: Partial<Hospede>) => {
        if (hospedeToEdit && hospedeToEdit.id_hospede) {
            // Edit
            const updatedHospedes = hospedes.map(h => h.id_hospede === hospedeToEdit.id_hospede ? { ...h, ...hospedeData } as Hospede : h);
            setHospedes(updatedHospedes);
            if (selectedHospede && selectedHospede.id_hospede === hospedeToEdit.id_hospede) {
                setSelectedHospede({ ...selectedHospede, ...hospedeData } as Hospede);
            }
        } else {
            // Add
            const newHospede: Hospede = {
                id_hospede: Math.max(...hospedes.map(h => h.id_hospede), 0) + 1,
                ...hospedeData
            } as Hospede;
            const updatedHospedes = [...hospedes, newHospede];
            setHospedes(updatedHospedes);
            setSelectedHospede(newHospede);
        }
        setIsFormModalOpen(false);
        setHospedeToEdit(null);
    };
    
    const handleDelete = () => {
        if(selectedHospede) {
            setIsDeleteModalOpen(true);
        }
    };
    
    const confirmDelete = () => {
        if(selectedHospede) {
            const newHospedes = hospedes.filter(h => h.id_hospede !== selectedHospede.id_hospede);
            setHospedes(newHospedes);
            const remainingFiltered = newHospedes.filter(h =>
                `${h.nome} ${h.sobrenome}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSelectedHospede(remainingFiltered.length > 0 ? remainingFiltered[0] : null);
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 h-full">
            {/* Guest List */}
            <Card className="w-full md:w-1/3 lg:w-1/4 flex flex-col">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Hóspedes</h2>
                        <button onClick={() => handleOpenForm()} className="text-brand-primary p-2 rounded-full hover:bg-brand-light">
                           <PlusIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar hóspede..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        />
                    </div>
                </div>
                <ul className="overflow-y-auto flex-grow">
                    {filteredHospedes.map(h => (
                        <li key={h.id_hospede}>
                            <button
                                onClick={() => handleSelectHospede(h)}
                                className={`w-full text-left p-4 transition-colors duration-200 ${selectedHospede?.id_hospede === h.id_hospede ? 'bg-brand-light' : 'hover:bg-gray-50'}`}
                            >
                                <p className="font-semibold text-gray-800">{h.nome} {h.sobrenome}</p>
                                <p className="text-sm text-gray-500 truncate">{h.email}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </Card>

            {/* Guest Details */}
            <div className="w-full md:w-2/3 lg:w-3/4">
                {selectedHospede ? (
                    <HospedeDetails
                        hospede={selectedHospede}
                        reservas={mockReservas.filter(r => r.id_hospede === selectedHospede.id_hospede)}
                        pedidos={mockPedidos.filter(p => p.id_hospede === selectedHospede.id_hospede)}
                        comprovantes={mockComprovantes.filter(c => mockReservas.some(r => r.id_reserva === c.id_reserva && r.id_hospede === selectedHospede.id_hospede))}
                        onEdit={() => handleOpenForm(selectedHospede)}
                        onDelete={handleDelete}
                        onBackToList={() => setSelectedHospede(null)}
                    />
                ) : (
                    <Card className="h-full flex flex-col items-center justify-center text-center">
                        <UserGroupIcon className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700">Selecione um Hóspede</h3>
                        <p className="text-gray-500">Escolha um hóspede da lista para ver os detalhes.</p>
                    </Card>
                )}
            </div>

            {isFormModalOpen && (
                 <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={hospedeToEdit ? 'Editar Hóspede' : 'Novo Hóspede'}>
                    <HospedeForm 
                        hospede={hospedeToEdit}
                        onSave={handleSaveHospede}
                        onCancel={() => setIsFormModalOpen(false)}
                    />
                </Modal>
            )}

            {isDeleteModalOpen && (
                <ConfirmationDialog
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir ${selectedHospede?.nome} ${selectedHospede?.sobrenome}? Todos os dados associados serão perdidos.`}
                    onConfirm={confirmDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    );
};

export default HospedesPage;
