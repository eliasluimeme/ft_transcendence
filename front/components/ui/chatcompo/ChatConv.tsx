"use client";

import ChatInput from "./ChatInput";
import { HiDotsVertical } from "react-icons/hi";
import { FaGamepad } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useState, useEffect } from "react";
import internal from "stream";
import { StaticRequire } from "next/dist/shared/lib/get-img-props";
import axios from "axios";
import { useRouter } from 'next/router';
interface Members {
  id: number;
  nickname: string;
  memberImage: string;
}

function ChatConv(id : string | null) {
  console.log("id",id);
  /////////////////end point to get rol/////////////////////////////
  const [rol, setrol] = useState(true);
  const fetchrol = async () => {
    try {
      const response = await axios.get("http://localhost:3001/chat/settings/role",
      {
        withCredentials: true,
        params : {
          id: id,
        }
      },
      );
      if (response.status === 200) {
        if(response.data.role === "OWNER" || response.data.role === "ADMIN")
          setrol(true);
        else 
          setrol(false);
      } else {
        console.log("Failed to fetch member data");
      }
    } catch (error) {
      console.error("An error occurred while fetching member data:", error);
    }
  };
  useEffect(() => {
    fetchrol();
  }, [id]);

  /////////////////end point to get owner image/////////////////////////////
  const [Owner, OwnerImage] = useState<string>(
  );
  
  const [admins, setAdmines] = useState<string[]>([
  ]);
  const fetchownerimage = async () => {
    try {
      const response = await axios.get("http://localhost:3001/chat/settings/staff",
      {
        withCredentials: true,
        params : {
          id: id,
        }
      },
      );
      if (response.status === 200) {
        console.log("tkharbi9a", response.data)
        OwnerImage(response.data.owner.photo);
        const adminPhotos: string[] = response.data.admins.map((admin: any) => admin.photo);
        console.log("test allah allah", adminPhotos);
        setAdmines(adminPhotos);
      } else {
        console.log("Failed to fetch member data");
      }
    } catch (error) {
      console.error("An error occurred while fetching member data:", error);
    }
  };
  useEffect(() => {
    fetchownerimage();
  }, [id]);

  /////////////////////////end point to get admines images////////////////////

  // const fetchadminesimage = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3001/", {
  //       withCredentials: true,
  //     });
  //     if (response.status === 200) {
  //       const newAdmines: string[] = response.data.map((admines: any) => ({
  //         image: admines.image,
  //       }));
  //       setAdmines(newAdmines);
  //     } else {
  //       console.log("Failed to fetch member data");
  //     }
  //   } catch (error) {
  //     console.error("An error occurred while fetching member data:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchadminesimage();
  // }, []);

  const [muteStatue, setMuteStatu] = useState<boolean>(false);
  const [admine, setAdmine] = useState<boolean>(false);

  //////////endpoint to get all memebres in room exept admines and owner////////////////
  const [members, setMembers] = useState<Members[]>([
  ]);
  const [exist, setexist] = useState<boolean>(false);
  //////////////////////////fetching memebers data///////////////////////////////
  const fetchmemberdata = async () => {
    try {
      const response = await axios.get("http://localhost:3001/chat/settings/members", 
      {
        withCredentials: true,
        params : {
          id: id,
        }
      },
      );
      if (response.status === 200) {
        const newMembers: Members[] = response.data.map((member: any) => ({
          id: member.id,
          nickname: member.userName, // Assuming userName is mapped to nickname
          memberImage: member.photo, // Assuming photo is mapped to memberImage
        }));
        setMembers(newMembers);
      } else {
        console.log("Failed to fetch member data");
      }
    } catch (error) {
      console.error("An error occurred while fetching member data:", error);
    }
  };
  useEffect(() => {
    fetchmemberdata();
  }, [exist, id]);
  ///////////////////////////////////////////////////////////////////////////

  //////////end point to get mutestatue and adminestatus//////////////
  const fetchMuteAndAdmine = async (id: number) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/",
        {
          id,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setMuteStatu(response.data.mute);
        setAdmine(response.data.admine);
      } else {
        console.log("Failed to fetch member data");
      }
    } catch (error) {
      console.error("An error occurred while fetching member data:", error);
    }
  };

  const [data, setData] = useState<Members>();

  function makeModifications(memberdata: Members) {
    // fetchMuteAndAdmine(memberdata.id);
    setexist(true);
    setData({
      id: memberdata.id,
      nickname: memberdata.nickname,
      memberImage: memberdata.memberImage,
    });
  }

  /////////endpoint to post mute statue//////////////

  const postmute = (id: number | undefined) => {
    const sendmute = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/",
          {
            id,
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 201) {
          setMuteStatu(response.data);
        } else {
          console.log("Failed to fetch friendship data");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching friendship data:",
          error
        );
      }
    };
    setexist(false);
  };
  /////////endpoint to post kick//////////////
  const postkick = (id: number | undefined) => {
    const sendkick = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/",
          {
            id,
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 201) {
        } else {
          console.log("Failed to fetch friendship data");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching friendship data:",
          error
        );
      }
    };
    setexist(false);
  };
  /////////endpoint to post  ban//////////////
  const postban = (id: number | undefined) => {
    const sendban = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/",
          {
            id,
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 201) {
        } else {
          console.log("Failed to fetch friendship data");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching friendship data:",
          error
        );
      }
    };
    setexist(false);
  };
  /////////endpoint to post adminestatue//////////////
  const postadmine = (id: number | undefined) => {
    const sendadmine = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/",
          {
            id,
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 201) {
          setAdmine(response.data);
        } else {
          console.log("Failed to fetch friendship data");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching friendship data:",
          error
        );
      }
    };
    setexist(false);
  };
  /////////endpoint to post leaving room//////////////
  const posleave = (id: number | undefined) => {
    const sendleave = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/",
          {
            id,
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 201) {
        } else {
          console.log("Failed to fetch friendship data");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching friendship data:",
          error
        );
      }
    };
    setexist(false);
  };

  //////////////////ADD Freind//////////////////////////////
  const [frdName, setfrName] = useState("");
  const handleFrNme = (event: React.ChangeEvent<HTMLInputElement>) => {
    setfrName(event.target.value);
  };

  const send_data = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/",
        {
          frdName,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
      } else {
        console.log("Failed to fetch friendship data");
      }
    } catch (error) {
      console.error("An error occurred while fetching friendship data:", error);
    }
  };

  return (
    <div className="h-full w-full  grid grid-rows-6 ">
      <div className="w-full h-full row-start-1 row-span-1 flex items-center justify-center space-x-4  ">
        <div className=" w-[90%] h-[30%] bg-[#F87B3F] rounded-lg grid grid-cols-3">
          <div className="text-xl text-[12px] col-start-1 col-span-1 flex items-center">
            <button className="ml-[5px] text-opacity-[30%] hover:text-opacity-[100%]">
              Achraf El kouch
            </button>
          </div>
          <div className="col-start-3 col-span-1 flex justify-end space-x-5 items-center mr-[8px]">
            <button className="w-[50px] border flex items-center justify-center rounded-lg bg-[#36393E] bg-opacity-25 hover:bg-opacity-60">
              <FaGamepad />
            </button>
            <Popover>
              <PopoverTrigger className="w-[20px] flex items-center justify-center  ">
                <HiDotsVertical className="" />
              </PopoverTrigger>
              <PopoverContent className="w-[500px]  bg-[#1E2124] text-white">
                {rol ? (
                  <div className="space-y-4">
                    {/* ///////////////////room owner/////////////////// */}
                    <div className="flex items-center justify-center space-x-6 border bg-[#F87B3F] rounded-lg">
                      <div>Owner :</div>
                      <Avatar className="">
                        <AvatarImage src={Owner} />
                        <AvatarFallback>owner image</AvatarFallback>
                      </Avatar>
                    </div>
                    {/* ///////////////////////////////////////////// */}
                    {/* ///////////////room Admines////////////////////////////// */}
                    <div className="flex justify-center items-center space-x-3  border-b h-[80px]">
                      <div>Admins :</div>
                      {admins.map((adminImageUrl, index) => (
                        <div key={index}>
                          <Avatar className="">
                            <AvatarImage src={adminImageUrl} />
                            <AvatarFallback>{`Admin ${
                              index + 1
                            }`}</AvatarFallback>
                          </Avatar>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-[4px]">
                        <Popover>
                          <PopoverTrigger className="border w-[30%] h-[30px] rounded-lg text-[10px] text-white">
                            Members
                          </PopoverTrigger>
                          <PopoverContent className=" w-[100px]">
                            {members.map((memberdata, index) => (
                              <button
                                key={index}
                                onClick={() => makeModifications(memberdata)}
                              >
                                {memberdata.nickname}
                              </button>
                            ))}
                          </PopoverContent>
                        </Popover>
                      </div>
                      {exist ? (
                        <div className="flex flex-col space-y-4 items-center justify-center">
                          <div className="w-[70px] h-[70px] flex items-center justify-center">
                            <Avatar className="">
                              <AvatarImage src={data?.memberImage} />
                              <AvatarFallback>{data?.id}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex  space-x-1 items-center justify-around">
                            <button
                              onClick={() => postmute(data?.id)}
                              className="w-[80px] bg-[#F87B3F] rounded-lg bg-opacity-50 hover:bg-opacity-100"
                            >
                              {muteStatue ? <div>unmute</div> : <div>mute</div>}
                            </button>
                            <button
                              onClick={() => postkick(data?.id)}
                              className="w-[80px] bg-[#F87B3F] rounded-lg bg-opacity-50 hover:bg-opacity-100"
                            >
                              kick
                            </button>
                            <button
                              onClick={() => postban(data?.id)}
                              className="w-[80px] bg-[#F87B3F] rounded-lg bg-opacity-50 hover:bg-opacity-100"
                            >
                              ban
                            </button>
                            {admine ? (
                              <div></div>
                            ) : (
                              <button
                                onClick={() => postadmine(data?.id)}
                                className="w-[80px] bg-[#F87B3F] rounded-lg bg-opacity-50 hover:bg-opacity-100"
                              >
                                admine
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                    {/* ///////////////////////////////////////////// */}
                    <div className="flex items-center justify-center space-x-4 border h-[50px] rounded-lg">
                      <div className="text-[14px]">ADD friend : </div>
                      <input
                        type="text"
                        value={frdName}
                        onChange={handleFrNme}
                        className="border-color: rgb(255 255 255) bg-transparent border rounded-full text-[15px]  border-gray-500 text-gray-500"
                      />
                      <div className="flex h-[30px] w-[100px] bg-[#F77B3F] bg-opacity-50 hover:bg-opacity-100 rounded-lg ">
                        <button
                          onClick={() => send_data()}
                          className="w-full h-full text-[13px]  "
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => posleave(data?.id)}
                        className="w-[80px]  rounded-lg bg-red-500 bg-opacity-50 hover:bg-opacity-100"
                      >
                        Leave
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => posleave(data?.id)}
                      className="w-[80px]  border rounded-lg bg-red-500"
                    >
                      Leave
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
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
