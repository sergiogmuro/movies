module.exports = {
    module: {
        rules: [
            {
                test: /\.module\.scss$/, // Solo para archivos SCSS como módulos
                use: [
                    'style-loader',    // Inyecta el CSS en el DOM
                    'css-loader?modules',  // Activa los CSS Modules
                    'sass-loader'      // Compila SCSS a CSS
                ],
            },
            {
                test: /\.scss$/,   // Para cualquier otro archivo SCSS
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
};
