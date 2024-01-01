"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
type Leader = {
  rank: number;
  image: string;
  name: string;
};

const GetLeader = () => {
  const [leader, setleader] = useState<Leader[]>([
  ]);
  const takeleader = async () => {
    try {
      const response = await axios.get("http://localhost:3001/ladderboard", {
        withCredentials: true,
      });
      if (response.status === 200) {
        const newleader: Leader[] = response.data.map(
          (l: any) => ({
            rank: l.rank,
            image : l.photo,
            name : l.user
          })
          );
          setleader(newleader)
      } else {

      }
    } catch (error) {

    }
  };
  useEffect(() => {
    takeleader();
  }, []);
  return leader;
};
const GetRank = () => {
  const [rank, getRank] = useState("");
  const takerank = async () => {
    try {
      const response = await axios.get("http://localhost:3001/ladderboard/rank", {
        withCredentials: true,
      });
      if (response.status === 200) {
        getRank(response.data.rank)
      } else {

      }
    } catch (error) {

    }
  };
  useEffect(() => {
    takerank();
  }, []);
  return rank;
};
const displayData = (leader: Leader, className: string) => {
  return (
    <div className={className}>
      <div className="flex w-full h-full items-center justify-center">
        <p className="h-full bg-[#C0C5F9] flex items-center justify-center text-[#F3465A] text-[20px] rounded-sm w-[90%]">
          {leader.rank}
        </p>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <Avatar className="w-[90px] h-[90px] border-[4px]">
          <AvatarImage src={leader.image} alt="User Avatar" />
          <AvatarFallback>profile</AvatarFallback>
        </Avatar>
      </div>
      <p className="w-full h-full col-start-3 col-span-4 flex items-center justify-center text-[20px]">
        {leader.name}
      </p>
    </div>
  );
};

const Leaderbord = () => {
  const leaders = GetLeader();
  const rank = GetRank();
  return (
    <div className="w-full h-full grid grid-rows-5 font-Goldman">
      {leaders.map((leader, index) => (
        <div
          key={index}
          className={`w-full h-full flex items-center justify-center`}
        >
          {displayData(
            leader,
            "w-[98%] h-[80%] border rounded-lg grid grid-cols-6 place-content-center"
          )}
        </div>
      ))}
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-[98%] h-[80%] border rounded-lg flex items-center justify-center">
          <div className="flex space-x-2 text-[20px]">
            <div className="text-[#F3465A]">You’re Rank :</div>
            <div>{rank}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderbord;
