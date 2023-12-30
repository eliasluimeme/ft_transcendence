import React, {useContext, useEffect, useRef, useState} from 'react'
import BoardLeftSide from '../elements/BoardLeftSide';
import BoardRightSide from '../elements/BoardRightSide';
import {BoardInfo} from '@/components/game/interfaces/data';

const Room = (props:any) => {
  const socket = props.socket;
  const opp = {userName: props.data.oppName, photo: props.data.oppPhoto};
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const boardSize = useRef({width: 0, height: 0});
  const mypadel = useRef({x: 0, y: 0});
  const oppadel = useRef({x: 0, y: 0});
  const ball = useRef({x: 0, y: 0});
  const [isChanged, newChange] = useState(0);
  const [scores, setScores] = useState({lscore:0, rscore:0});
  // const {serBoard, updateSerBoard} = useState({width: 0, height: 0});

  const setBoardSize = () => {
    const canvas = canvasRef.current!;
    const parent = parentRef.current!;
    const { width, height } = parent.getBoundingClientRect();
    boardSize.current = {width:Math.round(width), height: Math.round(height)};
    canvas.width = boardSize.current.width;
    canvas.height = boardSize.current.height;
    if (props.me.side == 'left')
      oppadel.current.x = boardSize.current.width - 15;
    else
      mypadel.current.x = boardSize.current.width - 15;
    newChange(prev => prev + 1);
  };

  const  repaintCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, boardSize.current.width, boardSize.current.height);
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
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 1;
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
    var timer:any;
    setBoardSize();
    window.addEventListener('resize', setBoardSize);
    window.addEventListener('keydown', handleArrowKeys);
    if(props.me.side == 'left') {
      mypadel.current.x = 0;
      oppadel.current.x = boardSize.current.width - 15;
    }
    else {
      mypadel.current.x = boardSize.current.width - 15;
      oppadel.current.x = 0;
    }
    const sendData = () => {
      socket.emit('updateRoom', Math.round((mypadel.current.y * 500) / boardSize.current.height));
    };
    socket.on('updatePlayer', (board: BoardInfo) => {
      ball.current = {
        x: Math.round((board.ball.x * boardSize.current.width) / 1000),
        y: Math.round((board.ball.y * boardSize.current.height) / 500),
      };
      if (props.me.side != 'left')
        oppadel.current.y = Math.round((board.lpadel * boardSize.current.height) / 500);
      else
        oppadel.current.y = Math.round((board.rpadel * boardSize.current.height) / 500);
      setScores({lscore:board.lscore, rscore: board.rscore});
      newChange(prev => prev + 1);
    });
    timer = setInterval(sendData, 16);
    return () => {
      window.removeEventListener('resize', setBoardSize);
      window.removeEventListener('keydown', handleArrowKeys);
      clearInterval(timer);
    }
  }, []);
  
  useEffect( () => {
    repaintCanvas();
    return () => {
    }
  }, [isChanged]);
  
  return (
    <div className='h-full w-full flex-col'>
      <div className='w-full hidden md:grid grid-cols-2 fixed  top-[calc(50%-50px)]'>
        {props.me.side == "left" ? <BoardLeftSide user={props.me} score={scores.lscore}/> : <BoardLeftSide user={opp} score={scores.lscore}/>}
        {props.me.side == "left" ?  <BoardRightSide user={opp} score={scores.rscore}/> : <BoardRightSide user={props.me} score={scores.rscore}/>}
      </div>
      <div ref={parentRef} className=' w-full h-full relative z-10'>
        <canvas ref={canvasRef} className='border-2 border-[#fff] h-full'></canvas>
      </div>
    </div>
  )
}

export default Room
