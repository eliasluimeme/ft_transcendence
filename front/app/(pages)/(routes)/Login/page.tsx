import Link from 'next/link';localhost:3001
import React from 'react';
import { Button } from '@/components/ui/button';


const LandingPage = () => {
  return (
    <div className=" flex justify-center items-center h-screen"
      style={
        {
          backgroundImage: `url(https://i.giphy.com/3o85xwpIvUQ8grPy1y.webp)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "screen",
        }
      }
    >
      <div className="border box-border h-96 w-96 flex flex-col justify-center items-center rounded-lg text-[#1E2124]"
        style={{
          backgroundImage: `url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1024px-42_Logo.svg.png)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "screen",
        }}
      >
        <div className=" text-2xl font-bold mb-9">Login</div>
        <Button variant="default" className='font-bold  hover:opacity-[100%] bg-[#d2d7db]'>
          <Link href={`http://${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/42/login`}>Login With Intra</Link>
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
