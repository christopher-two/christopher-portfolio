import { env } from 'cloudflare:workers';

export interface ProjectMedia {
  key: string;
  url: string;
  description: string;
  isVideo: boolean;
}

function prefixesFor(folder: string) {
  const clean = folder.replace(/^\/+|\/+$/g, '');
  const withoutProjects = clean.replace(/^projects\//i, '');
  return [...new Set([clean, `projects/${withoutProjects}`, withoutProjects])]
    .filter(Boolean)
    .map((prefix) => `${prefix}/`);
}

export async function getProjectMedia(folder: string, maxItems = 12): Promise<ProjectMedia[]> {
  const bucket = env.PROJECTS_BUCKET;
  if (!bucket || !folder) return [];

  for (const prefix of prefixesFor(folder)) {
    const listing = await bucket.list({ prefix, limit: Math.min(1000, maxItems + 1) });
    const mediaObjects = listing.objects.filter((object) => {
      const key = object.key.toLowerCase();
      return !object.key.endsWith('/') && /\.(avif|gif|jpe?g|png|svg|webp|mp4|webm)$/i.test(key);
    });
    if (mediaObjects.length === 0) continue;

    return mediaObjects.slice(0, maxItems).map((object) => ({
      key: object.key,
      url: `/api/r2-image?key=${encodeURIComponent(object.key)}`,
      description: object.key.split('/').pop() ?? object.key,
      isVideo: /\.(mp4|webm)$/i.test(object.key),
    }));
  }

  return [];
}

export async function getProjectCoverImage(folder: string): Promise<string> {
  const [cover] = await getProjectMedia(folder, 1);
  return cover?.url ?? '';
}
