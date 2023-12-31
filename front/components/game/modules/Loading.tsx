import React from 'react'
import { useRouter } from 'next/navigation';
import { socket } from '@/components/game/tools/SocketCtxProvider';

const Loading = (props:any) => {
  const router = useRouter();

  const cancelMatching = () => {
    socket.emit("cancelMatching");
    router.push("/game");
  };

  return (
   <div 
       className="flex items-center justify-center"
       style={{
       backgroundImage: "url('https://media1.giphy.com/media/32wMmUlL8th2tRCLBl/giphy.gif?cid=ecf05e47u44pvnj00ygrl4o1dhjcv1l6ltqicvuj8cfodngb&ep=v1_gifs_related&rid=giphy.gif&ct=g')",
       backgroundSize: "cover",
       backgroundPosition: "center",
       backgroundRepeat: "no-repeat",
       backgroundBlendMode : "screen"
       }}>
      <div className="flex justify-center items-center h-screen">
        <button onClick={cancelMatching} className="bg-gray-700 hover:bg-white/25 text-white font-bold py-4 px-10 rounded">Cancel</button>
      </div>
    </div>
  )
}

export default Loading