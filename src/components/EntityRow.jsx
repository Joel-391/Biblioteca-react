import React from "react";

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
            // Mostrar "Sí" o "No" para campos booleanos en modo visualización
            item[f.key] ? "Sí" : "No"
          ) : (
            item[f.key]?.toString()
          )}
        </td>
      ))}
      <td className="border px-2 py-1">
        {new Date(item[created]).toLocaleDateString()}
      </td>
      <td className="border px-2 py-1">
        {new Date(item[updated]).toLocaleDateString()}
      </td>
      <td className="border px-2 py-1 space-x-1">
        {isEdit ? (
          <>
            <button
              className="bg-green-500 text-white px-2 rounded"
              onClick={async () => {
                try {
                  // Clonar editData para no mutar directamente
                  const dataToSave = { ...editData };

                  // Convertir "true"/"false" string a booleano para devuelto
                  if (dataToSave.devuelto === "true") dataToSave.devuelto = true;
                  else if (dataToSave.devuelto === "false") dataToSave.devuelto = false;

                  await saveEntity(path, item.id, dataToSave, setter, () =>
                    setEditId(null)
                  );
                } catch (e) {
                  const msg = e.response?.data?.message || e.message;
                  alert("No se guardó: " + msg);
                }
              }}
            >
              Guardar
            </button>
            <button
              className="bg-gray-400 text-white px-2 rounded"
              onClick={() => setEditId(null)}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-blue-500 text-white px-2 rounded"
              onClick={() => {
                const initialData = {};
                fields.forEach((f) => {
                  if (f.key === "activo" || f.key === "devuelto") {
                    // Convertir booleano a string para mostrar en select
                    initialData[f.key] = item[f.key] ? "true" : "false";
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
            >
              Editar
            </button>
            <button
              className="bg-red-600 text-white px-2 rounded"
              onClick={() => deleteEntity(path, item.id, setter)}
            >
              Borrar
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
