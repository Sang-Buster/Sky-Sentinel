'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Bird,
  HelpCircle,
  CheckCheck,
  Drone,
} from 'lucide-react';

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useAutoHideHeader } from '@/hooks/use-auto-hide-header';

interface Alert {
  id: string;
  type: 'detection' | 'system' | 'security' | 'weather';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  cameraId?: string;
  cameraName?: string;
  acknowledged: boolean;
  resolved: boolean;
  detectionType?: 'aircraft' | 'drone' | 'bird' | 'unknown';
  confidence?: number;
}

const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'detection',
    severity: 'high',
    title: 'Unauthorized Drone Detected',
    description: 'Small quadcopter detected in restricted airspace near East Taxiway',
    timestamp: '2024-01-15T14:35:22Z',
    cameraId: 'cam-003',
    cameraName: 'East Taxiway',
    acknowledged: false,
    resolved: false,
    detectionType: 'drone',
    confidence: 0.91,
  },
  {
    id: 'alert-002',
    type: 'system',
    severity: 'medium',
    title: 'Camera Connection Unstable',
    description: 'Intermittent connection issues with West Hangar camera',
    timestamp: '2024-01-15T14:32:15Z',
    cameraId: 'cam-004',
    cameraName: 'West Hangar',
    acknowledged: true,
    resolved: false,
  },
  {
    id: 'alert-003',
    type: 'detection',
    severity: 'low',
    title: 'Bird Activity Detected',
    description: 'Large bird flock detected near runway approach zone',
    timestamp: '2024-01-15T14:28:45Z',
    cameraId: 'cam-001',
    cameraName: 'North Perimeter',
    acknowledged: true,
    resolved: true,
    detectionType: 'bird',
    confidence: 0.78,
  },
  {
    id: 'alert-004',
    type: 'security',
    severity: 'critical',
    title: 'Perimeter Breach',
    description: 'Unidentified object detected crossing security perimeter',
    timestamp: '2024-01-15T14:25:30Z',
    cameraId: 'cam-007',
    cameraName: 'Fuel Farm',
    acknowledged: false,
    resolved: false,
    detectionType: 'unknown',
    confidence: 0.85,
  },
  {
    id: 'alert-005',
    type: 'weather',
    severity: 'medium',
    title: 'Visibility Reduced',
    description: 'Weather conditions affecting camera visibility',
    timestamp: '2024-01-15T14:20:10Z',
    acknowledged: true,
    resolved: false,
  },
];

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('active');
  const [showUnacknowledgedOnly, setShowUnacknowledgedOnly] = useState(false);
  const isHeaderVisible = useAutoHideHeader();

  useEffect(() => {
    // Simulate new alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          type: 'detection',
          severity: Math.random() > 0.7 ? 'high' : 'medium',
          title: 'New Detection Alert',
          description: 'Aircraft detected in monitoring zone',
          timestamp: new Date().toISOString(),
          cameraId: `cam-00${Math.floor(Math.random() * 8) + 1}`,
          cameraName: 'Live Camera',
          acknowledged: false,
          resolved: false,
          detectionType: 'aircraft',
          confidence: 0.85 + Math.random() * 0.15,
        };
        setAlerts((prev) => [newAlert, ...prev]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert))
    );
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, resolved: true, acknowledged: true } : alert
      )
    );
  };

  // New function to mark all alerts as resolved
  const markAllAsResolved = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, resolved: true, acknowledged: true })));
  };

  // Calculate alert counts
  const activeAlerts = alerts.filter((alert) => !alert.resolved);
  const resolvedAlerts = alerts.filter((alert) => alert.resolved);
  const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged);

  // Filter alerts based on severity, tab, and unacknowledged filter
  const getFilteredAlerts = () => {
    let filtered = alerts;

    // Filter by severity
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter((alert) => alert.severity === selectedSeverity);
    }

    // Filter by tab
    switch (activeTab) {
      case 'active':
        filtered = filtered.filter((alert) => !alert.resolved);
        // Apply unacknowledged filter only for active tab
        if (showUnacknowledgedOnly) {
          filtered = filtered.filter((alert) => !alert.acknowledged);
        }
        break;
      case 'resolved':
        filtered = filtered.filter((alert) => alert.resolved);
        break;
      case 'all':
      default:
        // Show all alerts
        break;
    }

    return filtered;
  };

  // Handle card click to set active tab and filters
  const handleFilterCardClick = (filter: string) => {
    switch (filter) {
      case 'active':
        setActiveTab('active');
        setShowUnacknowledgedOnly(false);
        break;
      case 'unacknowledged':
        setActiveTab('active');
        setShowUnacknowledgedOnly(true);
        break;
      case 'resolved':
        setActiveTab('resolved');
        setShowUnacknowledgedOnly(false);
        break;
      case 'total':
        setActiveTab('all');
        setShowUnacknowledgedOnly(false);
        break;
    }
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <SidebarInset>
      <header
        className={`fixed top-0 left-0 right-0 z-50 md:relative md:top-auto md:left-auto md:right-auto md:z-auto transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'
        } flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}
      >
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Alerts Panel</h1>
          <Badge variant="outline" className="text-red-500 border-red-500">
            {unacknowledgedAlerts.length} unread
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {activeAlerts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsResolved}
              className="flex items-center gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Mark All As Resolved</span>
              <span className="sm:hidden">Resolve All</span>
            </Button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Notifications</span>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 pt-20 md:pt-4">
        {/* Alert Statistics - Reordered: Active, Unacknowledged, Resolved, Total */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card
            className={`cursor-pointer transition-all ${
              activeTab === 'active' && !showUnacknowledgedOnly
                ? 'ring-2 ring-primary'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => handleFilterCardClick('active')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{activeAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              activeTab === 'active' && showUnacknowledgedOnly
                ? 'ring-2 ring-primary'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => handleFilterCardClick('unacknowledged')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unacknowledged</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{unacknowledgedAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Need review</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              activeTab === 'resolved' ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
            }`}
            onClick={() => handleFilterCardClick('resolved')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{resolvedAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              activeTab === 'all' ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
            }`}
            onClick={() => handleFilterCardClick('total')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.length}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert Tabs with Severity Filter */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <TabsList className="grid w-full grid-cols-3 h-auto lg:flex-1 lg:grid-cols-3">
              <TabsTrigger value="active" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                Active Alerts ({activeAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                Resolved ({resolvedAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                All Alerts ({alerts.length})
              </TabsTrigger>
            </TabsList>

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical" className="text-red-500 focus:text-red-500">
                  Critical
                </SelectItem>
                <SelectItem value="high" className="text-orange-500 focus:text-orange-500">
                  High
                </SelectItem>
                <SelectItem value="medium" className="text-yellow-500 focus:text-yellow-500">
                  Medium
                </SelectItem>
                <SelectItem value="low" className="text-blue-500 focus:text-blue-500">
                  Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="active" className="mt-6">
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <h3 className="text-lg font-medium mb-2">
                        {showUnacknowledgedOnly ? 'No Unacknowledged Alerts' : 'No Active Alerts'}
                      </h3>
                      <p className="text-muted-foreground">
                        {showUnacknowledgedOnly
                          ? 'All active alerts have been acknowledged'
                          : 'All alerts have been resolved'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={acknowledgeAlert}
                    onResolve={resolveAlert}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="mt-6">
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
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
                filteredAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={acknowledgeAlert}
                    onResolve={resolveAlert}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No Alerts Found</h3>
                      <p className="text-muted-foreground">Try changing your filters</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={acknowledgeAlert}
                    onResolve={resolveAlert}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
}

function AlertCard({
  alert,
  onAcknowledge,
  onResolve,
}: {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-400 bg-red-500/10';
      case 'high':
        return 'border-orange-400 bg-orange-500/10';
      case 'medium':
        return 'border-yellow-400 bg-yellow-500/10';
      case 'low':
        return 'border-blue-400 bg-blue-500/10';
      default:
        return 'border-gray-400 bg-gray-500/10';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 hover:bg-red-600';
      case 'high':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'detection':
        return <Eye className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      case 'security':
        return <AlertTriangle className="h-4 w-4" />;
      case 'weather':
        return <Activity className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getDetectionIcon = (type?: string) => {
    switch (type) {
      case 'aircraft':
        return <Plane className="h-4 w-4" />;
      case 'drone':
        return <Drone className="h-4 w-4" />;
      case 'bird':
        return <Bird className="h-4 w-4" />;
      case 'unknown':
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`${getSeverityColor(alert.severity)} ${alert.resolved ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              {getTypeIcon(alert.type)}
              <Badge className={`${getSeverityBadgeColor(alert.severity)} text-white text-xs`}>
                {alert.severity.toUpperCase()}
              </Badge>
            </div>
            {alert.detectionType && (
              <Badge variant="outline" className="text-xs">
                {getDetectionIcon(alert.detectionType)}
                <span className="ml-1 capitalize">{alert.detectionType}</span>
              </Badge>
            )}
            {alert.resolved && (
              <Badge className="bg-green-500 text-white text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Resolved
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-xs sm:text-sm">{new Date(alert.timestamp).toLocaleString()}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-sm sm:text-base">{alert.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
          </div>

          {alert.cameraName && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Camera:</span>
              <span className="font-medium">{alert.cameraName}</span>
              {alert.confidence && (
                <Badge variant="outline" className="text-xs">
                  {Math.round(alert.confidence * 100)}% confidence
                </Badge>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {!alert.acknowledged && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAcknowledge(alert.id)}
                className="text-xs"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Acknowledge
              </Button>
            )}
            {!alert.resolved && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onResolve(alert.id)}
                className="text-green-600 border-green-600 hover:bg-green-50 text-xs"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolve
              </Button>
            )}
            <Button size="sm" variant="outline" className="text-xs">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
