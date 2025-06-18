"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Send, Plane, Activity, Clock, Camera, Play, Download, Sparkles, Bird, HelpCircle } from "lucide-react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useAutoHideHeader } from "@/hooks/use-auto-hide-header"

interface SearchResult {
  id: string
  type: "video" | "image"
  filename: string
  cameraName: string
  timestamp: string
  detectionType: "aircraft" | "drone" | "bird" | "unknown"
  confidence: number
  description: string
  thumbnail: string
  relevanceScore: number
}

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: string
  results?: SearchResult[]
}

const mockSearchResults: SearchResult[] = [
  {
    id: "result-001",
    type: "video",
    filename: "aircraft_landing_20240115_142830.mp4",
    cameraName: "South Tower",
    timestamp: "2024-01-15T14:28:30Z",
    detectionType: "aircraft",
    confidence: 0.96,
    description: "Large commercial aircraft (Boeing 737) performing landing approach with clear visibility",
    thumbnail: "/placeholder.svg?height=120&width=160",
    relevanceScore: 0.94,
  },
  {
    id: "result-002",
    type: "image",
    filename: "drone_detection_20240115_143145.jpg",
    cameraName: "East Taxiway",
    timestamp: "2024-01-15T14:31:45Z",
    detectionType: "drone",
    confidence: 0.87,
    description: "Small quadcopter drone hovering near taxiway, approximately 50 feet altitude",
    thumbnail: "/placeholder.svg?height=120&width=160",
    relevanceScore: 0.89,
  },
  {
    id: "result-003",
    type: "video",
    filename: "aircraft_takeoff_20240115_141205.mp4",
    cameraName: "North Perimeter",
    timestamp: "2024-01-15T14:12:05Z",
    detectionType: "aircraft",
    confidence: 0.92,
    description: "Regional jet aircraft during takeoff sequence with full flaps extended",
    thumbnail: "/placeholder.svg?height=120&width=160",
    relevanceScore: 0.85,
  },
]

const suggestedQueries = [
  "Show me all aircraft detections from today",
  "Find drone sightings in the last 2 hours",
  "What aircraft landed between 2-3 PM?",
  "Show me low altitude detections",
  "Find all Boeing 737 aircraft this morning",
  "Show me suspicious drone activity",
]

export default function AISearch() {
  const [query, setQuery] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Hello! I'm your AI search assistant. I can help you find specific aircraft, drones, or events in your surveillance footage. Try asking me something like 'Show me all aircraft detections from today' or 'Find drone sightings in the last hour'.",
      timestamp: new Date().toISOString(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isHeaderVisible = useAutoHideHeader()

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      const scrollHeight = textarea.scrollHeight
      const maxHeight = 120 // Max height in pixels (about 5 lines)
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
      textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden"
    }
  }, [query])

  const handleSearch = async () => {
    if (!query.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: query,
      timestamp: new Date().toISOString(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setQuery("")

    // Simulate AI processing
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: `I found ${mockSearchResults.length} results matching your query "${userMessage.content}". Here are the most relevant detections:`,
        timestamp: new Date().toISOString(),
        results: mockSearchResults,
      }

      setChatMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery)
  }

  const getDetectionIcon = (type: string) => {
    switch (type) {
      case "aircraft":
        return <Plane className="h-4 w-4" />
      case "drone":
        return <Activity className="h-4 w-4" />
      case "bird":
        return <Bird className="h-4 w-4" />
      case "unknown":
        return <HelpCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getDetectionColor = (type: string) => {
    switch (type) {
      case "aircraft":
        return "bg-blue-500"
      case "drone":
        return "bg-red-500"
      case "bird":
        return "bg-green-500"
      case "unknown":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <SidebarInset>
      <header
        className={`fixed top-0 left-0 right-0 z-50 md:relative md:top-auto md:left-auto md:right-auto md:z-auto transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full md:translate-y-0"
        } flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}
      >
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">AI Search</h1>
          <Badge variant="outline" className="text-purple-500 border-purple-500">
            <Sparkles className="h-3 w-3 mr-1" />
            Semantic Search
          </Badge>
        </div>
        <div className="ml-auto text-sm text-muted-foreground hidden sm:block">
          Ask questions about your surveillance data
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden pt-20 md:pt-0">
        {/* Chat Messages */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-3xl ${message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 border border-border/30"} rounded-lg p-4 shadow-sm`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.type === "assistant" && <Sparkles className="h-4 w-4 text-purple-500" />}
                    <span className="text-sm font-medium">{message.type === "user" ? "You" : "AI Assistant"}</span>
                    <span className="text-xs opacity-70">{new Date(message.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="mb-3">{message.content}</p>

                  {message.results && (
                    <div className="space-y-3 mt-4">
                      {message.results.map((result) => (
                        <Card
                          key={result.id}
                          className="bg-background border-border/50 hover:border-border/70 transition-all duration-200"
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="relative">
                                <img
                                  src={result.thumbnail || "/placeholder.svg"}
                                  alt={result.filename}
                                  className="w-24 h-18 object-cover rounded"
                                />
                                <div className="absolute top-1 left-1">
                                  <Badge className={`${getDetectionColor(result.detectionType)} text-white text-xs`}>
                                    {getDetectionIcon(result.detectionType)}
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-sm">{result.filename}</h4>
                                  <Badge variant="outline">{Math.round(result.relevanceScore * 100)}% match</Badge>
                                </div>

                                <p className="text-sm text-muted-foreground">{result.description}</p>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Camera className="h-3 w-3" />
                                    {result.cameraName}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(result.timestamp).toLocaleString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {Math.round(result.confidence * 100)}% confidence
                                    </Badge>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <Button size="sm" variant="outline">
                                    <Play className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
                    <span className="text-sm">AI is searching...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Queries */}
        {chatMessages.length === 1 && (
          <div className="p-4 border-t border-border/40">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-sm font-medium mb-3">Try these example queries:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {suggestedQueries.map((suggestedQuery, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto p-3 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
                    onClick={() => handleSuggestedQuery(suggestedQuery)}
                  >
                    <Search className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="text-xs">{suggestedQuery}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="p-4 border-t border-border/40">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  placeholder="Ask me anything about your surveillance data... (e.g., 'Show me all aircraft detections from today')"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSearch()
                    }
                  }}
                  className="w-full min-h-[48px] max-h-[120px] resize-none rounded-md border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    lineHeight: "1.4",
                  }}
                />
              </div>
              <Button size="default" onClick={handleSearch} disabled={!query.trim() || isLoading} className="h-12 px-4">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
