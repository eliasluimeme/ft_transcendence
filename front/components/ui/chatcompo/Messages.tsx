"use client"

import { FC, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { format } from 'date-fns';

type Message = {
  roomId: number;
  userId: number
  content: string
  sender: string
  createdAt: Date
}

type user = {
  id: number
  nickname: string
  memberImage: string
  self: boolean
}

interface MessagesProps {
  initialMessages: Message[]
  me: user | undefined
  roomType: any
  blocked: any
  roomId: number
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  me,
  roomType,
  blocked,
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
      <div className="h-full overflow-y-scroll w-full px-4 md:px-8">
        <div >
          {
            initialMessages?.filter((r) => r.roomId == roomId)?.map((message) => {
              const isCurrentUser = message.userId === me?.id;


              return (
                <div
                  className=""
                  // style={{ maxHeight: '400px' }}
                  key={`${message.createdAt}`}
                >
                  <div
                    className={cn("flex flex-col items-start", {
                      "items-end": isCurrentUser,
                    })}
                  >
                    {
                      roomType !== 'DM' ? (
                        <div className="mb-2 capitalize"> {message.sender} </div>
                      ) : null
                    }
                    <div
                      className={cn(
                        "flex flex-col space-y-2 text-base max-w-xs",
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
                          "rounded-br-none": isCurrentUser,
                          "rounded-bl-none": !isCurrentUser,
                        })}
                      >
                        {message.content}{" "}
                        <small className="ml-2 text-xs text-white">
                          {formatTimestamp(message.createdAt)}
                        </small>
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
              // } 
            })
          }
        </div>
      </div >
    </>
  );
}
export default Messages