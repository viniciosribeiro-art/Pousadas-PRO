import React from 'react';
import Card from '../ui/Card';
import { ArrowUpIcon, ArrowDownIcon } from '../icons/Icons';
import { mockFaturamento, mockReservas } from '../../data/mockData';

const VisaoGeralFinanceiro: React.FC = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const receitasMes = mockFaturamento.reduce((acc, f) => {
        const fDate = new Date(f.data);
        if (f.tipo === 'receita' && fDate.getMonth() === currentMonth && fDate.getFullYear() === currentYear) {
            return acc + f.valor;
        }
        return acc;
    }, 0);

    const despesasMes = mockFaturamento.reduce((acc, f) => {
        const fDate = new Date(f.data);
        if (f.tipo === 'despesa' && fDate.getMonth() === currentMonth && fDate.getFullYear() === currentYear) {
            return acc + f.valor;
        }
        return acc;
    }, 0);
    
    const saldoMes = receitasMes - despesasMes;

    const aReceber = mockReservas.reduce((acc, r) => {
        if (!r.status_reserva || r.status_reserva === 'Cancelada') return acc;
        return acc + (r.valor_total - (r.valor_pago || 0));
    }, 0);
    
    const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType, color: string }> = ({ title, value, icon: Icon, color }) => (
        <Card>
            <div className="flex items-center">
                <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('text', 'bg')}`}>
                    <Icon className={`w-8 h-8 ${color}`} />
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
            <h2 className="text-xl font-bold text-gray-800">Resumo do Mês Atual</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Receitas" value={`R$ ${receitasMes.toFixed(2)}`} icon={ArrowUpIcon} color="text-green-500" />
                <StatCard title="Despesas" value={`R$ ${despesasMes.toFixed(2)}`} icon={ArrowDownIcon} color="text-red-500" />
                <StatCard title="Saldo" value={`R$ ${saldoMes.toFixed(2)}`} icon={saldoMes >= 0 ? ArrowUpIcon : ArrowDownIcon} color={saldoMes >= 0 ? "text-blue-500" : "text-red-500"} />
                <StatCard title="Total a Receber" value={`R$ ${aReceber.toFixed(2)}`} icon={ArrowUpIcon} color="text-yellow-500" />
            </div>
            {/* Here you could add charts */}
        </div>
    );
};

export default VisaoGeralFinanceiro;
