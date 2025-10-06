import React, { useState, useMemo } from 'react';
import { Reserva, Hospede, Quarto } from '../../types';
import { RESERVATION_STATUS_STYLES } from '../../constants';
import { EditIcon } from '../icons/Icons';

interface PesquisaReservasProps {
  reservas: Reserva[];
  hospedes: Hospede[];
  quartos: Quarto[];
  onEditReserva: (reserva: Reserva) => void;
}

const PesquisaReservas: React.FC<PesquisaReservasProps> = ({ reservas, hospedes, quartos, onEditReserva }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getHospedeName = (id: number) => {
    const hospede = hospedes.find(h => h.id_hospede === id);
    return hospede ? `${hospede.nome} ${hospede.sobrenome}` : 'N/A';
  };

  const getQuartoNumero = (id: number) => {
    const quarto = quartos.find(q => q.id_quarto === id);
    return quarto ? quarto.numero_quarto : 'N/A';
  };

  const filteredReservas = useMemo(() => {
    return reservas.filter(reserva => {
      const hospedeName = getHospedeName(reserva.id_hospede).toLowerCase();
      const quartoNum = getQuartoNumero(reserva.id_quarto).toLowerCase();
      return hospedeName.includes(searchTerm.toLowerCase()) || quartoNum.includes(searchTerm.toLowerCase());
    });
  }, [reservas, searchTerm, getHospedeName, getQuartoNumero]);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por hóspede ou quarto..."
          className="w-full sm:w-72 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Hóspede</th>
              <th scope="col" className="px-6 py-3">Quarto</th>
              <th scope="col" className="px-6 py-3">Check-in</th>
              <th scope="col" className="px-6 py-3">Check-out</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Valor Total</th>
              <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservas.map(reserva => (
              <tr key={reserva.id_reserva} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{getHospedeName(reserva.id_hospede)}</td>
                <td className="px-6 py-4">{getQuartoNumero(reserva.id_quarto)}</td>
                <td className="px-6 py-4">{formatDate(reserva.data_checkin)}</td>
                <td className="px-6 py-4">{formatDate(reserva.data_checkout)}</td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${RESERVATION_STATUS_STYLES[reserva.status_reserva]}`}>
                        {reserva.status_reserva}
                    </span>
                </td>
                <td className="px-6 py-4">R$ {reserva.valor_total.toFixed(2)}</td>
                <td className="px-6 py-4">
                    <button onClick={() => onEditReserva(reserva)} className="text-brand-secondary hover:text-brand-primary">
                        {/* Fix: Added explicit icon size for UI consistency. */}
                        <EditIcon className="w-5 h-5" />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PesquisaReservas;