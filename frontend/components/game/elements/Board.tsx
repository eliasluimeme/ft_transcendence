import React from 'react'
import BoardLeftSide from '../elements/BoardLeftSide';
import BoardRightSide from '../elements/BoardRightSide';
const Board = (props:any) => {
  if (props.me.side == "left")
    return (
      <div className='w-full h-full'>
        <BoardLeftSide user={props.me} score={props.scores.lscore}/>
        <BoardRightSide user={props.opp} score={props.scores.rscore}/>
      </div>
    );
  else
    return (
      <div className='w-full h-full'>
        <BoardLeftSide user={props.opp} score={props.scores.rscore}/>
        <BoardRightSide user={props.me} score={props.scores.lscore}/>
      </div>
    );
}

export default Board