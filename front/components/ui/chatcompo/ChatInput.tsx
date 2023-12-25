"use client";

import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "../button";
import Image from "next/image";
import axios from "axios";
import Messages from "./Messages";

const socket = io("http://localhost:3001/chat");

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
  type: string;
  users: User[];
};

const fetchParticipants = async (id: any) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/chat/conversations/members",
      {
        withCredentials: true,
        params: id,
      }
    );
    if (response.status === 200) {
      console.log("From Axios ====> ", response.data);
      return response.data;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const fetHistoric = async (id: any) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/chat/conversations/messages",
      {
        withCredentials: true,
        params: id,
      }
    );
    if (response.status === 200) {
      console.log("From Axios ====> ", response.data);
      return response.data;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const ChatInput = (id: string | number) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const [historic, setHistoric] = useState<Message[]>([]);
  const messages: Message[] = historic;
  const me = useRef({ id: 0, nickname: "", memberImage: "", self: true });
  const partner = useRef({ id: 0, nickname: "", memberImage: "", self: true });
  const type = useRef<string>("DM");

  useEffect(() => {
    fetchParticipants(id).then((data) => {
      type.current = data.visibility;
      if (data && data.users[0].self) {
        me.current.id = data.users[0].id;
        me.current.nickname = data.users[0].name;
        (me.current.memberImage = data.users[0].photo),
          (me.current.self = data.users[0].self);
        partner.current.id = data.users[1].id;
        partner.current.nickname = data.users[1].name;
        (partner.current.memberImage = data.users[1].photo),
          (partner.current.self = data.users[1].self);
      } else {
        me.current.id = data.users[1].id;
        me.current.nickname = data.users[1].name;
        (me.current.memberImage = data.users[1].photo),
          (me.current.self = data.users[1].self);
        partner.current.id = data.users[0].id;
        partner.current.nickname = data.users[0].name;
        (partner.current.memberImage = data.users[0].photo),
          (partner.current.self = data.users[0].self);
      }
    });
  }, [id]);

  const handleSubmit = (
    senderId: number,
    reciverId: number,
    messageContent: string,
    type: string
  ) => {
    socket.connect();
    socket.emit("conversation", { messageContent, senderId, reciverId, type });
    setMessage("");
  };

  useEffect(() => {
    socket.on("conversation", (message) => {
      console.log("Message from server: ", message);
      // messages.current.push(message);
    });
  }, [message]);

  useEffect(() => {
    fetHistoric(id).then((data) => {
      setHistoric(data);
    });
  }, [id]);

  {
    /*      ///////////      CHAT AREA ///////////////////////////                                       */
  }
  return (
    <>
      <div>
        <Messages
          initialMessages={messages}
          me={me.current}
          partner={partner.current}
          chatId={id}
        />
        <div className="w-full h-full grid grid-cols-8 place-items-center focus-within:ring-indigo-600">
          <div className="col-start-1 col-span-7 w-full h-full flex items-center justify-center">
            <div className="w-full h-full row-start-4 row-span-5 flex items-center justify-cente">
              <form
                className="w-full h-full flex items-center justify-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(
                    me.current.id,
                    partner.current.id,
                    message,
                    type.current
                  );
                }}
              >
                <TextareaAutosize
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(
                        me.current.id,
                        partner.current.id,
                        message,
                        type.current
                      );
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
