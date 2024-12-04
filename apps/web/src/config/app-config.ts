import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';
import { name as packageName } from '../../package.json';

const appName = packageName || 'default-app-name';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_AUTH_GOOGLE_ENABLED: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true'),
    NEXT_PUBLIC_AUTH_DISCORD_ENABLED: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_AUTH_GOOGLE_ENABLED:
      process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED,
    NEXT_PUBLIC_AUTH_DISCORD_ENABLED:
      process.env.NEXT_PUBLIC_AUTH_DISCORD_ENABLED,
  },
});

// Client-safe configuration
export const clientConfig = {
  APP_NAME: appName,
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  SUPABASE: {
    URL: env.NEXT_PUBLIC_SUPABASE_URL,
    ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  SENTRY: {
    ENABLED: false,
    DSN: '',
  },
  AUTH: {
    GOOGLE: {
      ENABLED: env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED,
    },
    DISCORD: {
      ENABLED: env.NEXT_PUBLIC_AUTH_DISCORD_ENABLED,
    },
  },
} as const;

// Log configuration on startup
console.info('🕵️‍♂️ :: Client Config loaded');
