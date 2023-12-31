import React from 'react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'

export const Lose = () => {
    const router = useRouter();
    const leave = () => {
        router.push("/game");
    }
  return (
    <div className='w-full h-full font-Goldman'>
        <div className='w-full h-[70%] flex flex-col items-center space-y-7 justify-center'>
            <div className=' w-[200px] h-[250px] border relative rounded-lg'>
            <Image
                    className="rounded-lg shadow-shadoww"
                    src="https://cdn.dribbble.com/users/944284/screenshots/3041046/media/1d0fd0b5c9b20de91501818723bd05a8.png?resize=800x600&vertical=center"
                    alt=""
                    sizes="(max-width: 600px) 400px,
                    (max-width: 1200px) 800px,
                    1200px"
                    fill
            ></Image>
            </div>
            <div className='text-red-500 text-[50px]'>YOU LOST !!</div>
        </div>
        <div className='h-[30%] flex items-center justify-center'>
            <button onClick={leave} className='w-[100px] h-[30px] border rounded-lg bg-orange-400 bg-opacity-80 hover:bg-opacity-100'>
                <div>Leave</div>
            </button>
        </div>
    </div>
  )
}
