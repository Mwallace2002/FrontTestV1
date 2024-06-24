import React, { useState } from 'react';
import './visitaFrecuenteForm.css';
import { useTranslation } from 'react-i18next';

const departments = [
  'Ventas',
  'Marketing',
  'Desarrollo',
  'Recursos humanos'
];

const VisitaFrecuenteForm = () => {
  const { t } = useTranslation("global");
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [patenteFrecuente, setPatenteFrecuente] = useState('');

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
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
        throw new Error(t('visitaFrecuenteForm.errorAddFrequentVisit'));
      }

      const data = await response.json();
      console.log(t('visitaFrecuenteForm.frequentVisitAdded'), data);
    } catch (error) {
      console.error(t('visitaFrecuenteForm.error'), error.message);
    }
  };

  return (
    <div className="visitas-form-container">
      <h1><center>{t('visitaFrecuenteForm.addFrequentVisit')}</center></h1>
      <form className="visitas-form" onSubmit={handleSubmitFrecuente}>
        <label htmlFor="patenteFrecuente">{t('visitaFrecuenteForm.vehicleLicensePlate')}</label>
        <input type="text" id="patenteFrecuente" name="patenteFrecuente" value={patenteFrecuente} onChange={(e) => setPatenteFrecuente(e.target.value)} />
        
        <label htmlFor="department">{t('visitaFrecuenteForm.department')}</label>
        <select id="department" value={selectedDepartment} onChange={handleDepartmentChange}>
          <option value="">{t('visitaFrecuenteForm.selectDepartment')}</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <label htmlFor="rut">{t('visitaFrecuenteForm.visitRut')}</label>
        <input type="text" id="rut" name="rut" value={rut} onChange={(e) => setRut(e.target.value)} />

        <label htmlFor="nombre">{t('visitaFrecuenteForm.name')}</label>
        <input type="text" id="nombre" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />

        <label htmlFor="fechaNacimiento">{t('visitaFrecuenteForm.birthDate')}</label>
        <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />

        <button type="submit">{t('visitaFrecuenteForm.submit')}</button>
      </form>
    </div>
  );
};

export default VisitaFrecuenteForm;
