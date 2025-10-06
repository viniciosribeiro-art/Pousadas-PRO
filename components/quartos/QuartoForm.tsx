import React, { useState, useEffect } from 'react';
import { Quarto, TipoQuarto, RoomStatus } from '../../types';

interface QuartoFormProps {
    quarto: Partial<Quarto> | null;
    onSave: (quarto: Partial<Quarto>) => void;
    onCancel: () => void;
    tiposQuarto: TipoQuarto[];
}

const QuartoForm: React.FC<QuartoFormProps> = ({ quarto, onSave, onCancel, tiposQuarto }) => {
    const [formData, setFormData] = useState<Partial<Quarto>>({
        numero_quarto: '',
        id_tipo_quarto: tiposQuarto[0]?.id_tipo_quarto,
        status_quarto: RoomStatus.Disponivel,
    });

    useEffect(() => {
        if (quarto) {
            setFormData(quarto);
        } else {
            setFormData({
                numero_quarto: '',
                id_tipo_quarto: tiposQuarto[0]?.id_tipo_quarto,
                status_quarto: RoomStatus.Disponivel,
            });
        }
    }, [quarto, tiposQuarto]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'id_tipo_quarto' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="numero_quarto" className="block text-sm font-medium text-gray-700 mb-1">Número do Quarto</label>
                <input
                    type="text"
                    id="numero_quarto"
                    name="numero_quarto"
                    value={formData.numero_quarto || ''}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
            </div>

            <div>
                <label htmlFor="id_tipo_quarto" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Quarto</label>
                <select
                    id="id_tipo_quarto"
                    name="id_tipo_quarto"
                    value={formData.id_tipo_quarto || ''}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                    {tiposQuarto.map(tipo => (
                        <option key={tipo.id_tipo_quarto} value={tipo.id_tipo_quarto}>
                            {tipo.nome_tipo}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="status_quarto" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                    id="status_quarto"
                    name="status_quarto"
                    value={formData.status_quarto || ''}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                    {Object.values(RoomStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300">
                    Cancelar
                </button>
                <button type="submit" className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition duration-300">
                    Salvar Quarto
                </button>
            </div>
        </form>
    );
};

export default QuartoForm;
