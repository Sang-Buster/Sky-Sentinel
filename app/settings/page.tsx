'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Camera,
  Database,
  Bell,
  Wifi,
  Activity,
  Save,
  TestTube,
  Trash2,
  Plus,
  Edit,
} from 'lucide-react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useAutoHideHeader } from '@/hooks/use-auto-hide-header';
import { useCameraStore } from '@/lib/camera-store';

export default function SystemSettings() {
  const { cameras, addCamera, updateCamera, removeCamera, saveChanges } = useCameraStore();
  const [isAddCameraOpen, setIsAddCameraOpen] = useState(false);
  const [newCamera, setNewCamera] = useState({
    name: '',
    location: '',
    rtspUrl: '',
    resolution: '1920x1080',
    fps: 30,
  });
  const [globalSettings, setGlobalSettings] = useState({
    detectionEnabled: true,
    recordingEnabled: true,
    alertsEnabled: true,
    autoCleanup: true,
    retentionDays: 30,
    maxStorageGB: 1000,
    adsb: {
      enabled: true,
      host: 'localhost',
      port: 30003,
      range: 50,
    },
    weather: {
      enabled: true,
      station: 'KJFK',
      updateInterval: 300,
    },
  });
  const isHeaderVisible = useAutoHideHeader();

  const testCameraConnection = (cameraId: string) => {
    console.log(`Testing connection for camera ${cameraId}`);
  };

  const handleAddCamera = () => {
    if (!newCamera.name || !newCamera.location || !newCamera.rtspUrl) {
      return;
    }

    addCamera({
      name: newCamera.name,
      location: newCamera.location,
      rtspUrl: newCamera.rtspUrl,
      status: 'offline',
      detectionEnabled: true,
      recordingEnabled: true,
      confidenceThreshold: 0.8,
      resolution: newCamera.resolution,
      fps: newCamera.fps,
    });

    setNewCamera({
      name: '',
      location: '',
      rtspUrl: '',
      resolution: '1920x1080',
      fps: 30,
    });
    setIsAddCameraOpen(false);
  };

  const handleRemoveCamera = (cameraId: string) => {
    removeCamera(cameraId);
  };

  const handleSaveChanges = () => {
    saveChanges();
    // Show success message or toast
    console.log('All changes saved successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-400 border-green-400 bg-green-500/10';
      case 'offline':
        return 'text-gray-400 border-gray-400 bg-gray-500/10';
      case 'error':
        return 'text-red-400 border-red-400 bg-red-500/10';
      default:
        return 'text-gray-400 border-gray-400 bg-gray-500/10';
    }
  };

  return (
    <SidebarInset>
      <header
        className={`fixed top-0 left-0 right-0 z-50 md:relative md:top-auto md:left-auto md:right-auto md:z-auto transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'
        } flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}
      >
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">System Settings</h1>
          <Badge variant="outline">Configuration Panel</Badge>
        </div>
        <div className="ml-auto">
          <Button size="sm" onClick={handleSaveChanges}>
            <Save className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Save All Changes</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 pt-20 md:pt-4">
        <Tabs defaultValue="cameras" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
            <TabsTrigger value="cameras" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Cameras
            </TabsTrigger>
            <TabsTrigger value="detection" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Detection
            </TabsTrigger>
            <TabsTrigger value="storage" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Storage
            </TabsTrigger>
            <TabsTrigger value="integrations" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Integrations
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cameras" className="mt-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold">
                  Camera Configuration ({cameras.length} cameras)
                </h2>
                <Dialog open={isAddCameraOpen} onOpenChange={setIsAddCameraOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Camera
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Camera</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="camera-name">Camera Name</Label>
                        <Input
                          id="camera-name"
                          value={newCamera.name}
                          onChange={(e) =>
                            setNewCamera((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="e.g., Main Entrance"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="camera-location">Location</Label>
                        <Input
                          id="camera-location"
                          value={newCamera.location}
                          onChange={(e) =>
                            setNewCamera((prev) => ({ ...prev, location: e.target.value }))
                          }
                          placeholder="e.g., Building A Entrance"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="camera-rtsp">RTSP URL</Label>
                        <Input
                          id="camera-rtsp"
                          value={newCamera.rtspUrl}
                          onChange={(e) =>
                            setNewCamera((prev) => ({ ...prev, rtspUrl: e.target.value }))
                          }
                          placeholder="rtsp://192.168.1.100:554/cam/realmonitor"
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="camera-resolution">Resolution</Label>
                          <Select
                            value={newCamera.resolution}
                            onValueChange={(value) =>
                              setNewCamera((prev) => ({ ...prev, resolution: value }))
                            }
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
                        <div className="space-y-2">
                          <Label htmlFor="camera-fps">Frame Rate (FPS)</Label>
                          <Input
                            id="camera-fps"
                            type="number"
                            value={newCamera.fps}
                            onChange={(e) =>
                              setNewCamera((prev) => ({
                                ...prev,
                                fps: Number.parseInt(e.target.value),
                              }))
                            }
                            min="1"
                            max="60"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddCameraOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddCamera}>Add Camera</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-6">
                {cameras.map((camera) => (
                  <Card
                    key={camera.id}
                    className="border-border/50 hover:border-border/70 transition-all duration-200"
                  >
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                            onChange={(e) => updateCamera(camera.id, { rtspUrl: e.target.value })}
                            className="font-mono text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`resolution-${camera.id}`}>Resolution</Label>
                          <Select
                            value={camera.resolution}
                            onValueChange={(value) =>
                              updateCamera(camera.id, { resolution: value })
                            }
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
                            onChange={(e) =>
                              updateCamera(camera.id, { fps: Number.parseInt(e.target.value) })
                            }
                            min="1"
                            max="60"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Detection Confidence</Label>
                          <div className="px-3">
                            <Slider
                              value={[camera.confidenceThreshold]}
                              onValueChange={([value]) =>
                                updateCamera(camera.id, { confidenceThreshold: value })
                              }
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
                                updateCamera(camera.id, { detectionEnabled: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`recording-${camera.id}`}>Recording</Label>
                            <Switch
                              id={`recording-${camera.id}`}
                              checked={camera.recordingEnabled}
                              onCheckedChange={(checked) =>
                                updateCamera(camera.id, { recordingEnabled: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testCameraConnection(camera.id)}
                          className="hover:text-white transition-colors"
                        >
                          <TestTube className="h-4 w-4 mr-2" />
                          Test Connection
                        </Button>
                        <Button size="sm" variant="outline">
                          <Activity className="h-4 w-4 mr-2" />
                          View Live Feed
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Camera</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove "{camera.name}"? This action cannot
                                be undone and will remove all associated recordings and settings.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveCamera(camera.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Remove Camera
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
                      <p className="text-sm text-muted-foreground">
                        Master switch for all object detection
                      </p>
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
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Processing Interval (seconds)</Label>
                            <Input type="number" defaultValue="1" min="0.1" max="10" step="0.1" />
                          </div>
                          <div>
                            <Label>Batch Size</Label>
                            <Input type="number" defaultValue="4" min="1" max="16" />
                          </div>
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
                      <Input
                        id="storage-path"
                        defaultValue="/mnt/nas/nvr-storage"
                        className="font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-storage">Maximum Storage (GB)</Label>
                      <Input
                        id="max-storage"
                        type="number"
                        value={globalSettings.maxStorageGB}
                        onChange={(e) =>
                          setGlobalSettings((prev) => ({
                            ...prev,
                            maxStorageGB: Number.parseInt(e.target.value),
                          }))
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
                          setGlobalSettings((prev) => ({
                            ...prev,
                            retentionDays: Number.parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto Cleanup</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically delete old files
                        </p>
                      </div>
                      <Switch
                        checked={globalSettings.autoCleanup}
                        onCheckedChange={(checked) =>
                          setGlobalSettings((prev) => ({ ...prev, autoCleanup: checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>NAS Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Used Space</span>
                        <span>780 GB / 1000 GB</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
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
                        <div className="text-muted-foreground">CPU Usage</div>
                        <div className="font-medium">23%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Memory Usage</div>
                        <div className="font-medium">4.2 GB / 8 GB</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Temperature</div>
                        <div className="font-medium">42°C</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Uptime</div>
                        <div className="font-medium">15 days</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Total Files</div>
                        <div className="font-medium">24,567</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Last Boot</div>
                        <div className="font-medium">Jan 1, 2024</div>
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
                        <p className="text-sm text-muted-foreground">
                          Track aircraft via ADS-B signals
                        </p>
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

                    <div className="grid grid-cols-2 gap-4">
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
                            weather: {
                              ...prev.weather,
                              updateInterval: Number.parseInt(e.target.value),
                            },
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
                      <p className="text-sm text-muted-foreground">
                        Master switch for all notifications
                      </p>
                    </div>
                    <Switch
                      checked={globalSettings.alertsEnabled}
                      onCheckedChange={(checked) =>
                        setGlobalSettings((prev) => ({ ...prev, alertsEnabled: checked }))
                      }
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
  );
}
