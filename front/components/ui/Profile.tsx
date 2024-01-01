"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./button";
import Modal from "react-modal";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";

const Pic = () => {

  const [inputValues, setInputValues] = useState({
    photo: "",
    toFAStatu: false,
  });

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
      const response = await axios.get(`http://${process.env.NEXT_PUBLIC_BACKEND_URL}/settings`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setInputValues({
          photo: response.data.photo,
          toFAStatu: response.data.isTwoFactorAuthEnabled,
        });
      } else {
      }
    } catch (error) {
      router.push("/Login");
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
      const response = await axios.get(
        `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/2fa/generate`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setInputValuesQR({ ImageQR: response.data.qr });
        setIsOpen(true); // Open the modal after fetching QR code
        router.push('/settings')
      } else {
      }
    } catch (error) {
    }
  };
  const handleDisable2FA = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/2fa/turn-off`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("2FA Desactivated")
        if (response.data.off === true)
          router.push('/Login')
      } else {
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || 'An error occurred');
      }
    }
  };

  const check = () => {
    if (inputValues.toFAStatu) {
      handleDisable2FA();
    } else {
      handleEnable2FA();
    }
  };
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
        `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/2fa/turn-on`,
        code,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("2FA Activated")
        if (response.data.on === true)
          router.refresh();
      } else {
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || 'An error occurred');
      }
    }
  };

  ///upload image//////////////////
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleImageUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("photo", selectedFile);
      try {
        const response = await axios.post(
          `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/photo/upload`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          toast.success("Photo Uploaded Successfuly")
          setInputValues({
            ...inputValues,
            photo: response.data.photo,
          });
        } else {

        }
      } catch (error) {

      }
    }
  };
  ///////////////////////////////////////////////////////////////////
  //////////////////////////chose avatar ////////////////////////////
  ///////////////////////////////////////////////////////////////////
  const [uploadModalAvatarOpen, setUploadModalAvatarOpen] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState([
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
  ]);

  // Update this function to handle the selection of the avatar
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const handleAvatarSelection = (selectedAvatar: string) => {
    setSelectedImage(selectedAvatar);
  };

  const handleSaveAvatar = async () => {
    try {
      const response = await axios.post(
        `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/settings/avatar`,
        { photo: selectedImage },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Avatar Uploaded Successfuly")
        setInputValues({
          ...inputValues,
          photo: response.data.photo,
        });
        setUploadModalAvatarOpen(false); // Close the modal if needed
      } else {
        // Handle failure (e.g., show error message)
      }
    } catch (error) {
      // Handle the error
    }
  };
  ///////////////////////////////////////////////////////////////////
  return (
    <div
      id="app"
      className="flex flex-col items-center justify-center min-h-screen text-gray-300 bg-[#1E2124] bg-opacity-50 bg-no-repeat bg-cover bg-center background-image"
    >
      <Avatar className="w-40 h-40 border-4">
        <AvatarImage src={inputValues.photo} />
        <AvatarFallback>Done</AvatarFallback>
      </Avatar>
      {/* ///////////////////////////////////////////////////////////////
      /////////chose avatar/////////////////////////////////////////
      /////////////////////////////////////////////////////////////// */}
      <Button
        onClick={() => setUploadModalAvatarOpen(true)}
        className="mt-4 w-40 bg-[#1E2124] hover:bg-gray-600 text-gray-100"
      >
        Choose Avatar
      </Button>
      {/* ///////////////////////////////////////////////////////////////
      /////////upload image/////////////////////////////////////////
      /////////////////////////////////////////////////////////////// */}
      <Button
        onClick={() => setUploadModalOpen(true)}
        className="mt-4 w-40 bg-[#1E2124] hover:bg-gray-600 text-gray-100"
      >
        Upload Image
      </Button>
      {/* ///////////////////////////////////////////////////////////////
      /////////2FA///////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////// */}
      <Button
        className="mt-4 w-40 bg-[#1E2124] hover:bg-gray-600 text-gray-100"
        onClick={check}
      >
        {inputValues.toFAStatu ? "Disable 2FA" : "Enable 2FA"}
      </Button>

      {/* ///////////////////////////////////////////////////////////////
      /////////pop up of 2FA/////////////////////////////////////////
      /////////////////////////////////////////////////////////////// */}
      {!inputValues.toFAStatu && (
        <Modal
          className="flex flex-col items-center p-4 rounded-lg "
          style={Style}
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="User Info Modal"
          appElement={
            typeof window !== "undefined" && document.getElementById("app")
          }
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
      {/* ///////////////////////////////////////////////////////////////
      ////////////////////////////// popup of upload image///////////
      /////////////////////////////////////////////////////////////// */}
      {!isOpen && (
        <Modal
          className="flex flex-col items-center p-4 rounded-lg "
          style={Style}
          isOpen={uploadModalOpen}
          onRequestClose={() => setUploadModalOpen(false)}
          contentLabel="User Info Modal"
          appElement={
            typeof window !== "undefined" && document.getElementById("app")
          }
        >
          <input
            className="font-alfa-slab mt-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
            type="file"
            onChange={handleFileChange}
          />
          <Button className="mt-[10%]" onClick={handleImageUpload}>
            {" "}
            save{" "}
          </Button>
          <button
            className="text-black"
            onClick={() => setIsOpen(false)}
          ></button>
        </Modal>
      )}
      {/* /////////////////////////////////////////////////////////////// */}
      {/* ///////////////////////////////////////////////////////////////
      ////////////////////////////// popup of chose avatar///////////////
      /////////////////////////////////////////////////////////////////// */}

      {!isOpen && (
        <Modal
          className="flex flex-col items-center p-4 rounded-lg "
          style={Style}
          isOpen={uploadModalAvatarOpen}
          onRequestClose={() => setUploadModalAvatarOpen(false)}
          contentLabel="User Info Modal"
          appElement={
            typeof window !== "undefined" && document.getElementById("app")
          }
        >
          <div className="flex relative items-center space-x-4 mt-4 justify-center">
            {avatarOptions.map((avatar, index) => (
              <div key={index} className="relative border w-[150px] h-[100px]">
                <Image
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  sizes="(max-width: 600px) 400px,
                (max-width: 1200px) 800px,
                1200px"
                  fill
                  className={`w-[20%] border cursor-pointer ${selectedImage === avatar ? "border-2 border-blue-500" : ""
                    }`}
                  onClick={() => handleAvatarSelection(avatar)}
                />
              </div>
            ))}
          </div>
          <Button
            onClick={handleSaveAvatar}
            className="mt-4 w-40 bg-[#1E2124] hover:bg-gray-600 text-gray-100"
          >
            Save
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default Pic;
