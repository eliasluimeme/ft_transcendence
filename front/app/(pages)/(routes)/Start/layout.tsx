import { Inter } from 'next/font/google'
import NavBar from '@/components/ui/NavBar'

const inter = Inter({ subsets: ['latin'] })


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
