"use client";

import { Message } from "ai";
import { useState, useEffect, useRef, useCallback } from "react";
import { nanoid } from "nanoid";

// Define types for structured content
type ContentPart = {
  type: string;
  text?: string;
  image?: string;
};

type MessageContent = string | ContentPart | ContentPart[];

export default function Chat({
  id,
  initialMessages,
}: {
  id?: string | undefined;
  initialMessages?: Message[];
} = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatId = useRef(id || nanoid());

  // Auto-scroll to the bottom of the chat
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!input.trim()) return;

      // Create a user message
      const userMessage: Message = {
        id: nanoid(),
        role: "user",
        content: input,
        createdAt: new Date(),
      };

      // Update messages state with the user's message
      setMessages((prev) => [...prev, userMessage]);

      // Clear input
      setInput("");

      // Set loading state
      setIsLoading(true);

      try {
        // Call the chat API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            id: chatId.current,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();

        // Update messages with AI response(s)
        setMessages((prev) => [...prev, ...data.messages]);
      } catch (error) {
        console.error("Error sending message:", error);
        // Could add error handling UI here
      } finally {
        setIsLoading(false);
      }
    },
    [input, messages]
  );

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((m: Message) => (
          <div
            key={m.id}
            className={`p-4 rounded-lg ${
              m.role === "user"
                ? "bg-blue-100 ml-auto max-w-[80%] text-gray-900"
                : "bg-gray-100 mr-auto max-w-[80%] text-gray-900"
            }`}
          >
            <div className="font-semibold mb-1 text-gray-900">
              {m.role === "user" ? "You" : "AI Assistant"}
            </div>
            <div className="whitespace-pre-wrap text-gray-900">
              {typeof m.content === 'string'
                ? m.content
                : Array.isArray(m.content)
                  ? (m.content as ContentPart[]).map((part: ContentPart, i: number) =>
                      part.type === 'text' ? <span key={i}>{part.text}</span> : null
                    )
                  : (m.content as ContentPart).type === 'text'
                    ? (m.content as ContentPart).text
                    : JSON.stringify(m.content)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 mr-auto max-w-[80%] p-4 rounded-lg text-gray-900">
            <div className="font-semibold mb-1">AI Assistant</div>
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
}
