
import React from 'react'
import "./style.scss"

const Loading = () => {
  return (
    <div className="wrap">
    <div className="loading">
      <div className="bounceball"></div>
      <div className="text">NOW LOADING</div>
    </div>
    </div>
  );
}

export default Loading