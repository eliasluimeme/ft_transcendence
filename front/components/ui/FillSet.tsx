"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';

const FillSet: React.FC = () => {
  const [inputValues, setInputValues] = useState({
    fullName: "",
    userName: "",
    country: "",
    number: "",
  });
  const router = useRouter();
  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.BACK_END_URL + "settings", {
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
        //("failed to fetchdata");
      }
    } catch (error) {
      //ror("An error occurred while fetching user data:", error);
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
  function checkEmpty(name: string, fullName: string): Boolean {
    if (name.length === 0 || fullName.length === 0)
      return true
    return false;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!checkEmpty(inputValues.fullName, inputValues.userName)) {
        const response = await axios.post(
          process.env.BACK_END_URL + "settings/update",
          inputValues,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          //("Data sent successfully!");
          toast.success('Data sent successfully!');
        } else if (response.status === 403) {
          toast.error(response.data.message || 'An error occurred');
        }
      }

    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        toast.error(error.response.data.message || 'An error occurred');
      }
      //ror("An error occurred while sending data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1E2124] text-gray-300">
      <div className="w-96 p-6 bg-[#36393E] shadow-lg rounded-lg">
        <form >
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
              className="block text-gray-100 text-sm  mb-1"
            >
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
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full py-2 bg-[#1E2124] text-gray-100  rounded-lg hover:bg-gray-600 focus:outline-none"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default FillSet;
