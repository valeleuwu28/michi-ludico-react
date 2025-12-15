// src/pages/Contact.jsx
import { useState } from "react";

function Contact() {
  const [form, setForm] = useState({
    nombre: "",
    numero: "",
    mensaje: ""
  });

  // --- FUNCIÓN PARA SABER SALUDO SEGÚN LA HORA ---
  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  // --- FUNCIÓN PARA REDIRECCIONAR SEGÚN RED ---
  const redireccionar = (red) => {
    const saludo = obtenerSaludo();
    const mensaje = `${saludo}, quisiera hablar con un michiempleado...`;
    let url = "";

    if (red === "whatsapp") {
      alert(`${mensaje}\n\n(Serás redirigido a WhatsApp)`);
      url = `https://wa.me/59161204895?text=${encodeURIComponent(
        mensaje
      )}`;
    } else if (red === "instagram") {
      alert(`${mensaje}\n\n(Serás redirigido a Instagram)`);
      url = "https://www.instagram.com/michiludico/";
    } else if (red === "facebook") {
      alert(`${mensaje}\n\n(Serás redirigido a Facebook)`);
      url = "https://www.facebook.com/michiludico";
    }

    if (url) {
      window.open(url, "_blank");
    }
  };

  // --- FUNCIÓN PARA ENVIAR EL FORMULARIO ---
  const enviarFormulario = (e) => {
    e.preventDefault();

    const fecha = new Date().toLocaleString();

    if (!form.nombre.trim()) {
      alert("Por favor, ingresa tu nombre antes de enviar.");
      return;
    }
    if (!form.numero.trim()) {
      alert("Por favor, ingresa tu número antes de enviar.");
      return;
    }
    if (!form.mensaje.trim()) {
      alert("Por favor, ingresa tu mensaje antes de enviar.");
      return;
    }

    alert(
      `Gracias ${form.nombre}, tu formulario fue enviado el ${fecha}.\n\nMensaje: ${form.mensaje}`
    );

    setForm({
      nombre: "",
      numero: "",
      mensaje: ""
    });
  };

  return (
    <div className="contenido-contacto">
      {/* Columna izquierda: formulario */}
      <div className="columna-izquierda">
        <h1 className="contacto">Formulario de Contáctanos</h1>

        <form id="contacto" onSubmit={enviarFormulario}>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            placeholder="Ingresa tu nombre"
            value={form.nombre}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, nombre: e.target.value }))
            }
          />

          <label htmlFor="numero">Número:</label>
          <input
            type="text"
            id="numero"
            placeholder="Ingresa tu número"
            value={form.numero}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, numero: e.target.value }))
            }
          />

          <label htmlFor="mensaje">Mensaje:</label>
          <textarea
            id="mensaje"
            cols={30}
            rows={6}
            placeholder="Escribe tu mensaje..."
            value={form.mensaje}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, mensaje: e.target.value }))
            }
          />

          <button type="submit">Enviar</button>
        </form>
      </div>

      {/* Columna derecha: enlaces de contacto */}
      <section className="contactos">
        <img
          id="imagen"
          src="/multimedia/gato.jpeg"
          alt="gato"
        />

        <ul>
          <li>
            <button
              type="button"
              className="contact-link"
              onClick={() => redireccionar("whatsapp")}
            >
              <img src="/multimedia/whatsapp.png" alt="whatsapp" />
              Whatsapp
            </button>
          </li>
          <li>
            <button
              type="button"
              className="contact-link"
              onClick={() => redireccionar("instagram")}
            >
              <img src="/multimedia/instagram.png" alt="instagram" />
              Instagram
            </button>
          </li>
          <li>
            <button
              type="button"
              className="contact-link"
              onClick={() => redireccionar("facebook")}
            >
              <img src="/multimedia/facebook.png" alt="facebook" />
              Facebook
            </button>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Contact;
