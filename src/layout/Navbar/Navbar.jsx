// Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';
import spanishFlagUrl from "./icons/spain.svg";
import englishFlagUrl from "./icons/uk.svg";

const Navbar = () => {
    const [collapse, setCollapse] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('i18nextLng') || 'es'); // Default to Spanish if no language is stored
    const { t, i18n } = useTranslation('global');
    const userRole = localStorage.getItem('userRole');

    const toggleCollapse = () => {
        setCollapse(!collapse);
    };

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setSelectedLanguage(lang);
    };
    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className={collapse ? 'sidebar sidebar-collapse' : 'sidebar'}>
            <ul className="sidebar-menu">
                {userRole === 'user' && (
                    <li className="sidebar-item"><Link to="/homeuser">{t('navbar.homeuser')}</Link></li>
                )}
                {['conserje', 'admin'].includes(userRole) && (
                    <>
                        <li className="sidebar-item"><Link to="/home">{t('navbar.home')}</Link></li>
                        <li className="sidebar-item"><Link to="/delivery">{t('navbar.delivery')}</Link></li>
                        <li className="sidebar-item"><Link to="/vehiculos">{t('navbar.vehicles')}</Link></li>
                    </>
                )}
                {userRole === 'admin' && (
                    <li className="sidebar-item"><Link to="/admin">Admin</Link></li>
                )}
                <li className="sidebar-item"><Link to="/visitas">{t('navbar.visits')}</Link></li>
                <li className="sidebar-item">
                    <div className="language-icons-container">
                        <button
                            className={`language-button ${selectedLanguage === 'es' ? 'selected' : ''}`}
                            onClick={() => changeLanguage('es')}
                        >
                            <img src={spanishFlagUrl} alt="Spanish Flag" className="language-icon" />
                        </button>
                        <button
                            className={`language-button ${selectedLanguage === 'en' ? 'selected' : ''}`}
                            onClick={() => changeLanguage('en')}
                        >
                            <img src={englishFlagUrl} alt="English Flag" className="language-icon" />
                        </button>
                    </div>
                </li>
                <div className="buttons-container">
                    <button className="custom-button1" onClick={handleLogout}>{t("label.Logout")}</button>
                </div>
            </ul>
            <button className="collapse-button" onClick={toggleCollapse}>
                {collapse ? '»' : '«'}
            </button>
        </div>
    );
}

export default Navbar;
