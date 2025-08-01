import React, { useState, useEffect, useCallback } from "react";
import axiosClient from '../api/Axios.js';
import SideNavLeft from "../components/SideNavLeft";
import ProfileForm from "../components/ProfileForm";

export default function Profile() {
  const [userData, setUserData] = useState({ name: '', telefono: '', direccion: '', rol_id: null });
  const [formData, setFormData] = useState({ name: '', telefono: '', direccion: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [alquileres, setAlquileres] = useState([]);
  const [loadingAlquileres, setLoadingAlquileres] = useState(false);
  const [errorAlquileres, setErrorAlquileres] = useState('');

  useEffect(() => {
    axiosClient.get("/api/profile")
      .then((response) => {
        setUserData(response.data);
        setFormData(response.data);
        cargarAlquileres(response.data.id);
      })
      .catch((error) => {
        setErrorMessage("Error al obtener los datos del perfil");
        console.error("Error al obtener los datos del perfil", error);
      });
  }, []);

  const cargarAlquileres = (userId) => {
    setLoadingAlquileres(true);
    setErrorAlquileres('');
    axiosClient.get(`/api/alquileres?user_id=${userId}`)
      .then(({ data }) => {
        setAlquileres(data);
      })
      .catch((error) => {
        setErrorAlquileres('Error al cargar los alquileres');
        console.error('Error al cargar alquileres', error);
      })
      .finally(() => setLoadingAlquileres(false));
  };

  const handleDeleteAlquiler = (alquiler) => {
    const confirm = window.confirm("¿Estás seguro de que quieres eliminar este alquiler?");
    if (!confirm) return;

    axiosClient.delete(`/api/alquileres/${alquiler.id}`)
      .then(() => {
        setAlquileres(prev => prev.filter(a => a.id !== alquiler.id));
      })
      .catch((error) => {
        alert(error.response?.data?.error || "Error al eliminar el alquiler");
        console.error("Error al eliminar alquiler", error);
      });
  };

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleUpdateProfile = useCallback((e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (JSON.stringify(formData) !== JSON.stringify(userData)) {
      axiosClient.put("/api/profile", formData)
        .then(() => {
          setUserData(formData);
          setIsEditing(false);
          setSuccessMessage('Perfil actualizado correctamente');
          setTimeout(() => setSuccessMessage(''), 2500);
        })
        .catch((error) => {
          setErrorMessage("Hubo un error al actualizar el perfil");
          setTimeout(() => setErrorMessage(''), 2500);
          console.error("Error al actualizar el perfil", error);
        });
    } else {
      setIsEditing(false);
    }
  }, [formData, userData]);

  return (
    <div className="flex">
      <SideNavLeft />
      <div className="p-7 w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Mi Perfil</h1>
        <ProfileForm
          formData={formData}
          isEditing={isEditing}
          handleChange={handleChange}
          handleUpdateProfile={handleUpdateProfile}
          setIsEditing={setIsEditing}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Mis Alquileres</h2>
          {loadingAlquileres && <p>Cargando alquileres...</p>}
          {errorAlquileres && <p className="text-red-600">{errorAlquileres}</p>}
          {!loadingAlquileres && alquileres.length === 0 && <p>No tienes alquileres.</p>}
          {!loadingAlquileres && alquileres.length > 0 && (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Título del Libro</th>
                  <th className="border border-gray-300 px-4 py-2">Fecha Alquiler</th>
                  <th className="border border-gray-300 px-4 py-2">Fecha Devolución</th>
                  <th className="border border-gray-300 px-4 py-2">Devuelto</th>
                  <th className="border border-gray-300 px-4 py-2">Estado</th>
                  <th className="border border-gray-300 px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alquileres.map((alq) => (
                  <tr key={alq.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{alq.ejemplar?.libro?.titulo ?? "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{new Date(alq.fecha_alquiler).toLocaleDateString()}</td>
                    <td className="border border-gray-300 px-4 py-2">{alq.fecha_devolucion ? new Date(alq.fecha_devolucion).toLocaleDateString() : "-"}</td>
                    <td className="border border-gray-300 px-4 py-2">{alq.devuelto ? "Sí" : "No"}</td>
                    <td className="border border-gray-300 px-4 py-2">{alq.estado}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {(userData.rol_id === 3 || alq.estado?.toLowerCase() === 'pendiente') && (

                        <button
                          onClick={() => handleDeleteAlquiler(alq)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
