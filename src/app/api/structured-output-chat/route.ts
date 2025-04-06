import { openai } from "@ai-sdk/openai";
import { streamObject, streamText } from "ai";
import { z } from "zod";

const model = openai("gpt-4o-mini");

const responseSchema = z.object({
  thoughts: z.string(),
  answer: z.string(),
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const { partialObjectStream } = await streamObject({
    model,
    system: "You are a learning assistant from epitech",
    messages: messages,
    schema: responseSchema,
  });

  // Create a new ReadableStream that will emit both thoughts and answer
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let previousThoughts = "";
        let previousAnswer = "";
        let thoughtsComplete = false;

        for await (const partialObject of partialObjectStream) {
          // Handle thoughts
          if (partialObject.thoughts) {
            // Calculate the new part of the thoughts
            const newThoughtsPart = partialObject.thoughts.slice(
              previousThoughts.length
            );

            // Only send if there's new content
            if (newThoughtsPart) {
              // Format according to the data stream protocol
              // Use type 'g' for reasoning/thoughts
              controller.enqueue(`g:${JSON.stringify(newThoughtsPart)}\n`);
            }

            // Update the previous thoughts for the next iteration
            previousThoughts = partialObject.thoughts;
          }

          // Handle answer
          if (partialObject.answer) {
            // If this is the first time we're seeing the answer, mark thoughts as complete
            if (!thoughtsComplete) {
              thoughtsComplete = true;
              // Send a marker to indicate thoughts are complete
              controller.enqueue(
                `8:${JSON.stringify([{ thoughtsComplete: true }])}\n`
              );
            }

            // Calculate the new part of the answer
            const newAnswerPart = partialObject.answer.slice(
              previousAnswer.length
            );

            // Only send if there's new content
            if (newAnswerPart) {
              // Format according to the data stream protocol
              controller.enqueue(`0:${JSON.stringify(newAnswerPart)}\n`);
            }

            // Update the previous answer for the next iteration
            previousAnswer = partialObject.answer;
          }
        }

        // Send the finish message part
        controller.enqueue(
          `d:${JSON.stringify({
            finishReason: "stop",
            usage: { promptTokens: 0, completionTokens: 0 },
          })}\n`
        );
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  // Return the stream with the appropriate headers
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "x-vercel-ai-data-stream": "v1",
    },
  });
}
