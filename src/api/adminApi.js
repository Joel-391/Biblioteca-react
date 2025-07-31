import axiosClient from "../api/Axios.js";

export const saveEntity = async (path, id, data, setter, clearEdit) => {
  try {
    // Convertir "activo" string a boolean si existe
    if (data.activo !== undefined) {
      if (typeof data.activo === "string") {
        data.activo = data.activo.toLowerCase() === "true";
      } else {
        data.activo = Boolean(data.activo);
      }
    }
    console.log("Enviando datos a backend:", data);  // <-- debug

    const res = await axiosClient.put(`/api/admin/${path}/${id}`, data);
    setter(prev => prev.map(i => i.id === id ? res.data : i));
    clearEdit();
  } catch (err) {
    if (err.response?.status === 422) {
      alert("Errores:\n" + JSON.stringify(err.response.data.errors, null, 2));
    } else {
      alert("Error al actualizar");
    }
  }
};

export const deleteEntity = async (path, id, setter) => {
  if (!window.confirm("¿Estás seguro?")) return;
  try {
    await axiosClient.delete(`/api/admin/${path}/${id}`);
    setter(prev => prev.filter(i => i.id !== id));
  } catch {
    alert("Error al eliminar");
  }
};

export const createEntity = async (path, data, setter, clearNew) => {
  try {
    const res = await axiosClient.post(`/api/admin/${path}`, data);
    setter(prev => [res.data, ...prev]);
    clearNew();
  } catch (err) {
    if (err.response?.status === 422) {
      alert("Errores:\n" + JSON.stringify(err.response.data.errors, null, 2));
    } else {
      alert("Error al crear");
    }
  }
};


