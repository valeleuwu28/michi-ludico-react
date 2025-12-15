// src/pages/MisReservas.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function MisReservas() {
  const { user, isAuthenticated } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchReservas();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost/michi_api/mis_reservas.php",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setReservas(data);
      } else {
        setError("Error al cargar reservas");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mis-reservas-page">
        <div className="not-logged-in">
          <h2>🔒 Acceso restringido</h2>
          <p>Debes iniciar sesión para ver tus reservas.</p>
          <Link to="/iniciosesion" className="btn-primary">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-reservas-page">
      <div className="container">
        <h1>📋 Mis Reservas</h1>
        <p className="subtitle">
          Hola {user?.nombre}, aquí están tus reservas activas
        </p>

        {loading ? (
          <div className="loading-spinner">Cargando reservas...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : reservas.length === 0 ? (
          <div className="no-reservations">
            <div className="empty-state">
              <h3>📭 No tienes reservas aún</h3>
              <p>¡Explora nuestro catálogo y reserva tu primer juego!</p>
              <Link to="/catalogo" className="btn-primary">
                Ver Catálogo
              </Link>
            </div>
          </div>
        ) : (
          <div className="reservas-grid">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="reserva-card">
                <div className="reserva-header">
                  <h3>{reserva.juego_nombre}</h3>
                  <span className={`status-badge ${reserva.estado}`}>
                    {reserva.estado || "Activa"}
                  </span>
                </div>

                <div className="reserva-details">
                  <div className="detail">
                    <span className="label">📅 Fecha reserva:</span>
                    <span className="value">{reserva.fecha_reserva}</span>
                  </div>
                  <div className="detail">
                    <span className="label">⏰ Creada:</span>
                    <span className="value">
                      {new Date(reserva.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail">
                    <span className="label">💰 Precio original:</span>
                    <span className="value">${reserva.precio}</span>
                  </div>
                  <div className="detail">
                    <span className="label">🎉 Descuento:</span>
                    <span className="value discount">{reserva.descuento}%</span>
                  </div>
                  <div className="detail">
                    <span className="label">💵 Precio final:</span>
                    <span className="value final-price">
                      ${reserva.precio_final || reserva.precio}
                    </span>
                  </div>
                </div>

                <div className="reserva-actions">
                  <button className="btn-secondary">Ver detalles</button>
                  <button className="btn-primary">Renovar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="stats">
          <div className="stat-card">
            <h4>Total reservas</h4>
            <p className="stat-number">{reservas.length}</p>
          </div>
          <div className="stat-card">
            <h4>Total ahorrado</h4>
            <p className="stat-number">
              $
              {reservas
                .reduce((total, r) => {
                  const ahorro = (r.precio * r.descuento) / 100;
                  return total + ahorro;
                }, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MisReservas;
