// src/components/Header.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="logos">
          <img
            className="logo"
            src="/multimedia/logo.png"
            alt="Logo Michi Lúdico"
          />
          <p className="logo1">MICHI</p>
          <p className="logo2">LÚDICO</p>
        </div>

        <nav>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "router-link-active" : "")}
            end
          >
            INICIO
          </NavLink>

          <NavLink
            to="/catalogo"
            className={({ isActive }) => (isActive ? "router-link-active" : "")}
          >
            CATÁLOGO
          </NavLink>

          <NavLink
            to="/contacto"
            className={({ isActive }) => (isActive ? "router-link-active" : "")}
          >
            CONTÁCTANOS
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/mis-reservas"
                className={({ isActive }) =>
                  isActive ? "router-link-active" : ""
                }
              >
                MIS RESERVAS
              </NavLink>

              <NavLink
                to="/chat"
                className={({ isActive }) =>
                  isActive ? "router-link-active" : ""
                }
              >
                CHATBOT
              </NavLink>
              {/* Dropdown de usuario */}
              <div className="user-menu">
                <button
                  className="user-toggle"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="user-avatar">👤</span>
                  <span className="user-name">
                    {user?.nombre.split(" ")[0]}
                  </span>
                  <span className="dropdown-arrow">
                    {dropdownOpen ? "▲" : "▼"}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="user-info">
                      <strong>{user?.nombre}</strong>
                      <small>{user?.email}</small>
                    </div>
                    <hr />
                    <NavLink
                      to="/mis-reservas"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      📋 Mis Reservas
                    </NavLink>
                    <NavLink
                      to="/perfil"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      👤 Mi Perfil
                    </NavLink>
                    <hr />
                    <button
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <NavLink
              to="/iniciosesion"
              className={({ isActive }) =>
                isActive ? "router-link-active" : ""
              }
            >
              INICIA SESIÓN
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
