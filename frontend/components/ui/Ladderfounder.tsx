import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import "@/components/ui/CSS/style.css";

const Ladderfounder: React.FC = () => {
  const LEADER_DATA = [
    {
      name: "achraf",
      rank: "1",
      image:
        "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    },
    {
      name: "ael-bach",
      rank: "2",
      image:
        "https://cdn.intra.42.fr/users/87010436d31461ed4f8d12b63f3a92ea/ael-bach.jpg",
    },
    {
      name: "iliass",
      rank: "3",
      image:
        "https://cdn.intra.42.fr/users/94e3a610cef9c110ce571ad230ecfe3e/iakry.jpg",
    },
    {
      name: "chi wa7ed",
      rank: "4",
      image:
        "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    },
    {
      name: "chi we7daaaaaaaaaa",
      rank: "5",
      image:
        "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    },
    {
      name: "chi we7da",
      rank: "6",
      image:
        "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    },
    {
      name: "chi we7da",
      rank: "7",
      image:
        "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    },
    {
      name: "chi we7da",
      rank: "8",
      image:
        "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    },
    {
      name: "chi we7da",
      rank: "9",
      image:
        "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    },
    {
      name: "chi we7da",
      rank: "10",
      image:
        "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    },
  ];
  const rankOneleader = LEADER_DATA.find((nami) => nami.rank === "1");
  const rankTooleader = LEADER_DATA.find((nami) => nami.rank === "2");
  const rankTreeleader = LEADER_DATA.find((nami) => nami.rank === "3");
  return (
    <div className="flex flex-col text-[13px]">
      <div className="flex items-center justify-around bg-[#424549] shadow-md mx-[10%] my-[5%] rounded-xl">
        <div className="flex pt-10 items-center justify-center">
          {rankTooleader ? (
            <>
              <div className="flex flex-col items-center ">
                <Avatar className="border-4 border-[#F4F4F4] lg:w-32 lg:h-32 md:w-25 md:h-25 sm:w-20 sm:h-20 w-12 h-12">
                  <AvatarImage src={rankTooleader.image} />
                  <AvatarFallback>rank 2</AvatarFallback>
                </Avatar>
                <div>{rankTooleader.name}</div>
              </div>
            </>
          ) : (
            <p>no level 2 here</p>
          )}
        </div>
        <div className="">
          {rankOneleader ? (
            <>
              <div className="flex pb-10 flex-col items-center justify-center">
                <Image
                  className=" w-[40%] h-[40%]"
                  src="/Leadder/Crown.svg"
                  alt=""
                  width={24}
                  height={24}
                />
                <Avatar className="border-4 border-[#FFCA28] lg:w-32 lg:h-32 md:w-25 md:h-25 sm:w-20 sm:h-20 w-12 h-12">
                  <AvatarImage src={rankOneleader.image} />
                  <AvatarFallback>rank 1</AvatarFallback>
                </Avatar>
                <div>{rankOneleader.name}</div>
              </div>
            </>
          ) : (
            <p>no level 1 here</p>
          )}
        </div>
        <div className="pt-10">
          {rankTreeleader ? (
            <>
              <div className="flex flex-col items-center ">
                <Avatar className="border-4 border-[#FF8228] lg:w-32 lg:h-32 md:w-25 md:h-25 sm:w-20 sm:h-20 w-12 h-12">
                  <AvatarImage src={rankTreeleader.image} />
                  <AvatarFallback>rank 2</AvatarFallback>
                </Avatar>
                <div>{rankTreeleader.name}</div>
              </div>
            </>
          ) : (
            <p>no level 3 here</p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-around  overflow-y-scroll custom-max-height  scroll-smooth mr-[20%]">
        {LEADER_DATA.slice(3).map((data, index) => (
          <div key={index} className="flex mb-[3%] space-x-2">
            <Avatar className="border">
              <AvatarImage src={data.image} />
              <AvatarFallback>Rank {data.rank}</AvatarFallback>
            </Avatar>
            <div>{data.name}</div>
            <div>#{data.rank}</div>
          </div>
        ))}
      </div>
      <div className="flex itemes-center justify-center mt-[3%]">YOUR RANK : #50</div>
    </div>
  );
};

export default Ladderfounder;
