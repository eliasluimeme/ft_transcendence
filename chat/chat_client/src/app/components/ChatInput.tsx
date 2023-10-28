import React, { useState } from 'react';
import Button from './ui/Button';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    if (message) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        placeholder="Type your message"
        style={{ border: "1px solid gray", borderRadius: "10px", padding: "5px",}}
      />
      {/* <button onClick={handleSubmit}>Send</button> */}
      <Button  onClick={handleSubmit}/>
    </div>
  );
};

export default ChatInput;
