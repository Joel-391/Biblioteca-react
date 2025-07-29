import React from "react";

export default function ProfileForm({ formData, isEditing, handleChange, handleUpdateProfile, setIsEditing, errorMessage, successMessage }) {
  return (
    <form onSubmit={handleUpdateProfile} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          disabled={!isEditing}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          disabled={!isEditing}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Dirección</label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          disabled={!isEditing}
        />
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {isEditing ? (
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white p-2 rounded w-full"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="bg-gray-500 text-white p-2 rounded w-full"
        >
          Editar Perfil
        </button>
      )}
    </form>
  );
}
