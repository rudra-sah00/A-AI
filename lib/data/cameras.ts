// Camera data fetching for client-side
import { Camera } from '@/lib/types';
import { getStreamUrls, getStreamStatus } from '@/lib/services/cameraService';

// For client-side usage - fetch from API
export const getCamerasClient = async (): Promise<Camera[]> => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/cameras');
    if (!response.ok) {
      throw new Error(`Error fetching cameras: ${response.status}`);
    }
    const data = await response.json();
    
    // Initialize empty maps for active streams and URLs
    let activeStreams = new Set<string>();
    let streamUrls: Record<string, string> = {};
    
    try {
      // Get streaming status to enhance camera data with stream information
      const streamStatus = await getStreamStatus();
      if (streamStatus && streamStatus.active_streams) {
        activeStreams = new Set(streamStatus.active_streams.map(stream => stream.camera_id));
        
        // If any streams are active, fetch their HLS URLs
        if (activeStreams.size > 0) {
          const urls = await getStreamUrls();
          if (urls && Array.isArray(urls)) {
            urls.forEach(stream => {
              if (stream && stream.camera_id && stream.hls_url) {
                streamUrls[stream.camera_id] = stream.hls_url;
              }
            });
          }
        }
      }
    } catch (streamError) {
      console.error("Error fetching stream status:", streamError);
      // Continue with camera data even if streaming info fails
    }
    
    // Map the backend camera format to our frontend Camera type
    return data.map((camera: any) => ({
      id: camera.id,
      name: camera.name,
      location: camera.location || 'Default Location',
      status: activeStreams.has(camera.id) ? 'online' : 'offline',
      streamUrl: camera.rtsp_url,
      hlsUrl: streamUrls[camera.id] || null,
      thumbnailUrl: '/camera-placeholder.jpg', // Default thumbnail
      aiFeatures: camera.filters || [],
      model: camera.model || 'Unknown',
      lastSeen: new Date().toISOString(),
      isStreaming: activeStreams.has(camera.id)
    }));
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return [];
  }
};

// Legacy function to maintain compatibility - calls the client version
export const getCameras = getCamerasClient;

// Get streaming URLs for active cameras
export const getActiveStreamUrls = async (): Promise<Record<string, string>> => {
  try {
    const streams = await getStreamUrls();
    const urlMap: Record<string, string> = {};
    
    if (streams && Array.isArray(streams)) {
      streams.forEach(stream => {
        if (stream && stream.camera_id && stream.hls_url) {
          // Add cache busting to prevent stale streams
          const cacheBuster = `${stream.hls_url.includes('?') ? '&' : '?'}_=${Date.now()}`;
          urlMap[stream.camera_id] = `${stream.hls_url}${cacheBuster}`;
        }
      });
    }
    
    return urlMap;
  } catch (error) {
    console.error('Error fetching stream URLs:', error);
    return {};
  }
};

// Mock data for local development in case the API is not available
export const mockCameras: Camera[] = [];