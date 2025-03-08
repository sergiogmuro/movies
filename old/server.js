const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const port = 3000;

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Middleware para redirigir rutas dinámicas al cliente
app.use((req, res, next) => {

    req.url = `/contenido${req.path}?C=M;O=D`;
    // Si la ruta no es /contenido, redirige la ruta a index.html
    if (!req.path.startsWith('/contenido')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        next();
    }
});

// Configuración del proxy para redirigir contenido al servidor externo
app.use('/contenido', createProxyMiddleware({
    target: 'https://www.innovatv.store/contenido',
    changeOrigin: true,
    pathRewrite: { '^/contenido': '' }, // Mantiene la estructura
    logLevel: 'debug',
}));

// Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
