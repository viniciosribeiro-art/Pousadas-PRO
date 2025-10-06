import React from 'react';
import Card from '../ui/Card';
import { mockRegrasPreco, mockTiposQuarto } from '../../data/mockData';
import { RegraPreco } from '../../types';

const RegrasPrecoAdminPage: React.FC = () => {

    const getTipoQuartoNome = (id?: number) => {
        if (!id) return 'Todos';
        return mockTiposQuarto.find(t => t.id_tipo_quarto === id)?.nome_tipo || 'Desconhecido';
    }

    const formatDiasSemana = (dias: number[]) => {
        const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        if (dias.length === 7) return 'Todos os dias';
        return dias.map(d => nomes[d]).join(', ');
    }

    return (
        <Card title="Regras de Preços">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nome da Regra</th>
                            <th scope="col" className="px-6 py-3">Tipo de Quarto</th>
                            <th scope="col" className="px-6 py-3">Período</th>
                            <th scope="col" className="px-6 py-3">Ajuste</th>
                            <th scope="col" className="px-6 py-3">Dias Aplicáveis</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockRegrasPreco.map((regra: RegraPreco) => (
                            <tr key={regra.id_regra} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{regra.nome}</td>
                                <td className="px-6 py-4">{getTipoQuartoNome(regra.id_tipo_quarto)}</td>
                                <td className="px-6 py-4">{new Date(regra.data_inicio).toLocaleDateString('pt-BR')} - {new Date(regra.data_fim).toLocaleDateString('pt-BR')}</td>
                                <td className={`px-6 py-4 font-semibold ${regra.valor_ajuste > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {regra.valor_ajuste > 0 ? '+' : ''}
                                    {regra.tipo_ajuste === 'fixo' ? `R$ ${regra.valor_ajuste.toFixed(2)}` : `${regra.valor_ajuste}%`}
                                </td>
                                <td className="px-6 py-4">{formatDiasSemana(regra.dias_semana)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default RegrasPrecoAdminPage;
