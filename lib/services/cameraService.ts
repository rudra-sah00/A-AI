/**
 * Camera Service - Handles API calls related to camera management
 */

// Type definitions for camera data
export type CameraFilter = {
  filter_id: string;
  filter_name: string;
  enabled: boolean;
};

export type Camera = {
  id?: string;
  name: string;
  rtsp_url: string;
  status?: 'online' | 'offline';
  stream_url?: string;
  webrtc_url?: string;
  filters?: CameraFilter[];
};

export type StreamInfo = {
  camera_id: string;
  hls_url: string;
  status: string;
  with_detection?: boolean;
};

// Backend API base URL
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Available filter types
export const AVAILABLE_FILTERS = [
  { name: 'OllamaVision', description: 'General-purpose AI vision filter' },
  { name: 'AnimalDetection', description: 'Detect animals in camera feed' },
  { name: 'Attendance', description: 'Track people attendance' },
  { name: 'VehicleDetection', description: 'Detect vehicles in camera feed' },
  { name: 'authorized_entry', description: 'Track authorized entry access' }
];

/**
 * Fetches all cameras from the backend API
 * GET /api/v1/cameras/
 */
export const fetchCameras = async (): Promise<Camera[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch cameras:', error);
    throw error;
  }
};

/**
 * Fetches a specific camera by ID
 * GET /api/v1/cameras/{camera_id}
 */
export const fetchCameraById = async (cameraId: string): Promise<Camera> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/${cameraId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch camera ${cameraId}:`, error);
    throw error;
  }
};

/**
 * Fetches a specific camera by name
 * GET /api/v1/cameras/by-name/{name}
 */
export const fetchCameraByName = async (name: string): Promise<Camera> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/by-name/${encodeURIComponent(name)}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch camera with name ${name}:`, error);
    throw error;
  }
};

/**
 * Adds a new camera
 * POST /api/v1/cameras/
 */
export const addCamera = async (cameraData: { name: string; rtsp_url: string }): Promise<Camera> => {
  try {
    // Create a FormData object
    const formData = new FormData();
    
    // Append camera data according to API requirements
    formData.append('name', cameraData.name);
    formData.append('rtsp_url', cameraData.rtsp_url);

    // Send the request
    const response = await fetch(`${API_BASE_URL}/cameras/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to add camera:', error);
    throw error;
  }
};

/**
 * Adds a new camera with filters
 * POST /api/v1/cameras/with-filters
 */
export const addCameraWithFilters = async (
  cameraData: { 
    name: string; 
    rtsp_url: string; 
    filters?: CameraFilter[];
    validate?: boolean;
  }
): Promise<Camera> => {
  try {
    // Create a FormData object for multipart form submission
    const formData = new FormData();
    
    // Append camera data according to API requirements
    formData.append('name', cameraData.name);
    formData.append('rtsp_url', cameraData.rtsp_url);
    
    // Add filters if provided
    if (cameraData.filters && cameraData.filters.length > 0) {
      formData.append('filters', JSON.stringify(cameraData.filters));
    }
    
    // Add validate flag if provided
    if (cameraData.validate !== undefined) {
      formData.append('validate', String(cameraData.validate));
    }

    // Send the request
    const response = await fetch(`${API_BASE_URL}/cameras/with-filters`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to add camera with filters:', error);
    throw error;
  }
};

/**
 * Deletes a camera by ID
 * DELETE /api/v1/cameras/{camera_id}
 */
export const deleteCameraById = async (cameraId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/${cameraId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to delete camera ${cameraId}:`, error);
    throw error;
  }
};

/**
 * Deletes a camera by name
 * DELETE /api/v1/cameras/by-name/{name}
 */
export const deleteCameraByName = async (name: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/by-name/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to delete camera with name ${name}:`, error);
    throw error;
  }
};

/**
 * Starts a camera stream
 * POST /api/v1/streaming/start
 */
export const startCameraStream = async (cameraId: string): Promise<{ webrtc_url: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/streaming/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ camera_id: cameraId }),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // The API might return different structure, this handles common formats
    if (data.webrtc_url) {
      return { webrtc_url: data.webrtc_url };
    } else if (data.url) {
      return { webrtc_url: data.url };
    } else if (data.result && data.result.webrtc_url) {
      return { webrtc_url: data.result.webrtc_url };
    } else {
      // Construct WebRTC URL from API base
      return { 
        webrtc_url: `ws://${window.location.hostname}:8000/api/v1/streaming/${cameraId}/webrtc`
      };
    }
  } catch (error) {
    console.error(`Failed to start stream for camera ${cameraId}:`, error);
    throw error;
  }
};

/**
 * Fetches all filters for a camera
 * GET /api/v1/cameras/{camera_id}/filters
 */
export const fetchCameraFilters = async (cameraId: string): Promise<CameraFilter[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/${cameraId}/filters`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch filters for camera ${cameraId}:`, error);
    throw error;
  }
};

/**
 * Updates filters for a camera
 * PUT /api/v1/cameras/{camera_id}/filters
 */
export const updateCameraFilters = async (
  cameraId: string, 
  filters: CameraFilter[]
): Promise<CameraFilter[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/${cameraId}/filters`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to update filters for camera ${cameraId}:`, error);
    throw error;
  }
};

/**
 * Gets status of all camera streams
 * GET /api/v1/streaming/
 */
export const getStreamStatus = async (): Promise<{ active_streams: StreamInfo[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/streaming/`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to get stream status:', error);
    throw error;
  }
};

/**
 * Starts streaming for a specific camera
 * POST /api/v1/streaming/start/{camera_id}
 */
export const startStream = async (cameraId: string, withDetection: boolean = false): Promise<StreamInfo> => {
  try {
    const url = `${API_BASE_URL}/streaming/start/${cameraId}${withDetection ? '?with_detection=true' : ''}`;
    const response = await fetch(url, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to start stream for camera ${cameraId}:`, error);
    throw error;
  }
};

/**
 * Stops streaming for a specific camera
 * POST /api/v1/streaming/stop/{camera_id}
 */
export const stopStream = async (cameraId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/streaming/stop/${cameraId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to stop stream for camera ${cameraId}:`, error);
    throw error;
  }
};

/**
 * Gets HLS URLs for all active cameras
 * GET /api/v1/streaming/stream-urls
 */
export const getStreamUrls = async (): Promise<StreamInfo[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/streaming/stream-urls`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get stream URLs:', error);
    throw error;
  }
};

/**
 * Generates a unique filter ID based on the filter name and a timestamp
 */
export const generateFilterId = (filterName: string): string => {
  const timestamp = new Date().getTime().toString(36);
  const filterBase = filterName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${filterBase}-${timestamp.slice(-4)}`;
};