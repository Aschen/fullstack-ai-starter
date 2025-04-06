"use client";

import { useChat } from "@ai-sdk/react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function StructuredOutputChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/structured-output-chat",
  });

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-4 h-screen">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Simple Chat</h1>
        <div className="flex gap-4">
          <Link href="/" className="text-blue-500 hover:text-blue-700 text-sm">
            Home
          </Link>
          <Link
            href="/chat"
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Original Chat
          </Link>
          <Link
            href="/structured-output-chat"
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Structured Output
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.role === "assistant" && message.reasoning && (
                <div className="mb-2 text-sm italic text-gray-600 border-l-2 border-gray-400 pl-2">
                  <div className="font-semibold text-gray-700">Thoughts:</div>
                  {message.reasoning}
                </div>
              )}
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
          className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
}
