import React from "react";
import "@/app/(pages)/(routes)/(protected)/game/style.css";
import Image from "next/image";
import Leaderbord from "@/components/ui/profilecompo/Leaderbord";
const page = () => {
  return (
    <div className="w-full h-full bg-[#36393E] rounded-lg">
      <div className="w-full h-full rounded-lg grid grid-container place-items-center ">
        <div className="w-[98%] h-[98%] border rounded-lg take">
          <div className="w-full h-full grid grid-cols-11">
            <div className="w-full h-full col-start-1 col-span-7">
              <Leaderbord />
            </div>
            <div className="w-full h-full flex items-center justify-center col-start-8 col-span-4">
              <div className="relative w-[90%] h-[97%] col-start-8 col-span-4 rounded-lg">
                <Image
                  className="rounded-lg shadow-shadoww"
                  src="https://cdn.dribbble.com/users/1764261/screenshots/3937130/media/200a0c094cdfe8b5dddff7416de8c390.png?resize=800x600&vertical=center"
                  alt=""
                  sizes="(max-width: 600px) 400px,
                (max-width: 1200px) 800px,
                1200px"
                  fill
                ></Image>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
