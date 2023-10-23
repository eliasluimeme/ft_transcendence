"use client";
import { useTransition, useState } from "react";
import Level from "./level";
import Achievements from "./Achievements";
const Levels = () => {
  const [tab, setTab] = useState<string>("Achievements");
  const [isPending, startTransition] = useTransition();

  const TAB_DATA = [
    {
      title: "Achievements",
      id: "Achievements",
      content: <Achievements />,
    },
    {
      title: "Ladder level",
      id: "Ladder level",
      content: <div>sir drab doura ba9a mat9adat</div>,
    },
  ];

  const handleTapChange = (id: string) => {
    startTransition(() => {
      setTab(id);
    });
  };
  return (
    <div className="">
      <div className="flex text-[#D9D9D9] mt-[10%] ml-[2%] ">
        <Level
          className="lg:mr-[40%] mr-[15%] lg:text-2xl text-xl"
          selectTab={() => handleTapChange("Achievements")}
          active={tab === "Achievements"}
        >
          Achievements
        </Level>
        <Level
          className="lg:text-2xl text-xl"
          selectTab={() => handleTapChange("Ladder level")}
          active={tab === "Ladder level"}
        >
          Ladder level
        </Level>
      </div>
      <div className="">{TAB_DATA.find((t) => t.id === tab)?.content}</div>
    </div>
  );
};

export default Levels;
