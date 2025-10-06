
import React, { useState } from 'react';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import UserFormModal from './UserFormModal';
import { User } from '../../types';
import { PlusIcon, EditIcon, TrashIcon } from '../icons/Icons';

interface UserManagementPageProps {
    allUsers: User[];
    setUsers: (users: User[]) => void;
}

const UserManagementPage: React.FC<UserManagementPageProps> = ({ allUsers, setUsers }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const masterAdminId = 1; // Vinicios Ribeiro's ID

    const handleOpenForm = (user?: User) => {
        setSelectedUser(user || null);
        setIsFormOpen(true);
    };

    const handleSave = (data: Partial<User>) => {
        if (selectedUser) {
            // Edit
            if (selectedUser.id === masterAdminId && data.role !== 'admin') {
                alert("Não é possível alterar a função do administrador master.");
                return;
            }
            setUsers(allUsers.map(u => u.id === selectedUser.id ? { ...u, ...data } as User : u));
        } else {
            // Add
            const newUser: User = {
                id: Math.max(...allUsers.map(u => u.id), 0) + 1,
                ...data
            } as User;
            setUsers([...allUsers, newUser]);
        }
        setIsFormOpen(false);
    };
    
    const handleDelete = (user: User) => {
        if (user.id === masterAdminId) {
            alert("O administrador master не pode ser excluído.");
            return;
        }
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if(selectedUser){
            setUsers(allUsers.filter(u => u.id !== selectedUser.id));
        }
        setIsDeleteOpen(false);
    };

    return (
        <Card title="Gerenciar Usuários do Sistema">
            <div className="flex justify-end mb-4">
                 <button onClick={() => handleOpenForm()} className="flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary">
                    <PlusIcon className="w-5 h-5"/>
                    Novo Usuário
                </button>
            </div>
            <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Nome</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Função</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map(user => (
                            <tr key={user.id} className="border-b bg-white hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4 capitalize">{user.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-4">
                                     <button onClick={() => handleOpenForm(user)}><EditIcon className="w-5 h-5 text-brand-secondary"/></button>
                                     <button onClick={() => handleDelete(user)} disabled={user.id === masterAdminId} className="disabled:opacity-25 disabled:cursor-not-allowed">
                                        <TrashIcon className="w-5 h-5 text-red-500"/>
                                     </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>

            {isFormOpen && (
                <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedUser ? 'Editar Usuário' : 'Novo Usuário'}>
                    <UserFormModal user={selectedUser} onSave={handleSave} onCancel={() => setIsFormOpen(false)} masterAdminId={masterAdminId} />
                </Modal>
            )}
             {isDeleteOpen && (
                <ConfirmationDialog
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir o usuário "${selectedUser?.name}"?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setIsDeleteOpen(false)}
                />
            )}
        </Card>
    );
};

export default UserManagementPage;
