import { NextResponse } from "next/server"
import OpenAI from "openai"

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { content } = await req.json()

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Generate 3-5 thoughtful follow-up questions that a user might want to ask a Catholic saint based on the saint's previous response. The questions should be directly related to the context of the previous message and help the user learn more about the saint's life, teachings, or spiritual insights. Keep questions concise (under 10 words if possible) and focused on spiritual or historical aspects of the saint's life.",
        },
        {
          role: "user",
          content: `Generate follow-up questions based on this message from a saint: "${content}"`,
        },
      ],
      temperature: 0.7,
    })

    // Extract the suggestions from the response
    const generatedContent = response.choices[0]?.message?.content || ""

    // Try to parse the suggestions as a list
    let suggestions: string[] = []

    try {
      // Look for JSON array in the response
      const match = generatedContent.match(/\[[\s\S]*\]/)
      if (match) {
        suggestions = JSON.parse(match[0])
      } else {
        // If no JSON array, try to extract bullet points or numbered list
        suggestions = generatedContent
          .split(/\n+/)
          .filter((line) => line.match(/^[\d\-*•.\s]+/))
          .map((line) => line.replace(/^[\d\-*•.\s]+/, "").trim())
          .filter(Boolean)
      }
    } catch (error) {
      console.error("Error parsing suggestions:", error)
      // Fallback: split by newlines and clean up
      suggestions = generatedContent
        .split(/\n+/)
        .map((line) => line.trim())
        .filter((line) => line.endsWith("?") && line.length < 100)
        .slice(0, 5)
    }

    // If we still don't have suggestions, provide defaults
    if (suggestions.length === 0) {
      suggestions = [
        "What is your greatest teaching?",
        "How did you find your calling?",
        "What challenges did you face?",
        "What advice would you give me?",
        "Tell me about your spiritual journey",
      ]
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Error in suggestions API:", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}

