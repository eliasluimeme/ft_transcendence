import React from "react";
import Image from "next/image";

const Bot = (props:any) => {
  const newGameVsBot = () => {
    props.socket.emit('newGameBot', "3");
    props.setStatus(1);
  }
  return (
    <div className="grid grid-cols-3 w-full h-full">
      <div className="col-start-1 col-span-2 relative w-full h-full flex items-center justify-center">
        <div className=" relative w-[90%] h-[70%]">
          <Image
            className="relative rounded-lg"
            src="https://cdn.dribbble.com/users/1420892/screenshots/11361440/media/1006e2732e0e9ad1e10d2494f17f409a.png?resize=1000x750&vertical=center"
            alt=""
            sizes="(max-width: 600px) 400px,
                (max-width: 1200px) 800px,
                1200px"
            fill
          ></Image>
        </div>
      </div>
      <div className="col-start-3 flex flex-col items-center justify-center ">
        <div>Play With</div>
        <div className="text-[40px] text-[#F87B3F]">BoT</div>
        <button onClick={newGameVsBot} className="border w-[80%] h-[10%] rounded-lg bg-[#EDF0F4] text-[#3B2D59] shadow-sm shadow-white hover:text-opacity-70">
          Play
        </button>
      </div>
    </div>
  );
};

export default Bot;
