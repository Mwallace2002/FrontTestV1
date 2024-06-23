import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../Login/Login.jsx';
import Home from '../Home/Home.jsx';
import HomeUser from '../Home/HomeUser.jsx';
import Delivery from '../Delivery/Delivery.jsx';
import Vehiculos from '../Vehiculos/Vehiculos.jsx';
import Visitas from '../Visitas/Visitas.jsx';
import Admin from '../Admin/Admin.jsx';
import PrivateRoute from '../PrivateRoute/PrivateRoute.jsx';

import './Main.css';

const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={
          <PrivateRoute requiredRole={['admin', 'conserje']}>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/homeuser" element={
          <PrivateRoute requiredRole={['user']}>
            <HomeUser />
          </PrivateRoute>
        } />
        <Route path="/delivery" element={
          <PrivateRoute requiredRole={['conserje', 'admin']}>
            <Delivery />
          </PrivateRoute>
        } />
        <Route path="/vehiculos" element={
          <PrivateRoute requiredRole={['conserje', 'admin']}>
            <Vehiculos />
          </PrivateRoute>
        } />
        <Route path="/visitas" element={
          <PrivateRoute requiredRole={['conserje', 'admin']}>
            <Visitas />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute requiredRole={['admin']}>
            <Admin />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default Main;
