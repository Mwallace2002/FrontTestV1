import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import './Home.css';
import { useTranslation } from "react-i18next";
import axios from 'axios';

const HomeUser = () => {
    const [t, i18n] = useTranslation("global");
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Función para cargar los ingresos al cargar la página
    useEffect(() => {
        fetchEntries();
    }, []);

    // Función para obtener los ingresos desde el backend
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

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div>
            <Navbar />
            <div className="main-home">
                <div>{t("label.Logged")}</div>
                <div className="buttons-container">
                    <button className="custom-button1" onClick={handleLogout}>{t("label.Logout")}</button>
                </div>

                {/* Tabla de ingresos */}
                <div className="entries-list">
                    <h2>Lista de Ingresos</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Nombre</th>
                                <th>Referencia</th>
                                <th>Patente</th>
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
                                    <td>{entry.patente}</td>
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

export default HomeUser;
