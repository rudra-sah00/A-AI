// Mock data for health status

import { HealthStatus } from '@/lib/types';

// Function to simulate API call with some delay
export const getHealthStatus = (): Promise<HealthStatus> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockHealthStatus);
    }, 800);
  });
};

const mockHealthStatus: HealthStatus = {
  timestamp: new Date().toISOString(),
  cameras: {
    status: 'warning',
    total: 12,
    online: 10,
    offline: 2,
    onlinePercentage: 83,
    offlineCameras: [
      {
        name: 'Hallway West',
        reason: 'Network connectivity issue'
      },
      {
        name: 'IT Office',
        reason: 'Scheduled maintenance'
      }
    ],
    maintenance: [
      {
        name: 'Parking Lot A',
        issue: 'Lens cleaning required',
        maintenanceType: 'Routine',
        reportedAt: '2025-04-10'
      },
      {
        name: 'Hallway West',
        issue: 'Network connectivity issues',
        maintenanceType: 'Urgent',
        reportedAt: '2025-04-15'
      }
    ]
  },
  servers: {
    status: 'healthy',
    cpu: {
      status: 'healthy',
      usage: 42,
      cores: 16
    },
    memory: {
      status: 'healthy',
      total: 64,
      used: 28,
      usagePercentage: 44
    },
    database: {
      status: 'healthy',
      responseTime: 24,
      connections: 18
    }
  },
  storage: {
    status: 'warning',
    primary: {
      status: 'warning',
      total: 16,
      used: 10.8,
      usedPercentage: 68
    },
    backup: {
      status: 'healthy',
      total: 32,
      used: 12.4,
      usedPercentage: 39
    },
    retention: 30,
    retentionPolicy: 'Standard (30 days)',
    oldestFootage: '2025-03-16'
  },
  updates: {
    ai: {
      currentVersion: '3.2.1',
      updateAvailable: true,
      newVersion: '3.3.0'
    },
    storage: {
      currentVersion: '2.1.0',
      updateAvailable: false
    },
    firmware: {
      totalCameras: 12,
      updatedCameras: 9,
      outdatedCameras: 3
    }
  }
};