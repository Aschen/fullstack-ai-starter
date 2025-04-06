# Fullstack AI Chat Application

A modern, full-stack AI chat application built with Next.js, featuring real-time chat capabilities, persistent chat history, and structured output processing.

## Features

- 🤖 AI-powered chat interface with support for multiple AI providers
- 💬 Real-time chat functionality
- 📝 Persistent chat history using SQLite
- 🎯 Structured output processing for enhanced AI responses

## Prerequisites

- Node.js 20.0 or later
- npm or yarn package manager
- SQLite (for local development)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/aschen/fullstack-ai-starter.git
   cd fullstack-ai-starter
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── chat/              # Chat interface
│   └── structured-output-chat/  # Structured output chat
├── components/            # Reusable React components
└── db/                    # Database related code
```

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
