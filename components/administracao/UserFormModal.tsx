
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';

interface UserFormModalProps {
    user: Partial<User> | null;
    onSave: (data: Partial<User>) => void;
    onCancel: () => void;
    masterAdminId: number;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ user, onSave, onCancel, masterAdminId }) => {
    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        email: '',
        username: '',
        senha: '',
        role: 'recepcionista',
        status: 'ativo'
    });

    const isEditingMasterAdmin = user?.id === masterAdminId;

    useEffect(() => {
        if (user) {
            setFormData({ ...user, senha: '' }); // Don't show password on edit
        } else {
            setFormData({
                name: '',
                email: '',
                username: '',
                senha: '',
                role: 'recepcionista',
                status: 'ativo'
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = { ...formData };
        if (!dataToSave.senha) {
            delete dataToSave.senha;
        }
        onSave(dataToSave);
    };
    
    const roles: UserRole[] = ['admin', 'gerente', 'recepcionista'];
    const statuses: Array<'ativo' | 'inativo'> = ['ativo', 'inativo'];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
                <input type="text" name="username" id="username" value={formData.username || ''} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" />
            </div>
            <div>
                <label htmlFor="senha">{user ? "Nova Senha (deixe em branco para não alterar)" : "Senha"}</label>
                <input type="password" name="senha" id="senha" value={formData.senha || ""} onChange={handleChange} required={!user} className="mt-1 w-full p-2 border rounded-md" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Função</label>
                    <select name="role" id="role" value={formData.role || ''} onChange={handleChange} required disabled={isEditingMasterAdmin} className="mt-1 w-full p-2 border rounded-md disabled:bg-gray-200">
                        {roles.map(role => (
                            <option key={role} value={role} className="capitalize">{role}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                     <select name="status" id="status" value={formData.status || ''} onChange={handleChange} required disabled={isEditingMasterAdmin} className="mt-1 w-full p-2 border rounded-md disabled:bg-gray-200">
                        {statuses.map(s => (
                            <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                    </select>
                </div>
            </div>
             <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary">Salvar Usuário</button>
            </div>
        </form>
    );
};

export default UserFormModal;
