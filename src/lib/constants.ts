// Configurações de URL e domínio do aplicativo
export const APP_CONFIG = {
  // URL base do aplicativo (será definida automaticamente em produção)
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Nome do aplicativo
  APP_NAME: 'Sistema de Gestão de Café',
  
  // Descrição do aplicativo
  APP_DESCRIPTION: 'Sistema completo para gerenciamento de colheita e estoque de café',
  
  // Configurações de domínio
  DOMAIN: process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000',
  
  // URLs da API
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  
  // Configurações do Supabase
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
}

// Configurações de SEO
export const SEO_CONFIG = {
  title: APP_CONFIG.APP_NAME,
  description: APP_CONFIG.APP_DESCRIPTION,
  keywords: 'café, colheita, estoque, gestão, agricultura, produção',
  author: 'Sistema de Gestão de Café',
  url: APP_CONFIG.BASE_URL,
  image: `${APP_CONFIG.BASE_URL}/icon.svg`,
}

// Configurações de navegação
export const NAVIGATION = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  HARVEST: '/colheita',
  STOCK: '/estoque',
  REPORTS: '/relatorios',
}

// Configurações de ambiente
export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
}

// Configurações de cache
export const CACHE_CONFIG = {
  // Tempo de cache para dados estáticos (em segundos)
  STATIC_CACHE_TIME: 3600, // 1 hora
  
  // Tempo de cache para dados dinâmicos (em segundos)
  DYNAMIC_CACHE_TIME: 300, // 5 minutos
  
  // Tempo de revalidação (em segundos)
  REVALIDATE_TIME: 60, // 1 minuto
}

// Configurações de API
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
}

// Configurações de upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  UPLOAD_PATH: '/uploads',
}

// Configurações de paginação
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
}

// Configurações de formatação
export const FORMAT_CONFIG = {
  DATE_FORMAT: 'dd/MM/yyyy',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
  CURRENCY_FORMAT: 'pt-BR',
  NUMBER_FORMAT: 'pt-BR',
}

// Configurações de validação
export const VALIDATION_CONFIG = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_TEXT_LENGTH: 1000,
  MAX_NAME_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
}

// Configurações de notificação
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000, // 5 segundos
  SUCCESS_DURATION: 3000, // 3 segundos
  ERROR_DURATION: 7000, // 7 segundos
  WARNING_DURATION: 5000, // 5 segundos
}

// Configurações de tema
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light',
  THEMES: ['light', 'dark', 'system'],
  STORAGE_KEY: 'theme-preference',
}

// Configurações de localização
export const LOCALE_CONFIG = {
  DEFAULT_LOCALE: 'pt-BR',
  SUPPORTED_LOCALES: ['pt-BR', 'en-US'],
  TIMEZONE: 'America/Sao_Paulo',
}

// Configurações de monitoramento
export const MONITORING_CONFIG = {
  ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',
  ENABLE_ERROR_REPORTING: process.env.NODE_ENV === 'production',
  ENABLE_PERFORMANCE_MONITORING: process.env.NODE_ENV === 'production',
}