"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "ai/react"
import { ChevronLeft, ChevronRight, Menu, Search, Send, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get the saint from URL parameters or default to St. Francis
  const saintParam = searchParams.get("saint")

  // Use refs to store state that shouldn't trigger re-renders
  const initialRenderRef = useRef(true)
  const currentSaintRef = useRef(saintParam || "St. Francis of Assisi")

  const [selectedSaint, setSelectedSaint] = useState(saintParam || "St. Francis of Assisi")
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
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Create separate refs for desktop and mobile search
  const desktopSearchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)

  // Chat area ref for scrolling
  const chatAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Store the initial welcome message in a ref to avoid recreating it
  const welcomeMessageRef = useRef({
    id: "welcome-message",
    role: "assistant" as const,
    content: `Peace be with you, my child. I am ${selectedSaint}. How may I share my wisdom with you today?`,
  })

  // Default suggested questions
  const defaultSuggestedQuestions = [
    "What is your greatest teaching?",
    "How did you find your calling?",
    "What challenges did you face?",
    "What advice would you give me?",
    "Tell me about your spiritual journey",
    "How did you pray?",
    "What is your view on suffering?",
  ]

  // Initialize with the saint from URL if available - only on first render
  useEffect(() => {
    if (initialRenderRef.current && saintParam) {
      currentSaintRef.current = saintParam
      setSelectedSaint(saintParam)
      initialRenderRef.current = false
    }

    // Initialize dynamic suggestions with default questions
    setDynamicSuggestions(defaultSuggestedQuestions)
  }, [saintParam, defaultSuggestedQuestions])

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

  // Helper function to shuffle an array (for randomizing suggestions)
  const shuffleArray = (array: string[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Create a memoized version of processMessageContent to avoid recreating it on every render
  const processMessageContent = useCallback(
    (
      content: string,
    ): {
      cleanedContent: string
      suggestions: string[] | null
    } => {
      console.log("Processing message content:", content.substring(0, 100) + "...")

      // First, check for the new suggestion format
      const suggestionsMatch = content.match(/\[SUGGESTIONS_START\]([\s\S]*?)\[SUGGESTIONS_END\]/)

      let cleanedContent = content
      let extractedSuggestions: string[] | null = null

      if (suggestionsMatch && suggestionsMatch[1]) {
        try {
          // Parse the suggestions
          const suggestionsJson = suggestionsMatch[1].trim()
          console.log("Found suggestions JSON:", suggestionsJson)

          let suggestions: string[] = []
          try {
            // Try to parse as JSON
            suggestions = JSON.parse(suggestionsJson)
            console.log("Parsed suggestions:", suggestions)
          } catch (e) {
            console.error("JSON parse error:", e)
            // Try to extract strings if JSON parsing fails
            const extractedSuggestionsMatches = suggestionsJson.match(/"([^"]+)"/g)
            if (extractedSuggestionsMatches) {
              suggestions = extractedSuggestionsMatches.map((s) => s.replace(/"/g, ""))
              console.log("Extracted suggestions:", suggestions)
            }
          }

          // Remove the suggestions block from the content
          cleanedContent = cleanedContent.replace(/\[SUGGESTIONS_START\]([\s\S]*?)\[SUGGESTIONS_END\]/g, "")

          if (Array.isArray(suggestions) && suggestions.length > 0) {
            extractedSuggestions = suggestions
          }
        } catch (error) {
          console.error("Error processing suggestions:", error)
        }
      }

      // Also check for the old format as a fallback
      const oldFormatMatch = cleanedContent.match(/\[SUGGESTIONS\]([\s\S]*?)\[\/SUGGESTIONS\]/)
      if (oldFormatMatch && oldFormatMatch[1]) {
        try {
          const suggestionsText = oldFormatMatch[1].trim()
          console.log("Found old format suggestions:", suggestionsText)

          let suggestions: string[] = []
          try {
            suggestions = JSON.parse(suggestionsText)
          } catch (e) {
            console.error("JSON parse error (old format):", e)
            // Try to extract strings if JSON parsing fails
            const extractedSuggestionsMatches = suggestionsText.match(/"([^"]+)"/g)
            if (extractedSuggestionsMatches) {
              suggestions = extractedSuggestionsMatches.map((s) => s.replace(/"/g, ""))
            }
          }

          // Remove the suggestions block from the content
          cleanedContent = cleanedContent.replace(/\[SUGGESTIONS\]([\s\S]*?)\[\/SUGGESTIONS\]/g, "")

          if (!extractedSuggestions && Array.isArray(suggestions) && suggestions.length > 0) {
            extractedSuggestions = suggestions
          }
        } catch (error) {
          console.error("Error processing old format suggestions:", error)
        }
      }

      // Ensure we've removed all suggestion markers that might be incomplete
      cleanedContent = cleanedContent.replace(/\[SUGGESTIONS_START\][\s\S]*$/, "")
      cleanedContent = cleanedContent.replace(/\[SUGGESTIONS\][\s\S]*$/, "")

      // Trim any extra whitespace that might have been left
      cleanedContent = cleanedContent.trim()

      return {
        cleanedContent,
        suggestions: extractedSuggestions,
      }
    },
    [],
  )

  // Initialize the chat with a stable configuration
  const chatConfig = useCallback(
    () => ({
      initialMessages: [
        {
          id: "welcome-message",
          role: "assistant",
          content: `Peace be with you, my child. I am ${currentSaintRef.current}. How may I share my wisdom with you today?`,
        },
      ],
      api: "/api/chat",
      body: {
        saintName: currentSaintRef.current,
      },
      onFinish: (message: any) => {
        console.log("onFinish triggered with message:", message.id)

        // Process the message content to extract dynamic suggestions and clean it
        const result = processMessageContent(message.content)

        // If suggestions were found, update the state
        if (result.suggestions) {
          console.log("Setting dynamic suggestions from onFinish:", result.suggestions)
          setDynamicSuggestions(result.suggestions)
          setShowSuggestions(true)
        }

        // If the content was modified, update the message
        if (result.cleanedContent !== message.content) {
          console.log("Updating message with cleaned content")

          // Use the stable message update approach
          setMessages((currentMessages) => {
            return currentMessages.map((msg) =>
              msg.id === message.id ? { ...msg, content: result.cleanedContent } : msg,
            )
          })
        }

        // Force scroll to bottom
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
          }
        }, 100)
      },
    }),
    [processMessageContent],
  )

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } = useChat(chatConfig())

  // Process each new message as it's added to the messages array
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "assistant") {
        console.log("Processing new assistant message:", lastMessage.id)

        // Process the message content
        const result = processMessageContent(lastMessage.content)

        // If suggestions were found, update the state immediately
        if (result.suggestions) {
          console.log("Setting dynamic suggestions from new message:", result.suggestions)
          setDynamicSuggestions(result.suggestions)
          setShowSuggestions(true)
        }

        // If the content was modified, update the message
        if (result.cleanedContent !== lastMessage.content) {
          // Use the stable message update approach
          setMessages((currentMessages) => {
            return currentMessages.map((msg) =>
              msg.id === lastMessage.id ? { ...msg, content: result.cleanedContent } : msg,
            )
          })
        }
      }
    }
  }, [messages, processMessageContent, setMessages])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // List of all saints with their alternative names for search
  const saintsWithAlternatives = [
    { display: "St. Francis of Assisi", alternatives: ["saint francis", "francis of assisi", "francis assisi"] },
    { display: "St. Thomas Aquinas", alternatives: ["saint thomas", "thomas aquinas", "aquinas"] },
    {
      display: "St. Teresa of Ávila",
      alternatives: ["saint teresa", "teresa of avila", "teresa avila", "st teresa", "st. teresa"],
    },
    { display: "St. Augustine", alternatives: ["saint augustine", "augustine of hippo"] },
    {
      display: "St. Thérèse of Lisieux",
      alternatives: [
        "saint therese",
        "therese of lisieux",
        "therese lisieux",
        "little flower",
        "st therese",
        "st. therese",
      ],
    },
    { display: "St. Peter", alternatives: ["saint peter", "peter the apostle"] },
    { display: "St. Paul", alternatives: ["saint paul", "paul the apostle", "saul of tarsus"] },
    { display: "St. John the Evangelist", alternatives: ["saint john", "john evangelist", "beloved disciple"] },
    { display: "St. Athanasius", alternatives: ["saint athanasius", "athanasius of alexandria"] },
    { display: "St. Jerome", alternatives: ["saint jerome"] },
    { display: "St. Benedict of Nursia", alternatives: ["saint benedict", "benedict nursia", "benedict of nursia"] },
    { display: "St. Gregory the Great", alternatives: ["saint gregory", "gregory great", "pope gregory"] },
    { display: "St. Clare of Assisi", alternatives: ["saint clare", "clare assisi", "clare of assisi"] },
    { display: "St. Dominic", alternatives: ["saint dominic", "dominic de guzman"] },
    { display: "St. Catherine of Siena", alternatives: ["saint catherine", "catherine siena", "catherine of siena"] },
    { display: "St. John of the Cross", alternatives: ["saint john of the cross", "john cross", "juan de la cruz"] },
    { display: "St. Ignatius of Loyola", alternatives: ["saint ignatius", "ignatius loyola"] },
    { display: "St. Francis Xavier", alternatives: ["saint francis xavier", "francis xavier"] },
    { display: "St. Joan of Arc", alternatives: ["saint joan", "joan arc", "maid of orleans"] },
    {
      display: "St. Mother Teresa of Calcutta",
      alternatives: ["saint teresa", "mother teresa", "teresa calcutta", "teresa of calcutta"],
    },
  ]

  // Helper function to normalize text for searching (remove accents, lowercase, etc.)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .trim()
  }

  // Filter saints based on search query
  const filteredSaints = saintsWithAlternatives
    .filter((saint) => {
      const normalizedQuery = normalizeText(searchQuery)
      if (!normalizedQuery) return true

      // Check the display name
      if (normalizeText(saint.display).includes(normalizedQuery)) return true

      // Check alternative names
      return saint.alternatives.some((alt) => normalizeText(alt).includes(normalizedQuery))
    })
    .map((saint) => saint.display)

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

    // Update the saint info
    setSaintInfo(saintsData[selectedSaint as keyof typeof saintsData])

    // Only update the currentSaintRef if the saint has actually changed
    if (currentSaintRef.current !== selectedSaint) {
      currentSaintRef.current = selectedSaint

      // Reset chat with new welcome message only when the saint actually changes
      const welcomeMessage = {
        id: "welcome-message",
        role: "assistant" as const,
        content: `Peace be with you, my child. I am ${selectedSaint}. How may I share my wisdom with you today?`,
      }

      // Check if we need to reset the chat (only if there's no messages or the first message is for a different saint)
      const shouldResetChat =
        messages.length === 0 || (messages[0].role === "assistant" && !messages[0].content.includes(selectedSaint))

      if (shouldResetChat) {
        console.log("Resetting chat for new saint:", selectedSaint)
        // Important: Use a direct array instead of a callback function
        setMessages([welcomeMessage])

        // Reset to default suggestions when changing saints
        setDynamicSuggestions(defaultSuggestedQuestions)

        // Show suggestions when changing saints
        setShowSuggestions(true)
      }
    }

    // Clear search when saint is selected
    setSearchQuery("")
  }, [selectedSaint, setMessages, messages, defaultSuggestedQuestions])

  // Add this useEffect to ensure scrolling works
  useEffect(() => {
    // Force scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      console.log("Scrolling to bottom due to message change")
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

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

  // Fix the handleSaintSelect function to ensure it properly updates the state
  const handleSaintSelect = (saint: string) => {
    // Set the selected saint
    setSelectedSaint(saint)
    // Close the search results
    setShowSearchResults(false)
    // Close the mobile menu if it's open
    setIsMobileMenuOpen(false)

    // Update the URL with the selected saint
    router.push(`/?saint=${encodeURIComponent(saint)}`, { scroll: false })
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setShowSearchResults(true)
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Function to handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/placeholder.svg?height=200&width=200"
  }

  // Function to handle suggestion click
  const handleSuggestionClick = (question: string) => {
    // First update the UI to show the question was selected
    append({
      role: "user",
      content: question,
    })

    // Force scroll to bottom immediately
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  // Custom submit handler to ensure suggestions update
  const customSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Call the original submit handler
    handleSubmit(e)

    // Force scroll to bottom immediately after submitting
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Call the original submit handler
    handleSubmit(e)

    // Force scroll to bottom immediately after submitting
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
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

        {/* Search input instead of dropdown */}
        <div className="search-container" ref={desktopSearchRef}>
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for a saint..."
              className="search-input"
              onFocus={() => setShowSearchResults(true)}
            />
          </div>

          {showSearchResults && (
            <div className="search-results">
              {filteredSaints.length > 0 ? (
                filteredSaints.map((saint) => (
                  <div
                    key={saint}
                    className={`search-result-item ${saint === selectedSaint ? "active" : ""}`}
                    onClick={() => handleSaintSelect(saint)}
                  >
                    {saint}
                  </div>
                ))
              ) : (
                <div className="search-no-results">No saints found</div>
              )}
            </div>
          )}
        </div>

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
              <h2 className="header-title">Dialogue with {selectedSaint}</h2>
            </div>
            <button className="menu-button" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>

          <div className="mobile-selector">
            {/* Mobile search input */}
            <div className="search-container mobile-search" ref={mobileSearchRef}>
              <div className="search-input-wrapper">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for a saint..."
                  className="search-input"
                  onFocus={() => setShowSearchResults(true)}
                />
              </div>

              {/* Fix the mobile search results to ensure they're properly clickable */}
              {showSearchResults && (
                <div className="search-results mobile-search-results">
                  {filteredSaints.length > 0 ? (
                    filteredSaints.map((saint) => (
                      <div
                        key={saint}
                        className={`search-result-item ${saint === selectedSaint ? "active" : ""}`}
                        onClick={() => {
                          handleSaintSelect(saint)
                          // Force close the search results
                          setShowSearchResults(false)
                        }}
                      >
                        {saint}
                      </div>
                    ))
                  ) : (
                    <div className="search-no-results">No saints found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Chat area */}
        <div className="chat-area" ref={chatAreaRef}>
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
            <div ref={messagesEndRef} style={{ height: "1px", width: "100%" }}></div>
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
                  {dynamicSuggestions.map((question) => (
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

            <form onSubmit={handleFormSubmit} className="input-form">
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

