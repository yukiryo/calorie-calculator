import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    base: './', // Ensure relative paths for Cloudflare Pages flexibility
    server: {
        host: true
    },
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: '卡路里计算器 - 精准热量换算',
                short_name: '热量计算',
                description: '专业的食品热量计算器，快速将千焦(kJ/100g)转换为大卡(kcal)。',
                // theme_color: '#0f172a',
                // background_color: '#0f172a',
                display: 'standalone',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                cleanupOutdatedCaches: true,
                skipWaiting: true,
                clientsClaim: true
            }
        })
    ]
})
