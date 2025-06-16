"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  AlertTriangle,
  Bell,
  BellOff,
  Camera,
  Plane,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
} from "lucide-react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

interface Alert {
  id: string
  type: "detection" | "system" | "security" | "weather"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  timestamp: string
  cameraId?: string
  cameraName?: string
  acknowledged: boolean
  resolved: boolean
  detectionType?: "aircraft" | "drone" | "bird" | "unknown"
  confidence?: number
}

const mockAlerts: Alert[] = [
  {
    id: "alert-001",
    type: "detection",
    severity: "high",
    title: "Unauthorized Drone Detected",
    description: "Small quadcopter detected in restricted airspace near East Taxiway",
    timestamp: "2024-01-15T14:35:22Z",
    cameraId: "cam-003",
    cameraName: "East Taxiway",
    acknowledged: false,
    resolved: false,
    detectionType: "drone",
    confidence: 0.91,
  },
  {
    id: "alert-002",
    type: "system",
    severity: "medium",
    title: "Camera Connection Unstable",
    description: "Intermittent connection issues with West Hangar camera",
    timestamp: "2024-01-15T14:32:15Z",
    cameraId: "cam-004",
    cameraName: "West Hangar",
    acknowledged: true,
    resolved: false,
  },
  {
    id: "alert-003",
    type: "detection",
    severity: "low",
    title: "Bird Activity Detected",
    description: "Large bird flock detected near runway approach zone",
    timestamp: "2024-01-15T14:28:45Z",
    cameraId: "cam-001",
    cameraName: "North Perimeter",
    acknowledged: true,
    resolved: true,
    detectionType: "bird",
    confidence: 0.78,
  },
  {
    id: "alert-004",
    type: "security",
    severity: "critical",
    title: "Perimeter Breach",
    description: "Unidentified object detected crossing security perimeter",
    timestamp: "2024-01-15T14:25:30Z",
    cameraId: "cam-007",
    cameraName: "Fuel Farm",
    acknowledged: false,
    resolved: false,
    detectionType: "unknown",
    confidence: 0.85,
  },
  {
    id: "alert-005",
    type: "weather",
    severity: "medium",
    title: "Visibility Reduced",
    description: "Weather conditions affecting camera visibility",
    timestamp: "2024-01-15T14:20:10Z",
    acknowledged: true,
    resolved: false,
  },
]

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")

  useEffect(() => {
    // Simulate new alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          type: "detection",
          severity: Math.random() > 0.7 ? "high" : "medium",
          title: "New Detection Alert",
          description: "Aircraft detected in monitoring zone",
          timestamp: new Date().toISOString(),
          cameraId: `cam-00${Math.floor(Math.random() * 8) + 1}`,
          cameraName: "Live Camera",
          acknowledged: false,
          resolved: false,
          detectionType: "aircraft",
          confidence: 0.85 + Math.random() * 0.15,
        }
        setAlerts((prev) => [newAlert, ...prev])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500 border-red-500"
      case "high":
        return "text-orange-500 border-orange-500"
      case "medium":
        return "text-yellow-500 border-yellow-500"
      case "low":
        return "text-blue-500 border-blue-500"
      default:
        return "text-gray-500 border-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "detection":
        return <Eye className="h-4 w-4" />
      case "system":
        return <Settings className="h-4 w-4" />
      case "security":
        return <AlertTriangle className="h-4 w-4" />
      case "weather":
        return <Activity className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getDetectionIcon = (type?: string) => {
    switch (type) {
      case "aircraft":
        return <Plane className="h-4 w-4" />
      case "drone":
        return <Activity className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, resolved: true, acknowledged: true } : alert)),
    )
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedSeverity === "all") return true
    return alert.severity === selectedSeverity
  })

  const activeAlerts = filteredAlerts.filter((alert) => !alert.resolved)
  const resolvedAlerts = filteredAlerts.filter((alert) => alert.resolved)
  const unacknowledgedAlerts = filteredAlerts.filter((alert) => !alert.acknowledged)

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Alerts Panel</h1>
          <Badge variant="outline" className="text-red-500 border-red-500">
            {unacknowledgedAlerts.length} unread
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Notifications</span>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4">
        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.length}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{activeAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unacknowledged</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{unacknowledgedAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Need review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{resolvedAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Alerts ({activeAlerts.length})</TabsTrigger>
            <TabsTrigger value="all">All Alerts ({alerts.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolvedAlerts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="space-y-4">
              {activeAlerts.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <h3 className="text-lg font-medium mb-2">No Active Alerts</h3>
                      <p className="text-muted-foreground">All alerts have been resolved</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                activeAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} onResolve={resolveAlert} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} onResolve={resolveAlert} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="mt-6">
            <div className="space-y-4">
              {resolvedAlerts.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No Resolved Alerts</h3>
                      <p className="text-muted-foreground">Resolved alerts will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                resolvedAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} onResolve={resolveAlert} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}

function AlertCard({
  alert,
  onAcknowledge,
  onResolve,
}: {
  alert: Alert
  onAcknowledge: (id: string) => void
  onResolve: (id: string) => void
}) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-400 bg-red-500/10"
      case "high":
        return "border-orange-400 bg-orange-500/10"
      case "medium":
        return "border-yellow-400 bg-yellow-500/10"
      case "low":
        return "border-blue-400 bg-blue-500/10"
      default:
        return "border-gray-400 bg-gray-500/10"
    }
  }

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 hover:bg-red-600"
      case "high":
        return "bg-orange-500 hover:bg-orange-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "low":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "detection":
        return <Eye className="h-4 w-4" />
      case "system":
        return <Settings className="h-4 w-4" />
      case "security":
        return <AlertTriangle className="h-4 w-4" />
      case "weather":
        return <Activity className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getDetectionIcon = (type?: string) => {
    switch (type) {
      case "aircraft":
        return <Plane className="h-4 w-4" />
      case "drone":
        return <Activity className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <Card className={`${getSeverityColor(alert.severity)} ${alert.resolved ? "opacity-60" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {getTypeIcon(alert.type)}
              <Badge className={`${getSeverityBadgeColor(alert.severity)} text-white`}>
                {alert.severity.toUpperCase()}
              </Badge>
            </div>
            {alert.detectionType && (
              <Badge variant="outline">
                {getDetectionIcon(alert.detectionType)}
                <span className="ml-1 capitalize">{alert.detectionType}</span>
              </Badge>
            )}
            {alert.resolved && (
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Resolved
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {new Date(alert.timestamp).toLocaleString()}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div>
            <h3 className="font-medium">{alert.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
          </div>

          {alert.cameraName && (
            <div className="flex items-center gap-2 text-sm">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Camera:</span>
              <span className="font-medium">{alert.cameraName}</span>
              {alert.confidence && (
                <Badge variant="outline" className="ml-2">
                  {Math.round(alert.confidence * 100)}% confidence
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            {!alert.acknowledged && (
              <Button size="sm" variant="outline" onClick={() => onAcknowledge(alert.id)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Acknowledge
              </Button>
            )}
            {!alert.resolved && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onResolve(alert.id)}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolve
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
