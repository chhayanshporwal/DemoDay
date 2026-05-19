import dotenv from 'dotenv';
import path from 'path';

// Load .env from monorepo root (two levels up from apps/server)
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

// ---------------------------------------------------------------------------
// Validation helper
// ---------------------------------------------------------------------------
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

// ---------------------------------------------------------------------------
// Validated & typed config
// ---------------------------------------------------------------------------
export const config = {
  // Server
  port: parseInt(optionalEnv('PORT', '3001'), 10),
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  clientUrl: optionalEnv('CLIENT_URL', 'http://localhost:5173'),

  // Supabase
  supabaseUrl: requireEnv('SUPABASE_URL'),
  supabaseAnonKey: requireEnv('SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),

  // Cloudinary (optional in early phases)
  cloudinaryCloudName: optionalEnv('CLOUDINARY_CLOUD_NAME', ''),
  cloudinaryApiKey: optionalEnv('CLOUDINARY_API_KEY', ''),
  cloudinaryApiSecret: optionalEnv('CLOUDINARY_API_SECRET', ''),

  // Neo4j (optional in early phases)
  neo4jUri: optionalEnv('NEO4J_URI', ''),
  neo4jUser: optionalEnv('NEO4J_USER', 'neo4j'),
  neo4jPassword: optionalEnv('NEO4J_PASSWORD', ''),

  // Derived
  isDev: optionalEnv('NODE_ENV', 'development') === 'development',
  isProd: optionalEnv('NODE_ENV', 'development') === 'production',
} as const;

export type AppConfig = typeof config;
