"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCamerasClient } from '@/lib/data/cameras';
import { getHealthStatus } from '@/lib/data/health';
import { Camera, HealthStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  Loader2, 
  Camera as CameraIcon, 
  Shield, 
  Bell, 
  Activity, 
  CheckCircle, 
  XCircle,
  AlertTriangle, 
  Server,
  HardDrive
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState({
    cameras: true,
    health: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Load cameras
        setLoading(prev => ({ ...prev, cameras: true }));
        const camerasData = await getCamerasClient();
        setCameras(camerasData);
        setLoading(prev => ({ ...prev, cameras: false }));

        // Load health status
        setLoading(prev => ({ ...prev, health: true }));
        const healthData = await getHealthStatus();
        setHealthStatus(healthData);
        setLoading(prev => ({ ...prev, health: false }));
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      }
    };

    fetchDashboardData();
  }, []);

  const isLoading = loading.cameras || loading.health;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Get overall system status
  const getOverallStatus = () => {
    if (!healthStatus) return 'unknown';
    
    const statuses = [
      healthStatus.cameras.status,
      healthStatus.servers.status,
      healthStatus.storage.status
    ];
    
    if (statuses.includes('critical')) return 'critical';
    if (statuses.includes('warning')) return 'warning';
    return 'healthy';
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your security system and respond to events.
          </p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading dashboard data...</span>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CameraIcon className="h-5 w-5" />
              Cameras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{cameras.length}</div>
            <p className="text-muted-foreground text-sm">
              {cameras.filter(camera => camera.status === 'online').length} online
            </p>
            <div className="mt-4">
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/settings?tab=cameras">Manage Cameras</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-muted-foreground text-sm">
              1 unread alert
            </p>
            <div className="mt-4">
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/notifications">View All</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              AI Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              Monitoring all cameras
            </p>
            <div className="mt-4">
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/ai-assistant">AI Assistant</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {!loading.health && overallStatus === 'healthy' ? (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Healthy
                </Badge>
              ) : !loading.health && overallStatus === 'warning' ? (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                  Warning
                </Badge>
              ) : !loading.health && overallStatus === 'critical' ? (
                <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  Critical
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                  Loading...
                </Badge>
              )}
            </div>
            <div className="mt-4">
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/health">View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CameraIcon className="h-5 w-5" />
            Live Camera Feeds
          </CardTitle>
          <CardDescription>
            View real-time footage from your security cameras
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground mb-4">
            Live camera previews have been moved to the dedicated live view page.
          </p>
          <Button asChild>
            <Link href="/dashboard/cameras/live">
              Go to Live Camera View
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="health" className="space-y-6">
        <TabsList>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="notifications">Recent Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>
                Status of all connected cameras and systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading.health ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : healthStatus ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 border rounded-md">
                      <div className={healthStatus.storage.status === 'healthy' ? 'text-green-500' : 'text-yellow-500'}>
                        <HardDrive className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Storage</p>
                        <p className="text-sm text-muted-foreground">
                          {healthStatus.storage.primary.usedPercentage}% used (primary)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-md">
                      <div className={healthStatus.servers.cpu.status === 'healthy' ? 'text-green-500' : 'text-yellow-500'}>
                        <Server className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">CPU</p>
                        <p className="text-sm text-muted-foreground">{healthStatus.servers.cpu.usage}% usage</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-md">
                      <div className={healthStatus.servers.memory.status === 'healthy' ? 'text-green-500' : 'text-yellow-500'}>
                        {healthStatus.servers.memory.status === 'healthy' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium">Memory</p>
                        <p className="text-sm text-muted-foreground">{healthStatus.servers.memory.usagePercentage}% used</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-md">
                      <div className={healthStatus.cameras.status === 'healthy' ? 'text-green-500' : 'text-yellow-500'}>
                        <CameraIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Cameras</p>
                        <p className="text-sm text-muted-foreground">
                          {healthStatus.cameras.online} of {healthStatus.cameras.total} online ({healthStatus.cameras.onlinePercentage}%)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button asChild size="sm" variant="outline">
                      <Link href="/dashboard/health">View Full Health Report</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground">No health data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Latest events from your AI surveillance system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-md bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">Motion detected - Front Door</p>
                      <span className="text-xs text-muted-foreground">2 min ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Person detected near entrance</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-md">
                  <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">Camera status changed - Backyard</p>
                      <span className="text-xs text-muted-foreground">1 hour ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Camera is now online</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-md">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">System storage alert</p>
                      <span className="text-xs text-muted-foreground">Yesterday</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Storage usage exceeds 75%</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/dashboard/notifications">View All Notifications</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}