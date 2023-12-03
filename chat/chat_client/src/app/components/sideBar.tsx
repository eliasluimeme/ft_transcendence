'use client'

import Image from 'next/image'
import Style from './sideBar.module.css'
import { ChangeEvent, useState } from 'react';
import  '@/app/components/ui/css/font.css'
import Button from './ui/Button';
import { CopySlash } from 'lucide-react';
import SearchBar from './SearchBar';
import { Seaweed_Script } from 'next/font/google';


function SideBar( ){

    const friends: String[] = ['Achraf','Ilyass','Youssef','Yjaadoun']; // Dattabase

    const [ searchValue, setSearchValue ] = useState('');

    const handleChat = (friend: String) => {
        // Implementation => rendring chat conversation component 
    };

    const handleSearch = (value : string) => {
        // throw new Error('Function not implemented.');
        setSearchValue(value);
        console.log(value)
    }

    return (
        <div>
            <div className='mt-20'>
                <SearchBar onSearch={handleSearch} />
                <p>{searchValue}</p>
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
        </div>
    );
}
    
export default SideBar;

