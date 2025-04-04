"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { ChevronLeft, ChevronRight, Menu, Send, X } from "lucide-react"

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

  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      // Original saints
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

      // New saints with their images
      "St. Peter": {
        name: "St. Peter",
        years: "1-64",
        description: "One of the Twelve Apostles of Jesus Christ, first Pope of the Catholic Church, and martyr.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saint_peter_1960.6.32%20%281%29.jpg-Z5DNPucHrg52Wehgg1dJds6VXMCcSa.jpeg", // Updated with provided image
        articleLink: "https://www.thecatholicvoice.com/saints/saint-peter-biography-miracles-and-wisdom",
      },
      "St. Paul": {
        name: "St. Paul",
        years: "5-67",
        description: "Apostle to the Gentiles, missionary, theologian, and author of many New Testament epistles.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saint%20paul.jpg-wfs4TRIu5ex9kGvkye6vkM4E7QWpn1.jpeg", // Updated with provided image
        articleLink: "https://www.thecatholicvoice.com/saints/saint-paul-biography-miracles-and-wisdom",
      },
      "St. John the Evangelist": {
        name: "St. John the Evangelist",
        years: "6-100",
        description:
          "One of the Twelve Apostles of Jesus, author of the Gospel of John, three Epistles, and the Book of Revelation.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20John%20the%20Evangelist-lr94ux9DDVRyRmkwCkGnp2EoFKXnI9.webp", // Updated with provided image
        articleLink: "https://www.thecatholicvoice.com/saints/saint-john-the-evangelist-biography-miracles-and-wisdom",
      },
      "St. Athanasius": {
        name: "St. Athanasius",
        years: "296-373",
        description:
          "Bishop of Alexandria, Doctor of the Church, and defender of the divinity of Christ against Arianism.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Athanasius-UbK6Ktil0tdlVwlPJXugIw4ILZaGs0.png", // Updated with provided image
        articleLink: "https://www.thecatholicvoice.com/saints/saint-athanasius-biography-miracles-and-wisdom",
      },
      "St. Jerome": {
        name: "St. Jerome",
        years: "347-420",
        description: "Doctor of the Church, theologian, and translator of the Bible into Latin (the Vulgate).",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Jerome.jpg-s2peOmZ743ayIs7GPPF9ram0adu9qE.jpeg", // Updated with provided image
        articleLink: "https://www.thecatholicvoice.com/saints/saint-jerome-biography-miracles-and-wisdom",
      },
      "St. Benedict of Nursia": {
        name: "St. Benedict of Nursia",
        years: "480-547",
        description: "Founder of Western monasticism and author of the Rule of Saint Benedict.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Benedict%20of%20Nursia.jpg-JCRJgGs7H6W5SBji3BTKWcm70YifUr.jpeg", // Updated with provided image
        articleLink: "https://www.thecatholicvoice.com/saints/saint-benedict-of-nursia-biography-miracles-and-wisdom",
      },
      "St. Gregory the Great": {
        name: "St. Gregory the Great",
        years: "540-604",
        description: "Pope, Doctor of the Church, and reformer who significantly influenced the medieval Church.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Gregory%20the%20Great.jpg-CX6ws3DvvL4RM7TfilfPhJHmN0Zl2u.jpeg", // Updated with provided image
        articleLink: "https://www.thecatholicvoice.com/saints/saint-gregory-the-great-biography-miracles-and-wisdom",
      },
      "St. Clare of Assisi": {
        name: "St. Clare of Assisi",
        years: "1194-1253",
        description: "Founder of the Order of Poor Ladies (Poor Clares) and close associate of St. Francis of Assisi.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Clare%20of%20Assisi-5HSeYGy7w8pLChdnhualb0xcvTZGrD.jpeg", // Updated with provided image
        articleLink: "https://www.thecatholicvoice.com/saints/saint-clare-of-assisi-biography-miracles-and-wisdom",
      },
      "St. Dominic": {
        name: "St. Dominic",
        years: "1170-1221",
        description: "Founder of the Dominican Order, preacher, and champion of orthodox Catholic belief.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Dominic.jpg-5gMF4a0a5ttx201eMbnXI0CBb1kYoN.jpeg", // Updated with provided image
        articleLink: "https://www.thecatholicvoice.com/saints/saint-dominic-biography-miracles-and-wisdom",
      },
      "St. Catherine of Siena": {
        name: "St. Catherine of Siena",
        years: "1347-1380",
        description: "Dominican tertiary, mystic, Doctor of the Church, and counselor to popes and rulers.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Catherine%20of%20Siena.jpg-hO1wgdMaejMvfu9OaS2EAhXC4ucxjq.jpeg", // Updated with provided image
        articleLink: "https://www.thecatholicvoice.com/saints/saint-catherine-of-siena-biography-miracles-and-wisdom",
      },
      "St. John of the Cross": {
        name: "St. John of the Cross",
        years: "1542-1591",
        description:
          "Spanish Carmelite friar, mystic, Doctor of the Church, and co-founder of the Discalced Carmelites.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20John%20of%20the%20Cross.jpg-GiNBBx5qSI7arRfDwWlPtHv933qgB5.jpeg", // Updated with provided image
        articleLink: "https://www.thecatholicvoice.com/saints/saint-john-of-the-cross-biography-miracles-and-wisdom",
      },
      "St. Ignatius of Loyola": {
        name: "St. Ignatius of Loyola",
        years: "1491-1556",
        description: "Founder of the Society of Jesus (Jesuits) and author of the Spiritual Exercises.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Ignatius%20of%20Loyola-ECzeGZM2uLsmyOTx82P8ssemObWgZY.webp", // Updated with provided image
        articleLink: "https://www.thecatholicvoice.com/saints/saint-ignatius-of-loyola-biography-miracles-and-wisdom",
      },
      "St. Francis Xavier": {
        name: "St. Francis Xavier",
        years: "1506-1552",
        description: "Co-founder of the Society of Jesus and pioneering missionary to Asia.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Francis%20Xavier.jpg-rFrq6g2TLReuMHL0U06e9kjQD4trvf.jpeg", // Updated with provided image
        articleLink: "https://www.thecatholicvoice.com/saints/saint-francis-xavier-biography-miracles-and-wisdom",
      },
      "St. Joan of Arc": {
        name: "St. Joan of Arc",
        years: "1412-1431",
        description:
          "French military leader, mystic, and martyr who led the French army to victory during the Hundred Years' War.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Joan%20of%20Arc-lAVAUp8KjvuzTk7hmFyCE1uaOczlLz.webp", // Updated with provided image
        articleLink: "https://www.thecatholicvoice.com/saints/saint-joan-of-arc-biography-miracles-and-wisdom",
      },
      "St. Mother Teresa of Calcutta": {
        name: "St. Mother Teresa of Calcutta",
        years: "1910-1997",
        description:
          "Founder of the Missionaries of Charity and Nobel Peace Prize recipient known for her work with the poor.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Mother%20Teresa%20of%20Calcutta.jpg-VvPTNunrwxVfQmh3RlgUBFuvM47F6N.jpeg", // Updated with provided image
        articleLink:
          "https://www.thecatholicvoice.com/saints/saint-mother-teresa-of-calcutta-biography-miracles-and-wisdom",
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
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Choose Your Saint</h2>
          <button className="close-button" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <select className="saint-selector" value={selectedSaint} onChange={handleSaintChange}>
          {/* Original saints */}
          <option value="St. Francis of Assisi">St. Francis of Assisi</option>
          <option value="St. Thomas Aquinas">St. Thomas Aquinas</option>
          <option value="St. Teresa of Ávila">St. Teresa of Ávila</option>
          <option value="St. Augustine">St. Augustine</option>
          <option value="St. Thérèse of Lisieux">St. Thérèse of Lisieux</option>

          {/* New saints */}
          <option value="St. Peter">St. Peter</option>
          <option value="St. Paul">St. Paul</option>
          <option value="St. John the Evangelist">St. John the Evangelist</option>
          <option value="St. Athanasius">St. Athanasius</option>
          <option value="St. Jerome">St. Jerome</option>
          <option value="St. Benedict of Nursia">St. Benedict of Nursia</option>
          <option value="St. Gregory the Great">St. Gregory the Great</option>
          <option value="St. Clare of Assisi">St. Clare of Assisi</option>
          <option value="St. Dominic">St. Dominic</option>
          <option value="St. Catherine of Siena">St. Catherine of Siena</option>
          <option value="St. John of the Cross">St. John of the Cross</option>
          <option value="St. Ignatius of Loyola">St. Ignatius of Loyola</option>
          <option value="St. Francis Xavier">St. Francis Xavier</option>
          <option value="St. Joan of Arc">St. Joan of Arc</option>
          <option value="St. Mother Teresa of Calcutta">St. Mother Teresa of Calcutta</option>
        </select>

        <div className="saint-profile">
          <div className="saint-image-container">
            <img
              src={saintInfo.image || "/placeholder.svg?height=200&width=200"}
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
            </div>
            <h2 className="header-title">Dialogue with {selectedSaint}</h2>
          </div>

          <div className="mobile-selector">
            <select className="saint-selector" value={selectedSaint} onChange={handleSaintChange}>
              {/* Original saints */}
              <option value="St. Francis of Assisi">St. Francis of Assisi</option>
              <option value="St. Thomas Aquinas">St. Thomas Aquinas</option>
              <option value="St. Teresa of Ávila">St. Teresa of Ávila</option>
              <option value="St. Augustine">St. Augustine</option>
              <option value="St. Thérèse of Lisieux">St. Thérèse of Lisieux</option>

              {/* New saints */}
              <option value="St. Peter">St. Peter</option>
              <option value="St. Paul">St. Paul</option>
              <option value="St. John the Evangelist">St. John the Evangelist</option>
              <option value="St. Athanasius">St. Athanasius</option>
              <option value="St. Jerome">St. Jerome</option>
              <option value="St. Benedict of Nursia">St. Benedict of Nursia</option>
              <option value="St. Gregory the Great">St. Gregory the Great</option>
              <option value="St. Clare of Assisi">St. Clare of Assisi</option>
              <option value="St. Dominic">St. Dominic</option>
              <option value="St. Catherine of Siena">St. Catherine of Siena</option>
              <option value="St. John of the Cross">St. John of the Cross</option>
              <option value="St. Ignatius of Loyola">St. Ignatius of Loyola</option>
              <option value="St. Francis Xavier">St. Francis Xavier</option>
              <option value="St. Joan of Arc">St. Joan of Arc</option>
              <option value="St. Mother Teresa of Calcutta">St. Mother Teresa of Calcutta</option>
            </select>
          </div>
        </header>

        {/* Chat area */}
        <div className="chat-area">
          <div className="chat-container">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role === "user" ? "user" : ""}`}>
                {message.role !== "user" && (
                  <div className="message-avatar">
                    <img
                      src={saintInfo.image || "/placeholder.svg?height=200&width=200"}
                      alt={selectedSaint}
                      onError={handleImageError}
                    />
                  </div>
                )}

                <div className="message-content">
                  <p>{message.content}</p>
                </div>
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
                      onClick={() => handleSuggestionClick(question)}
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
                <span className="send-text">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

