// API Configuration for n8n webhooks
const N8N_BASE_URL = 'https://primary-production-939cb.up.railway.app';

export const API_ENDPOINTS = {
  // Registration endpoint
  REGISTER: `${N8N_BASE_URL}/webhook/webhook-register-agent`,
  
  // Profile endpoint (production)
  GET_PROFILE: `${N8N_BASE_URL}/webhook/webhook-get-profile`,
  
  // Daily report endpoint
  DAILY_REPORT: `${N8N_BASE_URL}/webhook/daily_report`,
  
  // Language update endpoint
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

export interface DayTemplate {
  day: number;
  stage: string;
  title: string;
  description: string;
  tasks: string;
  video_link?: string;
  form_schema?: string;
}

export interface DailyAction {
  day: number;
  status: 'done' | 'partial' | 'missed';
  submitted_at?: string;
}

export interface Agent {
  agent_number: string;
  full_name: string;
  telegram_id: string;
  phone: string;
  goal: string;
  language: 'ru' | 'kk';
  mentor_number: string;
  day_program: number;
  program_stage: 'novice' | 'mentor' | 'leader' | 'completed';
  program_status: 'in_progress' | 'completed' | 'stopped';
  last_activity_at: string;
  created_at: string;
  updated_at: string;
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
  program_status: 'in_progress' | 'completed' | 'stopped';
  last_activity_at?: string;
  created_at?: string;
  updated_at?: string;
  day_template?: DayTemplate;
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

export interface GetProfileResponse {
  status: 'ok' | 'not_registered';
  agent?: Agent;
  students?: Student[];
  students_count?: number;
  day_template?: DayTemplate;
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
    const response = await apiRequest<GetProfileResponse>(
      API_ENDPOINTS.GET_PROFILE,
      data
    );
    
    if (response.status === 'ok' && response.agent) {
      // Transform backend response to UserProfile format
      const profile: UserProfile = {
        telegram_id: response.agent.telegram_id,
        agent_number: response.agent.agent_number,
        mentor_number: response.agent.mentor_number,
        full_name: response.agent.full_name,
        phone: response.agent.phone,
        goal: response.agent.goal,
        language: response.agent.language,
        day_program: response.agent.day_program,
        program_stage: response.agent.program_stage,
        program_status: response.agent.program_status,
        last_activity_at: response.agent.last_activity_at,
        created_at: response.agent.created_at,
        updated_at: response.agent.updated_at,
        day_template: response.day_template,
        students: response.students,
        students_count: response.students_count,
      };
      
      // Parse form_schema if it's a string
      if (response.day_template?.form_schema) {
        try {
          const parsed = typeof response.day_template.form_schema === 'string' 
            ? JSON.parse(response.day_template.form_schema) 
            : response.day_template.form_schema;
          profile.form_schema = parsed;
        } catch {
          // Ignore parse errors
        }
      }
      
      return profile;
    }
    
    // status === 'not_registered'
    return null;
  } catch {
    throw new Error('network_error');
  }
}

export async function submitDailyReport(data: DailyReportRequest): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(API_ENDPOINTS.DAILY_REPORT, data);
}

export async function updateLanguage(data: UpdateLanguageRequest): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(API_ENDPOINTS.UPDATE_LANGUAGE, data);
}
