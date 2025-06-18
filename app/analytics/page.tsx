'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plane,
  Cloud,
  Wind,
  Eye,
  Thermometer,
  Gauge,
  Navigation,
  MapPin,
  Activity,
  TrendingUp,
  Droplets,
  Layers,
} from 'lucide-react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAutoHideHeader } from '@/hooks/use-auto-hide-header';

interface AircraftData {
  id: string;
  callsign: string;
  registration: string;
  aircraft_type: string;
  altitude: number;
  speed: number;
  heading: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  distance_km: number;
}

interface WeatherData {
  station: string;
  timestamp: string;
  temperature_c: number;
  dewpoint_c: number;
  humidity: number;
  pressure_hpa: number;
  wind_speed_kt: number;
  wind_direction: number;
  visibility_km: number;
  ceiling_ft?: number;
  conditions: string;
  raw_metar: string;
}

interface CameraGeofence {
  id: string;
  name: string;
  location: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

const cameraGeofences: CameraGeofence[] = [
  {
    id: 'cam-001',
    name: 'North Perimeter',
    location: 'Runway 09L Approach',
    bounds: { north: 40.715, south: 40.71, east: -74.004, west: -74.008 },
  },
  {
    id: 'cam-002',
    name: 'South Tower',
    location: 'Control Tower View',
    bounds: { north: 40.714, south: 40.709, east: -74.003, west: -74.007 },
  },
  {
    id: 'cam-003',
    name: 'East Taxiway',
    location: 'Taxiway Alpha',
    bounds: { north: 40.716, south: 40.711, east: -74.002, west: -74.006 },
  },
  {
    id: 'cam-004',
    name: 'West Hangar',
    location: 'Maintenance Area',
    bounds: { north: 40.713, south: 40.708, east: -74.007, west: -74.011 },
  },
  {
    id: 'cam-005',
    name: 'Cargo Ramp',
    location: 'Freight Terminal',
    bounds: { north: 40.712, south: 40.707, east: -74.005, west: -74.009 },
  },
  {
    id: 'cam-006',
    name: 'Terminal Gate',
    location: 'Passenger Gates 1-5',
    bounds: { north: 40.714, south: 40.709, east: -74.004, west: -74.008 },
  },
  {
    id: 'cam-007',
    name: 'Fuel Farm',
    location: 'Aviation Fuel Storage',
    bounds: { north: 40.711, south: 40.706, east: -74.006, west: -74.01 },
  },
  {
    id: 'cam-008',
    name: 'Emergency Access',
    location: 'ARFF Station',
    bounds: { north: 40.713, south: 40.708, east: -74.003, west: -74.007 },
  },
];

const mockAircraftData: AircraftData[] = [
  {
    id: 'ac-001',
    callsign: 'UAL1234',
    registration: 'N12345',
    aircraft_type: 'B737-800',
    altitude: 3500,
    speed: 180,
    heading: 270,
    latitude: 40.7128,
    longitude: -74.006,
    timestamp: '2024-01-15T14:35:22Z',
    distance_km: 2.3,
  },
  {
    id: 'ac-002',
    callsign: 'AAL5678',
    registration: 'N67890',
    aircraft_type: 'A320',
    altitude: 1200,
    speed: 140,
    heading: 90,
    latitude: 40.715,
    longitude: -74.004,
    timestamp: '2024-01-15T14:34:15Z',
    distance_km: 1.8,
  },
  {
    id: 'ac-003',
    callsign: 'DAL9012',
    registration: 'N24680',
    aircraft_type: 'B777-200',
    altitude: 5000,
    speed: 220,
    heading: 180,
    latitude: 40.71,
    longitude: -74.008,
    timestamp: '2024-01-15T14:33:45Z',
    distance_km: 3.1,
  },
];

const mockWeatherData: WeatherData = {
  station: 'KJFK',
  timestamp: '2024-01-15T14:35:00Z',
  temperature_c: 12,
  dewpoint_c: 8,
  humidity: 75,
  pressure_hpa: 1013.2,
  wind_speed_kt: 10,
  wind_direction: 270,
  visibility_km: 16,
  ceiling_ft: 2500,
  conditions: 'Few Clouds',
  raw_metar: 'KJFK 151435Z 27010KT 10SM FEW025 12/08 A2992 RMK AO2',
};

export default function AnalyticsHub() {
  const [aircraftData, setAircraftData] = useState<AircraftData[]>(mockAircraftData);
  const [weatherData, setWeatherData] = useState<WeatherData>(mockWeatherData);
  const [selectedAircraft, setSelectedAircraft] = useState<string | null>(null);
  const [selectedCameraFilter, setSelectedCameraFilter] = useState<string>('all');
  const isHeaderVisible = useAutoHideHeader();

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setAircraftData((prev) =>
        prev.map((aircraft) => ({
          ...aircraft,
          altitude: aircraft.altitude + (Math.random() - 0.5) * 100,
          speed: Math.max(100, aircraft.speed + (Math.random() - 0.5) * 20),
          heading: (aircraft.heading + (Math.random() - 0.5) * 10) % 360,
          latitude: aircraft.latitude + (Math.random() - 0.5) * 0.001,
          longitude: aircraft.longitude + (Math.random() - 0.5) * 0.001,
          timestamp: new Date().toISOString(),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getAltitudeColor = (altitude: number) => {
    if (altitude < 1000) return 'text-red-400 font-semibold';
    if (altitude < 3000) return 'text-yellow-400 font-semibold';
    return 'text-green-400 font-semibold';
  };

  const getWindDirection = (degrees: number) => {
    const directions = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const isAircraftInCameraBounds = (aircraft: AircraftData, camera: CameraGeofence): boolean => {
    return (
      aircraft.latitude >= camera.bounds.south &&
      aircraft.latitude <= camera.bounds.north &&
      aircraft.longitude >= camera.bounds.west &&
      aircraft.longitude <= camera.bounds.east
    );
  };

  const getFilteredAircraft = () => {
    if (selectedCameraFilter === 'all') return aircraftData;

    const selectedCamera = cameraGeofences.find((cam) => cam.id === selectedCameraFilter);
    if (!selectedCamera) return aircraftData;

    return aircraftData.filter((aircraft) => isAircraftInCameraBounds(aircraft, selectedCamera));
  };

  const filteredAircraftData = getFilteredAircraft();

  return (
    <SidebarInset>
      <header
        className={`fixed top-0 left-0 right-0 z-50 md:relative md:top-auto md:left-auto md:right-auto md:z-auto transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'
        } flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}
      >
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Analytics Hub</h1>
          <Badge variant="outline" className="text-green-500 border-green-500">
            Live Data
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
          <div className="hidden sm:flex items-center gap-2">
            <Plane className="h-4 w-4" />
            <span>{aircraftData.length} aircraft tracked</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">ADS-B Active</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 pt-20 md:pt-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="aircraft" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Aircraft
            </TabsTrigger>
            <TabsTrigger value="weather" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Weather
            </TabsTrigger>
            <TabsTrigger value="correlations" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Aircraft</CardTitle>
                  <Plane className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aircraftData.length}</div>
                  <p className="text-xs text-muted-foreground">+2 from last hour</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Altitude</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      aircraftData.reduce((sum, ac) => sum + ac.altitude, 0) / aircraftData.length
                    )}{' '}
                    ft
                  </div>
                  <p className="text-xs text-muted-foreground">Within normal range</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
                  <Wind className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weatherData.wind_speed_kt} kt</div>
                  <p className="text-xs text-muted-foreground">
                    From {getWindDirection(weatherData.wind_direction)} (
                    {weatherData.wind_direction}°)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Visibility</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weatherData.visibility_km} km</div>
                  <p className="text-xs text-muted-foreground">{weatherData.conditions}</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Weather Summary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Current Weather Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Thermometer className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                    <div className="text-2xl font-bold">{weatherData.temperature_c}°C</div>
                    <div className="text-sm text-muted-foreground">Temperature</div>
                  </div>
                  <div className="text-center">
                    <Gauge className="h-8 w-8 mx-auto mb-2 text-green-400" />
                    <div className="text-2xl font-bold">{weatherData.pressure_hpa}</div>
                    <div className="text-sm text-muted-foreground">hPa</div>
                  </div>
                  <div className="text-center">
                    <Wind className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                    <div className="text-2xl font-bold">{weatherData.wind_speed_kt}</div>
                    <div className="text-sm text-muted-foreground">
                      kt @ {weatherData.wind_direction}°
                    </div>
                  </div>
                  <div className="text-center">
                    <Eye className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                    <div className="text-2xl font-bold">{weatherData.visibility_km}</div>
                    <div className="text-sm text-muted-foreground">km visibility</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Aircraft Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Aircraft Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aircraftData.slice(0, 5).map((aircraft) => (
                    <div
                      key={aircraft.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-border/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <Plane className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">{aircraft.callsign}</div>
                          <div className="text-sm text-muted-foreground">
                            {aircraft.aircraft_type} • {aircraft.registration}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${getAltitudeColor(aircraft.altitude)}`}>
                          {Math.round(aircraft.altitude)} ft
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round(aircraft.speed)} kt •{' '}
                          {Math.round(aircraft.distance_km * 10) / 10} km
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aircraft" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Aircraft List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Plane className="h-5 w-5" />
                        Active Aircraft ({filteredAircraftData.length})
                      </div>
                      <Select value={selectedCameraFilter} onValueChange={setSelectedCameraFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                          <SelectValue placeholder="Filter by camera" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cameras</SelectItem>
                          {cameraGeofences.map((camera) => (
                            <SelectItem key={camera.id} value={camera.id}>
                              {camera.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {filteredAircraftData.map((aircraft) => (
                        <div
                          key={aircraft.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedAircraft === aircraft.id
                              ? 'border-primary bg-primary/10 shadow-md'
                              : 'border-border/40 hover:bg-muted/50 hover:border-border/60'
                          }`}
                          onClick={() => setSelectedAircraft(aircraft.id)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Plane className="h-4 w-4 text-blue-500" />
                                <div>
                                  <div className="font-medium">{aircraft.callsign}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {aircraft.aircraft_type}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-medium ${getAltitudeColor(aircraft.altitude)}`}>
                                {Math.round(aircraft.altitude)} ft
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {Math.round(aircraft.speed)} kt
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Heading:</span>{' '}
                              {Math.round(aircraft.heading)}°
                            </div>
                            <div>
                              <span className="text-muted-foreground">Distance:</span>{' '}
                              {Math.round(aircraft.distance_km * 10) / 10} km
                            </div>
                            <div>
                              <span className="text-muted-foreground">Updated:</span>{' '}
                              {new Date(aircraft.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Aircraft Details */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Aircraft Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedAircraft ? (
                      <div className="space-y-4">
                        {(() => {
                          const aircraft = aircraftData.find((ac) => ac.id === selectedAircraft);
                          if (!aircraft) return <div>Aircraft not found</div>;

                          return (
                            <>
                              <div>
                                <h3 className="font-medium text-lg">{aircraft.callsign}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {aircraft.aircraft_type}
                                </p>
                              </div>

                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Registration:</span>
                                  <span className="font-medium">{aircraft.registration}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Altitude:</span>
                                  <span
                                    className={`font-medium ${getAltitudeColor(aircraft.altitude)}`}
                                  >
                                    {Math.round(aircraft.altitude)} ft
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Speed:</span>
                                  <span className="font-medium">
                                    {Math.round(aircraft.speed)} kt
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Heading:</span>
                                  <span className="font-medium">
                                    {Math.round(aircraft.heading)}°
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Distance:</span>
                                  <span className="font-medium">
                                    {Math.round(aircraft.distance_km * 10) / 10} km
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Position:</span>
                                  <span className="font-medium text-xs">
                                    {aircraft.latitude.toFixed(4)}, {aircraft.longitude.toFixed(4)}
                                  </span>
                                </div>
                              </div>

                              <div className="pt-4 border-t">
                                <Button className="w-full" size="sm">
                                  <Navigation className="h-4 w-4 mr-2" />
                                  Track on Map
                                </Button>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Select an aircraft to view details</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weather" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5" />
                    Current Conditions
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Station: {weatherData.station} • Updated:{' '}
                    {new Date(weatherData.timestamp).toLocaleString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Thermometer className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="text-2xl font-bold">{weatherData.temperature_c}°C</div>
                          <div className="text-sm text-muted-foreground">Temperature</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Wind className="h-5 w-5 text-yellow-500" />
                        <div>
                          <div className="text-2xl font-bold">{weatherData.wind_speed_kt} kt</div>
                          <div className="text-sm text-muted-foreground">
                            {getWindDirection(weatherData.wind_direction)} (
                            {weatherData.wind_direction}°)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Gauge className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="text-2xl font-bold">{weatherData.pressure_hpa}</div>
                          <div className="text-sm text-muted-foreground">hPa</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-purple-500" />
                        <div>
                          <div className="text-2xl font-bold">{weatherData.visibility_km} km</div>
                          <div className="text-sm text-muted-foreground">Visibility</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Droplets className="h-5 w-5 text-cyan-500" />
                        <div>
                          <div className="text-2xl font-bold">{weatherData.humidity}%</div>
                          <div className="text-sm text-muted-foreground">Humidity</div>
                        </div>
                      </div>

                      {weatherData.ceiling_ft && (
                        <div className="flex items-center gap-3">
                          <Layers className="h-5 w-5 text-indigo-500" />
                          <div>
                            <div className="text-2xl font-bold">{weatherData.ceiling_ft} ft</div>
                            <div className="text-sm text-muted-foreground">Ceiling</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Raw METAR Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                      {weatherData.raw_metar}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Conditions:</span>
                        <span className="font-medium">{weatherData.conditions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dewpoint:</span>
                        <span className="font-medium">{weatherData.dewpoint_c}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Station:</span>
                        <span className="font-medium">{weatherData.station}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="correlations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Event Correlations
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Matching visual detections with ADS-B aircraft data
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-green-500/20 bg-green-500/5 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="font-medium">Correlation Match</span>
                        <Badge variant="outline" className="text-green-500 border-green-500">
                          94% confidence
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">2 min ago</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Visual Detection:</span>
                        <div>Aircraft detected on North Perimeter</div>
                        <div className="text-muted-foreground">Camera: cam-001 • 14:32:15</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ADS-B Data:</span>
                        <div>UAL1234 (B737-800)</div>
                        <div className="text-muted-foreground">Alt: 3,500ft • Speed: 180kt</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        <span className="font-medium">Partial Match</span>
                        <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                          67% confidence
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">5 min ago</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Visual Detection:</span>
                        <div>Drone detected on East Taxiway</div>
                        <div className="text-muted-foreground">Camera: cam-003 • 14:31:45</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ADS-B Data:</span>
                        <div className="text-muted-foreground">No matching aircraft found</div>
                        <div className="text-muted-foreground">Possible unauthorized drone</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="font-medium">No Correlation</span>
                        <Badge variant="outline" className="text-red-500 border-red-500">
                          Alert
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">8 min ago</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Visual Detection:</span>
                        <div>Unknown object on Cargo Ramp</div>
                        <div className="text-muted-foreground">Camera: cam-005 • 14:28:30</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ADS-B Data:</span>
                        <div className="text-muted-foreground">No aircraft in vicinity</div>
                        <div className="text-muted-foreground">Requires investigation</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
}
