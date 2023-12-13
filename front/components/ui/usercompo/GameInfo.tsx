'use client'
import React, { useState, useEffect } from "react";
import WinLose from "./WinLose";
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
const getAchivment = (indice : string) => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    { description: "", achieved: true },
    { description: "", achieved: false },
    { description: "", achieved: true },
    { description: "", achieved: true },
  ]);
  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:3001/users/search", 
      { indice },
      {
        withCredentials: true,
      });
      if (response.status === 201) {
        const newAchievements: Achievement[] = [
          { description: "First achievement", achieved: response.data.achievements[0]},
          { description: "Second achievement", achieved: response.data.achievements[1]},
          { description: "Third achievement", achieved: response.data.achievements[2] },
          { description: "Fourth achievement", achieved: response.data.achievements[3]},
        ];
        console.log(newAchievements);
        setAchievements(newAchievements);
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
  opo2 : string;
  opo1image : string
  opo2image : string
};

const getMatchHistory = (indice : string) : MatchHistory[] => {
  const [matchHistory, setmatchHistory] = useState<MatchHistory[]>([
    { opo1: "",opo2: "",opo2image: "",opo1image: "", result: ""},
    { opo1: "",opo2: "",opo2image: "",opo1image: "", result: ""},
    { opo1: "",opo2: "",opo2image: "",opo1image: "", result: ""},
    { opo1: "",opo2: "",opo2image: "",opo1image: "", result: ""},
    { opo1: "",opo2: "",opo2image: "",opo1image: "", result: ""},
    { opo1: "",opo2: "",opo2image: "",opo1image: "", result: ""},
  ]);
  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:3001/users/search", 
      { indice },
      {
        withCredentials: true,
      });console.log("zab");
      if (response.status === 201) {
        const newMatchHistory: MatchHistory[] = [
          { opo1: response.data.matchs[0].player1.userName,opo2: response.data.matchs[0].player2.userName,opo2image: response.data.matchs[0].player1.photo,   opo1image: response.data.matchs[0].player2.photo, result:response.data.matchs[0].score},
          { opo1: response.data.matchs[1].player1.userName,opo2: response.data.matchs[1].player2.userName,opo2image: response.data.matchs[1].player1.photo,   opo1image: response.data.matchs[1].player2.photo, result:response.data.matchs[1].score},
          { opo1: response.data.matchs[2].player1.userName,opo2: response.data.matchs[2].player2.userName,opo2image: response.data.matchs[2].player1.photo,   opo1image: response.data.matchs[2].player2.photo, result:response.data.matchs[2].score},
          { opo1: response.data.matchs[3].player1.userName,opo2: response.data.matchs[3].player2.userName,opo2image: response.data.matchs[3].player1.photo,   opo1image: response.data.matchs[3].player2.photo, result:response.data.matchs[3].score},
          { opo1: response.data.matchs[4].player1.userName,opo2: response.data.matchs[4].player2.userName,opo2image: response.data.matchs[4].player1.photo,   opo1image: response.data.matchs[4].player2.photo, result:response.data.matchs[4].score},
          { opo1: response.data.matchs[5].player1.userName,opo2: response.data.matchs[5].player2.userName,opo2image: response.data.matchs[5].player1.photo,   opo1image: response.data.matchs[5].player2.photo, result:response.data.matchs[5].score},
        ];
        
        console.log("dkhol");
        setmatchHistory(newMatchHistory);
        console.log(matchHistory);
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
  return matchHistory;
};

const GameInfo = (id : any) => {

  console.log("l9laoui")
  const indice : string = id;
  const achievements = getAchivment(indice);
  const matchHistory = getMatchHistory(indice);
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
            {/* {matchHistory.map((historyItem, index) => (
               <WinLose
                 key={index}
                 className={`w-full h-full row-start-${
                   index + 1
                 } col-start-2 col-span-9`}
                 wl={historyItem.statu}
                 opo={historyItem.opo}
               />
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
