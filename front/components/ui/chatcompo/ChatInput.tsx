"use client";

import TextareaAutosize from "react-textarea-autosize";
import { cn } from '@/lib/utils'
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "../button";
import Image from "next/image";
import axios from "axios";
import { fetchServerResponse } from "next/dist/client/components/router-reducer/fetch-server-response";

const socket = io("http://localhost:3001/chat");

interface Messages {
  senderId: number
  reciverId: number
  type: string

}

type Participant = {
  type: string
  user:{ 
    id: number
    nickname: string
    memberImage: string
    self: boolean
  }
}


// senderId={data?.id} reciverId={data?.id} type={data?.type}
// interface Members {
//   id: number;
//   nickname: string;
// const fetchParticipants = async (): Promise<Participant | undefined> => {
//   try { 
//     const response = await axios.get<Participant>('http://localhost:3001/chat/conversations/members').then
//     ((res): Participant => {
      
//       console.log("fetch participants");
//       if (res.status === 200){
//         response.type = res.data.type;
//         response.id = res.data.id;
//         response.nickname = res.data.nickname;
//         response.memberImage = res.data.memberImage;
//         return response;
//       }
//       }
//     );
//     return undefined;
//   } catch (error) {
//     console.error(error);
//     return undefined;
//   }
// }

