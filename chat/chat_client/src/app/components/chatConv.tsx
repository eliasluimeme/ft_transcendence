'use client'
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">Legal Consultation Bot</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-end space-x-2">
          <Avatar className="w-10 h-10">
            <AvatarImage alt="Bot Avatar" src="/placeholder.svg?height=100&width=100" />
            <AvatarFallback>LB</AvatarFallback>
          </Avatar>
          <div className="max-w-xs bg-white rounded-lg shadow p-4">
            <p className="text-sm">Hello! I'm your legal bot assistant. How can I assist you today?</p>
          </div>
        </div>
        <div className="flex items-end justify-end space-x-2">
          <div className="max-w-xs bg-blue-100 text-blue-700 rounded-lg shadow p-4">
            <p className="text-sm">I need help with a contract dispute.</p>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarImage alt="User Avatar" src="/placeholder.svg?height=100&width=100" />
            <AvatarFallback>UA</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-end space-x-2">
          <Avatar className="w-10 h-10">
            <AvatarImage alt="Bot Avatar" src="/placeholder.svg?height=100&width=100" />
            <AvatarFallback>LB</AvatarFallback>
          </Avatar>
          <div className="max-w-xs bg-white rounded-lg shadow p-4">
            <p className="text-sm">
              I can certainly assist with that. Could you provide some more detail about the dispute?
            </p>
          </div>
        </div>
      </main>
      <footer className="bg-white shadow p-4">
        <form className="flex space-x-2">
          <Input className="flex-1 rounded-lg border-gray-300 shadow-sm" placeholder="Type a message..." />
          <Button className="bg-blue-500 text-white" variant="solid">
            Send
          </Button>
        </form>
      </footer>
    </div>
  )
}

