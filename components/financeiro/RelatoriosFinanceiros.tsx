import React from 'react';
import Card from '../ui/Card';

const RelatoriosFinanceiros: React.FC = () => {

    const handleGenerateReport = (reportType: string) => {
        // In a real application, this would trigger a download or display a new page.
        alert(`Gerando relatório de "${reportType}"... (Funcionalidade de demonstração)`);
    };

    return (
        <Card title="Gerador de Relatórios Financeiros">
            <div className="space-y-6">
                <p className="text-gray-600">
                    Selecione um tipo de relatório para gerar. Os dados serão compilados com base em todos os lançamentos registrados no sistema.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button 
                        onClick={() => handleGenerateReport('Fluxo de Caixa Mensal')}
                        className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                    >
                        <h3 className="font-semibold text-gray-800">Fluxo de Caixa Mensal</h3>
                        <p className="text-sm text-gray-500">Detalha todas as receitas e despesas do mês atual.</p>
                    </button>

                    <button 
                        onClick={() => handleGenerateReport('Extrato de Contas a Receber')}
                        className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                    >
                        <h3 className="font-semibold text-gray-800">Contas a Receber</h3>
                        <p className="text-sm text-gray-500">Lista todas as reservas com pagamentos pendentes.</p>
                    </button>
                    
                    <button 
                        onClick={() => handleGenerateReport('Relatório Anual de Faturamento')}
                        className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                    >
                        <h3 className="font-semibold text-gray-800">Relatório Anual</h3>
                        <p className="text-sm text-gray-500">Visão consolidada do faturamento e despesas do ano.</p>
                    </button>
                    
                    <button 
                        onClick={() => handleGenerateReport('Despesas por Categoria')}
                        className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                    >
                        <h3 className="font-semibold text-gray-800">Despesas por Categoria</h3>
                        <p className="text-sm text-gray-500">Agrupa todas as despesas por suas categorias.</p>
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default RelatoriosFinanceiros;
