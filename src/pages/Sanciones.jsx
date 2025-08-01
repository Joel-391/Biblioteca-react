import { useEffect, useState } from "react";
import axiosClient from "../api/Axios";
import SideNavLeft from "../components/SideNavLeft";
import { useStateContext } from "../contexts/ContextProvider";

export default function Sanciones() {
  const { user } = useStateContext();
  const [sanciones, setSanciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const estadoTexto = (estado) => {
    return estado === true || estado === "true" || estado === 1 || estado === "1"
      ? "Activa"
      : "Inactiva";
  };

  useEffect(() => {
    axiosClient
      .get("/sanciones")
      .then(({ data }) => {
        const sancionesUsuario = data.filter((sancion) => sancion.user_id === user.id);
        setSanciones(sancionesUsuario);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar sanciones:", error);
        setLoading(false);
      });
  }, [user]);

  const sancionActiva = sanciones.find(
    (s) =>
      s.estado === true &&
      new Date(s.fecha_inicio) <= new Date() &&
      new Date(s.fecha_fin) >= new Date()
  );

  return (
    <div className="flex">
      <SideNavLeft />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Mis Sanciones</h2>

        {loading ? (
          <p>Cargando sanciones...</p>
        ) : sanciones.length === 0 ? (
          <p>No tienes sanciones registradas.</p>
        ) : (
          <div className="grid gap-4">
            {sanciones.map((sancion) => (
              <div
                key={sancion.id}
                className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
              >
                <p><strong>Motivo:</strong> {sancion.motivo}</p>
                <p><strong>Fecha de inicio:</strong> {new Date(sancion.fecha_inicio).toLocaleDateString('es-EC')}</p>
                <p><strong>Fecha de fin:</strong> {new Date(sancion.fecha_fin).toLocaleDateString('es-EC')}</p>
                <p><strong>Estado:</strong> {estadoTexto(sancion.estado)}</p>
                <p><strong>Monto:</strong> ${Number(sancion.monto_sancion).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Mensaje si hay una sanción activa */}
        {sancionActiva && (
        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded">
            <p className="text-yellow-800 font-semibold">
            Tienes una sanción activa. Tu cuenta está suspendida hasta el{" "}
            <strong>{new Date(sancionActiva.fecha_fin).toLocaleDateString("es-EC")}</strong>.
            Podrás volver a alquilar o comentar después de esa fecha.
            {" "}
            <span className="font-normal">
                (Si ya pasó su tiempo de sanción y no lo han activado, por favor envíe un correo a <a href="mailto:biblioteca@biblioteca.com" className="underline text-blue-600">biblioteca@biblioteca.com</a> con foto incluida).
            </span>
            </p>
        </div>
        )}

      </div>
    </div>
  );
}
