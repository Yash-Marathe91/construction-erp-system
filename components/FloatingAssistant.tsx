"use client";

import { useState } from "react";
import { MessageSquareMore, X, Send } from "lucide-react";
import { Button } from "./ui/button";

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: 'Hi! I am your ConstructERP assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput("");
    setIsTyping(true);
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages })
      });
      
      const data = await res.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: "Error communicating with the database analytics." }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I am offline or cannot reach the server." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      {!isOpen && (
        <Button 
          size="fab" 
          className="fixed bottom-24 right-4 z-50 bg-gradient-to-tr from-[#182232] to-[#2d3748] text-white"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquareMore className="w-6 h-6" />
        </Button>
      )}

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 max-w-[calc(100vw-2rem)] h-96 bg-[#ffffff] rounded-xl shadow-[0_12px_40px_-10px_rgba(24,34,50,0.3)] z-50 flex flex-col overflow-hidden border border-gray-100">
          <div className="bg-[#182232] p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <MessageSquareMore className="w-5 h-5 text-[#feda5a]" />
              <h3 className="font-heading font-bold">Construct Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#f9f9ff]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[85%] text-sm font-sans shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#d9e3f9] text-[#121c2c] rounded-br-none' 
                    : 'bg-[#ffffff] border border-gray-100 text-[#45474c] rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="p-3 rounded-lg bg-[#ffffff] border border-gray-100 text-[#45474c] rounded-bl-none shadow-sm text-sm italic">
                   Analyzing database...
                 </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input 
              type="text" 
              className="flex-1 bg-[#f0f3ff] rounded-md px-3 py-2 text-sm font-sans focus:outline-none focus:border-b-2 focus:border-[#182232]"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button size="icon" className="bg-[#715c00] hover:bg-[#5a4a00] shrink-0" onClick={handleSend} disabled={isTyping}>
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
