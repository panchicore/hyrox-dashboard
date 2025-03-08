import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hyrox Dashboard',
  description: 'Análisis de rendimiento de las sesiones Hyrox',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
