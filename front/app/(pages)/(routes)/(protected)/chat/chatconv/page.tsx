// import ChatInput from "@/components/ui/chatcompo/ChatInput";
// import Messages from "@/components/ui/chatcompo/Messages";
// import { Image } from "lucide-react";
// import { FC } from "react";

// interface pageProps {}

// async function getConversation(dmId: number) {
//   try {
//     const response = await fetch(`http://localhost:3001/endpoint/${dmId}`); // TODO: change endpoint
//     const res: string[] = await response.json();

//     const dbMessages = res.map((message) => JSON.parse(message) as Message);

//     const reversedDbMessages = dbMessages.reverse();
//     return reversedDbMessages;
//   } catch (error) {
//     console.log(error);
//   }
// }

// const page: FC<pageProps> = ({}) => {
//   const initialMessages = getConversation(1);
//   return (
//     // <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
//     //   <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
//     //     <div className='relative flex items-center space-x-4'>
//     //       <div className='relative'>
//     //         <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
//     //           <Image
//     //             src={chatPartner.image}
//     //             alt={`${chatPartner.name} profile picture`}
//     //             className='rounded-full'
//     //           />
//     //         </div>
//     //       </div>

//     //       <div className='flex flex-col leading-tight'>
//     //         <div className='text-xl flex items-center'>
//     //           <span className='text-gray-700 mr-3 font-semibold'>
//     //             {chatPartner.name}
//     //           </span>
//     //         </div>

//     //         <span className='text-sm text-gray-600'>{chatPartner.email}</span>
//     //       </div>
//     //     </div>
//     //   </div>

//     //   <Messages
//     //     chatId={chatId}
//     //     chatPartner={chatPartner}
//     //     sessionImg={session.user.image}
//     //     sessionId={session.user.id}
//     //     initialMessages={initialMessages}
//     //   />
//     //   <ChatInput chatId={chatId} chatPartner={chatPartner} />
//     // </div>
//     <div
//       className="rounded-xl border m-5 flex-1 justify-between flex flex-col max-h-[calc(100vh-6rem)]"
//       style={{
//         // backgroundImage: "url('/icons/gif/giphy.gif')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         backgroundBlendMode: "screen",
//       }}
//     >
//       <header className="shadow p-4">
//         <h1 className="text-xl font-bold">Legal Consultation Bot</h1>
//       </header>
//       <main className="flex-1 overflow-y-auto p-4 space-y-4">
//         <div className="flex items-end space-x-2">
//           {/* <Avatar className="w-10 h-10">
//             <AvatarImage alt="Bot Avatar" src="/placeholder.svg?height=100&width=100" />
//             <AvatarFallback>LB</AvatarFallback>
//           </Avatar> */}
//           <div className="max-w-xs border rounded-lg shadow p-4">
//             <p className="text-sm">
//               Hello! I am your legal bot assistant. How can I assist you today?
//             </p>
//           </div>
//         </div>
//         <div className="flex items-end justify-end space-x-2">
//           <div className="max-w-xs bg-blue-100 text-blue-700 rounded-lg shadow p-4">
//             <p className="text-sm">I need help with a contract dispute.</p>
//           </div>
//           {/* <Avatar className="w-10 h-10">
//             <AvatarImage alt="User Avatar" src="/placeholder.svg?height=100&width=100" />
//             <AvatarFallback>UA</AvatarFallback>
//           </Avatar> */}
//         </div>
//         <div className="flex items-end space-x-2">
//           {/* <Avatar className="w-10 h-10">
//             <AvatarImage alt="Bot Avatar" src="/placeholder.svg?height=100&width=100" />
//             <AvatarFallback>LB</AvatarFallback>
//           </Avatar> */}
//           <div className="max-w-xs border rounded-lg shadow p-4">
//             <p className="text-sm">
//               I can certainly assist with that. Could you provide some more
//               detail about the dispute? I can certainly assist with that. Could
//               you provide some more detail about the dispute? I can certainly
//               assist with that. Could you provide some more detail about the
//               dispute? I can certainly assist with that. Could you provide some
//               more detail about the dispute? I can certainly assist with that.
//               Could you provide some more detail about the dispute? I can
//               certainly assist with that. Could you provide some more detail
//               about the dispute? I can certainly assist with that. Could you
//               provide some more detail about the dispute? I can certainly assist
//               with that. Could you provide some more detail about the dispute?
//             </p>
//           </div>
//         </div>
//         <footer className=" rounded-lg ">
//           {/* <form className="flex space-x-2"> */}
//           {/* <Input className="flex-1 rounded-lg border-gray-300 shadow-sm" placeholder="Type a message..." />
//           <Button className="bg-blue-500 text-white" variant="solid">
//             Send
//           </Button> */}
//           <ChatInput />
//           {/* </form> */}
//         </footer>
//       </main>
//     </div>
//   );
// };

// export default page;
'use client'
import React from "react";
import "@/app/(pages)/(routes)/(protected)/game/style.css";
import ChatConv from "@/components/ui/chatcompo/ChatConv";
import { useSearchParams } from "next/navigation";

const Page = () => {
const search = useSearchParams();
const id = search.get('id');
// const name = search.get('name');
// const image = search.get('image');
// console.log('id ======= ',id);
// console.log('name ======= ',name);
// console.log('image ======= ',image);
  return (
    <div className="w-full h-full">
      <ChatConv id={id}/>
    </div>
  );
};

export default Page;
