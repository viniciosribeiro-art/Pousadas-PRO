import React, { useState, useEffect } from 'react';
import { Reserva, Hospede, Quarto, TipoQuarto, TemplateConfig } from '../../types';

interface ComprovanteImpressaoProps {
    reserva: Reserva;
    hospede: Hospede;
    quarto: Quarto;
    tipoQuarto: TipoQuarto;
}

const ComprovanteImpressao: React.FC<ComprovanteImpressaoProps> = ({ reserva, hospede, quarto, tipoQuarto }) => {
    const [template, setTemplate] = useState<TemplateConfig>({
        headerText: 'PousadaPro - Comprovante de Reserva',
        footerText: 'Agradecemos a sua preferência!'
    });

    useEffect(() => {
        try {
            const storedTemplate = localStorage.getItem('receiptTemplate');
            if (storedTemplate) {
                setTemplate(JSON.parse(storedTemplate));
            }
        } catch (error) {
            console.error("Failed to parse receipt template from localStorage", error);
        }
    }, []);

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const formatCurrency = (value?: number) => `R$ ${(value || 0).toFixed(2)}`;

    const diffInDays = (d1: string, d2: string) => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const noites = diffInDays(reserva.data_checkin, reserva.data_checkout);

    return (
        <div className="bg-white p-8 font-sans text-gray-800">
            {/* Header */}
            <header className="text-center mb-8 pb-4 border-b">
                <h1 className="text-2xl font-bold text-brand-primary">{template.headerText}</h1>
                <p className="text-sm text-gray-500">Comprovante de Reserva #{reserva.id_reserva}</p>
            </header>

            {/* Guest & Reservation Details */}
            <section className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h2 className="text-lg font-semibold mb-2 border-b pb-1">Detalhes do Hóspede</h2>
                    <p><strong>Nome:</strong> {hospede.nome} {hospede.sobrenome}</p>
                    <p><strong>Email:</strong> {hospede.email}</p>
                    <p><strong>Telefone:</strong> {hospede.telefone}</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-2 border-b pb-1">Detalhes da Reserva</h2>
                    <p><strong>Quarto:</strong> {quarto.numero_quarto} ({tipoQuarto.nome_tipo})</p>
                    <p><strong>Check-in:</strong> {formatDate(reserva.data_checkin)}</p>
                    <p><strong>Check-out:</strong> {formatDate(reserva.data_checkout)}</p>
                    <p><strong>Noites:</strong> {noites}</p>
                </div>
            </section>

            {/* Financials */}
            <section>
                <h2 className="text-lg font-semibold mb-2 border-b pb-1">Resumo Financeiro</h2>
                <table className="w-full text-left">
                    <tbody>
                        <tr className="border-b">
                            <td className="py-2">Valor Total da Reserva</td>
                            <td className="py-2 text-right font-semibold">{formatCurrency(reserva.valor_total)}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2">Valor Pago</td>
                            <td className="py-2 text-right text-green-600 font-semibold">{formatCurrency(reserva.valor_pago)}</td>
                        </tr>
                        <tr className="bg-gray-100">
                            <td className="py-3 font-bold text-lg">Valor Restante</td>
                            <td className="py-3 text-right font-bold text-lg text-red-600">{formatCurrency(reserva.valor_total - (reserva.valor_pago || 0))}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
            
            {/* Footer */}
            <footer className="text-center mt-8 pt-4 border-t text-sm text-gray-600">
                <p>{template.footerText}</p>
                <p className="mt-2">Emitido em: {new Date().toLocaleString('pt-BR')}</p>
            </footer>
        </div>
    );
};

export default ComprovanteImpressao;
