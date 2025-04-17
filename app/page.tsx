"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { ChevronLeft, ChevronRight, Menu, Search, Send, X, Copy, Check } from "lucide-react"
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
    { display: "St. Faustina Kowalska", alternatives: ["saint faustina", "faustina kowalska", "divine mercy"] },
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
      "St. Paul": {
        name: "St. Paul",
        years: "5-67",
        description: "Apostle to the Gentiles, missionary, theologian, and author of many New Testament epistles.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saint%20paul.jpg-wfs4TRIu5ex9kGvkye6vkM4E7QWpn1.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-paul-biography-miracles-and-wisdom",
      },
      "St. John the Evangelist": {
        name: "St. John the Evangelist",
        years: "6-100",
        description:
          "One of the Twelve Apostles of Jesus, author of the Gospel of John, three Epistles, and the Book of Revelation.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20John%20the%20Evangelist-lr94ux9DDVRyRmkwCkGnp2EoFKXnI9.webp",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-john-the-evangelist-biography-miracles-and-wisdom",
      },
      "St. Athanasius": {
        name: "St. Athanasius",
        years: "296-373",
        description:
          "Bishop of Alexandria, Doctor of the Church, and defender of the divinity of Christ against Arianism.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Athanasius-UbK6Ktil0tdlVwlPJXugIw4ILZaGs0.png",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-athanasius-biography-miracles-and-wisdom",
      },
      "St. Jerome": {
        name: "St. Jerome",
        years: "347-420",
        description: "Doctor of the Church, theologian, and translator of the Bible into Latin (the Vulgate).",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Jerome.jpg-s2peOmZ743ayIs7GPPF9ram0adu9qE.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-jerome-biography-miracles-and-wisdom",
      },
      "St. Benedict of Nursia": {
        name: "St. Benedict of Nursia",
        years: "480-547",
        description: "Founder of Western monasticism and author of the Rule of Saint Benedict.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Benedict%20of%20Nursia.jpg-JCRJgGs7H6W5SBji3BTKWcm70YifUr.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-benedict-of-nursia-biography-miracles-and-wisdom",
      },
      "St. Gregory the Great": {
        name: "St. Gregory the Great",
        years: "540-604",
        description: "Pope, Doctor of the Church, and reformer who significantly influenced the medieval Church.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Gregory%20the%20Great.jpg-CX6ws3DvvL4RM7TfilfPhJHmN0Zl2u.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-gregory-the-great-biography-miracles-and-wisdom",
      },
      "St. Clare of Assisi": {
        name: "St. Clare of Assisi",
        years: "1194-1253",
        description: "Founder of the Order of Poor Ladies (Poor Clares) and close associate of St. Francis of Assisi.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Clare%20of%20Assisi-5HSeYGy7w8pLChdnhualb0xcvTZGrD.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-clare-of-assisi-biography-miracles-and-wisdom",
      },
      "St. Dominic": {
        name: "St. Dominic",
        years: "1170-1221",
        description: "Founder of the Dominican Order, preacher, and champion of orthodox Catholic belief.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Dominic.jpg-5gMF4a0a5ttx201eMbnXI0CBb1kYoN.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-dominic-biography-miracles-and-wisdom",
      },
      "St. Catherine of Siena": {
        name: "St. Catherine of Siena",
        years: "1347-1380",
        description: "Dominican tertiary, mystic, Doctor of the Church, and counselor to popes and rulers.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Catherine%20of%20Siena.jpg-hO1wgdMaejMvfu9OaS2EAhXC4ucxjq.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-catherine-of-siena-biography-miracles-and-wisdom",
      },
      "St. John of the Cross": {
        name: "St. John of the Cross",
        years: "1542-1591",
        description:
          "Spanish Carmelite friar, mystic, Doctor of the Church, and co-founder of the Discalced Carmelites.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20John%20of%20the%20Cross.jpg-GiNBBx5qSI7arRfDwWlPtHv933qgB5.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-john-of-the-cross-biography-miracles-and-wisdom",
      },
      "St. Ignatius of Loyola": {
        name: "St. Ignatius of Loyola",
        years: "1491-1556",
        description: "Founder of the Society of Jesus (Jesuits) and author of the Spiritual Exercises.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Ignatius%20of%20Loyola-ECzeGZM2uLsmyOTx82P8ssemObWgZY.webp",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-ignatius-of-loyola-biography-miracles-and-wisdom",
      },
      "St. Francis Xavier": {
        name: "St. Francis Xavier",
        years: "1506-1552",
        description: "Co-founder of the Society of Jesus and pioneering missionary to Asia.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Francis%20Xavier.jpg-rFrq6g2TLReuMHL0U06e9kjQD4trvf.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-francis-xavier-biography-miracles-and-wisdom",
      },
      "St. Joan of Arc": {
        name: "St. Joan of Arc",
        years: "1412-1431",
        description:
          "French military leader, mystic, and martyr who led the French army to victory during the Hundred Years' War.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Joan%20of%20Arc-lAVAUp8KjvuzTk7hmFyCE1uaOczlLz.webp",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-joan-of-arc-biography-miracles-and-wisdom",
      },
      "St. Mother Teresa of Calcutta": {
        name: "St. Mother Teresa of Calcutta",
        years: "1910-1997",
        description:
          "Founder of the Missionaries of Charity and Nobel Peace Prize recipient known for her work with the poor.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Mother%20Teresa%20of%20Calcutta.jpg-VvPTNunrwxVfQmh3RlgUBFuvM47F6N.jpeg",
        articleLink:
          "https://www.thecatholicvoice.com/saints/saint-mother-teresa-of-calcutta-biography-miracles-and-wisdom",
      },

      // New saints to add
      "St. Mary Magdalene": {
        name: "St. Mary Magdalene",
        years: "1st century",
        description:
          "Follower of Jesus, witness to his crucifixion and resurrection, and the first to see the risen Christ.",
        image: "/woman-reading-scroll.png",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-mary-magdalene-biography-miracles-and-wisdom",
      },
      "St. Joseph": {
        name: "St. Joseph",
        years: "1st century BC-1st century AD",
        description: "Foster father of Jesus Christ, husband of the Virgin Mary, and patron of the Universal Church.",
        image: "/Saint Joseph with Child.png",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-joseph-biography-miracles-and-wisdom",
      },
      "St. Anne": {
        name: "St. Anne",
        years: "1st century BC",
        description: "Mother of the Virgin Mary and grandmother of Jesus Christ, known for her patience and devotion.",
        image: "/placeholder.svg?key=rxmgn",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-anne-biography-miracles-and-wisdom",
      },
      "St. Elizabeth of Hungary": {
        name: "St. Elizabeth of Hungary",
        years: "1207-1231",
        description:
          "Hungarian princess known for her charitable works and devotion to the poor despite her royal status.",
        image: "/saint-elizabeth-charity.png",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-elizabeth-of-hungary-biography-miracles-and-wisdom",
      },
      "St. Rose of Lima": {
        name: "St. Rose of Lima",
        years: "1586-1617",
        description:
          "First canonized saint of the Americas, known for her extreme asceticism and mystical experiences.",
        image: "/saint-rose-garden.png",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-rose-of-lima-biography-miracles-and-wisdom",
      },
      "St. John Vianney": {
        name: "St. John Vianney",
        years: "1786-1859",
        description:
          "French parish priest known as the Curé of Ars, renowned for his wisdom in the confessional and spiritual direction.",
        image: "/placeholder.svg?height=200&width=200&query=St.+John+Vianney",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-john-vianney-biography-miracles-and-wisdom",
      },
      "St. Bernadette Soubirous": {
        name: "St. Bernadette Soubirous",
        years: "1844-1879",
        description:
          "French visionary who witnessed apparitions of the Virgin Mary at Lourdes, leading to a major pilgrimage site.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Bernadette+Soubirous",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-bernadette-soubirous-biography-miracles-and-wisdom",
      },
      "St. Kateri Tekakwitha": {
        name: "St. Kateri Tekakwitha",
        years: "1656-1680",
        description:
          "First Native American saint, known as the 'Lily of the Mohawks,' who converted to Catholicism despite persecution.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Kateri+Tekakwitha",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-kateri-tekakwitha-biography-miracles-and-wisdom",
      },
      "St. Pio of Pietrelcina": {
        name: "St. Pio of Pietrelcina",
        years: "1887-1968",
        description:
          "Italian Franciscan friar known as Padre Pio, famous for bearing the stigmata and for his spiritual gifts.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Pio+of+Pietrelcina",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-pio-of-pietrelcina-biography-miracles-and-wisdom",
      },
      "St. Anthony of Padua": {
        name: "St. Anthony of Padua",
        years: "1195-1231",
        description: "Portuguese Franciscan friar known as the patron saint of lost items and a renowned preacher.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Anthony+of+Padua",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-anthony-of-padua-biography-miracles-and-wisdom",
      },
      "St. Aloysius Gonzaga": {
        name: "St. Aloysius Gonzaga",
        years: "1568-1591",
        description:
          "Italian Jesuit who renounced his noble inheritance to serve the sick and died young caring for plague victims.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Aloysius+Gonzaga",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-aloysius-gonzaga-biography-miracles-and-wisdom",
      },
      "St. John Bosco": {
        name: "St. John Bosco",
        years: "1815-1888",
        description: "Italian priest who dedicated his life to the education and formation of disadvantaged youth.",
        image: "/placeholder.svg?height=200&width=200&query=St.+John+Bosco",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-john-bosco-biography-miracles-and-wisdom",
      },
      "St. Juan Diego": {
        name: "St. Juan Diego",
        years: "1474-1548",
        description: "Indigenous Mexican to whom the Virgin of Guadalupe appeared, leading to millions of conversions.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Juan+Diego",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-juan-diego-biography-miracles-and-wisdom",
      },
      "St. Patrick": {
        name: "St. Patrick",
        years: "385-461",
        description: "Missionary bishop and patron saint of Ireland who spread Christianity throughout the country.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Patrick",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-patrick-biography-miracles-and-wisdom",
      },
      "St. Valentine": {
        name: "St. Valentine",
        years: "3rd century",
        description: "Roman priest and martyr associated with courtly love and now the patron saint of lovers.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Valentine",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-valentine-biography-miracles-and-wisdom",
      },
      "St. Boniface": {
        name: "St. Boniface",
        years: "675-754",
        description: "English Benedictine monk known as the 'Apostle of Germany' for his missionary work.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Boniface",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-boniface-biography-miracles-and-wisdom",
      },
      "St. Andrew": {
        name: "St. Andrew",
        years: "1st century",
        description: "One of the Twelve Apostles, brother of Peter, and patron saint of Scotland.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Andrew",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-andrew-biography-miracles-and-wisdom",
      },
      "St. Luke": {
        name: "St. Luke",
        years: "1st century",
        description: "Author of the Gospel of Luke and Acts of the Apostles, physician, and companion of Paul.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Luke",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-luke-biography-miracles-and-wisdom",
      },
      "St. Mark": {
        name: "St. Mark",
        years: "1st century",
        description: "Author of the Gospel of Mark, companion of Peter, and founder of the Church in Alexandria.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Mark",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-mark-biography-miracles-and-wisdom",
      },
      "St. Matthew": {
        name: "St. Matthew",
        years: "1st century",
        description: "Former tax collector who became an Apostle and author of the Gospel of Matthew.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Matthew",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-matthew-biography-miracles-and-wisdom",
      },
      "St. Philip": {
        name: "St. Philip",
        years: "1st century",
        description: "One of the Twelve Apostles who brought Nathanael to Jesus and preached in Greece and Phrygia.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Philip",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-philip-biography-miracles-and-wisdom",
      },
      "St. James the Greater": {
        name: "St. James the Greater",
        years: "1st century",
        description: "One of the Twelve Apostles, son of Zebedee, and the first apostle to be martyred.",
        image: "/placeholder.svg?height=200&width=200&query=St.+James+the+Greater",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-james-the-greater-biography-miracles-and-wisdom",
      },
      "St. James the Lesser": {
        name: "St. James the Lesser",
        years: "1st century",
        description: "One of the Twelve Apostles, son of Alphaeus, and author of the Epistle of James.",
        image: "/placeholder.svg?height=200&width=200&query=St.+James+the+Lesser",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-james-the-lesser-biography-miracles-and-wisdom",
      },
      "St. Bartholomew": {
        name: "St. Bartholomew",
        years: "1st century",
        description: "One of the Twelve Apostles who preached in India and Armenia where he was martyred.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Bartholomew",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-bartholomew-biography-miracles-and-wisdom",
      },
      "St. Thomas the Apostle": {
        name: "St. Thomas the Apostle",
        years: "1st century",
        description:
          "One of the Twelve Apostles, known for his initial doubt in the resurrection and missionary work in India.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Thomas+the+Apostle",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-thomas-the-apostle-biography-miracles-and-wisdom",
      },
      "St. Jude Thaddaeus": {
        name: "St. Jude Thaddaeus",
        years: "1st century",
        description: "One of the Twelve Apostles and patron saint of desperate cases and lost causes.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Jude+Thaddaeus",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-jude-thaddaeus-biography-miracles-and-wisdom",
      },
      "St. Simon the Zealot": {
        name: "St. Simon the Zealot",
        years: "1st century",
        description: "One of the Twelve Apostles who preached in Egypt and Persia.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Simon+the+Zealot",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-simon-the-zealot-biography-miracles-and-wisdom",
      },
      "St. Barnabas": {
        name: "St. Barnabas",
        years: "1st century",
        description: "Early Christian disciple and companion of Paul on his missionary journeys.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Barnabas",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-barnabas-biography-miracles-and-wisdom",
      },
      "St. Timothy": {
        name: "St. Timothy",
        years: "17-97",
        description: "Companion of Paul and recipient of two New Testament epistles, who became Bishop of Ephesus.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Timothy",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-timothy-biography-miracles-and-wisdom",
      },
      "St. Titus": {
        name: "St. Titus",
        years: "1st century",
        description: "Companion of Paul, recipient of a New Testament epistle, and Bishop of Crete.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Titus",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-titus-biography-miracles-and-wisdom",
      },
      "St. Polycarp": {
        name: "St. Polycarp",
        years: "69-155",
        description: "Bishop of Smyrna, disciple of John the Apostle, and early Church Father martyred for his faith.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Polycarp",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-polycarp-biography-miracles-and-wisdom",
      },
      "St. Ignatius of Antioch": {
        name: "St. Ignatius of Antioch",
        years: "35-108",
        description:
          "Early Church Father and Bishop of Antioch who wrote influential epistles on his way to martyrdom in Rome.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Ignatius+of+Antioch",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-ignatius-of-antioch-biography-miracles-and-wisdom",
      },
      "St. Justin Martyr": {
        name: "St. Justin Martyr",
        years: "100-165",
        description: "Early Christian apologist who used philosophy to defend the faith before being martyred.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Justin+Martyr",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-justin-martyr-biography-miracles-and-wisdom",
      },
      "St. Clement of Rome": {
        name: "St. Clement of Rome",
        years: "35-99",
        description: "Early Bishop of Rome and author of an important epistle to the Corinthians.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Clement+of+Rome",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-clement-of-rome-biography-miracles-and-wisdom",
      },
      "St. Ambrose": {
        name: "St. Ambrose",
        years: "340-397",
        description:
          "Bishop of Milan, Doctor of the Church, and influential figure in the conversion of St. Augustine.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Ambrose",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-ambrose-biography-miracles-and-wisdom",
      },
      "St. John Chrysostom": {
        name: "St. John Chrysostom",
        years: "347-407",
        description: "Archbishop of Constantinople, Doctor of the Church, and renowned for his eloquent preaching.",
        image: "/placeholder.svg?height=200&width=200&query=St.+John+Chrysostom",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-john-chrysostom-biography-miracles-and-wisdom",
      },
      "St. Basil the Great": {
        name: "St. Basil the Great",
        years: "330-379",
        description: "Bishop of Caesarea, Doctor of the Church, and founder of Eastern monasticism.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Basil+the+Great",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-basil-the-great-biography-miracles-and-wisdom",
      },
      "St. Hilary of Poitiers": {
        name: "St. Hilary of Poitiers",
        years: "310-367",
        description: "Bishop of Poitiers, Doctor of the Church, and defender of the Trinity against Arianism.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Hilary+of+Poitiers",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-hilary-of-poitiers-biography-miracles-and-wisdom",
      },
      "St. Leo the Great": {
        name: "St. Leo the Great",
        years: "400-461",
        description: "Pope and Doctor of the Church who persuaded Attila the Hun to spare Rome.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Leo+the+Great",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-leo-the-great-biography-miracles-and-wisdom",
      },
      "St. Isidore of Seville": {
        name: "St. Isidore of Seville",
        years: "560-636",
        description: "Archbishop of Seville, Doctor of the Church, and one of the most learned men of his time.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Isidore+of+Seville",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-isidore-of-seville-biography-miracles-and-wisdom",
      },
      "St. John Nepomucene": {
        name: "St. John Nepomucene",
        years: "1345-1393",
        description: "Priest and martyr who died rather than violate the seal of confession.",
        image: "/placeholder.svg?height=200&width=200&query=St.+John+Nepomucene",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-john-nepomucene-biography-miracles-and-wisdom",
      },
      "St. Louis IX": {
        name: "St. Louis IX",
        years: "1214-1270",
        description: "King of France known for his piety, justice, and leadership during the Seventh Crusade.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Louis+IX",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-louis-ix-biography-miracles-and-wisdom",
      },
      "St. Camillus de Lellis": {
        name: "St. Camillus de Lellis",
        years: "1550-1614",
        description: "Italian priest who founded an order dedicated to caring for the sick and is patron of nurses.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Camillus+de+Lellis",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-camillus-de-lellis-biography-miracles-and-wisdom",
      },
      "St. Maximilian Kolbe": {
        name: "St. Maximilian Kolbe",
        years: "1894-1941",
        description:
          "Polish Franciscan friar who volunteered to die in place of a stranger in Auschwitz concentration camp.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Maximilian+Kolbe",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-maximilian-kolbe-biography-miracles-and-wisdom",
      },
      "St. Alphonsus Liguori": {
        name: "St. Alphonsus Liguori",
        years: "1696-1787",
        description:
          "Italian bishop, Doctor of the Church, and founder of the Redemptorists known for his moral theology.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Alphonsus+Liguori",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-alphonsus-liguori-biography-miracles-and-wisdom",
      },
      "St. John Henry Newman": {
        name: "St. John Henry Newman",
        years: "1801-1890",
        description: "English theologian, poet, and cardinal who converted from Anglicanism to Catholicism.",
        image: "/placeholder.svg?height=200&width=200&query=St.+John+Henry+Newman",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-john-henry-newman-biography-miracles-and-wisdom",
      },
      "St. Stanislaus Kostka": {
        name: "St. Stanislaus Kostka",
        years: "1550-1568",
        description: "Polish novice of the Society of Jesus who persevered in his vocation despite family opposition.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Stanislaus+Kostka",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-stanislaus-kostka-biography-miracles-and-wisdom",
      },
      "St. Louis de Montfort": {
        name: "St. Louis de Montfort",
        years: "1673-1716",
        description: "French priest and Marian devotee known for his influence on Marian spirituality and devotion.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Louis+de+Montfort",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-louis-de-montfort-biography-miracles-and-wisdom",
      },
      "St. John Eudes": {
        name: "St. John Eudes",
        years: "1601-1680",
        description:
          "French priest who founded the Congregation of Jesus and Mary and promoted devotion to the Sacred Hearts.",
        image: "/placeholder.svg?height=200&width=200&query=St.+John+Eudes",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-john-eudes-biography-miracles-and-wisdom",
      },
      "St. Faustina Kowalska": {
        name: "St. Faustina Kowalska",
        years: "1905-1938",
        description: "Polish nun and mystic whose visions of Jesus inspired the Divine Mercy devotion.",
        image: "/placeholder.svg?height=200&width=200&query=St.+Faustina+Kowalska",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-faustina-kowalska-biography-miracles-and-wisdom",
      },
    }

    // Add animation for saint profile change
    setProfileAnimating(true)

    // Update the saint info after a short delay for animation
    setTimeout(() => {
      // Update the saint info
      setSaintInfo(saintsData[selectedSaint as keyof typeof saintsData])
      setProfileAnimating(false)

      // Reset chat with new welcome message
      setMessages([
        {
          id: "welcome-message",
          role: "assistant",
          content: `Peace be with you, my child. I am ${selectedSaint}. How may I share my wisdom with you today?`,
        },
      ])

      // Reset suggestions to default
      setSuggestions([
        "What is your greatest teaching?",
        "How did you find your calling?",
        "What challenges did you face?",
        "What advice would you give me?",
        "Tell me about your spiritual journey",
      ])

      // Clear search when saint is selected
      setSearchQuery("")
    }, 300)
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

  // Function to copy message content
  const copyMessageContent = (messageId: string, content: string) => {
    // Create a temporary, invisible element to avoid layout shifts
    const tempTextArea = document.createElement("textarea")
    tempTextArea.value = content
    tempTextArea.style.position = "absolute"
    tempTextArea.style.left = "-9999px"
    tempTextArea.style.top = "0"
    document.body.appendChild(tempTextArea)

    // Select and copy the text
    tempTextArea.select()
    document.execCommand("copy")

    // Remove the temporary element
    document.body.removeChild(tempTextArea)

    // Set the copied message ID to show the check icon
    setCopiedMessageId(messageId)

    // Reset after 2 seconds
    setTimeout(() => {
      setCopiedMessageId(null)
    }, 2000)
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

        <div className={`saint-profile ${profileAnimating ? "saint-profile-enter" : ""}`}>
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
        <div className="sidebar-disclaimer">Content provided for educational and informational purposes only.</div>
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
        <div className="chat-area" ref={messagesContainerRef}>
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
                  {/* Add copy button for saint messages only */}
                  {message.role === "assistant" && (
                    <button
                      className="copy-button"
                      onClick={() => copyMessageContent(message.id, message.content)}
                      aria-label="Copy message"
                    >
                      {copiedMessageId === message.id ? <Check size={16} /> : <Copy size={16} />}
                      <span className={`copy-tooltip ${copiedMessageId === message.id ? "visible" : ""}`}>
                        {copiedMessageId === message.id ? "Copied!" : "Copy"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-32"></div>
          </div>
        </div>

        {/* Input area */}
        <div className="input-area">
          <div className="input-container">
            {suggestionsLoading ? (
              <div className="suggestions-loading">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
            ) : (
              suggestions.length > 0 &&
              !isLoading &&
              !suggestionsLoading && (
                <div className="suggestions-container">
                  <button className="scroll-button scroll-left" onClick={() => scrollSuggestions("left")}>
                    <ChevronLeft size={16} />
                  </button>

                  <div ref={suggestionsRef} className="suggestions hide-scrollbar">
                    {suggestions.map((question, index) => (
                      <button
                        key={question}
                        className="suggestion-button"
                        onClick={() => handleSuggestionClick(question)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {question}
                      </button>
                    ))}
                  </div>

                  <button className="scroll-button scroll-right" onClick={() => scrollSuggestions("right")}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )
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
