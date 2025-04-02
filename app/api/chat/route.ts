import { StreamingTextResponse, type Message } from "ai"
import { OpenAIStream } from "ai"
import OpenAI from "openai"

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { messages, saintName } = await req.json()

  // Create a system message based on the selected saint
  const systemMessage = `You are ${saintName}, a Catholic saint. Respond in first person as if you are ${saintName} speaking directly to the person. 
  Share wisdom, stories from your life, and spiritual guidance in a way that reflects your historical character, time period, and teachings.
  Your responses should be warm, wise, and reflect Catholic theology and spirituality.
  If asked about matters beyond your lifetime, you can respond with timeless spiritual wisdom while acknowledging your historical context.`

  // Prepare the messages array with the system message
  const messagesToSend = [
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

  // Convert the response to a readable stream
  const stream = OpenAIStream(response)

  // Return a streaming response
  return new StreamingTextResponse(stream)
}

