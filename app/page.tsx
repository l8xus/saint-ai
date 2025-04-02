"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Separator } from "../../components/ui/separator"
import { ChevronLeft, ChevronRight, Cross, Send, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

export default function Home() {
  const [selectedSaint, setSelectedSaint] = useState("St. Francis of Assisi")
  const [saintInfo, setSaintInfo] = useState({
    name: "St. Francis of Assisi",
    years: "1181-1226",
    description: "Founder of the Franciscan Order, known for his love of nature and animals.",
    image: "/placeholder.svg?height=80&width=80",
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
        image: "/placeholder.svg?height=200&width=200",
        articleLink: "/articles/st-francis-of-assisi",
      },
      "St. Thomas Aquinas": {
        name: "St. Thomas Aquinas",
        years: "1225-1274",
        description: "Dominican friar and Doctor of the Church, known for my theological writings.",
        image: "/placeholder.svg?height=200&width=200",
        articleLink: "/articles/st-thomas-aquinas",
      },
      "St. Teresa of Ávila": {
        name: "St. Teresa of Ávila",
        years: "1515-1582",
        description: "Spanish mystic, Carmelite nun, and reformer of the Carmelite Order.",
        image: "/placeholder.svg?height=200&width=200",
        articleLink: "/articles/st-teresa-of-avila",
      },
      "St. Augustine": {
        name: "St. Augustine",
        years: "354-430",
        description: "Bishop of Hippo and Doctor of the Church, known for my theological writings.",
        image: "/placeholder.svg?height=200&width=200",
        articleLink: "/articles/st-augustine",
      },
      "St. Thérèse of Lisieux": {
        name: "St. Thérèse of Lisieux",
        years: "1873-1897",
        description: 'Carmelite nun known as "The Little Flower" and Doctor of the Church.',
        image: "/placeholder.svg?height=200&width=200",
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

  return (
    <div className="flex min-h-screen bg-[#f0e6da]">
      {/* Sidebar - Always visible on desktop, hidden on mobile unless toggled */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:block fixed md:static md:w-[200px] lg:w-[250px] bg-[#f0e6da] border-r border-[#d0b557] z-20 md:z-0 h-full`}
      >
        <div className="p-4 h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-['Cinzel'] font-bold text-[#2b2357]">Sanctus Dialogus</h2>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#76070d]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Cross className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-['Cinzel'] font-medium text-[#2b2357]">Choose Your Saint</h3>
            <Select value={selectedSaint} onValueChange={setSelectedSaint}>
              <SelectTrigger className="w-full border-[#d0b557] bg-[#f0e6da] text-[#2b2357] font-['Cormorant_Garamond']">
                <SelectValue placeholder="Select a saint" />
              </SelectTrigger>
              <SelectContent className="bg-[#f0e6da] border-[#d0b557]">
                <SelectItem value="St. Francis of Assisi" className="font-['Cormorant_Garamond']">
                  St. Francis of Assisi
                </SelectItem>
                <SelectItem value="St. Thomas Aquinas" className="font-['Cormorant_Garamond']">
                  St. Thomas Aquinas
                </SelectItem>
                <SelectItem value="St. Teresa of Ávila" className="font-['Cormorant_Garamond']">
                  St. Teresa of Ávila
                </SelectItem>
                <SelectItem value="St. Augustine" className="font-['Cormorant_Garamond']">
                  St. Augustine
                </SelectItem>
                <SelectItem value="St. Thérèse of Lisieux" className="font-['Cormorant_Garamond']">
                  St. Thérèse of Lisieux
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 p-4 bg-white/50 rounded-lg border border-[#d0b557]">
            <div className="flex flex-col items-center mb-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#d0b557] mb-2">
                <img
                  src={saintInfo.image || "/placeholder.svg"}
                  alt={saintInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-['Cinzel'] text-[#2b2357] text-center">{saintInfo.name}</h3>
              <p className="text-xs text-[#76070d] font-['Cormorant_Garamond'] italic">{saintInfo.years}</p>
            </div>
            <p className="text-sm text-black font-['Cormorant_Garamond'] mb-3 text-center">{saintInfo.description}</p>
            <a
              href={saintInfo.articleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-1 px-3 bg-[#2b2357] text-white font-['Cinzel'] text-sm rounded hover:bg-[#2b2357]/80 transition-colors"
            >
              Read More
            </a>
          </div>

          <Separator className="my-4 bg-[#d0b557]" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen max-w-full">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#f0e6da] border-b border-[#d0b557] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[#76070d]"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </Button>
              <h1 className="text-xl font-['Cinzel'] font-bold text-[#2b2357]">Dialogue with {selectedSaint}</h1>
            </div>
            <div className="md:hidden">
              <Select value={selectedSaint} onValueChange={setSelectedSaint}>
                <SelectTrigger className="h-8 border-[#d0b557] bg-[#f0e6da] text-[#2b2357] font-['Cormorant_Garamond']">
                  <SelectValue placeholder="Select a saint" />
                </SelectTrigger>
                <SelectContent className="bg-[#f0e6da] border-[#d0b557]">
                  <SelectItem value="St. Francis of Assisi" className="font-['Cormorant_Garamond']">
                    St. Francis of Assisi
                  </SelectItem>
                  <SelectItem value="St. Thomas Aquinas" className="font-['Cormorant_Garamond']">
                    St. Thomas Aquinas
                  </SelectItem>
                  <SelectItem value="St. Teresa of Ávila" className="font-['Cormorant_Garamond']">
                    St. Teresa of Ávila
                  </SelectItem>
                  <SelectItem value="St. Augustine" className="font-['Cormorant_Garamond']">
                    St. Augustine
                  </SelectItem>
                  <SelectItem value="St. Thérèse of Lisieux" className="font-['Cormorant_Garamond']">
                    St. Thérèse of Lisieux
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Chat area */}
        <div className="flex-1 flex flex-col h-full bg-white/50 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex items-start gap-3 max-w-[80%]`}>
                      {message.role !== "user" && (
                        <Avatar className="mt-1 border-2 border-[#d0b557]">
                          <AvatarImage src={saintInfo.image} alt={selectedSaint} />
                          <AvatarFallback className="bg-[#f0e6da] text-[#76070d] font-['Cinzel']">
                            {selectedSaint
                              .split(" ")
                              .map((word) => word[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-[#2b2357] text-white"
                            : "bg-[#f0e6da] border border-[#d0b557] text-black"
                        } font-['Cormorant_Garamond']`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>

                      {message.role === "user" && (
                        <Avatar className="mt-1 border-2 border-[#d0b557]">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                          <AvatarFallback className="bg-[#f0e6da] text-[#76070d]">
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          <div className="p-4 border-t border-[#d0b557] flex flex-col">
            {showSuggestions && (
              <div className="relative w-full mb-4 max-w-3xl mx-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-[#f0e6da] border border-[#d0b557] text-[#2b2357] hover:text-[#76070d]"
                  onClick={() => scrollSuggestions("left")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div
                  ref={suggestionsRef}
                  className="flex overflow-x-auto py-2 px-8 scrollbar-hide"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {suggestedQuestions.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 mx-1 bg-[#f0e6da] border-[#d0b557] text-[#2b2357] font-['Cormorant_Garamond'] hover:bg-white hover:text-[#76070d] whitespace-nowrap"
                      onClick={() => {
                        handleInputChange({ target: { value: question } } as any)
                        setTimeout(() => {
                          const form = document.querySelector("form")
                          if (form) form.dispatchEvent(new Event("submit", { cancelable: true }))
                        }, 100)
                      }}
                    >
                      {question}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-[#f0e6da] border border-[#d0b557] text-[#2b2357] hover:text-[#76070d]"
                  onClick={() => scrollSuggestions("right")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex w-full gap-2 max-w-3xl mx-auto">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask for wisdom..."
                className="flex-1 border-[#d0b557] bg-[#f0e6da] text-black font-['Cormorant_Garamond']"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-[#76070d] hover:bg-[#76070d]/80 text-white font-['Cinzel']"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

