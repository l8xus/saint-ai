import { openai } from "@ai-sdk/openai"
import { streamObject } from "ai"
import { z } from "zod"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { content } = await req.json()

  const result = await streamObject({
    model: openai("gpt-4o"),
    schema: z.object({ suggestions: z.array(z.string()) }),
    prompt: `Generate 3-5 thoughtful follow-up questions that a user might want to ask a Catholic saint based on the saint's previous response. The questions should be directly related to the context of the previous message and help the user learn more about the saint's life, teachings, or spiritual insights. Keep questions concise (under 10 words if possible) and focused on spiritual or historical aspects of the saint's life.

Previous message from the saint:
${content}`,
  })

  return result.toTextStreamResponse()
}

