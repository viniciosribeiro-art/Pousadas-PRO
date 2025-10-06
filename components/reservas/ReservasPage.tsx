import React, { useState } from 'react';
import Modal from '../ui/Modal';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import PrintModal from './PrintModal';
import ReservasTabs, { ReservaTab } from './ReservasTabs';
import CalendarioReservas from './CalendarioReservas';
import EstadoQuartoPage from './EstadoQuartoPage';
import CheckinPage from './CheckinPage';
import PesquisaReservas from './PesquisaReservas';
import ReservaForm from './ReservaForm';
import { mockReservas, mockHospedes, mockQuartos, mockTiposQuarto, mockRegrasPreco } from '../../data/mockData';
import { Reserva, ReservationStatus } from '../../types';
import { PlusIcon } from '../icons/Icons';

const ReservasPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ReservaTab>('Calendário de reservas');
    const [reservas, setReservas] = useState(mockReservas);
    
    // State for modals
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    
    // State for selected item
    const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
    const [reservaIdToAction, setReservaIdToAction] = useState<number | null>(null);

    // Calendar date range state
    const today = new Date();
    const [startDate, setStartDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [endDate, setEndDate] = useState(new Date(today.getFullYear(), today.getMonth() + 1, 0));

    const handleOpenForm = (reserva?: Reserva) => {
        setSelectedReserva(reserva || null);
        setIsFormModalOpen(true);
    };

    const handleSaveReserva = (reservaData: Partial<Reserva>) => {
        if (selectedReserva) {
            // Edit
            setReservas(reservas.map(r => r.id_reserva === selectedReserva.id_reserva ? { ...r, ...reservaData } as Reserva : r));
        } else {
            // Add
            const newReserva: Reserva = {
                id_reserva: Math.max(...reservas.map(r => r.id_reserva)) + 1,
                ...reservaData
            } as Reserva;
            setReservas([...reservas, newReserva]);
        }
        setIsFormModalOpen(false);
        setSelectedReserva(null);
    };

    const handleDelete = (id: number) => {
        setReservaIdToAction(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if(reservaIdToAction) {
            setReservas(reservas.filter(r => r.id_reserva !== reservaIdToAction));
        }
        setIsDeleteModalOpen(false);
        setReservaIdToAction(null);
    };
    
    const handleCancel = (id: number) => {
        setReservaIdToAction(id);
        setIsCancelModalOpen(true);
    };

    const confirmCancel = () => {
        if (reservaIdToAction) {
            updateReservaStatus(reservaIdToAction, ReservationStatus.Cancelada);
        }
        setIsCancelModalOpen(false);
        setReservaIdToAction(null);
    };

    const updateReservaStatus = (id: number, status: ReservationStatus) => {
        setReservas(reservas.map(r => r.id_reserva === id ? { ...r, status_reserva: status } : r));
    };

    const handlePrint = (reserva: Reserva) => {
        setSelectedReserva(reserva);
        setIsPrintModalOpen(true);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Calendário de reservas':
                return <CalendarioReservas 
                    reservas={reservas} 
                    quartos={mockQuartos} 
                    hospedes={mockHospedes}
                    onEditReserva={handleOpenForm}
                    onDeleteReserva={handleDelete}
                    onCancelReserva={handleCancel}
                    onPrintReserva={handlePrint}
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />;
            case 'Estado do quarto':
                return <EstadoQuartoPage quartos={mockQuartos} reservas={reservas} hospedes={mockHospedes} tiposQuarto={mockTiposQuarto} />;
            case 'Check-in':
                return <CheckinPage reservas={reservas} hospedes={mockHospedes} quartos={mockQuartos} onUpdateStatus={updateReservaStatus} />;
            case 'Pesquisa':
                return <PesquisaReservas reservas={reservas} hospedes={mockHospedes} quartos={mockQuartos} onEditReserva={handleOpenForm} />;
            default:
                return null;
        }
    };
    
    const selectedPrintData = () => {
        if (!selectedReserva) return null;
        const hospede = mockHospedes.find(h => h.id_hospede === selectedReserva.id_hospede);
        const quarto = mockQuartos.find(q => q.id_quarto === selectedReserva.id_quarto);
        if (!hospede || !quarto) return null;
        const tipoQuarto = mockTiposQuarto.find(tq => tq.id_tipo_quarto === quarto.id_tipo_quarto);
        if (!tipoQuarto) return null;

        return { reserva: selectedReserva, hospede, quarto, tipoQuarto };
    }

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex justify-between items-center flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Reservas</h1>
                <button 
                    onClick={() => handleOpenForm()}
                    className="flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition duration-300"
                >
                    <PlusIcon className="w-5 h-5" />
                    Nova Reserva
                </button>
            </div>
            
            <div className="flex-grow flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
                <ReservasTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="p-4 flex-grow h-0">
                    {renderContent()}
                </div>
            </div>

            {isFormModalOpen && (
                <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={selectedReserva ? 'Editar Reserva' : 'Nova Reserva'}>
                    <ReservaForm 
                        reserva={selectedReserva}
                        onSave={handleSaveReserva}
                        onCancel={() => setIsFormModalOpen(false)}
                        hospedes={mockHospedes}
                        quartos={mockQuartos}
                        tiposQuarto={mockTiposQuarto}
                        regrasPreco={mockRegrasPreco}
                    />
                </Modal>
            )}

            {isDeleteModalOpen && (
                <ConfirmationDialog 
                    title="Confirmar Exclusão"
                    message="Tem certeza que deseja excluir esta reserva permanentemente? Esta ação não pode ser desfeita."
                    onConfirm={confirmDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
                />
            )}
            
            {isCancelModalOpen && (
                <ConfirmationDialog 
                    title="Confirmar Cancelamento"
                    message="Tem certeza que deseja cancelar esta reserva?"
                    onConfirm={confirmCancel}
                    onCancel={() => setIsCancelModalOpen(false)}
                />
            )}
            
            {isPrintModalOpen && selectedPrintData() && (
                <PrintModal
                    isOpen={isPrintModalOpen}
                    onClose={() => setIsPrintModalOpen(false)}
                    {...selectedPrintData()!}
                />
            )}
        </div>
    );
};

export default ReservasPage;