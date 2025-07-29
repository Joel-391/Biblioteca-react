import Section from "../components/Section";
import EntityRow from "../components/EntityRow";
import { saveEntity, deleteEntity } from "../api/adminApi";
import { useState } from "react";

export default function ComentariosSection({ comentarios, setComentarios }) {
  const [editingComId, setEditingComId] = useState(null);
  const [editComData, setEditComData] = useState({ user_id: "", libro_id: "", contenido: "", calificacion: 0 });
  const [showComentarios, setShowComentarios] = useState(false);

  return (
    <Section
      title="Comentarios"
      count={comentarios.length}
      show={showComentarios}
      setShow={setShowComentarios}
      headers={["ID","User ID","Libro ID","Contenido","Calificación","Creado","Actualizado","Acciones"]}
    >
      {comentarios.map(cm => (
        <EntityRow
          key={cm.id}
          item={cm}
          fields={[
            { key: 'user_id', edit: true, type: 'number' },
            { key: 'libro_id', edit: true, type: 'number' },
            { key: 'contenido', edit: true },
            { key: 'calificacion', edit: true, type: 'number' },
          ]}
          created="created_at"
          updated="updated_at"
          editingId={editingComId}
          setEditId={setEditingComId}
          editData={editComData}
          setEditData={setEditComData}
          path="comentarios"
          setter={setComentarios}
          saveEntity={saveEntity}
          deleteEntity={deleteEntity}
        />
      ))}
    </Section>
  );
}
