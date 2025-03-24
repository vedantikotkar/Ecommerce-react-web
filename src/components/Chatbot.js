import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat/", { text: input });
      setMessages([...newMessages, { sender: "bot", text: response.data.response }]);
    } catch (error) {
      setMessages([...newMessages, { sender: "bot", text: "Error reaching server." }]);
    }
  };

  return (
    <div style={{ width: "400px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Chatbot</h2>
      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "5px 0" }}>
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        style={{ width: "70%", padding: "10px" }}
      />
      <button onClick={sendMessage} style={{ width: "25%", padding: "10px", marginLeft: "5px" }}>Send</button>
    </div>
  );
};

export default Chatbot;
