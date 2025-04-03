"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { ChevronLeft, ChevronRight, Menu, Send, X } from "lucide-react"

// Import the images directly to ensure they're properly handled by Next.js
import stFrancisImage from "../public/images/saints/st-francis.jpg"
import stThomasImage from "../public/images/saints/st-thomas.jpg"
import stTeresaImage from "../public/images/saints/st-teresa.jpg"
import stAugustineImage from "../public/images/saints/st-augustine.jpg"
import stThereseImage from "../public/images/saints/st-therese.jpg"

export default function Home() {
  const [selectedSaint, setSelectedSaint] = useState("St. Francis of Assisi")
  const [saintInfo, setSaintInfo] = useState({
    name: "St. Francis of Assisi",
    years: "1181-1226",
    description: "Founder of the Franciscan Order, known for my love of nature and animals.",
    image: stFrancisImage.src,
    articleLink: "/articles/st-francis-of-assisi",
  })
  const [showSuggestions, setShowSuggestions] = useState(true)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
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

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
        image: stFrancisImage.src,
        articleLink: "/articles/st-francis-of-assisi",
      },
      "St. Thomas Aquinas": {
        name: "St. Thomas Aquinas",
        years: "1225-1274",
        description: "Dominican friar and Doctor of the Church, known for my theological writings.",
        image: stThomasImage.src,
        articleLink: "/articles/st-thomas-aquinas",
      },
      "St. Teresa of Ávila": {
        name: "St. Teresa of Ávila",
        years: "1515-1582",
        description: "Spanish mystic, Carmelite nun, and reformer of the Carmelite Order.",
        image: stTeresaImage.src,
        articleLink: "/articles/st-teresa-of-avila",
      },
      "St. Augustine": {
        name: "St. Augustine",
        years: "354-430",
        description: "Bishop of Hippo and Doctor of the Church, known for my theological writings.",
        image: stAugustineImage.src,
        articleLink: "/articles/st-augustine",
      },
      "St. Thérèse of Lisieux": {
        name: "St. Thérèse of Lisieux",
        years: "1873-1897",
        description: 'Carmelite nun known as "The Little Flower" and Doctor of the Church.',
        image: stThereseImage.src,
        articleLink: "/articles/st-therese-of-lisieux",
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

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <h2 className="sidebar-title">Sanctus Dialogus</h2>
          {isMobileMenuOpen && (
            <button className="close-button" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          )}
        </div>

        <div>
          <h3>Choose Your Saint</h3>
          <select className="saint-selector" value={selectedSaint} onChange={handleSaintChange}>
            <option value="St. Francis of Assisi">St. Francis of Assisi</option>
            <option value="St. Thomas Aquinas">St. Thomas Aquinas</option>
            <option value="St. Teresa of Ávila">St. Teresa of Ávila</option>
            <option value="St. Augustine">St. Augustine</option>
            <option value="St. Thérèse of Lisieux">St. Thérèse of Lisieux</option>
          </select>
        </div>

        <div className="saint-profile">
          <div className="saint-image-container">
            <img
              src={saintInfo.image || "/placeholder.svg"}
              alt={saintInfo.name}
              className="saint-image"
              onError={handleImageError}
            />
          </div>
          <h3 className="saint-name">{saintInfo.name}</h3>
          <p className="saint-years">{saintInfo.years}</p>
          <p className="saint-description">{saintInfo.description}</p>
          <a href={saintInfo.articleLink} target="_blank" rel="noopener noreferrer" className="read-more">
            Read More
          </a>
        </div>

        <hr className="separator" />
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <button className="menu-button" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
              <h1 className="header-title">Dialogue with {selectedSaint}</h1>
            </div>
            <div className="mobile-selector">
              <select
                className="saint-selector"
                value={selectedSaint}
                onChange={handleSaintChange}
                style={{ padding: "0.5rem", fontSize: "0.875rem" }}
              >
                <option value="St. Francis of Assisi">St. Francis of Assisi</option>
                <option value="St. Thomas Aquinas">St. Thomas Aquinas</option>
                <option value="St. Teresa of Ávila">St. Teresa of Ávila</option>
                <option value="St. Augustine">St. Augustine</option>
                <option value="St. Thérèse of Lisieux">St. Thérèse of Lisieux</option>
              </select>
            </div>
          </div>
        </header>

        {/* Chat area */}
        <div className="chat-area">
          <div className="chat-container">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role === "user" ? "user" : ""}`}>
                {message.role !== "user" && (
                  <div className="message-avatar">
                    <img src={saintInfo.image || "/placeholder.svg"} alt={selectedSaint} onError={handleImageError} />
                  </div>
                )}

                <div className="message-content">
                  <p>{message.content}</p>
                </div>

                {message.role === "user" && (
                  <div className="message-avatar">
                    <img src="/placeholder.svg?height=40&width=40" alt="User" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        </div>

        {/* Input area */}
        <div className="input-area">
          <div className="input-container">
            {showSuggestions && (
              <div className="suggestions-container">
                <button className="scroll-button scroll-left" onClick={() => scrollSuggestions("left")}>
                  <ChevronLeft size={16} />
                </button>

                <div ref={suggestionsRef} className="suggestions hide-scrollbar">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      className="suggestion-button"
                      onClick={() => {
                        handleInputChange({ target: { value: question } } as any)
                        setTimeout(() => {
                          const form = document.querySelector("form")
                          if (form) form.dispatchEvent(new Event("submit", { cancelable: true }))
                        }, 100)
                      }}
                    >
                      {question}
                    </button>
                  ))}
                </div>

                <button className="scroll-button scroll-right" onClick={() => scrollSuggestions("right")}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="input-form">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask for wisdom..."
                className="input-field"
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !input.trim()} className="send-button">
                <span className="send-icon">
                  <Send size={16} />
                </span>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

