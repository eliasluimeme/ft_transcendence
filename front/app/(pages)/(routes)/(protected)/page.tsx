"use client";
import React, {useContext, useEffect} from "react";
import Image from "next/image";
import Redirect from "@/components/ui/homeComp/Redirect";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SocketContext, ModeContext } from "@/components/game/tools/Contexts";



const Page = () => {
  const router = useRouter();
  const socket = useContext(SocketContext);
  const mode = useContext(ModeContext);

  useEffect(() => {
    socket.off('acceptedInvite').on('acceptedInvite', (pyload: string) => {
      toast.success(`${pyload} accepted your invitation , let's play !`)
      setTimeout
      mode.updateContextValue('friend');
      router.push('/game/board');
      });
    },[]);

  const handleAccept = (pyload: any) => {
    socket.emit('acceptedInvite', pyload);
    mode.updateContextValue('friend');
    router.push('/game/board');
  };

  useEffect(() => {
    socket.off('inviteEvent').on('inviteEvent', (data : any) => {
       toast(() => (
        <span>
          <b>{data[0].senderName} invited you to play Pong ! </b>
          <button onClick={() => toast.dismiss()}
          className="border bg-red-500 rounded-ls px-5 py-1"
          >
            Dismiss
          </button>
          <button onClick={() => handleAccept(data[1])}
          className="border bg-green-500 rounded-ls  px-5 py-1"
          >
            Accept
          </button>
        </span>
      ));
    });
    
  }, []);

  return (
    <div className="w-full h-full bg-[#36393E] rounded-lg grid grid-cols-2 font-Goldman">
      <div className="col-start-1 flex items-center justify-center">
        <div className="border bg-transparent rounded-lg w-[70%] h-[75%] grid grid-rows-6">
          <div className="row-start-1 row-span-1 rounded-lg w-full h-full flex items-center justify-center">
            <div className="border w-[95%] h-[90%] rounded-lg flex flex-col items-center justify-center">
              <div>Sometimes you re the paddle,</div>
              <div> sometimes you re the ball.</div>
            </div>
          </div>
          <div className="row-start-2 row-span-5 rounded-lg w-full h-full flex items-center justify-center">
            <div className="border w-[95%] h-[95%] rounded-lg flex items-center justify-center">
              <div className="w-[30%] h-[55%] absolute rounded-lg border">
                <Image
                  src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/c6a51e183973865.65499ead1b388.jpg"
                  alt=""
                  sizes="(max-width: 600px) 400px,
                  (max-width: 1200px) 800px,
                  1200px"
                  fill
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-start-2 w-[100%] h-[100%] flex flex-col space-y-8 items-center justify-center">
        <Redirect
          linking="/game"
          className="w-[80%] h-[15%]"
          withImage="w-[65%]"
          textSize="text-[30px]"
          image="https://mir-s3-cdn-cf.behance.net/project_modules/fs/817c82156391081.636639add525d.jpg"
          description="Start Playing !"
        />
        <Redirect
          linking="chat"
          className="w-[80%] h-[15%]"
          withImage="w-[65%]"
          textSize="text-[30px]"
          image="https://cdn.dribbble.com/users/925722/screenshots/4273859/media/59376566e04f5c66ed8e4b4df257f2af.png?resize=800x600&vertical=center"
          description="Talk With Friends !"
        />
        <Redirect
          linking="profile"
          className="w-[80%] h-[15%]"
          withImage="w-[65%]"
          textSize="text-[30px]"
          image="https://mir-s3-cdn-cf.behance.net/project_modules/fs/f54ef3183928787.6548ebe95aadc.jpg"
          description="Your Progression"
        />
      </div>
      <Toaster />
    </div>
  );
};

export default Page;
