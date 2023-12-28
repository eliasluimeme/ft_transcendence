"use client"

import { FC, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { format } from 'date-fns';

type Message = {
  userId: number
  content: string
  createdAt: Date
}

type  user = { 
    id: number
    nickname: string
    memberImage: string
    self: boolean
  }

interface MessagesProps {
    initialMessages: Message[]
    me: user | undefined
    roomId: any
  }

  const Messages: FC<MessagesProps> = ({
    initialMessages,
    me,
    roomId,
  }) => {
    const scrollDownRef = useRef<HTMLDivElement | null>(null)
  
    const formatTimestamp = (timestamp: Date) => {
      return format(timestamp, 'HH:mm')
    }
  
    useEffect(() => {
      if (scrollDownRef.current) {
        scrollDownRef.current.scrollIntoView()
      }
    }, [initialMessages])
  
    return (
    <>
    <div className="overflow-y-scroll w-full sm:h-[500px] lg:h-[980px] p-[80px]">
    <div >
      {
      initialMessages?.map((message) => {
      const isCurrentUser = message.userId === me?.id;
  
      return (
        <div
        className="mb-[10px]" 
        style={{ maxHeight: '400px' }} 
        
          key={`${message.createdAt}`}
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
                  "order-1 items-end": !isCurrentUser,
                  "order-2 items-start": isCurrentUser,
                }
              )}
            >
              <span
                className={cn("px-4 py-2 rounded-lg inline-block", {
                  "bg-[#F87B3F] text-white": isCurrentUser,
                  "border text-white": !isCurrentUser,
                  "rounded-br-none":  isCurrentUser,
                  "rounded-bl-none":  !isCurrentUser,
                })}
              >
                {message.content}{" "}
                <span className="ml-2 text-xs text-black">
                {formatTimestamp(message.createdAt)}
                </span>
              </span>
            </div>
  
            <div
              className={cn("relative w-6 h-6", {
                "order-2": isCurrentUser,
                "order-1": !isCurrentUser,
              })}
            >
              <div id='scroll' ref={scrollDownRef} >
              </div>
              {/* type of room  === image*/}
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
    })
      }
      </div>
      </div>
    </>
    );
  }
  export default Messages