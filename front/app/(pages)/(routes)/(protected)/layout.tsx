import NavBar from "@/components/ui/NavBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full p-3 gap-3">
      <NavBar />
      <main className="flex-1 h-full">{children}</main>
    </div>
  );
}
