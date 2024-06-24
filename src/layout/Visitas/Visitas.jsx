import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import './Visitas.css';
import VisitaFrecuenteForm from '../../components/VisitaFrecuenteForm/visitaFrecuenteForm.jsx'; 
import { useTranslation } from 'react-i18next';

const departments = [
  'Departamento 01',
  'Departamento 02',
  'Departamento 03',
  'Departamento 04'
];

const Visitas = () => {
  const { t } = useTranslation("global");

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [verificarRut, setVerificarRut] = useState('');
  const [verificarRutMessage, setVerificarRutMessage] = useState('');

  const [rutNoFrecuente, setRutNoFrecuente] = useState('');
  const [nombreNoFrecuente, setNombreNoFrecuente] = useState('');
  const [fechaNacimientoNoFrecuente, setFechaNacimientoNoFrecuente] = useState('');
  const [selectedDepartmentNoFrecuente, setSelectedDepartmentNoFrecuente] = useState('');

  const [patenteFrecuente, setPatenteFrecuente] = useState(''); // Estado para la patente de visita frecuente
  const [patenteNoFrecuente, setPatenteNoFrecuente] = useState(''); // Estado para la patente de visita no frecuente

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleDepartmentChangeNoFrecuente = (event) => {
    setSelectedDepartmentNoFrecuente(event.target.value);
  };

  const handleSubmitFrecuente = async (event) => {
    event.preventDefault(); 

    try {
      const response = await fetch('https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/visitas-frecuentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rut,
          nombre,
          fechaNacimiento,
          departamento: selectedDepartment,
          patente: patenteFrecuente
        })
      });

      if (!response.ok) {
        throw new Error(t('visitas.addFrequentVisitError'));
      }

      const data = await response.json();
      console.log(t('visitas.frequentVisitAdded'), data);
    } catch (error) {
      console.error(t('visitas.error'), error.message);
    }
  };

  const handleSubmitNoFrecuente = async (event) => {
    event.preventDefault(); 

    try {
      const response = await fetch('https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/visitas-no-frecuentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rut: rutNoFrecuente,
          nombre: nombreNoFrecuente,
          fechaNacimiento: fechaNacimientoNoFrecuente,
          patente: patenteNoFrecuente
        })
      });

      if (!response.ok) {
        throw new Error(t('visitas.addNonFrequentVisitError'));
      }

      const data = await response.json();
      console.log(t('visitas.nonFrequentVisitAdded'), data);
    } catch (error) {
      console.error(t('visitas.error'), error.message);
    }
  };

  const handleSubmitVerificarFrecuente = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/verificar-visita-frecuente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rut: verificarRut })
      });

      if (!response.ok) {
        throw new Error(t('visitas.verifyFrequentVisitError'));
      }

      const data = await response.json();

      if (data.esFrecuente) {
        setVerificarRutMessage(t('visitas.isFrequentVisit'));
      } else {
        setVerificarRutMessage(t('visitas.isNotFrequentVisit'));
      }
    } catch (error) {
      setVerificarRutMessage(`${t('visitas.error')}: ${error.message}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="visitas-form-container">
        <h1><center>{t('visitas.verifyFrequentVisit')}</center></h1>
        <form className="visitas-form" onSubmit={handleSubmitVerificarFrecuente}>
          <label htmlFor="verificarRut">{t('visitas.rutPlaceholder')}</label>
          <input
            type="text"
            id="verificarRut"
            name="verificarRut"
            value={verificarRut}
            onChange={(e) => setVerificarRut(e.target.value)}
          />
          <p>{verificarRutMessage}</p>
          <button type="submit">{t('visitas.submitButton')}</button>
        </form>
      </div>

      <VisitaFrecuenteForm />

      <div className="visitas-form-container">
        <h1><center>{t('visitas.addNonFrequentVisit')}</center></h1>
        <form className="visitas-form" onSubmit={handleSubmitNoFrecuente}>
          <label htmlFor="patenteNoFrecuente">{t('visitas.vehiclePlate')}</label>
          <input type="text" id="patenteNoFrecuente" name="patenteNoFrecuente" value={patenteNoFrecuente} onChange={(e) => setPatenteNoFrecuente(e.target.value)} />
          
          <label htmlFor="departmentNoFrecuente">{t('visitas.selectDepartment')}</label>
          <select id="departmentNoFrecuente" value={selectedDepartmentNoFrecuente} onChange={handleDepartmentChangeNoFrecuente}>
            <option value="">{t('visitas.selectDepartmentOption')}</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <label htmlFor="rutNoFrecuente">{t('visitas.rutNoFrequentPlaceholder')}</label>
          <input type="text" id="rutNoFrecuente" name="rutNoFrecuente" value={rutNoFrecuente} onChange={(e) => setRutNoFrecuente(e.target.value)} />

          <label htmlFor="nombreNoFrecuente">{t('visitas.namePlaceholder')}</label>
          <input type="text" id="nombreNoFrecuente" name="nombreNoFrecuente" value={nombreNoFrecuente} onChange={(e) => setNombreNoFrecuente(e.target.value)} />

          <label htmlFor="fechaNacimientoNoFrecuente">{t('visitas.birthDatePlaceholder')}</label>
          <input type="date" id="fechaNacimientoNoFrecuente" name="fechaNacimientoNoFrecuente" value={fechaNacimientoNoFrecuente} onChange={(e) => setFechaNacimientoNoFrecuente(e.target.value)} />

          <button type="submit">{t('visitas.submitButton')}</button>
        </form>
      </div>
    </div>
  );
};

export default Visitas;
