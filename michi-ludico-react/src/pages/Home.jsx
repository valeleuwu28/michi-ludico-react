// src/pages/Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 2. Base de datos de información de categorías (igual que en Vue)
const categoryData = {
  estrategia: `
    <h3>♟️ Estrategia: Pon a prueba tu mente!</h3>
    <p>Estos juegos requieren planificación, toma de decisiones a largo plazo y la capacidad de anticipar los movimientos de tus oponentes. Ideal para mentes analíticas.</p>
    <ul>
      <li>Ejemplos: Catan, Ajedrez, Monopolio.</li>
    </ul>
  `,
  cartas: `
    <h3>🃏 Cartas: Diversión rápida y social</h3>
    <p>Perfectos para grupos grandes y para romper el hielo. Son fáciles de aprender y las partidas suelen ser rápidas y muy dinámicas, basadas en la suerte y la interacción social.</p>
    <ul>
      <li>Ejemplos: UNO, Exploding Kittens, Póker.</li>
    </ul>
  `,
  clasicos: `
    <h3>🕰️ Clásicos: La historia de los juegos de mesa</h3>
    <p>Son los juegos atemporales que han pasado de generación en generación. Ideales para reuniones familiares y para introducir a nuevos jugadores al mundo lúdico.</p>
    <ul>
      <li>Ejemplos: Ludo, Damas, Dominó.</li>
    </ul>
  `
};

function Home() {
  const navigate = useNavigate();

  // 1. Estado Reactivo: categoryInfoContent
  const [categoryInfoContent, setCategoryInfoContent] = useState("");

  // 3. Manejador: showCategoryInfo(category)
  const showCategoryInfo = (category) => {
    setCategoryInfoContent(categoryData[category] || "");
  };

  return (
    <>
      {/* ====== SECCION PRINCIPAL / HERO ====== */}
      <section id="hero">
        <h1 id="titulo">
          Alquila juegos <br />
          con Michi lúdico
        </h1>

        {/* Botón que lleva al catálogo */}
        <button onClick={() => navigate("/catalogo")}>RESERVA AHORA!</button>
      </section>

      {/* ====== SECCION DE UBICACION ====== */}
      <section id="Ubicacion">
        <div className="container">
          <div className="texto">
            <h2>Ubicación 📍</h2>
            <p>
              Nos encontramos en la Universidad Católica Boliviana &quot;San
              Pablo&quot;, La Paz.
            </p>
          </div>

          {/* Mapa incrustado desde Google Maps */}
          <div className="mapa">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.676345297471!2d-68.12152202516787!3d-16.513240184208785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f20ee187a3103%3A0x2f2bb2b7df32a24d!2sUniversidad%20Cat%C3%B3lica%20Boliviana%20%22San%20Pablo%22%20-%20La%20Paz!5e0!3m2!1ses-419!2sbo!4v1727547400219!5m2!1ses-419!2sbo"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación UCB La Paz"
            ></iframe>
          </div>
        </div>
      </section>

      {/* ====== SECCION DE CATEGORÍAS ====== */}
      <section id="nuestras-categorias">
        <div className="container">
          <h2>Nuestras categorías</h2>
          <div className="programas">
            <div className="carta">
              <h3>Juegos de estrategia</h3>
              <button
                className="btn-info"
                onClick={() => showCategoryInfo("estrategia")}
              >
                + Info
              </button>
            </div>

            <div className="carta">
              <h3>Juegos de cartas</h3>
              <button
                className="btn-info"
                onClick={() => showCategoryInfo("cartas")}
              >
                + Info
              </button>
            </div>

            <div className="carta">
              <h3>Juegos clásicos</h3>
              <button
                className="btn-info"
                onClick={() => showCategoryInfo("clasicos")}
              >
                + Info
              </button>
            </div>
          </div>

          {categoryInfoContent && (
            <div
              id="info-categoria"
              className="info"
              dangerouslySetInnerHTML={{ __html: categoryInfoContent }}
            />
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
