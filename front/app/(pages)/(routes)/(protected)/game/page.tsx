import React, {useEffect, useRef, useContext} from 'react'
import "@/app/(pages)/(routes)/(protected)/game/style.css";
import "@/components/ui/CSS/game.css";
import Random from "@/components/ui/gamecompo/Random";
import Freinds from "@/components/ui/gamecompo/Freinds";
import Bot from "@/components/ui/gamecompo/Bot";
import Map from "@/components/ui/gamecompo/Map";

const page = () => {
  return (
    <div className="w-full h-full font-Goldman game-background rounded-lg">
      <div className="w-full h-full rounded-lg grid grid-container place-items-center">
        <div className=" w-[98%] h-[98%] border rounded-lg take">
          <div className="w-full h-full grid grid-cols-6 grid-rows-6 place-items-center">
            <div className="row-start-1 col-span-2 col-start-1 row-span-6 rounded-lg border w-[94%] h-[94%] ">
              <Freinds />
            </div>
            <div className="w-[98%] h-[82%] border rounded-lg col-start-3 col-span-4 row-start-1 row-span-2">
              <Random></Random>
            </div>
            <div className="w-[97%] h-[91%] border rounded-lg col-start-3 col-span-3 row-start-3 row-span-4">
              <Bot></Bot>
            </div>
            <div className="w-[94%] h-[91%] border rounded-lg col-start-6  row-start-3 row-span-4">
              <Map></Map>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page