import { env } from 'cloudflare:workers';

export interface ProjectMedia {
  key: string;
  url: string;
  description: string;
  isVideo: boolean;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const mediaCache = new Map<string, { expiresAt: number; data: ProjectMedia[] }>();
const inflightRequests = new Map<string, Promise<ProjectMedia[]>>();

function prefixesFor(folder: string) {
  const clean = folder.replace(/^\/+|\/+$/g, '');
  const withoutProjects = clean.replace(/^projects\//i, '');
  return [...new Set([clean, `projects/${withoutProjects}`, withoutProjects])]
    .filter(Boolean)
    .map((prefix) => `${prefix}/`);
}

export async function getProjectMedia(folder: string, maxItems = Number.POSITIVE_INFINITY): Promise<ProjectMedia[]> {
  const bucket = env.PROJECTS_BUCKET;
  if (!bucket || !folder) return [];

  const cacheKey = `${folder}::${maxItems}`;
  const cached = mediaCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const inflight = inflightRequests.get(cacheKey);
  if (inflight) {
    return inflight;
  }

  const request = (async () => {
    try {
      for (const prefix of prefixesFor(folder)) {
        const mediaObjects: R2Object[] = [];
        let cursor: string | undefined;
        do {
          const listing = await bucket.list({ prefix, limit: Math.min(1000, maxItems - mediaObjects.length), cursor });
          mediaObjects.push(...listing.objects.filter((object) => {
            const key = object.key.toLowerCase();
            return !object.key.endsWith('/') && /\.(avif|gif|jpe?g|png|svg|webp|mp4|webm)$/i.test(key);
          }));
          cursor = listing.truncated ? listing.cursor : undefined;
        } while (cursor && mediaObjects.length < maxItems);
        if (mediaObjects.length === 0) continue;

        const result = mediaObjects.slice(0, maxItems).map((object) => ({
          key: object.key,
          url: `/api/r2-image?key=${encodeURIComponent(object.key)}`,
          description: object.key.split('/').pop() ?? object.key,
          isVideo: /\.(mp4|webm)$/i.test(object.key),
        }));
        mediaCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, data: result });
        return result;
      }

      mediaCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, data: [] });
      return [];
    } finally {
      inflightRequests.delete(cacheKey);
    }
  })();

  inflightRequests.set(cacheKey, request);
  return request;
}

export async function getProjectCoverImage(folder: string): Promise<string> {
  const media = await getProjectMedia(folder, 8);
  const image = media.find((item) => !item.isVideo);
  return image?.url ?? '';
}
