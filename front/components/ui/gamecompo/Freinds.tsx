"use client";
import { useState, useEffect, useContext } from "react";
import * as React from "react";
import Image from "next/image";
import "@/components/ui/CSS/game.css";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MyContext } from "@/components/game/tools/ModeContext";
import { MyContextProvider } from "@/components/game/tools/MyContextProvider";
import toast from "react-hot-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

type freind = {
  intraId: string;
  image: string;
  userName: string;
};

const GetFriends = () => {
  const router = useRouter();
  const [freind, setfreind] = useState<freind[]>([]);
  const [me, setMe] = useState<freind>()

  const gamecontext = useContext(MyContext);

  //////////////////////// Invit Friend to play with  ///////////////////////////////

    const handleAccept = (pyload: any) => {
      gamecontext.contextValue.socket.emit('acceptedInvite', pyload);
      router.push('/game');
    };
    
    useEffect(() => {
      gamecontext.contextValue.socket.off('acceptedInvite').on('acceptedInvite', (pyload: string) => {
        toast.success(`${pyload} accepted your invitation , let's play !`)
        router.push('/game');
        });
      },[]);

      const invitToPlay = (friend: freind) => {

        const send = {
          recieverId : friend.intraId,
          senderName: me?.userName,
        }

        const recieve = {
          senderId : me?.intraId, 
          accepterName: friend.userName,
        }

        gamecontext.contextValue.socket.emit('inviteEvent', send , recieve);
      } 
      
    useEffect(() => {
      gamecontext.contextValue.socket.off('inviteEvent').on('inviteEvent', (data : any) => {
        console.log('Im here inside useEffect !', data);
         toast(() => (
          <span>
            <b>{data[0].senderName} invited you to play Pong ! </b>
            <button onClick={() => toast.dismiss()}
            className="border bg-red-500 rounded-ls px-5 py-1"
            >
              Dismiss
            </button>
            <button onClick={() => handleAccept(data[1])}
            className="border bg-green-500 rounded-ls  px-5 py-1"
            >
              Accept
            </button>
          </span>
        ));
      });
    }, []);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const takefreind = async () => {
    try {
      const response = await axios.get("http://localhost:3001/friends", {
        withCredentials: true,
      });
      if (response.status === 200) {
        const newfreind: freind[] = response.data.friends.map((l: any) => ({
            intraId : l.intraId,
            image : l.photo,
            userName : l.userName,
          })
          );
          setfreind(newfreind)
          setMe(response.data.me)
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
    <div className="w-full h-full container ">
      <div className="w-full h-full grid grid-rows-5 place-items-center ">
        <div className="w-full h-full row-start-1 row-span-1 flex items-center justify-center text-[40px] text-center">
          Invite Friends
        </div>
        <div className="w-[400px] h-[300px] row-start-2 row-span-5 relative">
          <div className="w-full h-full rounded-lg border overflow-y-scroll relative flex  flex-col items-center space-y-4">
            {GetFriends()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Freinds;
