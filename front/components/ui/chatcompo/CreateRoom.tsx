import React from "react";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";

const CreateRoom = () => {
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


  //////////////send data////////////////////////////////
  const send_data = async () => {
    try {
      const response = await axios.post("http://localhost:3001/", {
        roomName: roomName,
        roomType: roomType,
        passwordName: passwordName,
      }, {
        withCredentials: true,
      });
      if (response.status === 201) {
        
      } else {
        console.log("Failed to fetch friendship data");
      }
    } catch (error) {
      console.error("An error occurred while fetching friendship data:", error);
    }
  };
  // useEffect(() => {
  //   takefreind();
  // }, []);
  /////////////////////////////////

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
      <Popover>
        <PopoverTrigger className="border w-full h-[30px] rounded-lg text-[10px] text-white">
          {roomType}
        </PopoverTrigger>
        <PopoverContent className="w-[100px]">
          <button onClick={() => setRoomType("Private")}>Private</button>
          <button onClick={() => setRoomType("Public")}>Public</button>
          <button onClick={() => setRoomType("Protected")}>Protected</button>
        </PopoverContent>
      </Popover>
      {roomType === "Protected" ? (
        <div>
          <div>Password : </div>
          <input
            type="text"
            value={passwordName}
            onChange={handlePasswordnNme}
            className="w-[100%] h-[2%] border-color: rgb(255 255 255) bg-transparent border rounded-full text-[15px]  border-gray-500 text-gray-500"
          />
        </div>
      ) : (
        <div></div>
      )}
      <div className="flex justify-end mr-[10px]">
        <button onClick={() => send_data()} className="w-[60px] h-[40px] rounded-lg text-[10px] bg-[#F77B3F] bg-opacity-50 hover:bg-opacity-100">
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;
