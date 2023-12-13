import React from "react";

function WinLose(props: { wl: boolean; opo: string; className: string }) {
  const textColorClass = props.wl ? "text-[#DBCE26]" : "text-[#FF8A70]";

  return (
    <div className={`${textColorClass} ${props.className} p-4 text-[13px]`}>
      {props.wl ? (
        <div className="border flex space-x-1">
          <p>
            Congratulations! You emerged victorious in a thrilling ping pong
            match against
          </p>
          <p className="text-white">{props.opo}</p>
        </div>
      ) : (
        <div className="border flex space-x-1">
          <p>
            Every game is a chance to learn, grow, and come back stronger. You
            lost against
          </p>
          <p className="text-white">{props.opo}</p>
        </div>
      )}
    </div>
  );
}

export default WinLose;
