import { API_CONFIG } from '@/config/api';

export const testApiConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });

    if (response.ok) {
      return { success: true, message: 'Backend is connected and responding' };
    } else {
      return { success: false, message: `Backend responded with status: ${response.status}` };
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { success: false, message: 'Request timed out - backend may be slow or unavailable' };
      }
      if (error.message.includes('fetch')) {
        return { success: false, message: 'Cannot connect to backend - make sure it\'s running on localhost:5000' };
      }
      return { success: false, message: `Connection error: ${error.message}` };
    }
    return { success: false, message: 'Unknown error occurred' };
  }
};

export const testEndpoints = async (): Promise<{ endpoint: string; status: 'ok' | 'error'; message: string }[]> => {
  const endpoints = [
    '/users',
    '/groups', 
    '/expenses',
    '/settlements'
  ];

  const results = await Promise.all(
    endpoints.map(async (endpoint) => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          return { endpoint, status: 'ok' as const, message: 'OK' };
        } else {
          return { endpoint, status: 'error' as const, message: `Status: ${response.status}` };
        }
      } catch (error) {
        return { endpoint, status: 'error' as const, message: 'Connection failed' };
      }
    })
  );

  return results;
}; 