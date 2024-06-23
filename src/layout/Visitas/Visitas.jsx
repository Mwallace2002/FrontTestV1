import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import './Visitas.css';
import VisitaFrecuenteForm from '../../components/visitaFrecuenteForm.jsx'; 

const departments = [
  'Ventas',
  'Marketing',
  'Desarrollo',
  'Recursos humanos'
];

const Visitas = () => {
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
        throw new Error('Error al agregar visita frecuente');
      }

      const data = await response.json();
      console.log('Visita frecuente agregada:', data);
    } catch (error) {
      console.error('Error:', error.message);
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
        throw new Error('Error al agregar visita no frecuente');
      }

      const data = await response.json();
      console.log('Visita no frecuente agregada:', data);
    } catch (error) {
      console.error('Error:', error.message);
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
        throw new Error('Error al verificar visita frecuente');
      }

      const data = await response.json();

      if (data.esFrecuente) {
        setVerificarRutMessage('La visita es frecuente');
      } else {
        setVerificarRutMessage('La visita no es frecuente');
      }
    } catch (error) {
      setVerificarRutMessage('Error: ' + error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="visitas-form-container">
        <h1><center>Verificar si es visita frecuente</center></h1>
        <form className="visitas-form" onSubmit={handleSubmitVerificarFrecuente}>
          <label htmlFor="verificarRut">Rut de la visita (sin punto ni guion):</label>
          <input
            type="text"
            id="verificarRut"
            name="verificarRut"
            value={verificarRut}
            onChange={(e) => setVerificarRut(e.target.value)}
          />
          <p>{verificarRutMessage}</p>
          <button type="submit">Submit</button>
        </form>
      </div>

      <VisitaFrecuenteForm />

      <div className="visitas-form-container">
        <h1><center>Añadir visita no frecuente</center></h1>
        <form className="visitas-form" onSubmit={handleSubmitNoFrecuente}>
          <label htmlFor="patenteNoFrecuente">Patente del vehículo:</label>
          <input type="text" id="patenteNoFrecuente" name="patenteNoFrecuente" value={patenteNoFrecuente} onChange={(e) => setPatenteNoFrecuente(e.target.value)} />
          
          <label htmlFor="departmentNoFrecuente">Departamento:</label>
          <select id="departmentNoFrecuente" value={selectedDepartmentNoFrecuente} onChange={handleDepartmentChangeNoFrecuente}>
            <option value="">Seleccione un departamento</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <label htmlFor="rutNoFrecuente">Rut de la visita no frecuente (sin punto ni guion):</label>
          <input type="text" id="rutNoFrecuente" name="rutNoFrecuente" value={rutNoFrecuente} onChange={(e) => setRutNoFrecuente(e.target.value)} />

          <label htmlFor="nombreNoFrecuente">Nombre y apellido:</label>
          <input type="text" id="nombreNoFrecuente" name="nombreNoFrecuente" value={nombreNoFrecuente} onChange={(e) => setNombreNoFrecuente(e.target.value)} />

          <label htmlFor="fechaNacimientoNoFrecuente">Fecha de Nacimiento:</label>
          <input type="date" id="fechaNacimientoNoFrecuente" name="fechaNacimientoNoFrecuente" value={fechaNacimientoNoFrecuente} onChange={(e) => setFechaNacimientoNoFrecuente(e.target.value)} />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Visitas;
