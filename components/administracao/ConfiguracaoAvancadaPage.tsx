import React from 'react';
import Card from '../ui/Card';
import * as mockData from '../../data/mockData';

const ConfiguracaoAvancadaPage: React.FC = () => {

    const downloadFile = (filename: string, content: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExportSchema = () => {
        const schema = {
            description: "Esquema de dados e relações do sistema PousadaPro.",
            dataModels: {
                Hospede: {
                    id_hospede: "number (PK)",
                    nome: "string",
                    sobrenome: "string",
                    cpf: "string?",
                    data_nascimento: "string (ISO)?",
                    email: "string?",
                    telefone: "string?",
                    endereco: "string?",
                    preferencias: "string?",
                },
                Quarto: {
                    id_quarto: "number (PK)",
                    numero_quarto: "string",
                    id_tipo_quarto: "number (FK -> TipoQuarto)",
                    status_quarto: "Enum (Disponível, Ocupado, Manutenção, Limpeza)",
                },
                Reserva: {
                    id_reserva: "number (PK)",
                    id_hospede: "number (FK -> Hospede)",
                    id_quarto: "number (FK -> Quarto)",
                    data_checkin: "string (ISO)",
                    data_checkout: "string (ISO)",
                    status_reserva: "Enum (Pendente, Confirmada, Check-in, Check-out, Cancelada)",
                    valor_total: "number",
                },
                // ... add other models
            },
            relationships: [
                "Um Hospede pode ter muitas Reservas.",
                "Um Quarto pode ter muitas Reservas.",
                "Uma Reserva pertence a um Hospede e um Quarto."
            ],
            modules: [
                "Dashboard", "Reservas", "Hospedes", "Financeiro",
                {
                    name: "Administração",
                    submodules: ["Gerenciar Usuários", "Gerenciar Quartos", "Gerenciar Tipos de Quartos", "Regras de Preços", "Configuração Avançada"]
                }
            ]
        };
        downloadFile('pousadapro-schema.json', JSON.stringify(schema, null, 2), 'application/json');
    };
    
    const handleExport = (format: 'json' | 'js' | 'postgres' | 'sqlite') => {
        if (format === 'json') {
            const allData = { ...mockData };
            downloadFile('pousadapro-database.json', JSON.stringify(allData, null, 2), 'application/json');
        } else if (format === 'js') {
            const jsContent = Object.entries(mockData)
                .map(([key, value]) => `export const ${key} = ${JSON.stringify(value, null, 2)};`)
                .join('\n\n');
            downloadFile('pousadapro-database.js', jsContent, 'text/javascript');
        } else if (format === 'postgres' || format === 'sqlite') {
            // NOTE: This is a simplified SQL generator for demonstration.
            const hospedesSql = `
CREATE TABLE hospedes (
    id_hospede INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    sobrenome TEXT NOT NULL,
    email TEXT
);
${mockData.mockHospedes.map(h => `INSERT INTO hospedes (id_hospede, nome, sobrenome, email) VALUES (${h.id_hospede}, '${h.nome}', '${h.sobrenome}', '${h.email}');`).join('\n')}
`;
            // ... generate for other tables
            downloadFile(`pousadapro-database-${format}.sql`, hospedesSql, 'application/sql');
        }
    };

    return (
        <Card title="Configuração Avançada do Sistema">
            <div className="space-y-8">
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Esquema do Sistema</h3>
                    <p className="text-gray-600 mb-4">Baixe um arquivo JSON contendo a estrutura de dados, módulos e relações do sistema PousadaPro. Útil para desenvolvedores e integrações.</p>
                    <button onClick={handleExportSchema} className="bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-primary transition duration-300">
                        Baixar Esquema do Sistema (.json)
                    </button>
                </section>

                <section>
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Exportar Banco de Dados</h3>
                    <p className="text-gray-600 mb-4">Faça o download de todos os dados da aplicação em diferentes formatos para backup, migração ou análise externa.</p>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={() => handleExport('json')} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300">Exportar para JSON</button>
                        <button onClick={() => handleExport('js')} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300">Exportar para JavaScript</button>
                        <button onClick={() => handleExport('postgres')} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">Exportar para PostgreSQL</button>
                        <button onClick={() => handleExport('sqlite')} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300">Exportar para SQLite</button>
                    </div>
                </section>
            </div>
        </Card>
    );
};

export default ConfiguracaoAvancadaPage;
