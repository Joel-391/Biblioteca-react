import { useState, useEffect } from "react";
import SideNavLeft from "../components/SideNavLeft";
import UsersSection from "../sections/UsersSection";
import LibrosSection from "../sections/LibrosSection";
import CategoriasSection from "../sections/CategoriasSection";
import ComentariosSection from "../sections/ComentariosSection";
import AlquileresSection from "../sections/AlquileresSection";
import EjemplaresSection from "../sections/EjemplaresSection";
import SancionesSection from "../sections/SancionesSection";
import axiosClient from "../api/Axios.js";
export default function Admin() {

  const [users, setUsers] = useState([]);
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [alquileres, setAlquileres] = useState([]);
  const [ejemplares, setEjemplares] = useState([]);
  const [sanciones, setSanciones] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p className="p-7">Cargando datos...</p>;
  if (error) return <p className="p-7 text-red-600">{error}</p>;

  return (
    <div className="flex">
      <SideNavLeft />
      <div className="p-7 space-y-8 flex-1">
        <UsersSection users={users} setUsers={setUsers} />
        <LibrosSection libros={libros} setLibros={setLibros} />
        <CategoriasSection categorias={categorias} setCategorias={setCategorias} />
        <ComentariosSection comentarios={comentarios} setComentarios={setComentarios} />
        <AlquileresSection alquileres={alquileres} setAlquileres={setAlquileres} />
        <EjemplaresSection ejemplares={ejemplares} setEjemplares={setEjemplares} />
        <SancionesSection sanciones={sanciones} setSanciones={setSanciones} />
      </div>
    </div>
  );
}
