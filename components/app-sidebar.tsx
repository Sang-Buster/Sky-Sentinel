"use client"
import { Activity, AlertTriangle, Camera, Database, Home, Search, Settings, Video, BarChart3 } from "lucide-react"

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
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Live Dashboard",
    url: "/",
    icon: Home,
    description: "Real-time camera feeds and detections",
  },
  {
    title: "Media Library",
    url: "/media",
    icon: Video,
    description: "Browse recorded clips and snapshots",
  },
  {
    title: "Analytics Hub",
    url: "/analytics",
    icon: BarChart3,
    description: "ADS-B tracking and weather data",
  },
  {
    title: "AI Search",
    url: "/search",
    icon: Search,
    description: "Semantic object search and queries",
  },
  {
    title: "Alerts",
    url: "/alerts",
    icon: AlertTriangle,
    description: "Real-time notifications and events",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "System configuration",
  },
]

const statusItems = [
  {
    title: "System Status",
    icon: Activity,
    status: "Online",
    color: "text-green-500",
  },
  {
    title: "Storage",
    icon: Database,
    status: "78% Used",
    color: "text-yellow-500",
  },
  {
    title: "Active Cameras",
    icon: Camera,
    status: "8/8",
    color: "text-green-500",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Camera className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">NVR System</span>
            <span className="text-xs text-muted-foreground">Surveillance Hub</span>
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
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.description}>
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
  )
}
