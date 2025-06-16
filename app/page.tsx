"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Activity, AlertTriangle, Play, Pause, Maximize, Volume2, VolumeX, Plane, Cloud } from "lucide-react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

interface CameraFeed {
  id: string
  name: string
  location: string
  status: "online" | "offline" | "recording"
  detections: number
  lastDetection?: string
  rtspUrl: string
}

interface Detection {
  id: string
  cameraId: string
  type: "aircraft" | "drone" | "bird" | "unknown"
  confidence: number
  timestamp: string
  bbox: { x: number; y: number; width: number; height: number }
}

const mockCameras: CameraFeed[] = [
  {
    id: "cam-001",
    name: "North Perimeter",
    location: "Runway 09L Approach",
    status: "recording",
    detections: 12,
    lastDetection: "2 min ago",
    rtspUrl: "rtsp://192.168.1.101:554/cam/realmonitor?channel=1&subtype=0",
  },
  {
    id: "cam-002",
    name: "South Tower",
    location: "Control Tower View",
    status: "online",
    detections: 8,
    lastDetection: "5 min ago",
    rtspUrl: "rtsp://192.168.1.102:554/cam/realmonitor?channel=1&subtype=0",
  },
  {
    id: "cam-003",
    name: "East Taxiway",
    location: "Taxiway Alpha",
    status: "recording",
    detections: 15,
    lastDetection: "1 min ago",
    rtspUrl: "rtsp://192.168.1.103:554/cam/realmonitor?channel=1&subtype=0",
  },
  {
    id: "cam-004",
    name: "West Hangar",
    location: "Maintenance Area",
    status: "online",
    detections: 3,
    lastDetection: "12 min ago",
    rtspUrl: "rtsp://192.168.1.104:554/cam/realmonitor?channel=1&subtype=0",
  },
  {
    id: "cam-005",
    name: "Cargo Ramp",
    location: "Freight Terminal",
    status: "recording",
    detections: 7,
    lastDetection: "3 min ago",
    rtspUrl: "rtsp://192.168.1.105:554/cam/realmonitor?channel=1&subtype=0",
  },
  {
    id: "cam-006",
    name: "Terminal Gate",
    location: "Passenger Gates 1-5",
    status: "online",
    detections: 4,
    lastDetection: "8 min ago",
    rtspUrl: "rtsp://192.168.1.106:554/cam/realmonitor?channel=1&subtype=0",
  },
  {
    id: "cam-007",
    name: "Fuel Farm",
    location: "Aviation Fuel Storage",
    status: "recording",
    detections: 2,
    lastDetection: "15 min ago",
    rtspUrl: "rtsp://192.168.1.107:554/cam/realmonitor?channel=1&subtype=0",
  },
  {
    id: "cam-008",
    name: "Emergency Access",
    location: "ARFF Station",
    status: "online",
    detections: 1,
    lastDetection: "22 min ago",
    rtspUrl: "rtsp://192.168.1.108:554/cam/realmonitor?channel=1&subtype=0",
  },
]

const mockDetections: Detection[] = [
  {
    id: "det-001",
    cameraId: "cam-001",
    type: "aircraft",
    confidence: 0.94,
    timestamp: "2024-01-15T14:32:15Z",
    bbox: { x: 120, y: 80, width: 200, height: 120 },
  },
  {
    id: "det-002",
    cameraId: "cam-003",
    type: "drone",
    confidence: 0.87,
    timestamp: "2024-01-15T14:31:45Z",
    bbox: { x: 300, y: 150, width: 60, height: 40 },
  },
]

export default function Dashboard() {
  const [cameras, setCameras] = useState<CameraFeed[]>(mockCameras)
  const [recentDetections, setRecentDetections] = useState<Detection[]>(mockDetections)
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({})
  const [isMuted, setIsMuted] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setCameras((prev) =>
        prev.map((cam) => ({
          ...cam,
          detections: cam.detections + Math.floor(Math.random() * 2),
          lastDetection: Math.random() > 0.7 ? "Just now" : cam.lastDetection,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recording":
        return "bg-red-500 shadow-red-500/20 shadow-lg"
      case "online":
        return "bg-green-500 shadow-green-500/20 shadow-lg"
      case "offline":
        return "bg-gray-500 shadow-gray-500/20 shadow-lg"
      default:
        return "bg-gray-500 shadow-gray-500/20 shadow-lg"
    }
  }

  const getDetectionIcon = (type: string) => {
    switch (type) {
      case "aircraft":
        return <Plane className="h-4 w-4" />
      case "drone":
        return <Activity className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const togglePlayback = (cameraId: string) => {
    setIsPlaying((prev) => ({ ...prev, [cameraId]: !prev[cameraId] }))
  }

  const toggleMute = (cameraId: string) => {
    setIsMuted((prev) => ({ ...prev, [cameraId]: !prev[cameraId] }))
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Live Dashboard</h1>
          <Badge variant="outline" className="text-green-500 border-green-500">
            All Systems Operational
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>54 detections today</span>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            <span>METAR: Clear, 10kt winds</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4">
        {/* Camera Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {cameras.map((camera) => (
            <Card
              key={camera.id}
              className="relative overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{camera.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)}`} />
                    <Badge
                      variant="secondary"
                      className="text-xs font-semibold bg-primary/10 text-primary border-primary/20"
                    >
                      {camera.detections}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{camera.location}</p>
              </CardHeader>

              <CardContent className="p-0">
                {/* Video Feed Placeholder */}
                <div className="relative aspect-video bg-black/20 border border-border/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">RTSP Feed</p>
                      <p className="text-xs text-muted-foreground">
                        {camera.rtspUrl.split("@")[1]?.split(":")[0] || "Loading..."}
                      </p>
                    </div>
                  </div>

                  {/* Detection Overlay */}
                  {recentDetections
                    .filter((det) => det.cameraId === camera.id)
                    .map((detection) => (
                      <div
                        key={detection.id}
                        className="absolute border-2 border-red-500 bg-red-500/20"
                        style={{
                          left: `${(detection.bbox.x / 640) * 100}%`,
                          top: `${(detection.bbox.y / 480) * 100}%`,
                          width: `${(detection.bbox.width / 640) * 100}%`,
                          height: `${(detection.bbox.height / 480) * 100}%`,
                        }}
                      >
                        <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-1 rounded">
                          {detection.type} {Math.round(detection.confidence * 100)}%
                        </div>
                      </div>
                    ))}

                  {/* Video Controls */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-6 w-6 p-0"
                        onClick={() => togglePlayback(camera.id)}
                      >
                        {isPlaying[camera.id] ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleMute(camera.id)}
                      >
                        {isMuted[camera.id] ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-6 w-6 p-0"
                      onClick={() => setSelectedCamera(camera.id)}
                    >
                      <Maximize className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="p-3 border-t border-border/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Last: {camera.lastDetection || "No recent activity"}</span>
                    <Badge variant={camera.status === "recording" ? "destructive" : "secondary"}>{camera.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Detections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Detections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDetections.map((detection) => {
                const camera = cameras.find((c) => c.id === detection.cameraId)
                return (
                  <div
                    key={detection.id}
                    className="flex items-center justify-between p-3 border border-border/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getDetectionIcon(detection.type)}
                        <span className="font-medium capitalize">{detection.type}</span>
                      </div>
                      <Badge variant="outline">{Math.round(detection.confidence * 100)}% confidence</Badge>
                      <span className="text-sm text-muted-foreground">
                        {camera?.name} • {new Date(detection.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      View Clip
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
