"use client";

import ChatInput from "./ChatInput";

function ChatConv() {
  return (
    <div className="h-full w-full  grid grid-rows-6 ">
      <div className="w-full h-full row-start-1 row-span-1 flex items-center justify-center space-x-4  ">
        <div className="flex items-center justify-around w-[90%] h-[30%] bg-[#F87B3F] rounded-lg">
          <div className="text-xl">Achraf El kouch</div>
        </div>
      </div>
      <div className="w-full h-full ow-start-2 row-span-4 flex items-center justify-center">
        <div className="overflow-y-auto space-y-4 r w-[90%] h-full">
          <div className="flex items-end space-x-2">
            {/* <Avatar className="w-10 h-10">
          </Avatar> */}
            <div className="max-w-xs border rounded-lg shadow p-4">
              <p className="text-sm">
                Hello! I am your assistant. How can I assist you today?
              </p>
            </div>
          </div>
          <div className="flex items-end justify-end space-x-2">
            <div className="max-w-xs bg-blue-100 text-blue-700 rounded-lg shadow p-4">
              <p className="text-sm">I need help with a contract dispute.</p>
            </div>
            {/* <Avatar className="w-10 h-10">
          </Avatar> */}
          </div>
          <div className="flex items-end space-x-2">
            {/* <Avatar className="w-10 h-10">
          </Avatar> */}
            <div className="max-w-xs border rounded-lg shadow p-4">
              <p className="text-sm">
                I can certainly assist with that. Could you provide some more
                detail about the dispute? I can certainly assist with that.
                Could you provide some more detail about the dispute? I can
                certainly assist with that. Could you provide some more detail
                about the dispute? I can certainly assist with that. Could you
                provide some more detail about the dispute? I can certainly
                assist with that. Could you provide some more detail about the
                dispute? I can certainly assist with that. Could you provide
                some more detail about the dispute? I can certainly assist with
                that. Could you provide some more detail about the dispute? I
                can certainly assist with that. Could you provide some more
                detail about the dispute?
              </p>
            </div>
          </div>
          <div className="flex items-end space-x-2">
            {/* <Avatar className="w-10 h-10">
          </Avatar> */}
            <div className="max-w-xs border rounded-lg shadow p-4">
              <p className="text-sm">
                I can certainly assist with that. Could you provide some more
                detail about the dispute? I can certainly assist with that.
                Could you provide some more detail about the dispute? I can
                certainly assist with that. Could you provide some more detail
                about the dispute? I can certainly assist with that. Could you
                provide some more detail about the dispute? I can certainly
                assist with that. Could you provide some more detail about the
                dispute? I can certainly assist with that. Could you provide
                some more detail about the dispute? I can certainly assist with
                that. Could you provide some more detail about the dispute? I
                can certainly assist with that. Could you provide some more
                detail about the dispute?
              </p>
            </div>
          </div>
          <div className="flex items-end space-x-2">
            {/* <Avatar className="w-10 h-10">
          </Avatar> */}
            <div className="max-w-xs border rounded-lg shadow p-4">
              <p className="text-sm">
                I can certainly assist with that. Could you provide some more
                detail about the dispute? I can certainly assist with that.
                Could you provide some more detail about the dispute? I can
                certainly assist with that. Could you provide some more detail
                about the dispute? I can certainly assist with that. Could you
                provide some more detail about the dispute? I can certainly
                assist with that. Could you provide some more detail about the
                dispute? I can certainly assist with that. Could you provide
                some more detail about the dispute? I can certainly assist with
                that. Could you provide some more detail about the dispute? I
                can certainly assist with that. Could you provide some more
                detail about the dispute?
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full row-start-6 row-span-1 flex items-center justify-center">
        <div className="rounded-lg w-[90%] h-[20%]">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}

export default ChatConv;
