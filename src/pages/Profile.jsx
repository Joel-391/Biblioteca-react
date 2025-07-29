import React, { useState, useEffect, useCallback } from "react";
import axiosClient from '../api/Axios.js';
import SideNavLeft from "../components/SideNavLeft";
import ProfileForm from "../components/ProfileForm";

export default function Profile() {
  const [userData, setUserData] = useState({ name: '', telefono: '', direccion: '' });
  const [formData, setFormData] = useState({ name: '', telefono: '', direccion: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Obtener los datos del usuario cuando el componente se monta
  useEffect(() => {
    axiosClient.get("/api/profile")
      .then((response) => {
        setUserData(response.data);
        setFormData(response.data);
      })
      .catch((error) => {
        setErrorMessage("Error al obtener los datos del perfil");
        console.error("Error al obtener los datos del perfil", error);
      });
  }, []);

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
      <div className="p-7 w-full">
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
      </div>
    </div>
  );
}
