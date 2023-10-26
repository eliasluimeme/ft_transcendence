import React from "react";
import Ladderfounder from "./Ladderfounder";

const Laader = () => {
  const LEADER_DATA = [
    {
      name : "achraf",
      rank: "1",
      image: "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    },
    {
      name : "chi smiya",
      rank: "1",
      image: "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    },
    {
      name : "chi kniya",
      rank: "1",
      image: "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    },
    {
      name : "chi wa7ed",
      rank: "1",
      image: "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    },
    {
      name : "chi we7da",
      rank: "1",
      image: "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    },
  ];

  return (
    <div className="bg-[#424549] shadow-md mx-[10%] my-[5%] rounded-xl">
        <Ladderfounder/>
    </div>
  );
};

export default Laader;
