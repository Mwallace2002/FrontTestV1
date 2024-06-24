// Home.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import './Home.css';
import { useTranslation } from "react-i18next";
import axios from 'axios';
import EntryForm from '../../components/EntryForm/EntryForm.jsx'; 

const Home = () => {
    const { t, i18n } = useTranslation("global");
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
                setError(t('home.errorFetchingEntries'));
            });
    };

    const labels = {
        formTitle: t('home.formTitle'),
        namePlaceholder: t('home.namePlaceholder'),
        referencePlaceholder: t('home.referencePlaceholder'),
        departmentPlaceholder: t('home.departmentPlaceholder'),
        submitButton: t('home.submitButton')
    };

    const defaultTipo = 'visitas'; // Establecer el tipo predeterminado español por la base de datos

    return (
        <div>
            <Navbar />
            <div className="main-home">
                <EntryForm onEntryCreated={fetchEntries} labels={labels} defaultTipo={defaultTipo} />
                <div className="entries-list">
                    <h2>{t('home.entriesList')}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t('home.type')}</th>
                                <th>{t('home.name')}</th>
                                <th>{t('home.reference')}</th>
                                <th>{t('home.department')}</th>
                                <th>{t('home.schedule')}</th>
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
                    {error && <p>{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Home;
