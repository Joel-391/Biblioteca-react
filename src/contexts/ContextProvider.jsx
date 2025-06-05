import { useContext, useState, createContext, useEffect } from "react";
import axiosClient from "../api/Axios.js";

const StateContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (user) return; // Ya lo obtuvimos desde Login, no lo pedimos de nuevo

  axiosClient.get('/api/user')
    .then(({ data }) => setUser(data))
    .catch(() => setUser(null))
    .finally(() => setLoading(false));
}, []);

  return (
    <StateContext.Provider value={{ user, setUser, loading }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
