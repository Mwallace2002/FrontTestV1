import React, { useState, useEffect } from 'react';
import EntryForm from '../../components/EntryForm/EntryForm.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import ParkingStatus from '../../components/ParkingStatus/ParkingStatus.jsx'; 
import './Vehiculos.css'; 
import QRCode from 'qrcode.react';
import { useTranslation } from 'react-i18next';

function Vehiculos() {
  const { t } = useTranslation("global");
  const [message, setMessage] = useState('');
  const [freeSpots, setFreeSpots] = useState([]);
  const [tiempoEstancia, setTiempoEstancia] = useState(0);
  const [tiempoAdvertencia, setTiempoAdvertencia] = useState(0);
  const [whatsappURL, setWhatsappURL] = useState('');
  const [departmentNumber, setDepartmentNumber] = useState('');
  const [showQR, setShowQR] = useState(false); // Estado para mostrar o no el QR y el mensaje

  const labels = {
    formTitle: t('vehiculos.formTitle'),
    namePlaceholder: t('vehiculos.namePlaceholder'),
    referencePlaceholder: t('vehiculos.referencePlaceholder'),
    departmentPlaceholder: t('vehiculos.departmentPlaceholder'),
    submitButton: t('vehiculos.submitButton')
  };

  const fetchFreeSpots = async () => {
    try {
      const response = await fetch('https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/vehicles/free-spots');
      if (!response.ok) {
        throw new Error(t('vehiculos.fetchFreeSpotsError'));
      }
      const spots = await response.json();
      setFreeSpots(spots);
    } catch (error) {
      console.error(t('vehiculos.fetchFreeSpotsError'), error);
    }
  };

  useEffect(() => {
    fetchFreeSpots();
    const fetchParameters = async () => {
      try {
        const response = await fetch('https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/parametros');
        if (!response.ok) {
          throw new Error(t('vehiculos.fetchParamsError'));
        }
        const params = await response.json();
        setTiempoEstancia(params.TiempoEstancia);
        setTiempoAdvertencia(params.TiempoAdvertencia);
      } catch (error) {
        console.error(t('vehiculos.fetchParamsError'), error);
      }
    };

    fetchParameters();
  }, []);

  const fetchDepartmentNumber = async (department, message) => { 
    try {
      const response = await fetch(`https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/department/${department}`);
      if (!response.ok) {
        throw new Error(t('vehiculos.fetchDeptNumberError'));
      }
      const data = await response.json();
      setDepartmentNumber(data.numero);
  
      const encodedMessage = encodeURIComponent(message);
      const url = `https://api.whatsapp.com/send?phone=${data.numero}&text=${encodedMessage}`;
      console.log(t('vehiculos.whatsappURL'), url);
      setWhatsappURL(url);
      setMessage(message);
      setShowQR(true); // Mostrar el QR y el mensaje cuando se tiene el URL de WhatsApp
    } catch (error) {
      console.error(t('vehiculos.fetchDeptNumberError'), error);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 10000); // Desaparece el mensaje después de 10 segundos
  };

  const handleEntryCreated = async (formData) => {
    try {
      if (freeSpots.length === 0) {
        showMessage(t('vehiculos.noFreeSpots'));
        return;
      }

      const horaIngreso = new Date(formData.horario);
      const horaAdvertencia = new Date(horaIngreso.getTime() + (tiempoEstancia - tiempoAdvertencia) * 60000);

      const tiempoRestante = tiempoAdvertencia * 60000;
      console.log('dept:', formData.dept);
      console.log('el log:',  formData.dept, t('vehiculos.advertenciaMessage', { nombre: formData.nombre, referencia: formData.referencia, tiempoAdvertencia }));

      setTimeout(() => {
        const advertenciaMessage = t('vehiculos.advertenciaMessage', { nombre: formData.nombre, referencia: formData.referencia, tiempoAdvertencia });
        showMessage(advertenciaMessage);
        fetchDepartmentNumber(formData.dept, advertenciaMessage);
      }, tiempoRestante);

      const randomIndex = Math.floor(Math.random() * freeSpots.length);
      const selectedSpot = freeSpots[randomIndex];

      const vehicleData = {
        patente: formData.referencia,
        entrada: formData.horario,
        estacionamiento: selectedSpot.id
      };

      console.log(t('vehiculos.dataSentToBackend'), vehicleData); 

      const createResponse = await fetch('https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicleData)
      });

      const createResponseText = await createResponse.text();
      if (!createResponse.ok) {
        throw new Error(`${t('vehiculos.createVehicleError')}: ${createResponse.statusText} - ${createResponseText}`);
      }

      showMessage(t('vehiculos.vehicleRegistered', { nombre: formData.nombre, referencia: formData.referencia, estacionamiento: selectedSpot.id }));
      fetchFreeSpots(); 
    } catch (error) {
      console.error(t('vehiculos.createVehicleError'), error);
      showMessage(`${t('vehiculos.registerVehicleError')}: ${error.message}`);
    }
  };

  const handleFreeSpot = async (id) => {
    try {
      const vehicleData = {
        patente: null,
        entrada: null,
        estacionamiento: id
      };

      console.log(t('vehiculos.dataSentToDelete'), vehicleData);

      const updateResponse = await fetch('https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicleData)
      });

      const updateResponseText = await updateResponse.text();
      if (!updateResponse.ok) {
        throw new Error(`${t('vehiculos.freeSpotError')}: ${updateResponse.statusText} - ${updateResponseText}`);
      }

      showMessage(t('vehiculos.spotFreed', { id }));
      fetchFreeSpots(); 
    } catch (error) {
      console.error(t('vehiculos.freeSpotError'), error);
      showMessage(`${t('vehiculos.freeSpotError')}: ${error.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Navbar />
      <div className='vehiculos-form-container'>
        <h1 style={{ color: 'white' }}>{t('vehiculos.formTitle')}</h1>
        <EntryForm onEntryCreated={handleEntryCreated} labels={labels} defaultTipo="Vehiculo" />
        <div className='graphics-container'>
            <ParkingStatus freeSpots={freeSpots} onFreeSpot={handleFreeSpot} /> 
        </div>
        <center>{message && <p className="mensaje">{message}</p>}</center>
        {showQR && (
          <div className="qr-code">
            <center>
              <h2 style={{ color: 'white' }}>{t('vehiculos.scanQRCode')}</h2>
              <QRCode value={whatsappURL} />
            </center>
          </div>
        )}
      </div>        
    </div>
  );
}

export default Vehiculos;
