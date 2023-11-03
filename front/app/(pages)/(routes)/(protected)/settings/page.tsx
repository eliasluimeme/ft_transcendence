import React from "react";
import Pic from "@/components/ui/Profile";
import FillSet from "@/components/ui/FillSet";
const settings = () => {

  return (
    <div className="h-full rounded-lg  font-alfa-slab flex space-x-2">
      <div className="w-[40%] rounded-lg bg-[#36393E]">
        <Pic />
      </div>
      <div className="w-[60%]">
        <FillSet/>
      </div>
    </div>
  );
};

export default settings;
