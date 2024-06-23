import React, { useState, useEffect } from 'react';
import EntryForm from '../../components/entryForm/EntryForm.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import ParkingStatus from '../../components/ParkingStatus/ParkingStatus.jsx'; 
import './Vehiculos.css'; 

function Vehiculos() {
  const [message, setMessage] = useState('');
  const [freeSpots, setFreeSpots] = useState([]);

  const labels = {
    formTitle: 'Registro de Vehículos',
    namePlaceholder: 'Vehículo',
    referencePlaceholder: 'Patente',
    departmentPlaceholder: 'Seleccionar Estacionamiento',
    submitButton: 'Registrar'
  };

  const fetchFreeSpots = async () => {
    try {
      const response = await fetch('https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/vehicles/free-spots');
      if (!response.ok) {
        throw new Error('Error al obtener estacionamientos libres.');
      }
      const spots = await response.json();
      setFreeSpots(spots);
    } catch (error) {
      console.error('Error al obtener estacionamientos libres:', error);
    }
  };

  useEffect(() => {
    fetchFreeSpots();
  }, []);

  const handleEntryCreated = async (formData) => {
    try {
      if (freeSpots.length === 0) {
        setMessage('No hay lugares de estacionamiento disponibles.');
        return;
      }

      const randomIndex = Math.floor(Math.random() * freeSpots.length);
      const selectedSpot = freeSpots[randomIndex];

      const vehicleData = {
        patente: formData.referencia,
        entrada: formData.horario,
        estacionamiento: selectedSpot.id
      };

      console.log('Datos enviados al backend:', vehicleData); 

      const createResponse = await fetch('https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicleData)
      });

      const createResponseText = await createResponse.text();
      if (!createResponse.ok) {
        throw new Error(`Error creando vehículo: ${createResponse.statusText} - ${createResponseText}`);
      }

      setMessage(`Se ingresó el vehículo ${formData.nombre} con patente ${formData.referencia} en el estacionamiento ${selectedSpot.id}.`);
      fetchFreeSpots(); // Actualizar la lista de estacionamientos libres
    } catch (error) {
      console.error('Error creando vehículo:', error);
      setMessage(`Error al registrar el vehículo: ${error.message}`);
    }
  };

  const handleFreeSpot = async (id) => {
    try {
      const vehicleData = {
        patente: null,
        entrada: null,
        estacionamiento: id
      };

      console.log('Datos enviados para borrar:', vehicleData);

      const updateResponse = await fetch('https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicleData)
      });

      const updateResponseText = await updateResponse.text();
      if (!updateResponse.ok) {
        throw new Error(`Error liberando estacionamiento: ${updateResponse.statusText} - ${updateResponseText}`);
      }

      setMessage(`Estacionamiento ${id} liberado exitosamente.`);
      fetchFreeSpots(); // Actualizar la lista de estacionamientos libres
    } catch (error) {
      console.error('Error liberando estacionamiento:', error);
      setMessage(`Error al liberar el estacionamiento: ${error.message}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='vehiculos-form-container'>
        <h1>Registro de Vehículos</h1>
        <EntryForm onEntryCreated={handleEntryCreated} labels={labels} defaultTipo="Vehiculo" />
        {message && <p className="mensaje">{message}</p>}
        <ParkingStatus freeSpots={freeSpots} onFreeSpot={handleFreeSpot} /> {/* Pasar la lista de estacionamientos libres y la función para liberar */}
      </div>
    </div>
  );
}

export default Vehiculos;
