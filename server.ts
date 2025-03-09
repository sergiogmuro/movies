const express = require('express');
const app = express();

import readMoviesFromCSV from "./utils/csvReader";

const PORT = 3001; // 👈⚠️ IMPORTANTE: Usa un puerto distinto a Vite (3000)

app.get("/movies", async (req, res) => {
    try {
        const movies = await readMoviesFromCSV();
        if (!movies.length) {
            return res.status(404).json({ error: "No se encontraron películas" });
        }
        res.json(movies);
    } catch (err) {
        console.error("Error en la API:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// app.get("*", (req, res) => {
//     // Esto sirve el index.html para cualquier otra ruta
//     res.sendFile(path.join(__dirname, "public/index.html"));
// });

// 🔹 Iniciar servidor
app.listen(PORT, () => console.log(`✅ API corriendo en http://localhost:${PORT}/movies`));
