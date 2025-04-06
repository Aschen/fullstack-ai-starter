import Link from "next/link";
import { listChats } from "@/db/chatRepository";

export default async function Home() {
  const chats = await listChats();

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-2xl text-center space-y-6 mb-8">
        <h1 className="text-4xl font-bold">Welcome to AI Chat</h1>
        <p className="text-xl text-gray-600">
          Start a conversation with our AI assistant. Your chat history will be
          saved automatically.
        </p>
        <Link
          href="/chat"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start a New Chat
        </Link>

        <div className="mt-4">
          <Link
            href="/structured-output-chat"
            className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Try Structured Output Chat
          </Link>
        </div>
      </div>

      {chats.length > 0 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Past Conversations</h2>
          <div className="space-y-3">
            {chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-800">
                    Chat {chat.id.slice(0, 8)}...
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(chat.createdAt).toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
