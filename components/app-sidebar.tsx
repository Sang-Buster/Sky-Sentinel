'use client';
import {
  AlertTriangle,
  Camera,
  Database,
  Home,
  Search,
  Settings,
  Video,
  BarChart3,
  Cpu,
  MemoryStick,
  Wifi,
  Clock,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    title: 'Live Dashboard',
    url: '/',
    icon: Home,
    description: 'Real-time camera feeds and detections',
  },
  {
    title: 'Media Library',
    url: '/media',
    icon: Video,
    description: 'Browse recorded clips and snapshots',
  },
  {
    title: 'Analytics Hub',
    url: '/analytics',
    icon: BarChart3,
    description: 'ADS-B tracking and weather data',
  },
  {
    title: 'AI Search',
    url: '/search',
    icon: Search,
    description: 'Semantic object search and queries',
  },
  {
    title: 'Alerts Panel',
    url: '/alerts',
    icon: AlertTriangle,
    description: 'Real-time notifications and events',
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
    description: 'System configuration',
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [systemStats, setSystemStats] = useState({
    storageUsed: 78,
    activeCameras: 7,
    totalCameras: 8,
    cpuUsage: 23,
    memoryUsed: 4.2,
    memoryTotal: 8,
    networkSpeed: 1.2,
    uptimeDays: 15,
    uptimeHours: 4,
  });

  // Simulate dynamic updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats((prev) => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 40) + 15, // 15-55%
        memoryUsed: Math.round((Math.random() * 2 + 3.5) * 10) / 10, // 3.5-5.5 GB
        networkSpeed: Math.round((Math.random() * 0.8 + 0.8) * 10) / 10, // 0.8-1.6 Gbps
        activeCameras: Math.floor(Math.random() * 2) + 7, // 7-8
        storageUsed: Math.floor(Math.random() * 5) + 76, // 76-80%
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (type: string, value: number) => {
    switch (type) {
      case 'storage':
        if (value > 90) {
          return 'text-red-500'; // Critical: > 90% used
        } else if (value > 70) {
          return 'text-yellow-500'; // Warning: 70-90% used
        } else {
          return 'text-green-500'; // Good: < 70% used
        }
      case 'cameras':
        if (value === systemStats.totalCameras) {
          return 'text-green-500'; // All cameras online
        } else if (value <= Math.floor(systemStats.totalCameras / 2)) {
          return 'text-red-500'; // Half or fewer cameras online
        } else {
          return 'text-yellow-500'; // More than half but not all cameras online
        }
      case 'cpu':
        if (value > 80) {
          return 'text-red-500'; // Critical: > 80% usage
        } else if (value > 50) {
          return 'text-yellow-500'; // Warning: 50-80% usage
        } else {
          return 'text-green-500'; // Good: < 50% usage
        }
      case 'memory':
        const memoryPercent = (value / systemStats.memoryTotal) * 100;
        if (memoryPercent > 85) {
          return 'text-red-500'; // Critical: > 85% usage
        } else if (memoryPercent > 70) {
          return 'text-yellow-500'; // Warning: 70-85% usage
        } else {
          return 'text-green-500'; // Good: < 70% usage
        }
      case 'network':
        if (value < 0.5) {
          return 'text-red-500'; // Poor: < 0.5 Gbps
        } else if (value < 1.0) {
          return 'text-yellow-500'; // Okay: 0.5-1.0 Gbps
        } else {
          return 'text-green-500'; // Good: > 1.0 Gbps
        }
      case 'uptime':
        return 'text';
      default:
        return 'text-muted-foreground';
    }
  };

  const statusItems = [
    {
      title: 'Storage',
      icon: Database,
      status: `${systemStats.storageUsed}% Used`,
      color: getStatusColor('storage', systemStats.storageUsed),
    },
    {
      title: 'Active Cameras',
      icon: Camera,
      status: `${systemStats.activeCameras}/${systemStats.totalCameras}`,
      color: getStatusColor('cameras', systemStats.activeCameras),
    },
  ];

  const additionalStatusItems = [
    {
      title: 'CPU Usage',
      icon: Cpu,
      value: `${systemStats.cpuUsage}%`,
      color: getStatusColor('cpu', systemStats.cpuUsage),
    },
    {
      title: 'Memory',
      icon: MemoryStick,
      value: `${systemStats.memoryUsed}/${systemStats.memoryTotal} GB`,
      color: getStatusColor('memory', systemStats.memoryUsed),
    },
    {
      title: 'Network',
      icon: Wifi,
      value: `${systemStats.networkSpeed} Gbps`,
      color: getStatusColor('network', systemStats.networkSpeed),
    },
    {
      title: 'Uptime',
      icon: Clock,
      value: `${systemStats.uptimeDays}d ${systemStats.uptimeHours}h`,
      color: getStatusColor('uptime', 0),
    },
  ];

  return (
    <Sidebar variant="inset" className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.svg" alt="Sky Sentinel Logo" className="h-8 w-8" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Sky Sentinel</span>
            <span className="text-xs text-muted-foreground">NVR Surveillance System</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.description}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System Status</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {statusItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.title}</span>
                    <span className={`text-xs ${item.color}`}>{item.status}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {additionalStatusItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate text-sm">{item.title}</span>
                    <span className={`text-xs ${item.color}`}>{item.value}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="text-xs text-muted-foreground">
          <div>Last Update: {new Date().toLocaleTimeString()}</div>
          <div className="mt-1">Version 2.1.0</div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
