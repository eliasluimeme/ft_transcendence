import React from "react";
import { useState  } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CreateRoom = () => {
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
  ////////////////////////type of room//////////////////
  const [roomType, setRoomType] = useState("PUBLIC");


  //////////////send data////////////////////////////////
  const send_data = async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "chat/create", {
        roomName: roomName,
        roomType: roomType,
        pw: passwordName,
      }, {
        withCredentials: true,
      });
      if (response.status === 201) {
        toast.success("Room Created Successfuly");
      } else {
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || 'An error occurred');
      }
    }
  };

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
          <button onClick={() => setRoomType("PRIVATE")}>Private</button>
          <button onClick={() => setRoomType("PUBLIC")}>Public</button>
          <button onClick={() => setRoomType("PROTECTED")}>Protected</button>
        </PopoverContent>
      </Popover>
      {roomType === "PROTECTED" ? (
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
