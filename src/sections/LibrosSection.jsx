import Section from "../components/Section";
import EntityRow from "../components/EntityRow";
import { saveEntity, deleteEntity, createEntity } from "../api/adminApi";
import { Plus, CircleX, Check } from 'lucide-react';
import { useState } from "react";

export default function LibrosSection({ libros, setLibros }) {
  const [editingLibroId, setEditingLibroId] = useState(null);
  const [editLibroData, setEditLibroData] = useState({
    titulo: "", autor: "", descripcion: "", anio_publicacion: "", isbn: "", categoria_id: 1, portada: ""
  });
  const [creatingLibro, setCreatingLibro] = useState(false);
  const [newLibroData, setNewLibroData] = useState({
    titulo: "", autor: "", descripcion: "", anio_publicacion: "", isbn: "", categoria_id: 1, portada: ""
  });
  const [showLibros, setShowLibros] = useState(false);

  return (
    <Section
      title="Libros"
      count={libros.length}
      show={showLibros}
      setShow={setShowLibros}
      headers={["ID", "Título", "Autor", "Descripción", "Año", "ISBN", "Cat ID", "Portada", "Creado", "Actualizado", "Acciones"]}
      extraHeader={() => (
        <button
          className="bg-blue-600 text-white rounded-full px-1.5 py-1.5 mr-1 mb-1"
          onClick={() => setCreatingLibro(true)}
          title="Crear nuevo libro"
        ><Plus size={15} /></button>
      )}
      renderNew={() => creatingLibro && (
        <tr className="bg-green-50">
          <td className="border px-2 py-1">—</td>
          <td><input type="text" value={newLibroData.titulo} onChange={e => setNewLibroData({ ...newLibroData, titulo: e.target.value })} className="border px-1 py-0.5 w-full" /></td>
          <td><input type="text" value={newLibroData.autor} onChange={e => setNewLibroData({ ...newLibroData, autor: e.target.value })} className="border px-1 py-0.5 w-full" /></td>
          <td><input type="text" value={newLibroData.descripcion} onChange={e => setNewLibroData({ ...newLibroData, descripcion: e.target.value })} className="border px-1 py-0.5 w-full" /></td>
          <td><input type="number" value={newLibroData.anio_publicacion} onChange={e => setNewLibroData({ ...newLibroData, anio_publicacion: e.target.value })} className="border px-1 py-0.5 w-full" /></td>
          <td><input type="text" value={newLibroData.isbn} onChange={e => setNewLibroData({ ...newLibroData, isbn: e.target.value })} className="border px-1 py-0.5 w-full" /></td>
          <td><input type="number" value={newLibroData.categoria_id} onChange={e => setNewLibroData({ ...newLibroData, categoria_id: +e.target.value })} className="border px-1 py-0.5 w-full" /></td>
          <td><input type="text" value={newLibroData.portada} onChange={e => setNewLibroData({ ...newLibroData, portada: e.target.value })} className="border px-1 py-0.5 w-full" placeholder="URL de la portada" /></td>
          <td colSpan={2}></td>
          <td className="flex justify-center">
            <button className="bg-green-500 text-white m-1 p-1 rounded"
              onClick={() => createEntity("libros", newLibroData, setLibros, () => {
                setNewLibroData({ titulo: "", autor: "", descripcion: "", anio_publicacion: "", isbn: "", categoria_id: 1, portada: "" });
                setCreatingLibro(false);
              })}
              title="Confirmar creación"><Check /></button>
            <button className="bg-gray-400 text-white m-1 p-1 rounded"
              onClick={() => setCreatingLibro(false)}
              title="Cancelar creación"><CircleX /></button>
          </td>
        </tr>
      )}
    >
      {libros.map(l => (
        <EntityRow
          key={l.id}
          item={l}
          fields={[
            { key: 'titulo', edit: true },
            { key: 'autor', edit: true },
            { key: 'descripcion', edit: true },
            { key: 'anio_publicacion', edit: true, type: 'number' },
            { key: 'isbn', edit: true },
            { key: 'categoria_id', edit: true, type: 'number' },
            { key: 'portada', edit: true }
          ]}
          created="created_at"
          updated="updated_at"
          editingId={editingLibroId}
          setEditId={setEditingLibroId}
          editData={editLibroData}
          setEditData={setEditLibroData}
          path="libros"
          setter={setLibros}
          saveEntity={saveEntity}
          deleteEntity={deleteEntity}
        />
      ))}
    </Section>
  );
}
