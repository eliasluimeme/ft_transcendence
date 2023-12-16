"use client";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";
import axios from "axios";

type Data = {
  image: string;
  statu: string;
  nickNane: string;
  fullName: string;
  rank: string;
  id: string;
};

const InfoProfil = (id: any) => {
  const indice: string = id.id;
  const [data, setData] = useState<Data>({
    image: "",
    statu: "",
    nickNane: "",
    fullName: "",
    rank: "",
    id: "",
  });
  const [fr, setFr] = useState<string>("");
  const [block, setblock] = useState<string>("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/users/profile", {
          withCredentials: true,
          params: {
            user: indice,
          },
        });
        if (response.status === 200) {
          const fetchedData: Data = {
            image: response.data.photo,
            statu: response.data.status,
            nickNane: response.data.userName,
            fullName: response.data.fullName,
            rank: response.data.rank,
            id: response.data.id,
          };
          setData(fetchedData);
          takeFrLogic(fetchedData);
          takeblockLogic (fetchedData);
        } else {
          console.log("Failed to fetch data");
        }
      } catch (error) {
        console.error("An error occurred while fetching user data:", error);
      }
    };

    fetchData();
  }, [indice]);

  const takeFrLogic = async (data: Data) => {
    try {
      const response = await axios.get("http://localhost:3001/friends/friendship", {
        withCredentials: true,
        params: {
          id: data.id,
        },
      });
      if (response.status === 200) {
        if (response.data.status === "NONE")
          setFr("Add friend")
        else setFr(response.data.status);
      } else {
        console.log("Failed to fetch friendship data");
      }
    } catch (error) {
      console.error("An error occurred while fetching friendship data:", error);
    }
  };

  const takeblockLogic = async (data: Data) => {
    try {
      const response = await axios.get("http://localhost:3001/users/blocks", {
        withCredentials: true,
        params: {
          id: data.id,
        },
      });
      if (response.status === 200) {
        if (response.data.block === true)
          setblock("unblock")
        else  setblock("block")
      } else {
        console.log("Failed to fetch friendship data");
      }
    } catch (error) {
      console.error("An error occurred while fetching friendship data:", error);
    }
  };



  const sendFriend = async (id: string) => {
    if (fr === "NONE" || fr === "Add friend") {
      try {
        const response = await axios.get("http://localhost:3001/friends/add", {
          withCredentials: true,
          params: {
            id: id,
          },
        });
        if (response.status === 200) {
          setFr("Unfriend");
        } else {
          console.log("Failed to add friend");
        }
      } catch (error) {
        console.error("An error occurred while adding friend:", error);
      }
    } else if (fr === "Unfriend") {
      try {
        const response = await axios.get("http://localhost:3001/friends/unfriend", {
          withCredentials: true,
          params: {
            id: id,
          },
        });
        if (response.status === 200) {
          setFr("Add friend");
        } else {
          console.log("Failed to reject friend");
        }
      } catch (error) {
        console.error("An error occurred while rejecting friend:", error);
      }
    }
  };
  
  const sendblock = async (id: string) => {
    if (block === "block") {
      try {
        const response = await axios.get("http://localhost:3001/users/block", {
          withCredentials: true,
          params: {
            id: id,
          },
        });
        if (response.status === 200) {
          setblock("unblock")
        } else {
          console.log("Failed to add friend");
        }
      } catch (error) {
        console.error("An error occurred while adding friend:", error);
      }
    } else if (block === "unblock") {
      try {
        const response = await axios.get("http://localhost:3001/users/unblock", {
          withCredentials: true,
          params: {
            id: id,
          },
        });
        if (response.status === 200) {
          setblock("block");
        } else {
          console.log("Failed to reject friend");
        }
      } catch (error) {
        console.error("An error occurred while rejecting friend:", error);
      }
    }
  };

  const ImageStatu: React.FC<{ data: Data }> = ({ data }) => {
    return (
      <div className="w-full h-full flex flex-col items-center space-y-3 justify-center">
        <Avatar className="w-[100px] h-[100px] border-[4px]">
          <AvatarImage src={data.image} alt="User Avatar" />
          <AvatarFallback>profile</AvatarFallback>
        </Avatar>
        <div className="text-[#FF986A] text-[20px]">{data.statu}</div>
      </div>
    );
  };
  
  const Informations: React.FC<{ data: Data }> = ({ data }) => {
    return (
      <div className="w-full h-full grid grid-rows-6 place-content-center">
        <div className="text-[#FF6D7F] row-start-2">{data.nickNane}</div>
        <div className="row-start-3">{data.fullName}</div>
        <div className="flex space-x-2 row-start-4">
          <div>Rank:</div>
          <div className="text-[#F3E322]">{data.rank}</div>
        </div>
        <Link
          className="row-start-5 Leader w-[130px] h-[30px] rounded-full bg-[#FFA961] flex items-center justify-center text-gray-300 hover:text-white ease-in-out duration-300"
          href="/profile/Leader"
        >
          Leader
        </Link>
      </div>
    );
  };
  return (
    <div className="w-full h-full grid grid-cols-12">
      <div className="w-full h-full col-start-1 col-span-4">
        <ImageStatu data={data} />
      </div>
      <div className="w-full h-full col-start-5 flex items-center justify-center">
        <div className="w-[2px] h-[45%] bg-[#445E86] rounded-full bg-opacity-[50%]"></div>
      </div>
      <div className="w-full h-full col-start-6 col-span-6">
        <Informations data={data} />
      </div>
      <div className="w-full h-full col-start-12">
        <div className="w-full h-full grid grid-rows-6">
          <div className="w-full h-full row-start-2 flex items-center ">
              {block === "block" && (
              <div className="w-[75%] h-[50%] rounded-full  flex items-center justify-center bg-[#FFA961] bg-opacity-[50%] text-opacity-[50%] hover:bg-opacity-[100%] ease-in-out duration-300">
                  <HoverCard>
                    <HoverCardTrigger>
                      <button onClick={() => sendFriend(data.id)}>{fr === 'Unfriend' ? '-' : '+'}</button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[180px] h-[40px] flex items-center justify-center">
                      {fr}
                    </HoverCardContent>
                  </HoverCard>
              </div>
              )}
            </div>
            <div className="w-full h-full row-start-3 flex items-center ">
              <div className="w-[75%] h-[50%] rounded-full  flex items-center justify-center bg-[#FFA961] bg-opacity-[50%] text-opacity-[50%] hover:bg-opacity-[100%] ease-in-out duration-300">

             <HoverCard>
                  <HoverCardTrigger>
                    <button onClick={() => sendblock(data.id)}>B</button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-[180px] h-[40px] flex items-center justify-center">
                    {block}
                  </HoverCardContent>
                </HoverCard>
              </div>
              </div>
          </div>
        </div>
      </div>
  );
};

export default InfoProfil;
