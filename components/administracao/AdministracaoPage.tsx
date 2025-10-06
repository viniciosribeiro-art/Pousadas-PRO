
import React, { useState } from 'react';
import Card from '../ui/Card';
import { User, PousadaConfig } from '../../types';
import BackButton from '../ui/BackButton';
import UserManagementPage from './UserManagementPage';
import TiposQuartoAdminPage from './TiposQuartoAdminPage';
import RegrasPrecoAdminPage from './RegrasPrecoAdminPage';
import TemplateComprovantePage from './TemplateComprovantePage';
import ConfiguracoesSistemaPage from './ConfiguracoesSistemaPage';
import ConfiguracaoAvancadaPage from './ConfiguracaoAvancadaPage';
import { UserGroupIcon, KeyIcon, CurrencyDollarIcon, PrintIcon, CogIcon, ShieldCheckIcon, BuildingLibraryIcon } from '../icons/Icons';

type AdminSubPage = 'users' | 'room-types' | 'pricing-rules' | 'receipt-template' | 'system-settings' | 'advanced-settings';

interface AdministracaoPageProps {
    allUsers: User[];
    setUsers: (users: User[]) => void;
    config: PousadaConfig;
    setConfig: (config: PousadaConfig) => void;
}

const adminSections = [
    { id: 'users', label: 'Gerenciar Usuários', icon: UserGroupIcon, component: UserManagementPage },
    { id: 'room-types', label: 'Gerenciar Tipos de Quartos', icon: KeyIcon, component: TiposQuartoAdminPage },
    { id: 'pricing-rules', label: 'Regras de Preços', icon: CurrencyDollarIcon, component: RegrasPrecoAdminPage },
    { id: 'receipt-template', label: 'Template de Comprovante', icon: PrintIcon, component: TemplateComprovantePage },
    { id: 'system-settings', label: 'Configurações do Sistema', icon: CogIcon, component: ConfiguracoesSistemaPage },
    { id: 'advanced-settings', label: 'Configuração Avançada', icon: ShieldCheckIcon, component: ConfiguracaoAvancadaPage },
];

const AdministracaoPage: React.FC<AdministracaoPageProps> = ({ allUsers, setUsers, config, setConfig }) => {
    const [activeSection, setActiveSection] = useState<AdminSubPage | null>(null);

    const renderContent = () => {
        if (!activeSection) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminSections.map(section => (
                        <button key={section.id} onClick={() => setActiveSection(section.id as AdminSubPage)} className="text-left">
                            <Card className="hover:shadow-xl hover:border-brand-primary border-transparent border-2 transition-all duration-300 h-full">
                                <div className="flex items-center gap-4">
                                    <section.icon className="w-10 h-10 text-brand-primary" />
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{section.label}</h3>
                                    </div>
                                </div>
                            </Card>
                        </button>
                    ))}
                </div>
            );
        }

        const SectionComponent = adminSections.find(s => s.id === activeSection)?.component;

        if (SectionComponent) {
            // Pass props conditionally
            let componentProps: any = {};
            if (activeSection === 'users') {
                componentProps = { allUsers, setUsers };
            }
            if (activeSection === 'system-settings') {
                componentProps = { config, setConfig };
            }
            
            return (
                <div className="space-y-4">
                    <BackButton onClick={() => setActiveSection(null)} />
                    <SectionComponent {...componentProps} />
                </div>
            );
        }
        
        return null;
    };

    return (
        <div className="space-y-4">
             <h1 className="text-2xl font-bold text-gray-800">Painel de Administração</h1>
             {renderContent()}
        </div>
    );
};

export default AdministracaoPage;
