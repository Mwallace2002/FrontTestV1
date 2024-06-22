import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    console.log('User role:', userRole);
    console.log('Required role:', requiredRole);

    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Verificar si el rol del usuario está dentro de los roles permitidos
    if (requiredRole && !requiredRole.includes(userRole)) {
        if (userRole === 'admin' || userRole === 'conserje') {
            return <Navigate to="/home" replace />;
        } else if (userRole === 'user') {
            return <Navigate to="/homeuser" replace />;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default PrivateRoute;
