import React, { useState } from 'react';

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
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default ChatInput;
