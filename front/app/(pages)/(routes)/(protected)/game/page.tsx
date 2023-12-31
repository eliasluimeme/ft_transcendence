import React from 'react'
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
        <div className="w-[98%] h-[98%] rounded-lg take">
          <div className="w-full h-full flex gap-2 flex-col md:flex-row">
            <div className="border rounded-lg">
              <Freinds />
            </div>
            <div className='flex flex-col flex-1 gap-2'>
              <div className="border rounded-lg flex-1">
                <Random />
              </div>
              <div className="border rounded-lg flex-1">
                <Bot />
              </div>
            </div>
            {/* <div className="w-[94%] h-[91%] border rounded-lg col-start-6  row-start-3 row-span-4">
              <Map></Map>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page