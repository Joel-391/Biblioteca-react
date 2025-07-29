import React from "react";

export default function EntityRow({
  item, fields, created, updated,
  editingId, setEditId, editData, setEditData,
  path, setter,
  saveEntity, deleteEntity
}) {
  const isEdit = editingId === item.id;

  return (
    <tr key={item.id} className="hover:bg-gray-50">
      <td className="border px-2 py-1">{item.id}</td>
      {fields.map(f => (
        <td key={f.key} className="border px-2 py-1">
          {isEdit && f.edit
            ? f.type === 'checkbox'
              ? <input
                  type="checkbox"
                  checked={editData[f.key]}
                  onChange={e => setEditData(prev => ({ ...prev, [f.key]: e.target.checked }))}
                />
              : <input
                  type={f.type || 'text'}
                  value={editData[f.key]}
                  onChange={e => setEditData(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="border rounded px-1 py-0.5 w-full"
                />
            : item[f.key]?.toString()
          }
        </td>
      ))}
      <td className="border px-2 py-1">{new Date(item[created]).toLocaleDateString()}</td>
      <td className="border px-2 py-1">{new Date(item[updated]).toLocaleDateString()}</td>
      <td className="border px-2 py-1 space-x-1">
        {isEdit
          ? <>
              <button
                className="bg-green-500 text-white px-2 rounded"
                onClick={() => saveEntity(path, item.id, editData, setter, () => setEditId(null))}
              >Guardar</button>
              <button
                className="bg-gray-400 text-white px-2 rounded"
                onClick={() => setEditId(null)}
              >Cancelar</button>
            </>
          : <>
              <button
                className="bg-blue-500 text-white px-2 rounded"
                onClick={() => {
                  setEditId(item.id);
                  setEditData(Object.fromEntries(fields.map(f => [f.key, item[f.key]])));
                }}
              >Editar</button>
              <button
                className="bg-red-600 text-white px-2 rounded"
                onClick={() => deleteEntity(path, item.id, setter)}
              >Borrar</button>
            </>
        }
      </td>
    </tr>
  );
}
