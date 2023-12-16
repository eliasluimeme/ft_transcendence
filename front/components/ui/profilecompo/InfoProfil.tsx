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
};

const getInitialData = (): Data => {
  const [profileInfo, setProfileInfo] = useState<Data>({
      image:"",
      statu:"",
      nickNane:"",
      fullName:"",
      rank:"",
    }
  )
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/profile", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setProfileInfo({
          image: response.data.photo,
          statu: response.data.status,
          nickNane: response.data.userName,
          fullName: response.data.fullName,
          rank: response.data.rank,
        });
      } else {
        console.log("failed to fetchdata");
      }
    } catch (error) {
      console.error("An error occurred while fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return profileInfo;
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

const InfoProfil = () => {
  const data = getInitialData();
  const [friend, sendFriend] = useState(false);

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoProfil;
