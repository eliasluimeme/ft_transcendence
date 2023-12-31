"use client"
import React, { useContext } from "react";
import Image from "next/image";
import { ModeContext } from "@/components/game/tools/Contexts";
import { useRouter } from "next/navigation";

const Random = (props:any) => {
  const modectx = useContext(ModeContext);
  const router = useRouter();
  const newRandomGame = () => {
    modectx.updateContextValue("random");
    router.push("/game/board");
  }
  return (
    <div className="grid grid-cols-2 w-full h-full ">
      <div className="col-start-1 flex flex-col items-center justify-center">
        <div className="text-[30px] text-[#F77B3F]">Random</div>
        <div>Online Game</div>
        <button onClick={newRandomGame} className="border w-[40%] h-[20%] rounded-lg bg-[#EDF0F4] text-[#3B2D59] shadow-sm shadow-white hover:text-opacity-70">
          Play
        </button>
      </div>
      <div className="col-start-2 relative w-full h-full flex items-center justify-center">
        <div className="col-start-2 relative w-[90%] h-[90%] rounded-lg">
          <Image
            className="rounded-lg"
            src="https://cdn.dribbble.com/users/648290/screenshots/3944891/media/4c6b4e878544bbfbd55a4d200f061db7.gif"
            alt=""
            sizes="(max-width: 600px) 400px,
                (max-width: 1200px) 800px,
                1200px"
            fill
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default Random;
