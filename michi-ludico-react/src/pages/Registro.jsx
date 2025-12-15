// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState(""); // Cambié gmail por email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registrarUsuario = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost/michi_api/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(), // Enviar como "email" para coincidir con la base de datos
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Guardar usuario en localStorage (login automático después de registro)
        localStorage.setItem("michi_user", JSON.stringify(data.user));

        // Mostrar mensaje de éxito
        alert(`¡Usuario ${data.user.nombre} registrado correctamente!`);

        // Redirigir al catálogo o página principal
        navigate("/catalogo", {
          state: { message: "Registro exitoso" },
        });

        // Limpiar formulario
        setNombre("");
        setEmail("");
        setPassword("");
      } else {
        setError(data.message || "Error en el registro. Intenta nuevamente.");
      }
    } catch (err) {
      console.error("Error en registro:", err);
      setError("Error de conexión con el servidor. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Flecha para volver */}
      <Link to="/" className="flecha">
        🔙
      </Link>

      {/* Contenedor principal */}
      <div className="login-container">
        {/* Logo */}
        <div className="logo">
          <img src="/multimedia/logo.png" alt="Logo Michi Lúdico" />
        </div>

        {/* Formulario */}
        <form onSubmit={registrarUsuario} className="login-form">
          <h2>Registra tu Usuario</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingresa tu nombre"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={loading ? "loading" : ""}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <p className="registro">
            ¿Ya tienes cuenta?{" "}
            <Link to="/iniciosesion">Inicia sesión aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
