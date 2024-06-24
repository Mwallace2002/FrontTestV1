import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Vehiculos from './Vehiculos';

describe('Vehiculos component', () => {
  // Mock para simular fetch de estacionamientos libres
  const mockFetchFreeSpots = jest.fn(() => Promise.resolve([{ id: 1 }, { id: 2 }, { id: 3 }]));

  // Mock para simular fetch de parámetros de tiempo
  const mockFetchParameters = jest.fn(() => Promise.resolve({ TiempoEstancia: 60, TiempoAdvertencia: 10 }));

  // Mock para simular fetch de número de departamento
  const mockFetchDepartmentNumber = jest.fn();

  beforeAll(() => {
    global.fetch = jest.fn();
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => mockFetchFreeSpots() }))
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => mockFetchParameters() }))
      .mockImplementation((url) => {
        if (url.includes('/api/department/')) {
          return Promise.resolve({ ok: true, json: () => ({ numero: '123456789' }) });
        }
        return Promise.reject(new Error('Unhandled fetch: ' + url));
      });
  });

  it('renders Vehiculos component', async () => {
    render(<Vehiculos />);

    // Esperar a que se carguen los datos iniciales
    await waitFor(() => {
      expect(screen.getByText(/Registro de Vehículos/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Vehículo/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Patente/i)).toBeInTheDocument();
      expect(screen.getByText(/Seleccionar Departamento/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Registrar/i })).toBeInTheDocument();
    });
  });

  it('displays message when no free spots available', async () => {
    mockFetchFreeSpots.mockImplementationOnce(() => Promise.resolve([]));
    render(<Vehiculos />);

    // Esperar a que se carguen los datos iniciales
    await waitFor(() => {
      expect(screen.getByText(/No hay lugares de estacionamiento disponibles/i)).toBeInTheDocument();
    });
  });

  it('handles entry creation', async () => {
    render(<Vehiculos />);

    // Simular ingreso de datos y registro de vehículo
    const nombreInput = screen.getByPlaceholderText(/Vehículo/i);
    const referenciaInput = screen.getByPlaceholderText(/Patente/i);
    const departamentoSelect = screen.getByText(/Seleccionar Departamento/i);
    const registrarButton = screen.getByRole('button', { name: /Registrar/i });

    // Ingresar datos
    fireEvent.change(nombreInput, { target: { value: 'AutoTest' } });
    fireEvent.change(referenciaInput, { target: { value: 'ABC123' } });
    fireEvent.change(departamentoSelect, { target: { value: 'DepartamentoTest' } });

    // Simular click en el botón de registrar
    fireEvent.click(registrarButton);

    // Esperar a que se procese la entrada y se muestre el mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText(/Se ingresó el vehículo AutoTest con patente ABC123/i)).toBeInTheDocument();
    });
  });

  it('handles free spot release', async () => {
    render(<Vehiculos />);

    // Simular liberación de lugar de estacionamiento
    const liberarButton = screen.getByRole('button', { name: /Liberar/i });

    // Simular click en el botón de liberar
    fireEvent.click(liberarButton);

    // Esperar a que se procese la liberación y se muestre el mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText(/Estacionamiento \d+ liberado exitosamente/i)).toBeInTheDocument();
    });
  });
});
