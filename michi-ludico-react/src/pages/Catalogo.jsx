// src/pages/Catalogo.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import GameCard from "../components/GameCard";
import { getGames } from "../services/gameService";
import { useRental } from "../hooks/useRental";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
function Catalogo() {
  // ======= Estado reactivo =======
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [games, setGames] = useState([]);
  const auth = useAuth();
  const user = auth?.user ?? null;

  const navigate = useNavigate();
  // En el useEffect de Catalogo.jsx
  useEffect(() => {
    async function fetchGames() {
      try {
        const data = await getGames();
        const parsedGames = data.map((game) => {
          if (typeof game.etiquetas === "string") {
            return {
              ...game,
              etiqueta: game.etiquetas.split(",").map((tag) => tag.trim()),
            };
          }
          // Si ya viene como array
          return {
            ...game,
            etiqueta: game.etiquetas || game.etiqueta || [],
          };
        });

        setGames(parsedGames);
      } catch (error) {
        console.error("Error loading games:", error);
        // Puedes mostrar un mensaje al usuario aquí
      }
    }

    fetchGames();
  }, []);

  const [reservation, setReservation] = useState({
    nombre: "",
    telefono: "",
    fecha: "",
    dias: "1",
    nota: "",
  });

  const [devolucionDate, setDevolucionDate] = useState("");

  const reservationModalRef = useRef(null);

  const { occupyGame, isOccupied, rentalTimers, updateTimer } = useRental();

  // ======= Juegos filtrados (equivalente a computed filteredGames) =======
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const searchTerm = searchQuery.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        game.nombre.toLowerCase().includes(searchTerm) ||
        game.descripcion.toLowerCase().includes(searchTerm) ||
        (Array.isArray(game.etiqueta) &&
          game.etiqueta.some((tag) => tag.toLowerCase().includes(searchTerm)));

      const matchesCategory =
        !selectedCategory ||
        (Array.isArray(game.etiqueta) &&
          game.etiqueta.some((tag) => tag === selectedCategory));

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // ======= Métodos =======
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  const updateDevolucion = (fechaParam, diasParam) => {
    const fecha = fechaParam ?? reservation.fecha;
    const diasStr = diasParam ?? reservation.dias;

    if (!fecha) return;

    const fechaInicio = new Date(fecha);
    const dias = parseInt(diasStr, 10) || 1;
    const fechaDevolucion = new Date(fechaInicio);
    fechaDevolucion.setDate(fechaInicio.getDate() + dias);

    const texto = fechaDevolucion.toLocaleDateString("es-BO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setDevolucionDate(texto);
  };

  const openReservationModal = (game) => {
    if (!user) {
      alert("Debes iniciar sesión para reservar un juego");
      navigate("/iniciosesion");
      return;
    }

    setSelectedGame(game);

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    setReservation((prev) => ({
      ...prev,
      fecha: todayStr,
      dias: prev.dias || "1",
    }));

    updateDevolucion(todayStr, reservation.dias || "1");

    if (reservationModalRef.current) {
      reservationModalRef.current.showModal();
    }
  };

  const closeReservationModal = () => {
    if (reservationModalRef.current) {
      reservationModalRef.current.close();
    }
  };

  const showGameDetails = (game) => {
    alert(
      `🎮 ${game.nombre}\n\n📝 ${
        game.descripcion
      }\n\n🏷️ Etiquetas: ${game.etiqueta.join(", ")}\n👥 ${
        game.jugadores
      } jugadores\n⏱️ ${game.duracion}\n🎯 Edad: ${game.edad}\n💰 $${
        game.precio
      }`
    );
  };

  const submitReservation = async () => {
    // Validaciones adicionales
    if (!reservation.nombre.trim()) {
      alert("Por favor ingresa tu nombre");
      return;
    }
    if (!reservation.telefono.trim()) {
      alert("Por favor ingresa tu número de contacto");
      return;
    }
    if (!reservation.fecha) {
      alert("Por favor selecciona una fecha");
      return;
    }

    // Validar teléfono (mínimo 8 dígitos)
    if (reservation.telefono.replace(/\D/g, "").length < 8) {
      alert("Por favor ingresa un número de teléfono válido");
      return;
    }

    try {
      console.log("Enviando reserva para juego:", selectedGame.id);
      console.log("Usuario ID:", user?.id);

      const response = await fetch("http://localhost/michi_api/reservar.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          juego_id: selectedGame.id,
          fecha: reservation.fecha,
          dias: reservation.dias, // Agregar días si lo necesitas en el backend
        }),
      });

      console.log("Response status:", response.status);

      const text = await response.text();
      console.log("Response text:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Error parseando JSON:", parseError);
        alert("Error en la respuesta del servidor");
        return;
      }

      if (data.error) {
        alert("Error: " + data.message || data.error);
        return;
      }

      // Mensaje mejorado
      const mensajeAlerta =
        `✅ Reserva registrada correctamente\n` +
        `🎮 Juego: ${selectedGame.nombre}\n` +
        `🎉 Descuento aplicado: ${data.descuento}%\n` +
        `💰 Precio final: $${data.precio_final || selectedGame.precio}\n` +
        `📊 Reservas este mes: ${data.reservas_este_mes}`;

      alert(mensajeAlerta);

      // Enviar WhatsApp
      const mensaje = `¡Hola Michi Lúdico! 🎮

Quiero reservar: *${selectedGame.nombre}*

👤 *Nombre:* ${reservation.nombre}
📞 *Contacto:* ${reservation.telefono}
📅 *Fecha de inicio:* ${reservation.fecha}
⏳ *Días de alquiler:* ${reservation.dias} día(s)
🔄 *Devolución:* ${devolucionDate}
${data.descuento > 0 ? `💸 *Descuento aplicado:* ${data.descuento}%` : ""}
💰 *Precio final:* $${data.precio_final || selectedGame.precio}

${reservation.nota ? `💬 *Nota:* ${reservation.nota}` : ""}

¡Gracias! 😊`;

      const mensajeCodificado = encodeURIComponent(mensaje);
      window.open(
        `https://wa.me/59178912181?text=${mensajeCodificado}`,
        "_blank"
      );

      // Marcar como ocupado
      occupyGame(selectedGame.id);

      // Limpiar
      setReservation({
        nombre: "",
        telefono: "",
        fecha: "",
        dias: "1",
        nota: "",
      });
      setDevolucionDate("");
      setSelectedGame(null);
      closeReservationModal();
    } catch (error) {
      console.error("Error en reserva:", error);
      alert("Error de conexión con el servidor");
    }
  };

  // ======= Fecha / hora actual =======
  useEffect(() => {
    const updateCurrentDateInner = () => {
      const now = new Date();
      const texto =
        now.toLocaleDateString("es-BO", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }) +
        " • " +
        now.toLocaleTimeString("es-BO");

      setCurrentDate(texto);
    };

    updateCurrentDateInner();
    const id = setInterval(updateCurrentDateInner, 1000);
    return () => clearInterval(id);
  }, []);

  // ======= JSX =======
  return (
    <div className="catalog-view">
      <main className="catalog-main">
        <div className="catalog-header">
          <h1>Catálogo de Juegos</h1>
          <p className="current-date">{currentDate}</p>
        </div>

        {/* Barra de filtros */}
        <div className="filters-bar">
          <div className="search-box">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="search"
              placeholder="Buscar juegos..."
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="">Todas las categorías</option>
              <option value="cartas">🎴 Juegos de Cartas</option>
              <option value="tablero">♟️ Juegos de Tablero</option>
              <option value="estrategia">🧠 Estrategia</option>
              <option value="party">🎉 Party</option>
              <option value="familiar">👨‍👩‍👧‍👦 Familiar</option>
              <option value="clasico">⭐ Clásicos</option>
            </select>

            <button onClick={clearFilters} className="clear-btn">
              🔄 Limpiar
            </button>
          </div>
        </div>

        {/* Grid de juegos */}
        <div className="games-grid">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onReserveGame={openReservationModal}
              onShowDetails={showGameDetails}
              isOccupied={isOccupied}
              rentalTimers={rentalTimers}
              updateTimer={updateTimer}
              className="game-card-item"
            />
          ))}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {filteredGames.length === 0 && (
          <div className="no-results">
            <div className="no-results-content">
              <h3>😕 No se encontraron juegos</h3>
              <p>Intenta con otros filtros o términos de búsqueda</p>
              <button onClick={clearFilters} className="btn-primary">
                Mostrar todos los juegos
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Reserva */}
      <dialog ref={reservationModalRef} className="reservation-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Reservar {selectedGame ? selectedGame.nombre : ""}</h2>
            <button
              onClick={closeReservationModal}
              className="close-btn"
              type="button"
            >
              ×
            </button>
          </div>

          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre completo *</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={reservation.nombre}
                  onChange={(e) =>
                    setReservation((prev) => ({
                      ...prev,
                      nombre: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono/WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="Número de contacto"
                  value={reservation.telefono}
                  onChange={(e) =>
                    setReservation((prev) => ({
                      ...prev,
                      telefono: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Fecha de inicio *</label>
                <input
                  type="date"
                  value={reservation.fecha}
                  onChange={(e) => {
                    const value = e.target.value;
                    setReservation((prev) => ({
                      ...prev,
                      fecha: value,
                    }));
                    updateDevolucion(value, undefined);
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label>Días de alquiler *</label>
                <select
                  value={reservation.dias}
                  onChange={(e) => {
                    const value = e.target.value;
                    setReservation((prev) => ({
                      ...prev,
                      dias: value,
                    }));
                    updateDevolucion(undefined, value);
                  }}
                >
                  <option value="1">1 día</option>
                  <option value="2">2 días</option>
                  <option value="3">3 días</option>
                  <option value="5">5 días</option>
                  <option value="7">1 semana</option>
                </select>
              </div>
            </div>

            {devolucionDate && (
              <div className="devolucion-card">
                <span className="devolucion-icon">📅</span>
                <div>
                  <strong>Devolución estimada</strong>
                  <p>{devolucionDate}</p>
                </div>
              </div>
            )}

            <div className="form-group full-width">
              <label>Nota adicional (opcional)</label>
              <textarea
                rows="3"
                placeholder="Alguna observación especial..."
                value={reservation.nota}
                onChange={(e) =>
                  setReservation((prev) => ({
                    ...prev,
                    nota: e.target.value,
                  }))
                }
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button
              onClick={closeReservationModal}
              className="btn-secondary"
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={submitReservation}
              className="btn-primary whatsapp-btn"
              type="button"
            >
              <span>📱</span>
              Enviar por WhatsApp
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Catalogo;
