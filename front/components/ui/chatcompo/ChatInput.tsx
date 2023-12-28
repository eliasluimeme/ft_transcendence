"use client";

import TextareaAutosize from "react-textarea-autosize";
import { cn } from '@/lib/utils'
import React, { EffectCallback, useEffect, useRef, useState } from "react";
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
  userId: number;
  content: string;
  createdAt: Date;
  id?: string;
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

const ChatInput = (id: any) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const [historic, setHistoric] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<Message[]>();
  const [ oldMessages, setOldMessages]= useState<Message[]>([]);
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
  
  useEffect(()=> {
    socket.off('reciecved').on('reciecved', (pyload) => {
      setOldMessages((prevMessages) => [...prevMessages, pyload]);

    });
  }, []);


  {/* ///////////      CHAT AREA /////////////////////////// */}
  return (
    <>
    <div className="w-full h-full grid grid-rows-6">
      <div className="w-full h-full row-start-1 row-span-5">
        <Messages initialMessages={oldMessages}  me={me.current} roomId={id} />
        </div>
        <div className="w-full h-full place-items-center focus-within:ring-indigo-600 row-start-6">
          <div className="w-full h-full flex items-center justify-around">
            <div className="w-full h-full flex items-center justify-around">
              <form
                className="w-[90%] h-[50%] flex items-center justify-around"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (message)
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
                      if (message)
                        handleSubmit(id.id , message, me?.current?.id);
                    }
                  }}
                  placeholder="Type your message"
                  className="w-full rounded-lg text-black placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                />
                <div className="w-full h-full">
                  <div className="w-full h-full flex items-center justify-center">
                    <button
                      className="w-[30%] h-[20%] bg-[#F87B3F] rounded-lg"
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
