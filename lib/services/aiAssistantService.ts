/**
 * AI Assistant Service - Handles API calls related to OllamaVision AI Assistant
 */

// Types for AI Assistant
export interface QueryRequest {
  camera_id: string;
  query: string;
}

// Updated QueryResponse interface to match the new backend response structure
export interface QueryResponse {
  success: boolean;
  response?: string; // The detailed text response from AI
  error?: string | null; // Error message if success is false
  camera_id?: string;
  camera_name?: string; // New field from backend example
  timestamp?: string; // Backend sends string timestamp
  model?: string; // New field from backend example
  image_base64?: string; // Assuming this might still be part of the response
}

// Backend API base URL
const API_BASE_URL = 'http://localhost:8000';

/**
 * Submit a contextual query
 * POST /api/v1/contextual/query
 */
export const submitQuery = async (request: QueryRequest): Promise<QueryResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/contextual/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    // Even if response.ok is true, the backend might send { success: false, error: "..." }
    // so we parse the JSON first.
    const responseData = await response.json();

    if (!response.ok) {
      // If response status is not ok, throw an error using the error message from responseData if available
      throw new Error(responseData.error || `Error: ${response.status} ${response.statusText}`);
    }

    return responseData as QueryResponse;
  } catch (error) {
    console.error('Failed to submit query:', error);
    // Re-throw the error to be caught by the calling function in the component
    // If it's a network error or JSON parsing error, error.message will be used.
    // If it's an error thrown from !response.ok, that message will be used.
    throw error;
  }
};

// Removed checkQueryStatus function as the endpoint /api/v1/ollama-vision/query/{query_id} is no longer valid
// and a new one for status checking with the /api/v1/contextual/ path was not provided.