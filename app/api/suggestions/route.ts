import { NextResponse } from "next/server"
import OpenAI from "openai"

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { content } = await req.json()

    // Extract suggestions from the message content
    const suggestionsMatch = content.match(/\[(.*?)\]/s)

    if (suggestionsMatch && suggestionsMatch[0]) {
      try {
        // Try to parse the suggestions as JSON
        const suggestionsJson = suggestionsMatch[0]
        const suggestions = JSON.parse(suggestionsJson)

        if (Array.isArray(suggestions) && suggestions.length > 0) {
          return NextResponse.json({ suggestions })
        }
      } catch (error) {
        console.error("Error parsing suggestions:", error)
      }
    }

    // If no suggestions were found or parsing failed, generate new ones
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates follow-up questions based on a conversation with a Catholic saint. Generate 3-5 thoughtful questions that would help the user learn more about the saint's life, teachings, or spiritual insights.",
        },
        {
          role: "user",
          content: `Based on this message from a saint, generate 3-5 follow-up questions that a user might want to ask: "${content}"`,
        },
      ],
      temperature: 0.7,
    })

    // Extract the suggestions from the response
    const generatedContent = response.choices[0]?.message?.content || ""
    const generatedSuggestionsMatch = generatedContent.match(/\[(.*?)\]/s)

    if (generatedSuggestionsMatch && generatedSuggestionsMatch[0]) {
      try {
        const suggestionsJson = generatedSuggestionsMatch[0]
        const suggestions = JSON.parse(suggestionsJson)

        if (Array.isArray(suggestions) && suggestions.length > 0) {
          return NextResponse.json({ suggestions })
        }
      } catch (error) {
        console.error("Error parsing generated suggestions:", error)
      }
    }

    // If all else fails, return default suggestions
    return NextResponse.json({
      suggestions: [
        "What is your greatest teaching?",
        "How did you find your calling?",
        "What challenges did you face?",
        "What advice would you give me?",
        "Tell me about your spiritual journey",
      ],
    })
  } catch (error) {
    console.error("Error in suggestions API:", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}

