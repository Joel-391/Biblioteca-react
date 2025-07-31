import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/Axios';
import SideNavLeft from '../components/SideNavLeft';
import { Star } from 'lucide-react';

const LibroDetalle = () => {
  const { id } = useParams();
  const [libro, setLibro] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [ejemplares, setEjemplares] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [alquilando, setAlquilando] = useState(false);
  const [mensajeAlquiler, setMensajeAlquiler] = useState('');

  useEffect(() => {
    axiosClient.get(`/libros/${id}`).then(({ data }) => setLibro(data));
    axiosClient.get(`/libros/${id}/comentarios`).then(({ data }) => setComentarios(data));
    axiosClient.get(`/api/libros/${id}/ejemplares-disponibles`).then(({ data }) => setEjemplares(data));
    axiosClient.get('/user').then(({ data }) => setUsuario(data)).catch(() => setUsuario(null));
  }, [id]);

  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return;
    setEnviando(true);
    setMensajeError('');
    try {
      await axiosClient.post(`/libros/${id}/comentarios`, {
        contenido: nuevoComentario,
        calificacion,
      });
      setNuevoComentario('');
      setCalificacion(0);
      const { data } = await axiosClient.get(`/libros/${id}/comentarios`);
      setComentarios(data);
    } catch (err) {
      if (err.response?.status === 403) {
        setMensajeError(err.response.data.message || 'Tu cuenta ha sido desactivada. No puedes comentar.');
      } else if (err.response?.status === 401) {
        setMensajeError('Debes iniciar sesión para comentar.');
      } else {
        setMensajeError('Error al enviar comentario.');
      }
    }
    setEnviando(false);
  };

  const alquilarEjemplar = async (ejemplarId) => {
    setAlquilando(true);
    setMensajeAlquiler('');
    try {
      await axiosClient.post('/api/alquileres', {
        ejemplar_id: ejemplarId,
      });
      setMensajeAlquiler('Solicitud de alquiler enviada correctamente.');
      // Actualiza la lista de ejemplares disponibles
      const { data } = await axiosClient.get(`/api/libros/${id}/ejemplares-disponibles`);
      setEjemplares(data);
    } catch (err) {
      if (err.response?.status === 403) {
        setMensajeAlquiler('Tu cuenta ha sido desactivada. No puedes alquilar.');
      } else if (err.response?.status === 401) {
        setMensajeAlquiler('Debes iniciar sesión para alquilar.');
      } else {
        setMensajeAlquiler('Error al solicitar alquiler.');
      }
    }
    setAlquilando(false);
  };

  const renderStars = (count) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < count ? 'text-yellow-500' : 'text-gray-300'}`}
          fill={i < count ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );

  if (!libro) return <div className="p-10">Cargando libro...</div>;

  return (
    <div className="flex">
      <SideNavLeft />
      <div className="p-10 w-full max-w-5xl mx-auto">
        {/* Detalle del libro */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <img
            src={libro.portada}
            alt={libro.titulo}
            className="w-64 h-96 object-cover rounded shadow-md"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{libro.titulo}</h1>
            <p className="text-gray-700 mb-1"><strong>Autor:</strong> {libro.autor}</p>
            <p className="text-gray-700 mb-1"><strong>Año de publicación:</strong> {libro.anio_publicacion}</p>
            <p className="text-gray-700 mb-1"><strong>ISBN:</strong> {libro.isbn}</p>
            <p className="text-gray-700 mb-1"><strong>Categoría:</strong> {libro.categoria?.nombre_cat}</p>
            <p className="text-gray-600 mt-4">{libro.descripcion}</p>

            {/* Alquiler de ejemplares */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Ejemplares disponibles:</h3>
              {usuario ? (
                usuario.activo ? (
                  ejemplares.length > 0 ? (
                    <ul className="space-y-2">
                      {ejemplares.map((eje) => (
                        <li key={eje.id} className="flex justify-between items-center border p-2 rounded">
                          <span>Ubicación: {eje.ubicacion_fisica} - Nota: {eje.nota ?? 'Sin nota'}</span>
                          <button
                            onClick={() => alquilarEjemplar(eje.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            disabled={alquilando}
                          >
                            {alquilando ? 'Procesando...' : 'Solicitar alquiler'}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No hay ejemplares disponibles actualmente.</p>
                  )
                ) : (
                  <p className="text-red-600">Tu cuenta ha sido desactivada. No puedes alquilar.</p>
                )
              ) : (
                <p className="text-gray-500">Debes iniciar sesión para alquilar.</p>
              )}
              {mensajeAlquiler && <p className="mt-2 text-blue-600">{mensajeAlquiler}</p>}
            </div>
          </div>
        </div>

        {/* Comentarios */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Comentarios de usuarios</h2>
          {/* Comentario nuevo */}
          {usuario ? (
            usuario.activo ? (
              <div className="mb-6">
                <textarea
                  className="w-full p-3 border rounded mb-2"
                  rows="4"
                  placeholder="Escribe tu comentario..."
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                />
                <div className="flex items-center gap-2 mb-2">
                  <span>Valoración:</span>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`cursor-pointer w-5 h-5 ${i < calificacion ? 'text-yellow-500' : 'text-gray-300'}`}
                      onClick={() => setCalificacion(i + 1)}
                      fill={i < calificacion ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={enviarComentario}
                  disabled={enviando}
                >
                  {enviando ? 'Enviando...' : 'Publicar comentario'}
                </button>
                {mensajeError && <p className="mt-2 text-red-600">{mensajeError}</p>}
              </div>
            ) : (
              <p className="text-red-600 mb-6">Tu cuenta ha sido desactivada. No puedes comentar.</p>
            )
          ) : (
            <p className="text-gray-500 mb-6">Debes iniciar sesión para comentar.</p>
          )}

          {/* Lista de comentarios */}
          {comentarios.length === 0 ? (
            <p>No hay comentarios aún.</p>
          ) : (
            <ul className="space-y-4">
              {comentarios.map((com) => (
                <li key={com.id} className="border p-4 rounded bg-white shadow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{com.user.name}</span>
                    {renderStars(com.calificacion)}
                  </div>
                  <p className="text-gray-800">{com.contenido}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(com.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibroDetalle;
