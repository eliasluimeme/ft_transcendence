"use client";
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type Data = {
  image: string;
  statu: string;
  nickNane: string;
  fullName: string;
  rank: string;
};

const getInitialData = (): Data => {
  return {
    image:
      "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    statu: "In game...",
    nickNane: "ael-kouc",
    fullName: "Achraf El Kouch",
    rank: "#3",
  };
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
      <button className="row-start-5 Leader w-[130px] h-[30px] rounded-full bg-[#FFA961] flex items-center justify-center text-gray-300 hover:text-white ease-in-out duration-300">
        Leader
      </button>
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
            {friend === false && (
              <div className="w-[75%] h-[50%] rounded-full  flex items-center justify-center bg-[#FFA961] bg-opacity-[50%] text-opacity-[50%] hover:bg-opacity-[100%] ease-in-out duration-300">
                <HoverCard>
                  <HoverCardTrigger>
                    <button onClick={() => sendFriend(true)}>+</button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-[180px] h-[40px] flex items-center justify-center">
                    Add friend
                  </HoverCardContent>
                </HoverCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoProfil;
