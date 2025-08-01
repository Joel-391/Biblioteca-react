import React from "react";
import { Save, CircleX, Pencil, Trash2 } from 'lucide-react';

export default function EntityRow({
  item,
  fields,
  created,
  updated,
  editingId,
  setEditId,
  editData,
  setEditData,
  path,
  setter,
  saveEntity,
  deleteEntity,
}) {
  const isEdit = editingId === item.id;

  return (
    <tr key={item.id} className="hover:bg-gray-50">
      <td className="border px-2 py-1">{item.id}</td>
      {fields.map((f) => (
        <td key={f.key} className="border px-2 py-1">
          {isEdit && f.edit ? (
            f.type === "select" && Array.isArray(f.options) ? (
              <select
                value={editData[f.key] ?? ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    [f.key]: e.target.value,
                  }))
                }
                className="border rounded px-1 py-0.5 w-full"
              >
                {f.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : f.type === "date" ? (
              <input
                type="date"
                value={editData[f.key] ? editData[f.key].slice(0, 10) : ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    [f.key]: e.target.value,
                  }))
                }
                className="border rounded px-1 py-0.5"
              />
            ) : (
              <input
                type={f.type || "text"}
                value={editData[f.key] ?? ""}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    [f.key]: e.target.value,
                  }))
                }
                className="border rounded px-1 py-0.5 w-full"
              />
            )
          ) : f.key === "activo" || f.key === "devuelto" ? (
            item[f.key] ? "Sí" : "No"
          ) : (
            item[f.key]?.toString()
          )}
        </td>
      ))}
      <td className="border px-2 py-1">{new Date(item[created]).toLocaleDateString()}</td>
      <td className="border px-2 py-1">{new Date(item[updated]).toLocaleDateString()}</td>
      <td className="border px-2 py-1 space-x-1">
        {isEdit ? (
          <>
            <button
              className="bg-green-500 text-white mx-1 p-1 rounded"
              onClick={async () => {
                try {
                  const dataToSave = { ...editData };
                  // Normalizar fechas a YYYY-MM-DD
                  if (dataToSave.fecha_alquiler) {
                    dataToSave.fecha_alquiler = dataToSave.fecha_alquiler.slice(0, 10);
                  }
                  if (dataToSave.fecha_devolucion) {
                    dataToSave.fecha_devolucion = dataToSave.fecha_devolucion.slice(0, 10);
                  }
                  // Convertir devuelto a boolean
                  if (dataToSave.devuelto === "true") dataToSave.devuelto = true;
                  else if (dataToSave.devuelto === "false") dataToSave.devuelto = false;
                  // Estado (asegurar minúsculas)
                  if (dataToSave.estado) dataToSave.estado = dataToSave.estado.toLowerCase();

                  await saveEntity(path, item.id, dataToSave, setter, () => setEditId(null));
                } catch (e) {
                  const msg = e.response?.data?.message || e.message;
                  alert("No se guardó: " + msg);
                }
              }}
              title="Guardar edición"
            >
            <Save />
            </button>
            <button
              className="bg-gray-400 text-white mx-1 p-1 rounded"
              onClick={() => setEditId(null)}
              title="Cancelar edición"
            >
            <CircleX />
            </button>
          </>
        ) : (
          <>
            <div className="flex">
            <button
              className="bg-blue-500 text-white mx-1 p-1 rounded"
              onClick={() => {
                const initialData = {};
                fields.forEach((f) => {
                  if (f.key === "activo" || f.key === "devuelto") {
                    initialData[f.key] = item[f.key] ? "true" : "false";
                  } else if (f.type === "date") {
                    initialData[f.key] = item[f.key] ? item[f.key].slice(0, 10) : "";
                  } else {
                    initialData[f.key] =
                      item[f.key] !== undefined && item[f.key] !== null
                        ? item[f.key].toString()
                        : "";
                  }
                });
                setEditId(item.id);
                setEditData(initialData);
              }}
              title="Editar"
            >
            <Pencil />
            </button>
            <button
              className="bg-red-600 text-white mx-1 p-1 rounded"
              onClick={() => deleteEntity(path, item.id, setter)}
              title="Eliminar"
            >
            <Trash2 />
            </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
}
