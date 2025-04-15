import { defineConfig } from 'vite';
import resolve from 'path';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
    build: {
        outDir: path.resolve(__dirname, '../public/dist'),
        emptyOutDir: true,
    }
});
