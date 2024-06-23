import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import './Vehiculos.css';

const Vehiculos = () => {
  const [placa, setPlaca] = useState('');
  const [numeroEstacionamiento, setNumeroEstacionamiento] = useState('');
  const [horaEntrada, setHoraEntrada] = useState('');
  const [tiempoHastaNotificacion, setTiempoHastaNotificacion] = useState(null);
  const [infoVehiculo, setInfoVehiculo] = useState({ placa: '', estacionamiento: '' });
  const [ocupacionEstacionamientos, setOcupacionEstacionamientos] = useState(Array(5).fill('libre'));
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Fijar tiempo de estancia en 2 minutos
    const tiempoEstancia = '00:02:00';

    const vehiculoData = {
      placa,
      numeroEstacionamiento,
      horaEntrada,
      tiempoEstancia
    };

    const nuevoEstadoOcupacion = [...ocupacionEstacionamientos];
    nuevoEstadoOcupacion[numeroEstacionamiento - 1] = 'ocupado';
    setOcupacionEstacionamientos(nuevoEstadoOcupacion);

    const [entradaHoras, entradaMinutos] = horaEntrada.split(':').map(Number);
    const tiempoEstanciaTotalSegundos = 2 * 60; // Estancia fija en 2 minutos
    const notificacionSegundos = 1 * 60; // Notificar 1 minuto antes

    const tiempoEntradaSegundos = entradaHoras * 3600 + entradaMinutos * 60;
    const tiempoNotificacionEnSegundos = tiempoEstanciaTotalSegundos - notificacionSegundos;
    const tiempoHastaNotificacionEnSegundos = tiempoNotificacionEnSegundos;

    console.log('Tiempo total de estancia en segundos:', tiempoEstanciaTotalSegundos);
    console.log('Segundos hasta notificación:', tiempoHastaNotificacionEnSegundos);

    setTiempoHastaNotificacion(tiempoHastaNotificacionEnSegundos);
    setInfoVehiculo({ placa, estacionamiento: numeroEstacionamiento });

    // Simula guardar los datos y reinicia el formulario
    setPlaca('');
    setNumeroEstacionamiento('');
    setHoraEntrada('');
  };

  useEffect(() => {
    let timer;

    if (tiempoHastaNotificacion > 0) {
      timer = setInterval(() => {
        setTiempoHastaNotificacion(prevTiempo => {
          const nuevoTiempo = prevTiempo - 1;
          console.log('Tiempo restante hasta la notificación:', nuevoTiempo);
          if (nuevoTiempo <= 0) {
            const mensajeNotificacion = infoVehiculo.placa
              ? `El tiempo de estancia del vehículo ${infoVehiculo.placa} está a punto de terminar`
              : `El tiempo de estancia del estacionamiento ${infoVehiculo.estacionamiento} está a punto de terminar`;
            setMensaje(mensajeNotificacion);
            clearInterval(timer);
          }
          return nuevoTiempo;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [tiempoHastaNotificacion, infoVehiculo]);

  return (
    <div>
      <Navbar />
      <div className="vehiculos-form-container">
        <h1><center>Registro de Vehículos</center></h1>
        <form className="vehiculos-form" onSubmit={handleSubmit}>
          <label htmlFor="placa">Placa del Vehículo:</label>
          <input type="text" id="placa" name="placa" value={placa} onChange={(e) => setPlaca(e.target.value)} />

          <label htmlFor="numeroEstacionamiento">Número de Estacionamiento:</label>
          <select id="numeroEstacionamiento" name="numeroEstacionamiento" value={numeroEstacionamiento} onChange={(e) => setNumeroEstacionamiento(e.target.value)}>
            <option value="">Seleccionar estacionamiento</option>
            {[1, 2, 3, 4, 5, 'N/A'].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>

          <div className="ocupacion-estacionamientos">
            {[1, 2, 3, 4, 5].map(numero => (
              <div key={numero} className={`cuadro-ocupacion ${ocupacionEstacionamientos[numero - 1]}`}>
                <span>{numero}</span>
                <span>{ocupacionEstacionamientos[numero - 1] === 'ocupado' ? 'Ocupado' : 'Desocupado'}</span>
              </div>
            ))}
          </div>

          <label htmlFor="horaEntrada">Hora de Entrada:</label>
          <input type="time" id="horaEntrada" name="horaEntrada" value={horaEntrada} onChange={(e) => setHoraEntrada(e.target.value)} />

          <button type="submit">Registrar</button>
        </form>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
};

export default Vehiculos;
