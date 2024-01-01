'use client';

import Image from "next/image";
import "@/components/ui/CSS/font.css";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import JoinRoom from "./JoinRoom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CreateRoom from "./CreateRoom";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSearchParams } from 'next/navigation'

type Freind = {
  id: string;
  image: string;
  name: string;
};

function SideBar() {
  const [update, setupdate] = useState<number>(0);
  const searchParams = useSearchParams()
  const currentConversationId = searchParams.get('id')
  const GetFriends = () => {
    const router = useRouter();

    const [friend, setFriends] = useState<Freind[]>([]);

    useEffect(() => {
      const fetchFriends = async () => {
        try {
          const response = await axios.get(
            `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/conversations`,
            {
              withCredentials: true,
            }
          );
          if (response.status === 200) {
            const newFriends: Freind[] = response.data.map((l: any) => ({
              id: l.convId,
              image:
                l.photo ??
                "https://t4.ftcdn.net/jpg/03/78/40/51/360_F_378405187_PyVLw51NVo3KltNlhUOpKfULdkUOUn7j.jpg",
              name: l.name,
            }));
            setFriends(newFriends);
          } else {
          }
        } catch (error) {
        }
      };

      fetchFriends();
    }, [update]);

    const handleFriendClick = (friendId: string) => {
      setupdate(update + 1);
      router.push("/chat/chatconv?id=" + friendId);
    };

    return Object.values(friend).map((friend, index) => (
      <button
        className={cn("text-white py-3 px-4 hover:bg-[#f87b3f] flex space-x-4 items-center rounded-lg transition-colors",
          {
            "bg-[#f87b3f]": currentConversationId == friend.id,
          }
        )}
        key={index}
        onClick={() => handleFriendClick(friend.id)}
      >
        <Avatar className="w-[40px] h-[40px]">
          <AvatarImage src={friend.image} alt="User Avatar" />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <span className="flex-1 text-left truncate capitalize">{friend.name}</span>
      </button>
    ));
  };

  return (
    <div className=" w-full h-full rounded-lg border">
      <div className="w-full h-full ">
        <div className="w-full h-full flex flex-col">
          <div className="w-full justify-center col-start-11 col-span-2 mt-4 pl-6">
            <div className="">
              <Popover>
                <PopoverTrigger className="p-4 border border-[#656565] rounded-lg hover:bg-[#D9D9D9] hover:bg-opacity-[10%]">
                  <Image
                    src="/🦆 icon _cog_.svg"
                    alt=""
                    width={15}
                    height={15}
                    className="w-[15px] h-[15px]"
                    sizes="(max-width: 600px) 400px,
                (max-width: 1200px) 800px,
                1200px"
                  />
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
          <div className="mt-[20px] overflow-y-auto flex flex-col gap-2 mx-6">
            {GetFriends()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
