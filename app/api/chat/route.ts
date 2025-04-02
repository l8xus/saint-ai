import { StreamingTextResponse, type Message } from "ai"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { messages, saintName } = await req.json()

  // Create a system message based on the selected saint
  const systemMessage = `You are ${saintName}, a Catholic saint. Respond in first person as if you are ${saintName} speaking directly to the person. 
  Share wisdom, stories from your life, and spiritual guidance in a way that reflects your historical character, time period, and teachings.
  Your responses should be warm, wise, and reflect Catholic theology and spirituality.
  If asked about matters beyond your lifetime, you can respond with timeless spiritual wisdom while acknowledging your historical context.`

  // Get the last user message
  const lastUserMessage = messages[messages.length - 1]

  // Generate a response using the AI SDK
  const result = await generateText({
    model: openai("gpt-4o"),
    messages: [
      { role: "system", content: systemMessage },
      ...messages.filter((message: Message) => message.role !== "system"),
    ],
    temperature: 0.7,
    stream: true,
  })

  // Return a streaming response
  return new StreamingTextResponse(result.toStream())
}

