"use client"
import React from "react";
import "@/app/(pages)/(routes)/(protected)/game/style.css";
import InfoProfil from "@/components/ui/usercompo/InfoProfil";
import Image from "next/image";
import GameInfo from "@/components/ui/usercompo/GameInfo";
import { useSearchParams } from 'next/navigation';


const page = () => {
    const searchParams = useSearchParams()
     
    const search  = searchParams.get('search')
    // console.log("search: ", search)

    return (
        <div className="w-full h-full bg-[#36393E] rounded-lg font-Goldman">
          <div className="w-full h-full rounded-lg grid grid-container place-items-center">
            <div className=" w-[98%] h-[98%] border rounded-lg take">
              <div className="w-full h-full grid grid-cols-12 grid-rows-2 place-items-center">
                <div className="w-[96%] h-[94%] info rounded-lg row-start-1 col-start-1 col-span-5 place-content-center">
                  <InfoProfil id = {search} ></InfoProfil>
                </div>
                <div className="relative w-[96%] h-[94%] rounded-lg row-start-2 col-start-1 col-span-5">
                  <Image
                    className="rounded-lg shadow-shadoww"
                    src="https://cdn.dribbble.com/users/944284/screenshots/3041046/media/1d0fd0b5c9b20de91501818723bd05a8.png?resize=800x600&vertical=center"
                    alt=""
                    sizes="(max-width: 600px) 400px,
                    (max-width: 1200px) 800px,
                    1200px"
                    fill
                  ></Image>
                </div>
                <div className="w-[97%] h-[97%] border rounded-lg row-start-1 row-span-2 col-start-6 col-span-7">
                  <GameInfo id = {search} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
};

export default page;