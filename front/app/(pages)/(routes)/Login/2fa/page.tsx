"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'


const page = () => {
  ///////////////////////////////send data///////////////////
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
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/auth/2fa/login",
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
        router.push("/");
        console.log("Data sent successfully!");
      } else {
        console.error("Failed to send data.");
      }
    } catch (error) {
      console.error("An error occurred while sending data:", error);
    }
  };

  /////////////////////////////////////////////////////////////////////
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[50%] h-[50%] flex flex-col items-center justify-center text-center">
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
            type="submit"
            className="mt-[4%] w-full py-2 bg-[#36393E] text-gray-100  rounded-lg hover:bg-gray-600 focus:outline-none"
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
