"use client";
import Loading from "@/components/game/modules/Loading";
import Results from "@/components/game/modules/Results";
import Room from "@/components/game/modules/Room";
import Settings from "@/components/game/modules/Settings";
import { useEffect, useState, useRef, useContext} from "react";
import { MyContext } from "@/components/game/tools/ModeContext";
import { useRouter } from 'next/navigation'
import axios from "axios";
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function page() {
  const [status, setStatus] = useState(0);
  //const mode = useContext(MyContext);
  //const socket = mode.contextValue.socket;
  const ld = useRef(false);
  const [socket, setSocket] = useState<any>(null);
  const [data, setData] = useState<any>();
  const [self, setSelf] = useState<any>();
  const me = useRef({side: 'left', userName: "", photo: ""});
  const router = useRouter();
  const gameRslts = useRef<string>();
  const changeModule = async (status:number) => {
    setStatus(prev => prev = status);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/settings", {
        withCredentials: true,
      });
      if (response.status === 200) {
        me.current.userName = response.data.userName;
        me.current.photo = response.data.photo;
      } else {
        console.log("failed to fetchdata");
      }
    } catch (error) {
      router.push("/Login");
      console.error("An error occurred while fetching user data:", error);
    }
  };

  useEffect( () => {
    console.log("ana kayn f page");
    if (!ld.current) {
      setSocket(io('http://localhost:3001/game', { transports : ['websocket'] }));
      ld.current = true;
    }
    if (socket) {
      socket.on('goback', (reason: string) => {
        console.log("sala match");
        gameRslts.current = reason;
        router.replace('/');
      });
      socket.on('roomCreated', (data:any) => {
        console.log("room created");
        fetchData();
        me.current.side = data.side;
        setSelf(me.current);
        console.log("opp", data);
        setData(data);
        setStatus(2);
      });
      return (() => {
        console.log("rani khrjt mn page");
        socket.disconnect();
      });
    }
    return;
  }, [socket]);

  if (!socket)
    return;
  if(status == 0 && socket)
    return (<Settings socket={socket} setStatus={(msg:number) => changeModule(msg)}/>);
  else if(status == 1)
    return(<Loading socket={socket} setStatus={(msg:number) => changeModule(msg)}/>);
  else if(status == 2)
    return(<Room socket={socket} data={data} me={self}/>);
  else if (status == 3)
    return(<Results rslt={gameRslts} setStatus={(msg:number) => changeModule(msg)} />);
};
