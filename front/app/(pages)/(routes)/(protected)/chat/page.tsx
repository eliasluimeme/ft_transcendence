"use client"

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ChatMessage from './components/ChatInput';
import ChatPage from './components/ChatInput';
import ChatInput from './components/ChatInput';
import SideBar from './components/sideBar';
import Conversation from './components/conversation';
import Layout from './components/Layaout';
import Chat from './chat/page';
import axios from 'axios';


export default function Home() {

  // const user = axios.get('http://localhost:3001/user/');
  // console.log(user);
return (
  <div>
    {/* <h1>Chat App</h1> */}
    {/* <Conversation /> */}
    {/* <SideBar />

    <ChatInput  /> */}
    {/* <Layout /> */}
    {/* <Chat /> */}
  </div>
);
}