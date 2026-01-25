// API Configuration for n8n webhooks
// Replace placeholders with actual URLs when ready

const N8N_BASE_URL = 'https://primary-production-939cb.up.railway.app';

export const API_ENDPOINTS = {
  // Registration endpoint (ready)
  REGISTER: `${N8N_BASE_URL}/webhook/webhook-register-agent`,
  
  // Profile endpoint (placeholder - replace when ready)
  GET_PROFILE: `${N8N_BASE_URL}/webhook/get_profile`,
  
  // Daily report endpoint (placeholder - replace when ready)
  DAILY_REPORT: `${N8N_BASE_URL}/webhook/daily_report`,
  
  // Language update endpoint (placeholder - replace when ready)
  UPDATE_LANGUAGE: `${N8N_BASE_URL}/webhook/update_language`,
};

// Types for API requests/responses
export interface RegisterRequest {
  telegram_id: string;
  agent_number: string;
  mentor_number: string;
  full_name: string;
  phone: string;
  goal: string;
  language: 'ru' | 'kk';
}

export interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
  reason?: string;
}

export interface Student {
  telegram_id: string;
  full_name: string;
  agent_number: string;
  day_program: number;
  program_stage: 'novice' | 'mentor' | 'leader' | 'completed';
  last_activity_at: string;
  activity_status: 'ok' | 'warning' | 'error';
}

export interface DayContent {
  title: string;
  description: string;
  video_link?: string;
  tasks: string[];
}

export interface DailyAction {
  day: number;
  status: 'done' | 'partial' | 'missed';
  submitted_at?: string;
}

export interface UserProfile {
  telegram_id: string;
  agent_number: string;
  mentor_number: string;
  full_name: string;
  phone: string;
  goal: string;
  language: 'ru' | 'kk';
  day_program: number;
  program_stage: 'novice' | 'mentor' | 'leader' | 'completed';
  program_status: 'active' | 'paused' | 'completed';
  day_content?: DayContent;
  students?: Student[];
  students_count?: number;
  form_schema?: FormField[];
  daily_actions?: DailyAction[];
}

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'checkbox' | 'select';
  label: string;
  required?: boolean;
  options?: string[];
}

export interface GetProfileRequest {
  telegram_id: string;
}

export interface DailyReportRequest {
  telegram_id: string;
  day_program: number;
  answers: Record<string, unknown>;
}

export interface UpdateLanguageRequest {
  telegram_id: string;
  new_language: 'ru' | 'kk';
}

// API Functions
async function apiRequest<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('network_error');
  }

  return response.json();
}

export async function registerAgent(data: RegisterRequest): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(API_ENDPOINTS.REGISTER, data);
}

export async function getProfile(data: GetProfileRequest): Promise<UserProfile | null> {
  try {
    const response = await apiRequest<{ status: string; profile?: UserProfile }>(
      API_ENDPOINTS.GET_PROFILE,
      data
    );
    if (response.status === 'success' && response.profile) {
      return response.profile;
    }
    return null;
  } catch {
    return null;
  }
}

export async function submitDailyReport(data: DailyReportRequest): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(API_ENDPOINTS.DAILY_REPORT, data);
}

export async function updateLanguage(data: UpdateLanguageRequest): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(API_ENDPOINTS.UPDATE_LANGUAGE, data);
}
