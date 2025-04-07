import type React from "react"
import "./globals.css"
import "./styles.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sanctus Dialogus - Catholic Saints Chatbot",
  description: "Engage in spiritual conversations with Catholic saints",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        {/* Replace your existing viewport meta tag with this one */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Domine:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app-container">{children}</div>
      </body>
    </html>
  )
}
