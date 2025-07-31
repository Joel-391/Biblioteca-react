import Section from "../components/Section";
import EntityRow from "../components/EntityRow";
import { saveEntity, deleteEntity } from "../api/adminApi";
import { useState } from "react";

export default function UsersSection({ users, setUsers }) {
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({ name: "", email: "", telefono: "", direccion: "", activo: false, rol_id: 1 });
  const [showUsers, setShowUsers] = useState(false);

  return (
    <Section
      title="Usuarios"
      count={users.length}
      show={showUsers}
      setShow={setShowUsers}
      headers={["ID","Nombre","Email","Teléfono","Dirección","Activo","Rol ID","Creado","Actualizado","Acciones"]}
    >
      {users.map(u => (
        <EntityRow
          key={u.id}
          item={u}
          fields={[
            { key: 'name', edit: true },
            { key: 'email', edit: true },
            { key: 'telefono', edit: true },
            { key: 'direccion', edit: true },
            { key: "activo", edit: true, type: "text" }, // usar input tipo texto para "true"/"false"
            { key: 'rol_id', edit: true, type: 'number' },
          ]}
          created="created_at"
          updated="updated_at"
          editingId={editingUserId}
          setEditId={setEditingUserId}
          editData={editUserData}
          setEditData={setEditUserData}
          path="users"
          setter={setUsers}
          saveEntity={saveEntity}
          deleteEntity={deleteEntity}
        />
      ))}
    </Section>
  );
}
