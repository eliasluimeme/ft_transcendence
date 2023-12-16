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
      const response = await axios.get("http://localhost:3001/settings", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setInputValues({
          photo: response.data.photo,
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
      const response = await axios.get(
        "http://localhost:3001/auth/2fa/generate",
        {
          withCredentials: true,
        }
      );

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
      const response = await axios.get(
        "http://localhost:3001/auth/2fa/turn-off",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while fetching QR code:", error);
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
          "http://localhost:3001/photo/upload",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          console.log(response.data)
          setInputValues({
            ...inputValues,
            photo: response.data.photo,
          });
        } else {
          console.log("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("An error occurred while uploading the image:", error);
      }
    }
  };
  ///////////////////////////////////////////////////////////////////
  //////////////////////////chose avatar ////////////////////////////
  ///////////////////////////////////////////////////////////////////
  const [uploadModalAvatarOpen, setUploadModalAvatarOpen] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState([
    "https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=",
    "https://img.freepik.com/free-photo/digital-painting-mountain-with-colorful-tree-foreground_1340-25699.jpg",
  ]);

  // Update this function to handle the selection of the avatar
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const handleAvatarSelection = (selectedAvatar: string) => {
    setSelectedImage(selectedAvatar);
  };

  const handleSaveAvatar = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/settings/update",
        { photo: selectedImage },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("zebi");
        setInputValues({
          ...inputValues,
          photo: response.data.photo,
        });
        console.log("Image URL sent successfully!");
        setUploadModalAvatarOpen(false); // Close the modal if needed
      } else {
        // Handle failure (e.g., show error message)
        console.error("Failed to send image URL.");
      }
    } catch (error) {
      // Handle the error
      console.error("An error occurred while sending image URL:", error);
    }
  };
  ///////////////////////////////////////////////////////////////////
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-300 bg-[#1E2124] bg-opacity-50 bg-no-repeat bg-cover bg-center background-image">
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
        >
          <div className="flex items-center space-x-4 mt-4 justify-center">
            {avatarOptions.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className={`w-[20%] border cursor-pointer ${
                  selectedImage === avatar ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => handleAvatarSelection(avatar)}
              />
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
