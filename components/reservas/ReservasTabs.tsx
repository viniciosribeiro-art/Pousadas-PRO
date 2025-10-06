import React from 'react';
import { CalendarIcon, RoomStatusIcon, CheckInIcon, SearchIcon } from '../icons/Icons';

export type ReservaTab = 'Calendário de reservas' | 'Estado do quarto' | 'Check-in' | 'Pesquisa';

const TABS: { name: ReservaTab; icon: React.FC<{className?: string}> }[] = [
    { name: 'Calendário de reservas', icon: CalendarIcon },
    { name: 'Estado do quarto', icon: RoomStatusIcon },
    { name: 'Check-in', icon: CheckInIcon },
    { name: 'Pesquisa', icon: SearchIcon },
];

interface ReservasTabsProps {
    activeTab: ReservaTab;
    setActiveTab: (tab: ReservaTab) => void;
}

const ReservasTabs: React.FC<ReservasTabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-gray-200 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            <nav className="-mb-px flex flex-nowrap space-x-6 px-4 no-scrollbar" aria-label="Tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`
                            ${tab.name === activeTab
                                ? 'border-brand-primary text-brand-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                        `}
                        aria-current={tab.name === activeTab ? 'page' : undefined}
                    >
                        <tab.icon className="w-5 h-5" />
                        <span>{tab.name}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default ReservasTabs;