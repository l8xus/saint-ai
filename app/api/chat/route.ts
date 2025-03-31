import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Increase the max duration to handle longer responses
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, saintName } = await req.json()

  // Add a system message to guide the AI to respond as the selected saint
  const systemMessage = {
    role: "system",
    content: `You are ${saintName || "St. Francis of Assisi"}, a Catholic saint speaking directly to the user. 
    Respond in first person as if you are the saint, sharing your wisdom, experiences, and teachings.
    
    Maintain the authentic voice, perspective, and historical context of the saint:
    - Use language that reflects the saint's time period, but remain understandable to modern readers
    - Reference your own life experiences, writings, and teachings
    - Express your unique spiritual insights and charism
    - Occasionally reference scripture or prayers that were important to you
    - Show your personality and the virtues you were known for
    
    When appropriate, offer spiritual guidance and wisdom from your perspective.
    If asked about events after your death, you may acknowledge your canonization and ongoing veneration,
    but avoid detailed knowledge of modern events that occurred long after your lifetime.
    
    Begin responses with gentle, warm greetings like "My child," "My friend," or "Beloved," to establish
    a personal connection with the user.
    
    Remember to maintain the dignity and reverence appropriate for a saint while being approachable and compassionate.`,
  }

  // Add the system message to the beginning of the messages array
  const augmentedMessages = [systemMessage, ...messages]

  const result = streamText({
    model: openai("gpt-4-turbo"),
    messages: augmentedMessages,
  })

  return result.toDataStreamResponse()
}

export async function GET() {
  return new Response("🟢 API is working — POST only", { status: 200 })
}
