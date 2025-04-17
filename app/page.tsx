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
    // Add the new saints to the search alternatives
    { 
      display: "St. Stanislaus Kostka", 
      alternatives: ["saint stanislaus", "stanislaus kostka", "polish jesuit novice"] 
    },
    { 
      display: "St. John Nepomucene", 
      alternatives: ["saint john nepomucene", "john nepomucene", "martyr of confession"] 
    },
    { 
      display: "St. Louis IX", 
      alternatives: ["saint louis ix", "louis ix", "king louis", "louis of france"] 
    },
    { 
      display: "St. Maximilian Kolbe", 
      alternatives: ["saint maximilian", "maximilian kolbe", "martyr of auschwitz"] 
    },
    { 
      display: "St. John Eudes", 
      alternatives: ["saint john eudes", "john eudes", "sacred heart devotion"] 
    },
    { 
      display: "St. Camillus de Lellis", 
      alternatives: ["saint camillus", "camillus de lellis", "patron of nurses"] 
    },
    { 
      display: "St. Louis de Montfort", 
      alternatives: ["saint louis de montfort", "louis de montfort", "true devotion to mary"] 
    },
    { 
      display: "St. Faustina Kowalska", 
      alternatives: ["saint faustina", "faustina kowalska", "divine mercy", "sister faustina"] 
    },
    { 
      display: "St. Alphonsus Liguori", 
      alternatives: ["saint alphonsus", "alphonsus liguori", "doctor of the church", "redemptorist founder"] 
    },
    { 
      display: "St. John Henry Newman", 
      alternatives: ["saint john henry", "john henry newman", "cardinal newman", "newman"] 
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
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/saint-mary-magdalene.jpg-frAqy2RXKvFblGSPhzMLDYOIX0iR0W.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-mary-magdalene-biography-miracles-and-wisdom",
      },
      "St. Joseph": {
        name: "St. Joseph",
        years: "1st century BC-1st century AD",
        description: "Foster father of Jesus Christ, husband of the Virgin Mary, and patron of the Universal Church.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Joseph.jpg-HF3sNWt5xdYJGJt8y47vAHnt66iDh9.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-joseph-biography-miracles-and-wisdom",
      },
      "St. Anne": {
        name: "St. Anne",
        years: "1st century BC",
        description: "Mother of the Virgin Mary and grandmother of Jesus Christ, known for her patience and devotion.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Anne-TpgB5z2kNNYbJd1JCBK7jnl2KfivbD.webp",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-anne-biography-miracles-and-wisdom",
      },
      "St. Elizabeth of Hungary": {
        name: "St. Elizabeth of Hungary",
        years: "1207-1231",
        description:
          "Hungarian princess known for her charitable works and devotion to the poor despite her royal status.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Elizabeth%20of%20Hungary.jpg-lRcpuD3qDlEFLSqSuUdXyGROPSiF6H.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-elizabeth-of-hungary-biography-miracles-and-wisdom",
      },
      "St. Rose of Lima": {
        name: "St. Rose of Lima",
        years: "1586-1617",
        description:
          "First canonized saint of the Americas, known for her extreme asceticism and mystical experiences.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Rose%20of%20Lima.jpg-WG3ebRXxam3qbLi98MeX4d9DVrV5lJ.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-rose-of-lima-biography-miracles-and-wisdom",
      },
      "St. John Vianney": {
        name: "St. John Vianney",
        years: "1786-1859",
        description:
          "French parish priest known as the Curé of Ars, renowned for his wisdom in the confessional and spiritual direction.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20John%20Vianney.jpg-f6Pw7ZS1ofbPqMD5vF0U8ELVMJyUAJ.jpeg",
        articleLink: "https://www.thecatholicvoice.com/saints/saint-john-vianney-biography-miracles-and-wisdom",
      },
      "St. Bernadette Soubirous": {
        name: "St. Bernadette Soubirous",
        years: "1844-1879",
        description:
          "French visionary who witnessed apparitions of the Virgin Mary at Lourdes, leading to a major pilgrimage site.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Bernadette%20Soubirous.jpg-sljJvWjF3yZ1Ocm0nOBKoNN5QD8vq",
        articleLink:
          "https://www.thecatholicvoice.com/saints/saint-bernadette-soubirous-biography-miracles-and-wisdom",
      },
      "St. Kateri Tekakwitha": {
        name: "St. Kateri Tekakwitha",
        years: "1656-1680",
        description:
          "Native American virgin known as the Lily of the Mohawks, revered for her piety and devotion to the Eucharist.",
        image:
          \"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saint%20Kateri%20Tekakwitha.jpg-11666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666
