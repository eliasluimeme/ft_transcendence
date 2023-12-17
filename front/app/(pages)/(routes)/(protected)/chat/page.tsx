import { url } from "inspector";
import SideBar from "../../../../../components/ui/sideBar";
import Image from  'next/image'
import Conversation from "../../../../../components/ui/conversation";
import ChatInput from "@/components/ui/ChatInput";
import ChatConv from "../../../../../components/ui/ChatConv";


function Chat (){

    return (
    <div className="h-full rounded-lg  font-alfa-slab flex relative ">
      <div
        className="w-[30%] border rounded-lg bg-[#36393E] m-5  max-h-[calc(100vh-6rem)]"
        >
        <SideBar />
      </div>
      <div className="w-[70%] rounded-xl border m-5 flex-1 justify-between flex flex-col max-h-[calc(100vh-6rem)]"
      style={{
        // backgroundImage: "url('/icons/gif/giphy.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode : "screen"
      }}
      >
        {/* <div>
        </div> */}
          {/* <Messages initialMessages={[]} sessionId={""} chatId={""} sessionImg={undefined} chatPartner={''} /> */}
          <ChatConv />
          {/* <ChatInput /> */}
          {/* <Conversation /> */}
      </div>
    </div>
  );
    }

export default Chat;
