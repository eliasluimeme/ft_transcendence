"use client";
import React, { useState, useEffect } from "react";
import WinLose from "@/components/ui/profilecompo/WinLose";
import axios from "axios";
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
const GetAchivment = (indice: string) => {
  const achievementsInitialState: Achievement[] = [
    { description: "", achieved: true },
    { description: "", achieved: false },
    { description: "", achieved: true },
    { description: "", achieved: true },
  ];
  const [achievements, setAchievements] = useState<Achievement[]>(
    achievementsInitialState
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + "users/achievement",
          {
            withCredentials: true,
            params: {
              user: indice,
            },
          }
        );
        if (response.status === 200) {
          const newAchievements: Achievement[] = [
            {
              description: "First achievement",
              achieved: response.data.achievements[0],
            },
            {
              description: "Second achievement",
              achieved: response.data.achievements[1],
            },
            {
              description: "Third achievement",
              achieved: response.data.achievements[2],
            },
            {
              description: "Fourth achievement",
              achieved: response.data.achievements[3],
            },
          ];
          setAchievements(newAchievements);
        } else {

        }
      } catch (error) {

      }
    };

    fetchData(); // Call fetchData only once when the component mounts
  }, [indice]); // Ensure that fetchData runs when indice changes (if needed)

  return achievements;
};
function setAchivement(description: string, achived: boolean, image: string) {
  return (
    <div className="">
      <HoverCard>
        <HoverCardTrigger>
          <div className="w-[80px] h-[80px] relative">
            <Image
              src={image}
              style={{ opacity: achived ? 1 : 0.5 }}
              alt=""
              sizes="(max-width: 600px) 400px,
                (max-width: 1200px) 800px,
                1200px"
              fill
            ></Image>
          </div>
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
  opo1: string;
  result: string;
  opo2: string;
  opo1image: string;
  opo2image: string;
};

const GetMatchHistory = (indice: string): MatchHistory[] => {
  const [matchHistory, setMatchHistory] = useState<MatchHistory[]>([
    // Your initial state remains the same
  ]);

  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL +"users/matchs", {
        withCredentials: true,
        params: {
          user: indice,
        },
      });

      if (response.status === 200) {
        const newMatchHistory: MatchHistory[] = response.data.map(
          (match: any) => ({
            opo1: match.winner.userName,
            opo2: match.looser.userName,
            opo1image: match.winner.photo,
            opo2image: match.looser.photo,
            result: match.score,
          })
        );

        setMatchHistory(newMatchHistory);
      } else {

      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return matchHistory;
};

const GameInfo = (id: any) => {
  const indice: string = id.id;
  const achievements = GetAchivment(indice);
  const matchHistory = GetMatchHistory(indice);
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
            <div className="w-full h-[500px] row-start-0 row-span-6 col-start-2 col-span-9 overflow-auto border-red-700">
            {matchHistory.map((historyItem, index) => (
              <WinLose
                key={index}
                className=""
                // className={`w-full h-full row-start-${
                //   index + 1
                // } col-start-2 col-span-9 `}
                opo1={historyItem.opo1}
                opo2={historyItem.opo2}
                result={historyItem.result}
                opo1image={historyItem.opo1image}
                opo2image={historyItem.opo2image}
              />
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
