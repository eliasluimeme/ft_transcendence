import { SocketCtxProvider } from "@/components/game/tools/SocketCtxProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
  
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Goldman&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <SocketCtxProvider>
          <body className={inter.className}>{children}</body>
      </SocketCtxProvider>
    </html>
  );
}
