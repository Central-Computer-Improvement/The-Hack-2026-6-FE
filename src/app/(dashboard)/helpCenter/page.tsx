"use client";

import React, { useState } from "react";
import { Search, Grid, User, CreditCard, Headphones, Plus, Minus, MessageCircle } from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import FadeIn from "@/components/atoms/framer/FadeIn";
import { SelectionCard } from "@/components/molecules/SelectionCard";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const HELP_CATEGORIES = [
  { id: "general", title: "General", icon: Grid, desc: "Basic platform usage and guides." },
  { id: "account", title: "Account", icon: User, desc: "Manage your profile and settings." },
  { id: "payment", title: "Payment", icon: CreditCard, desc: "Subscriptions and billing info." },
  { id: "support", title: "Support", icon: Headphones, desc: "Get in touch with our team." },
];

const FAQ_DATA: Record<string, { id: number; question: string; answer: string }[]> = {
  general: [
    { id: 1, question: "How do I switch roles from Student to Parent?", answer: "Go to Settings > Account Profile. Click 'Switch Role' and enter your PIN." },
    { id: 2, question: "Can I download PDF summaries for offline reading?", answer: "Yes! A 'Download Summary' button will appear once the AI finishes processing." },
    { id: 3, question: "Why is the AI Study Buddy responding slowly?", answer: "Response times depend on internet connection and server load. If it takes longer than usual, please try refreshing the page or checking your connection." },
  ],
  account: [
    { id: 4, question: "How do I reset my password?", answer: "Go to the login page and click 'Forgot Password' to receive a reset link via email." },
    { id: 5, question: "Can I change my avatar?", answer: "Yes, head over to your profile settings to choose a new avatar or upload your own." }
  ],
  payment: [
    { id: 6, question: "What payment methods are accepted?", answer: "We accept all major credit cards, PayPal, and bank transfers." },
    { id: 7, question: "How do I cancel my subscription?", answer: "You can cancel anytime from the Billing tab in your Account Settings." }
  ]
};

const FAQ_TABS = [
  { id: "general", label: "General" },
  { id: "account", label: "Account" },
  { id: "payment", label: "Payment" },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(1); // Default open FAQ 1

  const currentFaqs = FAQ_DATA[activeTab] || [];

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* 1. HERO & SEARCH SECTION */}
        <FadeIn direction="up" delay={0.1}>
          <div className="text-center space-y-6 pt-8">
            <Heading level={1} variant="display-hero" className="text-slate-900">
              Hi, how can we help?
            </Heading>
            
            <div className="relative max-w-2xl mx-auto mt-6">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-full shadow-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5D44D8] focus:border-transparent transition-all"
              />
            </div>
          </div>
        </FadeIn>

        {/* 2. CATEGORY CARDS GRID */}
        <FadeIn direction="up" delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HELP_CATEGORIES.map((cat) => (
              <SelectionCard 
                key={cat.id}
                title={cat.title}
                description={cat.desc}
                icon={cat.icon}
                selected={activeTab === cat.id}
                onClick={() => {
                  if (cat.id !== "support") setActiveTab(cat.id);
                }}
                className={cat.id === "support" ? "hover:border-slate-300" : ""}
              />
            ))}
          </div>
        </FadeIn>

        {/* 3. FAQ SECTION (SPLIT LAYOUT) */}
        <FadeIn direction="up" delay={0.3}>
          <div>
            <Heading level={2} className="text-slate-900 mb-8">
              FAQ
            </Heading>
            
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              
              {/* Sidebar Tabs */}
              <div className="md:w-1/4 flex flex-col gap-2 shrink-0">
                {FAQ_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "text-left px-5 py-3 rounded-[16px] font-bold transition-all",
                      activeTab === tab.id 
                        ? "bg-[#5D44D8] text-white shadow-md shadow-indigo-500/20" 
                        : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* FAQ Accordion List */}
              <div className="md:w-3/4 space-y-4">
                {currentFaqs.map((faq) => (
                  <div 
                    key={faq.id} 
                    className={cn(
                      "border rounded-[20px] overflow-hidden transition-all duration-300",
                      expandedFaq === faq.id 
                        ? "bg-white border-indigo-100 shadow-sm" 
                        : "bg-transparent border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                      <Text 
                        className={cn(
                          "font-bold text-[16px] pr-4", 
                          expandedFaq === faq.id ? "text-[#5D44D8]" : "text-slate-800"
                        )}
                      >
                        {faq.question}
                      </Text>
                      <div className="shrink-0 text-slate-400">
                        {expandedFaq === faq.id ? (
                          <Minus className="w-5 h-5 text-[#5D44D8]" />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                      </div>
                    </button>
                    
                    <div 
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        expandedFaq === faq.id ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="p-6 pt-0 text-slate-500">
                          <Text variant="body-medium" className="leading-relaxed">
                            {faq.answer}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 4. CONTACT BANNER */}
        <FadeIn direction="up" delay={0.4}>
          <div className="bg-[#EAE4FC] border border-indigo-100 rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <Heading level={3} className="text-slate-900 mb-2">
                Still have questions?
              </Heading>
              <Text variant="body-large" className="text-slate-600">
                {"Can't find the answer you're looking for? Please chat to our friendly team."}
              </Text>
            </div>
            <button className="shrink-0 flex items-center gap-2 bg-[#5D44D8] text-white px-8 py-4 rounded-[16px] font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
              <MessageCircle className="w-5 h-5" />
              Contact Us
            </button>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}