import { useState } from "react";

function GameChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState([]);
  const [apiStatus, setApiStatus] = useState("Disponible");

  const askAI = async () => {
    if (!question.trim()) {
      setError("Por favor, escribe una pregunta");
      return;
    }

    setLoading(true);
    setError("");
    setApiStatus("Procesando...");

    // Agregar pregunta al historial
    const userQuestion = question.trim();
    setConversation((prev) => [
      ...prev,
      {
        type: "user",
        content: userQuestion,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    try {
      const res = await fetch("http://localhost/michi_api/chat.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ question: userQuestion }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
      }

      // Agregar respuesta al historial
      setConversation((prev) => [
        ...prev,
        {
          type: "ai",
          content: data.answer,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      setAnswer(data.answer);
      setApiStatus("Disponible");
    } catch (error) {
      console.error("Error completo:", error);
      setError(`Error: ${error.message}`);
      setApiStatus("Error - Reintentar");

      // Agregar error al historial
      setConversation((prev) => [
        ...prev,
        {
          type: "error",
          content: `No se pudo obtener respuesta: ${error.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
      setQuestion(""); // Limpiar input después de enviar
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      askAI();
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setAnswer("");
    setError("");
  };

  const exampleQuestions = [
    "¿Cómo se juega al Catan?",
    "Reglas básicas del ajedrez",
    "¿Cuántos jugadores pueden jugar Monopoly?",
    "Explica el juego Ticket to Ride",
    "¿Qué es un juego de mesa cooperativo?",
  ];

  return (
    <div className="game-chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-title">
          <h1>🎮 Michi IA - Asistente de Juegos</h1>
          <p className="subtitle">Pregunta sobre reglas, estrategias y más</p>
        </div>
        <div className="api-status">
          <span
            className={`status-indicator ${
              apiStatus === "Disponible" ? "online" : "offline"
            }`}
          ></span>
          <span className="status-text">{apiStatus}</span>
        </div>
      </div>

      {/* Ejemplos rápidos */}
      <div className="quick-questions">
        <p className="section-title">💡 Preguntas de ejemplo:</p>
        <div className="example-buttons">
          {exampleQuestions.map((example, index) => (
            <button
              key={index}
              className="example-btn"
              onClick={() => setQuestion(example)}
              disabled={loading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Área de conversación */}
      <div className="conversation-area">
        {conversation.length > 0 && (
          <div className="conversation-history">
            {conversation.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-header">
                  <span className="message-sender">
                    {msg.type === "user"
                      ? "👤 Tú"
                      : msg.type === "ai"
                      ? "🤖 Michi IA"
                      : "⚠️ Sistema"}
                  </span>
                  <span className="message-time">{msg.timestamp}</span>
                </div>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* Input y botones */}
        <div className="input-area">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Escribe tu pregunta sobre juegos de mesa..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="question-input"
            />
            <div className="input-actions">
              <button
                onClick={askAI}
                disabled={loading || !question.trim()}
                className="send-btn"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <span className="send-icon">✈️</span>
                    Enviar
                  </>
                )}
              </button>

              {conversation.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="clear-btn"
                  title="Limpiar conversación"
                >
                  🗑️ Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Contador de caracteres */}
          <div className="char-counter">{question.length}/500 caracteres</div>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Información de la API */}
        <div className="api-info">
          <p className="info-text">
            <strong>🤖 Powered by Google Gemini</strong> • Responde preguntas
            sobre juegos de mesa en tiempo real
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="chat-footer">
        <div className="footer-content">
          <p>
            <strong>Tip:</strong> Sé específico en tus preguntas para mejores
            respuestas. Ej: "¿Cuál es la estrategia inicial recomendada para
            Catan?"
          </p>
          <p className="footer-note">
            Las respuestas son generadas por IA y pueden contener imprecisiones.
            Verifica siempre con el manual oficial del juego.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GameChat;
