// 'use client'
// import React, { useState, useEffect } from "react";
// import "@/app/(pages)/(routes)/(protected)/game/style.css";
// import InfoProfil from "@/components/ui/usercompo/InfoProfil";
// import Image from "next/image";
// import GameInfo from "@/components/ui/usercompo/GameInfo";
// import axios from "axios";
// // type Data = {
// //   image: string;
// //   statu: string;
// //   nickNane: string;
// //   fullName: string;
// //   rank: string;
// // };

// // type Achievement = {
// //   description: string;
// //   achieved: boolean;
// // };

// // type MatchHistory = {
// //   opo: string;
// //   statu: boolean;
// // };

// // type global = {
// //   data : Data;
// //   achivements : Achievement[];
// //   history : MatchHistory []
// // }


// const page = () => {
//     // const router = useRouter();
//     // const [global, setGlobal] = useState<global>({
//     //     data : {
//     //         image:"",
//     //         statu:"",
//     //         nickNane:"",
//     //         fullName:"",
//     //         rank:"",
//     //     },
//     //     achivements : [
//     //         { description: "", achieved: true },
//     //         { description: "", achieved: false },
//     //         { description: "", achieved: true },
//     //         { description: "", achieved: true },
//     //     ],
//     //     history : [
//     //         { opo: "", statu: true },
//     //         { opo: "", statu: false },
//     //         { opo: "", statu: true },
//     //         { opo: "", statu: true },
//     //     ],
//     // })


//     // const fetchData = async () => {
//     //     try {
//     //       const response = await axios.post("http://localhost:3001/users/search", {
//     //         withCredentials: true,
//     //       });
//     //       if (response.status === 200) 
//     //       {
//     //         setGlobal({
//     //             data : {
//     //                 image: response.data.photo,
//     //                 statu:"",
//     //                 nickNane: response.data.userName,
//     //                 fullName:response.data.fullName,
//     //                 rank:"",
//     //               },
//     //             achivements : [
//     //                 { description: "", achieved: true },
//     //                 { description: "", achieved: false },
//     //                 { description: "", achieved: true },
//     //                 { description: "", achieved: true },
//     //               ],
//     //             history : [
//     //                 { opo: "", statu: true },
//     //                 { opo: "", statu: false },
//     //                 { opo: "", statu: true },
//     //                 { opo: "", statu: true },
//     //               ],
//     //         });
//     //       }
//     //       else 
//     //       {
//     //         //console.log("failed to fetchdata");
//     //       }
//     //     } 
//     //     catch (error) 
//     //     {
//     //       //console.logor("An error occurred while fetching user data:", error);
//     //     }
//     //   };
//     //   useEffect(() => 
//     //   {
//     //     fetchData();
//     //   }, [])
//       return (
//         <div className="w-full h-full bg-[#36393E] rounded-lg font-Goldman">
//           <div className="w-full h-full rounded-lg grid grid-container place-items-center">
//             <div className=" w-[98%] h-[98%] border rounded-lg take">
//               <div className="w-full h-full grid grid-cols-12 grid-rows-2 place-items-center">
//                 <div className="w-[96%] h-[94%] info rounded-lg row-start-1 col-start-1 col-span-5 place-content-center">
//                   <InfoProfil></InfoProfil>
//                 </div>
//                 <div className="relative w-[96%] h-[94%] rounded-lg row-start-2 col-start-1 col-span-5">
//                   <Image
//                     className="rounded-lg shadow-shadoww"
//                     src="https://cdn.dribbble.com/users/944284/screenshots/3041046/media/1d0fd0b5c9b20de91501818723bd05a8.png?resize=800x600&vertical=center"
//                     alt=""
//                     sizes="(max-width: 600px) 400px,
//                     (max-width: 1200px) 800px,
//                     1200px"
//                     fill
//                   ></Image>
//                 </div>
//                 <div className="w-[97%] h-[97%] border rounded-lg row-start-1 row-span-2 col-start-6 col-span-7">
//                   <GameInfo />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       );
//     };

// export default page;