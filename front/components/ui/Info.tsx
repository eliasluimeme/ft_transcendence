// Info.tsx
import React, { useState } from "react";
import Modal from "react-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

import GameHistory from "./GameHistory"; // Import the GameHistory component

const Info: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#36393E",
      border: "none",
    },
  };

  const data = {
    image:
      "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    nickname: "ael-kouc",
    status: "... in game",
    rank: "#30",
    GoldMedalImage: "/Achivements/GoldMedal.svg",
    GoldMedalStatu: false,
    SilverMedalImage: "/Achivements/SilverMedal.svg",
    SilverMedalStatu: true,
    BronzeMedalImage: "/Achivements/BronzeMedal.svg",
    BronzeMedalStatu: true,
    AwardImage: "/Achivements/Award.svg",
    AwardStatu: false,
    TrophyCupImage: "/Achivements/TrophyCup.svg",
    TrophyCupStatu: true,
    match1: {
      image:
      "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
      result: "11 - 0",
    },
    match2: {
      image:
      "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
      result: "11 - 3",
    },
    match3: {
      image:
      "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
      result: "11 - 0",
    },
    match4: {
      image:
      "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
      result: "11 - 0",
    },
  };

  return (
    <div className="">
      <button onClick={() => setIsOpen(true)}>
        <Avatar className="cursor-pointer">
          <AvatarImage src={data.image} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </button>

      <Modal
        className="flex items-center justify-center bg-[#36393E] w-[30%] h-[75%] text-center font-alfa-slab rounded-lg"
        style={customStyles}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="User Info Modal"
      >
        <div className="">
          <Avatar className="border-4 border-[#F4F4F4] lg:w-32 lg:h-32 md:w-25 md:h-25 sm:w-20 sm:h-20 w-12 h-12 mx-auto mb-4">
            <AvatarImage src={data.image} />
            <AvatarFallback>rank 2</AvatarFallback>
          </Avatar>
          <div className="text-lg font-bold mb-2 text-[#BBBCBD]">
            {data.nickname}
          </div>
          <div className="text-gray-500 mb-2 text-[#BBBCBD]">{data.status}</div>
          <div className="text-gray-500 mb-4 text-[#BBBCBD]">{data.rank}</div>
          <div className="flex space-x-[2%] justify-center">
            <Image
              className={`w-[11%] ${data.GoldMedalStatu ? "" : "opacity-50"}`}
              src={data.GoldMedalImage}
              alt=""
              width={24}
              height={24}
            />
            <Image
              className={`w-[11%] h-[11%] ${
                data.SilverMedalStatu ? "" : "opacity-50"
              }`}
              src={data.SilverMedalImage}
              alt=""
              width={24}
              height={24}
            />
            <Image
              className={`w-[11%] h-[11%] ${
                data.BronzeMedalStatu ? "" : "opacity-50"
              }`}
              src={data.BronzeMedalImage}
              alt=""
              width={24}
              height={24}
            />
            <Image
              className={`w-[11%] h-[11%] ${
                data.AwardStatu ? "" : "opacity-50"
              }`}
              src={data.AwardImage}
              alt=""
              width={24}
              height={24}
            />
            <Image
              className={`w-[11%] h-[11%] ${
                data.TrophyCupStatu ? "" : "opacity-50"
              }`}
              src={data.TrophyCupImage}
              alt=""
              width={24}
              height={24}
            />
          </div>
          <div className="px-4 py-[0.3%] bg-[#BBBCBD] text-[#36393E] rounded-md bg-opacity-[50%]"></div>
          <div className="text-[#1E2124] mt-[2%] flex flex-col">
            <div className="flex items-center justify-center space-x-[4%]">
              <div className=" w-[50%] flex items-center justify-around bg-[#BBBCBD] p-[1%] px-[3%] rounded-lg ">
                <Avatar className="">
                  <AvatarImage src={data.image} />
                  <AvatarFallback>rank 2</AvatarFallback>
                </Avatar>
                <div className="]">{data.match1.result}</div>
                <Avatar className="">
                  <AvatarImage src={data.match1.image} />
                  <AvatarFallback>rank 2</AvatarFallback>
                </Avatar>
              </div>
              <div className=" w-[50%] flex items-center justify-around bg-[#BBBCBD] p-[1%] px-[3%] rounded-lg ">
                <Avatar className="">
                  <AvatarImage src={data.image} />
                  <AvatarFallback>rank 2</AvatarFallback>
                </Avatar>
                <div>{data.match2.result}</div>
                <Avatar className="">
                  <AvatarImage src={data.match2.image} />
                  <AvatarFallback>rank 2</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="flex mt-[3%] items-center justify-center space-x-[4%]">
              <div className=" w-[50%] flex items-center justify-around bg-[#BBBCBD] p-[1%] px-[3%] rounded-lg ">
                <Avatar className="">
                  <AvatarImage src={data.image} />
                  <AvatarFallback>rank 2</AvatarFallback>
                </Avatar>
                <div className="]">{data.match3.result}</div>
                <Avatar className="">
                  <AvatarImage src={data.match3.image} />
                  <AvatarFallback>rank 2</AvatarFallback>
                </Avatar>
              </div>
              <div className=" w-[50%] flex items-center justify-around bg-[#BBBCBD] p-[1%] px-[3%] rounded-lg ">
                <Avatar className="">
                  <AvatarImage src={data.image} />
                  <AvatarFallback>rank 2</AvatarFallback>
                </Avatar>
                <div>{data.match4.result}</div>
                <Avatar className="">
                  <AvatarImage src={data.match4.image} />
                  <AvatarFallback>rank 2</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)}></button>
      </Modal>
    </div>
  );
};

export default Info;
