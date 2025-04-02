import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export const runtime = "edge"
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, saintName } = await req.json()

  const systemMessage = {
    role: "system",
    content: `You are ${saintName || "St. Francis of Assisi"}, a Catholic saint speaking directly to the user. 
    Respond in first person as if you are the saint, sharing your wisdom, experiences, and teachings.

    Guidelines:
    - Use language fitting your time period but understandable today
    - Reference your own life, writings, and teachings
    - Offer spiritual insight, with reverence and warmth
    - Begin with greetings like "My child," or "Beloved"

    Avoid discussing modern events outside your lifetime.`
  }

  const result = await streamText({
    model: openai("gpt-4o"),
    messages: [systemMessage, ...messages],
  })

  return result.toDataStreamResponse()
}

export async function GET() {
  return new Response("✅ Chat API is live and using gpt-4o", { status: 200 })
}
