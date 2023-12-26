"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";

const JoinRoom = () => {
  const router = useRouter();
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
  ////////////////////////room id//////////////////
  const [roomId, setRoomId] = useState("");

  const join = async () => {
    try {
      const response = await axios.post("http://localhost:3001/chat/join", {
        roomName: roomName,
        pw: passwordName,
      }, {
        withCredentials: true,
      });
      if (response.status === 201) {
        setRoomId(response.data.id);
        router.push('/chat/chatconv?id=' + response.data.id);
        toast.success("Room Joined Successfuly");
      } else {
        console.log("Failed to fetch group data");
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || 'An error occurred');
      }
      console.error("An error occurred while fetching group data:", error);
    }
  };

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
        <button onClick={() => join()} className="w-[60px] h-[40px] rounded-lg text-[10px] bg-[#F77B3F] bg-opacity-50 hover:bg-opacity-100">
          Join
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
