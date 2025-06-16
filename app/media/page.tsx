"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Video, ImageIcon, Download, Play, Filter, Search, Plane, Activity } from "lucide-react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

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

const mockMediaItems: MediaItem[] = [
  {
    id: "media-001",
    type: "video",
    filename: "aircraft_detection_20240115_143215.mp4",
    cameraId: "cam-001",
    cameraName: "North Perimeter",
    timestamp: "2024-01-15T14:32:15Z",
    duration: 12,
    size: "24.5 MB",
    detectionType: "aircraft",
    confidence: 0.94,
    thumbnail: "/placeholder.svg?height=120&width=160",
  },
  {
    id: "media-002",
    type: "image",
    filename: "drone_snapshot_20240115_143145.jpg",
    cameraId: "cam-003",
    cameraName: "East Taxiway",
    timestamp: "2024-01-15T14:31:45Z",
    size: "2.1 MB",
    detectionType: "drone",
    confidence: 0.87,
    thumbnail: "/placeholder.svg?height=120&width=160",
  },
  {
    id: "media-003",
    type: "video",
    filename: "aircraft_landing_20240115_142830.mp4",
    cameraId: "cam-002",
    cameraName: "South Tower",
    timestamp: "2024-01-15T14:28:30Z",
    duration: 18,
    size: "36.2 MB",
    detectionType: "aircraft",
    confidence: 0.96,
    thumbnail: "/placeholder.svg?height=120&width=160",
  },
  {
    id: "media-004",
    type: "image",
    filename: "bird_detection_20240115_141205.jpg",
    cameraId: "cam-004",
    cameraName: "West Hangar",
    timestamp: "2024-01-15T14:12:05Z",
    size: "1.8 MB",
    detectionType: "bird",
    confidence: 0.73,
    thumbnail: "/placeholder.svg?height=120&width=160",
  },
  {
    id: "media-005",
    type: "video",
    filename: "drone_approach_20240115_140945.mp4",
    cameraId: "cam-005",
    cameraName: "Cargo Ramp",
    timestamp: "2024-01-15T14:09:45Z",
    duration: 8,
    size: "16.8 MB",
    detectionType: "drone",
    confidence: 0.91,
    thumbnail: "/placeholder.svg?height=120&width=160",
  },
  {
    id: "media-006",
    type: "image",
    filename: "aircraft_taxi_20240115_135520.jpg",
    cameraId: "cam-006",
    cameraName: "Terminal Gate",
    timestamp: "2024-01-15T13:55:20Z",
    size: "2.3 MB",
    detectionType: "aircraft",
    confidence: 0.89,
    thumbnail: "/placeholder.svg?height=120&width=160",
  },
]

export default function MediaLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCamera, setSelectedCamera] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedDetection, setSelectedDetection] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  const filteredItems = mockMediaItems.filter((item) => {
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
        return <Activity className="h-4 w-4" />
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
      default:
        return "bg-gray-500"
    }
  }

  const videoItems = sortedItems.filter((item) => item.type === "video")
  const imageItems = sortedItems.filter((item) => item.type === "image")

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Media Library</h1>
          <Badge variant="outline">{sortedItems.length} items</Badge>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Media ({sortedItems.length})</TabsTrigger>
            <TabsTrigger value="videos">Videos ({videoItems.length})</TabsTrigger>
            <TabsTrigger value="images">Images ({imageItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedItems.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videoItems.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="images" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        return <Activity className="h-4 w-4" />
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
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="overflow-hidden">
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
            <Button size="sm" variant="outline" className="flex-1">
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
