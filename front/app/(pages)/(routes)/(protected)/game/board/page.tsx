"use client";
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation';
import {MyContext} from '@/components/game/tools/ModeContext';
import {useContext} from "react";
import io from 'socket.io-client';
import {Padel, Ball, NewGame, Board} from '@/components/game/interfaces/data'
import PlayerInfo from '@/components/game/elements/PlayerInfo';
import Loading from './loading';

export default function page() {

  const router = useRouter();
  const mode = useContext(MyContext);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const boardSize = useRef({width: 0, height: 0});
  const mypadel = useRef({x: 0, y: 0, side: 'left'});
  const oppadel = useRef({x: 0, y: 0, side: 'right'});
  const ball = useRef({x: 0, y: 0});
  const [isChanged, newChange] = useState(0);
  const [scores, setScores] = useState({lscore:0, rscore:0});
  const [loaded, isLoaded] = useState(false);
  // const {serBoard, updateSerBoard} = useState({width: 0, height: 0});

  const setBoardSize = () => {
    const canvas = canvasRef.current!;
    const parent = parentRef.current!;
    const { width, height } = parent.getBoundingClientRect();
    boardSize.current = {width:Math.round(width), height: Math.round(height)};
    canvas.width = boardSize.current.width;
    canvas.height = boardSize.current.height;
    newChange(prev => prev + 1);
  };

  const  repaintCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, boardSize.current.width, boardSize.current.height);
    const img = new Image(boardSize.current.width, boardSize.current.height);
    img.src = '/game/bg1.png';
    ctx.drawImage(img, 0, 0, boardSize.current.width, boardSize.current.height);
    ctx.fillStyle = "Gray";
    ctx.fillRect(mypadel.current.x, mypadel.current.y, 15, 100);
    ctx.fillRect(oppadel.current.x, oppadel.current.y, 15, 100);
    drawCircle(ball.current.x, ball.current.y, 10);
  }

  const drawCircle = (x:number, y:number, radius:number) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
  }

  const handleArrowKeys = (event:any) => {
    if (event.key == 'ArrowUp' && mypadel.current.y != 0) 
    {
      if(mypadel.current.y - 50 > 0)
        mypadel.current.y -= 50;
      else
        mypadel.current.y = 0;
      newChange(prev => prev + 1);
    }
    else if(event.key == 'ArrowDown' && mypadel.current.y + 100 != boardSize.current.height)
    {
      if(mypadel.current.y + 150 < boardSize.current.height)
        mypadel.current.y += 50;
      else
        mypadel.current.y = boardSize.current.height - 100;
      newChange(prev => prev + 1);
    }
  }


  useEffect( () => {
    if (!mode.contextValue.modeChoosed)
      router.replace('/game');
    setBoardSize();
    window.addEventListener('resize', setBoardSize);
    window.addEventListener('keydown', handleArrowKeys);
    return () => {
      window.removeEventListener('resize', setBoardSize);
      window.removeEventListener('keydown', handleArrowKeys);
    }
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:3001/game', { transports : ['websocket'] });
    const sendData = () => {
      socket.emit('updateRoom', Math.round((mypadel.current.y * 500) / boardSize.current.height));
    };
    if (mode.contextValue.type == "bot")
      socket.emit('newGameBot');
    else
      socket.emit('newGamePlayer');
    socket.on('goback', (reason: string) => {
      window.alert(reason);
      router.replace('/game');
    });
    socket.on('updatePlayer', (board: Board) => {
      ball.current = {
        x: Math.round((board.ball.x * boardSize.current.width) / 1000),
        y: Math.round((board.ball.y * boardSize.current.height) / 500),
      };
      if (oppadel.current.side == 'left')
        oppadel.current.y = Math.round((board.lpadel * boardSize.current.height) / 500);
      else
        oppadel.current.y = Math.round((board.rpadel * boardSize.current.height) / 500);
      setScores({lscore:board.lscore, rscore: board.rscore});
      newChange(prev => prev + 1);
    });
    var timer:any;
    socket.on('roomCreated', (side: string)=> {
      if(side == 'left') {
        mypadel.current.x = 0;
        oppadel.current.x = boardSize.current.width - 15;
      }
      else {
        mypadel.current.x = boardSize.current.width - 15;
        mypadel.current.side = 'right';
        oppadel.current.x = 0;
        oppadel.current.side = 'left';
      }
      timer = setInterval(sendData, 5);
      isLoaded(prev => prev = true);
      newChange(prev => prev + 1);
    });
    return () => {
      socket.disconnect();
      clearInterval(timer);
    };
  }, []);


  useEffect( () => {
    repaintCanvas();
    return () => {
    }
  }, [isChanged, loaded]);

  return (
    <div className='h-full w-full bg-[#16304b] flex-col'>
      <div className='w-full h-[20%] border border-white/25 grid grid-cols-1 sm:grid-cols-2'>
        <li>
          Left player score: {scores.lscore}
        </li>
        <li>
          Right player score: {scores.rscore}
        </li>
      </div>
      <div ref={parentRef} className='w-full h-[80%] border border-white/25'>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
