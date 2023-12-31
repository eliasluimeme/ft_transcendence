import React from 'react'
import { Win } from '../elements/Win'
import { Lose } from '../elements/Lose'
import { Disco } from '../elements/Disco'

const Results = (props:any) => {
  if (props.rslt === "win")
    return (
      <div className='w-full h-full'>
        <Win/>
      </div>
    )
  else if (props.rslt === "lost")
    return (
      <div className='w-full h-full'>
        <Lose/>
      </div>
    )
  else
    return (
      <div className='w-full h-full'>
        <Disco/>
      </div>
    )
}

export default Results