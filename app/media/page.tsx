"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Video,
  ImageIcon,
  Download,
  Play,
  Filter,
  Search,
  Plane,
  DrillIcon as Drone,
  Bird,
  HelpCircle,
  Loader2,
} from "lucide-react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useAutoHideHeader } from "@/hooks/use-auto-hide-header"

interface MediaItem {
  id: string
  type: "video" | "image"
  filename: string
  cameraId: string
  cameraName: string
  timestamp: string
  duration?: number
  size: string
  detectionType: "aircraft" | "drone" | "bird" | "unknown"
  confidence: number
  thumbnail: string
}

// Generate more mock data for infinite scroll demonstration
const generateMockMediaItems = (startIndex: number, count: number): MediaItem[] => {
  const cameras = [
    { id: "cam-001", name: "North Perimeter" },
    { id: "cam-002", name: "South Tower" },
    { id: "cam-003", name: "East Taxiway" },
    { id: "cam-004", name: "West Hangar" },
    { id: "cam-005", name: "Cargo Ramp" },
    { id: "cam-006", name: "Terminal Gate" },
    { id: "cam-007", name: "Fuel Farm" },
    { id: "cam-008", name: "Emergency Access" },
  ]

  const detectionTypes: ("aircraft" | "drone" | "bird" | "unknown")[] = ["aircraft", "drone", "bird", "unknown"]
  const fileTypes: ("video" | "image")[] = ["video", "image"]

  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i
    const camera = cameras[index % cameras.length]
    const detectionType = detectionTypes[index % detectionTypes.length]
    const fileType = fileTypes[index % fileTypes.length]
    const date = new Date(Date.now() - index * 1000 * 60 * 15) // 15 minutes apart

    return {
      id: `media-${String(index + 1).padStart(3, "0")}`,
      type: fileType,
      filename: `${detectionType}_${fileType === "video" ? "detection" : "snapshot"}_${date.toISOString().replace(/[:.]/g, "").slice(0, 15)}.${fileType === "video" ? "mp4" : "jpg"}`,
      cameraId: camera.id,
      cameraName: camera.name,
      timestamp: date.toISOString(),
      duration: fileType === "video" ? Math.floor(Math.random() * 30) + 5 : undefined,
      size:
        fileType === "video"
          ? `${(Math.random() * 50 + 10).toFixed(1)} MB`
          : `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      detectionType,
      confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
      thumbnail: "/placeholder.svg?height=120&width=160",
    }
  })
}

const ITEMS_PER_PAGE = 12
const MAX_TOTAL_ITEMS = 100 // Set your desired maximum here

export default function MediaLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCamera, setSelectedCamera] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedDetection, setSelectedDetection] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const isHeaderVisible = useAutoHideHeader()

  // Infinite scroll state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  // Load initial data
  useEffect(() => {
    const initialItems = generateMockMediaItems(0, ITEMS_PER_PAGE)
    setMediaItems(initialItems)
    setPage(1)
  }, [])

  // Load more items
  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const currentTotal = mediaItems.length
    const remainingItems = MAX_TOTAL_ITEMS - currentTotal
    const itemsToLoad = Math.min(ITEMS_PER_PAGE, remainingItems)

    if (itemsToLoad <= 0) {
      setHasMore(false)
      setLoading(false)
      return
    }

    const newItems = generateMockMediaItems(page * ITEMS_PER_PAGE, itemsToLoad)

    if (newItems.length < ITEMS_PER_PAGE || currentTotal + newItems.length >= MAX_TOTAL_ITEMS) {
      setHasMore(false)
    }

    setMediaItems((prev) => [...prev, ...newItems])
    setPage((prev) => prev + 1)
    setLoading(false)
  }, [loading, hasMore, page, mediaItems.length])

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreItems()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMoreItems])

  // Reset when filters change
  useEffect(() => {
    setMediaItems(generateMockMediaItems(0, ITEMS_PER_PAGE))
    setPage(1)
    setHasMore(true)
  }, [selectedCamera, selectedType, selectedDetection, sortBy, searchTerm])

  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch =
      item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cameraName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCamera = selectedCamera === "all" || item.cameraId === selectedCamera
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesDetection = selectedDetection === "all" || item.detectionType === selectedDetection

    return matchesSearch && matchesCamera && matchesType && matchesDetection
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      case "oldest":
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      case "size":
        return Number.parseFloat(b.size) - Number.parseFloat(a.size)
      case "confidence":
        return b.confidence - a.confidence
      default:
        return 0
    }
  })

  const getDetectionIcon = (type: string) => {
    switch (type) {
      case "aircraft":
        return <Plane className="h-4 w-4" />
      case "drone":
        return <Drone className="h-4 w-4" />
      case "bird":
        return <Bird className="h-4 w-4" />
      case "unknown":
        return <HelpCircle className="h-4 w-4" />
      default:
        return <HelpCircle className="h-4 w-4" />
    }
  }

  const getDetectionColor = (type: string) => {
    switch (type) {
      case "aircraft":
        return "bg-blue-500 hover:bg-blue-600"
      case "drone":
        return "bg-red-500 hover:bg-red-600"
      case "bird":
        return "bg-green-500 hover:bg-green-600"
      case "unknown":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const videoItems = sortedItems.filter((item) => item.type === "video")
  const imageItems = sortedItems.filter((item) => item.type === "image")

  return (
    <SidebarInset>
      <header
        className={`fixed top-0 left-0 right-0 z-50 md:relative md:top-auto md:left-auto md:right-auto md:z-auto transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full md:translate-y-0"
        } flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}
      >
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2 flex-1">
          <h1 className="text-lg font-semibold">Media Library</h1>
          <Badge variant="outline">{sortedItems.length}+ items</Badge>
        </div>

        {/* Storage Status Indicator - More compact for mobile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span>NAS Storage:</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
                  style={{ width: "68%" }}
                ></div>
              </div>
              <span className="text-xs font-medium">68%</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            2.1TB / 3.0TB
          </Badge>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 pt-20 md:pt-4">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="py-3 px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-3 sm:px-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cameras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cameras</SelectItem>
                  <SelectItem value="cam-001">North Perimeter</SelectItem>
                  <SelectItem value="cam-002">South Tower</SelectItem>
                  <SelectItem value="cam-003">East Taxiway</SelectItem>
                  <SelectItem value="cam-004">West Hangar</SelectItem>
                  <SelectItem value="cam-005">Cargo Ramp</SelectItem>
                  <SelectItem value="cam-006">Terminal Gate</SelectItem>
                  <SelectItem value="cam-007">Fuel Farm</SelectItem>
                  <SelectItem value="cam-008">Emergency Access</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDetection} onValueChange={setSelectedDetection}>
                <SelectTrigger>
                  <SelectValue placeholder="All Detections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Detections</SelectItem>
                  <SelectItem value="aircraft">Aircraft</SelectItem>
                  <SelectItem value="drone">Drones</SelectItem>
                  <SelectItem value="bird">Birds</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="size">File Size</SelectItem>
                  <SelectItem value="confidence">Confidence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Media Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              All Media ({sortedItems.length}+)
            </TabsTrigger>
            <TabsTrigger value="videos" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Videos ({videoItems.length}+)
            </TabsTrigger>
            <TabsTrigger value="images" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Images ({imageItems.length}+)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedItems.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-muted-foreground">Loading more items...</span>
              </div>
            )}
            {!hasMore && sortedItems.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">No more items to load</div>
            )}
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videoItems.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="images" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {imageItems.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}

function MediaCard({ item }: { item: MediaItem }) {
  const getDetectionIcon = (type: string) => {
    switch (type) {
      case "aircraft":
        return <Plane className="h-4 w-4" />
      case "drone":
        return <Drone className="h-4 w-4" />
      case "bird":
        return <Bird className="h-4 w-4" />
      case "unknown":
        return <HelpCircle className="h-4 w-4" />
      default:
        return <HelpCircle className="h-4 w-4" />
    }
  }

  const getDetectionColor = (type: string) => {
    switch (type) {
      case "aircraft":
        return "bg-blue-500 hover:bg-blue-600"
      case "drone":
        return "bg-red-500 hover:bg-red-600"
      case "bird":
        return "bg-green-500 hover:bg-green-600"
      case "unknown":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-all duration-200 hover:border-border/70">
      <div className="relative aspect-video">
        <img src={item.thumbnail || "/placeholder.svg"} alt={item.filename} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2">
          <Badge className={`${getDetectionColor(item.detectionType)} text-white`}>
            {getDetectionIcon(item.detectionType)}
            <span className="ml-1 capitalize">{item.detectionType}</span>
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary">
            {item.type === "video" ? <Video className="h-3 w-3 mr-1" /> : <ImageIcon className="h-3 w-3 mr-1" />}
            {item.type}
          </Badge>
        </div>
        {item.duration && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="text-xs">
              {item.duration}s
            </Badge>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <Button size="sm" variant="secondary">
            <Play className="h-4 w-4 mr-2" />
            Play
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm truncate" title={item.filename}>
            {item.filename}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{item.cameraName}</span>
            <span>{item.size}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
            </span>
            <Badge variant="outline" className="text-xs">
              {Math.round(item.confidence * 100)}%
            </Badge>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Play className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
