"use client";

import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Messages from "./Messages";
import { User } from "lucide-react";

const socket = io(process.env.BACK_END_URL + 'chat', {
  withCredentials: true,
});

type Message = {
  roomId: number;
  userId: number;
  content: string;
  sender: string;
  createdAt: Date;
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
  const [oldMessages, setOldMessages] = useState<Message[]>([]);
  const [blocked, setBlocked] = useState<number[]>([]);
  const me = useRef<User>()
  const [roomId, setRoomId] = useState<number>(0);
  const partners = useRef<User[] | undefined>()
  const [type, setType] = useState<string>('DM');

  const fetHistoric = async () => {
    try {
      const response = await axios.get(process.env.BACK_END_URL + 'chat/conversations/messages',
        {
          withCredentials: true,
          params: id
        });
      if (response.status === 200) {
        setBlocked(response.data[0].blocked)
        setOldMessages(response.data[0].messages)
        setRoomId(response.data[0].id)
      } else {
        return undefined;
      }
    } catch (error) {
      //ror(error);
      return undefined;
    }
  }
  useEffect(() => {
    fetHistoric();
    //(" blocked array ", blocked)
  }, [id])


  const fetchParticipants = async () => {
    try {
      const response = await axios.get(process.env.BACK_END_URL + 'chat/conversations/members',
        {
          withCredentials: true,
          params: id
        });
      if (response.status === 200) {
        setType(response.data.visibility);
        const size = Object.keys(response.data.users).length;
        if (size >= 1) {
          response.data.users.forEach((user: User) => {
            if (user.self === true) {
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
      //ror(error);
      return undefined;
    }
  }
  useEffect(() => {
    fetchParticipants();
  }, [id])

  const handleSubmit = (roomId: number, messageContent: string, senderId: number | undefined) => {
    socket.emit('conversation', { messageContent, roomId, senderId });
    setMessage("");
  };

  useEffect(() => {
    socket.off('reciecved').on('reciecved', (pyload) => {
      if (blocked.includes(pyload.userId)) return
      setOldMessages((prevMessages) => [...prevMessages, pyload]);

    });
  }, [blocked]);

  {/* ///////////      CHAT AREA /////////////////////////// */ }
  return (
    <>
      <div className="w-full h-full grid grid-rows-6">
        <div className="w-full h-full row-start-1 row-span-5 overflow-hidden">
          <Messages initialMessages={oldMessages} me={me.current} roomType={type} blocked={blocked} roomId={roomId} />
        </div>
        <div className="w-full h-full place-items-center focus-within:ring-indigo-600 row-start-6">
          <form
            className="flex gap-2 items-start w-full px-4 md:px-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (message)
                handleSubmit(id.id, message, me?.current?.id);
            }}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (message)
                    handleSubmit(id.id, message, me?.current?.id);
                }
              }}
              placeholder="Type your message"
              className="flex-1 p-3 rounded-lg text-black placeholder:text-gray-400 focus:ring-0"
            />
            <button
              className="px-6 py-3 bg-[#F87B3F] rounded-lg"
              type="submit"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default ChatInput;