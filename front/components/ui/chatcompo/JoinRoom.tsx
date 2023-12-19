"use client";
import React from "react";
import { useState } from "react";

const JoinRoom = () => {
  //////////////////ROOM//////////////////////////////
  const [roomName, setRoomName] = useState("");
  const handleRoomnNme = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };
  //////////////////ROOM//////////////////////////////
  const [passwordName, setPasswordName] = useState("");
  const handlePasswordnNme = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordName(event.target.value);
  };
  ////////////////////////type of room//////////////////
  const [roomType, setRoomType] = useState("public");

  return (
    <div className="w-full h-full space-y-4 bg-[#1E2124]">
      <div>
        <div>Name : </div>
        <input
          type="text"
          value={roomName}
          onChange={handleRoomnNme}
          className="w-[100%] h-[2%] border-color: rgb(255 255 255) bg-transparent border rounded-full text-[15px]  border-gray-500 text-gray-500"
        />
      </div>
      <div>
        <div>Password : </div>
        <input
          type="text"
          value={passwordName}
          onChange={handlePasswordnNme}
          className="w-[100%] h-[2%] border-color: rgb(255 255 255) bg-transparent border rounded-full text-[15px]  border-gray-500 text-gray-500"
        />
      </div>
      <div className="flex justify-end mr-[10px]">
        <button className="w-[60px] h-[40px] rounded-lg text-[10px] bg-[#F77B3F] bg-opacity-50 hover:bg-opacity-100">
          Join
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
