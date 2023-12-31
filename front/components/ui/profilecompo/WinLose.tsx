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
    <div className={`${props.className} p-2 text-[13px]  w-full h-[70px]`}>
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
    </div>
  );
}

export default WinLose;
