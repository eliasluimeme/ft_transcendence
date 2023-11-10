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
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
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
  const handleEnable2FA = async () => {
    try {
      // Fetch QR code data when the user clicks on "Enable 2FA"
      const response = await axios.get("http://localhost:3001/auth/2fa/generate", {
        withCredentials: true,
      });

      if (response.status === 200) {
        setInputValuesQR({ ImageQR: response.data.qr });
        setIsOpen(true); // Open the modal after fetching QR code
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while fetching QR code:", error);
    }
  };
  const handleDisable2FA = async () => {
    try {
      // Fetch QR code data when the user clicks on "Enable 2FA"
      const response = await axios.get("http://localhost:3001/auth/2fa/turn-off", {
        withCredentials: true,
      });

      if (response.status === 200) {
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while fetching QR code:", error);
    }
  };

  const check = ()  => {
    if (inputValues.toFAStatu) {
      handleDisable2FA();
    } else {
      handleEnable2FA();
    }
  }
  ///send data
  const [code, setCodeValue] = useState({
    code: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCodeValue((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/auth/2fa/turn-on",
        code,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log(code);
        console.log("Data sent successfully!");
      } else {
        console.error("Failed to send data.");
      }
    } catch (error) {
      console.error("An error occurred while sending data:", error);
    }
  };

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
        onClick={check}
      >
        {inputValues.toFAStatu ? "Disable 2FA" : "Enable 2FA"}
      </Button>
      <Button variant="destructive" className="mt-4 w-40">
        Delete Account
      </Button>
      {!inputValues.toFAStatu && (
        <Modal
          className="flex flex-col items-center p-4 rounded-lg "
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
          <div className="mb-6">
            <label
              htmlFor="inline-phone-number"
              className="block text-gray-100 text-sm  mb-1"
            >
              Inser Code
            </label>
            <input
              type="text"
              name="number"
              // value={}
              onChange={handleInputChange}
              className="text-black w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
            />
            <button
              onClick={handleSubmit}
              className="w-full py-2 bg-[#1E2124] text-gray-100  rounded-lg hover:bg-gray-600 focus:outline-none"
            >
              send
            </button>
          </div>
          <button
            className="text-black"
            onClick={() => setIsOpen(false)}
          ></button>
        </Modal>
      )}
    </div>
  );
};

export default Pic;
