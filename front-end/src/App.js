// App.js
import React, { useState } from "react";
import Message from "./components/Message";
import CameraCapture from "./components/CameraCapture";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "What would you like to explore today?"
    },
    {
      role: "user",
      content: <CameraCapture/>
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h3 className="text-3xl font-bold text-center text-blue-600 mb-8">MixMaster</h3>
        
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
          {messages.map((el, i) => (
            <Message key={i} role={el.role} content={el.content} />
          ))}
        </div>

      </div>
    </div>
  );
}