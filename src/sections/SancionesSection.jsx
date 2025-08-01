import Section from "../components/Section";
import EntityRow from "../components/EntityRow";
import { saveEntity, deleteEntity, createEntity } from "../api/adminApi";
import { Plus, CircleX, Check } from 'lucide-react';
import { useState } from "react";

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
}

export default function SancionesSection({ sanciones, setSanciones }) {
  const [editingSanId, setEditingSanId] = useState(null);
  const [editSanData, setEditSanData] = useState({
    user_id: "",
    motivo: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "",
    monto_sancion: 0,
  });

  const [creatingSan, setCreatingSan] = useState(false);
  const [newSanData, setNewSanData] = useState({
    user_id: "",
    motivo: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "",
    monto_sancion: 0,
  });

  const [showSanciones, setShowSanciones] = useState(false);

  return (
    <Section
      title="Sanciones"
      count={sanciones.length}
      show={showSanciones}
      setShow={setShowSanciones}
      headers={[
        "ID", "User ID", "Motivo", "Inicio", "Fin", "Estado", "Monto", "Creado", "Actualizado", "Acciones"
      ]}
      extraHeader={() => (
        <button
          className="bg-blue-600 text-white rounded-full px-1.5 py-1.5 mr-1 mb-1"
          onClick={() => setCreatingSan(true)}
          title="Crear nueva sanción"
        >
          <Plus size={15} />
        </button>
      )}
      renderNew={() => creatingSan && (
        <tr className="bg-green-50">
          <td className="border px-2 py-1">—</td>
          <td>
            <input
              type="number"
              value={newSanData.user_id}
              onChange={e => setNewSanData({ ...newSanData, user_id: +e.target.value })}
              className="border px-1 py-0.5 w-full"
            />
          </td>
          <td>
            <input
              type="text"
              value={newSanData.motivo}
              onChange={e => setNewSanData({ ...newSanData, motivo: e.target.value })}
              className="border px-1 py-0.5 w-full"
            />
          </td>
          <td>
            <input
              type="date"
              value={formatDate(newSanData.fecha_inicio)}
              onChange={e => setNewSanData({ ...newSanData, fecha_inicio: e.target.value })}
              className="border px-1 py-0.5 w-full"
            />
          </td>
          <td>
            <input
              type="date"
              value={formatDate(newSanData.fecha_fin)}
              onChange={e => setNewSanData({ ...newSanData, fecha_fin: e.target.value })}
              className="border px-1 py-0.5 w-full"
            />
          </td>
          <td>
            <input
              type="text"
              value={newSanData.estado}
              onChange={e => setNewSanData({ ...newSanData, estado: e.target.value })}
              className="border px-1 py-0.5 w-full"
            />
          </td>
          <td>
            <input
              type="number"
              value={newSanData.monto_sancion}
              onChange={e => setNewSanData({ ...newSanData, monto_sancion: +e.target.value })}
              className="border px-1 py-0.5 w-full"
            />
          </td>
          <td colSpan={2}></td>
          <td className="flex justify-center">
            <button
              className="bg-green-500 text-white m-1 p-1 rounded"
              onClick={() => createEntity("sanciones", newSanData, setSanciones, () => {
                setNewSanData({
                  user_id: "",
                  motivo: "",
                  fecha_inicio: "",
                  fecha_fin: "",
                  estado: "",
                  monto_sancion: 0
                });
                setCreatingSan(false);
              })}
              title="Confirmar creación"
            >
              <Check />
            </button>
            <button
              className="bg-gray-400 text-white m-1 p-1 rounded"
              onClick={() => setCreatingSan(false)}
              title="Cancelar creación"
            >
              <CircleX />
            </button>
          </td>
        </tr>
      )}
    >
      {sanciones.map(s => (
        <EntityRow
          key={s.id}
          item={{
            ...s,
            fecha_inicio: formatDate(s.fecha_inicio),
            fecha_fin: formatDate(s.fecha_fin)
          }}
          fields={[
            { key: 'user_id', edit: true, type: 'number' },
            { key: 'motivo', edit: true },
            { key: 'fecha_inicio', edit: true, type: 'date' },
            { key: 'fecha_fin', edit: true, type: 'date' },
            { key: 'estado', edit: true },
            { key: 'monto_sancion', edit: true, type: 'number' },
          ]}
          created="created_at"
          updated="updated_at"
          editingId={editingSanId}
          setEditId={setEditingSanId}
          editData={editSanData}
          setEditData={setEditSanData}
          path="sanciones"
          setter={setSanciones}
          saveEntity={saveEntity}
          deleteEntity={deleteEntity}
        />
      ))}
    </Section>
  );
}
