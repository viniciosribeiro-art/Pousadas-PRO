export enum Page {
    Dashboard = 'Dashboard',
    Reservas = 'Reservas',
    Hospedes = 'Hospedes',
    Quartos = 'Quartos',
    Financeiro = 'Financeiro',
    Administracao = 'Administracao',
}

export enum RoomStatus {
    Disponivel = 'Disponível',
    Ocupado = 'Ocupado',
    Manutencao = 'Em Manutenção',
    Limpeza = 'Em Limpeza',
}

export enum ReservationStatus {
    Pendente = 'Pendente',
    Confirmada = 'Confirmada',
    CheckIn = 'Check-in',
    CheckOut = 'Check-out',
    Cancelada = 'Cancelada',
}

export interface Hospede {
    id_hospede: number;
    nome: string;
    sobrenome: string;
    cpf?: string;
    data_nascimento?: string; // ISO string
    email: string;
    telefone?: string;
    endereco?: string;
    preferencias?: string;
}

export interface TipoQuarto {
    id_tipo_quarto: number;
    nome_tipo: string;
    capacidade_maxima: number;
    preco_base: number;
    descricao?: string;
}

export interface Quarto {
    id_quarto: number;
    numero_quarto: string;
    id_tipo_quarto: number;
    status_quarto: RoomStatus;
}

export interface Reserva {
    id_reserva: number;
    id_hospede: number;
    id_quarto: number;
    data_checkin: string; // ISO string
    data_checkout: string; // ISO string
    numero_hospedes: number;
    valor_total: number;
    valor_pago?: number;
    status_reserva: ReservationStatus;
    comprovante_pagamento?: File;
    id_conta_pagamento?: number;
}

export interface Pedido {
    id_pedido: number;
    id_reserva: number;
    id_hospede: number;
    data_pedido: string; // ISO string
    descricao: string;
    valor: number;
    status: 'Pendente' | 'Pago';
}

export interface Comprovante {
    id_comprovante: number;
    id_reserva: number;
    tipo: 'Recibo de Pagamento' | 'Nota Fiscal';
    data_emissao: string; // ISO string
    url_download: string;
}

export interface RegraPreco {
    id_regra: number;
    nome: string;
    data_inicio: string; // ISO string
    data_fim: string; // ISO string
    dias_semana: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
    tipo_ajuste: 'percentual' | 'fixo';
    valor_ajuste: number;
    id_tipo_quarto?: number; // Optional: applies to a specific room type
}

export interface TemplateConfig {
    headerText: string;
    footerText: string;
}

export interface Faturamento {
    id: number;
    data: string;
    descricao: string;
    valor: number;
    tipo: 'receita' | 'despesa';
}

export interface Lancamento {
    id_lancamento: number;
    data: string; // ISO string
    descricao: string;
    valor: number;
    tipo: 'receita' | 'despesa' | 'transferencia';
    categoria: string;
    id_conta?: number;
    id_conta_origem?: number;
    id_conta_destino?: number;
    id_reserva?: number;
}

export interface ContaBancaria {
    id_conta: number;
    nome_conta: string;
    agencia?: string;
    numero_conta?: string;
    saldo_inicial: number;
}

export type UserRole = 'admin' | 'gerente' | 'recepcionista';

export interface User {
    id: number;
    username: string;
    role: UserRole;
    name: string;
    email: string;
    senha?: string;
    status: 'ativo' | 'inativo';
}

export interface PousadaConfig {
    geral: {
        nomePousada: string;
        cnpj: string;
        endereco: string;
    };
    aparencia: {
        corPrimaria: string;
        corSecundaria: string;
        logoUrl: string;
    };
    contato: {
        telefone: string;
        emailReservas: string;
        whatsapp: string;
    };
    redesSociais: {
        instagram: string;
        facebook: string;
        twitter: string;
    };
    seguranca: {
        timeoutSessao: number; // in minutes
    };
}
