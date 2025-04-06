import { openai } from "@ai-sdk/openai";
import { appendResponseMessages, streamText } from "ai";
import { saveChat } from "@/db/chatRepository";

export async function POST(req: Request) {
  const { messages, id } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    async onFinish({ response }) {
      await saveChat({
        id,
        messages: appendResponseMessages({
          messages,
          responseMessages: response.messages,
        }),
      });
    },
  });

  // Consume the stream to ensure it runs to completion & triggers onFinish
  // even when the client response is aborted:
  result.consumeStream(); // no await

  return result.toDataStreamResponse();
}
