import React, { useState } from 'react';
import './Admin.css'; // Asegúrate de importar el CSS aquí
import Navbar from '../Navbar/Navbar.jsx';
import { useTranslation } from 'react-i18next';

function Admin() {
  const { t, i18n } = useTranslation('global');
  const [tiempoEstancia, setTiempoEstancia] = useState('');
  const [tiempoAdvertencia, setTiempoAdvertencia] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/parametros', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ TiempoEstancia: tiempoEstancia, TiempoAdvertencia: tiempoAdvertencia }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message);
      } else {
        setMessage(t('admin.updateError'));
      }
    } catch (error) {
      console.error('Error al actualizar parámetros:', error);
      setMessage(t('admin.updateError'));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="admin-form-container">
        <h1>{t('admin.parametersConfig')}</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label htmlFor="tiempoEstancia">{t('admin.stayTime')}</label>
          <input
            type="text"
            id="tiempoEstancia"
            value={tiempoEstancia}
            onChange={(e) => setTiempoEstancia(e.target.value)}
            required
          />

          <label htmlFor="tiempoAdvertencia">{t('admin.warningTime')}</label>
          <input
            type="text"
            id="tiempoAdvertencia"
            value={tiempoAdvertencia}
            onChange={(e) => setTiempoAdvertencia(e.target.value)}
            required
          />

          <button type="submit">{t('admin.updateParameters')}</button>
        </form>

        {message && (
          <div className="message-container">
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
