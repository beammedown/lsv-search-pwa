import type { MetadataRoute } from 'next'

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LSV Search',
    short_name: 'LSVRS',
    description: 'Eine bessere Rechtssuche',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172b',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/lsv-search-pwa/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/lsv-search-pwa/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
