import React from 'react';
import { render, screen } from '@testing-library/react';
import Main from '../Main/Main';

describe('Main component', () => {
  it('renders Login page on default route', () => {
    render(<Main />);

    // Verificar que existan los campos de entrada de nombre de usuario, contraseña y el botón de inicio de sesión
    const usernameInput = screen.getByPlaceholderText('username');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();

    // Verificar que existan los botones de cambio de idioma
    const spanishButton = screen.getByRole('button', { name: /es/i });
    const englishButton = screen.getByRole('button', { name: /en/i });

    expect(spanishButton).toBeInTheDocument();
    expect(englishButton).toBeInTheDocument();
  });
});
