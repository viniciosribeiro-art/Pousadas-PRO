import React from 'react';
import { Reserva, Hospede, Quarto, ReservationStatus } from '../../types';
import Card from '../ui/Card';
import { CheckInIcon, CheckOutIcon } from '../icons/Icons';

interface CheckinPageProps {
  reservas: Reserva[];
  hospedes: Hospede[];
  quartos: Quarto[];
  onUpdateStatus: (reservaId: number, newStatus: ReservationStatus) => void;
}

const CheckinPage: React.FC<CheckinPageProps> = ({ reservas, hospedes, quartos, onUpdateStatus }) => {
    const today = new Date().toISOString().split('T')[0];

    const checkinsHoje = reservas.filter(r => 
        r.data_checkin.startsWith(today) &&
        (r.status_reserva === ReservationStatus.Confirmada || r.status_reserva === ReservationStatus.Pendente)
    );
    const checkoutsHoje = reservas.filter(r => 
        r.data_checkout.startsWith(today) &&
        r.status_reserva === ReservationStatus.CheckIn
    );

    const getHospedeName = (id: number) => {
        const hospede = hospedes.find(h => h.id_hospede === id);
        return hospede ? `${hospede.nome} ${hospede.sobrenome}` : 'N/A';
    }
    const getQuartoNumero = (id: number) => quartos.find(q => q.id_quarto === id)?.numero_quarto || 'N/A';

    const ActionList: React.FC<{ title: string, items: Reserva[], actionLabel: string, actionIcon: React.ReactNode, onAction: (id: number) => void, color: string }> = 
    ({ title, items, actionLabel, actionIcon, onAction, color }) => (
        <Card title={title}>
            {items.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {items.map(reserva => (
                        <li key={reserva.id_reserva} className="flex flex-col sm:flex-row items-center justify-between py-4 px-2 hover:bg-gray-50">
                            <div>
                                <p className="font-bold text-gray-800">{getHospedeName(reserva.id_hospede)}</p>
                                <p className="text-sm text-gray-500">Quarto: {getQuartoNumero(reserva.id_quarto)}</p>
                            </div>
                            <button 
                                onClick={() => onAction(reserva.id_reserva)}
                                className={`mt-2 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-2 text-white font-bold py-2 px-4 rounded-lg ${color} transition duration-300`}
                            >
                                {actionIcon}
                                {actionLabel}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 py-4">Nenhuma atividade agendada para hoje.</p>
            )}
        </Card>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActionList 
                title={`Check-ins de Hoje (${checkinsHoje.length})`}
                items={checkinsHoje}
                actionLabel="Realizar Check-in"
                actionIcon={<CheckInIcon className="w-5 h-5" />}
                onAction={(id) => onUpdateStatus(id, ReservationStatus.CheckIn)}
                color="bg-green-500 hover:bg-green-600"
            />
            <ActionList 
                title={`Check-outs de Hoje (${checkoutsHoje.length})`}
                items={checkoutsHoje}
                actionLabel="Realizar Check-out"
                actionIcon={<CheckOutIcon className="w-5 h-5" />}
                onAction={(id) => onUpdateStatus(id, ReservationStatus.CheckOut)}
                color="bg-red-500 hover:bg-red-600"
            />
        </div>
    );
};

export default CheckinPage;
