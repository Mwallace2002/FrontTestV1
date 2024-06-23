import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import QRCode from 'qrcode.react';
import './Delivery.css';

function DeliveryForm() {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [whatsappURL, setWhatsappURL] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [departmentNumber, setDepartmentNumber] = useState('');

  const departments = [
    { name: 'Ventas', id: 'ventas' },
    { name: 'Marketing', id: 'marketing' },
    { name: 'Desarrollo', id: 'desarrollo' },
    { name: 'Recursos humanos', id: 'recursos-humanos' }
  ];

  useEffect(() => {
    if (selectedDepartment) {
      fetchDepartmentNumber(selectedDepartment);
    }
  }, [selectedDepartment]);

  const fetchDepartmentNumber = async (department) => {
    try {
      const response = await fetch(`https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/department/${department}`);
      if (!response.ok) {
        throw new Error('Error al obtener el número de WhatsApp');
      }
      const data = await response.json();
      setDepartmentNumber(data.numero);  // Cambiar de `data.whatsappNumber` a `data.numero`
    } catch (error) {
      console.error('Error fetching department number:', error);
    }
  };
  
  const handleDepartmentChange = (event) => {
    const department = event.target.value;
    setSelectedDepartment(department);
  };

  const handleSendMessage = () => {
    const packageId = document.getElementById('packageId').value;
    const arrivalTime = document.getElementById('arrivalTime').value;
    const recipient = document.getElementById('recipient').value;
    const message = `ID del paquete: ${packageId}, Hora de llegada: ${arrivalTime}, Destinatario: ${recipient}`;
    const whatsappURL = `https://api.whatsapp.com/send?phone=${departmentNumber}&text=${encodeURIComponent(message)}`;
    setWhatsappURL(whatsappURL);
    window.open(whatsappURL, '_blank');
    setMessageSent(true);
  };

  return (
    <div>
      <Navbar />
      <div className="delivery-form-container">
        <h1><center>Esta es la página de Entrega</center></h1>
        <form className="delivery-form">
          <label htmlFor="department">Departamento:</label>
          <select id="department" value={selectedDepartment} onChange={handleDepartmentChange}>
            <option value="">Seleccione un departamento</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          {selectedDepartment && <p>Departamento seleccionado: {selectedDepartment}</p>}

          <label htmlFor="packageId">ID del paquete:</label>
          <input type="text" id="packageId" name="packageId" />

          <label htmlFor="arrivalTime">Hora de llegada:</label>
          <input type="time" id="arrivalTime" name="arrivalTime" />

          <label htmlFor="recipient">Destinatario:</label>
          <input type="text" id="recipient" name="recipient" />

          <button type="button" onClick={handleSendMessage}>Enviar</button>
          {messageSent && <p>¡Mensaje enviado correctamente!</p>}
        </form>
        {whatsappURL && (
          <div className="qr-code">
            <h2>Scan this QR Code to send the message via WhatsApp</h2>
            <QRCode value={whatsappURL} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryForm;
