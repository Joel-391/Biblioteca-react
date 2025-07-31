import { useState } from 'react';
import axiosClient from '../api/Axios';
import SideNavLeft from '../components/SideNavLeft';
import { useNavigate } from 'react-router-dom';

const BuscarLibro = () => {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const buscar = async () => {
    if (!titulo && !categoria) {
      setError('Debe ingresar al menos título o categoría');
      return;
    }

    try {
      const res = await axiosClient.get('/libros/buscar', {
        params: { titulo, categoria },
      });
      setResultados(res.data);
      setError('');
    } catch (err) {
      console.error('Error al buscar libros:', err);
      setError('Hubo un problema al buscar libros.');
    }
  };
  

  return (
    <div className="flex">
      <SideNavLeft />
      <div className="p-7 w-full">
        <h2 className="text-2xl font-bold mb-4">Buscar Libros</h2>

        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="border p-2 rounded w-64"
          />
          <input
            type="text"
            placeholder="Buscar por categoría"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border p-2 rounded w-64"
          />
          <button
            onClick={buscar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {resultados.map((libro) => (
            <div key={libro.id} onClick={() => navigate(`/libros/${libro.id}`)} className="border rounded-lg p-4 bg-white shadow-lg transition-transform duration-200 
            hover:scale-105 hover:shadow-xl cursor-pointer">
              <img
                src={libro.portada || "https://via.placeholder.com/150x220?text=Sin+Portada"}
                alt={libro.titulo}
                className="w-full h-64 object-cover mb-2 rounded"
              />
              <h3 className="font-semibold text-lg">{libro.titulo}</h3>
              <p className="text-sm text-gray-700">Autor: {libro.autor}</p>
              <p className="text-sm text-gray-700">
                Categoría: {libro.categoria?.nombre_cat || 'Sin categoría'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuscarLibro;
