import { getStorageItem, StorageKeys } from '@/src/lib/storage';

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

export type ApiFetchOptions<TBody = unknown> = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  query?: QueryParams;
  body?: TBody;
  signal?: AbortSignal;
  authToken?: string | null;
};

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

console.log('baseUrl', BASE_URL);

const defaultTokenGetter = () => {
  try {
    if (typeof window === 'undefined') return null;
    return getStorageItem(StorageKeys.AccessToken);
  } catch {
    return null;
  }
};

function buildUrl(path: string, query?: QueryParams) {
  const p = path.startsWith('/') ? path : `/${path}`;

  const qs = new URLSearchParams();
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      qs.set(k, String(v));
    }
  }
  const q = qs.toString();

  // If BASE_URL is provided, return an ABSOLUTE URL so we don’t hit the frontend origin.
  if (BASE_URL) return `${BASE_URL}${p}${q ? `?${q}` : ''}`;

  // Otherwise, return a RELATIVE URL (useful if Next.js rewrites/proxies to your API).
  return `${p}${q ? `?${q}` : ''}`;
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export async function apiFetch<TResp, TBody = unknown>(
  path: string,
  opts: ApiFetchOptions<TBody> = {},
  getToken: () => string | null = defaultTokenGetter,
): Promise<TResp> {
  const { method = 'GET', headers, query, body, signal, authToken } = opts;
  const url = buildUrl(path, query);
  const token = authToken ?? getToken();

  console.log('URL', url);

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: method !== 'GET' && body !== undefined ? JSON.stringify(body) : undefined,
    signal,
    credentials: 'include',
  });

  const text = await res.text();
  const json = text ? safeJsonParse(text) : undefined;

  if (!res.ok) {
    const { message } = (json as { message: string }) || {};
    const err: ApiError = {
      status: res.status,
      message: message || res.statusText || 'Request failed',
      details: json,
    };
    throw new Error(JSON.stringify(err));
  }
  return json as TResp;
}
