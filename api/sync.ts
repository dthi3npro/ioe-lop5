// Vercel Serverless Function for syncing Mai Nhi's study progress via Upstash Redis / Vercel KV REST API.
// Zero external dependencies — works automatically once Upstash Redis (Free) is connected in Vercel Storage.

interface VercelRequest {
  method?: string;
  body?: unknown;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

const REDIS_KEY = 'ioe_lop5_mainhi_progress_v1';

function getRedisConfig() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    '';
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    '';
  return { url: url.replace(/\/+$/, ''), token };
}

async function redisCommand(
  url: string,
  token: string,
  command: string[]
): Promise<{ result: unknown }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) {
    throw new Error(`Redis REST error: ${res.status}`);
  }
  return (await res.json()) as { result: unknown };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const { url, token } = getRedisConfig();
  if (!url || !token) {
    return res.status(200).json({
      configured: false,
      data: null,
      message: 'Cloud storage chưa được kết nối trên Vercel.',
    });
  }

  try {
    if (req.method === 'GET') {
      const { result } = await redisCommand(url, token, ['GET', REDIS_KEY]);
      const data = typeof result === 'string' ? JSON.parse(result) : null;
      return res.status(200).json({ configured: true, data });
    }

    if (req.method === 'POST') {
      const payload =
        typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ configured: true, error: 'Invalid payload' });
      }
      const enriched = {
        ...(payload as Record<string, unknown>),
        lastSyncedISO: new Date().toISOString(),
      };
      await redisCommand(url, token, ['SET', REDIS_KEY, JSON.stringify(enriched)]);
      return res.status(200).json({
        configured: true,
        ok: true,
        lastSyncedISO: enriched.lastSyncedISO,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({
      configured: true,
      error: err instanceof Error ? err.message : 'Sync failed',
    });
  }
}
