import { useState } from "react";
import Message from "./components/Message";
import Input from "./components/Input";
import CameraCapture from "./components/CameraCapture";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: " What would you like to explore today?"
    },
    {
      role: "assistant",
      content: <CameraCapture/>
    }
  ]);

  const handleSubmit = async () => {
    const prompt = {
      role: "user",
      content: input
    };

    setMessages([...messages, prompt]);

    try {
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...messages, prompt]
        })
      });
      
      const data = await response.json();
      console.log(data);
      // Commented API response handling
    } catch (error) {
      console.error("Error:", error);
    }
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
        />

        <div className="mt-4">
        </div>
      </div>
    </div>
  );
}