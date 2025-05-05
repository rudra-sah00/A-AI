"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getHealthStatus } from '@/lib/data/health';
import { HealthStatus } from '@/lib/types';
import {
  Activity,
  HardDrive,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Server,
  Clock,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HealthPage() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHealthData = async () => {
      setLoading(true);
      try {
        const healthData = await getHealthStatus();
        setHealthStatus(healthData);
      } catch (error) {
        console.error('Error fetching health data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  const refreshHealthData = async () => {
    setIsRefreshing(true);
    try {
      const healthData = await getHealthStatus();
      setHealthStatus(healthData);
      toast({
        title: "Health data refreshed",
        description: "The system health information has been updated",
      });
    } catch (error) {
      console.error('Error refreshing health data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Mock performance data for charts
  const cpuData = [
    { time: '00:00', value: 45 },
    { time: '01:00', value: 38 },
    { time: '02:00', value: 25 },
    { time: '03:00', value: 22 },
    { time: '04:00', value: 18 },
    { time: '05:00', value: 24 },
    { time: '06:00', value: 35 },
    { time: '07:00', value: 48 },
    { time: '08:00', value: 62 },
    { time: '09:00', value: 78 },
    { time: '10:00', value: 82 },
    { time: '11:00', value: 75 },
    { time: '12:00', value: 68 },
  ];

  const memoryData = [
    { time: '00:00', value: 52 },
    { time: '01:00', value: 56 },
    { time: '02:00', value: 48 },
    { time: '03:00', value: 43 },
    { time: '04:00', value: 42 },
    { time: '05:00', value: 45 },
    { time: '06:00', value: 50 },
    { time: '07:00', value: 58 },
    { time: '08:00', value: 68 },
    { time: '09:00', value: 72 },
    { time: '10:00', value: 76 },
    { time: '11:00', value: 72 },
    { time: '12:00', value: 68 },
  ];

  const storageData = [
    { time: '00:00', value: 65 },
    { time: '01:00', value: 65.2 },
    { time: '02:00', value: 65.5 },
    { time: '03:00', value: 65.5 },
    { time: '04:00', value: 65.6 },
    { time: '05:00', value: 65.8 },
    { time: '06:00', value: 66 },
    { time: '07:00', value: 66.3 },
    { time: '08:00', value: 66.7 },
    { time: '09:00', value: 67.2 },
    { time: '10:00', value: 67.8 },
    { time: '11:00', value: 68.2 },
    { time: '12:00', value: 68.5 },
  ];

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Loading health data</h3>
          <p className="text-muted-foreground">Please wait while we retrieve system health information.</p>
        </div>
      </div>
    );
  }

  if (!healthStatus) {
    return (
      <div className="container mx-auto flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium">Health data unavailable</h3>
          <p className="text-muted-foreground">Unable to retrieve system health information.</p>
          <Button variant="outline" className="mt-4" onClick={refreshHealthData}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Function to determine status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">
            Monitor the status of your security system components.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshHealthData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`${healthStatus.cameras.status === 'critical' ? 'border-red-300 dark:border-red-900' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Cameras</CardTitle>
              <Badge 
                variant={
                  healthStatus.cameras.status === 'healthy' ? 'outline' : 
                  healthStatus.cameras.status === 'warning' ? 'default' : 'destructive'
                }
                className="flex gap-1 items-center"
              >
                {getStatusIcon(healthStatus.cameras.status)}
                {healthStatus.cameras.status === 'healthy' ? 'Healthy' : 
                 healthStatus.cameras.status === 'warning' ? 'Warning' : 'Critical'}
              </Badge>
            </div>
            <CardDescription>
              {healthStatus.cameras.online} of {healthStatus.cameras.total} cameras online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={healthStatus.cameras.onlinePercentage} className="h-2 mb-1" />
            <div className="text-xs text-muted-foreground text-right">
              {healthStatus.cameras.onlinePercentage}% operational
            </div>
            
            {healthStatus.cameras.offlineCameras.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Offline Cameras</h4>
                <div className="space-y-2">
                  {healthStatus.cameras.offlineCameras.map((camera, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span>{camera.name}</span>
                      <span className="text-xs text-muted-foreground">{camera.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className={`${healthStatus.servers.status === 'critical' ? 'border-red-300 dark:border-red-900' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Servers</CardTitle>
              <Badge 
                variant={
                  healthStatus.servers.status === 'healthy' ? 'outline' : 
                  healthStatus.servers.status === 'warning' ? 'default' : 'destructive'
                }
                className="flex gap-1 items-center"
              >
                {getStatusIcon(healthStatus.servers.status)}
                {healthStatus.servers.status === 'healthy' ? 'Healthy' : 
                 healthStatus.servers.status === 'warning' ? 'Warning' : 'Critical'}
              </Badge>
            </div>
            <CardDescription>
              Server performance and database status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">CPU Usage</span>
                  <span className="text-sm font-medium">{healthStatus.servers.cpu.usage}%</span>
                </div>
                <Progress value={healthStatus.servers.cpu.usage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Memory</span>
                  <span className="text-sm font-medium">{healthStatus.servers.memory.usagePercentage}%</span>
                </div>
                <Progress value={healthStatus.servers.memory.usagePercentage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Database</span>
                  <span className="text-sm font-medium">{healthStatus.servers.database.responseTime} ms</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {healthStatus.servers.database.connections} active connections
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`${healthStatus.storage.status === 'critical' ? 'border-red-300 dark:border-red-900' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Storage</CardTitle>
              <Badge 
                variant={
                  healthStatus.storage.status === 'healthy' ? 'outline' : 
                  healthStatus.storage.status === 'warning' ? 'default' : 'destructive'
                }
                className="flex gap-1 items-center"
              >
                {getStatusIcon(healthStatus.storage.status)}
                {healthStatus.storage.status === 'healthy' ? 'Healthy' : 
                 healthStatus.storage.status === 'warning' ? 'Warning' : 'Critical'}
              </Badge>
            </div>
            <CardDescription>
              Storage utilization and retention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Primary Storage</span>
                  <span className="text-sm font-medium">
                    {healthStatus.storage.primary.used} / {healthStatus.storage.primary.total} TB
                  </span>
                </div>
                <Progress value={healthStatus.storage.primary.usedPercentage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Backup Storage</span>
                  <span className="text-sm font-medium">
                    {healthStatus.storage.backup.used} / {healthStatus.storage.backup.total} TB
                  </span>
                </div>
                <Progress value={healthStatus.storage.backup.usedPercentage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Retention</span>
                  <span className="text-sm font-medium">{healthStatus.storage.retention} days</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Oldest footage: {healthStatus.storage.oldestFootage}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>
            System performance over the last 12 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cpu">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="cpu">CPU Usage</TabsTrigger>
              <TabsTrigger value="memory">Memory</TabsTrigger>
              <TabsTrigger value="storage">Storage Growth</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cpu">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cpuData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'CPU Usage']} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2} 
                      dot={false} 
                      name="CPU Usage" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="memory">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={memoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Memory Usage']} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2} 
                      dot={false} 
                      name="Memory Usage" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="storage">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={storageData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Storage Usage']} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--chart-3))" 
                      strokeWidth={2} 
                      dot={false} 
                      name="Storage Usage" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Required</CardTitle>
            <CardDescription>
              Cameras needing attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {healthStatus.cameras.maintenance.length > 0 ? (
              <div className="space-y-4">
                {healthStatus.cameras.maintenance.map((camera, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-700 dark:text-amber-300 flex-shrink-0">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{camera.name}</h4>
                      <p className="text-sm text-muted-foreground">{camera.issue}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{camera.maintenanceType}</Badge>
                        <span className="text-xs text-muted-foreground">Reported: {camera.reportedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                <h3 className="text-lg font-medium">No maintenance required</h3>
                <p className="text-muted-foreground">
                  All cameras are operating normally.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Updates</CardTitle>
            <CardDescription>
              Software and firmware update status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 flex-shrink-0">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">AI Processing Engine</h4>
                  <p className="text-sm text-muted-foreground">Version {healthStatus.updates.ai.currentVersion}</p>
                  {healthStatus.updates.ai.updateAvailable ? (
                    <div className="mt-1">
                      <Badge>Update Available</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Version {healthStatus.updates.ai.newVersion} is available
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Update Now
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="outline" className="mt-1">Up to date</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300 flex-shrink-0">
                  <HardDrive className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Storage System</h4>
                  <p className="text-sm text-muted-foreground">Version {healthStatus.updates.storage.currentVersion}</p>
                  {healthStatus.updates.storage.updateAvailable ? (
                    <div className="mt-1">
                      <Badge>Update Available</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Version {healthStatus.updates.storage.newVersion} is available
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Update Now
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="outline" className="mt-1">Up to date</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-300 flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Camera Firmware</h4>
                  <p className="text-sm text-muted-foreground">{healthStatus.updates.firmware.updatedCameras} of {healthStatus.updates.firmware.totalCameras} cameras up to date</p>
                  {healthStatus.updates.firmware.outdatedCameras > 0 ? (
                    <div className="mt-1">
                      <Badge>{healthStatus.updates.firmware.outdatedCameras} cameras need updates</Badge>
                      <Button size="sm" variant="outline" className="mt-2">
                        Update All
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="outline" className="mt-1">All up to date</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}