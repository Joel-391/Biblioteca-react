import React, { useState, useEffect } from "react";
import axiosClient from '../api/Axios.js';  // Asegúrate de que axios esté configurado correctamente
import SideNavLeft from "../components/SideNavLeft"; // Componente de navegación

export default function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    telefono: '',
    direccion: '',
  });

  const [formData, setFormData] = useState(userData);  // Usamos formData para editar
  const [isEditing, setIsEditing] = useState(false);  // Para gestionar si el formulario está en modo edición
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Mensaje de éxito

  // Obtener los datos del usuario cuando el componente se monta
  useEffect(() => {
    axiosClient.get("/profile")
      .then((response) => {
        setUserData(response.data);  // Guardar los datos del perfil en el estado
        setFormData(response.data);  // Establecer los datos en el formulario
      })
      .catch((error) => {
        console.error("Error al obtener los datos del perfil", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });  // Cambiar el estado de formData al editar
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    // Comprobar si los datos han cambiado antes de enviar la actualización
    if (JSON.stringify(formData) !== JSON.stringify(userData)) {
      axiosClient.put("/profile", formData)
        .then(() => {
          setUserData(formData);  // Actualiza los datos de usuario con los nuevos valores
          setIsEditing(false); // Desactivar el modo de edición
          setSuccessMessage('Perfil actualizado correctamente');
          setErrorMessage(''); // Limpiar el mensaje de error si la actualización es exitosa
        })
        .catch((error) => {
          setErrorMessage("Hubo un error al actualizar el perfil");
          setSuccessMessage(''); // Limpiar el mensaje de éxito si hay error
          console.error("Error al actualizar el perfil", error);
        });
    } else {
      setIsEditing(false); // Si no hay cambios, solo desactiva el modo de edición
    }
  };

  return (
    <div className="flex">
      {/* Aquí el componente de navegación */}
      <SideNavLeft />
      <div className="p-7 w-full">
        <h1 className="text-2xl font-semibold mb-6">Mi Perfil</h1>

        {/* Mostrar mensaje de error si existe */}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {/* Mostrar mensaje de éxito si la actualización es exitosa */}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        {/* Formulario de perfil */}
        <form onSubmit={handleUpdateProfile} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}  // Usa formData para gestionar los cambios
              onChange={handleChange}
              className="border p-2 rounded w-full"
              disabled={!isEditing}  // Si no está editando, deshabilitar el campo
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}  // Usa formData para gestionar los cambios
              onChange={handleChange}
              className="border p-2 rounded w-full"
              disabled={!isEditing}  // Si no está editando, deshabilitar el campo
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}  // Usa formData para gestionar los cambios
              onChange={handleChange}
              className="border p-2 rounded w-full"
              disabled={!isEditing}  // Si no está editando, deshabilitar el campo
            />
          </div>

          {/* Botones de guardar cambios o editar */}
          {isEditing ? (
            <div className="flex gap-4">
              <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}  // Cancelar el modo de edición
                className="bg-gray-500 text-white p-2 rounded w-full"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)} // Cambia el estado a "editar"
              className="bg-gray-500 text-white p-2 rounded w-full"
            >
              Editar Perfil
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
