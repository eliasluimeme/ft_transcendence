"use client"

import { FC, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
// import { format } from 'date-fns'
import ChatInput from './ChatInput'
import { format } from 'date-fns';

type Message = {
  id: string
  senderId: number
  content: string
  timestamp: number
}



type  user = { 
    id: number
    nickname: string
    memberImage: string
    self: boolean
  }


interface MessagesProps {
    initialMessages: Message[]
    me: user
    partner: user
    chatId: number | string
  }

  const Messages: FC<MessagesProps> = ({
    initialMessages,
    me,
    partner,
    chatId,
  }) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
  
    useEffect(() => {  
      const messageHandler = (message: Message) => {
        setMessages((prev) => [message, ...prev])
      }
    }, [chatId])
  
    const scrollDownRef = useRef<HTMLDivElement | null>(null)
  
    const formatTimestamp = (timestamp: number) => {
      return format(timestamp, 'HH:mm')
    }
  
    if(!Array.isArray(messages))
      return null;
    return messages.map((message, index) => {
      const isCurrentUser = 4;
        // message.senderId === me?.id;
      const fromSameSender =
        messages[index - 1]?.senderId === me?.id;
  
      return (
        <div
          className="chat-message"
          key={`${message.id}-${message.timestamp}`}
        >
          <div
            className={cn("flex items-end", {
              "justify-end": isCurrentUser,
            })}
          >
            <div
              className={cn(
                "flex flex-col space-y-2 text-base max-w-xs mx-2",
                {
                  "order-1 items-end": isCurrentUser,
                  "order-2 items-start": !isCurrentUser,
                }
              )}
            >
              <span
                className={cn("px-4 py-2 rounded-lg inline-block", {
                  "bg-[#F87B3F] text-white": !isCurrentUser,
                  "border text-white": isCurrentUser,
                  "rounded-br-none": !fromSameSender && isCurrentUser,
                  "rounded-bl-none": !fromSameSender && !isCurrentUser,
                })}
              >
                {message.content}{" "}
                <span className="ml-2 text-xs text-black">
                  {formatTimestamp(message.timestamp)}
                </span>
              </span>
            </div>
  
            <div
              className={cn("relative w-6 h-6", {
                "order-2": isCurrentUser,
                "order-1": !isCurrentUser,
                invisible: fromSameSender,
              })}
            >
              {/* <Image
                fill
                src={
                  isCurrentUser
                    ? me?.memberImage || ""
                    : partner?.memberImage || ""
                }
                alt="Profile picture"
                referrerPolicy="no-referrer"
                className="rounded-full"
              /> */}
            </div>
          </div>
        </div>
      );
    });
  };
  
  export default Messages