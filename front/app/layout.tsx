import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from '@/components/ui/NavBar'
// import { useRouter } from 'next/router'
// import { ClerkProvider }  from '@clerk/nextjs'

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
          <div className='fixed top-[3rem] left-[1.94rem]'>
            <NavBar />
          </div>
          {children}
        </body>
      </html>
  )
}
