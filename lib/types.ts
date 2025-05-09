export type Camera = {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  lastSeen?: string;
  streamUrl: string;
  thumbnailUrl: string;
  aiFeatures: string[];
  alerts?: string[];
  model?: string;
  resolutionWidth?: number;
  resolutionHeight?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
};

export type EventTypes = 'motion' | 'alert' | 'warning' | 'info';

export type Event = {
  id: string;
  cameraId: string;
  camera: string;
  cameraImage: string;
  type: string;
  description: string;
  time: string;
  timestamp: string;
  image?: string;
  ai?: {
    objectsDetected?: string[];
    confidence: number;
  };
};

export type HealthStatus = {
  timestamp: string;
  cameras: {
    status: 'healthy' | 'warning' | 'critical';
    total: number;
    online: number;
    offline: number;
    onlinePercentage: number;
    offlineCameras: {
      name: string;
      reason: string;
    }[];
    maintenance: {
      name: string;
      issue: string;
      maintenanceType: string;
      reportedAt: string;
    }[];
  };
  servers: {
    status: 'healthy' | 'warning' | 'critical';
    cpu: {
      status: 'healthy' | 'warning' | 'critical';
      usage: number;
      cores: number;
    };
    memory: {
      status: 'healthy' | 'warning' | 'critical';
      total: number;
      used: number;
      usagePercentage: number;
    };
    database: {
      status: 'healthy' | 'warning' | 'critical';
      responseTime: number;
      connections: number;
    };
  };
  storage: {
    status: 'healthy' | 'warning' | 'critical';
    primary: {
      status: 'healthy' | 'warning' | 'critical';
      total: number;
      used: number;
      usedPercentage: number;
    };
    backup: {
      status: 'healthy' | 'warning' | 'critical';
      total: number;
      used: number;
      usedPercentage: number;
    };
    retention: number;
    retentionPolicy: string;
    oldestFootage: string;
  };
  updates: {
    ai: {
      currentVersion: string;
      updateAvailable: boolean;
      newVersion?: string;
    };
    storage: {
      currentVersion: string;
      updateAvailable: boolean;
      newVersion?: string;
    };
    firmware: {
      totalCameras: number;
      updatedCameras: number;
      outdatedCameras: number;
    };
  };
};

export type NotificationType = 'alert' | 'warning' | 'info' | 'success' | 'error';

export type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string; // ISO string for dates
  type: NotificationType;
  read: boolean;
  imageUrl?: string;
  link?: string; // Optional link for navigation on click
};