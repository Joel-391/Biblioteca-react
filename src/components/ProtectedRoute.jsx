// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useStateContext();

  if (loading) {
    return <div className="text-center p-4">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
