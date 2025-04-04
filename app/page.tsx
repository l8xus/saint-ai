"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { ChevronLeft, ChevronRight, Menu, Send, X } from "lucide-react"

// Custom hook for scrolling to bottom
function useScrollToBottom<T extends HTMLElement>() {
  const containerRef = useRef<T>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  return [containerRef, bottomRef, scrollToBottom] as const
}

export default function Home() {
  const [selectedSaint, setSelectedSaint] = useState("St. Francis of Assisi")
  const [saintInfo, setSaintInfo] = useState({
    name: "St. Francis of Assisi",
    years: "1181-1226",
    description: "Founder of the Franciscan Order, known for my love of nature and animals.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/assissi-xsrYL2QtPtrEYH4rNJYmlDIPqYzdw0.jpeg",
    articleLink: "https://www.thecatholicvoice.com/saints/saint-francis-of-assisi-biography-miracles-and-wisdom",
  })
  const [showSuggestions, setShowSuggestions] = useState(true)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Add/remove body class when sidebar is open on mobile
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("sidebar-open")
    } else {
      document.body.classList.remove("sidebar-open")
    }

    return () => {
      document.body.classList.remove("sidebar-open")
    }
  }, [isMobileMenuOpen])

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } = useChat({
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content: `Peace be with you, my child. I am ${saintInfo.name}. How may I share my wisdom with you today?`,
      },
    ],
    api: "/api/chat",
    body: {
      saintName: selectedSaint,
    },
    onFinish: () => {
      // Check if there are user messages and hide suggestions if there are
      const userMessages = messages.filter((msg) => msg.role === "user")
      if (userMessages.length > 0) {
        setShowSuggestions(false)
      }
    },
  })

  const [messagesContainerRef, messagesEndRef, scrollToBottom] = useScrollToBottom<HTMLDivElement>()

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Check if there are user messages and update showSuggestions
  useEffect(() => {
    const userMessages = messages.filter((msg) => msg.role === "user")
    setShowSuggestions(userMessages.length === 0)
  }, [messages])

  // Update chat when saint changes
  useEffect(() => {
    const saintsData = {
      "St. Francis of Assisi": {
        name: "St. Francis of Assisi",
        years: "1181-1226",
        description: "Founder of the Franciscan Order, known for my love of nature and animals.",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/assissi-xsrYL2QtPtrEYH4rNJYmlDIPqYzdw0.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-francis-of-assisi-biography-miracles-and-wisdom",
      },
      "St. Thomas Aquinas": {
        name: "St. Thomas Aquinas",
        years: "1225-1274",
        description: "Dominican friar and Doctor of the Church, known for my theological writings.",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/thomas-9Kv24UV6iR1gEISzY3XtHAr1G57l4j.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-thomas-aquinas-biography-miracles-and-wisdom",
      },
      "St. Teresa of Ávila": {
        name: "St. Teresa of Ávila",
        years: "1515-1582",
        description: "Spanish mystic, Carmelite nun, and reformer of the Carmelite Order.",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avila-zcNzree2r4Y7mMecpkqr7lvi1IHEtN.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-teresa-of-avila-biography-miracles-and-wisdom",
      },
      "St. Augustine": {
        name: "St. Augustine",
        years: "354-430",
        description: "Bishop of Hippo and Doctor of the Church, known for my theological writings.",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/augistine-cl5Y961nWwBEBoAmBuuXZ41Sn3vjsb.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-augustine-of-hippo-biography-miracles-and-wisdom",
      },
      "St. Thérèse of Lisieux": {
        name: "St. Thérèse of Lisieux",
        years: "1873-1897",
        description: 'Carmelite nun known as "The Little Flower" and Doctor of the Church.',
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lisieux-d4NxJJC52xSrbWtRRCfpWKOksK3XYV.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-therese-of-lisieux-biography-miracles-and-wisdom",
      },
    }

    setSaintInfo(saintsData[selectedSaint as keyof typeof saintsData])

    // Reset chat with new welcome message
    setMessages([
      {
        id: "welcome-message",
        role: "assistant",
        content: `Peace be with you, my child. I am ${selectedSaint}. How may I share my wisdom with you today?`,
      },
    ])

    // Show suggestions when changing saints
    setShowSuggestions(true)
  }, [selectedSaint, setMessages])

  // Scroll suggestions
  const scrollSuggestions = (direction: "left" | "right") => {
    if (suggestionsRef.current) {
      const scrollAmount = 200
      if (direction === "left") {
        suggestionsRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        suggestionsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  const suggestedQuestions = [
    "What is your greatest teaching?",
    "How did you find your calling?",
    "What challenges did you face?",
    "What advice would you give me?",
    "Tell me about your spiritual journey",
    "How did you pray?",
    "What is your view on suffering?",
  ]

  const handleSaintChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSaint(e.target.value)
  }

  // Function to handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/placeholder.svg?height=200&width=200"
  }

  // Function to handle suggestion click
  const handleSuggestionClick = (question: string) => {
    append({
      role: "user",
      content: question,
    })
  }

  return (
    <>
      {/* Header */}
      <header className="flex flex-row justify-between items-center h-20 px-5 lg:px-10 bg-[#f0e6da] border-b border-[#d0b557] fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center">
          <button className="lg:hidden mr-4 text-[#76070d]" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-cinzel text-[#2b2357] font-bold">Sanctus Dialogus</h1>
        </div>
        <div className="text-xl font-cinzel text-[#2b2357]">Dialogue with {selectedSaint}</div>
      </header>

      <div className="main-layout pt-20">
        {/* Sidebar */}
        <div className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-cinzel text-[#2b2357] font-bold">Choose Your Saint</h2>
            <button className="lg:hidden text-[#76070d]" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <select
            className="w-full p-3 mb-6 bg-[#f0e6da] border border-[#d0b557] rounded-md font-futura text-[#2b2357]"
            value={selectedSaint}
            onChange={handleSaintChange}
          >
            <option value="St. Francis of Assisi">St. Francis of Assisi</option>
            <option value="St. Thomas Aquinas">St. Thomas Aquinas</option>
            <option value="St. Teresa of Ávila">St. Teresa of Ávila</option>
            <option value="St. Augustine">St. Augustine</option>
            <option value="St. Thérèse of Lisieux">St. Thérèse of Lisieux</option>
          </select>

          <div className="bg-white/50 border border-[#d0b557] rounded-lg p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-[#d0b557] overflow-hidden">
              <img
                src={saintInfo.image || "/placeholder.svg"}
                alt={saintInfo.name}
                className="w-full h-full object-cover rounded-full"
                onError={handleImageError}
              />
            </div>
            <h3 className="text-xl font-cinzel text-[#2b2357] font-bold mb-1">{saintInfo.name}</h3>
            <p className="text-sm text-[#76070d] italic mb-2">{saintInfo.years}</p>
            <p className="text-sm mb-4 font-futura">{saintInfo.description}</p>
            <a
              href={saintInfo.articleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#2b2357] text-white py-2 px-4 rounded font-cinzel text-sm hover:bg-[#2b2357]/80 transition-colors"
            >
              Read More
            </a>
          </div>
        </div>

        {/* Main content */}
        <div className="main-content">
          {/* Chat area */}
          <div className="chat-area" ref={messagesContainerRef}>
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role === "user" ? "user" : ""} animate-fadeIn`}>
                {message.role !== "user" && (
                  <div className="w-10 h-10 mr-3 rounded-full border-2 border-[#d0b557] overflow-hidden flex-shrink-0">
                    <img
                      src={saintInfo.image || "/placeholder.svg"}
                      alt={selectedSaint}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>
                )}

                <div className="message-content">
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="h-20"></div>
          </div>

          {/* Input area */}
          <div className="input-area">
            {showSuggestions && (
              <div className="suggestions-container">
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-[#f0e6da] border border-[#d0b557] rounded-full"
                  onClick={() => scrollSuggestions("left")}
                >
                  <ChevronLeft size={16} />
                </button>

                <div ref={suggestionsRef} className="suggestions scrollbar-hide">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      className="suggestion-button"
                      onClick={() => handleSuggestionClick(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>

                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-[#f0e6da] border border-[#d0b557] rounded-full"
                  onClick={() => scrollSuggestions("right")}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask for wisdom..."
                className="flex-1 p-3 bg-[#f0e6da] border border-[#d0b557] rounded-md font-futura"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-[#76070d] text-white p-3 rounded-md flex items-center justify-center disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

