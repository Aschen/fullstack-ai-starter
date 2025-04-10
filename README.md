# Fullstack AI Chat Application

A modern, full-stack AI chat application built with Next.js, featuring real-time chat capabilities, persistent chat history, and structured output processing.

## Features

- 🤖 AI-powered chat interface with support for multiple AI providers
- 💬 Real-time chat functionality
- 📝 Persistent chat history using PostgreSQL
- 🎯 Structured output processing for enhanced AI responses
- 🐳 Docker support for easy development and deployment

## Prerequisites

- Node.js 20.0 or later
- npm or yarn package manager
- Docker and Docker Compose (for running PostgreSQL)

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
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=aichat
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   ```

4. Start the PostgreSQL database:

   ```bash
   docker-compose up -d
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

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
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Database

The application uses PostgreSQL as its database. The database configuration is managed through Docker Compose, making it easy to set up and maintain. The database schema includes:

- `chats` table: Stores chat sessions
- `messages` table: Stores individual messages within chats

## Docker

The application includes a Docker Compose configuration for running PostgreSQL. To start the database:

```bash
docker-compose up -d
```

To stop the database:

```bash
docker-compose down
```
