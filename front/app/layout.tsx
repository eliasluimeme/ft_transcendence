import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import LandingPage from './(pages)/(routes)/Login/page'
import { response } from 'express'
import axios from 'axios'

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

  // axios.get("http://localhost:8000/auth/42").then((response)=>{
  //   console.log("ana ghadi ldar")
  //   // console.log(response);
  //   console.log("ana ghadi ldar")
  // }).catch() 
  return (
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
  )
}