// Home.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import './Home.css';
import { useTranslation } from "react-i18next";
import axios from 'axios';
import EntryForm from '../../components/entryForm/EntryForm.jsx'; 

const Home = () => {
    const [t, i18n] = useTranslation("global");
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = () => {
        axios.get('https://apivercel-smoky.vercel.app/api/ingreso')
            .then(response => {
                setEntries(response.data);
            })
            .catch(error => {
                console.error('Error fetching entries:', error);
                setError('Error fetching entries. Please try again later.');
            });
    };

    const labels = {
        formTitle: 'Registrar Nuevo Ingreso',
        namePlaceholder: 'Nombre',
        referencePlaceholder: 'RUT',
        departmentPlaceholder: 'Seleccione un departamento',
        submitButton: 'Registrar'
    };

    const defaultTipo = 'visitas'; // Establecer el tipo predeterminado

    return (
        <div>
            <Navbar />
            <div className="main-home">
                <EntryForm onEntryCreated={fetchEntries} labels={labels} defaultTipo={defaultTipo} /> {/* Pasar defaultTipo como prop */}
                <div className="entries-list">
                    <h2>Lista de Ingresos</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Nombre</th>
                                <th>Referencia (RUT / Patente / ID Paquete)</th>
                                <th>Dept</th>
                                <th>Horario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(entry => (
                                <tr key={entry.id}>
                                    <td>{entry.id}</td>
                                    <td>{entry.tipo}</td>
                                    <td>{entry.nombre}</td>
                                    <td>{entry.referencia}</td>
                                    <td>{entry.dept}</td>
                                    <td>{entry.horario}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Home;
