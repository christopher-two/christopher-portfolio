import { projects } from '../lib/data';

export type SiteRoute = {
  path: string;
  label: string;
  description: string;
  includeInSitemap?: boolean;
  lastmod?: string;
};

export type SiteRouteGroup = {
  label: string;
  routes: SiteRoute[];
};

const DEFAULT_LASTMOD = '2026-11-23';

const projectRoutes: SiteRoute[] = projects.map((project) => ({
  path: `/projects/${project.slug}`,
  label: project.title,
  description: project.description,
  lastmod: DEFAULT_LASTMOD,
}));

export const siteRouteGroups: SiteRouteGroup[] = [
  {
    label: 'Entradas',
    routes: [
      { path: '/', label: 'Entrada principal', description: 'Redirige a la landing principal.', includeInSitemap: false },
      { path: '/landing', label: 'Inicio', description: 'Presentación, trabajo, productos y contacto.', lastmod: DEFAULT_LASTMOD },
      { path: '/en', label: 'English overview', description: 'English summary of Christopher Two, projects, and published apps.', lastmod: DEFAULT_LASTMOD },
      { path: '/routes', label: 'Mapa del sitio', description: 'Índice completo de las rutas públicas del proyecto.', lastmod: DEFAULT_LASTMOD },
    ],
  },
  {
    label: 'Portafolio',
    routes: [
      { path: '/bio', label: 'Sobre mí', description: 'Historia, experiencia y forma de trabajar.', lastmod: '2026-08-29' },
      { path: '/projects', label: 'Proyectos', description: 'Archivo completo de proyectos y case studies.', lastmod: DEFAULT_LASTMOD },
      { path: '/projects/resume', label: 'Resumen de proyectos', description: 'Vista resumida e imprimible del trabajo.', lastmod: DEFAULT_LASTMOD },
    ],
  },
  {
    label: 'Productos y laboratorios',
    routes: [
      { path: '/override', label: 'Override', description: 'Empresa y productos de software.', lastmod: '2026-08-29' },
      { path: '/daelia', label: 'Daelia', description: 'Laboratorio de experimentos digitales.', lastmod: '2026-08-29' },
      { path: '/lumi', label: 'Lumi', description: 'Experimento de IA, QR y experiencias interactivas.', lastmod: '2026-08-29' },
      { path: '/parse', label: 'Parse', description: 'Lector de libros y PDFs para Android.', lastmod: '2026-08-29' },
      { path: '/spot', label: 'Spot', description: 'Producto de geocaching emocional.', lastmod: '2026-08-29' },
    ],
  },
  {
    label: 'Documentación de Spot',
    routes: [
      { path: '/spot/privacy', label: 'Privacidad', description: 'Política de privacidad de Spot.', lastmod: '2026-01-06' },
      { path: '/spot/terms', label: 'Términos', description: 'Términos y condiciones de Spot.', lastmod: '2026-01-06' },
      { path: '/spot/versions', label: 'Versiones', description: 'Historial de versiones de Spot.', lastmod: '2026-01-06' },
    ],
  },
  {
    label: 'Case studies',
    routes: projectRoutes,
  },
  {
    label: 'Recursos públicos',
    routes: [
      { path: '/robots.txt', label: 'Robots.txt', description: 'Reglas de rastreo del sitio.', includeInSitemap: false },
      { path: '/sitemap.xml', label: 'Sitemap XML', description: 'Mapa XML de páginas indexables.', includeInSitemap: false },
      { path: '/llms.txt', label: 'LLMs.txt', description: 'Índice breve para asistentes y agentes.', includeInSitemap: false },
      { path: '/llms-full.txt', label: 'LLMs full', description: 'Contenido completo para sistemas de búsqueda.', includeInSitemap: false },
      { path: '/manifest.webmanifest', label: 'Manifest', description: 'Metadatos instalables de la web.', includeInSitemap: false },
    ],
  },
];

export const sitemapRoutes = siteRouteGroups
  .flatMap((group) => group.routes)
  .filter((route) => route.includeInSitemap !== false);

export const sitemapRoutePaths = sitemapRoutes.map((route) => route.path);
