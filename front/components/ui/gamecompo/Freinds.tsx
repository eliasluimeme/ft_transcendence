"use client";
import { useState, useEffect, useContext } from "react";
import * as React from "react";
import "@/components/ui/CSS/game.css";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
;
import {socket} from "@/components/game/tools/SocketCtxProvider"
import { ModeContext } from "@/components/game/tools/Contexts";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

type freind = {
  intraId: string;
  image: string;
  userName: string;
};

const GetFriends = () => {
  const router = useRouter();
  const [freind, setfreind] = useState<freind[]>([]);
  const [me, setMe] = useState<freind>()

  const mode = useContext(ModeContext);

  //////////////////////// Invit Friend to play with  ///////////////////////////////


  const invitToPlay = (friend: freind) => {

    const send = {
      recieverId: friend.intraId,
      senderName: me?.userName,
    }

    const recieve = {
      senderId: me?.intraId,
      accepterName: friend.userName,
    }

    socket.emit('inviteEvent', send, recieve);
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const takefreind = async () => {
    try {
      const response = await axios.get("http://localhost:3001/friends", {
        withCredentials: true,
      });
      if (response.status === 200) {
        const newfreind: freind[] = response.data.friends.map((l: any) => ({
          intraId: l.intraId,
          image: l.photo,
          userName: l.userName,
        })
        );
        setfreind(newfreind)
        setMe(response.data.me)
      } else {
      }
    } catch (error) {
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
      <div className="text-[15px] w-[100px]">{friend.userName}</div>
      <button
        className="border rounded-lg w-[40%] bg-[#F77B3F] bg-opacity-[70%] hover:bg-opacity-[100%]"
        onClick={() => invitToPlay(friend)}
      >
        Send
      </button>
    </div>
  ));
};

const Freinds = () => {
  return (
    <div className="h-full flex gap-4 flex-col container ">
      <div className="w-full flex items-center justify-center text-[40px] text-center text-[#F77B3F] my-6">
        With Friends
      </div>
      <div className="flex-1 overflow-y-auto rounded-lg relative flex flex-col items-center space-y-4">
        {GetFriends()}
      </div>
      <div className="mt-auto mb-4">
        <Image src="/animation.gif" alt="" width={350} height={350} />
      </div>
    </div>
  );
};

export default Freinds;