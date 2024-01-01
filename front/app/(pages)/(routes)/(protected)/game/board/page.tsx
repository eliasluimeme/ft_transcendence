"use client";
import Loading from "@/components/game/modules/Loading";
import Results from "@/components/game/modules/Results";
import Room from "@/components/game/modules/Room";
import { useEffect, useState, useRef, useContext} from "react";
import { SocketContext, ModeContext } from "@/components/game/tools/Contexts";
import { useRouter } from 'next/navigation'
import axios from "axios";
import {socket} from "@/components/game/tools/SocketCtxProvider"


export default function Page() {
  const [status, setStatus] = useState(0);
  const modectx = useContext(ModeContext);
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
      const response = await axios.get(`http://${process.env.NEXT_PUBLIC_BACKEND_URL}/settings`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        me.current.userName = response.data.userName;
        me.current.photo = response.data.photo;
      } else {
      }
    } catch (error) {
      router.push("/Login");
    }
  };

  useEffect(() => {
    if (modectx.mode == "")
      router.push("/game")
    if (socket) {
        if(modectx.mode == "friend")
          socket.emit("joinGame");
        else if (modectx.mode == "bot")
        {
          socket.emit("newBotGame", "1");
        }
        else if(modectx.mode == "random")
        {
          socket.emit("newRandomGame", '');
        }

        socket.on('goback', (reason: string) => {
          gameRslts.current = reason;
          setStatus(2);
        });

        socket.on('roomCreated', (data:any) => {
          fetchData();
          me.current.side = data.side;
          setSelf(me.current);
          setData(data);
          setStatus(1);
        });

        return (() => {
        });
    }
  }, []);

  if(status == 0)
    return(<Loading setStatus={(msg:number) => changeModule(msg)}/>);
  else if(status == 1)
    return(<Room data={data} me={self}/>);
  else if (status == 2)
    return(<Results rslt={gameRslts.current} setStatus={(msg:number) => changeModule(msg)} />);
};