
import React from 'react';
import Card from '../ui/Card';
import { mockReservas, mockHospedes } from '../../data/mockData';
import { Reserva } from '../../types';

const ContasReceberPage: React.FC = () => {

    const contasAReceber = mockReservas.filter(r => (r.valor_total - (r.valor_pago || 0)) > 0.01 && r.status_reserva !== 'Cancelada');

    const getHospedeName = (id: number) => {
        const hospede = mockHospedes.find(h => h.id_hospede === id);
        // FIX: Corrected variable from `h` to `hospede`. `h` is only defined in the scope of the `find` callback.
        return hospede ? `${hospede.nome} ${hospede.sobrenome}` : 'N/A';
    };

    return (
        <Card title="Contas a Receber">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Hóspede</th>
                            <th className="px-6 py-3">Data Check-out</th>
                            <th className="px-6 py-3">Valor Total</th>
                            <th className="px-6 py-3">Valor Pago</th>
                            <th className="px-6 py-3">Valor Pendente</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contasAReceber.map((reserva: Reserva) => (
                             <tr key={reserva.id_reserva} className="border-b bg-white hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{getHospedeName(reserva.id_hospede)}</td>
                                <td className="px-6 py-4">{new Date(reserva.data_checkout).toLocaleDateString('pt-BR')}</td>
                                <td className="px-6 py-4">R$ {reserva.valor_total.toFixed(2)}</td>
                                <td className="px-6 py-4 text-green-600">R$ {(reserva.valor_pago || 0).toFixed(2)}</td>
                                <td className="px-6 py-4 font-bold text-red-600">R$ {(reserva.valor_total - (reserva.valor_pago || 0)).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default ContasReceberPage;
