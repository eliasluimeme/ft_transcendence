import React from "react";
import Image from "next/image";
import Level from "./level";
import { useTransition, useState } from "react";

export default function Achievements() {
  const [tab, setTab] = useState<string>("Achievements");
  const [isPending, startTransition] = useTransition();

  const Achiv = [
    {
      name: "GoldMedal",
      path: "/Achivements/GoldMedal.svg",
      content: (
        <div className="flex">
          <Image
            className="w-[25%]"
            src="/Achivements/GoldMedal.svg"
            alt=""
            width={24}
            height={24}
          />
          <div className="">
            <div className="mb-[2%] text-[#7289DA]">Untouchable :</div>
            <div className="mb-[3%] lg:text-lg md:text-[15px] text-[10px]">
              Win 10 consecutive matches without losing a single game, asserting
              your position as the unbeatable ping pong champion.
            </div>
            <div>
              <div className="text-[#7289DA]">Status :</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "SilverMedal",
      path: "/Achivements/SilverMedal.svg",
      content: (
        <div className="flex">
          <Image
            className="w-[25%]"
            src="/Achivements/SilverMedal.svg"
            alt=""
            width={24}
            height={24}
          />
          <div className="">
            <div className="mb-[2%] text-[#7289DA]">Masterful Blocker:</div>
            <div className="mb-[3%] lg:text-lg md:text-[15px] text-[10px]">
              Successfully block 20 smashes from your opponent, demonstrating
              impeccable defensive skills and lightning-fast reflexes.
            </div>
            <div>
              <div className="text-[#7289DA]">Status :</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "BronzeMedal",
      path: "/Achivements/BronzeMedal.svg",
      content: (
        <div className="flex">
          <Image
            className="w-[25%]"
            src="Achivements/BronzeMedal.svg"
            alt=""
            width={24}
            height={24}
          />
          <div className="">
            <div className="mb-[2%] text-[#7289DA]">Ping Pong Marathoner :</div>
            <div className="mb-[3%] lg:text-lg md:text-[15px] text-[10px]">
              Play for a total of 1 hours in a single gaming session, proving
              your dedication and stamina to the sport.
            </div>
            <div>
              <div className="text-[#7289DA]">Status :</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Award",
      path: "/Achivements/Award.svg",
      content: (
        <div className="flex">
          <Image
            className="w-[25%]"
            src="/Achivements/Award.svg"
            alt=""
            width={24}
            height={24}
          />
          <div className="">
            <div className="mb-[2%] text-[#7289DA]">Quick Learner :</div>
            <div className="mb-[3%] lg:text-lg md:text-[15px] text-[10px]">
              Score your first point within the first 10 minutes of playing the
              game, demonstrating your fast adaptation to the gameplay
              mechanics.{" "}
            </div>
            <div>
              <div className="text-[#7289DA]">Status :</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "TrophyCup",
      path: "/Achivements/TrophyCup.svg",
      content: (
        <div className="flex">
          <Image
            className="w-[25%]"
            src="/Achivements/TrophyCup.svg"
            alt=""
            width={24}
            height={24}
          />
          <div className="">
            <div className="mb-[2%] text-[#7289DA]">Swift Swiper</div>
            <div className="mb-[3%] lg:text-lg md:text-[15px] text-[10px]">
              Win a game with a score of 11-0, showcasing dominance and quick
              reflexes that leave your opponent stunned.
            </div>
            <div>
              <div className="text-[#7289DA]">Status :</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleTapChange = (id: string) => {
    startTransition(() => {
      setTab(id);
    });
  };

  return (
    
    <div>
      <div className="flex  items-center justify-around mt-[10%]">
        {Achiv.map((achievement, index) => (
          <Level
            className="opacity-60 hover:opacity-[100%] transition-opacity"
            key={index}
            selectTab={() => handleTapChange(achievement.name)}
            active={tab === achievement.name}
          >
            <Image
              className={`lg:w-[70px] w-[40px]`}
              src={achievement.path}
              alt=""
              width={24}
              height={24}
            />
          </Level>
        ))}
      </div>
      <div className="mb-[10%] border-b-2 mr-[10%] ml-[10%] rounded-full bg-[#D9D9D945] opacity-[70%]"></div>
      <div className="ml-[5%] mb-[5%] sm:text-sm lg:text-xl">
        {Achiv.find((t) => t.name === tab)?.content}
      </div>
    </div>
  );
}
