import React from 'react';
import { Quarto, TipoQuarto, Reserva, Hospede, RoomStatus } from '../../types';
import { ROOM_STATUS_COLORS } from '../../constants';
import { UserGroupIcon, CalendarIcon } from '../icons/Icons';

interface EstadoQuartoPageProps {
  quartos: Quarto[];
  reservas: Reserva[];
  hospedes: Hospede[];
  tiposQuarto: TipoQuarto[];
}

const EstadoQuartoPage: React.FC<EstadoQuartoPageProps> = ({ quartos, reservas, hospedes, tiposQuarto }) => {

    const getTipoQuarto = (id: number): TipoQuarto | undefined => {
        return tiposQuarto.find(t => t.id_tipo_quarto === id);
    };

    const getHospede = (id: number): Hospede | undefined => {
        return hospedes.find(h => h.id_hospede === id);
    };

    const findCurrentReservationForRoom = (quartoId: number): Reserva | undefined => {
        return reservas.find(r => 
            r.id_quarto === quartoId && 
            r.status_reserva === 'Check-in'
        );
    };

    const QuartoStatusCard: React.FC<{ quarto: Quarto }> = ({ quarto }) => {
        const statusColor = ROOM_STATUS_COLORS[quarto.status_quarto];
        const tipoQuarto = getTipoQuarto(quarto.id_tipo_quarto);
        const currentReservation = findCurrentReservationForRoom(quarto.id_quarto);
        const currentHospede = currentReservation ? getHospede(currentReservation.id_hospede) : null;

        return (
            <div className="border rounded-lg shadow-md bg-white flex flex-col h-full transition-shadow hover:shadow-lg">
                <div className={`p-4 rounded-t-lg ${statusColor}`}>
                    <h3 className="text-xl font-bold">{quarto.numero_quarto}</h3>
                    <p className="text-sm opacity-90">{quarto.status_quarto}</p>
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                        <p className="text-gray-700 font-semibold">{tipoQuarto?.nome_tipo || 'Desconhecido'}</p>
                        <p className="text-sm text-gray-500">Capacidade: {tipoQuarto?.capacidade_maxima} pessoas</p>
                    </div>
                    {quarto.status_quarto === RoomStatus.Ocupado && currentReservation && currentHospede && (
                        <div className="mt-4 pt-4 border-t">
                            <p className="font-semibold text-sm text-gray-800">Hóspede Atual</p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                <UserGroupIcon className="w-4 h-4" />
                                <span>{currentHospede.nome} {currentHospede.sobrenome}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                <CalendarIcon className="w-4 h-4" />
                                <span>Saída: {new Date(currentReservation.data_checkout).toLocaleDateString('pt-BR')}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {quartos.map(quarto => (
                <QuartoStatusCard key={quarto.id_quarto} quarto={quarto} />
            ))}
        </div>
    );
};

export default EstadoQuartoPage;
