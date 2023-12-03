// 'use client'

import Image from 'next/image'
import { ChangeEvent, useState } from 'react';
import  '@/app/components/ui/css/font.css'
import axios from 'axios';
import { PrismaClient } from '@prisma/client'


export type SearchProps = {

    onSearch: (value: string) => void
}

function SearchBar(props: SearchProps ){

    // const prisma = new PrismaClient();


    const friends: String[] = ['Achraf','Ilyass','Youssef','Yjaadoun']; // Dattabase

    const { onSearch } = props;
    const [ searchFriend, setsearchFriend] = useState('');

    const friendSearch = async () => {
        const firendResults = await axios.get('/api/search', {
          params: {
            searchFriend: searchFriend,
          },
        });
        // Process search results
        console.log(firendResults);
      };

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
      // Implementation
      const { target } = event;
      setsearchFriend(target.value);

    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // console.log(searchFriend);
            onSearch(searchFriend);
        }
    };

    return (
        <div>
            <div className='mt-20'>
                <form   className=" mx-6 mt-auto flex items-center" >
                    <button onClick={(e) => handleSearch(e)}>
                        <Image alt='search' src='/icons/search.svg' width={50} height={50} />
                    </button>
                    <input 
                        className=" bg-transparent p-2 rounded-2xl w-full text-gray-50" 
                        value={searchFriend} 
                        onChange={(event) => handleSearch(event)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search Friends... " />
                </form>
            </div>
        </div>
    );
}
    
export default SearchBar;

