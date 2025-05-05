/**
 * AI Assistant Service - Handles API calls related to OllamaVision AI Assistant
 */

// Types for AI Assistant
export interface QueryRequest {
  camera_id: string;
  query: string;
}

export interface QueryResponse {
  query_id: string;
  status: 'completed' | 'processing';
  response?: string;
  camera_id?: string;
  timestamp?: number;
  image_base64?: string;
}

export interface QueryStatusResponse {
  query_id: string;
  status: 'completed' | 'processing' | 'not_found';
  response?: string;
  camera_id?: string;
  timestamp?: number;
  image_base64?: string;
}

// Backend API base URL
const API_BASE_URL = 'http://localhost:8000';

/**
 * Submit a contextual query to OllamaVision
 * POST /api/v1/ollamavision/query
 */
export const submitQuery = async (request: QueryRequest): Promise<QueryResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/ollamavision/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to submit query:', error);
    throw error;
  }
};

/**
 * Check the status of a previously submitted query
 * GET /api/v1/ollamavision/query/{query_id}?camera_id=camera1
 */
export const checkQueryStatus = async (queryId: string, cameraId: string): Promise<QueryStatusResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/ollamavision/query/${queryId}?camera_id=${cameraId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to check query status for query ${queryId}:`, error);
    throw error;
  }
};