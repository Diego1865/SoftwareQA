import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Scholar Grid',
    short_name: 'Scholar Grid',
    description: 'Plataforma colaborativa que centraliza, organiza y monetiza recursos educativos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#101411',
    theme_color: '#101411',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}