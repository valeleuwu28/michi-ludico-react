// src/services/gameService.js
export async function getGames() {
  try {
    // Cambia esta ruta para que coincida con tu estructura
    const response = await fetch("http://localhost/michi_api/games.php");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching games:", error);
  }
}
