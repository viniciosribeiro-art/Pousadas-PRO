
import { UserRole, Page } from '../types';

const PERMISSIONS: Record<UserRole, Page[]> = {
    admin: [
        Page.Dashboard,
        Page.Reservas,
        Page.Hospedes,
        Page.Quartos,
        Page.Financeiro,
        Page.Administracao,
    ],
    gerente: [
        Page.Dashboard,
        Page.Reservas,
        Page.Hospedes,
        Page.Quartos,
        Page.Financeiro,
    ],
    recepcionista: [
        Page.Dashboard,
        Page.Reservas,
        Page.Hospedes,
        Page.Quartos,
    ],
};

export const hasPermission = (role: UserRole, page: Page): boolean => {
    return PERMISSIONS[role]?.includes(page) || false;
};
