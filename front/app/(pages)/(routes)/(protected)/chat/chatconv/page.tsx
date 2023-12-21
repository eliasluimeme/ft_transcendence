'use client'
import React from "react";
import "@/app/(pages)/(routes)/(protected)/game/style.css";
import ChatConv from "@/components/ui/chatcompo/ChatConv";
import { useSearchParams } from "next/navigation";

const page = () => {
  const searchParams = useSearchParams();
  const id  = searchParams.get('id')



  console.log("search: ", id)
  return (
    <div className="w-full h-full">
      <ChatConv />
    </div>
  );
};

export default page;
