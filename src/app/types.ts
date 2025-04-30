/**
 * Common types used across the application
 */

// Form data types
export interface FormDataType {
  [key: string]: string | number | boolean | object | undefined;
}

// Quote and pricing types
export interface QuoteResult {
  quote: number;
  leadTime: string;
  complexity: string;
  basePrice: number;
  materialCost: number;
  complexityFactor: number;
  quantityDiscount: number;
}

export interface QuoteFormData {
  material?: string;
  quantity?: number | string;
  complexity?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  partType?: string;
  deadline?: string;
  [key: string]: string | number | boolean | object | undefined;
}

// Industry and configuration types
export interface FormFieldOption {
  value: string;
  label: string;
  factor?: number;
  costFactor?: number;
}

export interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: FormFieldOption[];
  required: boolean;
  min?: number;
  max?: number;
}

export interface IndustryConfig {
  id: string;
  name: string;
  basePriceCoefficient?: number;
  formFields: FormField[];
  materials?: { value: string; label: string; basePrice?: number }[];
  complexityLevels?: { value: string; label: string; factor: number }[];
  [key: string]: unknown;
}

export interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Environment types
export interface EnvironmentConfig {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  API_BASE_URL: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  status: number;
}

// Auth types
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  company?: string;
}

// Utility function to type-check API responses
export function isApiError<T>(response: ApiResponse<T>): response is ApiResponse<never> & { error: { message: string } } {
  return response.error !== undefined;
} 