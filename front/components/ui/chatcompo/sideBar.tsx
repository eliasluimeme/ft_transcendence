"use client";

import Image from "next/image";
import Style from "./sideBar.module.css";
import "@/components/ui/CSS/font.css";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import JoinRoom from "./JoinRoom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CreateRoom from "./CreateRoom";

type freind = {
  id: string;
  image: string;
  name: string;
};

const getFriends = () => {
  const [freind, setfreind] = useState<freind[]>([]);
  const takefreind = async () => {
    try {
      const response = await axios.get("http://localhost:3001/chat/conversations", {
        withCredentials: true,
      });
      if (response.status === 200) {
        const newfreind: freind[] = response.data.map((l: any) => ({
          id: l.convId,
          image: l.photo ?? "https://t4.ftcdn.net/jpg/03/78/40/51/360_F_378405187_PyVLw51NVo3KltNlhUOpKfULdkUOUn7j.jpg",
          name: l.name,
        }));
        setfreind(newfreind);
      } else {
        console.log("Failed to fetch friendship data");
      }
    } catch (error) {
      console.error("An error occurred while fetching friendship data:", error);
    }
  };
  useEffect(() => {
    takefreind();
  }, []);

  const redirectConvo = async (id: string) =>  {
    try {
      const resp = await axios.get(`http://localhost:3000/chat/${id}`, {
        withCredentials: true,
      });
      if (resp.status === 200) {
        console.log("success");
      } else {
        console.log("Failed to fetch group data");
      }
    } catch (error) {

    }
  };

  return Object.values(freind).map((friend, index) => (
    <button
      className="bg-[#D9D9D9] w-[90%] h-[50px] hover:text-[#F77B3F] text-opacity-[70%] bg-opacity-[10%] hover:bg-opacity-[100%] flex items-center justify-center space-x-8 rounded-lg"
      key={index}

      onClick={() => redirectConvo(friend.id)}
    >
      <Avatar className="w-[30px] h-[30px]">
        <AvatarImage src={friend.image} alt="User Avatar" />
        <AvatarFallback></AvatarFallback>
      </Avatar>
      <div className="text-[15px] w-[100px]">{friend.name}</div>
      {/* <button className="border rounded-lg w-[40%] bg-[#F77B3F] bg-opacity-[70%] hover:bg-opacity-[100%]">
        Send
      </button> */}
    </button>
  ));
};

function SideBar() {
  const friends: string[] = ["Achraf", "Ilyass", "Youssef", "Yjaadoun"]; // Dattabase

  const [searchValue, setSearchValue] = useState("");

  const handleChat = (friend: string) => {
    // Implementation to open a chat with the friend.
    console.log(`Opening chat with ${friend}`);
    return (
      <div>
        <h1>Chat with {friend}</h1>
        <Link href={`/chat/${friend}`} />
      </div>
    );
    // render <Conversation /> component.
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    console.log("from handelSearch", value);
  };

  return (
    <div className="w-full h-full rounded-lg border">
      <div className="w-full h-full ">
        <div className="w-full h-full grid grid-col-12">
          <div className="mt-[20px] col-start-1 col-span-10 overflow-y-auto w-[98%] h-full flex flex-col items-center  space-y-3">
            {getFriends()}
          </div>
          <div className="w-full justify-center h-[500px] col-start-11 col-span-2 mt-[20px]">
            <div className="">
              <Popover>
                <PopoverTrigger>
                  <div className="w-[15px] h-[15px] absolute ">
                    <Image
                      src="/🦆 icon _cog_.svg"
                      alt=""
                      sizes="(max-width: 600px) 400px,
                (max-width: 1200px) 800px,
                1200px"
                      fill
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="flex space-y-4 flex-col items-center justify-between border-none w-[100px] h-[100px] bg-[#1E2124]">
                  <Popover>
                    <PopoverTrigger className="w-[90px] h-[40px] border rounded-lg text-[10px] text-white">
                      Create Room
                    </PopoverTrigger>
                    <PopoverContent className="bg-[#1E2124] text-white">
                      <CreateRoom />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger className="w-[90px] h-[40px] border rounded-lg text-[10px] text-white">
                      Join Room
                    </PopoverTrigger>
                    <PopoverContent className="bg-[#1E2124] text-white">
                      <JoinRoom />
                    </PopoverContent>
                  </Popover>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
