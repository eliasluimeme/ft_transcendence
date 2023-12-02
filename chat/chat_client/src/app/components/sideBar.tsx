"use client"

import Image from 'next/image'
import Style from './sideBar.module.css'
import { SetStateAction, useState } from 'react';
import  '@/app/components/ui/css/font.css'

function SideBar(){
const friends: String[] = ['Achraf','Ilyass','Youssef','Yjaadoun']; // Dattabase
const [searchInput, setSearchInput] = useState('');
const handleSearch = (event: { target: { value: SetStateAction<string>; }; }) => {
  // Implementation
  setSearchInput(event.target.value);
};

const handleChat = (friend: String) => {
  // Implementation
};

return (
    <>
        <div className='mt-20'>
            <div   className=" mx-6 mt-auto flex items-center" >
                <button type="submit" 
                    // onClick={handleSearch}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey){
                          
                          handleSearch(e)  
                        }
                      }}
                    >
                <img alt='search' src='/icons/search.svg' />
                </button>
                <input 
                    className=" bg-transparent p-2 rounded-2xl w-full text-gray-50" 
                    value={searchInput} 
                    onChange={(e) => setSearchInput(e.target.value)} 
                    placeholder="Search Friends" />
            </div>
        </div>
        <h2 className=' blue_font  lg:text-[30px] md:text-[20px] sm:text-[10px] text-[10px]'>Friends</h2>
        <div className={Style.list}>
            <ul className="mt-4">
                {friends.map((friend, index) => (
                <li key={index} 
                className="mx-6 mt-auto flex items-center hover:bg-gray-400 hover:rounded-md  cursor-pointer py-3" //scrol
                onClick={() => handleChat(friend)}>
                    <div>
                    <Image
                        className='rounded-full border border-red-400 mr-5'
                        src='/icons/avatar.png'
                        alt='profile picture'
                        width={50}
                        height={50}
                        />
                    </div>
                    <div>
                     {friend}
                    </div>
                </li>))}
            </ul>
        </div>
    </>
);
}
    
export default SideBar;
