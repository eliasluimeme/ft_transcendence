"use client";
import React, { useState } from "react";
import Modal from "react-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const Info = () => {
  const [isOpen, setIsOpen] = useState(false);
  const customStyles = {
    overlay: { backgroundColor: "rgba(0, 0, 0, 0.6)" },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "#36393E",
      border: "none",
      width: "28%", // Set the desired width
      height: "75%", // Set the desired height, // Set a max height if needed
    },
  };
  const data = {
    image:
      "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg",
    nickname: "ael-kouc",
    status: "... in game",
    rank: "#30",
    GoldMedalImage: "/Achivements/GoldMedal.svg",
    GoldMedalStatu: true,
    SilverMedalImage: "/Achivements/SilverMedal.svg",
    SilverMedalStatu: true,
    BronzeMedalImage: "/Achivements/BronzeMedal.svg",
    BronzeMedalStatu: true,
    AwardImage: "/Achivements/Award.svg",
    AwardStatu: true,
    TrophyCupImage: "/Achivements/TrophyCup.svg",
    TrophyCupStatu: true,
  };
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        <Avatar>
          <AvatarImage src={data.image} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </button>

      <Modal
        className=""
        style={customStyles}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="User Info Modal"
      >
        <div>
          <Avatar className="border-4 border-[#F4F4F4] lg:w-32 lg:h-32 md:w-25 md:h-25 sm:w-20 sm:h-20 w-12 h-12">
            <AvatarImage src={data.image} />
            <AvatarFallback>rank 2</AvatarFallback>
          </Avatar>
          <div>{data.nickname}</div>
          <div>{data.status}</div>
          <div>{data.rank}</div>
          <div className="flex">
            <Image
              className="w-[10%]"
              src={data.GoldMedalImage}
              alt=""
              width={24}
              height={24}
            />
            <Image
              className="w-[10%]"
              src={data.SilverMedalImage}
              alt=""
              width={24}
              height={24}
            />
            <Image
              className="w-[10%]"
              src={data.BronzeMedalImage}
              alt=""
              width={24}
              height={24}
            />
            <Image
              className="w-[10%]"
              src={data.AwardImage}
              alt=""
              width={24}
              height={24}
            />
            <Image
              className="w-[10%]"
              src={data.TrophyCupImage}
              alt=""
              width={24}
              height={24}
            />
          </div>
        </div>
        <button
          className="text-black"
          onClick={() => setIsOpen(false)}
        ></button>
      </Modal>
    </div>
  );
};

export default Info;
