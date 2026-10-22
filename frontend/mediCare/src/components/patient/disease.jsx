import React, { useState, useEffect, useRef } from "react";
import PatientNavbar from "./navbar";
import Footer from "../footer/footer";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: userInput }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.predicted_disease) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `Predicted Disease: ${data.predicted_disease}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `Error: ${data.error}` },
        ]);
      }
    } catch (err) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error connecting to server." },
      ]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      <PatientNavbar />
      <div style={{ fontFamily: "Arial", padding: "159px", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            boxShadow: "0px 6px 15px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fafafa",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#0f3862ff",
              color: "white",
              padding: "15px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            🤖 Disease Prediction Chatbot
          </div>

          {/* Chat Area */}
          <div
            style={{
              flex: 1,
              padding: "15px",
              height: "400px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: "15px",
                    maxWidth: "75%",
                    backgroundColor: msg.sender === "user" ? "#e1f5fe" : "#e8f5e9",
                    color: msg.sender === "user" ? "#0277bd" : "#2e7d32",
                    fontWeight: 500,
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {msg.sender === "user" ? "🧑 " : "🤖 "}
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ color: "gray", fontStyle: "italic" }}>Bot is typing...</div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #ddd",
              backgroundColor: "#fff",
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px",
            }}
          >
            <input
              type="text"
              placeholder="Enter symptoms..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "25px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                marginLeft: "10px",
                padding: "12px 20px",
                backgroundColor: "#1a4264ff",
                color: "white",
                border: "none",
                borderRadius: "25px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
