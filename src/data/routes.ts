import { projects } from '../lib/data';

export type SiteRoute = {
  path: string;
  label: string;
  description: string;
  includeInSitemap?: boolean;
};

export type SiteRouteGroup = {
  label: string;
  routes: SiteRoute[];
};

const projectRoutes: SiteRoute[] = projects.map((project) => ({
  path: `/projects/${project.slug}`,
  label: project.title,
  description: project.description,
}));

export const siteRouteGroups: SiteRouteGroup[] = [
  {
    label: 'Entradas',
    routes: [
      { path: '/', label: 'Entrada principal', description: 'Redirige a la landing principal.', includeInSitemap: false },
      { path: '/landing', label: 'Inicio', description: 'Presentación, trabajo, productos y contacto.' },
      { path: '/routes', label: 'Mapa del sitio', description: 'Índice completo de las rutas públicas del proyecto.' },
    ],
  },
  {
    label: 'Portafolio',
    routes: [
      { path: '/bio', label: 'Sobre mí', description: 'Historia, experiencia y forma de trabajar.' },
      { path: '/projects', label: 'Proyectos', description: 'Archivo completo de proyectos y case studies.' },
      { path: '/projects/resume', label: 'Resumen de proyectos', description: 'Vista resumida e imprimible del trabajo.' },
    ],
  },
  {
    label: 'Productos y laboratorios',
    routes: [
      { path: '/override', label: 'Override', description: 'Empresa y productos de software.' },
      { path: '/daelia', label: 'Daelia', description: 'Laboratorio de experimentos digitales.' },
      { path: '/lumi', label: 'Lumi', description: 'Experimento de IA, QR y experiencias interactivas.' },
      { path: '/parse', label: 'Parse', description: 'Lector de libros y PDFs para Android.' },
      { path: '/spot', label: 'Spot', description: 'Producto de geocaching emocional.' },
    ],
  },
  {
    label: 'Documentación de Spot',
    routes: [
      { path: '/spot/privacy', label: 'Privacidad', description: 'Política de privacidad de Spot.' },
      { path: '/spot/terms', label: 'Términos', description: 'Términos y condiciones de Spot.' },
      { path: '/spot/versions', label: 'Versiones', description: 'Historial de versiones de Spot.' },
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

export const sitemapRoutePaths = siteRouteGroups
  .flatMap((group) => group.routes)
  .filter((route) => route.includeInSitemap !== false)
  .map((route) => route.path);
