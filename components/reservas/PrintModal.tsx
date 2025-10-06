import React from 'react';
import Modal from '../ui/Modal';
import ComprovanteImpressao from './ComprovanteImpressao';
import { Reserva, Hospede, Quarto, TipoQuarto } from '../../types';

interface PrintModalProps {
    isOpen: boolean;
    onClose: () => void;
    reserva: Reserva;
    hospede: Hospede;
    quarto: Quarto;
    tipoQuarto: TipoQuarto;
}

const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose, ...props }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Comprovante - Reserva #${props.reserva.id_reserva}`}>
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #printable-area, #printable-area * {
                            visibility: visible;
                        }
                        #printable-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                        .no-print {
                            display: none;
                        }
                    }
                `}
            </style>
            <div id="printable-area">
                <ComprovanteImpressao {...props} />
            </div>
            <div className="flex justify-end gap-4 mt-8 pt-4 border-t no-print">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300">
                    Fechar
                </button>
                <button type="button" onClick={handlePrint} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition duration-300">
                    Imprimir
                </button>
            </div>
        </Modal>
    );
};

export default PrintModal;
