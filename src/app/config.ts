// API configuration for Gendra
export const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';

// Default configs
export const DEFAULT_INDUSTRY = 'metal_fabrication';

// Feature flags
export const FEATURES = {
  USE_FASTAPI: process.env.NEXT_PUBLIC_USE_FASTAPI === 'true',
  ENABLE_CACHE: true,
  SHOW_DEBUG_INFO: process.env.NODE_ENV === 'development'
}; 