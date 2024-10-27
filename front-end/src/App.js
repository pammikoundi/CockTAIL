// App.js
import React, { useState } from "react";
import Message from "./components/Message";
import Input from "./components/Input";
import CameraCapture from "./components/CameraCapture";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "What would you like to explore today?"
    }
  ]);

  // Helper function to filter out CameraCapture messages
  const filterCameraCaptureMessages = (msgs) => {
    return msgs.filter(msg => {
      // Check if content is a React element and specifically a CameraCapture component
      const isCameraCapture = React.isValidElement(msg.content) && 
        msg.content.type === CameraCapture;
      return !isCameraCapture;
    });
  };

  const handlePhotoUpload = (uploadResponse) => {
    if (uploadResponse?.success) {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          role: "user",
          content: "Photo uploaded successfully"
        },
        {
          role: "assistant",
          content: "I've received your photo. Would you like to upload another or proceed with something else?"
        }
      ]);
    }
  };

  const handleSubmit = async () => {
    const prompt = {
      role: "user",
      content: input
    };

    setMessages([...messages, prompt]);
    setInput(""); // Clear input after submission

    try {
      // Filter out CameraCapture messages before sending to AI
      const filteredMessages = filterCameraCaptureMessages([...messages, prompt]);

      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: filteredMessages
        })
      });
      
      const data = await response.json();
      if (data) {
        setMessages(prevMessages => [...prevMessages, {
          role: "assistant",
          content: data.content || "Received your message"
        }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages(prevMessages => [...prevMessages, {
        role: "assistant",
        content: "Sorry, there was an error processing your request."
      }]);
    }
  };

  const handleAddMoreDrinks = () => {
    setMessages(prevMessages => [
      ...prevMessages,
      {
        role: "user",
        content: <CameraCapture onPhotoUpload={handlePhotoUpload} />
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h3 className="text-3xl font-bold text-center text-blue-600 mb-8">MixMaster</h3>
        
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
          {messages.map((el, i) => (
            <Message key={i} role={el.role} content={el.content} />
          ))}
        </div>

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClick={input ? handleSubmit : undefined}
          onAddMoreDrinks={handleAddMoreDrinks}
        />
      </div>
    </div>
  );
}