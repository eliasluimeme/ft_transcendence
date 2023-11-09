"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";


const FillSet: React.FC = () => {
  const [inputValues, setInputValues] = useState({
    fullName: "achrfa",
    userName: "fgrt",
    country: "",
    number: "",
  });

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/settings", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setInputValues({
          fullName: response.data.fullName,
          userName: response.data.userName,
          country: response.data.country,
          number: response.data.number,
        });
      } else {
        console.error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("An error occurred while fetching user data:", error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/settings/update", inputValues, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        console.log("Data sent successfully!");
      } else {
        console.error("Failed to send data.");
      }
    } catch (error) {
      console.error("An error occurred while sending data:", error);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1E2124] text-gray-300">
      <div className="w-96 p-6 bg-[#36393E] shadow-lg rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="inline-full-name"
              className="block text-gray-100 text-sm  mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={inputValues.fullName}
              onChange={handleInputChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="inline-nickname"
              className="block text-gray-100 text-sm  mb-1">
              User name
            </label>
            <input
              type="text"
              name="userName"
              value={inputValues.userName}
              onChange={handleInputChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="inline-country"
              className="block text-gray-100 text-sm  mb-1"
            >
              Country
            </label>
            <input
              type="text"
              name="country"
              value={inputValues.country}
              onChange={handleInputChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="inline-phone-number"
              className="block text-gray-100 text-sm  mb-1"
            >
              Phone Number
            </label>
            <input
              type="text"
              name="number"
              value={inputValues.number}
              onChange={handleInputChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
            />
          </div>
          <button onClick={handleSubmit}
            type="submit"
            className="w-full py-2 bg-[#1E2124] text-gray-100  rounded-lg hover:bg-gray-600 focus:outline-none"> 
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default FillSet;
