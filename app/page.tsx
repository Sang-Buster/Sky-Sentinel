'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Camera,
  Crosshair,
  AlertTriangle,
  Play,
  Pause,
  Maximize,
  Plane,
  Cloud,
  ArrowRight,
  Video,
  ImageIcon,
  Bird,
  HelpCircle,
  Clock,
  Drone,
} from 'lucide-react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { useCameraStore } from '@/lib/camera-store';

interface Detection {
  id: string;
  cameraId: string;
  type: 'aircraft' | 'drone' | 'bird' | 'unknown';
  confidence: number;
  timestamp: string;
  bbox: { x: number; y: number; width: number; height: number };
}

const mockDetections: Detection[] = [
  {
    id: 'det-001',
    cameraId: 'cam-001',
    type: 'aircraft',
    confidence: 0.94,
    timestamp: '2024-01-15T14:32:15Z',
    bbox: { x: 120, y: 80, width: 200, height: 120 },
  },
  {
    id: 'det-002',
    cameraId: 'cam-003',
    type: 'drone',
    confidence: 0.87,
    timestamp: '2024-01-15T14:31:45Z',
    bbox: { x: 300, y: 150, width: 60, height: 40 },
  },
  {
    id: 'det-003',
    cameraId: 'cam-002',
    type: 'aircraft',
    confidence: 0.96,
    timestamp: '2024-01-15T14:28:30Z',
    bbox: { x: 80, y: 120, width: 180, height: 100 },
  },
  {
    id: 'det-004',
    cameraId: 'cam-005',
    type: 'drone',
    confidence: 0.91,
    timestamp: '2024-01-15T14:25:12Z',
    bbox: { x: 250, y: 180, width: 50, height: 35 },
  },
  {
    id: 'det-005',
    cameraId: 'cam-004',
    type: 'bird',
    confidence: 0.73,
    timestamp: '2024-01-15T14:22:08Z',
    bbox: { x: 400, y: 200, width: 30, height: 25 },
  },
  {
    id: 'det-006',
    cameraId: 'cam-006',
    type: 'aircraft',
    confidence: 0.89,
    timestamp: '2024-01-15T14:18:45Z',
    bbox: { x: 150, y: 90, width: 220, height: 130 },
  },
  {
    id: 'det-007',
    cameraId: 'cam-007',
    type: 'unknown',
    confidence: 0.65,
    timestamp: '2024-01-15T14:15:22Z',
    bbox: { x: 320, y: 160, width: 40, height: 30 },
  },
  {
    id: 'det-008',
    cameraId: 'cam-008',
    type: 'drone',
    confidence: 0.82,
    timestamp: '2024-01-15T14:12:33Z',
    bbox: { x: 180, y: 140, width: 55, height: 38 },
  },
];

