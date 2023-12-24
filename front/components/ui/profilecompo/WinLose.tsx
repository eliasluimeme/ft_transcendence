import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function WinLose(props: {
  opo1: string;
  opo2: string;
  result: string;
  opo1image: string;
  opo2image: string;
  className: string;
}) {
  return (
    <div className={`${props.className} p-4 text-[13px] w-full h-full`}>
      <div className="w-full h-full space-x-7 flex items-center justify-center">
        <Avatar className="w-[40px] h-[40px] border-[4px]">
          <AvatarImage src={props.opo1image} alt="User Avatar" />
          <AvatarFallback>profile</AvatarFallback>
        </Avatar>
        <div>{props.result}</div>
        <Avatar className="w-[40px] h-[40px] border-[4px]">
          <AvatarImage src={props.opo2image} alt="User Avatar" />
          <AvatarFallback>profile</AvatarFallback>
        </Avatar>
      </div>
      {/* {props.wl ? (
        <div className="flex space-x-1">
          <p>
            Congratulations! You emerged victorious in a thrilling ping pong
            match against
          </p>
          <p className="text-white">{props.opo}</p>
        </div>
      ) : (
        <div className="flex space-x-1">
          <p>
            Every game is a chance to learn, grow, and come back stronger. You
            lost against
          </p>
          <p className="text-white">{props.opo}</p>
        </div>
      )} */}
    </div>
  );
}

export default WinLose;
