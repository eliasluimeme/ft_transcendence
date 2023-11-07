"use client";
import React, { useState } from "react";

const FillSet: React.FC = () => {
  const [inputValues, setInputValues] = useState({
    fullName: "el kouch achraf",
    nickname: "ael-kouc",
    country: "morocco",
    phoneNumber: "0702763761",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1E2124] text-gray-300"> {/* Change the background and text color */}
      <div className="w-96 p-6 bg-[#36393E] shadow-lg rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="inline-full-name"
              className="block text-gray-100 text-sm  mb-1">
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
              Nickname
            </label>
            <input
              type="text"
              name="nickname"
              value={inputValues.nickname}
              onChange={handleInputChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="inline-country"
              className="block text-gray-100 text-sm  mb-1">
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
              className="block text-gray-100 text-sm  mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={inputValues.phoneNumber}
              onChange={handleInputChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#1E2124] text-gray-100  rounded-lg hover:bg-gray-600 focus:outline-none"> 
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FillSet;
