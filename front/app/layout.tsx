import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LandingPage from "./(pages)/(routes)/Login/page";
import { response } from "express";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TRENDENDEN",
  description: "Plateform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // axios.get("http://localhost:8000/auth/42").then((response)=>{
  //   console.log("ana ghadi ldar")
  //   // console.log(response);
  //   console.log("ana ghadi ldar")
  // }).catch()
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        
        <link
          href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
