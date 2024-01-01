'use client'
import axios from "axios";
import NavBar from "@/components/ui/NavBar";
import { useState,useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'
import { ModeCtxProvider } from "@/components/game/tools/ModeCtxProvider";
import { socket} from "@/components/game/tools/SocketCtxProvider";


export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();
  const pathname = usePathname()
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      await sendDataToBackend();
      setInputValue('');
    }
  };

  const sendDataToBackend = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}users/search`, {
        withCredentials: true,
        params: {
          user : inputValue,
        }
      });
      if (response.status === 200) {
        if (response.data.self === true)
          router.push('/profile');
        else
          router.push('/users?search=' + inputValue);
      }
    } catch (error) {
        router.push('/users/notfound');
    }
  };
  useEffect( () => {
    return(() => {
    });
  }, []);

  return (
    <div className="flex h-full w-full p-3 gap-3 font-custom">
      {pathname !== "/game/board" &&  <NavBar />}
      {pathname !== "/game/board" &&
     <div>
      <div className="absolute w-[30%] flex space-x-2 right-[10%] top-[3%]">
        <svg
          className="w-5 h-5 "
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
            ></path>
        </svg>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyUp={handleKeyUp}
          className="w-[100%] h-[2%] border-color: rgb(255 255 255) bg-transparent border rounded-full text-[15px]  border-gray-500 text-gray-500"
          />
      </div>
      </div>
      }
      <ModeCtxProvider>
        <main className="h-full w-full">{children}</main>
      </ModeCtxProvider>
    </div>
  );
}
