// 'use client'

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import axios from "axios";

export type SearchProps = {
  onSearch: (value: string) => void;
};

function SearchBar(props: SearchProps) {
  const friends: String[] = ["Achraf", "Ilyass", "Youssef", "Yjaadoun"]; // Dattabase

  const { onSearch } = props;
  const [searchFriend, setsearchFriend] = useState("");

  const friendSearch = async () => {
    const firendResults = await axios.get(
      "http://localhost:3001/api/search/findall",
      {
        params: {
          searchFriend: searchFriend,
        },
      }
    );
    console.log(firendResults);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    // Implementation
    const { target } = event;
    setsearchFriend(target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(searchFriend);
    }
  };

  return (
    <div>
      {/* <div className="">
        <form className=" mx-6 mt-auto flex items-center">
          <Image alt="search" src="/icons/search.svg" width={50} height={50} />
          <input
            className="bg-transparent p-2 rounded-2xl w-full text-gray-50"
            value={searchFriend}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            placeholder="Search Friends... "
          />
        </form>
      </div> */}
    </div>
  );
}

export default SearchBar;
