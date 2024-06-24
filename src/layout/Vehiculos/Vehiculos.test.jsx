/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Vehiculos from './Vehiculos';
import { BrowserRouter } from 'react-router-dom';

jest.mock('./Vehiculos.css', () => '')
//jest.mock('../components/EntryForm/EntryForm.css', () => '')

describe('Vehiculos component', () => {
  // Mock para simular fetch de estacionamientos libres
  const mockFetchFreeSpots = jest.fn(() => Promise.resolve([{ id: 1 }, { id: 2 }, { id: 3 }]));

  // Mock para simular fetch de parámetros de tiempo
  const mockFetchParameters = jest.fn(() => Promise.resolve({ TiempoEstancia: 60, TiempoAdvertencia: 10 }));

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
    render(
      <BrowserRouter>
        <Vehiculos />
      </BrowserRouter>
    );

    // Esperar a que se carguen los datos iniciales
    await waitFor(() => {
      expect(screen.getAllByText(/Registro de Vehículos/i))
      expect(screen.getByPlaceholderText(/Vehículo/i))
      expect(screen.getByPlaceholderText(/Patente/i))
      expect(screen.getByText(/Seleccionar Departamento/i))
      expect(screen.getByRole('button', { name: /Registrar/i }))
    });
  });
  it('displays the correct number of free spots', async () => {
    render(
      <BrowserRouter>
        <Vehiculos />
      </BrowserRouter>
    );

    // Esperar a que se carguen los datos iniciales
    await waitFor(() => {
      expect(screen.getByText(/3 estacionamientos libres/i));
    });
  });

  it('registers a vehicle successfully', async () => {
    render(
      <BrowserRouter>
        <Vehiculos />
      </BrowserRouter>
    );

    // Esperar a que se carguen los datos iniciales
    await waitFor(() => {
      const vehicleInput = screen.getByPlaceholderText(/Vehículo/i);
      const licensePlateInput = screen.getByPlaceholderText(/Patente/i);
      const departmentSelect = screen.getByText(/Seleccionar Departamento/i);
      const registerButton = screen.getByRole('button', { name: /Registrar/i });

      fireEvent.change(vehicleInput, { target: { value: 'Car' } });
      fireEvent.change(licensePlateInput, { target: { value: 'ABC123' } });
      fireEvent.change(departmentSelect, { target: { value: '123456789' } });
      fireEvent.click(registerButton);

      // Esperar a que se registre el vehículo
      waitFor(() => {
        expect(screen.getByText(/Vehículo registrado con éxito/i));
      });
    });
  });

  it('displays an error message when registration fails', async () => {
    render(
      <BrowserRouter>
        <Vehiculos />
      </BrowserRouter>
    );

    // Esperar a que se carguen los datos iniciales
    await waitFor(() => {
      const vehicleInput = screen.getByPlaceholderText(/Vehículo/i);
      const licensePlateInput = screen.getByPlaceholderText(/Patente/i);
      const departmentSelect = screen.getByText(/Seleccionar Departamento/i);
      const registerButton = screen.getByRole('button', { name: /Registrar/i });

      fireEvent.change(vehicleInput, { target: { value: 'Car' } });
      fireEvent.change(licensePlateInput, { target: { value: 'ABC123' } });
      fireEvent.change(departmentSelect, { target: { value: '123456789' } });
      fireEvent.click(registerButton);

      // Esperar a que se muestre el mensaje de error
      waitFor(() => {
        expect(screen.getByText(/Error al registrar el vehículo/i));
      });
    });
  });
});

