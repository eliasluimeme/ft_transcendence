import SideBar from "../../../../../components/ui/chatcompo/sideBar";
import "@/app/(pages)/(routes)/(protected)/game/style.css";
import { Toaster } from "react-hot-toast";

export default function Chat({ children }: { children: React.ReactNode }) {
  return (

    <div className="h-full w-full font-Goldman flex justify-around bg-[#36393E] rounded-lg ">
      <div className="flex items-center justify-around space-x-3 w-full h-full">
        <div className="flex  w-[280px] h-[85%] justify-center   rounded-lg bg-[#36393E]">
          <SideBar />
        </div>
        <div className=" rounded-lg border w-[70%] h-[85%] flex-1 justify-between max-h-[calc(200vh-6rem)]">
          <main className="h-full w-full">{children}</main>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
