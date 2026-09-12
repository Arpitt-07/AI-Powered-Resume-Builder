import { NextRequest, NextResponse } from 'next/server';

interface RateLimitData {
  count: number;
  resetTime: number;
}

type RouteHandler<TContext = any> = (req: NextRequest, context: TContext) => Promise<NextResponse | Response>;

const rateLimitMap = new Map<string, RateLimitData>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 10;


setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000); 

export function rateLimit<TContext = any>(handler: RouteHandler<TContext>) {
  return async (req: NextRequest, context: TContext) => {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || crypto.randomUUID();
    const now = Date.now();

    const userData = rateLimitMap.get(ip);

    if (!userData || now > userData.resetTime) {
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + WINDOW_MS,
      });
    } else {
      if (userData.count >= MAX_REQUESTS) {
        return new NextResponse(
          JSON.stringify({ error: 'Too Many Requests' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
      userData.count++;
      rateLimitMap.set(ip, userData);
    }

    return handler(req, context);
  };
}
