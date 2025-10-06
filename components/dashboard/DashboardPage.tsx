import React from 'react';
import Card from '../ui/Card';
import { mockReservas, mockHospedes, mockQuartos } from '../../data/mockData';
import { ReservationStatus, RoomStatus } from '../../types';
import { UserGroupIcon, KeyIcon, CalendarIcon, CheckInIcon, CurrencyDollarIcon } from '../icons/Icons';

const DashboardPage: React.FC = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeReservations = mockReservas.filter(r => r.status_reserva === ReservationStatus.CheckIn);
    const checkInsToday = mockReservas.filter(r => {
        const checkinDate = new Date(r.data_checkin);
        checkinDate.setHours(0, 0, 0, 0);
        return checkinDate.getTime() === today.getTime() && (r.status_reserva === ReservationStatus.Confirmada || r.status_reserva === ReservationStatus.Pendente);
    });
    
    const totalGuests = mockHospedes.length;
    const availableRooms = mockQuartos.filter(q => q.status_quarto === RoomStatus.Disponivel).length;
    const occupancyRate = (activeReservations.length / mockQuartos.length) * 100;
    const monthlyRevenue = mockReservas.reduce((acc, r) => {
        const checkoutDate = new Date(r.data_checkout);
        if (checkoutDate.getMonth() === today.getMonth() && checkoutDate.getFullYear() === today.getFullYear()) {
            return acc + (r.valor_pago || 0);
        }
        return acc;
    }, 0);

    const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
        <Card>
            <div className="flex items-center">
                <div className="p-3 bg-brand-light rounded-full">
                    <Icon className="w-8 h-8 text-brand-primary" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <StatCard title="Hóspedes Ativos" value={activeReservations.length} icon={UserGroupIcon} />
                <StatCard title="Quartos Disponíveis" value={availableRooms} icon={KeyIcon} />
                <StatCard title="Check-ins Hoje" value={checkInsToday.length} icon={CheckInIcon} />
                <StatCard title="Taxa de Ocupação" value={`${occupancyRate.toFixed(0)}%`} icon={CalendarIcon} />
                <StatCard title="Receita do Mês" value={`R$ ${monthlyRevenue.toFixed(2)}`} icon={CurrencyDollarIcon} />
            </div>

            <Card title="Próximas Reservas">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-gray-500">
                            <tr>
                                <th className="p-2">Hóspede</th>
                                <th className="p-2">Check-in</th>
                                <th className="p-2">Check-out</th>
                                <th className="p-2">Quarto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockReservas.filter(r => new Date(r.data_checkin) >= today && r.status_reserva === ReservationStatus.Confirmada).slice(0, 5).map(r => (
                                <tr key={r.id_reserva} className="border-b last:border-0">
                                    <td className="p-2 font-medium">{mockHospedes.find(h => h.id_hospede === r.id_hospede)?.nome}</td>
                                    <td className="p-2">{new Date(r.data_checkin).toLocaleDateString()}</td>
                                    <td className="p-2">{new Date(r.data_checkout).toLocaleDateString()}</td>
                                    <td className="p-2">{mockQuartos.find(q => q.id_quarto === r.id_quarto)?.numero_quarto}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default DashboardPage;
