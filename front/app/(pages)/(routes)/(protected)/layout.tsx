import NavBar from "@/components/ui/NavBar";
import Head from "next/head";
export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full p-3 gap-3 font-custom">
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap" rel="stylesheet" />
      </Head>
      <NavBar />
      <main className="flex-1 h-full">{children}</main>
    </div>
  );
}
