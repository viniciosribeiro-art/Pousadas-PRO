
import React from 'react';
import Card from '../ui/Card';
import { Page } from '../../types';

interface AccessDeniedProps {
    setActivePage: (page: Page) => void;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ setActivePage }) => {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="text-center p-8">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Acesso Negado</h2>
                <p className="text-gray-600">Você не tem permissão para visualizar esta página.</p>
                <p className="text-gray-600 mt-1">Contate o administrador do sistema para mais informações.</p>
                <button 
                    onClick={() => setActivePage(Page.Dashboard)}
                    className="mt-6 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition duration-300"
                >
                    Voltar ao Dashboard
                </button>
            </Card>
        </div>
    );
};

export default AccessDenied;
