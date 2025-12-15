// src/components/GameCard.jsx
import { useEffect } from "react";

function GameCard({
  game,
  onReserveGame,
  onShowDetails,
  isOccupied,     // función: (id) => boolean
  rentalTimers,   // objeto: { [id]: "00:00:00" }
  updateTimer,    // función: (id) => void
  className = ""
}) {
  const ocupado = isOccupied ? isOccupied(game.id) : false;
  const rentalTime =
    (rentalTimers && rentalTimers[game.id]) || "00:00:00";

  const handleReserve = () => {
    if (ocupado) return;
    if (onReserveGame) onReserveGame(game);
  };

  const showDetails = () => {
    if (onShowDetails) onShowDetails(game);
  };

  const handleImageError = (event) => {
    // Imagen de respaldo si la original falla
    event.target.src = "/img/placeholder-game.jpg";
    event.target.alt = "Imagen no disponible";
  };

  const getMainCategory = (etiquetas = []) => {
    const categoryMap = {
      cartas: "🎴 Cartas",
      tablero: "♟️ Tablero",
      estrategia: "🧠 Estrategia",
      clasico: "⭐ Clásico",
      party: "🎉 Party",
      familiar: "👨‍👩‍👧‍👦 Familiar",
      deduccion: "🕵️ Deducción",
      bluff: "🎭 Bluff",
      rol: "🎭 Rol"
    };

    for (const tag of etiquetas) {
      if (categoryMap[tag]) {
        return categoryMap[tag];
      }
    }

    return "🎮 Juego";
  };

  const getDisplayTags = (etiquetas = []) => {
    // Excluir la categoría principal y mostrar máximo 3 etiquetas
    const mainCategory = getMainCategory(etiquetas).toLowerCase();
    return etiquetas
      .filter((tag) => !mainCategory.includes(tag))
      .slice(0, 3);
  };

  // Timer para actualizar el estado de ocupación
  useEffect(() => {
    if (!updateTimer) return;

    const intervalId = setInterval(() => {
      updateTimer(game.id);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [updateTimer, game.id]);

  return (
    <div
      className={`game-card ${ocupado ? "ocupado" : ""} ${className}`}
    >
      <div className="card-image">
        <img
          src={game.imagen}
          alt={game.nombre}
          onError={handleImageError}
        />
        {ocupado && (
          <div className="occupied-badge">⏳ Ocupado</div>
        )}
        <div className="image-overlay">
          <span className="price-tag">${game.precio}</span>
        </div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3 className="game-title">{game.nombre}</h3>
          <span className="category-tag">
            {getMainCategory(game.etiqueta)}
          </span>
        </div>

        <p className="game-description">{game.descripcion}</p>

        <div className="game-meta">
          <div className="meta-item">
            <span className="meta-icon">👥</span>
            <span className="meta-text">{game.jugadores}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span className="meta-text">{game.duracion}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">🎯</span>
            <span className="meta-text">{game.edad}</span>
          </div>
        </div>

        <div className="game-tags">
          {getDisplayTags(game.etiqueta).map((tag) => (
            <span key={tag} className="game-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="card-actions">
        <button
          className="btn-details"
          onClick={showDetails}
          disabled={ocupado}
          type="button"
        >
          <span className="btn-icon">🔍</span>
          Detalles
        </button>

        {ocupado ? (
          <button
            className="btn-occupied"
            disabled
            type="button"
          >
            <span className="btn-icon">⏳</span>
            {rentalTime}
          </button>
        ) : (
          <button
            className="btn-reserve"
            onClick={handleReserve}
            type="button"
          >
            <span className="btn-icon">🎮</span>
            Reservar
          </button>
        )}
      </div>
    </div>
  );
}

export default GameCard;