const fetchParticipants = async (): Promise<Participant | undefined> => {
  try { 
    const response = await axios.get<Participant>('http://localhost:3001/chat/conversations/members');
      
    console.log("fetch participants");
    
    if (response.status === 200) {
      return response.data;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

const ChatInput = (id: string | null) => {
  // console.log("members is :  ===> ");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [partner, setPartner] = useState<Participant | undefined>(undefined);
  const [me, setMe] = useState<Participant | undefined>(undefined);

  
  useEffect(() => {
    fetchParticipants().then((data) => {
      console.log("me ===============>  ",  data?.user.nickname);
      if (data && data.user.self) {
        setMe(data);
      } else if (data) {
        setPartner(data);
      }
    });
    console.log("partner ===============>  ",  partner);
  },[id]);

  // console.log("participants ===============>  ",  fetchParticipants());
  // fetchParticipants();
  // const fetchHistorique = async () => {
  //   try { 
  //     const response = await axios.get('http://localhost:3001/chat/conversations/messages').then((res) => res.data);

  //     if (response.status === 200)
  //     {
  //       console.log("historique ===============>  ", response.data.messages);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  
  // fetchHistorique();
  // // console.log(messages);
  
  const handleSubmit = (senderId: number, reciverId: number, messageContent: string, type: string) => {
    console.log("send MSG: from ", senderId, "to ", reciverId, messageContent, type);
    setMessages((prevMess) => [...prevMess, messageContent]);
    socket.emit('conversation', {senderId, reciverId, messageContent, type});
    setMessage("");
  };

  useEffect(() => {
    console.log("Connecting to socket...");
    // socket.on('conversation', (data) => {
    //   setMessages((prevMessages) =>[...prevMessages, data]);});

    
    socket.on('recieve', () => {
      setMessages((prevMess) => [...prevMess, message]);
    });
  }, [message]);
  
  // console.log("historique ======", messages);
  setMessages(["hello","hey","holla","salut","salam","test","alah"]);
  return (

    // {messages.map((message, index) => {
    //   const isCurrentUser = message.senderId === userId

    //   const hasNextMessageFromSameUser =
    //     messages[index - 1]?.senderId === messages[index].senderId

    //   return (
    //     <div
    //       className='chat-message'
    //       key={`${message.id}-${message.timestamp}`}>
    //       <div
    //         className={cn('flex items-end', {
    //           'justify-end': isCurrentUser,
    //         })}>
    //         <div
    //           className={cn(
    //             'flex flex-col space-y-2 text-base max-w-xs mx-2',
    //             {
    //               'order-1 items-end': isCurrentUser,
    //               'order-2 items-start': !isCurrentUser,
    //             }
    //           )}>
    //           <span
    //             className={cn('px-4 py-2 rounded-lg inline-block', {
    //               'bg-indigo-600 text-white': isCurrentUser,
    //               'bg-gray-200 text-gray-900': !isCurrentUser,
    //               'rounded-br-none':
    //                 !hasNextMessageFromSameUser && isCurrentUser,
    //               'rounded-bl-none':
    //                 !hasNextMessageFromSameUser && !isCurrentUser,
    //             })}>
    //             {message.text}{' '}
    //             <span className='ml-2 text-xs text-gray-400'>
    //               {formatTimestamp(message.timestamp)}
    //             </span>
    //           </span>
    //         </div>

    //         <div
    //           className={cn('relative w-6 h-6', {
    //             'order-2': isCurrentUser,
    //             'order-1': !isCurrentUser,
    //             invisible: hasNextMessageFromSameUser,
    //           })}>
    //           <Image
    //             fill
    //             src={
    //               isCurrentUser ? (userImg as string) : chatPartner //chatPartner.image
    //             }
    //             alt='Profile picture'
    //             referrerPolicy='no-referrer'
    //             className='rounded-full'
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   )
    // })}

    {/*      ///////////      CHAT AREA ///////////////////////////                                       */}
  <div>

  
    {
      messages.map((message, index) => {
        const isCurrentUser = message.senderId === me?.user.id
        const fromSameSender = messages[index - 1]?.senderId === me?.user.id
        return (
          <div
                className='chat-message'
    
                key={`${message.id}-${message.timestamp}`}>
                <div
                  className={cn('flex items-end', {
                    'justify-end': isCurrentUser,
                  })}>
                  <div
                    className={cn(
                      'flex flex-col space-y-2 text-base max-w-xs mx-2',
                      {
                        'order-1 items-end': isCurrentUser,
                        'order-2 items-start': !isCurrentUser,
                      }
                    )}>
                    <span
                      className={cn('px-4 py-2 rounded-lg inline-block', {
                        'bg-indigo-600 text-white': isCurrentUser,
                        'bg-gray-200 text-gray-900': !isCurrentUser,
                        'rounded-br-none':
                          !fromSameSender && isCurrentUser,
                        'rounded-bl-none':
                          !fromSameSender && !isCurrentUser,
                      })}>
                      {message.text}{' '}
                      <span className='ml-2 text-xs text-gray-400'>
                        {/* {formatTimestamp(message.timestamp)} */}
                      </span>
                    </span>
                  </div>
      
                  <div
                    className={cn('relative w-6 h-6', {
                      'order-2': isCurrentUser,
                      'order-1': !isCurrentUser,
                      invisible: fromSameSender,
                    })}>
                    <Image
                      fill
                      src={
                        isCurrentUser ? (me?.user.memberImage || '') : (partner?.user.memberImage || '') //chatPartner.image
                      }
                      alt='Profile picture'
                      referrerPolicy='no-referrer'
                      className='rounded-full'
                    />
                  </div>
                </div>
              </div>
        )
      })}

           
      <div className="w-full h-full grid grid-cols-8 place-items-center focus-within:ring-indigo-600">
        <div className="col-start-1 col-span-7 w-full h-full flex items-center justify-center">
          <div className=" w-full h-full row-start-4 row-span-5 flex items-center justify-cente">
          <form
            className="w-full h-full flex items-center justify-center"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("This is message : ", message);
              if (me?.user?.id && partner?.user?.id)
                handleSubmit(me.user.id, partner.user.id, message, me.type);}
            }
          >
            <TextareaAutosize
              ref={textareaRef}
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  console.log("This is message : ", message);
                  e.preventDefault();
                  if (me?.user?.id && partner?.user?.id)
                    handleSubmit(me.user.id, partner.user.id, message, me.type);
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

  );
};

export default ChatInput;
