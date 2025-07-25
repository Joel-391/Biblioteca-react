import { useStateContext } from '../contexts/ContextProvider.jsx';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { user, loading } = useStateContext();

  if (loading) return null; // O spinner

  if (!user || user.rol_id !== 3) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
