"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Database, Bell, Wifi, Activity, Save, TestTube, Trash2, Plus, Edit } from "lucide-react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

interface CameraConfig {
  id: string
  name: string
  location: string
  rtspUrl: string
  status: "online" | "offline" | "error"
  detectionEnabled: boolean
  recordingEnabled: boolean
  confidenceThreshold: number
  resolution: string
  fps: number
}

const mockCameras: CameraConfig[] = [
  {
    id: "cam-001",
    name: "North Perimeter",
    location: "Runway 09L Approach",
    rtspUrl: "rtsp://192.168.1.101:554/cam/realmonitor?channel=1&subtype=0",
    status: "online",
    detectionEnabled: true,
    recordingEnabled: true,
    confidenceThreshold: 0.8,
    resolution: "1920x1080",
    fps: 30,
  },
  {
    id: "cam-002",
    name: "South Tower",
    location: "Control Tower View",
    rtspUrl: "rtsp://192.168.1.102:554/cam/realmonitor?channel=1&subtype=0",
    status: "online",
    detectionEnabled: true,
    recordingEnabled: true,
    confidenceThreshold: 0.85,
    resolution: "1920x1080",
    fps: 25,
  },
  {
    id: "cam-003",
    name: "East Taxiway",
    location: "Taxiway Alpha",
    rtspUrl: "rtsp://192.168.1.103:554/cam/realmonitor?channel=1&subtype=0",
    status: "online",
    detectionEnabled: true,
    recordingEnabled: true,
    confidenceThreshold: 0.75,
    resolution: "1280x720",
    fps: 30,
  },
]

