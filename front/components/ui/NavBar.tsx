"use client";
import "@/components/ui/CSS/style.css";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function NavBar() {
  const links = [
    {
      icon: "/home.svg",
      path: "/",
    },
    {
      icon: "/🦆 icon _medical cross_.svg",
      path: "/game",
    },
    {
      icon: "/🦆 icon _chat_.svg",
      path: "/chat",
    },
    {
      icon: "/🦆 icon _cog_.svg",
      path: "/settings",
    },
  ];
  const router = useRouter();
  const logout = async () => {
    try {
      const response = await axios.get("http://localhost:3001/logout", {
        withCredentials: true,
      });

      if (response.status === 200)
        router.push("http://localhost:3000/Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <div className="rounded-full bg-[#36393E] flex items-center flex-col justify-around w-14">
      {links.map((link, index) => (
        <Link className="" href={link.path} key={index}>
          <Image src={link.icon} alt="" width={24} height={21} />
        </Link>
      ))}
      <button onClick={logout}>
        <Image src="/logout.svg" alt="" width={24} height={21} />
      </button>
    </div>
  );
}
