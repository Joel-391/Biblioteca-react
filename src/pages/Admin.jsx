import { useState, useEffect } from "react";
import axiosClient from "../api/Axios.js";

export default function Admin() {
  // State arrays
  const [users, setUsers] = useState([]);
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [alquileres, setAlquileres] = useState([]);
  const [ejemplares, setEjemplares] = useState([]);
  const [sanciones, setSanciones] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Expand/collapse flags
  const [showUsers, setShowUsers] = useState(false);
  const [showLibros, setShowLibros] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);
  const [showComentarios, setShowComentarios] = useState(false);
  const [showAlquileres, setShowAlquileres] = useState(false);
  const [showEjemplares, setShowEjemplares] = useState(false);
  const [showSanciones, setShowSanciones] = useState(false);

  // Editing states and data templates
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({ name: "", email: "", telefono: "", direccion: "", activo: false, rol_id: 1 });

  const [editingLibroId, setEditingLibroId] = useState(null);
  const [editLibroData, setEditLibroData] = useState({ titulo: "", autor: "", descripcion: "", anio_publicacion: "", isbn: "", categoria_id: 1 });

  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatData, setEditCatData] = useState({ nombre_cat: "", descripcion_cat: "" });

  const [editingComId, setEditingComId] = useState(null);
  const [editComData, setEditComData] = useState({ user_id: "", libro_id: "", contenido: "", calificacion: 0 });

  const [editingAlqId, setEditingAlqId] = useState(null);
  const [editAlqData, setEditAlqData] = useState({ user_id: "", libro_id: "", fecha_alquiler: "", fecha_devolucion: "", devuelto: false });

  const [editingEjemId, setEditingEjemId] = useState(null);
  const [editEjemData, setEditEjemData] = useState({ libro_id: "", ubicacion_fisica: "", disponible: false });

  const [editingSanId, setEditingSanId] = useState(null);
  const [editSanData, setEditSanData] = useState({ user_id: "", motivo: "", fecha_inicio: "", fecha_fin: "", estado: "", monto_sancion: 0 });

  // Creation states only for sections we allow: libros, categorias, ejemplares, sanciones
  const [creatingLibro, setCreatingLibro] = useState(false);
  const [newLibroData, setNewLibroData] = useState({ titulo: "", autor: "", descripcion: "", anio_publicacion: "", isbn: "", categoria_id: 1 });

  const [creatingCat, setCreatingCat] = useState(false);
  const [newCatData, setNewCatData] = useState({ nombre_cat: "", descripcion_cat: "" });

  const [creatingEjem, setCreatingEjem] = useState(false);
  const [newEjemData, setNewEjemData] = useState({ libro_id: "", ubicacion_fisica: "", disponible: false });

  const [creatingSan, setCreatingSan] = useState(false);
  const [newSanData, setNewSanData] = useState({ user_id: "", motivo: "", fecha_inicio: "", fecha_fin: "", estado: "", monto_sancion: 0 });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axiosClient.get("/api/admin/users"),
      axiosClient.get("/api/admin/libros"),
      axiosClient.get("/api/admin/categorias"),
      axiosClient.get("/api/admin/comentarios"),
      axiosClient.get("/api/admin/alquileres"),
      axiosClient.get("/api/admin/ejemplares"),
      axiosClient.get("/api/admin/sanciones"),
    ])
      .then(([uRes, lRes, cRes, comRes, aRes, eRes, sRes]) => {
        setUsers(uRes.data);
        setLibros(lRes.data);
        setCategorias(cRes.data);
        setComentarios(comRes.data);
        setAlquileres(aRes.data);
        setEjemplares(eRes.data);
        setSanciones(sRes.data);
      })
      .catch(() => setError("Error al cargar los datos"))
      .finally(() => setLoading(false));
  }, []);

  // Reusable save and delete
  const saveEntity = async (path, id, data, setter, clearEdit) => {
    try {
      const res = await axiosClient.put(`/api/admin/${path}/${id}`, data);
      setter(prev => prev.map(i => i.id === id ? res.data : i));
      clearEdit();
    } catch (err) {
      if (err.response?.status === 422) {
        alert("Errores:\n" + JSON.stringify(err.response.data.errors, null, 2));
      } else {
        alert("Error al actualizar");
      }
    }
  };

  const deleteEntity = async (path, id, setter) => {
    if (!window.confirm("¿Estás seguro?")) return;
    try {
      await axiosClient.delete(`/api/admin/${path}/${id}`);
      setter(prev => prev.filter(i => i.id !== id));
    } catch {
      alert("Error al eliminar");
    }
  };

  const createEntity = async (path, data, setter, clearNew) => {
    try {
      const res = await axiosClient.post(`/api/admin/${path}`, data);
      setter(prev => [res.data, ...prev]);
      clearNew();
    } catch (err) {
      if (err.response?.status === 422) {
        alert("Errores:\n" + JSON.stringify(err.response.data.errors, null, 2));
      } else {
        alert("Error al crear");
      }
    }
  };

  if (loading) return <p className="p-7">Cargando datos...</p>;
  if (error) return <p className="p-7 text-red-600">{error}</p>;

  const renderRow = (item, fields, created, updated,
    editingId, setEditId, editData, setEditData,
    path, setter
  ) => {
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
  };

  return (
    <div className="p-7 space-y-8">
      {/* Usuarios (no crear) */}
      <Section
        title="Usuarios"
        count={users.length}
        show={showUsers}
        setShow={setShowUsers}
        headers={["ID","Nombre","Email","Teléfono","Dirección","Activo","Rol ID","Creado","Actualizado","Acciones"]}
      >
        {users.map(u => renderRow(
          u,
          [
            { key: 'name', edit: true },
            { key: 'email', edit: true },
            { key: 'telefono', edit: true },
            { key: 'direccion', edit: true },
            { key: 'activo', edit: true, type: 'checkbox' },
            { key: 'rol_id', edit: true, type: 'number' },
          ],
          'created_at','updated_at',
          editingUserId,setEditingUserId,
          editUserData,setEditUserData,
          'users',setUsers
        ))}
      </Section>

      {/* Libros (crear) */}
      <Section
        title="Libros"
        count={libros.length}
        show={showLibros}
        setShow={setShowLibros}
        headers={["ID","Título","Autor","Descripción","Año","ISBN","Cat ID","Creado","Actualizado","Acciones"]}
        extraHeader={() => (
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded mb-1"
            onClick={() => setCreatingLibro(true)}
          >+ Agregar Libro</button>
        )}
        renderNew={() => creatingLibro && (
          <tr className="bg-green-50">
            <td className="border px-2 py-1">—</td>
            <td><input
              type="text"
              value={newLibroData.titulo}
              onChange={e => setNewLibroData({...newLibroData, titulo: e.target.value})}
              className="border px-1 py-0.5 w-full"
            /></td>
            <td><input
              type="text"
              value={newLibroData.autor}
              onChange={e => setNewLibroData({...newLibroData, autor: e.target.value})}
              className="border px-1 py-0.5 w-full"
            /></td>
            <td><input
              type="text"
              value={newLibroData.descripcion}
              onChange={e => setNewLibroData({...newLibroData, descripcion: e.target.value})}
              className="border px-1 py-0.5 w-full"
            /></td>
            <td><input
              type="number"
              value={newLibroData.anio_publicacion}
              onChange={e => setNewLibroData({...newLibroData, anio_publicacion: e.target.value})}
              className="border px-1 py-0.5 w-full"
            /></td>
            <td><input
              type="text"
              value={newLibroData.isbn}
              onChange={e => setNewLibroData({...newLibroData, isbn: e.target.value})}
              className="border px-1 py-0.5 w-full"
            /></td>
            <td><input
              type="number"
              value={newLibroData.categoria_id}
              onChange={e => setNewLibroData({...newLibroData, categoria_id: +e.target.value})}
              className="border px-1 py-0.5 w-full"
            /></td>
            <td colSpan={2}></td>
            <td className="space-x-1">
              <button
                className="bg-green-500 text-white px-2 rounded"
                onClick={() => createEntity("libros", newLibroData, setLibros, () => {
                  setNewLibroData({ titulo:"",autor:"",descripcion:"",anio_publicacion:"",isbn:"",categoria_id:1 });
                  setCreatingLibro(false);
                })}
              >Crear</button>
              <button
                className="bg-gray-400 text-white px-2 rounded"
                onClick={() => setCreatingLibro(false)}
              >Cancelar</button>
            </td>
          </tr>
        )}
      >
        {libros.map(l => renderRow(
          l,
          [
            { key: 'titulo', edit: true },
            { key: 'autor', edit: true },
            { key: 'descripcion', edit: true },
            { key: 'anio_publicacion', edit: true, type: 'number' },
            { key: 'isbn', edit: true },
            { key: 'categoria_id', edit: true, type: 'number' },
          ],
          'created_at','updated_at',
          editingLibroId,setEditingLibroId,
          editLibroData,setEditLibroData,
          'libros',setLibros
        ))}
      </Section>

      {/* Categorías (crear) */}
      <Section
        title="Categorías"
        count={categorias.length}
        show={showCategorias}
        setShow={setShowCategorias}
        headers={["ID","Nombre","Descripción","Creado","Actualizado","Acciones"]}
        extraHeader={() => (
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded mb-1"
            onClick={() => setCreatingCat(true)}
          >+ Agregar Categoría</button>
        )}
        renderNew={() => creatingCat && (
          <tr className="bg-green-50">
            <td className="border px-2 py-1">—</td>
            <td><input
              type="text"
              value={newCatData.nombre_cat}
              onChange={e => setNewCatData({...newCatData, nombre_cat: e.target.value})}
              className="border px-1 py-0.5 w-full"
            /></td>
            <td><input
              type="text"
              value={newCatData.descripcion_cat}
              onChange={e => setNewCatData({...newCatData, descripcion_cat: e.target.value})}
              className="border px-1 py-0.5 w-full"
            /></td>
            <td colSpan={2}></td>
            <td className="space-x-1">
              <button
                className="bg-green-500 text-white px-2 rounded"
                onClick={() => createEntity("categorias", newCatData, setCategorias, () => {
                  setNewCatData({ nombre_cat:"",descripcion_cat:"" });
                  setCreatingCat(false);
                })}
              >Crear</button>
              <button
                className="bg-gray-400 text-white px-2 rounded"
                onClick={() => setCreatingCat(false)}
              >Cancelar</button>
            </td>
          </tr>
        )}
      >
        {categorias.map(c => renderRow(
          c,
          [
            { key: 'nombre_cat', edit: true },
            { key: 'descripcion_cat', edit: true },
          ],
          'created_at','updated_at',
          editingCatId,setEditingCatId,
          editCatData,setEditCatData,
          'categorias',setCategorias
        ))}
      </Section>

      {/* Comentarios (no crear) */}
      <Section
        title="Comentarios"
        count={comentarios.length}
        show={showComentarios}
        setShow={setShowComentarios}
        headers={["ID","User ID","Libro ID","Contenido","Calificación","Creado","Actualizado","Acciones"]}
      >
        {comentarios.map(cm => renderRow(
          cm,
          [
            { key: 'user_id', edit: true, type: 'number' },
            { key: 'libro_id', edit: true, type: 'number' },
            { key: 'contenido', edit: true },
            { key: 'calificacion', edit: true, type: 'number' },
          ],
          'created_at','updated_at',
          editingComId,setEditingComId,
          editComData,setEditComData,
          'comentarios',setComentarios
        ))}
      </Section>

      {/* Alquileres (no crear) */}
      <Section
        title="Alquileres"
        count={alquileres.length}
        show={showAlquileres}
        setShow={setShowAlquileres}
        headers={["ID","User ID","Libro ID","Alquiler","Devolución","Devuelto","Creado","Actualizado","Acciones"]}
      >
        {alquileres.map(a => renderRow(
          a,
          [
            { key: 'user_id', edit: true, type: 'number' },
            { key: 'libro_id', edit: true, type: 'number' },
            { key: 'fecha_alquiler', edit: true, type: 'date' },
            { key: 'fecha_devolucion', edit: true, type: 'date' },
            { key: 'devuelto', edit: true, type: 'checkbox' },
          ],
          'created_at','updated_at',
          editingAlqId,setEditingAlqId,
          editAlqData,setEditAlqData,
          'alquileres',setAlquileres
        ))}
      </Section>

{/* Ejemplares (crear) */}
<Section
  title="Ejemplares"
  count={ejemplares.length}
  show={showEjemplares}
  setShow={setShowEjemplares}
  headers={["ID", "Libro ID", "Ubicación", "Disponible", "Nota", "Creado", "Actualizado", "Acciones"]}
  extraHeader={() => (
    <button
      className="bg-blue-600 text-white px-3 py-1 rounded mb-1"
      onClick={() => setCreatingEjem(true)}
    >+ Agregar Ejemplar</button>
  )}
  renderNew={() => creatingEjem && (
    <tr className="bg-green-50">
      <td className="border px-2 py-1">—</td>
      <td><input
        type="number"
        value={newEjemData.libro_id}
        onChange={e => setNewEjemData({ ...newEjemData, libro_id: +e.target.value })}
        className="border px-1 py-0.5 w-full"
      /></td>
      <td><input
        type="text"
        value={newEjemData.ubicacion_fisica}
        onChange={e => setNewEjemData({ ...newEjemData, ubicacion_fisica: e.target.value })}
        className="border px-1 py-0.5 w-full"
      /></td>
      <td className="text-center">
        <input
          type="checkbox"
          checked={newEjemData.disponible}
          onChange={e => setNewEjemData({ ...newEjemData, disponible: e.target.checked })}
        />
      </td>
      <td><input
        type="text"
        value={newEjemData.nota}
        onChange={e => setNewEjemData({ ...newEjemData, nota: e.target.value })}
        className="border px-1 py-0.5 w-full"
      /></td>
      <td colSpan={2}></td>
      <td className="space-x-1">
        <button
          className="bg-green-500 text-white px-2 rounded"
          onClick={() => createEntity("ejemplares", newEjemData, setEjemplares, () => {
            setNewEjemData({ libro_id: "", ubicacion_fisica: "", disponible: false, nota: "" });
            setCreatingEjem(false);
          })}
        >Crear</button>
        <button
          className="bg-gray-400 text-white px-2 rounded"
          onClick={() => setCreatingEjem(false)}
        >Cancelar</button>
      </td>
    </tr>
  )}
>
  {ejemplares.map(e => renderRow(
    e,
    [
      { key: 'libro_id', edit: true, type: 'number' },
      { key: 'ubicacion_fisica', edit: true },
      { key: 'disponible', edit: true, type: 'checkbox' },
      { key: 'nota', edit: true, type: 'text' } // 👈 NUEVO CAMPO AQUÍ
    ],
    'created_at', 'updated_at',
    editingEjemId, setEditingEjemId,
    editEjemData, setEditEjemData,
    'ejemplares', setEjemplares
  ))}
</Section>


      {/* Sanciones (crear) */}
      <Section
        title="Sanciones"
        count={sanciones.length}
        show={showSanciones}
        setShow={setShowSanciones}
        headers={["ID","User ID","Motivo","Inicio","Fin","Estado","Monto","Creado","Actualizado","Acciones"]}
        extraHeader={() => (
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded mb-1"
            onClick={() => setCreatingSan(true)}
          >+ Agregar Sanción</button>
        )}
        renderNew={() => creatingSan && (
          <tr className="bg-green-50">
            <td className="border px-2 py-1">—</td>
            <td><input
              type="number"
              value={newSanData.user_id}
              onChange={e => setNewSanData({...newSanData, user_id: +e.target.value})}
              className="border px-1 py-0.5 w-full"
            /></td>
            <td><input
              type="text"
              value={newSanData.motivo}
              onChange={e => setNewSanData({...newSanData, motivo: e.target.value})}
              className="border px-1 py-0.5 w-full"
            /></td>
            <td><input
              type="date"
              value={newSanData.fecha_inicio}
              onChange={e => setNewSanData({...newSanData, fecha_inicio: e.target.value})}
              className="border px-1 py-0.5 w-full"
            /></td>
            <td><input
              type="date"
              value={newSanData.fecha_fin}
              onChange={e => setNewSanData({...newSanData, fecha_fin: e.target.value})}
              className="border px-1 py-0.5 w-full"
            /></td>
            <td><input
              type="text"
              value={newSanData.estado}
              onChange={e => setNewSanData({...newSanData, estado: e.target.value})}
              className="border px-1 py-0.5 w-full"
            /></td>
            <td><input
              type="number"
              value={newSanData.monto_sancion}
              onChange={e => setNewSanData({...newSanData, monto_sancion: +e.target.value})}
              className="border px-1 py-0.5 w-full"
            /></td>
            <td colSpan={2}></td>
            <td className="space-x-1">
              <button
                className="bg-green-500 text-white px-2 rounded"
                onClick={() => createEntity("sanciones", newSanData, setSanciones, () => {
                  setNewSanData({ user_id:"",motivo:"",fecha_inicio:"",fecha_fin:"",estado:"",monto_sancion:0 });
                  setCreatingSan(false);
                })}
              >Crear</button>
              <button
                className="bg-gray-400 text-white px-2 rounded"
                onClick={() => setCreatingSan(false)}
              >Cancelar</button>
            </td>
          </tr>
        )}
      >
        {sanciones.map(s => renderRow(
          s,
          [
            { key: 'user_id', edit: true, type: 'number' },
            { key: 'motivo', edit: true },
            { key: 'fecha_inicio', edit: true, type: 'date' },
            { key: 'fecha_fin', edit: true, type: 'date' },
            { key: 'estado', edit: true },
            { key: 'monto_sancion', edit: true, type: 'number' },
          ],
          'created_at','updated_at',
          editingSanId,setEditingSanId,
          editSanData,setEditSanData,
          'sanciones',setSanciones
        ))}
      </Section>
    </div>
  );
}

function Section({ title, count, show, setShow, headers, extraHeader, renderNew, children }) {
  return (
    <div>
      {extraHeader && extraHeader()}
      <button className="font-bold text-xl underline mb-2" onClick={() => setShow(!show)}>
        {show ? '▼' : '▶'} {title} ({count})
      </button>
      {show && (
        <div className="overflow-x-auto max-h-72 overflow-y-auto border border-gray-300 rounded-md">
          <table className="min-w-full">
            <thead className="bg-gray-100 sticky top-0">
              <tr>{headers.map(h => <th key={h} className="border px-2 py-1">{h}</th>)}</tr>
            </thead>
            <tbody>
              {renderNew && renderNew()}
              {children}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
