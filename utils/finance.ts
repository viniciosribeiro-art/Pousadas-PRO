import { Lancamento, ContaBancaria } from '../types';

export const calculateAccountBalance = (
    conta: ContaBancaria,
    lancamentos: Lancamento[]
): number => {
    const totalLancamentos = lancamentos
        // FIX: Corrected property from `id_conta_bancaria` to `id_conta` to match Lancamento type.
        .filter(l => l.id_conta === conta.id_conta)
        .reduce((sum, l) => {
            return sum + (l.tipo === 'receita' ? l.valor : -l.valor);
        }, 0);
    
    return conta.saldo_inicial + totalLancamentos;
};