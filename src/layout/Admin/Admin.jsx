import React, { useState } from 'react';
import './Admin.css'; // Asegúrate de importar el CSS aquí

function Admin() {
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
        setMessage('Error al actualizar parámetros');
      }
    } catch (error) {
      console.error('Error al actualizar parámetros:', error);
      setMessage('Error al actualizar parámetros');
    }
  };

  return (
    <div><Navbar />
      <div className="admin-form-container">
        <h1>Configuración de Parámetros</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label htmlFor="tiempoEstancia">Tiempo de Estancia</label>
          <input
            type="text"
            id="tiempoEstancia"
            value={tiempoEstancia}
            onChange={(e) => setTiempoEstancia(e.target.value)}
            required
          />

          <label htmlFor="tiempoAdvertencia">Tiempo para Advertencia</label>
          <input
            type="text"
            id="tiempoAdvertencia"
            value={tiempoAdvertencia}
            onChange={(e) => setTiempoAdvertencia(e.target.value)}
            required
          />

          <button type="submit">Actualizar Parámetros</button>
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
