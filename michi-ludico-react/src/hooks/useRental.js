// src/hooks/useRental.js
import { useEffect, useState } from "react";

const RENT_PREFIX = "rent_";
const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hora demo (puedes cambiar)

// Helpers puros (no dependen de React)
const rentalKey = (id) => `${RENT_PREFIX}${id}`;

const getRentalEnd = (id) => {
  const v = localStorage.getItem(rentalKey(id));
  return v ? parseInt(v, 10) : null;
};

const remainingMs = (id) => {
  const end = getRentalEnd(id);
  return end ? Math.max(0, end - Date.now()) : 0;
};

const fmtTime = (ms) => {
  const s = Math.floor(ms / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

export function useRental() {
  const [rentalTimers, setRentalTimers] = useState({});

  const isOccupied = (id) => {
    const end = getRentalEnd(id);
    return !!end && end > Date.now();
  };

  const occupyGame = (id, ms = ONE_HOUR_MS) => {
    console.log(
      `🔒 Bloqueando juego ${id} por ${ms / 1000 / 60} minutos`
    );
    localStorage.setItem(rentalKey(id), String(Date.now() + ms));
    // actualizar de inmediato
    updateTimer(id);
    return true;
  };

  const releaseGame = (id) => {
    console.log(`🔓 Liberando juego ${id}`);
    localStorage.removeItem(rentalKey(id));
    setRentalTimers((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updateTimer = (id) => {
    const left = remainingMs(id);
    if (left <= 0) {
      releaseGame(id);
      return false;
    } else {
      const formatted = fmtTime(left);
      setRentalTimers((prev) => ({
        ...prev,
        [id]: formatted
      }));
      return true;
    }
  };

  const initializeTimers = () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(RENT_PREFIX)) {
        const gameId = key.replace(RENT_PREFIX, "");
        updateTimer(gameId);
      }
    }
  };

  useEffect(() => {
    initializeTimers();

    const intervalId = setInterval(() => {
      setRentalTimers((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((id) => {
          const left = remainingMs(id);
          if (left <= 0) {
            localStorage.removeItem(rentalKey(id));
            delete next[id];
          } else {
            next[id] = fmtTime(left);
          }
        });
        return next;
      });
    }, 1000);

    console.log("🕒 Sistema de alquiler iniciado");

    return () => {
      clearInterval(intervalId);
      console.log("⏹️ Sistema de alquiler detenido");
    };
  }, []);

  return {
    rentalTimers,
    isOccupied,
    occupyGame,
    releaseGame,
    remainingMs,
    fmtTime,
    updateTimer
  };
}
