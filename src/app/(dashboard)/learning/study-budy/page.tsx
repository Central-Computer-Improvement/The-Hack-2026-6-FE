"use client";

import React, { useState } from "react";
import { MoreVertical, Paperclip, Mic, Send, Loader2 } from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import { cn } from "@/lib/utils";

// --- MOCK DATA RECENT CHATS ---
const RECENT_CHATS = [
  { id: 1, title: "Fractions & Decimals", snippet: "Let's practice converting...", time: "Just now", isActive: true },
  { id: 2, title: "Solar System Explorer", snippet: "Jupiter is the largest planet, correct?", time: "Yesterday", isActive: false },
  { id: 3, title: "Creative Writing", snippet: "Once upon a time in a digital...", time: "Tuesday", isActive: false },
];

// --- INITIAL MESSAGE (Hanya sapaan awal AI) ---
const INITIAL_MESSAGES = [
  { 
    id: 1, 
    sender: "ai", 
    text: "Hi there! What do you want to ask me?" 
  }
];

export default function StudyBuddyPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Indikator saat AI memproses jawaban

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    const userMessage = { id: Date.now(), sender: "user", text: userText };

    // 1. Tambahkan pesan user ke antarmuka
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // =========================================================================
      // 🚀 RUANG INTEGRASI API AI EKSTERNAL
      // =========================================================================
      // Contoh implementasi fetch ke endpoint backend/AI:
      /*
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await response.json();
      const aiReply = data.reply;
      */

      // Placeholder simulasi balasan AI sementara sebelum API dipasang:
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const aiReply = "This is a placeholder response. Replace this with your actual AI service integration.";

      // 2. Tambahkan respon AI ke chat
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: aiReply }
      ]);
      // =========================================================================

    } catch (error) {
      console.error("Gagal mendapatkan respons AI:", error);
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now() + 1, 
          sender: "ai", 
          text: "Maaf, terjadi kesalahan saat memproses permintaanmu. Silakan coba lagi nanti." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[85vh] gap-6 w-full max-w-[1200px] mx-auto font-sans">
      
      {/* === BAGIAN KIRI: RECENT CHATS === */}
      <div className="w-full lg:w-[320px] bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col shrink-0">
        <Heading level={2} variant="h4" className="mb-6 text-slate-800">
          Recent Chats
        </Heading>
        
        <div className="flex flex-col gap-2 overflow-y-auto pr-2 no-scrollbar">
          {RECENT_CHATS.map((chat) => (
            <div 
              key={chat.id} 
              className={cn(
                "relative p-4 rounded-2xl cursor-pointer transition-colors duration-200",
                chat.isActive ? "bg-[#F4F3FF]" : "hover:bg-slate-50 border border-transparent"
              )}
            >
              {chat.isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-indigo-600 rounded-r-md"></div>
              )}
              
              <div className="flex justify-between items-start mb-1.5">
                <Text className="font-bold text-slate-800 text-[15px]">{chat.title}</Text>
                <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap ml-2">{chat.time}</span>
              </div>
              <Text className="text-[13px] text-slate-500 truncate">{chat.snippet}</Text>
            </div>
          ))}
        </div>
      </div>

      {/* === BAGIAN KANAN: CHAT INTERFACE === */}
      <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        
        {/* Header Chat */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 bg-white z-10">
           <div className="flex items-center gap-4">
              <img 
                src="/assets/images/prof-paw.webp" 
                className="w-12 h-12 rounded-full border border-slate-100 bg-indigo-50" 
                alt="Professor Paw" 
              />
              <div>
                <Heading level={3} variant="h5" className="text-slate-800 text-lg">Professor Paw</Heading>
                {/* Indikator status online sudah dihilangkan */}
              </div>
           </div>
           <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
             <MoreVertical className="w-5 h-5 text-slate-400" />
           </button>
        </div>

        {/* Area Pesan Terkirim (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#F8F9FD]/50">
          
          {/* Badge Tanggal */}
          <div className="flex justify-center mb-2">
            <span className="px-4 py-1 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-full uppercase tracking-wider">
              Today
            </span>
          </div>

          {/* Mapping Pesan */}
          {messages.map((msg) => {
            const isAI = msg.sender === "ai";
            return (
              <div key={msg.id} className={cn("flex w-full", isAI ? "justify-start" : "justify-end")}>
                <div className={cn("flex gap-3 max-w-[80%]", isAI ? "flex-row" : "flex-row-reverse")}>
                  
                  {/* Avatar Mini */}
                  <img 
                    src={isAI ? "/assets/images/prof-paw.webp" : "/user.webp"} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white shrink-0" 
                  />
                  
                  {/* Bubble Pesan */}
                  <div className={cn(
                    "flex flex-col p-4 px-5 shadow-sm text-[15px] leading-relaxed",
                    isAI 
                      ? "bg-[#6C5CE7] text-white rounded-[24px] rounded-tl-sm"
                      : "bg-white text-slate-700 border border-slate-100 rounded-[24px] rounded-tr-sm"
                  )}>
                    <span className="whitespace-pre-line">{msg.text}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Indikator Loading Saat AI Mengetik */}
          {isLoading && (
            <div className="flex w-full justify-start">
              <div className="flex gap-3 max-w-[80%] items-center">
                <img 
                  src="/assets/images/prof-paw.webp" 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white shrink-0" 
                />
                <div className="bg-[#6C5CE7]/10 text-[#6C5CE7] p-3 px-4 rounded-[20px] rounded-tl-sm text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 px-6 bg-white border-t border-slate-100">
          <div className="flex items-center gap-3 bg-[#F8F9FD] border border-slate-200 rounded-full p-2 pl-5 pr-2 transition-all focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50">
            
            <button className="text-slate-400 hover:text-indigo-500 transition-colors shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={inputValue}
              disabled={isLoading}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-transparent outline-none text-slate-700 text-sm placeholder:text-slate-400 disabled:opacity-50" 
            />
            
            <button className="text-slate-400 hover:text-indigo-500 transition-colors shrink-0 mr-1">
              <Mic className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center hover:bg-amber-600 transition-transform active:scale-95 shrink-0 shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-[18px] h-[18px] text-white animate-spin" />
              ) : (
                <Send className="w-[18px] h-[18px] text-white -ml-0.5" />
              )}
            </button>
            
          </div>
        </div>

      </div>
    </div>
  );
}