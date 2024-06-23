import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import './Home.css';
import { useTranslation } from "react-i18next";
import axios from 'axios';

const Home = () => {
    const [t, i18n] = useTranslation("global");
    const [entries, setEntries] = useState([]);
    const [newEntry, setNewEntry] = useState({
        tipo: 'Persona',
        nombre: '',
        referencia: '',
        patente: '',
        dept: '',
        horario: ''
    });
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

    // Manejar cambios en los campos del formulario de ingreso
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
    };

    // Enviar el formulario para crear un nuevo ingreso
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validación básica en el lado del cliente (puedes agregar más validaciones según tus necesidades)
        if (!newEntry.nombre.trim()) {
            setError('Por favor ingrese un nombre válido.');
            return;
        }

        setLoading(true);
        axios.post('https://apivercel-smoky.vercel.app/api/ingreso', newEntry)
            .then(response => {
                setLoading(false);
                setNewEntry({
                    tipo: 'Persona',
                    nombre: '',
                    referencia: '',
                    patente: '',
                    dept: '',
                    horario: ''
                });
                fetchEntries(); // Actualizar la lista de ingresos después de crear uno nuevo
            })
            .catch(error => {
                setLoading(false);
                console.error('Error creating entry:', error);

                // Determinar qué campo falló
                if (error.response) {
                    if (error.response.status === 400) {
                        const errorMessage = error.response.data.error || 'Error en la solicitud';
                        setError(errorMessage);
                        console.error(`Fallo porque no se ingresó correctamente el valor en ${error.response.data.field}`);
                    } else {
                        setError('Error creating entry. Please try again.');
                    }
                } else {
                    setError('Network error. Please try again.');
                }
            });
    };
    


    return (
        <div>
            <Navbar />
            <div className="main-home">
                {/* Formulario para registrar ingresos */}
                <div className="entry-form">
                    <h2>Registrar Nuevo Ingreso</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="nombre" placeholder="Nombre" value={newEntry.nombre} onChange={handleInputChange} />
                        <input type="text" name="referencia" placeholder="Referencia" value={newEntry.referencia} onChange={handleInputChange} />
                        <input type="text" name="patente" placeholder="Patente" value={newEntry.patente} onChange={handleInputChange} />
                        <select id="departmentNoFrecuente" name="dept" value={newEntry.dept} onChange={handleInputChange}>
                            <option value="">Seleccione un departamento</option>
                            <option value="Departamento 01">Departamento 01</option>
                            <option value="Departamento 02">Departamento 02</option>
                            <option value="Departamento 03">Departamento 03</option>
                            <option value="Departamento 04">Departamento 04</option>
                        </select>                        
                        <input type="datetime-local" name="horario" value={newEntry.horario} onChange={handleInputChange} />
                        <button type="submit" disabled={loading}>Registrar</button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
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

export default Home;
