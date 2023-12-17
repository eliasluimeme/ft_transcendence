"use client";
import { useState, useEffect } from "react";
import * as React from "react";
import Image from "next/image";
import "@/components/ui/CSS/game.css";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type freind = {
  image: string;
  name: string;
};

const getFriends = () => {
  const [freind, setfreind] = useState<freind[]>([
  ]);
  const takefreind = async () => {
    try {
      const response = await axios.get("http://localhost:3001/friends", {
        withCredentials: true,
      });
      if (response.status === 200) {
        const newfreind: freind[] = response.data.map(
          (l: any) => ({
            image : l.photo,
            name : l.userName,
          })
          );
          setfreind(newfreind)
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
    <div className="flex items-center space-x-8" key={index}>
      <Avatar>
        <AvatarImage src={friend.image} alt="User Avatar" />
        <AvatarFallback></AvatarFallback>
      </Avatar>
      <div className="text-[15px] w-[100px]">{friend.name}</div>
      <button className="border rounded-lg w-[40%] bg-[#F77B3F] bg-opacity-[70%] hover:bg-opacity-[100%]">
        Send
      </button>
    </div>
  ));
};

const Freinds = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full grid grid-rows-5 place-items-center">
        <div className="w-full h-full row-start-1 row-span-1 flex items-center justify-center text-[40px] text-center">
          Invite Friends
        </div>
        <div className="w-[400px] h-[300px] row-start-2 row-span-5 relative">
          <div className="w-full h-full rounded-lg border overflow-y-scroll relative flex  flex-col items-center space-y-4">
            {getFriends()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Freinds;
