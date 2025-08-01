import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import App from './App.jsx';
import Profile from './pages/Profile.jsx';  
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Admin from './pages/Admin.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import BuscarLibro from './pages/BuscarLibro.jsx';
import LibroDetalle from './pages/LibroDetalle.jsx';
import Sanciones from './pages/Sanciones.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" />,
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'register',
    element: <Register />,
  },
  {
    path: 'home',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: 'libros/buscar',
    element: (
      <ProtectedRoute>
        <BuscarLibro />
      </ProtectedRoute>
    ),
  },
  {
    path: 'profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: 'admin',
    element: (
      <AdminRoute>
        <Admin />
      </AdminRoute>
    ),
  },
  {
    path: 'libros/:id',
    element: (
      <ProtectedRoute>
        <LibroDetalle />
      </ProtectedRoute>
    ),
  },
  {
    path: 'sanciones',
    element: (
      <ProtectedRoute>
        <Sanciones />
      </ProtectedRoute>
    ),
  },
]);

export default router;
