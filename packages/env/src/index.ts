import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z.string().default('3000'),
    API_BASE_URL: z.string().url().optional(),
    API_TIMEOUT: z.coerce.number().min(0).default(30000),
    API_KEY: z.string().min(1).default('UPDATE ME'),
    REDIS_URL: z.string().optional(),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_USER: z.string().min(1).optional(),
    REDIS_PASSWORD: z.string().min(1).optional(),
    RATE_LIMIT_API_WINDOW_MS: z.coerce.number().default(60000),
    RATE_LIMIT_API_MAX_REQUESTS: z.coerce.number().default(100),
    RATE_LIMIT_API_FAILURE_THRESHOLD: z.coerce.number().default(10),
    RATE_LIMIT_AUTH_WINDOW_MS: z.coerce.number().default(900000),
    RATE_LIMIT_AUTH_MAX_ATTEMPTS: z.coerce.number().default(5),
    OPENAI_API_KEY: z.string().min(1).optional(),
    SENTRY_SECRET_KEY: z.string().min(1).optional(),
    SENTRY_DB_PASSWORD: z.string().min(1).optional(),
    SENTRY_ENABLED: z.boolean().default(false),
    SENTRY_DSN: z.string().url().optional(),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
    STRIPE_PRICE_ID: z.string().min(1).optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  },
  clientPrefix: 'NEXT_PUBLIC_',
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  onInvalidAccess(variable) {
    console.error(`🚨 :: Invalid access to ${variable}`);
    throw new Error(`🚨 :: Invalid access to ${variable}`);
  },
});
export type Env = typeof env;
