"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./button";
import Modal from "react-modal";
import axios from "axios";
import Image from "next/image";

const Pic = () => {
  const [inputValues, setInputValues] = useState({
    profilImage: "",
    toFAStatu: false,
  });

  const image =
    "https://cdn.intra.42.fr/users/9373f1cfc045b4628c01920b3000a836/ael-kouc.jpg";
  //////////////////////////////////// pop up styling///////////////////
  const Style = {
    overlay: { backgroundColor: "rgba(0, 0, 0, 0.6)" },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "#36393E",
      border: "none",
    },
  };
  /////////////////////pop up usestate///////////////////////////
  const [isOpen, setIsOpen] = useState(false);
  /////////////////////////////////////////////////////////////
  //////////////data_fetch////////////////
  ////////////////////////////////////////
  const router = useRouter();
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/settings", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setInputValues({
          profilImage: response.data.photo,
          toFAStatu: response.data.isTwoFactorAuthEnabled,
        });
      } else {
        console.log("failed to fetchdata");
      }
    } catch (error) {
      router.push("/Login");
      console.error("An error occurred while fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  ////////////////////////////////////////////////////////////

  /////////////////fetch_data_to get QR code ///////////////////
  //////////////////////////////////////////////////////////////
  const [inputValuesQR, setInputValuesQR] = useState({
    ImageQR: "",
  });
  const fetchDataQR = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/auth/2fa/generate",
        {
          withCredentials : true,
        }
      );
      if (response.status === 200) {
        setInputValuesQR({ImageQR : response.data.qr,});
        console.log(inputValuesQR.ImageQR)
      } else {
        console.log("failed to fetchdata");
      }
    } catch (error) {
      console.error("An error occurred while fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchDataQR();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-300 bg-[#1E2124] bg-opacity-50 bg-no-repeat bg-cover bg-center background-image">
      <Avatar className="w-40 h-40 border-4">
        <AvatarImage src={inputValues.profilImage} />
        <AvatarFallback>Done</AvatarFallback>
      </Avatar>
      <Button className="mt-4 w-40 bg-[#1E2124] hover:bg-gray-600 text-gray-100">
        Choose Avatar
      </Button>
      <Button className="mt-4 w-40 bg-[#1E2124] hover:bg-gray-600 text-gray-100">
        Upload Image
      </Button>
      <Button
        className="mt-4 w-40 bg-[#1E2124] hover:bg-gray-600 text-gray-100"
        onClick={() => setIsOpen(true)}
      >
        {inputValues.toFAStatu ? "Disable 2FA" : "Enable 2FA"}
      </Button>
      <Button variant="destructive" className="mt-4 w-40">
        Delete Account
      </Button>
      {!inputValues.toFAStatu && (
        <Modal
          className=""
          style={Style}
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="User Info Modal"
        >
            <Image
              src={inputValuesQR.ImageQR as string}
              alt="QR Code"
              width={200}
              height={200}
            />
          <button className="text-black" onClick={() => setIsOpen(false)}>
            {" "}
            close{" "}
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Pic;
