import { Page, RoomStatus, ReservationStatus } from './types';
import { HomeIcon, CalendarIcon, UserGroupIcon, KeyIcon, CurrencyDollarIcon, CogIcon } from './components/icons/Icons';

export const NAVIGATION_ITEMS = [
  { id: Page.Dashboard, label: 'Dashboard', icon: HomeIcon },
  { id: Page.Reservas, label: 'Reservas', icon: CalendarIcon },
  { id: Page.Hospedes, label: 'Hóspedes', icon: UserGroupIcon },
  { id: Page.Financeiro, label: 'Financeiro', icon: CurrencyDollarIcon },
  { id: Page.Administracao, label: 'Administração', icon: CogIcon },
];

export const ROOM_STATUS_COLORS: { [key in RoomStatus]: string } = {
  [RoomStatus.Disponivel]: 'bg-status-disponivel text-white',
  [RoomStatus.Ocupado]: 'bg-status-ocupado text-white',
  [RoomStatus.Manutencao]: 'bg-status-manutencao text-black',
  [RoomStatus.Limpeza]: 'bg-status-limpeza text-white',
};

export const RESERVATION_STATUS_STYLES: { [key in ReservationStatus]: string } = {
    [ReservationStatus.Pendente]: 'bg-yellow-100 text-yellow-800',
    [ReservationStatus.Confirmada]: 'bg-blue-100 text-blue-800',
    [ReservationStatus.CheckIn]: 'bg-green-100 text-green-800',
    [ReservationStatus.CheckOut]: 'bg-gray-200 text-gray-800',
    [ReservationStatus.Cancelada]: 'bg-red-100 text-red-800',
};

export const RESERVATION_STATUS_CALENDAR_COLORS: { [key in ReservationStatus]: string } = {
    [ReservationStatus.Pendente]: 'bg-yellow-400 border-yellow-500',
    [ReservationStatus.Confirmada]: 'bg-blue-400 border-blue-500',
    [ReservationStatus.CheckIn]: 'bg-green-400 border-green-500',
    [ReservationStatus.CheckOut]: 'bg-gray-400 border-gray-500',
    [ReservationStatus.Cancelada]: 'bg-red-400 border-red-500',
};