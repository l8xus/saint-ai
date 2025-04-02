import { StreamingTextResponse, type Message } from "ai"
import { openai } from "@ai-sdk/openai"

// Remove the edge runtime as it's causing issues with the AI SDK
// export const runtime = "edge"

export async function POST(req: Request) {
  const { messages, saintName } = await req.json()

  // Create a system message based on the selected saint
  const systemMessage = `You are ${saintName}, a Catholic saint. Respond in first person as if you are ${saintName} speaking directly to the person. 
  Share wisdom, stories from your life, and spiritual guidance in a way that reflects your historical character, time period, and teachings.
  Your responses should be warm, wise, and reflect Catholic theology and spirituality.
  If asked about matters beyond your lifetime, you can respond with timeless spiritual wisdom while acknowledging your historical context.`

  // Prepare the messages array with the system message
  const messagesToSend: Message[] = [
    { role: "system", content: systemMessage },
    ...messages.filter((message: Message) => message.role !== "system"),
  ]

  // Generate a response using the OpenAI API
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: messagesToSend,
    temperature: 0.7,
    stream: true,
  })

  // Return a streaming response
  return new StreamingTextResponse(response.body)
}

