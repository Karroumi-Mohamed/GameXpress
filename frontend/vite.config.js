import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: '127.0.0.1'
    },
    build: {
        outDir: path.resolve(__dirname, '../public'),
        emptyOutDir: false,
    }
})
