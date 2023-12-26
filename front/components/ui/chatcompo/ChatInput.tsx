"use client";

import TextareaAutosize from "react-textarea-autosize";
import { cn } from '@/lib/utils'
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "../button";
import Image from "next/image";
import axios from "axios";
import Messages from "./Messages";
import { User } from "lucide-react";

const socket = io('http://localhost:3001/chat', {
  withCredentials: true,
});

type Message = {
  id: string;
  senderId: number;
  content: string;
  timestamp: number;
};

type User = {
  id: number;
  nickname: string;
  memberImage: string;
  self: boolean;
};

type Participant = {
  type: string
  users: User[]
}

const fetHistoric = async (id :any) => {
  try { 
    const response = await axios.get('http://localhost:3001/chat/conversations/messages',
    {
      withCredentials: true,
      params :  id
    });
    if (response.status === 200) {
      console.log('data ========> ', response.data);
      return response.data;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
}


const ChatInput = (id: any) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const [historic, setHistoric] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<Message[]>();
  const [ oldMessages, setOldMessages]= useState<Message[]>();
  const me = useRef<User>()
  const partners = useRef<User[] | undefined>()
  const type  = useRef<string>('DM');

  const fetHistoric = async () => {
    try { 
      const response = await axios.get('http://localhost:3001/chat/conversations/messages',
      {
        withCredentials: true,
        params :  id
      });
      if (response.status === 200) {
        setOldMessages(response.data[0].messages)
        console.log(oldMessages)
        // return response.data;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  useEffect(() =>{
    fetHistoric();
  },[id])
  const fetchParticipants = async () => {
    try {
      const response = await axios.get('http://localhost:3001/chat/conversations/members',
      {
        withCredentials: true,
        params :  id      
      });
      if (response.status === 200) {
        const size = Object.keys(response.data.users).length;
        if (size >= 1){
          response.data.users.forEach((user : User) => {
            if (user.self === true){
              me.current = user
            }
          }
          )
          partners.current = response.data.users;
          // console.log("this is partner ==== > " , partners.current);
        }
      } else {
        return undefined;
      }
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  useEffect (() => {
  fetchParticipants();
  },[id])

  const handleSubmit = (roomId: number, messageContent: string , senderId: number | undefined) => {
    socket.emit('conversation', {messageContent, roomId , senderId});
    setMessage("");
  };
  
  useEffect(() => {
    socket.on('message', (newMessage) => {
      console.log("Message from server: ", newMessage);
      // setOldMessages[...prevmsg, newMessage];
      // check if sender not blockeed 
      oldMessages?.push(newMessage);

    });
  }, []);

  {/* ///////////      CHAT AREA /////////////////////////// */}
  return (
    <>
    <div>
        <Messages initialMessages={oldMessages}  me={me.current} roomId={id} />
        <div className="w-full h-full grid grid-cols-8 place-items-center focus-within:ring-indigo-600">
          <div className="col-start-1 col-span-7 w-full h-full flex items-center justify-center">
            <div className="w-full h-full row-start-4 row-span-5 flex items-center justify-cente">
              <form
                className="w-full h-full flex items-center justify-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(id.id , message, me?.current?.id);
              }}
              >
                <TextareaAutosize
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(id.id , message, me?.current?.id);
                    }
                  }}
                  placeholder="Type your message"
                  className="w-full h-full rounded-lg text-black placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                />
                <div className="w-full h-full col-start-8 col-span-1">
                  <div className="w-full h-full flex items-center justify-center">
                    <button
                      className="w-[80%] h-[90%] bg-[#F87B3F] rounded-lg"
                      type="submit"
                    >
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
