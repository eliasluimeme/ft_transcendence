import { url } from "inspector";
import SideBar from "../components/sideBar";
import Image from  'next/image'
import Conversation from "../components/conversation";
import ChatInput from "../components/ChatInput";
import Messages from "../components/Messages";

function Chat (){

    return (
    <div className="h-full rounded-lg  font-alfa-slab flex relative ">
      <div
        className="w-[30%] rounded-lg bg-[#36393E] m-5  max-h-[calc(100vh-6rem)]"
        >
        <SideBar />
      </div>
      <div className="w-[70%] rounded-xl m-5 flex-1 justify-between flex flex-col max-h-[calc(100vh-6rem)]"
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
          <Messages initialMessages={[]} sessionId={""} chatId={""} sessionImg={undefined} chatPartner={''} />
          <ChatInput />
          {/* <Conversation /> */}
      </div>
    </div>
  );
    }

export default Chat;
