"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
};

const RESPONSES = [
  {
    keywords: ["risk", "spoilage", "department", "fish", "dairy", "highest"],
    answer: "Fish and Dairy departments currently show the highest spoilage risk.\n\nFish Department:\n- Waste Risk: 11.2%\n- Main Issue: cold-chain compliance failures\n- Estimated quarterly loss: 4,200 AZN\n\nDairy Department:\n- FIFO compliance below target (75%)\n- Near-expiry clearance rate: 67%\n\nRecommended Actions:\n- Immediate cold-chain audits\n- AI-triggered markdown pricing\n- Mandatory morning FIFO checks"
  },
  {
    keywords: ["reduce", "waste", "next quarter", "savings", "how"],
    answer: "Projected waste reduction opportunities:\n\n1. Improve Dairy FIFO compliance from 75% to 88%\nPotential savings: 6,800 AZN/quarter\n\n2. Introduce AI markdown pricing for near-expiry products\nPotential recovery: 9,400 AZN/quarter\n\n3. Expand daily AI mission system to Fish departments\nProjected spoilage reduction: 14%\n\nEstimated total quarterly savings:\n18,000+ AZN"
  }
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm Bravo Opsis, your operational intelligence assistant. How can I help you optimize your store today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Matching logic
    setTimeout(() => {
      const lowerText = userText.toLowerCase();
      const match = RESPONSES.find(r => 
        r.keywords.some(keyword => lowerText.includes(keyword))
      );

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: match ? match.answer : "I'm sorry, I don't have enough data to answer that specific question. Try asking about 'spoilage risks' or 'waste reduction'.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 opacity-10">
                <Sparkles size={80} />
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <div className="bg-primary-foreground/20 p-1.5 rounded-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Bravo Opsis</h3>
                  <p className="text-[10px] opacity-80 uppercase tracking-wider font-medium">Operational Intelligence</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary-foreground/10 p-1.5 rounded-full transition-colors relative z-10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950/50"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-2xl rounded-tl-none text-xs flex gap-1 shadow-sm">
                    <span className="animate-pulse w-1.5 h-1.5 bg-zinc-400 rounded-full"></span>
                    <span className="animate-pulse delay-75 w-1.5 h-1.5 bg-zinc-400 rounded-full"></span>
                    <span className="animate-pulse delay-150 w-1.5 h-1.5 bg-zinc-400 rounded-full"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Bravo Opsis a question..."
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary text-primary-foreground p-2 rounded-xl disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary/20"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center border-2 border-white/20 relative group"
      >
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 group-hover:opacity-0 transition-opacity"></div>
        <MessageSquare size={24} className="relative z-10" />
      </motion.button>
    </div>
  );
}
