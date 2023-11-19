import React from "react";
import "@/components/ui/CSS/font.css";
const GameHistory = () => {
  const HISTORY_DATA = [
    {
      login: "ael-kouc",
      win: false,
    },
    {
      login: "ael-bach",
      win: false,
    },
    {
      login: "ael-kouc",
      win: true,
    },
    {
      login: "ael-kouc",
      win: false,
    },
    {
      login: "ael-kouc",
      win: true,
    },
  ];
  return (
    <div className="flex flex-col justify-center space-y-2 mx-[10%] items-center h-full">
      <div className="blue_font lg:text-[30px] md:text-[20px] sm:text-[10px] text-[10px]">
        Wins and losses
      </div>
      {HISTORY_DATA.map((data, index) => (
        <div key={index} className="">
          {data.win ? (
            <div className="win_font lg:text-[15px] sm:text-[10px] md:text-[7px] text-[7px]">
              Congratulations! You emerged victorious in a thrilling ping pong
              match against {data.login}
            </div>
          ) : (
            <div className="lose_font lg:text-[15px] sm:text-[10px] md:text-[7px] text-[7px]">
              every game is a chance to learn, grow, and come back stronger, you
              lose against {data.login}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GameHistory;
