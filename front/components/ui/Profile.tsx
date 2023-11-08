import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./button";

const Pic = () => {
  const image =
    "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-300 bg-[#1E2124] bg-opacity-50 bg-no-repeat bg-cover bg-center background-image">
      <Avatar className="w-40 h-40 border-4">
        <AvatarImage src={image} />
        <AvatarFallback>Done</AvatarFallback>
      </Avatar>
      <Button className="mt-4 w-40 bg-[#1E2124] hover:bg-gray-600 text-gray-100">
        Choose Avatar
      </Button>
      <Button className="mt-4 w-40 bg-[#1E2124] hover:bg-gray-600 text-gray-100">
        Upload Image
      </Button>
      <Button className="mt-4 w-40 bg-[#1E2124] hover:bg-gray-600 text-gray-100">
        Enable 2FA
      </Button>
      <Button variant="destructive" className="mt-4 w-40">
        Delete Account
      </Button>
    </div>
  );
};

export default Pic;
