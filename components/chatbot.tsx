"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
};

const PRE_CALCULATED_ANSWERS = {
  productivity: "Focus on completing high-priority missions first. Based on your current stats, reducing idle time between tasks could boost your score by up to 15%.",
  bottlenecks: "Currently, the main bottleneck is the checkout queue during peak hours (12 PM - 2 PM). Consider reallocating staff from back-office tasks during this window.",
  priority: "The 'FIFO Compliance Check' mission in Aisle 4 has the highest impact on risk reduction today. Completing it will prevent potential stock waste."
};

const QUESTIONS = [
  { id: "productivity", text: "How can I improve my productivity score today?" },
  { id: "bottlenecks", text: "What are the most common bottlenecks in my team?" },
  { id: "priority", text: "Which mission should I prioritize for maximum impact?" }
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your Bravo AI assistant. How can I help you today?",
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

  const handleQuestionClick = (questionId: string, questionText: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      text: questionText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: PRE_CALCULATED_ANSWERS[questionId as keyof typeof PRE_CALCULATED_ANSWERS],
        sender: "bot",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-semibold text-sm">Bravo AI Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary-foreground/10 p-1 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-muted-foreground rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground p-3 rounded-2xl rounded-tl-none text-xs flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-75">.</span>
                    <span className="animate-bounce delay-150">.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {!isTyping && (
              <div className="p-4 pt-0 flex flex-wrap gap-2">
                {QUESTIONS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionClick(q.id, q.text)}
                    className="text-[11px] bg-accent text-accent-foreground px-3 py-1.5 rounded-full hover:bg-accent/80 transition-colors text-left border border-border/50"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="p-4 border-t border-border flex gap-2">
              <input
                disabled
                placeholder="Ask a question..."
                className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs opacity-50 cursor-not-allowed"
              />
              <button
                disabled
                className="bg-primary/50 text-primary-foreground p-2 rounded-lg opacity-50 cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
}
