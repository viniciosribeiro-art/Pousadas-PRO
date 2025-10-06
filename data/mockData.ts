
import { 
    Hospede, Reserva, Quarto, TipoQuarto, Pedido, Comprovante, RegraPreco, 
    ReservationStatus, RoomStatus, Lancamento, Faturamento, ContaBancaria, User, UserRole
} from '../types';

export const mockHospedes: Hospede[] = [
    { id_hospede: 1, nome: 'João', sobrenome: 'Silva', email: 'joao.silva@example.com', telefone: '11987654321', data_nascimento: '1985-04-12T00:00:00.000Z' },
    { id_hospede: 2, nome: 'Maria', sobrenome: 'Oliveira', email: 'maria.oliveira@example.com', telefone: '21987654322', data_nascimento: '1990-08-20T00:00:00.000Z' },
    { id_hospede: 3, nome: 'Carlos', sobrenome: 'Pereira', email: 'carlos.pereira@example.com', telefone: '31987654323', data_nascimento: '1978-11-02T00:00:00.000Z' },
];

export const mockTiposQuarto: TipoQuarto[] = [
    { id_tipo_quarto: 1, nome_tipo: 'Standard', capacidade_maxima: 2, preco_base: 150.00 },
    { id_tipo_quarto: 2, nome_tipo: 'Deluxe', capacidade_maxima: 3, preco_base: 250.00 },
    { id_tipo_quarto: 3, nome_tipo: 'Suíte', capacidade_maxima: 4, preco_base: 400.00 },
];

export const mockQuartos: Quarto[] = [
    { id_quarto: 1, numero_quarto: '101', id_tipo_quarto: 1, status_quarto: RoomStatus.Disponivel },
    { id_quarto: 2, numero_quarto: '102', id_tipo_quarto: 1, status_quarto: RoomStatus.Ocupado },
    { id_quarto: 3, numero_quarto: '201', id_tipo_quarto: 2, status_quarto: RoomStatus.Limpeza },
    { id_quarto: 4, numero_quarto: '202', id_tipo_quarto: 2, status_quarto: RoomStatus.Manutencao },
    { id_quarto: 5, numero_quarto: '301', id_tipo_quarto: 3, status_quarto: RoomStatus.Disponivel },
];

const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);

export const mockReservas: Reserva[] = [
    { id_reserva: 1, id_hospede: 1, id_quarto: 2, data_checkin: yesterday.toISOString(), data_checkout: tomorrow.toISOString(), numero_hospedes: 2, valor_total: 300, valor_pago: 300, status_reserva: ReservationStatus.CheckIn, id_conta_pagamento: 1 },
    { id_reserva: 2, id_hospede: 2, id_quarto: 3, data_checkin: today.toISOString(), data_checkout: nextWeek.toISOString(), numero_hospedes: 1, valor_total: 1750, valor_pago: 500, status_reserva: ReservationStatus.Confirmada, id_conta_pagamento: 1 },
    { id_reserva: 3, id_hospede: 3, id_quarto: 5, data_checkin: nextWeek.toISOString(), data_checkout: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), numero_hospedes: 4, valor_total: 1200, valor_pago: 0, status_reserva: ReservationStatus.Pendente },
];

export const mockPedidos: Pedido[] = [
    { id_pedido: 1, id_reserva: 1, id_hospede: 1, data_pedido: today.toISOString(), descricao: 'Serviço de quarto: 2x Água', valor: 10.00, status: 'Pago' },
    { id_pedido: 2, id_reserva: 1, id_hospede: 1, data_pedido: today.toISOString(), descricao: 'Frigobar: 1x Refrigerante', valor: 8.00, status: 'Pendente' },
];

export const mockComprovantes: Comprovante[] = [
    { id_comprovante: 1, id_reserva: 1, tipo: 'Recibo de Pagamento', data_emissao: yesterday.toISOString(), url_download: '#' },
];

export const mockRegrasPreco: RegraPreco[] = [
    { id_regra: 1, nome: 'Fim de Semana', data_inicio: '2023-01-01T00:00:00.000Z', data_fim: '2025-12-31T00:00:00.000Z', dias_semana: [5, 6, 0], tipo_ajuste: 'percentual', valor_ajuste: 20 }, // Fri, Sat, Sun
    { id_regra: 2, nome: 'Feriado de Verão', data_inicio: '2024-12-20T00:00:00.000Z', data_fim: '2025-01-10T00:00:00.000Z', dias_semana: [0, 1, 2, 3, 4, 5, 6], tipo_ajuste: 'fixo', valor_ajuste: 100, id_tipo_quarto: 3 },
];

export const mockFaturamento: Faturamento[] = [
    { id: 1, data: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(), descricao: 'Pagamento Reserva #1', valor: 300, tipo: 'receita' },
    { id: 2, data: new Date(today.getFullYear(), today.getMonth(), 2).toISOString(), descricao: 'Adiantamento Reserva #2', valor: 500, tipo: 'receita' },
    { id: 3, data: new Date(today.getFullYear(), today.getMonth(), 5).toISOString(), descricao: 'Salários', valor: 5000, tipo: 'despesa' },
    { id: 4, data: new Date(today.getFullYear(), today.getMonth(), 10).toISOString(), descricao: 'Fornecedores', valor: 1200, tipo: 'despesa' },
];

export const mockContasBancarias: ContaBancaria[] = [
    { id_conta: 1, nome_conta: 'Banco Principal', agencia: '0001', numero_conta: '12345-6', saldo_inicial: 10000 },
    { id_conta: 2, nome_conta: 'Caixa Operacional', agencia: '', numero_conta: '', saldo_inicial: 2000 },
];

export const mockLancamentos: Lancamento[] = [
    {id_lancamento: 1, data: new Date().toISOString(), descricao: "Pagamento Reserva #1", valor: 300, tipo: 'receita', categoria: "Hospedagem", id_conta: 1, id_reserva: 1},
    {id_lancamento: 2, data: new Date().toISOString(), descricao: "Pagamento Reserva #2", valor: 500, tipo: 'receita', categoria: "Hospedagem", id_conta: 1, id_reserva: 2},
    {id_lancamento: 3, data: new Date().toISOString(), descricao: "Salários", valor: 5000, tipo: 'despesa', categoria: "Recursos Humanos", id_conta: 1},
    {id_lancamento: 4, data: new Date().toISOString(), descricao: "Insumos Limpeza", valor: 350, tipo: 'despesa', categoria: "Operacional", id_conta: 2},
];

export const mockUsers: User[] = [
    { id: 1, username: 'vinicios', role: 'admin', name: 'Vinicios Ribeiro', email: 'viniciosribeiro@gmail.com', senha: 'admin123', status: 'ativo' },
    { id: 2, username: 'gerente', role: 'gerente', name: 'Ana Gerente', email: 'gerente@pousadapro.com', senha: 'gerente123', status: 'ativo' },
    { id: 3, username: 'recepcao', role: 'recepcionista', name: 'Bruno Recepção', email: 'recepcao@pousadapro.com', senha: 'recepcao123', status: 'inativo' },
];
