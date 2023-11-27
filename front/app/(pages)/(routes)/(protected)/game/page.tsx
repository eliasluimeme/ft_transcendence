"use client";

import React from "react";
import Image from "next/image";
import "@/components/ui/CSS/game.css";
import { useState, useMemo } from "react";
export default function page() {
  const [settingsOpen, setSettingsOpen] = useState(true);
  const handleSettingsClick = () => {
    setSettingsOpen((prevSettingsOpen) => !prevSettingsOpen);
  };

  return (
    <div className="w-full h-full font-alfa-slab game-background rounded-lg">
      {!settingsOpen ? (
        <div className="">
          <div className="w-full grid grid-cols-4 mr-1">
            <button
              onClick={handleSettingsClick}
              className="mt-[2%] col-start-4 flex space-x-3 w-[20%]"
            >
              <Image
                src="./🦆 icon _cog_.svg"
                width={30}
                height={30}
                alt="settings of game"
                className=" rotate_01"
              ></Image>
              <div className="sm:text-md md:text-lg lg:text-lg text-xl">
                SETTINGS
              </div>
            </button>
          </div>
          <div className="flex items-center justify-center mt-[12%]">
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/game/landinggame.jpg"
                width={500}
                height={500}
                alt="settings of game"
                className="rounded-lg drop-shadow-2xl"
              />
              <div className="flex space-x-2 text-xl mt-4">
                <button>
                  <Image
                    src="/game/play.svg"
                    width={35}
                    height={35}
                    alt="Play"
                    className="drop-shadow-2xl opacity-[50%] hover:opacity-[100%]"
                  />
                </button>
                <button className="drop-shadow-2xl">PLAY</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full ">
          <div className="h-full grid grid-cols-2 grid-rows-2">
            <div className="flex items-center justify-center col-start-2 row-start-1 space-x-2">
              <Image
                src="./game/typeGame.svg"
                width={100}
                height={100}
                alt="settings of game"
                className="row-start-1"
              ></Image>
              <div className="w-[4px] h-[23%] rounded-full bg-[#1E2124] opacity-[50%]"></div>
              <div className="space-y-3">
                <div>
                  <button className="">With Bot</button>
                </div>
                <div>
                  <button className="">Enligne Game</button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center col-start-1 row-start-1 space-x-2">
              <Image
                src="./game/typeMap.svg"
                width={100}
                height={100}
                alt="settings of game"
                className=""
              ></Image>
              <div className="w-[4px] h-[23%] rounded-full bg-[#1E2124] opacity-[50%]"></div>
              <div className="space-y-3">
                <div>
                  <button>Map One</button>
                </div>
                <div>
                  <button>Map Twoo</button>
                </div>
                <div>
                  <button>Map Three</button>
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleSettingsClick}>back</button>
        </div>
      )}
    </div>
  );
}
