"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
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

export interface CopilotChatProps {
  company: string;
  researchRunId?: string;
}

export function CopilotChat({ company, researchRunId }: CopilotChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // If we have a researchRunId, use the streaming API
    if (researchRunId) {
      try {
        const res = await fetch(`/api/research/${researchRunId}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content }),
        });

        if (!res.ok) throw new Error("Chat failed");

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        const assistantId = crypto.randomUUID();

        // Add empty assistant message that we'll stream into
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "" },
        ]);
        setIsTyping(false);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") break;
                try {
                  const parsed = JSON.parse(data);
                  fullText += parsed.text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId ? { ...m, content: fullText } : m
                    )
                  );
                } catch {
                  // skip malformed chunks
                }
              }
            }
          }
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Sorry, I couldn't generate a response. Please try again.",
          },
        ]);
        setIsTyping(false);
      }
    } else {
      // Fallback mock for when no researchRunId
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `I can help analyze ${company} once the research data is loaded. Try running a research query first.`,
          },
        ]);
        setIsTyping(false);
      }, 500);
    }
  }, [company, researchRunId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  return (
    <>
      {/* Mobile toggle */}
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
      <div className="hidden lg:flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <Sparkles className="h-4 w-4 text-indigo-600" />
        <span className="font-semibold text-sm">Research Co-Pilot</span>
      </div>

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
