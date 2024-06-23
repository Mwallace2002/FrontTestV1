import './Login.css';
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loginSuccessful, setLoginSuccessful] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation("global");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            username: username,
            password: password
        };
        fetch('https://apivercel-mwallace2002-max-wallaces-projects.vercel.app/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            setLoading(false);
            if (result.token) {
                localStorage.setItem('token', result.token);
                if (result.rol) {
                    localStorage.setItem('userRole', result.rol); // Almacenamos el rol en localStorage
                    console.log('User role:', result.rol); // Imprime el rol del usuario
                } else {
                    console.log('No role found in API response');
                }
                setLoginSuccessful(true);
                handleRedirect(result.rol); // Redirige según el rol del usuario
            } else {
                setLoginSuccessful(false);
                setError('Login failed. Please check your credentials.');
            }
        })
        .catch(error => {
            setLoading(false);
            console.error('Error:', error);
            setError('Something went wrong. Please try again later.');
        });
    };

    const handleRedirect = (role) => {
        switch (role) {
            case 'admin':
                navigate('/home');
                break;
            case 'conserje':
                navigate('/home');
                break;
            case 'user':
                navigate('/homeuser');
                break;
            default:
                navigate('/'); 
                break;
        }
    };

    return (
        <>
            {loginSuccessful ? (
                <p>Loading...</p> // Muestra un mensaje de carga opcional mientras se redirige
            ) : (
                <div className="custom-form">
                    <form onSubmit={handleLogin}>
                        <label className="custom-label">{t("label.Username")}</label>
                        <input
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="username"
                            className="custom-input"
                            type="text"
                            required
                        />
                        <label className="custom-label">{t("label.Password")}</label>
                        <input
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="password"
                            className="custom-input"
                            type="password"
                            required
                        />
                        <div className="login-button">
                            <button className="custom-button" type="submit" disabled={loading}>
                                {loading ? 'Logging in...' : t("label.Login")}
                            </button>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <div className="buttons-container">
                            <button onClick={(event) => { event.preventDefault(); i18n.changeLanguage("es") }}>ES</button>
                            <button onClick={(event) => { event.preventDefault(); i18n.changeLanguage("en") }}>EN</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default Login;