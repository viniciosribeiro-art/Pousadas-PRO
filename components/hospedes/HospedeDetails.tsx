import React, { useState } from 'react';
import { Hospede, Reserva, Pedido, Comprovante } from '../../types';
import Card from '../ui/Card';
import { EditIcon, TrashIcon, BackIcon } from '../icons/Icons';
import { RESERVATION_STATUS_STYLES } from '../../constants';

interface HospedeDetailsProps {
  hospede: Hospede;
  reservas: Reserva[];
  pedidos: Pedido[];
  comprovantes: Comprovante[];
  onEdit: () => void;
  onDelete: () => void;
  onBackToList: () => void;
}

type ActiveTab = 'info' | 'reservas' | 'pedidos' | 'financeiro' | 'anotacoes';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`whitespace-nowrap py-2 px-4 text-sm font-medium transition-colors duration-200 ${isActive
                ? 'border-b-2 border-brand-primary text-brand-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
    >
        {label}
    </button>
);

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

const HospedeDetails: React.FC<HospedeDetailsProps> = ({ hospede, reservas, pedidos, comprovantes, onEdit, onDelete, onBackToList }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('info');

    const renderContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <div className="space-y-4 text-sm">
                        <p><strong>Nome:</strong> {hospede.nome} {hospede.sobrenome}</p>
                        <p><strong>Email:</strong> {hospede.email || 'N/A'}</p>
                        <p><strong>Telefone:</strong> {hospede.telefone || 'N/A'}</p>
                        <p><strong>CPF:</strong> {hospede.cpf || 'N/A'}</p>
                        <p><strong>Data de Nascimento:</strong> {hospede.data_nascimento ? formatDate(hospede.data_nascimento) : 'N/A'}</p>
                        <p><strong>Endereço:</strong> {hospede.endereco || 'N/A'}</p>
                    </div>
                );
            case 'reservas':
                return (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr><th className="px-4 py-2">Check-in</th><th className="px-4 py-2">Check-out</th><th className="px-4 py-2">Status</th></tr>
                            </thead>
                            <tbody>
                                {reservas.map(r => (
                                    <tr key={r.id_reserva} className="border-b">
                                        <td className="px-4 py-2 whitespace-nowrap">{formatDate(r.data_checkin)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{formatDate(r.data_checkout)}</td>
                                        <td className="px-4 py-2"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${RESERVATION_STATUS_STYLES[r.status_reserva]}`}>{r.status_reserva}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'pedidos':
                return (
                    <ul className="space-y-2">{pedidos.map(p => <li key={p.id_pedido} className="p-2 bg-gray-50 rounded-md text-sm">{formatDate(p.data_pedido)}: {p.descricao} - R$ {p.valor.toFixed(2)} ({p.status})</li>)}</ul>
                );
            case 'financeiro':
                 return (
                    <ul className="space-y-2">{comprovantes.map(c => <li key={c.id_comprovante} className="p-2 bg-gray-50 rounded-md text-sm flex justify-between items-center">{c.tipo} (Reserva {c.id_reserva}) - {formatDate(c.data_emissao)} <a href={c.url_download} className="text-brand-secondary hover:underline">Download</a></li>)}</ul>
                );
            case 'anotacoes':
                return <p className="text-sm p-4 bg-yellow-50 border border-yellow-200 rounded-md">{hospede.preferencias || 'Nenhuma anotação ou preferência registrada.'}</p>;
            default: return null;
        }
    }


    return (
        <Card className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <button onClick={onBackToList} className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-600">
                           <BackIcon className="w-5 h-5" />
                        </button>
                        <div className='min-w-0'>
                           <h2 className="text-xl font-bold text-gray-800 truncate">{hospede.nome} {hospede.sobrenome}</h2>
                           <p className="text-sm text-gray-500 truncate">{hospede.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                        {/* Fix: Added explicit icon size for UI consistency. */}
                        <button onClick={onEdit} className="text-brand-secondary p-2 rounded-full hover:bg-gray-100"><EditIcon className="w-5 h-5" /></button>
                        {/* Fix: Added explicit icon size for UI consistency. */}
                        <button onClick={onDelete} className="text-red-500 p-2 rounded-full hover:bg-gray-100"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>
            <div className="border-b overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                <nav className="flex space-x-4 px-4 no-scrollbar">
                    <TabButton label="Dados Pessoais" isActive={activeTab === 'info'} onClick={() => setActiveTab('info')} />
                    <TabButton label="Histórico de Reservas" isActive={activeTab === 'reservas'} onClick={() => setActiveTab('reservas')} />
                    <TabButton label="Pedidos & Consumo" isActive={activeTab === 'pedidos'} onClick={() => setActiveTab('pedidos')} />
                    <TabButton label="Financeiro" isActive={activeTab === 'financeiro'} onClick={() => setActiveTab('financeiro')} />
                    <TabButton label="Anotações" isActive={activeTab === 'anotacoes'} onClick={() => setActiveTab('anotacoes')} />
                </nav>
            </div>
            <div className="p-4 flex-grow overflow-y-auto">
                {renderContent()}
            </div>
        </Card>
    );
};

export default HospedeDetails;