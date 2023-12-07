import React from "react";
import Pic from "@/components/ui/Profile";
import FillSet from "@/components/ui/FillSet";
const settings = () => {
  const image =
    "https://mir-s3-cdn-cf.behance.net/project_modules/1400/3b8ebd170865619.6465111bd6e80.png";
  return (
    <div className="h-full rounded-lg  font-alfa-slab flex space-x-2">
      <div
        className="w-[40%] rounded-lg bg-[#36393E]"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "screen",
        }}
      >
        <Pic />
      </div>
      <div className="w-[60%]">
        <FillSet />
      </div>
    </div>
  );
};

export default settings;
