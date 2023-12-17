'use client'

import Image from 'next/image'
import Style from './sideBar.module.css'
import '@/components/ui/CSS/font.css'
import SearchBar from './SearchBar';
import { useState } from 'react';
import Link from 'next/link';

function SideBar( ){


    const friends: string[] = ['Achraf','Ilyass','Youssef','Yjaadoun']; // Dattabase

    const [ searchValue, setSearchValue ] = useState('');

    const handleChat = (friend: string) => {
        // Implementation to open a chat with the friend.
        console.log(`Opening chat with ${friend}`);
        return(
            <div>
                <h1>Chat with {friend}</h1>
                <Link href={`/chat/${friend}`} />
            </div>
        )
        // render <Conversation /> component.
        
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
        console.log("from handelSearch",value);
    }

    return (
        <div>
            <div className='mt-20'>
                <SearchBar onSearch={handleSearch} />
                <p>{searchValue}</p>
            </div>
            <h2 className='blue_font lg:text-[30px] md:text-[20px] sm:text-[10px] text-[10px]'>Friends</h2>
            <div className={Style.list}>
                <ul className="mt-4">
                    {friends.map((friend, index) => 
                        (
                            <li
                            key={index}
                            className="mx-6 mt-auto flex items-center hover:bg-gray-400 hover:rounded-md cursor-pointer py-3"
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
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default SideBar;

