'use client'

import ChatInput from "./ChatInput"

function ChatConv() {
  return (
    <div className=" h-screen flex flex-col">
      <header className="shadow  p-4">
        <h1 className="text-xl font-bold">Achraf El kouch</h1>
      </header>
      <main 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          // backgroundImage: "url('https://i.pinimg.com/736x/85/04/30/850430a750fb80c1ebaa5e740fc7cbd6.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode : "screen"
        }}
      >
        <div className="flex items-end space-x-2">
          {/* <Avatar className="w-10 h-10">
          </Avatar> */}
          <div className="max-w-xs border rounded-lg shadow p-4">
            <p className="text-sm">Hello! I am your assistant. How can I assist you today?</p>
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
              I can certainly assist with that. Could you provide some more detail about the dispute?
              I can certainly assist with that. Could you provide some more detail about the dispute?
              I can certainly assist with that. Could you provide some more detail about the dispute?
              I can certainly assist with that. Could you provide some more detail about the dispute?
              I can certainly assist with that. Could you provide some more detail about the dispute?
              I can certainly assist with that. Could you provide some more detail about the dispute?
              I can certainly assist with that. Could you provide some more detail about the dispute?
              I can certainly assist with that. Could you provide some more detail about the dispute?
            </p>
          </div>
          
        </div>
        
      </main>
      <footer className="rounded-lg p-4">
        {/* <form className="flex space-x-2"> */}
          {/* <Input className="flex-1 rounded-lg border-gray-300 shadow-sm" placeholder="Type a message..." />
          <Button className="bg-blue-500 text-white" variant="solid">
            Send
          </Button> */}
          <ChatInput />
        {/* </form> */}
      </footer>
    </div>
  )
}

export default ChatConv;