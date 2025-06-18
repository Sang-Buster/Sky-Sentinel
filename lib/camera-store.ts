import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Camera {
  id: string
  name: string
  location: string
  rtspUrl: string
  status: "online" | "offline" | "recording" | "error"
  detectionEnabled: boolean
  recordingEnabled: boolean
  confidenceThreshold: number
  resolution: string
  fps: number
}

interface CameraStore {
  cameras: Camera[]
  addCamera: (camera: Omit<Camera, "id">) => void
  updateCamera: (id: string, updates: Partial<Camera>) => void
  removeCamera: (id: string) => void
  saveChanges: () => void
}

const initialCameras: Camera[] = [
  {
    id: "cam-001",
    name: "North Tower",
    location: "Terminal Building North",
    rtspUrl: "rtsp://admin:password@192.168.1.101:554/cam/realmonitor",
    status: "recording",
    detectionEnabled: true,
    recordingEnabled: true,
    confidenceThreshold: 0.8,
    resolution: "1920x1080",
    fps: 30,
  },
  {
    id: "cam-002",
    name: "South Perimeter",
    location: "Runway 09L/27R South",
    rtspUrl: "rtsp://admin:password@192.168.1.102:554/cam/realmonitor",
    status: "online",
    detectionEnabled: true,
    recordingEnabled: true,
    confidenceThreshold: 0.75,
    resolution: "1920x1080",
    fps: 25,
  },
  {
    id: "cam-003",
    name: "East Taxiway",
    location: "Taxiway Alpha East",
    rtspUrl: "rtsp://admin:password@192.168.1.103:554/cam/realmonitor",
    status: "recording",
    detectionEnabled: true,
    recordingEnabled: true,
    confidenceThreshold: 0.85,
    resolution: "1280x720",
    fps: 30,
  },
  {
    id: "cam-004",
    name: "West Approach",
    location: "Runway 09R/27L West",
    rtspUrl: "rtsp://admin:password@192.168.1.104:554/cam/realmonitor",
    status: "online",
    detectionEnabled: true,
    recordingEnabled: false,
    confidenceThreshold: 0.8,
    resolution: "1920x1080",
    fps: 30,
  },
  {
    id: "cam-005",
    name: "Control Tower",
    location: "Air Traffic Control Tower",
    rtspUrl: "rtsp://admin:password@192.168.1.105:554/cam/realmonitor",
    status: "recording",
    detectionEnabled: true,
    recordingEnabled: true,
    confidenceThreshold: 0.9,
    resolution: "1920x1080",
    fps: 30,
  },
  {
    id: "cam-006",
    name: "Maintenance Hangar",
    location: "Hangar Complex B",
    rtspUrl: "rtsp://admin:password@192.168.1.106:554/cam/realmonitor",
    status: "online",
    detectionEnabled: true,
    recordingEnabled: true,
    confidenceThreshold: 0.7,
    resolution: "1280x720",
    fps: 25,
  },
  {
    id: "cam-007",
    name: "Cargo Terminal",
    location: "Cargo Loading Area",
    rtspUrl: "rtsp://admin:password@192.168.1.107:554/cam/realmonitor",
    status: "recording",
    detectionEnabled: true,
    recordingEnabled: true,
    confidenceThreshold: 0.8,
    resolution: "1920x1080",
    fps: 30,
  },
  {
    id: "cam-008",
    name: "Emergency Services",
    location: "Fire Station Access Road",
    rtspUrl: "rtsp://admin:password@192.168.1.108:554/cam/realmonitor",
    status: "online",
    detectionEnabled: true,
    recordingEnabled: true,
    confidenceThreshold: 0.85,
    resolution: "1920x1080",
    fps: 30,
  },
]

export const useCameraStore = create<CameraStore>()(
  persist(
    (set, get) => ({
      cameras: initialCameras,
      addCamera: (camera) =>
        set((state) => ({
          cameras: [
            ...state.cameras,
            {
              ...camera,
              id: `cam-${Date.now().toString().slice(-6)}`,
            },
          ],
        })),
      updateCamera: (id, updates) =>
        set((state) => ({
          cameras: state.cameras.map((camera) => (camera.id === id ? { ...camera, ...updates } : camera)),
        })),
      removeCamera: (id) =>
        set((state) => ({
          cameras: state.cameras.filter((camera) => camera.id !== id),
        })),
      saveChanges: () => {
        // In a real app, this would sync with the backend
        console.log("Saving camera configuration...", get().cameras)
      },
    }),
    {
      name: "camera-store",
    },
  ),
)
