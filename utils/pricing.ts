import { Quarto, TipoQuarto, RegraPreco } from '../types';

export const calculateReservationPrice = (
    checkin: Date,
    checkout: Date,
    quartoId: number,
    allQuartos: Quarto[],
    allTiposQuarto: TipoQuarto[],
    allRegrasPreco: RegraPreco[]
): number => {
    const quarto = allQuartos.find(q => q.id_quarto === quartoId);
    if (!quarto) return 0;

    const tipoQuarto = allTiposQuarto.find(tq => tq.id_tipo_quarto === quarto.id_tipo_quarto);
    if (!tipoQuarto) return 0;

    let totalPrice = 0;
    const currentDate = new Date(checkin);

    while (currentDate < checkout) {
        let dailyPrice = tipoQuarto.preco_base;
        const dayOfWeek = currentDate.getDay(); // 0=Sun, 6=Sat

        // Find applicable pricing rules for this day
        const applicableRules = allRegrasPreco.filter(rule => {
            const ruleStart = new Date(rule.data_inicio);
            const ruleEnd = new Date(rule.data_fim);
            return (
                currentDate >= ruleStart &&
                currentDate <= ruleEnd &&
                rule.dias_semana.includes(dayOfWeek) &&
                (rule.id_tipo_quarto === undefined || rule.id_tipo_quarto === tipoQuarto.id_tipo_quarto)
            );
        });

        // Apply rules (a more sophisticated system might prioritize rules, but for now we apply them sequentially)
        for (const rule of applicableRules) {
            if (rule.tipo_ajuste === 'percentual') {
                dailyPrice *= (1 + rule.valor_ajuste / 100);
            } else { // 'fixo'
                dailyPrice += rule.valor_ajuste;
            }
        }
        
        totalPrice += dailyPrice;
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalPrice;
};
