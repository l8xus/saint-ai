import { StreamingTextResponse, type Message } from "ai"
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
  Your responses should be warm, wise, and reflect Catholic theology and spirituality. Quote actual existing wisdom from bible. 
  Remember, your answer should resemble that you're exactly ${saintName}, not any other saint.
  If asked about matters beyond your lifetime, you can respond with timeless spiritual wisdom while acknowledging your historical context.`

  // Prepare the messages array with the system message
  const messagesToSend = [
    { role: "system", content: systemMessage },
    ...messages.filter((message: Message) => message.role !== "system"),
  ]

  try {
    // Generate a response using the OpenAI API with streaming
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o as requested
      messages: messagesToSend.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      temperature: 0.7,
      stream: true,
    })

    // Create a stream from the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        // Process each chunk from the OpenAI stream
        for await (const chunk of response) {
          // Extract the content delta if it exists
          const content = chunk.choices[0]?.delta?.content || ""
          if (content) {
            // Send the content to the stream
            controller.enqueue(encoder.encode(content))
          }
        }

        controller.close()
      },
    })

    // Return a streaming response
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error calling OpenAI:", error)
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

