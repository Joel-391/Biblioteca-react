import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import App from './App.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const router = createBrowserRouter([
    {
    path: '/',
    element: <Navigate to="/login" />,
    },
    {
        path: 'login', element: <Login />,
    },
    {
        path: 'register', element:  <Register />,
    },
    {
        path: 'home',
        element: (
        <ProtectedRoute>
            <App />
        </ProtectedRoute>
        )
    }    
]);

export default router;