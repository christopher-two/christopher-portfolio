import { siteUrl } from '../data/site';

const segmentLabels: Record<string, string> = {
  bio: 'Sobre mí',
  override: 'Override',
  daelia: 'Daelia',
  lumi: 'Lumi',
  parse: 'Parse',
  projects: 'Proyectos',
  resume: 'Resumen de proyectos',
  spot: 'Spot',
  privacy: 'Privacidad',
  terms: 'Términos y condiciones',
  versions: 'Versiones',
};

export function getBreadcrumbItems(pathname: string, title: string) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  if (normalizedPath === '/' || normalizedPath === '/landing') {
    return [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: `${siteUrl}/landing` }];
  }

  const segments = normalizedPath.split('/').filter(Boolean);
  const items = [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: `${siteUrl}/landing` }];
  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isCurrentPage = index === segments.length - 1;
    const name = segmentLabels[segment] ?? (isCurrentPage
      ? title.split(/\s+[·|]\s+/)[0]
      : segment.replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()));

    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name,
      item: `${siteUrl}${currentPath}`,
    });
  });

  return items;
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}
