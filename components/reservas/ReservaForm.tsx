import React, { useState, useEffect, useCallback } from 'react';
import { Reserva, Hospede, Quarto, TipoQuarto, RegraPreco } from '../../types';
import { calculateReservationPrice } from '../../utils/pricing';

interface ReservaFormProps {
    reserva: Partial<Reserva> | null;
    onSave: (reserva: Partial<Reserva>) => void;
    onCancel: () => void;
    hospedes: Hospede[];
    quartos: Quarto[];
    tiposQuarto: TipoQuarto[];
    regrasPreco: RegraPreco[];
}

const ReservaForm: React.FC<ReservaFormProps> = ({ reserva, onSave, onCancel, hospedes, quartos, tiposQuarto, regrasPreco }) => {
    const [formData, setFormData] = useState<Partial<Reserva>>({
        id_hospede: hospedes[0]?.id_hospede,
        id_quarto: quartos[0]?.id_quarto,
        data_checkin: new Date().toISOString().split('T')[0],
        data_checkout: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        numero_hospedes: 1,
        valor_total: 0,
        valor_pago: 0,
        status_reserva: undefined,
    });

    const updatePrice = useCallback(() => {
        if (formData.data_checkin && formData.data_checkout && formData.id_quarto) {
            const checkin = new Date(formData.data_checkin);
            const checkout = new Date(formData.data_checkout);
            if (checkout > checkin) {
                 const price = calculateReservationPrice(checkin, checkout, formData.id_quarto, quartos, tiposQuarto, regrasPreco);
                 setFormData(prev => ({...prev, valor_total: price}));
            } else {
                 setFormData(prev => ({...prev, valor_total: 0}));
            }
        }
    }, [formData.data_checkin, formData.data_checkout, formData.id_quarto, quartos, tiposQuarto, regrasPreco]);


    useEffect(() => {
        if (reserva) {
            setFormData({
                ...reserva,
                data_checkin: reserva.data_checkin ? new Date(reserva.data_checkin).toISOString().split('T')[0] : '',
                data_checkout: reserva.data_checkout ? new Date(reserva.data_checkout).toISOString().split('T')[0] : ''
            });
        }
    }, [reserva]);
    
    useEffect(() => {
        updatePrice();
    }, [updatePrice]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumberField = ['id_hospede', 'id_quarto', 'numero_hospedes', 'valor_pago'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumberField ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label>Hóspede</label>
                <select name="id_hospede" value={formData.id_hospede || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent">
                    {hospedes.map(h => <option key={h.id_hospede} value={h.id_hospede}>{h.nome} {h.sobrenome}</option>)}
                </select>
            </div>
            <div>
                <label>Quarto</label>
                <select name="id_quarto" value={formData.id_quarto || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent">
                    {quartos.map(q => <option key={q.id_quarto} value={q.id_quarto}>{q.numero_quarto}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>Check-in</label>
                    <input type="date" name="data_checkin" value={formData.data_checkin || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
                 <div>
                    <label>Check-out</label>
                    <input type="date" name="data_checkout" value={formData.data_checkout || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                </div>
            </div>
             <div>
                <label>Número de Hóspedes</label>
                <input type="number" name="numero_hospedes" min="1" value={formData.numero_hospedes || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-right">
                <p className="text-sm text-gray-600">Valor Total Calculado</p>
                <p className="text-2xl font-bold text-gray-800">R$ {formData.valor_total?.toFixed(2)}</p>
            </div>
             <div>
                <label>Valor Pago (Entrada)</label>
                <input type="number" name="valor_pago" step="0.01" value={formData.valor_pago || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>

            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                    Cancelar
                </button>
                <button type="submit" className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary">
                    Salvar Reserva
                </button>
            </div>
        </form>
    );
};

export default ReservaForm;
