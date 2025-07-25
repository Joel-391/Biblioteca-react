import React, { useState, useEffect } from "react";
import SideNavLeft from "../components/SideNavLeft";

export default function Home() {
  const [recentBooks, setRecentBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  // Llamada a la API para obtener los 4 libros más recientes
  useEffect(() => {
    fetch("http://localhost:8000/api/recent-books")
      .then((response) => response.json())
      .then((data) => setRecentBooks(data))
      .catch((error) => console.error("Error al obtener libros recientes:", error));
  }, []);

  // Llamada a la API para obtener los libros recomendados
  useEffect(() => {
    fetch("http://localhost:8000/api/recommended-books")
      .then((response) => response.json())
      .then((data) => setRecommendedBooks(data))
      .catch((error) => console.error("Error al obtener libros recomendados:", error));
  }, []);

  return (
    <div className="flex">
      <SideNavLeft />
      <div className="p-7 w-full">
        <h1 className="text-2xl font-semibold">Bienvenido a la Biblioteca</h1>

        {/* Sección de Libros Recientes */}
        <h2 className="mt-6 text-xl font-medium">Libros Más Recientes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {recentBooks.length === 0 ? (
            <p>Cargando libros...</p>
          ) : (
            recentBooks.map((book) => (
              <div key={book.id} className="border rounded-lg p-4 bg-white shadow-lg">
                <h3 className="text-lg font-semibold">{book.titulo}</h3>
                <p className="text-sm text-gray-500">{book.autor}</p>
                <p className="mt-2 text-sm text-gray-600">
                  Fecha de publicación: {new Date(book.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Sección de Libros Recomendados */}
        <h2 className="mt-6 text-xl font-medium">Libros Recomendados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {recommendedBooks.length === 0 ? (
            <p>Cargando libros recomendados...</p>
          ) : (
            recommendedBooks.map((book) => (
              <div key={book.id} className="border rounded-lg p-4 bg-white shadow-lg">
                <h3 className="text-lg font-semibold">{book.titulo}</h3>
                <p className="text-sm text-gray-500">{book.autor}</p>
                <p className="mt-2 text-sm text-gray-600">
                  Fecha de publicación: {new Date(book.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
