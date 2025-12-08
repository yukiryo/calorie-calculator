import { defineConfig } from 'vite'

export default defineConfig({
    base: './', // Ensure relative paths for Cloudflare Pages flexibility
    server: {
        host: true
    }
})
