'use client'
import axios from "axios";
import NavBar from "@/components/ui/NavBar";
import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { userAgent } from "next/server";
import { MyContext } from "@/components/game/tools/ModeContext";
import { MyContextProvider } from "@/components/game/tools/MyContextProvider";
import { usePathname } from 'next/navigation'



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
    // console.log(inputValue);
  };

  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      await sendDataToBackend();
      setInputValue('');
    }
  };

  const sendDataToBackend = async () => {
    try {
      // console.log("input", inputValue)
      const response = await axios.get('http://localhost:3001/users/search', {
        withCredentials: true,
        params: {
          user : inputValue,
        }
      });
      // console.log(response)
      if (response.status === 200) {
        if (response.data.self === true)
          router.push('/profile');
        else
          router.push('/users?search=' + inputValue);
      }

      // console.log('Data sent to backend:', response.data);
    } catch (error) {
        // console.log('temaaaaa')
        router.push('/users/notfound');
      // console.error('Error sending data to backend:', error);
    }
  };

  return (
    <div className="flex h-full w-full p-3 gap-3 font-custom">
      {pathname !== "/game" &&  <NavBar />}
      {pathname !== "/game" &&
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
        <main className="h-full w-full">{children}</main>
    </div>
  );
}
