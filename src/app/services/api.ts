import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-93f7169e`;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export async function getDrivers(filters?: { team?: string; search?: string }) {
  const params = new URLSearchParams();
  if (filters?.team) params.append('team', filters.team);
  if (filters?.search) params.append('search', filters.search);
  
  const queryString = params.toString();
  const endpoint = `/drivers${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint);
}

export async function getDriverById(id: number) {
  return fetchAPI(`/drivers/${id}`);
}

export async function getTeams() {
  return fetchAPI('/teams');
}

export async function getRaces() {
  return fetchAPI('/races');
}

export async function getLapTimes() {
  return fetchAPI('/lap-times');
}

export async function getTeamPerformance() {
  return fetchAPI('/team-performance');
}

export async function getConsistency() {
  return fetchAPI('/consistency');
}

export async function getStats() {
  return fetchAPI('/stats');
}
