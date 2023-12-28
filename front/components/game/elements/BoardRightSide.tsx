import React, {useEffect, useRef} from 'react'

const BoardRightSide = (props:any) => {
    const user = props.user;
    const score = props.score;
   // console.log("RightSide", user);

    return (
        <div className='grid grid-cols-3 h-[100px]'>
            <div className='flex items-center justify-around'>
                <h1>{score}</h1>
            </div>
            <div className='flex items-center justify-around'>
                <h1>{user.userName}</h1>
            </div>
            <div className='flex items-center justify-center'>
                <img
                className='rounded-lg'
                src={user.photo}
                alt=""
                height={80}
                width={80}
                ></img>
            </div>
        </div>
    )
}

export default BoardRightSide