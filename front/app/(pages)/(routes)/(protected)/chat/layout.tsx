import { url } from "inspector";
import SideBar from "../../../../../components/ui/chatcompo/sideBar";
import Image from "next/image";
import Conversation from "../../../../../components/ui/chatcompo/conversation";
import ChatInput from "@/components/ui/chatcompo/ChatInput";
import ChatConv from "../../../../../components/ui/chatcompo/ChatConv";
import "@/app/(pages)/(routes)/(protected)/game/style.css";

export default function Chat({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full font-Goldman flex justify-around bg-[#36393E] rounded-lg ">
      <div className="flex items-center justify-around space-x-3 w-full h-full">
        {/* <div className="w-full h-full rounded-lg grid grid-container ">
        <div className="w-full h-full rounded-lg take ">
          <div className="w-full h-full grid grid-cols-6 "> */}
        <div className="flex  w-[25%] h-[85%] justify-center   rounded-lg bg-[#36393E]">
          <SideBar />
        </div>
        <div className=" rounded-lg border w-[70%] h-[85%] flex-1 justify-between max-h-[calc(200vh-6rem)]">
          <main className="h-full w-full">{children}</main>
        </div>
      </div>
    </div>
    //     </div>
    //   </div>
    // </div>
  );
}

// export default Chat;
