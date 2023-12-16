import React from "react";
import WinLose from "./WinLose";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
////////////////////////////////////////////////////////////
////////////////display achivements/////////////////////////
////////////////////////////////////////////////////////////
type Achievement = {
  description: string;
  achieved: boolean;
};
const getAchivment = () => {
  const achievements: Achievement[] = [
    { description: "Achievement 1", achieved: true },
    { description: "Achievement 2", achieved: false },
    { description: "Achievement 3", achieved: true },
    { description: "Achievement 3", achieved: true },
  ];
  return achievements;
};
function setAchivement(description: string, achived: boolean, image: string) {
  return (
    <div className="">
      <HoverCard>
        <HoverCardTrigger>
          <Image
            src={image}
            style={{ opacity: achived ? 1 : 0.5 }}
            alt=""
            width={80}
            height={80}
          ></Image>
        </HoverCardTrigger>
        <HoverCardContent className="w-[180px] h-[40px] flex items-center justify-center">
          {description}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

const Informations: React.FC<{ achievement: Achievement[] }> = ({
  achievement,
}) => {
  return (
    <div className="w-full h-full space-x-6 flex items-center justify-around space">
      <div>
        {setAchivement(
          achievement[0].description,
          achievement[0].achieved,
          "/Achivements/Award.svg"
        )}
      </div>
      <div>
        {setAchivement(
          achievement[1].description,
          achievement[1].achieved,
          "/Achivements/BronzeMedal.svg"
        )}
      </div>
      <div>
        {setAchivement(
          achievement[2].description,
          achievement[2].achieved,
          "/Achivements/GoldMedal.svg"
        )}
      </div>
      <div>
        {setAchivement(
          achievement[3].description,
          achievement[3].achieved,
          "/Achivements/SilverMedal.svg"
        )}
      </div>
    </div>
  );
};
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
///////////////////////win and loses /////////////////////////
//////////////////////////////////////////////////////////////
type MatchHistory = {
  opo: string;
  statu: boolean;
};

const getMatchHistory = () => {
  const matchHistory: MatchHistory[] = [
    { opo: "ael-kouc", statu: true },
    { opo: "ael-kouc", statu: false },
    { opo: "ael-kouc", statu: true },
    { opo: "ael-kouc", statu: true },
    { opo: "ael-kouc", statu: true },
    { opo: "ael-kouc", statu: true },
  ];
  return matchHistory;
};

const GameInfo: React.FC = () => {
  const achievements = getAchivment();
  const matchHistory = getMatchHistory();
  return (
    <div className="w-full h-full">
      <div className="w-full h-full grid grid-rows-3">
        <div className="w-full h-full row-start-1 flex items-center justify-center">
          <div className="w-[90%] h-[75%] rounded-[20px] shadow-shadoww">
            <Informations achievement={achievements} />
          </div>
        </div>
        <div className="w-full h-full row-start-2 row-span-2">
          <div className="w-full h-full grid grid-rows-6 place-content-center grid-cols-10">
            <div className="row-start-1 row-span-6 col-start-1 w-full h-full flex items-center justify-center ">
              <div className="w-[2px] h-[80%] bg-[#445E86] rounded-full"></div>
            </div>
            {matchHistory.map((historyItem, index) => (
              <WinLose
                key={index}
                className={`w-full h-full row-start-${
                  index + 1
                } col-start-2 col-span-9`}
                wl={historyItem.statu}
                opo={historyItem.opo}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
