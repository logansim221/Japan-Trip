import './globals.css'

export const metadata = {
  title: 'Cambodia & Japan 2026 — Family Trip',
  description: 'June 22 – July 11, 2026 · 9 people · LAX → Phnom Penh → Osaka → Kyoto → Tokyo → LAX',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
