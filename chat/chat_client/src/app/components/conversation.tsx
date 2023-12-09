
'use client'
import React, { useState } from 'react';
import styles from './Conversation.module.css';
import ChatInput from './ChatInput';
import Messages from './Messages';




interface Message {
  content: string;
}
  
  
  
  const Conversation = () => {
    
    const initialMessages = ["Hello World From Conversation 1 ..!","Hello World From Conversation 2 ..!","Hello World From Conversation 3 ..!","Hello World From Conversation 4 ..!","Hello World From Conversation 5 ..!","Hello World From Conversation 6..!","Hello World From Conversation  7 ..!","Hello World From Conversation  8 ..!","Hello World From Conversation 9 ..!","Hello World From Conversation 10 ..!",]

    // const initialMessages = ["Hello World From Conversation 1 ..!","Hello World From Conversation 2 ..!","Hello World From Conversation 3 ..!","Hello World From Conversation 4 ..!","Hello World From Conversation 5 ..!","Hello World From Conversation 6..!","Hello World From Conversation  7 ..!","Hello World From Conversation  8 ..!","Hello World From Conversation 9 ..!","Hello World From Conversation 10 ..!",]
    // const messages: Message[] = initialMessages.map((content) => ({ content }));
    const session = {
    user: {
      image: 'user-image',
      id: 'user-id'
    }
  };
const ChatId  = '1';
const chatPartner = 'ael-kouc';

  return (
    <div 
      className='flex-1 justify-between border rounded-lg flex flex-col h-full max-h-[calc(100vh-6rem)]'
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode : "screen"
      }}
        >
    {/* <Messages
        chatId={ChatId}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
        sessionId={session.user.id}
        initialMessages={initialMessages}
      /> */}
      <ChatInput  />


    </div>
  )
}
export default Conversation;







































// return(
//   // <div className="flex-1">
//   //     <ChatInput />
//   // </div>
//   <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
//   <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
//     <div className='relative flex items-center space-x-4'>

//       const Conversation = () => {
        // return (
        //   <><div className='relative'>
        //     <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
        //       <div className='text-xl flex items-center'>
        //         <span className='text-gray-700 mr-3 font-semibold'>
        //           {/* {chatPartner.name} */}
        //         </span>
        //       </div>
        //       <span className='text-sm text-gray-600'></span>
        //     </div>
        //   </div>
        //     <ChatInput />
        //   </>
        // );
        {/* <Messages
          chatId={chatId}
          chatPartner={chatPartner}
          sessionImg={session.user.image}
          sessionId={session.user.id}
          initialMessages={initialMessages}
        />{chatPartner.email} */}
        {/* <ChatInput chatId={chatId} chatPartner={chatPartner} /> */}

      // }
      // export default Conversation;
//     </div>
//   </div>

//   {/* <Messages
//     chatId={chatId}
//     chatPartner={chatPartner}
//     sessionImg={session.user.image}
//     sessionId={session.user.id}
//     initialMessages={initialMessages}
//   />{chatPartner.email} */}
//   {/* <ChatInput chatId={chatId} chatPartner={chatPartner} /> */}
//   <ChatInput />
// </div>
// )
// }























































// const Conversation = () => {
//   const [messages, setMessages] = useState([
//     {
//       sender: 'ael-kouc',
//       message: 'Donc vu que je suis trop fort j\'ai réussi à faire \
//       marcher la page de connexion et d\'inscription.',
//     },
//     {
//       sender: 'ael-kouc',
//       message: 'Sinon le html et le javascript sont ok je pense. Je l\'ai pas posté sur GitLab\
//        car j\'ai pas mon ordi portable sur moi mais je te le montrerais lundi.',
//     },
//     {
//       sender: 'ael-kouc',
//       message: 'Et toi, t\'as bientôt finis?',
//     },
//   ]);
  
//   const handleSendMessage = (event: { preventDefault: () => void; target: { message: { value: string; }; }; }) => {
//     event.preventDefault();

//     const message = event.target.message.value;

//     setMessages([...messages, {
//       sender: 'You',
//       message,
//     }]);
    
//     event.target.message.value = '';
//   };

//   return (
//     <div className={styles.conversation}>
//       <ul className={styles.list}>
//         {messages.map((message, index) => (
//           <li key={index} className={styles.message}>
//             <span className={styles.sender}>{message.sender}:</span>
//             <span className={styles.text}>{message.message}</span>
//           </li>
//         ))}
//       </ul>
//       {/* <form onSubmit={handleSendMessage} className={styles.form}>
//         <input type="text" name="message" placeholder="Write a message..." />
//         <button type="submit">Send</button>
//       </form> */}
//       {/* <ChatInput /> */}
//     </div>
//   );
// };

// export default Conversation;

// import React from 'react';
// import { useState } from 'react';
// import tw from 'twin.macro';
// import  Style  from '.conversation.module.css'


// const Conversation = () => {


//   return (
//     <div>
      
//     </div>
//   )
// };

// export default Conversation;