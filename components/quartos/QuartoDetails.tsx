import React from 'react';
import { Quarto, TipoQuarto, Reserva, Hospede } from '../../types';
import { RESERVATION_STATUS_STYLES } from '../../constants';
import { UserGroupIcon, CalendarIcon } from '../icons/Icons';

interface QuartoDetailsProps {
    quarto: Quarto;
    tipoQuarto: TipoQuarto;
    reservas: Reserva[];
    hospedes: Hospede[];
}

const QuartoDetails: React.FC<QuartoDetailsProps> = ({ quarto, tipoQuarto, reservas, hospedes }) => {
    
    const getHospedeName = (id: number) => {
        const hospede = hospedes.find(h => h.id_hospede === id);
        return hospede ? `${hospede.nome} ${hospede.sobrenome}` : 'Desconhecido';
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Informações do Quarto</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="font-semibold text-gray-600">Número:</span> {quarto.numero_quarto}</p>
                    <p><span className="font-semibold text-gray-600">Status:</span> {quarto.status_quarto}</p>
                    <p><span className="font-semibold text-gray-600">Tipo:</span> {tipoQuarto.nome_tipo}</p>
                    <p><span className="font-semibold text-gray-600">Capacidade:</span> {tipoQuarto.capacidade_maxima} pessoa(s)</p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Reservas Associadas</h3>
                {reservas.length > 0 ? (
                    <ul className="space-y-3">
                        {reservas.map(reserva => (
                            <li key={reserva.id_reserva} className="p-3 bg-gray-50 rounded-lg border">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-800 flex items-center gap-2">
                                            <UserGroupIcon className="w-4 h-4 text-gray-500" />
                                            {getHospedeName(reserva.id_hospede)}
                                        </p>
                                        <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                                            {formatDate(reserva.data_checkin)} - {formatDate(reserva.data_checkout)}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${RESERVATION_STATUS_STYLES[reserva.status_reserva]}`}>
                                        {reserva.status_reserva}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 italic">Não há reservas futuras para este quarto.</p>
                )}
            </div>
        </div>
    );
};

export default QuartoDetails;
