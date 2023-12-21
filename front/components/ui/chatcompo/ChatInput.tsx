"use client";

import TextareaAutosize from "react-textarea-autosize";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "../button";
import Image from "next/image";

const socket = io("http://localhost:3001/chat");

interface Messages {
  senderId: string
  reciverId: string
  type: string
  chatId: string
}

const ChatInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  
  // console.log(messages);
  // useEffect(() => {
  //   console.log("Connecting to socket...");
  //   // socket.on('conversation', (data) => {
  //   //   setMessages((prevMessages) =>[...prevMessages, data]);});

  //     console.log(messages);

  //   }, [messages]);
    
    const handleSubmit = (senderId: string, reciverId: string, messageContent: string, type: string) => {
      console.log("send MSG: from ", senderId, "to ", reciverId, messageContent, type);
      socket.emit('conversation', {senderId, reciverId, messageContent, type});
      setMessage("");
      socket.on('conversation', (message) => {
        console.log("Received message: From " , message);
        setMessages((prevMess) => [...prevMess, message]);
      });
  };

  
  return (
    
    <>
    {/*      ///////////      CHAT AREA ///////////////////////////                                       */}
  <div className="h-full w-full  grid grid-rows-5 ">
    <div className="w-full h-full row-start-1 row-span-4 flex items-center justify-center">
    <div className="overflow-y-auto space-y-4 r w-[90%] h-full">
      <div className="flex items-end space-x-2">
        <div className="max-w-xs border rounded-lg shadow p-4">
          <p className="text-sm">
            Hello! I am your assistant. How can I assist you today?
          </p>
        </div>
      </div>
      <div className="flex items-end justify-end space-x-2">
        <div className="max-w-xs bg-blue-100 text-blue-700 rounded-lg shadow p-4">
          <p className="text-sm">I need help with a contract dispute.</p>
        </div>
      </div>
    </div>
  </div>

      {/*      ///////////        INPUT AREA ///////////////////////////                                       */}
      <div className="w-full h-full grid grid-cols-8 place-items-center focus-within:ring-indigo-600">
        <div className="col-start-1 col-span-7 w-full h-full flex items-center justify-center">
          <div className=" w-full h-full row-start-4 row-span-5 flex items-center justify-cente">
          <form
            className="w-full h-full flex items-center justify-center"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("This is message : ", message);
              handleSubmit("YOUSSEF", "ACHRAF", message, "DM")}
            }
          >
            <TextareaAutosize
              ref={textareaRef}
              rows={1}
              value={message}
              onChange={(message) => setMessage(message.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  console.log("This is message : ", message);
                  e.preventDefault();
                  handleSubmit("YOUSSEF", "ACHRAF", message, "DM");
                }
              }}
              placeholder="Type your message"
              className=" w-full h-full  rounded-lg text-black  placeholder:text-gray-400 focus:ring-0  sm:text-sm"
            />
        <div className="w-full h-full col-start-8 col-span-1">
          <div className="w-full h-full flex items-center justify-center">
            <button
              className="w-[80%] h-[90%] bg-[#F87B3F] rounded-lg"
              type="submit"
              >
              {" "}
              Send
            </button>
          </div>
        </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</>
  );
};

export default ChatInput;