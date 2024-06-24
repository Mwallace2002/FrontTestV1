// EntryForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './EntryForm.css';
import { useTranslation } from 'react-i18next';

const EntryForm = ({ onEntryCreated, defaultTipo }) => {
    const { t } = useTranslation("global");
    const [newEntry, setNewEntry] = useState({
        tipo: defaultTipo,
        nombre: '',
        referencia: '',
        dept: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
    };

    const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!newEntry.nombre.trim() || !newEntry.referencia.trim() || !newEntry.dept.trim()) {
            setError(t('entryForm.errorIncompleteFields'));
            return;
        }

        const entryWithTime = { ...newEntry, horario: getCurrentTime() };

        setLoading(true);
        axios.post('https://apivercel-smoky.vercel.app/api/ingreso', entryWithTime)
            .then(response => {
                setLoading(false);
                setNewEntry({
                    tipo: defaultTipo,
                    nombre: '',
                    referencia: '',
                    dept: ''
                });
                onEntryCreated(entryWithTime);
            })
            .catch(error => {
                setLoading(false);
                console.error('Error creating entry:', error);

                if (error.response) {
                    if (error.response.status === 400) {
                        const errorMessage = error.response.data.error || t('entryForm.errorRequest');
                        setError(errorMessage);
                    } else {
                        setError(t('entryForm.errorCreateEntry'));
                    }
                } else {
                    setError(t('entryForm.errorNetwork'));
                }
            });
    };

    return (
        <div className="entry-form">
            <h2>{t('entryForm.formTitle')}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="nombre" placeholder={t('entryForm.namePlaceholder')} value={newEntry.nombre} onChange={handleInputChange} />
                <input type="text" name="referencia" placeholder={t('entryForm.referencePlaceholder')} value={newEntry.referencia} onChange={handleInputChange} />
                <select id="departmentNoFrecuente" name="dept" value={newEntry.dept} onChange={handleInputChange}>
                    <option value="">{t('entryForm.departmentPlaceholder')}</option>
                    <option value="Departamento 01">Departamento 01</option>
                    <option value="Departamento 02">Departamento 02</option>
                    <option value="Departamento 03">Departamento 03</option>
                    <option value="Departamento 04">Departamento 04</option>
                </select>
                <button type="submit" disabled={loading}>{loading ? t('entryForm.loading') : t('entryForm.submitButton')}</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default EntryForm;
