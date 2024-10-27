import React, { useState } from "react";
import Message from "./components/Message";
import CameraCapture from "./components/CameraCapture";

export default function App() {
  const [messages, setMessages] = useState([
  ]);

  const handlePhotoUpload = (responseData) => {
    setMessages(prev => [...prev, {
      role: "assistant",
      content: JSON.stringify(responseData['Response'], null, 2).replace('\\n','')
    }]);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h3 className="text-3xl font-bold text-center text-orange-600 mb-8">MixMaster</h3>
        
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
        <CameraCapture onPhotoUpload={handlePhotoUpload} />
         {messages.map((el, i) => (
            <Message key={i} role={el.role} content={el.content} />
          ))}
        </div>
      </div>
    </div>
  );
}
