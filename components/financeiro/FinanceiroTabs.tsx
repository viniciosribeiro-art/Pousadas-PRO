import React from 'react';

export type FinanceiroTab = 'Visão Geral' | 'Lançamentos' | 'Contas a Receber' | 'Relatórios' | 'Contas Bancárias';

const TABS: FinanceiroTab[] = [
    'Visão Geral',
    'Lançamentos',
    'Contas a Receber',
    'Relatórios',
    'Contas Bancárias'
];

interface FinanceiroTabsProps {
    activeTab: FinanceiroTab;
    setActiveTab: (tab: FinanceiroTab) => void;
}

const FinanceiroTabs: React.FC<FinanceiroTabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-gray-200 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
             <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            <nav className="-mb-px flex flex-nowrap space-x-6 px-4 no-scrollbar" aria-label="Tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            ${tab === activeTab
                                ? 'border-brand-primary text-brand-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                        `}
                        aria-current={tab === activeTab ? 'page' : undefined}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default FinanceiroTabs;
