import React from 'react';
import { BackIcon } from '../icons/Icons';

interface BackButtonProps {
    onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-primary transition-colors"
        >
            <BackIcon className="w-5 h-5" />
            Voltar ao Painel de Administração
        </button>
    );
};

export default BackButton;
