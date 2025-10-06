
import React, { useState, useEffect } from 'react';
import { Page, User, PousadaConfig } from './types';
import { mockUsers } from './data/mockData';
import LoginPage from './components/auth/LoginPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './components/dashboard/DashboardPage';
import ReservasPage from './components/reservas/ReservasPage';
import HospedesPage from './components/hospedes/HospedesPage';
import QuartosPage from './components/quartos/QuartosPage';
import FinanceiroPage from './components/financeiro/FinanceiroPage';
import AdministracaoPage from './components/administracao/AdministracaoPage';
import { hasPermission } from './utils/permissions';
import AccessDenied from './components/auth/AccessDenied';

const initialConfig: PousadaConfig = {
    geral: { nomePousada: 'PousadaPro', cnpj: '', endereco: '' },
    aparencia: { corPrimaria: '#0D47A1', corSecundaria: '#1976D2', logoUrl: '' },
    contato: { telefone: '', emailReservas: '', whatsapp: '' },
    redesSociais: { instagram: '', facebook: '', twitter: '' },
    seguranca: { timeoutSessao: 30 }
};

function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activePage, setActivePage] = useState<Page>(Page.Dashboard);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [config, setConfig] = useState<PousadaConfig>(initialConfig);
    const [users, setUsers] = useState<User[]>(mockUsers);

    // Load user and config from localStorage on initial render
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
            
            const storedConfig = localStorage.getItem('pousadaConfig');
            if (storedConfig) {
                const parsedConfig = JSON.parse(storedConfig);
                setConfig(parsedConfig);
                applyTheme(parsedConfig.aparencia);
            } else {
                 applyTheme(initialConfig.aparencia);
            }
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const applyTheme = (aparencia: PousadaConfig['aparencia']) => {
        const root = document.documentElement;
        root.style.setProperty('--color-brand-primary', aparencia.corPrimaria);
        root.style.setProperty('--color-brand-secondary', aparencia.corSecundaria);
        // A lighter version for backgrounds etc.
        const primaryLight = aparencia.corPrimaria + '20'; // Add alpha for a light tint
        root.style.setProperty('--color-brand-light', primaryLight);
        root.style.setProperty('--color-brand-accent', aparencia.corSecundaria);
    };

    const handleLogin = (email: string, senha: string): boolean => {
        const user = users.find(u => u.email === email && u.senha === senha && u.status === 'ativo');
        if (user) {
            const userToStore = { ...user };
            delete userToStore.senha; // Don't store password
            
            localStorage.setItem('currentUser', JSON.stringify(userToStore));
            setCurrentUser(userToStore);
            setActivePage(Page.Dashboard); // Redirect to dashboard on login
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
    };
    
    const renderActivePage = () => {
        if (!currentUser) return null;

        if (!hasPermission(currentUser.role, activePage)) {
            return <AccessDenied setActivePage={setActivePage} />;
        }

        switch (activePage) {
            case Page.Dashboard:
                return <DashboardPage />;
            case Page.Reservas:
                return <ReservasPage />;
            case Page.Hospedes:
                return <HospedesPage />;
            case Page.Quartos:
                return <QuartosPage />;
            case Page.Financeiro:
                return <FinanceiroPage />;
            case Page.Administracao:
                return <AdministracaoPage allUsers={users} setUsers={setUsers} config={config} setConfig={setConfig} />;
            default:
                return <DashboardPage />;
        }
    };

    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} users={users} />;
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                currentUser={currentUser}
                pousadaName={config.geral.nomePousada}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    currentUser={currentUser}
                    handleLogout={handleLogout}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
                    {renderActivePage()}
                </main>
            </div>
        </div>
    );
}

export default App;
