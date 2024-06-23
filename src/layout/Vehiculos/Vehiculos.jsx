import React, { useState, useEffect } from 'react';
import EntryForm from '../../components/EntryForm/EntryForm.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import ParkingStatus from '../../components/ParkingStatus/ParkingStatus.jsx'; 
import './Vehiculos.css'; 
import QRCode from 'qrcode.react';

function Vehiculos() {
  const [message, setMessage] = useState('');
  const [freeSpots, setFreeSpots] = useState([]);
  const [tiempoEstancia, setTiempoEstancia] = useState(0);
  const [tiempoAdvertencia, setTiempoAdvertencia] = useState(0);
  const [whatsappURL, setWhatsappURL] = useState('');
  const [departmentNumber, setDepartmentNumber] = useState('');
  const [showQR, setShowQR] = useState(false); // Estado para mostrar o no el QR y el mensaje

  const labels = {
    formTitle: 'Registro de Vehículos',
    namePlaceholder: 'Vehículo',
    referencePlaceholder: 'Patente',
    departmentPlaceholder: 'Seleccionar Departamento',
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
    const fetchParameters = async () => {
      try {
        const response = await fetch('https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/parametros');
        if (!response.ok) {
          throw new Error('Error al obtener parámetros de tiempo.');
        }
        const params = await response.json();
        setTiempoEstancia(params.TiempoEstancia);
        setTiempoAdvertencia(params.TiempoAdvertencia);
      } catch (error) {
        console.error('Error al obtener parámetros de tiempo:', error);
      }
    };

    fetchParameters();
  }, []);

  const fetchDepartmentNumber = async (department, message) => { 
    try {
      const response = await fetch(`https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/department/${department}`);
      if (!response.ok) {
        throw new Error('Error al obtener el número de WhatsApp');
      }
      const data = await response.json();
      setDepartmentNumber(data.numero);
  
      const encodedMessage = encodeURIComponent(message);
      const url = `https://api.whatsapp.com/send?phone=${data.numero}&text=${encodedMessage}`;
      console.log('URL de WhatsApp:', url);
      setWhatsappURL(url);
      setMessage(message);
      setShowQR(true); // Mostrar el QR y el mensaje cuando se tiene el URL de WhatsApp
    } catch (error) {
      console.error('Error fetching department number:', error);
    }
  };

  const handleEntryCreated = async (formData) => {
    try {
      if (freeSpots.length === 0) {
        setMessage('No hay lugares de estacionamiento disponibles.');
        return;
      }

      const horaIngreso = new Date(formData.horario);
      const horaAdvertencia = new Date(horaIngreso.getTime() + (tiempoEstancia - tiempoAdvertencia) * 60000);

      const tiempoRestante = tiempoAdvertencia * 60000;
      console.log('dept:', formData.dept);
      console.log('el log:',  formData.dept, `El vehículo ${formData.nombre} de patente ${formData.referencia} le queda ${tiempoAdvertencia} minutos antes que se acabe su tiempo.`);
      setTimeout(() => {
        setMessage(`El vehículo ${formData.nombre} de patente ${formData.referencia} le queda ${tiempoAdvertencia} minutos antes que se acabe su tiempo.`);
        fetchDepartmentNumber(formData.dept, `El vehículo ${formData.nombre} de patente ${formData.referencia} le queda ${tiempoAdvertencia} minutos antes que se acabe su tiempo.`);
      }, tiempoRestante);

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
      fetchFreeSpots(); 
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
      fetchFreeSpots(); 
    } catch (error) {
      console.error('Error liberando estacionamiento:', error);
      setMessage(`Error al liberar el estacionamiento: ${error.message}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='vehiculos-form-container'>
        <h1 style={{ color: 'white' }}>Registro de Vehículos</h1>
        <EntryForm onEntryCreated={handleEntryCreated} labels={labels} defaultTipo="Vehiculo" />
        <div className='graphics-container'>
            <ParkingStatus freeSpots={freeSpots} onFreeSpot={handleFreeSpot} /> 
        </div>
        {message && <p className="mensaje">{message}</p>}
        {showQR && (
          <div className="qr-code">
            <center>
              <h2 style={{ color: 'white' }}>Scan this QR Code to send the message via WhatsApp</h2>
              <QRCode value={whatsappURL} />
            </center>
          </div>
        )}
      </div>        
    </div>
  );
}

export default Vehiculos;
