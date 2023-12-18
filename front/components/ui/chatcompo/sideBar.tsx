"use client";

import Image from "next/image";
import Style from "./sideBar.module.css";
import "@/components/ui/CSS/font.css";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import { link } from "fs";

type freind = {
  image: string;
  name: string;
};

const getFriends = () => {
  const [freind, setfreind] = useState<freind[]>([]);
  const takefreind = async () => {
    try {
      const response = await axios.get("http://localhost:3001/friends", {
        withCredentials: true,
      });
      if (response.status === 200) {
        const newfreind: freind[] = response.data.map((l: any) => ({
          image: l.photo,
          name: l.userName,
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

  return Object.values(freind).map((friend, index) => (
    <button
      className="bg-[#D9D9D9] w-[90%] h-[5%] hover:text-[#F77B3F] text-opacity-[70%] bg-opacity-[10%] hover:bg-opacity-[100%] flex items-center justify-center space-x-8 rounded-lg"
      key={index}
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
    <div className="w-full h-full">
      <div className="w-full h-full flex justify-center rounded-lg">
        <div className="overflow-y-auto w-[98%] h-full flex flex-col items-center  space-y-3">
          {getFriends()}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
