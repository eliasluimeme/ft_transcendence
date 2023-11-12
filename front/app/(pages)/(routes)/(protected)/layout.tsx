import NavBar from "@/components/ui/NavBar";
import Head from "next/head";
export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full p-3 gap-3 font-custom">

      <NavBar />
      <main className="flex-1 h-full">{children}</main>
    </div>
  );
}
