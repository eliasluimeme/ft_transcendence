import React from "react";

function WinLose(props: { wl: string; opo: string; className: string }) {
  const textColorClass = props.wl ? "text-[#DBCE26]" : "text-[#FF8A70]";

  return (
    <div className={`${textColorClass} ${props.className} p-4 text-[13px]`}>
      <div className="border flex space-x-1">
          <p>
            Congratulations! You emerged victorious in a thrilling ping pong
            match against
          </p>
          <p className="text-white">{props.wl}</p>
        </div>
    </div>
  );
}

export default WinLose;
