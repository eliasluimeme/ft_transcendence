import React, {useEffect, useRef} from 'react'

const BoardLeftSide = (props:any) => {
    const user = props.user;
    const score = props.score;
    console.log("LeftSide", user);

    return (
        <div className='grid grid-cols-3 border border-black/50 rounded-lg h-[100px]'>
            <div className='flex items-center justify-center'>
                <img
                className='rounded-lg border border-black/25'
                src={user.photo}
                alt=""
                height={80}
                width={80}
                ></img>
            </div>
            <div className='flex items-center justify-around'>
                <h1>{user.userName}</h1>
            </div>
            <div className='flex items-center justify-around'>
                <h1>{score}</h1>
            </div>
        </div>
    )
}

export default BoardLeftSide