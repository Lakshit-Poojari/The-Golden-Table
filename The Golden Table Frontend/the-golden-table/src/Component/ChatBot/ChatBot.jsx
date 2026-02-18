import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ChatBot.css";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const chatEndRef = useRef(null);

    const intents = {
    greeting: [
      "hi", "hello", "hey", "good morning", "good evening", "good afternoon"
    ],

    menu: [
      "menu", "food", "dish", "item", "dessert", "drink",
      "beverage", "cuisine", "veg", "vegetarian", "non veg",
      "price", "cost", "rate", "special", "starter", "main course"
    ],

    booking: [
      "book", "booking", "reservation", "reserve",
      "table", "seat", "availability", "available",
      "cancel booking", "modify booking", "change booking"
    ],

    contact: [
      "contact", "call", "phone", "number", "mobile",
      "support", "manager", "help"
    ],

    timing: [
      "timing", "timings", "hours", "open", "close",
      "opening", "closing", "today open", "weekend"
    ],

    location: [
      "location", "address", "where", "map",
      "directions", "near", "nearby", "reach"
    ],

    offers: [
      "offer", "offers", "discount", "coupon",
      "promo", "deal", "festival offer"
    ],

    facilities: [
      "parking", "wifi", "ac", "air conditioning",
      "delivery", "takeaway", "dine in", "outdoor seating"
    ]
  };

  const getIntent = (text) => {
    return Object.keys(intents).find(intent =>
      intents[intent].some(keyword => text.includes(keyword))
    );
  };

  const generateResponse = (intent) => {
    switch (intent) {
      case "greeting":
        return { text: "Hello 👋 Welcome to Golden Table!" };

      case "menu":
        return {
          text: "Here is our delicious menu:",
          link: "/menu",
          linkText: "View Menu"
        };

      case "booking":
        return {
          text: "Reserve your table here:",
          link: "/customer/book-table",
          linkText: "Book Now"
        };

      case "contact":
        return {
          text: "Call us directly:",
          link: "tel:9876543210",
          linkText: "9876543210"
        };

      case "timing":
        return { text: "We are open daily from 12 PM to 11 PM." };

      case "location":
        return { text: "We are located in the heart of the city." };

      default:
        return {
          text: "I can only assist with Golden Table restaurant queries."
        };
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const userText = message.toLowerCase().trim();
    const intent = getIntent(userText);
    const botResponse = generateResponse(intent);

    setMessages(prev => [
      ...prev,
      { sender: "user", text: message },
      { sender: "bot", ...botResponse }
    ]);

    setMessage("");
  };

  // 🔥 Always scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        🤖
      </div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            Golden Assistant
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-row ${msg.sender}`}
              >
                {msg.sender === "bot" && (
                  <div className="bot-icon">🤖</div>
                )}

                <div className="message-bubble">
                  <p>{msg.text}</p>

                  {msg.link && (
                    msg.link.startsWith("tel:") ? (
                      <a
                        href={msg.link}
                        className="chat-link"
                      >
                        {msg.linkText}
                      </a>
                    ) : (
                      <Link
                        to={msg.link}
                        className="chat-link"
                      >
                        {msg.linkText}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Ask about menu, booking..."
            />
            <button onClick={handleSend}>Send</button>
          </div>

        </div>
      )}
    </>
  );
}

export default ChatBot;
