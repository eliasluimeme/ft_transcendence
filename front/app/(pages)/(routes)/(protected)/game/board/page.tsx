"use client";
import Loading from "@/components/game/modules/Loading";
import Results from "@/components/game/modules/Results";
import Room from "@/components/game/modules/Room";
import { useEffect, useState, useRef, useContext} from "react";
import { SocketContext, ModeContext } from "@/components/game/tools/Contexts";
import { useRouter } from 'next/navigation'
import axios from "axios";


export default function Page() {
  const [status, setStatus] = useState(0);
  const socket = useContext(SocketContext);
  const modectx = useContext(ModeContext);
  const ismounted = useRef(false);
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
    if (modectx.mode == "")
      router.push("/game")
    if (socket) {
        if(modectx.mode == "friend")
          socket.emit("joinGame");
        else if (modectx.mode == "bot")
        {
          socket.emit("newBotGame", "1");
          console.log("dkhlt");
        }
        else if(modectx.mode == "random")
        {
          socket.emit("newRandomGame", '');
          console.log("ah dkhlt hna");
        }

        socket.on('goback', (reason: string) => {
          gameRslts.current = reason;
          router.push("/game");
        });

        socket.on('roomCreated', (data:any) => {
          fetchData();
          console.log("bdat lgame");
          me.current.side = data.side;
          setSelf(me.current);
          setData(data);
          setStatus(1);
        });

        return (() => {
          console.log("ah dkhlt hna");
        });
    }
    return;
  }, []);

  if (!socket)
    return;
  else if(status == 0)
    return(<Loading socket={socket} setStatus={(msg:number) => changeModule(msg)}/>);
  else if(status == 1)
    return(<Room socket={socket} data={data} me={self}/>);
  else if (status == 2)
    return(<Results rslt={gameRslts} setStatus={(msg:number) => changeModule(msg)} />);
};
