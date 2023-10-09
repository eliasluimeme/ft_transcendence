import React from 'react'
import Floor from '@/components/ui/Floor'
import { CSSProperties, useState } from 'react';


const containerStyle: CSSProperties = {

}
export default function page() {
  return (
    <div className='fixed top-[3rem] left-[5.5rem]'>
      <Floor Width='41.1875rem' Height='40.125rem' />
    </div>
  )
}
