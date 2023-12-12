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

      if (response.status === 200 && response.data.success === true)
        router.push("http://localhost:3000/Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <div className="rounded-full bg-[#36393E] flex items-center flex-col justify-around w-14">
      {links.map((link, index) => (
        <Link className="w-[24px] h-[24px]" href={link.path} key={index}>
          <div className="w-[24px] h-[24px] absolute">
            <Image
              src={link.icon}
              alt=""
              sizes="(max-width: 600px) 400px,
                (max-width: 1200px) 800px,
                1200px"
              fill
            />
          </div>
        </Link>
      ))}
      <button className="w-[24px] h-[24px]" onClick={logout}>
        <div className="w-[24px] h-[24px] absolute">
          <Image
            src="/logout.svg"
            alt=""
            sizes="(max-width: 600px) 400px,
                (max-width: 1200px) 800px,
                1200px"
            fill
          />
        </div>
      </button>
    </div>
  );
}