export default function Dashboard() {
  const { cameras } = useCameraStore();
  const [recentDetections, setRecentDetections] = useState<Detection[]>(mockDetections);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Simulate real-time updates for camera status and detections
    const interval = setInterval(() => {
      // Update detection timestamps randomly
      if (Math.random() > 0.7) {
        const randomCameraId = cameras[Math.floor(Math.random() * cameras.length)]?.id;
        if (randomCameraId) {
          const detectionTypes = ['aircraft', 'drone', 'bird', 'unknown'] as const;
          const newDetection: Detection = {
            id: `det-${Date.now()}`,
            cameraId: randomCameraId,
            type: detectionTypes[Math.floor(Math.random() * detectionTypes.length)],
            confidence: Math.random() * 0.4 + 0.6, // 60-100%
            timestamp: new Date().toISOString(),
            bbox: {
              x: Math.random() * 400,
              y: Math.random() * 300,
              width: 50 + Math.random() * 100,
              height: 30 + Math.random() * 80,
            },
          };
          setRecentDetections((prev) => [newDetection, ...prev.slice(0, 19)]); // Keep last 20
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [cameras]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recording':
        return 'bg-red-500 shadow-red-500/20 shadow-lg';
      case 'online':
        return 'bg-green-500 shadow-green-500/20 shadow-lg';
      case 'offline':
        return 'bg-gray-500 shadow-gray-500/20 shadow-lg';
      default:
        return 'bg-gray-500 shadow-gray-500/20 shadow-lg';
    }
  };

  const getDetectionIcon = (type: string) => {
    switch (type) {
      case 'aircraft':
        return <Plane className="h-3 w-3" />;
      case 'drone':
        return <Drone className="h-3 w-3" />;
      case 'bird':
        return <Bird className="h-3 w-3" />;
      case 'unknown':
        return <HelpCircle className="h-3 w-3" />;
      default:
        return <AlertTriangle className="h-3 w-3" />;
    }
  };

  const togglePlayback = (cameraId: string) => {
    setIsPlaying((prev) => ({ ...prev, [cameraId]: !prev[cameraId] }));
  };

  const handleFullscreen = (cameraId: string) => {
    console.log(`Opening fullscreen view for camera ${cameraId}`);
  };

  const getLastDetectionForCamera = (cameraId: string) => {
    return recentDetections.find((det) => det.cameraId === cameraId);
  };

  const getTimeSince = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  // Sort detections by timestamp (most recent first) and show top 6
  const sortedRecentDetections = recentDetections
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

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
          <div className="hidden sm:flex items-center gap-2">
            <Crosshair className="h-4 w-4" />
            <span>{recentDetections.length} detections today</span>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            <span className="hidden sm:inline">METAR:</span> Clear, 10kt winds
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4">
        {/* Camera Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {cameras.map((camera) => {
            const lastDetection = getLastDetectionForCamera(camera.id);
            return (
              <Card
                key={camera.id}
                className="relative overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{camera.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)}`} />
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
                          {camera.rtspUrl.split('@')[1]?.split(':')[0] || 'Loading...'}
                        </p>
                      </div>
                    </div>

                    {/* Detection Overlay */}
                    {lastDetection && (
                      <div
                        className="absolute border-2 border-red-500 bg-red-500/20"
                        style={{
                          left: `${(lastDetection.bbox.x / 640) * 100}%`,
                          top: `${(lastDetection.bbox.y / 480) * 100}%`,
                          width: `${(lastDetection.bbox.width / 640) * 100}%`,
                          height: `${(lastDetection.bbox.height / 480) * 100}%`,
                        }}
                      >
                        <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-1 rounded">
                          {lastDetection.type} {Math.round(lastDetection.confidence * 100)}%
                        </div>
                      </div>
                    )}

                    {/* Video Controls */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-6 w-6 p-0"
                          onClick={() => togglePlayback(camera.id)}
                        >
                          {isPlaying[camera.id] ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-6 w-6 p-0"
                        onClick={() => handleFullscreen(camera.id)}
                      >
                        <Maximize className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 border-t border-border/20">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-muted-foreground">
                          Last:{' '}
                          {lastDetection
                            ? getTimeSince(lastDetection.timestamp)
                            : 'No recent activity'}
                        </span>
                        {lastDetection && (
                          <div className="flex items-center ml-2">
                            {getDetectionIcon(lastDetection.type)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href="/media">
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                            <ImageIcon className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Link href="/media">
                          <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                            <Video className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Detections */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Detections
              </CardTitle>
              <Link href="/media">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  View More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedRecentDetections.map((detection) => {
                const camera = cameras.find((c) => c.id === detection.cameraId);
                return (
                  <div
                    key={detection.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-border/20 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3 sm:mb-0">
                      <div className="flex items-center gap-2">
                        {getDetectionIcon(detection.type)}
                        <span className="font-medium capitalize">{detection.type}</span>
                      </div>
                      <Badge variant="outline">
                        {Math.round(detection.confidence * 100)}% confidence
                      </Badge>
                      <span className="text-sm text-muted-foreground hidden sm:inline">
                        {camera?.name} • {getTimeSince(detection.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href="/media">
                        <Button size="sm" variant="outline">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Snapshots
                        </Button>
                      </Link>
                      <Link href="/media">
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4 mr-2" />
                          Video Clip
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
