import Section from "../components/Section";
import EntityRow from "../components/EntityRow";
import { saveEntity, deleteEntity } from "../api/adminApi";
import { useState } from "react";

export default function AlquileresSection({ alquileres, setAlquileres }) {
  const [editingAlqId, setEditingAlqId] = useState(null);
  const [editAlqData, setEditAlqData] = useState({ user_id: "", libro_id: "", fecha_alquiler: "", fecha_devolucion: "", devuelto: false });
  const [showAlquileres, setShowAlquileres] = useState(false);

  return (
    <Section
      title="Alquileres"
      count={alquileres.length}
      show={showAlquileres}
      setShow={setShowAlquileres}
      headers={["ID","User ID","Ejemplar ID","Alquiler","Devolución","Devuelto","Estado","Creado","Actualizado","Acciones"]}
    >
      {alquileres.map(a => (
        <EntityRow
          key={a.id}
          item={a}
          fields={[
            { key: "user_id", edit: true, type: "number" },
            { key: "ejemplar_id", edit: true, type: "number" },
            { key: "fecha_alquiler", edit: true, type: "date" },
            { key: "fecha_devolucion", edit: true, type: "date" },
            { key: "devuelto", edit: true, type: "select", options: ["true", "false"] },
            { 
              key: "estado", 
              edit: true, 
              type: "select", 
              options: ["Pendiente", "Aceptado", "Denegado"]
            },
          ]}
          created="created_at"
          updated="updated_at"
          editingId={editingAlqId}
          setEditId={setEditingAlqId}
          editData={editAlqData}
          setEditData={setEditAlqData}
          path="alquileres"
          setter={setAlquileres}
          saveEntity={saveEntity}
          deleteEntity={deleteEntity}
        />
      ))}
    </Section>
  );
}
