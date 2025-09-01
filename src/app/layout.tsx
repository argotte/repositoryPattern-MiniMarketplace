import React from 'react'
import './globals.css'

export const metadata = {
  title: 'Vibes Marketplace',
  description: 'A mini marketplace for discovering great products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">
              <a href="/" className="hover:text-blue-200">Vibes Marketplace</a>
            </h1>
            <nav className="mt-2">
              <a href="/" className="mr-4 hover:text-blue-200">Home</a>
              <a href="/products" className="mr-4 hover:text-blue-200">Products</a>
            </nav>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>&copy; 2025 Vibes Marketplace. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
