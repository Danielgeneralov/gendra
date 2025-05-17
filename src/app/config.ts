// API configuration for Gendra
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gendra-backend.onrender.com';

// Default configs
export const DEFAULT_INDUSTRY = 'metal_fabrication';

// Feature flags
export const FEATURES = {
  USE_FASTAPI: process.env.NEXT_PUBLIC_USE_FASTAPI === 'true',
  ENABLE_CACHE: true,
  SHOW_DEBUG_INFO: process.env.NODE_ENV === 'development'
}; 