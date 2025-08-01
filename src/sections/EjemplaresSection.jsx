import Section from "../components/Section";
import EntityRow from "../components/EntityRow";
import { saveEntity, deleteEntity, createEntity } from "../api/adminApi";
import { Plus, CircleX, Check } from 'lucide-react';
import { useState } from "react";

export default function EjemplaresSection({ ejemplares, setEjemplares }) {
  const [editingEjemId, setEditingEjemId] = useState(null);
  const [editEjemData, setEditEjemData] = useState({ libro_id: "", ubicacion_fisica: "", disponible: false });
  const [creatingEjem, setCreatingEjem] = useState(false);
  const [newEjemData, setNewEjemData] = useState({ libro_id: "", ubicacion_fisica: "", disponible: false, nota: "" });
  const [showEjemplares, setShowEjemplares] = useState(false);

  return (
    <Section
      title="Ejemplares"
      count={ejemplares.length}
      show={showEjemplares}
      setShow={setShowEjemplares}
      headers={["ID", "Libro ID", "Ubicación", "Disponible", "Nota", "Creado", "Actualizado", "Acciones"]}
      extraHeader={() => (
        <button className="bg-blue-600 text-white rounded-full px-1.5 py-1.5 mr-1 mb-1"
                onClick={() => setCreatingEjem(true)}
                title="Crear nuevo ejemplar"><Plus size={15}/></button>
      )}
      renderNew={() => creatingEjem && (
        <tr className="bg-green-50">
          <td className="border px-2 py-1">—</td>
          <td><input type="number" value={newEjemData.libro_id} onChange={e => setNewEjemData({ ...newEjemData, libro_id: +e.target.value })} className="border px-1 py-0.5 w-full" /></td>
          <td><input type="text" value={newEjemData.ubicacion_fisica} onChange={e => setNewEjemData({ ...newEjemData, ubicacion_fisica: e.target.value })} className="border px-1 py-0.5 w-full" /></td>
          <td className="text-center"><input type="checkbox" checked={newEjemData.disponible} onChange={e => setNewEjemData({ ...newEjemData, disponible: e.target.checked })} /></td>
          <td><input type="text" value={newEjemData.nota} onChange={e => setNewEjemData({ ...newEjemData, nota: e.target.value })} className="border px-1 py-0.5 w-full" /></td>
          <td colSpan={2}></td>
          <td className="flex justify-center">
            <button className="bg-green-500 text-white m-1 p-1 rounded"
                    onClick={() => createEntity("ejemplares", newEjemData, setEjemplares, () => { setNewEjemData({ libro_id: "", ubicacion_fisica: "", disponible: false, nota: "" }); setCreatingEjem(false); })}
                    title="Confirmar creación"><Check /></button>
            <button className="bg-gray-400 text-white m-1 p-1 rounded"
                    onClick={() => setCreatingEjem(false)}
                    title="Cancelar creación"><CircleX /></button>
          </td>
        </tr>
      )}
    >
      {ejemplares.map(e => (
        <EntityRow
          key={e.id}
          item={e}
          fields={[
            { key: 'libro_id', edit: true, type: 'number' },
            { key: 'ubicacion_fisica', edit: true },
            { key: 'disponible', edit: true, type: 'select', options: ['true', 'false'] },
            { key: 'nota', edit: true, type: 'text' }
          ]}
          created="created_at"
          updated="updated_at"
          editingId={editingEjemId}
          setEditId={setEditingEjemId}
          editData={editEjemData}
          setEditData={setEditEjemData}
          path="ejemplares"
          setter={setEjemplares}
          saveEntity={saveEntity}
          deleteEntity={deleteEntity}
        />
      ))}
    </Section>
  );
}
