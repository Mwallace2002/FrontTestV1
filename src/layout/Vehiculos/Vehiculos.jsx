import React, { useState } from 'react';
import EntryForm from '../../components/entryForm/EntryForm.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import './Vehiculos.css'; // Importa el archivo CSS

function Vehiculos() {
  const [message, setMessage] = useState('');

  const labels = {
    formTitle: 'Registro de Vehículos',
    namePlaceholder: 'Vehículo',
    referencePlaceholder: 'Patente',
    departmentPlaceholder: 'Seleccionar Estacionamiento',
    submitButton: 'Registrar'
  };

  const handleEntryCreated = (formData) => {
    console.log('Nuevo vehículo registrado:', formData);
    const vehicleId = formData.referencia;
    const time = formData.horario;
    const vehicleData = {
      patente: vehicleId,
      entrada: time,
      estacionamiento: "1", 
    };
    handlePost(vehicleData);
    console.log('Nu1o:', vehicleData);

  }

  const handlePost = async (vehicleData) => {
    try {
      console.log('Nu1wo:', vehicleData);

      

      console.log('Datos enviados al backend:', vehicleData); // Agrega un console.log para verificar los datos enviados

      const createResponse = await fetch('https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicleData)
      });

      const createResponseText = await createResponse.text();
      if (!createResponse.ok) {
        throw new Error(`Error creating vehicle: ${createResponse.statusText} - ${createResponseText}`);
      }

      setMessage('Vehículo registrado con éxito.');
    } catch (error) {
      console.error('Error creating vehicle:', error);
      setMessage(`Error al registrar el vehículo: ${error.message}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='vehiculos-form-container'>
        <h1>Registro de Vehículos</h1>
        <EntryForm onEntryCreated={handleEntryCreated} labels={labels} defaultTipo="Vehiculo" />
        {message && <p className="mensaje">{message}</p>}
      </div>
    </div>
  );
}

export default Vehiculos;
