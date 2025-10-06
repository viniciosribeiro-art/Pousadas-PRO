import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Reserva, Quarto, Hospede } from '../../types';
import { RESERVATION_STATUS_CALENDAR_COLORS } from '../../constants';
import { EditIcon, CheckInIcon, CheckOutIcon, CancelIcon, TrashIcon, UserGroupIcon, HomeIcon, PrintIcon } from '../icons/Icons';

interface CalendarioReservasProps {
    reservas: Reserva[];
    quartos: Quarto[];
    hospedes: Hospede[];
    onEditReserva: (reserva: Reserva) => void;
    onDeleteReserva: (id: number) => void;
    onCancelReserva: (id: number) => void;
    onPrintReserva: (reserva: Reserva) => void;
    startDate: Date;
    endDate: Date;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void;
}

const ContextMenu: React.FC<{
    menuPosition: { x: number; y: number };
    reserva: Reserva;
    actions: {
        onEdit: () => void;
        onCheckIn: () => void;
        onCheckOut: () => void;
        onCancel: () => void;
        onDelete: () => void;
        onPrint: () => void;
    };
    onClose: () => void;
}> = ({ menuPosition, reserva, actions, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const menuItems = [
        { label: 'Editar', icon: EditIcon, action: actions.onEdit },
        { label: 'Imprimir Comprovante', icon: PrintIcon, action: actions.onPrint },
        { label: 'Check-in', icon: CheckInIcon, action: actions.onCheckIn },
        { label: 'Check-out', icon: CheckOutIcon, action: actions.onCheckOut },
        { label: 'Cancelar reserva', icon: CancelIcon, action: actions.onCancel },
        { label: 'Eliminar', icon: TrashIcon, action: actions.onDelete },
    ];

    return (
        <div
            ref={menuRef}
            style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
            className="absolute z-50 w-52 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
            <div className="py-1">
                {menuItems.map(item => (
                    <button
                        key={item.label}
                        onClick={() => { item.action(); onClose(); }}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};


const CalendarioReservas: React.FC<CalendarioReservasProps> = ({ reservas, quartos, hospedes, onEditReserva, onDeleteReserva, onCancelReserva, onPrintReserva, startDate, endDate, setStartDate, setEndDate }) => {
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, reserva: Reserva } | null>(null);

    const getHospedeName = (id: number) => {
        const hospede = hospedes.find(h => h.id_hospede === id);
        return hospede ? `${hospede.nome} ${hospede.sobrenome}` : 'N/A';
    };

    const days = useMemo(() => {
        const dayArray = [];
        let currentDate = new Date(startDate);
        // Fix to avoid infinite loop on invalid dates and ensure UTC consistency
        currentDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate());
        const finalDate = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());
        
        if (isNaN(currentDate.getTime()) || isNaN(finalDate.getTime()) || currentDate > finalDate) return [];

        while (currentDate <= finalDate) {
            dayArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dayArray;
    }, [startDate, endDate]);

    const handleRightClick = (event: React.MouseEvent, reserva: Reserva) => {
        event.preventDefault();
        setContextMenu({ x: event.clientX, y: event.clientY, reserva });
    };

    const diffDays = (date1: Date, date2: Date) => {
        const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
        const diffTime = d2.getTime() - d1.getTime();
        return Math.round(diffTime / (1000 * 60 * 60 * 24));
    };


    return (
        <div className="flex flex-col h-full">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-4 p-2 bg-white rounded-lg border flex-shrink-0">
                 <input type="date" value={startDate.toISOString().split('T')[0]} onChange={e => setStartDate(new Date(e.target.value))} className="p-2 border rounded-md" />
                 <span>até</span>
                 <input type="date" value={endDate.toISOString().split('T')[0]} onChange={e => setEndDate(new Date(e.target.value))} className="p-2 border rounded-md" />
            </div>

            {/* Calendar Grid */}
            <div className="flex-grow overflow-auto border rounded-lg bg-white">
                <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="sticky left-0 top-0 bg-gray-50 p-3 text-left text-sm font-semibold text-gray-900 w-48 border-b border-r border-gray-200 z-30">
                                    <HomeIcon className="w-5 h-5 inline-block mr-2" />
                                    Quarto
                                </th>
                                {days.map(day => (
                                    <th key={day.toISOString()} className="sticky top-0 bg-gray-50 p-3 text-center text-sm font-semibold text-gray-900 border-b border-r border-gray-200 w-24 z-10">
                                        <div className='flex flex-col items-center justify-center'>
                                            <span className="font-normal text-xs text-gray-500 capitalize">{day.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
                                            <span className="text-lg font-bold">{day.getDate()}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {quartos.map((quarto, quartoIndex) => (
                                <tr key={quarto.id_quarto}>
                                    <td className="sticky left-0 p-3 text-sm font-medium text-gray-900 whitespace-nowrap border-b border-r border-gray-200 z-20"
                                        style={{ backgroundColor: quartoIndex % 2 === 0 ? '#fff' : '#f9fafb' }}>
                                        {quarto.numero_quarto}
                                    </td>
                                    <td colSpan={days.length} className="p-0 border-b border-gray-200 relative">
                                        <div className="absolute inset-0 flex" aria-hidden="true">
                                            {days.map((day, index) => (
                                                <div key={index} className="w-24 h-full border-r border-gray-200" />
                                            ))}
                                        </div>
                                        <div className="relative h-12">
                                            {reservas.filter(r => r.id_quarto === quarto.id_quarto).map(reserva => {
                                                const resStartDate = new Date(reserva.data_checkin);
                                                const resEndDate = new Date(reserva.data_checkout);
                                                
                                                const startIndex = diffDays(startDate, resStartDate);
                                                let duration = diffDays(resStartDate, resEndDate);
                                                if(duration === 0) duration = 1;

                                                if (startIndex < 0 && startIndex + duration <= 0) return null;
                                                if (startIndex >= days.length) return null;
                                                
                                                const effectiveStartIndex = Math.max(startIndex, 0);
                                                const effectiveDuration = (startIndex < 0) 
                                                    ? duration + startIndex 
                                                    : Math.min(duration, days.length - startIndex);


                                                const left = effectiveStartIndex * 96; // 96px = w-24
                                                const width = effectiveDuration * 96;

                                                return (
                                                    <div
                                                        key={reserva.id_reserva}
                                                        onClick={(e) => handleRightClick(e, reserva)}
                                                        onContextMenu={(e) => handleRightClick(e, reserva)}
                                                        className={`absolute top-1/2 -translate-y-1/2 h-10 p-2 rounded-lg text-white text-xs font-bold flex items-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${RESERVATION_STATUS_CALENDAR_COLORS[reserva.status_reserva]}`}
                                                        style={{ left: `${left}px`, width: `${width - 4}px`, marginLeft: '2px', marginRight: '2px' }}
                                                        title={`${getHospedeName(reserva.id_hospede)} - Check-in: ${resStartDate.toLocaleDateString('pt-BR')} Check-out: ${resEndDate.toLocaleDateString('pt-BR')}`}
                                                    >
                                                        <UserGroupIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                                                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{getHospedeName(reserva.id_hospede)}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {contextMenu && (
                <ContextMenu
                    menuPosition={{ x: contextMenu.x, y: contextMenu.y }}
                    reserva={contextMenu.reserva}
                    onClose={() => setContextMenu(null)}
                    actions={{
                        onEdit: () => onEditReserva(contextMenu.reserva),
                        onDelete: () => onDeleteReserva(contextMenu.reserva.id_reserva),
                        onCancel: () => onCancelReserva(contextMenu.reserva.id_reserva),
                        onCheckIn: () => console.log('Check-in:', contextMenu.reserva.id_reserva), // Placeholder
                        onCheckOut: () => console.log('Check-out:', contextMenu.reserva.id_reserva), // Placeholder
                        onPrint: () => onPrintReserva(contextMenu.reserva),
                    }}
                />
            )}
        </div>
    );
};

export default CalendarioReservas;
