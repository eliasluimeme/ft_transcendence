import React from "react";
import "@/app/(pages)/(routes)/(protected)/game/style.css";
import InfoProfil from "@/components/ui/profilecompo/InfoProfil";
import Image from "next/image";
import GameInfo from "@/components/ui/profilecompo/GameInfo";
import { Toaster } from "react-hot-toast";
const page = () => {
  return (
    <div className="w-full h-full bg-[#36393E] rounded-lg font-Goldman">
      <div className="w-full h-full rounded-lg grid grid-container place-items-center">
        <div className=" w-[98%] h-[98%] border rounded-lg take">
          <div className="w-full h-full grid grid-cols-12 grid-rows-2 place-items-center">
            <div className="w-[96%] h-[94%] info rounded-lg row-start-1 col-start-1 col-span-5 place-content-center">
              <InfoProfil></InfoProfil>
            </div>
            <div className="relative w-[96%] h-[94%] rounded-lg row-start-2 col-start-1 col-span-5">
              <Image
                className="rounded-lg shadow-shadoww"
                src="/profile/ping.svg"
                alt=""
                sizes="(max-width: 600px) 400px,
                (max-width: 1200px) 800px,
                1200px"
                fill
              ></Image>
            </div>
            <div className="w-[97%] h-[97%] border rounded-lg row-start-1 row-span-2 col-start-6 col-span-7">
              <GameInfo />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default page;
