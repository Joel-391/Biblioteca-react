import axiosClient from '../api/Axios.js';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, House, LayoutDashboard, ChevronDown, BookOpen, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SideNavLeft() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axiosClient.post('/logout', {});
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const [open, setOpen] = useState(true);
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const Menus = [
    { title: "Dashboard", icon: <LayoutDashboard /> },
    { title: "Pages", spacing: true, icon: <BookOpen /> },
    {
      title: "Libro",
      icon: <BookOpen />,
      subMenu: true,
      subMenuItems: [
        { title: "Buscar" },
        { title: "submenu 2" },
        { title: "submenu 3" },
      ],
    },
    { title: "Analytics", icon: <BookOpen /> },
    { title: "Profile", icon: <BookOpen /> },
    { title: "Logout", icon: <LogOut /> },
  ];

  return (
    <div className={`bg-[var(--sidebar)] h-screen p-5 pt-8 ${open ? "w-72" : "w-20"} duration-300 relative`}>
      <ArrowLeft
        className={`bg-white text-[var(--sidebar-foreground)] text-3xl rounded-full absolute -right-3 top-9 border border-[var(--sidebar-border)] cursor-pointer ${!open && "rotate-180"}`}
        onClick={() => setOpen(!open)}
      />
        <Link to="/home" className="inline-flex items-center p-2 no-underline">
        <House className={`bg-amber300 text-4xl rounded cursor-pointer block float-left mt-1 mr-1 duration-300 ${open && "rotate-[360deg]"}`} />
        <h1 className={`text-black origin-left font-medium text-2xl duration-300 ${!open && "scale-0"}`}>
          Home
        </h1>
      </Link>


      <ul className="pt-2">
        {Menus.map((menu, index) => (
          <div key={index}>
            <li
              className={`text-black text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-[var(--sidebar-accent)] rounded-md ${menu.spacing ? "mt-9" : "mt-2"}`}
              onClick={() => {
                if (menu.title === "Logout") {
                  logout();
                } else if (menu.title === "Profile") {
                  navigate('/profile'); // Maneja la navegación aquí
                } else if (menu.subMenu) {
                  setSubMenuOpen(!subMenuOpen);
                }
              }}
            >
              <span className="text-2xl block float-left">
                {menu.icon ? menu.icon : <LayoutDashboard />}
              </span>
              <span className={`text-base font-medium flex-1 duration-200 ${!open && "hidden"}`}>
                {menu.title}
              </span>
              {menu.subMenu && open && (
                <ChevronDown
                  className={`duration-200 ${subMenuOpen ? "rotate-180" : ""}`}
                  onClick={() => setSubMenuOpen(!subMenuOpen)}
                />
              )}
            </li>

            {menu.subMenu && subMenuOpen && open && (
              <ul>
                {menu.subMenuItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-black text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-[var(--sidebar-accent)]"
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}
