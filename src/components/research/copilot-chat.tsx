"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  X,
  Send,
  ChevronUp,
  Sparkles,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "What are the top selling angles?",
  "Summarize their recent security posture",
  "Draft a cold email for the CTO",
];

function mockResponse(company: string, userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("selling") || lower.includes("angle")) {
    return `Based on ${company}'s profile, here are the key selling angles:\n\n1. They're actively hiring senior engineering talent — they need tools that accelerate onboarding.\n2. Their tech stack shows recent adoption of modern data tools — they're investing in infrastructure.\n3. Their growth trajectory suggests they'll need to scale security operations soon.`;
  }
  if (lower.includes("security") || lower.includes("posture")) {
    return `${company}'s security posture analysis:\n\n- No major breaches reported in the last 12 months\n- They've recently added monitoring tooling to their stack\n- Their hiring patterns suggest they're building out a dedicated security team\n- Regulatory exposure is moderate given their industry vertical`;
  }
  if (lower.includes("email") || lower.includes("draft") || lower.includes("cold")) {
    return `Here's a cold email draft for ${company}'s CTO:\n\nSubject: Quick question about ${company}'s security roadmap\n\nHi [Name],\n\nI noticed ${company} recently brought on new infrastructure tooling — congrats on the growth. As you scale, security operations tend to become a bottleneck.\n\nWe help teams like yours automate threat detection without adding headcount. Would a 15-minute call next week make sense?\n\nBest,\n[Your name]`;
  }
  return `Based on ${company}'s profile, here's what stands out:\n\n- Their growth stage and funding suggest they're in a buying window for enterprise tools\n- The recent hiring signals indicate expanding teams that need tooling support\n- Their tech stack shows a preference for modern, cloud-native solutions\n\nWould you like me to dig deeper into any specific area?`;
}

interface CopilotChatProps {
  company: string;
}

export function CopilotChat({ company }: CopilotChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (content: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: mockResponse(company, content),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  return (
    <>
      {/* Toggle button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 lg:hidden"
          >
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
              onClick={() => setIsOpen(true)}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: sticky right panel */}
      <div className="hidden lg:flex flex-col w-80 xl:w-96 border-l border-gray-100 bg-white h-full">
        <ChatContent
          company={company}
          messages={messages}
          input={input}
          setInput={setInput}
          isTyping={isTyping}
          onSubmit={handleSubmit}
          onSendSuggested={sendMessage}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {/* Mobile: bottom sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 h-[70vh] bg-white rounded-t-2xl shadow-2xl border-t border-gray-100 flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span className="font-semibold text-sm">Research Co-Pilot</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <ChevronUp className="h-4 w-4 rotate-180" />
              </Button>
            </div>
            <ChatContent
              company={company}
              messages={messages}
              input={input}
              setInput={setInput}
              isTyping={isTyping}
              onSubmit={handleSubmit}
              onSendSuggested={sendMessage}
              messagesEndRef={messagesEndRef}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ChatContent({
  company,
  messages,
  input,
  setInput,
  isTyping,
  onSubmit,
  onSendSuggested,
  messagesEndRef,
}: {
  company: string;
  messages: ChatMessage[];
  input: string;
  setInput: (v: string) => void;
  isTyping: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSendSuggested: (msg: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header (desktop) */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <Sparkles className="h-4 w-4 text-indigo-600" />
        <span className="font-semibold text-sm">Research Co-Pilot</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Hi! I can help you analyze {company}&apos;s profile. Try one of
              these:
            </p>
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onSendSuggested(prompt)}
                  className="block w-full text-left text-sm px-3 py-2 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-2xl px-4 py-2.5 text-sm text-gray-500">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:0.1s]">.</span>
                <span className="animate-bounce [animation-delay:0.2s]">.</span>
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="border-t border-gray-100 px-4 py-3 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this company..."
          className="flex-1 text-sm rounded-full border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-shadow"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!input.trim()}
          className="rounded-full h-9 w-9 p-0 bg-indigo-600 hover:bg-indigo-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
