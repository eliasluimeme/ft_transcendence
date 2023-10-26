import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const Ladderfounder = () => {
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
      name: "chi we7da",
      rank: "5",
      image:
        "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    },
  ];

  const rankOneleader = LEADER_DATA.find((nami) => nami.rank === "1");
  const rankTooleader = LEADER_DATA.find((nami) => nami.rank === "2");
  const rankTreeleader = LEADER_DATA.find((nami) => nami.rank === "3");
  return (
    <div className="p-5">
      <div className="flex items-center justify-around">
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
    </div>
  );
};

export default Ladderfounder;
