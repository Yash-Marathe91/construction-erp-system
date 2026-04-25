"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquareMore, X, Send, BarChart3, Users, Package, AlertCircle, Bot, User } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: '### Namaste! 🙏\nI am **SiteHelper**. I have live access to your construction data.\n\nHow can I help you optimize your site operations today?' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const quickActions = [
    { label: "Site Summary", icon: <BarChart3 size={14} />, query: "Give me a summary of the site status." },
    { label: "Worker Stats", icon: <Users size={14} />, query: "Show me the current worker roster and today's attendance." },
    { label: "Stock Alerts", icon: <Package size={14} />, query: "Are there any low stock materials?" },
    { label: "Pending Dues", icon: <AlertCircle size={14} />, query: "Any overdue invoices?" },
  ];

  const handleSend = async (customQuery?: string) => {
    const messageText = customQuery || input;
    if (!messageText.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: messageText }]);
    setInput("");
    setIsTyping(true);
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, history: messages })
      });
      
      const data = await res.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: "⚠️ Error communicating with the database analytics." }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: "❌ Sorry, I am offline or cannot reach the server." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Button 
              size="fab" 
              className="w-14 h-14 bg-gradient-to-tr from-[#182232] to-[#425a81] text-white shadow-2xl hover:scale-110 transition-transform ring-4 ring-white/20"
              onClick={() => setIsOpen(true)}
            >
              <MessageSquareMore className="w-7 h-7" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-20 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] z-50 flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#182232] p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#feda5a] to-[#ff9d00] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#182232]" />
                </div>
                <div>
                  <h3 className="text-sm font-heading font-bold leading-none">SiteHelper</h3>
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online • Live SQL Access
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-5 bg-[#fcfcff] scroll-smooth"
            >
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-[#182232]/10' : 'bg-[#feda5a]/20'
                  }`}>
                    {msg.role === 'user' ? <User size={14} className="text-[#182232]" /> : <Bot size={14} className="text-[#715c00]" />}
                  </div>
                  <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs font-sans shadow-sm prose prose-sm prose-p:leading-relaxed prose-pre:bg-[#182232] prose-pre:text-white ${
                    msg.role === 'user' 
                      ? 'bg-[#182232] text-white rounded-tr-none' 
                      : 'bg-white border border-gray-100 text-[#2d3748] rounded-tl-none'
                  }`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                   <div className="w-7 h-7 rounded-full bg-[#feda5a]/20 flex items-center justify-center">
                     <Bot size={14} className="text-[#715c00]" />
                   </div>
                   <div className="p-3 rounded-2xl bg-white border border-gray-100 rounded-tl-none shadow-sm flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                   </div>
                </div>
              )}
            </div>

            {/* Quick Actions Scroll */}
            <div className="px-3 py-2 bg-gray-50/50 border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(action.query)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-600 hover:border-[#182232] hover:text-[#182232] transition-all whitespace-nowrap shadow-sm"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  className="w-full bg-[#f4f7ff] rounded-xl pl-4 pr-12 py-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#182232]/5 placeholder:text-gray-400"
                  placeholder="Ask about inventory, staff or finances..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isTyping || !input.trim()}
                  className="absolute right-2 w-8 h-8 bg-[#182232] text-white rounded-lg flex items-center justify-center hover:bg-[#2d3748] disabled:opacity-50 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
