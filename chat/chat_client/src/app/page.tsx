
// export default function Home() {
//   return (
//     <div className="text-red-500 font-bold underline">
//       Hello world!
//     </div>
    
//   )
// }
"use client"

import React, { useState } from 'react';
import ChatInput from '@/app/components/ChatInput'
import ChatMessages from '@/app/components/ChatMessage';

const Home = () => {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message) => {
    console.log(messages);
    setMessages([...messages, message]);
  };

  return (
    <div>
      <h1>Chat App</h1>
      {/* <ChatMessages messages={messages} /> */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Home;