export default function SystemSettings() {
  const [cameras, setCameras] = useState<CameraConfig[]>(mockCameras)
  const [globalSettings, setGlobalSettings] = useState({
    detectionEnabled: true,
    recordingEnabled: true,
    alertsEnabled: true,
    autoCleanup: true,
    retentionDays: 30,
    maxStorageGB: 1000,
    adsb: {
      enabled: true,
      host: "localhost",
      port: 30003,
      range: 50,
    },
    weather: {
      enabled: true,
      station: "KJFK",
      updateInterval: 300,
    },
  })

  const updateCameraConfig = (cameraId: string, updates: Partial<CameraConfig>) => {
    setCameras((prev) => prev.map((cam) => (cam.id === cameraId ? { ...cam, ...updates } : cam)))
  }

  const testCameraConnection = (cameraId: string) => {
    // Simulate connection test
    console.log(`Testing connection for camera ${cameraId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-500 border-green-500"
      case "offline":
        return "text-gray-500 border-gray-500"
      case "error":
        return "text-red-500 border-red-500"
      default:
        return "text-gray-500 border-gray-500"
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">System Settings</h1>
          <Badge variant="outline">Configuration Panel</Badge>
        </div>
        <div className="ml-auto">
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="cameras" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="cameras">Cameras</TabsTrigger>
            <TabsTrigger value="detection">Detection</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="cameras" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Camera Configuration</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Camera
                </Button>
              </div>

              <div className="grid gap-6">
                {cameras.map((camera) => (
                  <Card key={camera.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Camera className="h-5 w-5" />
                          <div>
                            <CardTitle className="text-lg">{camera.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{camera.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(camera.status)}>
                            {camera.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`rtsp-${camera.id}`}>RTSP URL</Label>
                          <Input
                            id={`rtsp-${camera.id}`}
                            value={camera.rtspUrl}
                            onChange={(e) => updateCameraConfig(camera.id, { rtspUrl: e.target.value })}
                            className="font-mono text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`resolution-${camera.id}`}>Resolution</Label>
                          <Select
                            value={camera.resolution}
                            onValueChange={(value) => updateCameraConfig(camera.id, { resolution: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                              <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                              <SelectItem value="640x480">640x480 (SD)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`fps-${camera.id}`}>Frame Rate (FPS)</Label>
                          <Input
                            id={`fps-${camera.id}`}
                            type="number"
                            value={camera.fps}
                            onChange={(e) => updateCameraConfig(camera.id, { fps: Number.parseInt(e.target.value) })}
                            min="1"
                            max="60"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Detection Confidence</Label>
                          <div className="px-3">
                            <Slider
                              value={[camera.confidenceThreshold]}
                              onValueChange={([value]) => updateCameraConfig(camera.id, { confidenceThreshold: value })}
                              max={1}
                              min={0.1}
                              step={0.05}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>10%</span>
                              <span>{Math.round(camera.confidenceThreshold * 100)}%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`detection-${camera.id}`}>Detection</Label>
                            <Switch
                              id={`detection-${camera.id}`}
                              checked={camera.detectionEnabled}
                              onCheckedChange={(checked) =>
                                updateCameraConfig(camera.id, { detectionEnabled: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`recording-${camera.id}`}>Recording</Label>
                            <Switch
                              id={`recording-${camera.id}`}
                              checked={camera.recordingEnabled}
                              onCheckedChange={(checked) =>
                                updateCameraConfig(camera.id, { recordingEnabled: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        <Button size="sm" variant="outline" onClick={() => testCameraConnection(camera.id)}>
                          <TestTube className="h-4 w-4 mr-2" />
                          Test Connection
                        </Button>
                        <Button size="sm" variant="outline">
                          <Activity className="h-4 w-4 mr-2" />
                          View Live Feed
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="detection" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Detection Settings</h2>

              <Card>
                <CardHeader>
                  <CardTitle>Global Detection Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="global-detection">Enable Detection System</Label>
                      <p className="text-sm text-muted-foreground">Master switch for all object detection</p>
                    </div>
                    <Switch
                      id="global-detection"
                      checked={globalSettings.detectionEnabled}
                      onCheckedChange={(checked) =>
                        setGlobalSettings((prev) => ({ ...prev, detectionEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Detection Classes</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Aircraft Detection</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Drone Detection</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Bird Detection</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Vehicle Detection</Label>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Processing Settings</h3>
                      <div className="space-y-3">
                        <div>
                          <Label>Processing Interval (seconds)</Label>
                          <Input type="number" defaultValue="1" min="0.1" max="10" step="0.1" />
                        </div>
                        <div>
                          <Label>Batch Size</Label>
                          <Input type="number" defaultValue="4" min="1" max="16" />
                        </div>
                        <div>
                          <Label>Model Version</Label>
                          <Select defaultValue="yolov8n">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yolov8n">YOLOv8 Nano (Fast)</SelectItem>
                              <SelectItem value="yolov8s">YOLOv8 Small (Balanced)</SelectItem>
                              <SelectItem value="yolov8m">YOLOv8 Medium (Accurate)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="storage" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Storage Management</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Storage Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="storage-path">Storage Path</Label>
                      <Input id="storage-path" defaultValue="/mnt/nas/nvr-storage" className="font-mono" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-storage">Maximum Storage (GB)</Label>
                      <Input
                        id="max-storage"
                        type="number"
                        value={globalSettings.maxStorageGB}
                        onChange={(e) =>
                          setGlobalSettings((prev) => ({ ...prev, maxStorageGB: Number.parseInt(e.target.value) }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retention">Retention Period (Days)</Label>
                      <Input
                        id="retention"
                        type="number"
                        value={globalSettings.retentionDays}
                        onChange={(e) =>
                          setGlobalSettings((prev) => ({ ...prev, retentionDays: Number.parseInt(e.target.value) }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto Cleanup</Label>
                        <p className="text-sm text-muted-foreground">Automatically delete old files</p>
                      </div>
                      <Switch
                        checked={globalSettings.autoCleanup}
                        onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, autoCleanup: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Storage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Used Space</span>
                        <span>780 GB / 1000 GB</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "78%" }}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Video Files</div>
                        <div className="font-medium">650 GB</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Images</div>
                        <div className="font-medium">130 GB</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Total Files</div>
                        <div className="font-medium">24,567</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Oldest File</div>
                        <div className="font-medium">28 days</div>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Run Cleanup Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">External Integrations</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wifi className="h-5 w-5" />
                      ADS-B Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable ADS-B Tracking</Label>
                        <p className="text-sm text-muted-foreground">Track aircraft via ADS-B signals</p>
                      </div>
                      <Switch
                        checked={globalSettings.adsb.enabled}
                        onCheckedChange={(checked) =>
                          setGlobalSettings((prev) => ({
                            ...prev,
                            adsb: { ...prev.adsb, enabled: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adsb-host">ADS-B Host</Label>
                      <Input
                        id="adsb-host"
                        value={globalSettings.adsb.host}
                        onChange={(e) =>
                          setGlobalSettings((prev) => ({
                            ...prev,
                            adsb: { ...prev.adsb, host: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adsb-port">Port</Label>
                      <Input
                        id="adsb-port"
                        type="number"
                        value={globalSettings.adsb.port}
                        onChange={(e) =>
                          setGlobalSettings((prev) => ({
                            ...prev,
                            adsb: { ...prev.adsb, port: Number.parseInt(e.target.value) },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adsb-range">Tracking Range (km)</Label>
                      <Input
                        id="adsb-range"
                        type="number"
                        value={globalSettings.adsb.range}
                        onChange={(e) =>
                          setGlobalSettings((prev) => ({
                            ...prev,
                            adsb: { ...prev.adsb, range: Number.parseInt(e.target.value) },
                          }))
                        }
                      />
                    </div>

                    <Button className="w-full" variant="outline">
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Connection
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Weather Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Weather Data</Label>
                        <p className="text-sm text-muted-foreground">Fetch METAR weather data</p>
                      </div>
                      <Switch
                        checked={globalSettings.weather.enabled}
                        onCheckedChange={(checked) =>
                          setGlobalSettings((prev) => ({
                            ...prev,
                            weather: { ...prev.weather, enabled: checked },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weather-station">METAR Station</Label>
                      <Input
                        id="weather-station"
                        value={globalSettings.weather.station}
                        onChange={(e) =>
                          setGlobalSettings((prev) => ({
                            ...prev,
                            weather: { ...prev.weather, station: e.target.value },
                          }))
                        }
                        placeholder="KJFK"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weather-interval">Update Interval (seconds)</Label>
                      <Input
                        id="weather-interval"
                        type="number"
                        value={globalSettings.weather.updateInterval}
                        onChange={(e) =>
                          setGlobalSettings((prev) => ({
                            ...prev,
                            weather: { ...prev.weather, updateInterval: Number.parseInt(e.target.value) },
                          }))
                        }
                      />
                    </div>

                    <Button className="w-full" variant="outline">
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Weather API
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Alert Configuration</h2>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Alerts</Label>
                      <p className="text-sm text-muted-foreground">Master switch for all notifications</p>
                    </div>
                    <Switch
                      checked={globalSettings.alertsEnabled}
                      onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, alertsEnabled: checked }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Alert Types</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Detection Alerts</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>System Alerts</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Security Alerts</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Weather Alerts</Label>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Notification Methods</h3>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Notifications</Label>
                          <Input id="email" type="email" placeholder="admin@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="webhook">Webhook URL</Label>
                          <Input id="webhook" placeholder="https://hooks.slack.com/..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telegram">Telegram Bot Token</Label>
                          <Input id="telegram" placeholder="Bot token for Telegram notifications" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
