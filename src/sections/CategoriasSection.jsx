import Section from "../components/Section";
import EntityRow from "../components/EntityRow";
import { saveEntity, deleteEntity, createEntity } from "../api/adminApi";
import { Plus, CircleX, Check } from 'lucide-react';
import { useState } from "react";

export default function CategoriasSection({ categorias, setCategorias }) {
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatData, setEditCatData] = useState({ nombre_cat: "", descripcion_cat: "" });
  const [creatingCat, setCreatingCat] = useState(false);
  const [newCatData, setNewCatData] = useState({ nombre_cat: "", descripcion_cat: "" });
  const [showCategorias, setShowCategorias] = useState(false);

  return (
    <Section
      title="Categorías"
      count={categorias.length}
      show={showCategorias}
      setShow={setShowCategorias}
      headers={["ID","Nombre","Descripción","Creado","Actualizado","Acciones"]}
      extraHeader={() => (
        <button className="bg-blue-600 text-white rounded-full px-1.5 py-1.5 mr-1 mb-1"
                onClick={() => setCreatingCat(true)}
                title="Crear nueva categoría"><Plus size={15}/></button>
      )}
      renderNew={() => creatingCat && (
        <tr className="bg-green-50">
          <td className="border px-2 py-1">—</td>
          <td><input type="text" value={newCatData.nombre_cat} onChange={e => setNewCatData({...newCatData, nombre_cat: e.target.value})} className="border px-1 py-0.5 w-full" /></td>
          <td><input type="text" value={newCatData.descripcion_cat} onChange={e => setNewCatData({...newCatData, descripcion_cat: e.target.value})} className="border px-1 py-0.5 w-full" /></td>
          <td colSpan={2}></td>
          <td className="flex justify-center">
            <button className="bg-green-500 text-white m-1 p-1 rounded"
                    onClick={() => createEntity("categorias", newCatData, setCategorias, () => { setNewCatData({ nombre_cat:"",descripcion_cat:"" }); setCreatingCat(false); })}
                    title="Confirmar creación"><Check /></button>
            <button className="bg-gray-400 text-white m-1 p-1 rounded"
                    onClick={() => setCreatingCat(false)}
                    title="Cancelar creación"><CircleX /></button>
          </td>
        </tr>
      )}
    >
      {categorias.map(c => (
        <EntityRow
          key={c.id}
          item={c}
          fields={[
            { key: 'nombre_cat', edit: true },
            { key: 'descripcion_cat', edit: true },
          ]}
          created="created_at"
          updated="updated_at"
          editingId={editingCatId}
          setEditId={setEditingCatId}
          editData={editCatData}
          setEditData={setEditCatData}
          path="categorias"
          setter={setCategorias}
          saveEntity={saveEntity}
          deleteEntity={deleteEntity}
        />
      ))}
    </Section>
  );
}
