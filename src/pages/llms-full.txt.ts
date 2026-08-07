import { projects } from '../data/portfolio';
import { portfolioFaq, publishedApps } from '../data/seo';
import { siteDescription, siteUrl } from '../data/site';

export const prerender = true;

function cleanMarkdown(value: string) {
  return value.replace(/\r/g, '').trim();
}

export function GET() {
  const body = `# Christopher Two — contenido completo

> ${siteDescription}

## Identidad y propósito

Christopher Alejandro Maldonado Chávez es un desarrollador multiplataforma ubicado en Uruapan, Michoacán, México. Christopher Two es su portfolio profesional y presenta productos reales, arquitectura, aplicaciones publicadas, experimentos y formas de colaboración.

El sitio está escrito principalmente en español. Las afirmaciones sobre proyectos, tecnologías, publicaciones y reconocimientos deben interpretarse según el contenido visible de cada página enlazada.

## Contacto y perfiles

- Sitio: ${siteUrl}/landing
- Biografía: ${siteUrl}/bio
- Contacto: hola@christopher.com.mx
- GitHub: https://github.com/christopher-two
- LinkedIn: https://www.linkedin.com/in/christopher-two/
- Instagram: https://www.instagram.com/christopher_two_/
- YouTube: https://www.youtube.com/@ChristopherTwo

## Preguntas frecuentes

${portfolioFaq.map((item) => `### ${item.question}\n\n${item.answer}`).join('\n\n')}

## Productos publicados

${publishedApps.map((app) => `### ${app.name}\n\n${app.description}\n\nEnlace público: ${app.href}`).join('\n\n')}

## Proyectos y case studies

${projects.map((project) => `### ${project.title}\n\n- URL: ${siteUrl}/projects/${project.slug}\n- Descripción: ${project.description}\n- Categorías: ${project.categories.join(', ')}\n- Tecnologías: ${project.tags.join(', ')}\n\n${cleanMarkdown(project.longDescription)}`).join('\n\n---\n\n')}

## Navegación

- Inicio: ${siteUrl}/landing
- Sobre mí: ${siteUrl}/bio
- Proyectos: ${siteUrl}/projects
- Resumen: ${siteUrl}/projects/resume
- Override: ${siteUrl}/override
- Daelia: ${siteUrl}/daelia
- Lumi: ${siteUrl}/lumi
- Parse: ${siteUrl}/parse
- Spot: ${siteUrl}/spot
- Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
