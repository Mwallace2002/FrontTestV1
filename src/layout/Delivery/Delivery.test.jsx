import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeliveryForm from './DeliveryForm';

describe('DeliveryForm component', () => {
  beforeEach(() => {
    render(<DeliveryForm />);
  });

  it('renders initial form elements', () => {
    // Verificar elementos iniciales del formulario
    expect(screen.getByText(/Registrar Delivery/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nombre Recipiente/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ID del paquete/i)).toBeInTheDocument();
    expect(screen.getByText(/Seleccione un departamento/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Registrar/i })).toBeInTheDocument();
  });

  it('handles entry creation when submit button is clicked', () => {
    // Simular datos de entrada
    const nombreInput = screen.getByPlaceholderText(/Nombre Recipiente/i);
    const referenciaInput = screen.getByPlaceholderText(/ID del paquete/i);
    const departamentoSelect = screen.getByText(/Seleccione un departamento/i);
    const registrarButton = screen.getByRole('button', { name: /Registrar/i });

    fireEvent.change(nombreInput, { target: { value: 'Juan Perez' } });
    fireEvent.change(referenciaInput, { target: { value: '123456' } });
    fireEvent.change(departamentoSelect, { target: { value: 'Recursos Humanos' } });

    // Simular clic en el botón de registrar
    fireEvent.click(registrarButton);

    // Verificar que se haya llamado a fetchDepartmentNumber
    expect(screen.getByText(/Nuevo paquete registrado/i)).toBeInTheDocument();
    expect(screen.getByText(/ID del paquete: 123456/i)).toBeInTheDocument();
    expect(screen.getByText(/Destinatario: Juan Perez/i)).toBeInTheDocument();
    expect(screen.getByText(/Departamento: Recursos Humanos/i)).toBeInTheDocument();
  });

  it('opens WhatsApp URL when QR Code is clicked', () => {
    // Simular datos de entrada y clic en botón de registrar
    const nombreInput = screen.getByPlaceholderText(/Nombre Recipiente/i);
    const referenciaInput = screen.getByPlaceholderText(/ID del paquete/i);
    const departamentoSelect = screen.getByText(/Seleccione un departamento/i);
    const registrarButton = screen.getByRole('button', { name: /Registrar/i });

    fireEvent.change(nombreInput, { target: { value: 'Juan Perez' } });
    fireEvent.change(referenciaInput, { target: { value: '123456' } });
    fireEvent.change(departamentoSelect, { target: { value: 'Recursos Humanos' } });

    fireEvent.click(registrarButton);

    // Verificar que se muestre el QR Code
    const qrCode = screen.getByText(/Scan this QR Code to send the message via WhatsApp/i);
    expect(qrCode).toBeInTheDocument();

    // Simular clic en el QR Code para abrir la URL de WhatsApp
    fireEvent.click(qrCode);

    // Verificar que se haya llamado a window.open con la URL correcta de WhatsApp
    expect(window.open).toBeCalledWith(expect.stringContaining('https://api.whatsapp.com/send?phone='));
  });
});
