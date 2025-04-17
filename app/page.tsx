"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useScrollToBottom } from "@/hooks/useScrollToBottom"

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get the saint from URL parameters or default to St. Francis
  const saintParam = searchParams.get("saint")

  const [selectedSaint, setSelectedSaint] = useState(saintParam || "St. Francis of Assisi")
  const [saintInfo, setSaintInfo] = useState({
    name: "St. Francis of Assisi",
    years: "1181-1226",
    description: "Founder of the Franciscan Order, known for my love of nature and animals.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/assissi-xsrYL2QtPtrEYH4rNJYmlDIPqYzdw0.jpeg",
    articleLink: "https://www.thecatholicvoice.com/saints/saint-francis-of-assisi-biography-miracles-and-wisdom",
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [suggestions, setSuggestions] = useState<string[]>([
    "What is your greatest teaching?",
    "How did you find your calling?",
    "What challenges did you face?",
    "What advice would you give me?",
    "Tell me about your spiritual journey",
  ])

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Create separate refs for desktop and mobile search
  const desktopSearchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)

  // Initialize with the saint from URL if available
  useEffect(() => {
    if (saintParam) {
      setSelectedSaint(saintParam)
    }
  }, [saintParam])

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

  // Add a new state to track when suggestions are loading
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)

  // Add this state after the other state declarations
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  // Update the fetchSuggestions function to set loading state
  const fetchSuggestions = async (content: string) => {
    try {
      // Set loading to true when starting to fetch
      setSuggestionsLoading(true)

      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      // If there's an error, use default suggestions
      setSuggestions([
        "What is your greatest teaching?",
        "How did you find your calling?",
        "What challenges did you face?",
        "What advice would you give me?",
        "Tell me about your spiritual journey",
      ])
    } finally {
      // Set loading to false when done
      setSuggestionsLoading(false)
    }
  }

  // Use the scroll to bottom hook
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>()

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
    // New saints
    { display: "St. Mary Magdalene", alternatives: ["saint mary magdalene", "mary magdalene", "magdalene"] },
    { display: "St. Joseph", alternatives: ["saint joseph", "joseph"] },
    { display: "St. Anne", alternatives: ["saint anne", "anne", "mother of mary"] },
    { display: "St. Elizabeth of Hungary", alternatives: ["saint elizabeth", "elizabeth of hungary"] },
    { display: "St. Rose of Lima", alternatives: ["saint rose", "rose of lima"] },
    { display: "St. John Vianney", alternatives: ["saint john vianney", "john vianney", "cure of ars"] },
    {
      display: "St. Bernadette Soubirous",
      alternatives: ["saint bernadette", "bernadette soubirous", "bernadette of lourdes"],
    },
    { display: "St. Kateri Tekakwitha", alternatives: ["saint kateri", "kateri tekakwitha", "lily of the mohawks"] },
    { display: "St. Pio of Pietrelcina", alternatives: ["saint pio", "padre pio", "pio of pietrelcina"] },
    { display: "St. Anthony of Padua", alternatives: ["saint anthony", "anthony of padua"] },
    { display: "St. Aloysius Gonzaga", alternatives: ["saint aloysius", "aloysius gonzaga"] },
    { display: "St. John Bosco", alternatives: ["saint john bosco", "john bosco", "don bosco"] },
    { display: "St. Juan Diego", alternatives: ["saint juan diego", "juan diego"] },
    { display: "St. Patrick", alternatives: ["saint patrick", "patrick of ireland"] },
    { display: "St. Valentine", alternatives: ["saint valentine", "valentine"] },
    { display: "St. Boniface", alternatives: ["saint boniface", "boniface"] },
    { display: "St. Andrew", alternatives: ["saint andrew", "andrew the apostle"] },
    { display: "St. Luke", alternatives: ["saint luke", "luke the evangelist"] },
    { display: "St. Mark", alternatives: ["saint mark", "mark the evangelist"] },
    { display: "St. Matthew", alternatives: ["saint matthew", "matthew the evangelist"] },
    { display: "St. Philip", alternatives: ["saint philip", "philip the apostle"] },
    {
      display: "St. James the Greater",
      alternatives: ["saint james the greater", "james the greater", "james son of zebedee"],
    },
    {
      display: "St. James the Lesser",
      alternatives: ["saint james the lesser", "james the lesser", "james son of alphaeus"],
    },
    { display: "St. Bartholomew", alternatives: ["saint bartholomew", "bartholomew the apostle"] },
    { display: "St. Thomas the Apostle", alternatives: ["saint thomas", "thomas the apostle", "doubting thomas"] },
    { display: "St. Jude Thaddaeus", alternatives: ["saint jude", "jude thaddaeus", "jude the apostle"] },
    { display: "St. Simon the Zealot", alternatives: ["saint simon", "simon the zealot", "simon the apostle"] },
    { display: "St. Barnabas", alternatives: ["saint barnabas", "barnabas the apostle"] },
    { display: "St. Timothy", alternatives: ["saint timothy", "timothy"] },
    { display: "St. Titus", alternatives: ["saint titus", "titus"] },
    { display: "St. Polycarp", alternatives: ["saint polycarp", "polycarp of smyrna"] },
    { display: "St. Ignatius of Antioch", alternatives: ["saint ignatius of antioch", "ignatius of antioch"] },
    { display: "St. Justin Martyr", alternatives: ["saint justin", "justin martyr"] },
    { display: "St. Clement of Rome", alternatives: ["saint clement", "clement of rome", "pope clement"] },
    { display: "St. Ambrose", alternatives: ["saint ambrose", "ambrose of milan"] },
    { display: "St. John Chrysostom", alternatives: ["saint john chrysostom", "john chrysostom", "golden-mouthed"] },
    { display: "St. Basil the Great", alternatives: ["saint basil", "basil the great", "basil of caesarea"] },
    { display: "St. Hilary of Poitiers", alternatives: ["saint hilary", "hilary of poitiers"] },
    { display: "St. Leo the Great", alternatives: ["saint leo", "leo the great", "pope leo"] },
    { display: "St. Isidore of Seville", alternatives: ["saint isidore", "isidore of seville"] },
    { display: "St. John Nepomucene", alternatives: ["saint john nepomucene", "john nepomucene"] },
    { display: "St. Louis IX", alternatives: ["saint louis", "louis ix", "king louis"] },
    { display: "St. Camillus de Lellis", alternatives: ["saint camillus", "camillus de lellis"] },
    { display: "St. Maximilian Kolbe", alternatives: ["saint maximilian", "maximilian kolbe"] },
    { display: "St. Alphonsus Liguori", alternatives: ["saint alphonsus", "alphonsus liguori"] },
    { display: "St. John Henry Newman", alternatives: ["saint john henry", "john henry newman", "cardinal newman"] },
    { display: "St. Stanislaus Kostka", alternatives: ["saint stanislaus", "stanislaus kostka"] },
    { display: "St. Louis de Montfort", alternatives: ["saint louis de montfort", "louis de montfort"] },
    { display: "St. John Eudes", alternatives: ["saint john eudes", "john eudes"] },
    {
      display: "St. Faustina Kowalska",
      alternatives: ["saint faustina kowalska", "faustina kowalska", "divine mercy"],
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

  // Add animation state for saint profile
  const [profileAnimating, setProfileAnimating] = useState(false)

  // Add this function after the handleSuggestionClick function
  // Function to manually scroll to bottom
  const scrollToBottomManually = () => {
    if (messagesEndRef.current) {
      // Use a more direct approach for mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (isMobile) {
        messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" })

        // Also try with the container
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
      } else {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
      }
    }
  }

  // Update the useChat hook to include the onFinish callback that scrolls
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } = useChat({
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content: `Peace be with you, my child. I am ${selectedSaint}. How may I share my wisdom with you today?`,
      },
    ],
    api: "/api/chat",
    body: {
      saintName: selectedSaint,
    },
    onFinish: (message) => {
      // Clear suggestions and set loading to true
      setSuggestions([])
      // Fetch suggestions based on the assistant's response
      fetchSuggestions(message.content)
      // Manually scroll to bottom after message is complete
      setTimeout(scrollToBottomManually, 100)
    },
  })

  // Also update the append function to scroll after user messages
  const handleSuggestionClick = (question: string) => {
    append({
      role: "user",
      content: question,
    })
    // Scroll after user message is added
    setTimeout(scrollToBottomManually, 100)
  }

  // Update the handleSubmit function to ensure scrolling
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e)
    // Scroll after form submission
    setTimeout(scrollToBottomManually, 100)
  }

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

      // Previously added saints
      "St. Peter": {
        name: "St. Peter",
        years: "1-64",
        description: "One of the Twelve Apostles of Jesus Christ, first Pope of the Catholic Church, and martyr.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saint_peter_1960.6.32%20%281%29.jpg-Z5DNPucHrg52Wehgg1dJds6VXMCcSa.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-peter-biography-miracles-and-wisdom",
      },

      // Add the newly uploaded saints with their Blob URLs
      "St. Louis IX": {
        name: "St. Louis IX",
        years: "1214-1270",
        description: "King of France, crusader, and patron of the arts who was known for his justice and piety.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Louis%20IX.jpg-E6ghPgfDdwW2HuzCvT3UqhVW2nqmCq.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-louis-ix-biography-miracles-and-wisdom",
      },
      "St. John Nepomucene": {
        name: "St. John Nepomucene",
        years: "1345-1393",
        description: "Priest and martyr who died rather than violate the seal of confession.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20John%20Nepomucene.jpg-GKrVgXr96FN95M4Jki1tbQQRuBHYu7.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-john-nepomucene-biography-miracles-and-wisdom",
      },
      "St. Stanislaus Kostka": {
        name: "St. Stanislaus Kostka",
        years: "1550-1568",
        description: "Jesuit novice known for his holiness and devotion to the Eucharist despite his young age.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Stanislaus%20Kostka.jpg-iPxpze6wXzkSWpRt0u7x4iRN6rSjHm.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-stanislaus-kostka-biography-miracles-and-wisdom",
      },
      "St. John Henry Newman": {
        name: "St. John Henry Newman",
        years: "1801-1890",
        description: "Anglican priest who converted to Catholicism and became a cardinal and influential theologian.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20John%20Henry%20Newman.jpg-Cg11d6kD8bUDrgxMX53ejOfJVBUhos.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-john-henry-newman-biography-miracles-and-wisdom",
      },
      "St. Camillus de Lellis": {
        name: "St. Camillus de Lellis",
        years: "1550-1614",
        description: "Former soldier who founded an order dedicated to caring for the sick and is patron of nurses.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Camillus%20de%20Lellis.jpg-qY18tU0rFrs3wp2vqr9GfAvobXvcqa.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-camillus-de-lellis-biography-miracles-and-wisdom",
      },
      "St. John Eudes": {
        name: "St. John Eudes",
        years: "1601-1680",
        description: "French missionary and founder who promoted devotion to the Sacred Hearts of Jesus and Mary.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20John%20Eudes-JsCRB4zlgPoshIfe1qSoqdw0eA9n6x.webp",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-john-eudes-biography-miracles-and-wisdom",
      },
      "St. Louis de Montfort": {
        name: "St. Louis de Montfort",
        years: "1673-1716",
        description:
          "French priest known for his devotion to the Blessed Virgin Mary and his influential Marian writings.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Louis%20de%20Montfort.jpg-sz8OAp1ziO7m9tih2XF5PPbU6HXXvO.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-louis-de-montfort-biography-miracles-and-wisdom",
      },
      "St. Maximilian Kolbe": {
        name: "St. Maximilian Kolbe",
        years: "1894-1941",
        description:
          "Franciscan friar who volunteered to die in place of a stranger in the Auschwitz concentration camp.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Maximilian%20Kolbe.jpg-p6TkgdfD9qS9CgkP92zaz9xH6alWOx.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-maximilian-kolbe-biography-miracles-and-wisdom",
      },
      "St. Faustina Kowalska": {
        name: "St. Faustina Kowalska",
        years: "1905-1938",
        description: "Polish nun who received visions of Jesus and promoted the Divine Mercy devotion.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Faustina%20Kowalska.jpg-XXaH5SOgPnLg10uwYvo8VKaKaStQ5P.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-faustina-kowalska-biography-miracles-and-wisdom",
      },
      "St. Alphonsus Liguori": {
        name: "St. Alphonsus Liguori",
        years: "1696-1787",
        description:
          "Bishop, spiritual writer, composer, and founder of the Redemptorists who is a Doctor of the Church.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Alphonsus%20Liguori.jpg-FWq1MZHy2VtetWyWkqCqCFjNiCnZZc.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-alphonsus-liguori-biography-miracles-and-wisdom",
      },
    }

    // Update the saint info when the selected saint changes
    if (saintsData[selectedSaint]) {
      setSaintInfo(saintsData[selectedSaint])
    }

    // Reset the chat with a new welcome message
    setMessages([
      {
        id: "welcome-message",
        role: "assistant",
        content: `Peace be with you, my child. I am ${selectedSaint}. How may I share my wisdom with you today?`,
      },
    ])
  }, [selectedSaint, setMessages])

  // Rest of the component code...
}
