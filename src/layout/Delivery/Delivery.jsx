import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import QRCode from 'qrcode.react';
import './Delivery.css';
import EntryForm from '../../components/EntryForm/EntryForm.jsx';
import { useTranslation } from 'react-i18next';

function DeliveryForm() {
    const { t, i18n } = useTranslation('global');
    const [whatsappURL, setWhatsappURL] = useState('');
    const [messageSent, setMessageSent] = useState(false);
    const [departmentNumber, setDepartmentNumber] = useState('');
    const [message, setMessage] = useState('');

    const labels = {
        formTitle: 'Registrar Delivery',
        namePlaceholder: 'Nombre Recipiente',
        referencePlaceholder: 'ID del paquete',
        departmentPlaceholder: 'Seleccione un departamento',
        submitButton: 'Registrar'
    };

    const handleEntryCreated = (formData) => {
        console.log('Nuevo paquete registrado:', formData);
        console.log('ID del paquete:', formData.referencia);
        console.log('Hora de llegada:', formData.horario);
        console.log('Destinatario:', formData.nombre);
        console.log('Departamento:', formData.dept);

        const packageId = formData.referencia;
        const recipient = formData.nombre;
        const newMessage = `Hola ${recipient}, soy el conserje. Tienes un paquete ${packageId} en la recepción. Ven a buscarlo cuando puedas. Gracias.`;

        fetchDepartmentNumber(formData.dept, newMessage); // Pasar newMessage y formData.dept a fetchDepartmentNumber
    };

    const fetchDepartmentNumber = async (department, message) => {
        try {
            const response = await fetch(`https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/department/${department}`);
            if (!response.ok) {
                throw new Error('Error al obtener el número de WhatsApp');
            }
            const data = await response.json();
            setDepartmentNumber(data.numero);
            handleSendMessage(data.numero, message); // Llamar a handleSendMessage con el nuevo número de departamento y el mensaje
        } catch (error) {
            console.error('Error fetching department number:', error);
        }
    };

    const handleSendMessage = (departmentNumber, message) => { // Añadir message como parámetro
        console.log("mensaje", message); // Asegúrate de escribir console con minúscula
        const encodedMessage = encodeURIComponent(message);
        const url = `https://api.whatsapp.com/send?phone=${departmentNumber}&text=${encodedMessage}`;
        console.log('URL de WhatsApp:', url);
        setWhatsappURL(url); // Actualizar whatsappURL con la URL construida
        window.open(url, '_blank');
        setMessageSent(true);
    };

    return (
        <div>
            <Navbar />
            <div className="delivery-form-container">
                <h1><center>{t('delivery.title')}</center></h1>
                <EntryForm onEntryCreated={handleEntryCreated} labels={labels} defaultTipo="delivery" /> {/* Pasar defaultTipo como 'delivery' */}
                {whatsappURL && (
                    <div className="qr-code">
                        <center>
                            <h2>{t('delivery.scanQR')}</h2> {/* Traducción para scan QR */}
                            <QRCode value={whatsappURL} />
                        </center>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DeliveryForm;
