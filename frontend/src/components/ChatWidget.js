import React, { useState } from "react";
import "../Css/ChatWidget.css";

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hello! How can I help you today?" },
    { from: "bot", text: "Common help topics:" },
    {
      from: "bot",
      text: "• Uploading crops\n• Tracking orders\n• Payment Issues\n• Contact Support",
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const botReply = (msg) => {
    setTyping(true);

    setTimeout(() => {
      setTyping(false);

      const reply = `You asked: "${msg}". Our team will reach out shortly!`;

      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 1000);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");

    botReply(userMsg);
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className="chat-float-btn"
        onClick={() => setOpen(!open)}
      >
        <i className="fa-solid fa-message"></i>
      </div>

      {/* Chat Window */}
      {open && (
        <div className="chat-window animate-chat-open">

          <div className="chat-header">
            <i className="fa-solid fa-headset"></i>
            <span>AgroLink Support</span>
            <i
              className="fa-solid fa-xmark close-btn"
              onClick={() => setOpen(false)}
            ></i>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from} slide-in`}>
                <p>{msg.text}</p>
              </div>
            ))}

            {typing && (
              <div className="chat-msg bot typing">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
