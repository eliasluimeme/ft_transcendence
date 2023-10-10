import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import LandingPage from './(pages)/(routes)/Login/page'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ana ghadi l dar',
  description: 'Plateform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <body className={inter.className}>
          <LandingPage/>
          {children}
        </body>
      </html>
  )
}