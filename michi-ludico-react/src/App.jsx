// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";

// Layout
import Header from "./components/Header";
import Footer from "./components/Footer";

// Páginas
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Chat from "./pages/gamechat";

import MisReservas from "./pages/MisReservas";

function App() {
  const location = useLocation();

  // Igual que tu "ocultarLayout" en Vue:
  // true solo en /iniciosesion y /registro
  const ocultarLayout =
    location.pathname === "/iniciosesion" || location.pathname === "/registro";

  return (
    <div className="app-root">
      {/* Header solo si no estamos en login o registro */}
      {!ocultarLayout && <Header />}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/iniciosesion" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/mis-reservas" element={<MisReservas />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>

      {/* Footer solo si no estamos en login o registro */}
      {!ocultarLayout && <Footer />}
    </div>
  );
}

export default App;
