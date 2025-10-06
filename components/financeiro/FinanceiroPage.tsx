import React, { useState } from 'react';
import Card from '../ui/Card';
import FinanceiroTabs, { FinanceiroTab } from './FinanceiroTabs';
import VisaoGeralFinanceiro from './VisaoGeralFinanceiro';
import LancamentosFinanceiros from './LancamentosFinanceiros';
import ContasReceberPage from './ContasReceberPage';
import RelatoriosFinanceiros from './RelatoriosFinanceiros';
import ContasBancariasPage from './ContasBancariasPage';

const FinanceiroPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<FinanceiroTab>('Visão Geral');

    const renderContent = () => {
        switch (activeTab) {
            case 'Visão Geral':
                return <VisaoGeralFinanceiro />;
            case 'Lançamentos':
                return <LancamentosFinanceiros />;
            case 'Contas a Receber':
                return <ContasReceberPage />;
            case 'Relatórios':
                return <RelatoriosFinanceiros />;
            case 'Contas Bancárias':
                return <ContasBancariasPage />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">Financeiro</h1>
            <Card>
                <FinanceiroTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="p-4 md:p-6">
                    {renderContent()}
                </div>
            </Card>
        </div>
    );
};

export default FinanceiroPage;
