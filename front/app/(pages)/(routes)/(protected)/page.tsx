"use client";
import Levels from "@/components/ui/Levels";
import GameHistory from "@/components/ui/GameHistory";
import { useRef, FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";

const Page: FC = () => {
  const data = {
    flag: true,
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
  const freind = true;
  const [searchInput, setSearchInput] = useState("");


  const handleKeyPress = (e : any) => {
    if (e.key === 'Enter') {
      console.log('Search:', searchInput);
      setSearchInput('');
    }
  };
  return (
    <div className="font-alfa-slab h-full grid grid-cols-3 gap-3">
      <div className="bg-[#36393E] col-span-2 rounded-lg">
        <Levels />
      </div>
      {/* ///////////////////////////////////////////
      //////////////searsh bat /////////////////
      /////////////////////////////////////////// */}
      <div className="bg-[#36393E] rounded-lg">
        <div className="flex items-center justify-center mt-[2%] mb-[15%]">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <input
            type="text"
            value={searchInput}
            onKeyPress={handleKeyPress}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-transparent border rounded-full text-[15px] w-[50%] h-[25px] border-gray-500 text-gray-500"
          />
        </div>
        {/* ////////////////////////////////////////////////////////////// */}
        <div className="flex items-center justify-center mt-[4%]">
          <div className=" flex flex-col">
            {data.flag && (
              <div className="flex flex-col items-center">
                <button className="mb-[1%] opacity-[50%] hover:opacity-[100%]">
                  {freind ? "+ Add Freind" : ""}
                </button>
                <Avatar className="border-4 border-[#F4F4F4] lg:w-32 lg:h-32 md:w-25 md:h-25 sm:w-20 sm:h-20 w-12 h-12 mx-auto mb-4">
                  <AvatarImage src={data.image} />
                  <AvatarFallback>rank 2</AvatarFallback>
                </Avatar>
                <div className="text-lg font-bold mb-2 text-[#BBBCBD]">
                  {data.nickname}
                </div>
                <div className="text-gray-500 mb-2 text-[#BBBCBD]">
                  {data.status}
                </div>
                <div className="text-gray-500 mb-4 text-[#BBBCBD]">
                  {data.rank}
                </div>
                <div className="flex space-x-[2%] justify-center">
                  <Image
                    className={`w-[11%] ${
                      data.GoldMedalStatu ? "" : "opacity-50"
                    }`}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
