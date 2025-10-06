
import React, { useState } from 'react';
import Card from '../ui/Card';
import { User } from '../../types';

interface LoginPageProps {
    onLogin: (email: string, senha: string) => boolean;
    users: User[]; // for demo purposes
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = onLogin(email, password);
        if (!success) {
            setError('Email ou senha inválidos, ou usuário inativo.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-sm" title="Bem-vindo ao PousadaPro">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <div>
                        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition duration-300">
                            Entrar
                        </button>
                    </div>
                    <div className="text-center text-xs text-gray-500 pt-4">
                        <p>Usuário Admin: viniciosribeiro@gmail.com / admin123</p>
                        <p>Usuário Gerente: gerente@pousadapro.com / gerente123</p>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;
