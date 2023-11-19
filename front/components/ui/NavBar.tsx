"use client";
import "@/components/ui/CSS/style.css";
import Image from "next/image";
import Link from "next/link";
import Info from "./Info";
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
      // Make a request to your backend logout endpoint
      const response = await axios.get('http://localhost:3001/logout', { withCredentials: true });

      if (response.status === 200 && response.data.success === true) 
        router.push('http://localhost:3000/Login');
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle error, e.g., show an error message
    }
  };
  const image =
    "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg";
  return (
    <div className="rounded-full bg-[#36393E] flex items-center flex-col justify-around w-14">
      {links.map((link, index) => (
        <Link className="" href={link.path} key={index}>
          <Image src={link.icon} alt="" width={24} height={21} />
        </Link>
      ))}
      <Info />
      <button onClick={logout}>
        <Image src="/logout.svg" alt="" width={24} height={21} />
      </button>
    </div>
  );
}
