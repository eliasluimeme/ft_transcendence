"use client";
import React, { useState } from "react";
import Modal from "react-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Info = () => {
  const [isOpen, setIsOpen] = useState(false);
  const image =
    "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg";
  const customStyles = {
    overlay: { backgroundColor: "rgba(0, 0, 0, 0.6)" },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        <Avatar>
          <AvatarImage src={image} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </button>

      <Modal
        style = {customStyles}
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="User Info Modal"
      >
        <button className="text-black" onClick={() => setIsOpen(false)}>
          Close Modal
        </button>
      </Modal>
    </div>
  );
};

export default Info;
