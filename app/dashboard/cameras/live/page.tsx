"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Grid, Layout, Maximize2, Minimize2, Settings2, Pause, Play } from "lucide-react";

// Demo camera data
const DEMO_CAMERAS = [
  { id: "camera-1", name: "Front Door", location: "Main Entrance", status: "online" },
  { id: "camera-2", name: "Backyard", location: "Garden Area", status: "online" },
  { id: "camera-3", name: "Living Room", location: "First Floor", status: "online" },
  { id: "camera-4", name: "Garage", location: "East Wing", status: "offline" },
  { id: "camera-5", name: "Kitchen", location: "Ground Floor", status: "online" },
  { id: "camera-6", name: "Driveway", location: "Front Area", status: "online" }
];

// Demo placeholder images
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596394723269-b2cbca4e6e33?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580983218765-f663bec07b37?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579747025935-f5f290a60298?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582271903443-af164af7706a?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596316121783-7ac8fa9c72fe?q=80&w=1200&auto=format&fit=crop"
];

/**
 * Demo Video Camera Component
 */
const DemoVideoCamera: React.FC<{
  camera: typeof DEMO_CAMERAS[0];
  imageUrl: string;
  isFullscreen: boolean;
  onToggleFullscreen: (id: string) => void;
}> = ({ camera, imageUrl, isFullscreen, onToggleFullscreen }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  
  return (
    <Card className={`overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen rounded-none' : 'h-full'}`}>
      <div className="relative h-full">
        {/* Demo "Video" */}
        <div className="relative aspect-video h-full w-full bg-black">
          <div className={`absolute inset-0 transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-80 grayscale'}`}>
            <img 
              src={imageUrl} 
              alt={camera.name} 
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* Camera Status Indicator */}
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <Badge variant={camera.status === "online" ? "default" : "destructive"} className="h-5 px-2 py-0">
              {camera.status === "online" ? "LIVE" : "OFFLINE"}
            </Badge>
            <Badge variant="outline" className="bg-black/50 text-white">
              {camera.location}
            </Badge>
          </div>

          {/* Camera Controls */}
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => onToggleFullscreen(camera.id)}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <Settings2 size={16} />
            </Button>
          </div>
          
          {/* Camera Name */}
          <div className="absolute bottom-2 left-2">
            <h4 className="rounded bg-black/50 px-2 py-1 text-sm font-medium text-white">
              {camera.name}
            </h4>
          </div>
          
          {/* "Loading" indicator for demo */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
              <span className="rounded-md bg-black/60 px-3 py-1 text-sm text-white">
                Stream Paused
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

/**
 * LiveView Page Component - Demo Version
 */
export default function LiveViewPage() {
  const [gridLayout, setGridLayout] = useState<"2x2" | "3x3">("2x2");
  const [fullscreenCamera, setFullscreenCamera] = useState<string | null>(null);

  // Simulate loading time
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Toggle fullscreen for a specific camera
  const toggleFullscreen = (cameraId: string) => {
    setFullscreenCamera(fullscreenCamera === cameraId ? null : cameraId);
  };

  // If a camera is fullscreen, only show that camera
  const visibleCameras = fullscreenCamera 
    ? DEMO_CAMERAS.filter(cam => cam.id === fullscreenCamera)
    : DEMO_CAMERAS.slice(0, gridLayout === "2x2" ? 4 : 9);

  return (
    <div className="flex h-full w-full flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Live View</h1>
          <p className="text-muted-foreground">
            Monitor your cameras in real-time
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs defaultValue="all" className="w-[300px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="indoor">Indoor</TabsTrigger>
              <TabsTrigger value="outdoor">Outdoor</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setGridLayout(gridLayout === "2x2" ? "3x3" : "2x2")}
          >
            <Grid size={18} />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
          >
            <Layout size={18} />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex h-[500px] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading camera feeds...</p>
          </div>
        </div>
      ) : (
        <div 
          className={`grid h-full gap-4 ${
            fullscreenCamera 
              ? 'grid-cols-1' 
              : gridLayout === "2x2" 
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {visibleCameras.map((camera, index) => (
            <DemoVideoCamera
              key={camera.id}
              camera={camera}
              imageUrl={PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]}
              isFullscreen={fullscreenCamera === camera.id}
              onToggleFullscreen={toggleFullscreen}
            />
          ))}
        </div>
      )}
      
      {/* Camera stats */}
      <Card className="mt-auto">
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">Camera Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4 py-2 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Total Cameras</p>
            <p className="text-lg font-bold">{DEMO_CAMERAS.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Online</p>
            <p className="text-lg font-bold">{DEMO_CAMERAS.filter(c => c.status === "online").length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Offline</p>
            <p className="text-lg font-bold">{DEMO_CAMERAS.filter(c => c.status === "offline").length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Storage Used</p>
            <p className="text-lg font-bold">42%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}