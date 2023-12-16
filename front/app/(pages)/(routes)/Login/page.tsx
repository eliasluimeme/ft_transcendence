import Link from 'next/link';

import React from 'react';
import { Button } from '@/components/ui/button';


const LandingPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white box-border h-96 w-96 flex flex-col justify-center items-center rounded-lg text-[#1E2124]">
        <div className=" text-2xl font-bold mb-9">Login</div>
        <Button variant="default" className='font-bold opacity-[50%] hover:opacity-[100%]'>
          <Link href="http://localhost:3001/auth/42/login">Login With Intra</Link>
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
