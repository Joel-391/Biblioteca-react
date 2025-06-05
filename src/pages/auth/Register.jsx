import { useStateContext } from "../../contexts/ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/Axios.js";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_confirmation] = useState("");
  const { setUser } = useStateContext();
  const navigate = useNavigate();

  const laravelRegister = async (event) => {
    event.preventDefault();
    try {
      await axiosClient.get("/sanctum/csrf-cookie");
      const response = await axiosClient.post(
        "/register",
        {
          name,
          email,
          password,
          password_confirmation,
        },
      );
      const { data } = await axiosClient.get("/api/user");
      setUser(data);
      console.log("Registro exitoso:"/* , response.data */);
      navigate("/home");
    } catch (error) {
      console.error("Error al registrarse:", error);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Registrarse
        </h2>
        <form onSubmit={laravelRegister} className="space-y-4">

          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              required
              className="w-full border border-gray-300 rounded-md py-2 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
              className="w-full border border-gray-300 rounded-md py-2 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className="w-full border border-gray-300 rounded-md py-2 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="password"
              value={password_confirmation}
              onChange={(e) => setPassword_confirmation(e.target.value)}
              placeholder="Confirmar contraseña"
              required
              className="w-full border border-gray-300 rounded-md py-2 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Ingresar
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            ¿No tienes una cuenta?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}