
'use client'
import React from "react";
import "@/app/(pages)/(routes)/(protected)/game/style.css";
import ChatConv from "@/components/ui/chatcompo/ChatConv";
import { useSearchParams } from "next/navigation";

const Page = () => {
const search = useSearchParams();
const id = search.get('id');

  return (
    <div className="w-full h-full">
      <ChatConv id={id}/>
    </div>
  );
};

export default Page;
