'use client'

import TextareaAutosize from 'react-textarea-autosize';
import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Button } from './button';
import Image from 'next/image';
// import { sl } from 'date-fns/locale';

const socket = io('ws://localhost:3001');

const ChatInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    console.log('Connecting to socket...');
    socket.on('createChatDm', (data) => {
      setMessages([...messages, {
        sender: 'Achraf',
        data,
      }]);
    });

    socket.on('createChatDm', (message) => {
      console.log('Received message:', message);
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = () => {

  } 

  // useEffect(() => {
  //   socket.on('handleSubmit', (data) => {
  //     const newMessages = [...messages];
  //     newMessages.push({
  //       sender: 'Achraf',
  //       data,
  //     });
  
  //     if (!_.isEqual(messages, newMessages)) {
  //       setMessages(newMessages);
  //     }
  //   });
  
  //   socket.on('createMessage', (message) => {
  //     console.log('Received message:', message);
  //     setMessages([...messages, message]);
  //   });
  // }, [messages]);

  const handleInputChange = (e: any) => {
    setMessages(e.target.value);
  };

  // const handleSubmit = (event: string) => {
  //   console.log("here")
  //   // event.preventDefault();
  //   const message = event;
  //   if (socket) {
  //     socket.emit('createMessage', {
  //       _message: message,
  //       _name: 'YOUSSEF',
  //     });
  //     setMessage(message);
  //     console.log('Sent message:', message);
  //   }
  // };



  const handleSubmit = () => {
  console.log("here")
  if (socket) {
    socket.emit('createChatDm', {
      _messsage : message,
      _name: "YOUSSEF"
    })
    setMessages([...messages,message]);
    <p className='color: white'>{message}</p>
    console.log(`Send MSG: ${message}`);
    // socket.on('createMessage', ){
    //   recievMessage(message);
    // }
    setMessage('');
  }
  };

  return (
  <div className=' px-4 pt-4 mb-2 sm:mb-0 flex items-center'>
      <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm  focus-within:ring-indigo-600'>
        <form onSubmit={handleSubmit}>
          <TextareaAutosize
            ref = {textareaRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey){
                e.preventDefault()
                handleSubmit(); 
                console.log("This is message : ",messages)
              }
            }}
            rows={1}
            value={message}
            onChange={ (message) => setMessage(message.target.value)}
            placeholder="Type your message"
            className='block w-full resize-none border-0 rounded-lg text-black  placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
            />
          <div onClick={() => textareaRef.current?.focus()} className='py-2 ' aria-hidden='true'>
            <div className='py-px'>
              <div className='h-9' />
          </div>
            </div>
          <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
            <div className='flex-shrin-0'>
              <Button className='ml-3' type='submit' />
            </div>
          </div>
        </form>
      </div>
  </div>
  );
};

export default ChatInput;
