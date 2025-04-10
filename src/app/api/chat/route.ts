import { openai } from "@ai-sdk/openai";
import { AssistantMessage, generateObject } from "ai";
import { saveChat } from "@/db/chatRepository";
import { z} from "zod"


const uuidv4 = (a?: any) =>
  a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuidv4);

const schema = z.object({
  answer: z.string(),
})

export async function POST(req: Request) {
  const { messages, id } = await req.json();

  const systemPrompt = `Tu es un assistant pédagogique.

  Répond en français uniquement

  Répond avec le format suivant:
  {
    "answer": "ta réponse"
  }`

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: schema,
    system: systemPrompt,
    messages,
  });

  const assistantMessage = {
    id:uuidv4(),
    role: 'assistant',
    content: [
      {
        type:"text",
        text: object.answer
      }
    ],
    createdAt: Date.now()
  }

  // Save the chat messages including the response
  await saveChat({
    id,
    messages: [...messages, assistantMessage],
  });

  // Return the response as JSON
  return Response.json({ messages: [assistantMessage] });
}
