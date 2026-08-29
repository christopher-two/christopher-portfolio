export type GithubActivityItem = {
  id: string;
  type: 'commit' | 'pull-request' | 'release' | 'issue';
  label: string;
  title: string;
  repository: string;
  date: string;
  url: string;
  detail: string;
};

type GithubEvent = {
  id: string;
  type: string;
  repo?: { name?: string };
  created_at: string;
  payload?: {
    ref?: string;
    size?: number;
    action?: string;
    commits?: Array<{ message?: string; sha?: string }>;
    pull_request?: { html_url?: string; title?: string; number?: number };
    issue?: { html_url?: string; title?: string; number?: number };
    release?: { html_url?: string; name?: string; tag_name?: string };
  };
};

const cache = new Map<string, { expiresAt: number; data: GithubActivityItem[] }>();
const cacheTtl = 15 * 60 * 1000;

function repositoryName(value = '') {
  return value.split('/').pop() || value;
}

function formatCommitTitle(message = '') {
  return message.split('\n')[0]?.trim() || 'Actualización de código';
}

function mapEvent(event: GithubEvent): GithubActivityItem | null {
  const repository = event.repo?.name ?? '';
  const payload = event.payload;
  if (!repository || !payload) return null;

  if (event.type === 'PushEvent') {
    const commit = payload.commits?.[0];
    if (!commit) return null;
    return {
      id: event.id,
      type: 'commit',
      label: 'Commit',
      title: formatCommitTitle(commit.message),
      repository: repositoryName(repository),
      date: event.created_at,
      url: `https://github.com/${repository}/commit/${commit.sha}`,
      detail: `${payload.size ?? payload.commits?.length ?? 1} cambio${(payload.size ?? payload.commits?.length ?? 1) === 1 ? '' : 's'}`,
    };
  }

  if (event.type === 'PullRequestEvent' && payload.pull_request) {
    return {
      id: event.id,
      type: 'pull-request',
      label: `Pull request · ${payload.action ?? 'actualizada'}`,
      title: payload.pull_request.title ?? 'Pull request',
      repository: repositoryName(repository),
      date: event.created_at,
      url: payload.pull_request.html_url ?? `https://github.com/${repository}/pulls`,
      detail: `#${payload.pull_request.number ?? ''}`,
    };
  }

  if (event.type === 'ReleaseEvent' && payload.release) {
    return {
      id: event.id,
      type: 'release',
      label: 'Release',
      title: payload.release.name ?? payload.release.tag_name ?? 'Nueva versión',
      repository: repositoryName(repository),
      date: event.created_at,
      url: payload.release.html_url ?? `https://github.com/${repository}/releases`,
      detail: payload.release.tag_name ?? 'publicada',
    };
  }

  if (event.type === 'IssuesEvent' && payload.issue) {
    return {
      id: event.id,
      type: 'issue',
      label: `Issue · ${payload.action ?? 'actualizada'}`,
      title: payload.issue.title ?? 'Issue',
      repository: repositoryName(repository),
      date: event.created_at,
      url: payload.issue.html_url ?? `https://github.com/${repository}/issues`,
      detail: `#${payload.issue.number ?? ''}`,
    };
  }

  return null;
}

export async function getGithubActivity(username: string, limit = 6): Promise<GithubActivityItem[]> {
  const cached = cache.get(username);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'christopher-portfolio' },
    });
    if (!response.ok) return cached?.data ?? [];

    const events = (await response.json()) as GithubEvent[];
    const activity = events.map(mapEvent).filter((item): item is GithubActivityItem => Boolean(item)).slice(0, limit);
    cache.set(username, { expiresAt: Date.now() + cacheTtl, data: activity });
    return activity;
  } catch {
    return cached?.data ?? [];
  }
}
