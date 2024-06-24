import React from 'react';
import { render, screen } from '@testing-library/react';
import Visitas from './Visitas';

describe('Visitas component', () => {
  it('renders inputs and buttons', () => {
    render(<Visitas />);

    // Verificar que los campos de verificación de visitas frecuentes estén presentes
    const verificarRutLabel = screen.getByLabelText(/Rut de la visita/i);
    expect(verificarRutLabel).toBeInTheDocument();

    const verificarRutInput = screen.getByRole('textbox', { name: /Rut de la visita/i });
    expect(verificarRutInput).toBeInTheDocument();

    const verificarRutButton = screen.getByRole('button', { name: /Submit/i });
    expect(verificarRutButton).toBeInTheDocument();

    // Verificar que los campos para añadir visita no frecuente estén presentes
    const patenteNoFrecuenteLabel = screen.getByLabelText(/Patente del vehículo/i);
    expect(patenteNoFrecuenteLabel).toBeInTheDocument();

    const patenteNoFrecuenteInput = screen.getByRole('textbox', { name: /Patente del vehículo/i });
    expect(patenteNoFrecuenteInput).toBeInTheDocument();

    const departmentNoFrecuenteLabel = screen.getByLabelText(/Departamento/i);
    expect(departmentNoFrecuenteLabel).toBeInTheDocument();

    const departmentNoFrecuenteSelect = screen.getByRole('combobox', { name: /Departamento/i });
    expect(departmentNoFrecuenteSelect).toBeInTheDocument();

    const rutNoFrecuenteLabel = screen.getByLabelText(/Rut de la visita no frecuente/i);
    expect(rutNoFrecuenteLabel).toBeInTheDocument();

    const rutNoFrecuenteInput = screen.getByRole('textbox', { name: /Rut de la visita no frecuente/i });
    expect(rutNoFrecuenteInput).toBeInTheDocument();

    const nombreNoFrecuenteLabel = screen.getByLabelText(/Nombre y apellido/i);
    expect(nombreNoFrecuenteLabel).toBeInTheDocument();

    const nombreNoFrecuenteInput = screen.getByRole('textbox', { name: /Nombre y apellido/i });
    expect(nombreNoFrecuenteInput).toBeInTheDocument();

    const fechaNacimientoNoFrecuenteLabel = screen.getByLabelText(/Fecha de Nacimiento/i);
    expect(fechaNacimientoNoFrecuenteLabel).toBeInTheDocument();

    const fechaNacimientoNoFrecuenteInput = screen.getByRole('textbox', { name: /Fecha de Nacimiento/i });
    expect(fechaNacimientoNoFrecuenteInput).toBeInTheDocument();

    // Verificar que los botones de submit estén presentes
    const submitButtons = screen.getAllByRole('button', { name: /Submit/i });
    expect(submitButtons.length).toBe(2); // Deberían ser dos formularios con botones Submit
  });
});
