import { projects } from '../data/portfolio';
import { publishedApps } from '../data/seo';
import { organizationSchema, siteDescription, siteName, siteUrl } from '../data/site';

export const prerender = true;

export function GET() {
  const body = `# Christopher Two

> ${siteDescription}

Christopher Two es la identidad profesional de Christopher Alejandro Maldonado Chávez, desarrollador multiplataforma que diseña y construye productos digitales desde Uruapan, México, para equipos y usuarios de cualquier lugar.

Este archivo es un índice breve para sistemas de búsqueda, asistentes y agentes. Para el contenido completo y las descripciones extensas de proyectos consulta [llms-full.txt](${siteUrl}/llms-full.txt).

## Entidad principal

- Nombre: Christopher Alejandro Maldonado Chávez
- Marca profesional: ${siteName}
- Rol: Desarrollador multiplataforma y software engineer
- Ubicación: Uruapan, Michoacán, México
- Modalidad: colaboración remota y productos digitales
- Contacto: hola@christopher.com.mx
- Organización relacionada: [Override](${organizationSchema.url})
- Perfil profesional: [biografía](${siteUrl}/bio)

## Qué hace

Christopher convierte problemas complejos en productos simples de usar. Su trabajo cubre descubrimiento técnico, arquitectura, desarrollo multiplataforma, aplicaciones Android, interfaces web, backend, despliegue y evolución de productos existentes.

## Áreas de experiencia

- Kotlin y Kotlin Multiplatform
- Jetpack Compose y Compose Multiplatform
- Android nativo
- Astro, TypeScript y CSS nativo
- Ktor, Firebase, Supabase y Cloudflare Workers
- Clean Architecture, MVI, MVVM y diseño modular
- IA aplicada y procesamiento on-device
- Productos digitales, sistemas internos y experiencias web

## Evidencia pública

- Portfolio de trabajo: [proyectos](${siteUrl}/projects)
- Resumen de proyectos: [resumen imprimible](${siteUrl}/projects/resume)
- Productos publicados en Google Play: ${publishedApps.map((app) => `[${app.name}](${app.href})`).join(', ')}
- Reconocimientos y lanzamientos: disponibles en la [página principal](${siteUrl}/landing)

## Proyectos

${projects.map((project) => `- [${project.title}](${siteUrl}/projects/${project.slug}): ${project.description} Tecnologías y categorías: ${project.tags.slice(0, 8).join(', ')}.`).join('\n')}

## Páginas prioritarias

- [Inicio y contacto (ES)](${siteUrl}/landing)
- [English overview (EN)](${siteUrl}/en)
- [Sobre Christopher](${siteUrl}/bio)
- [Archivo completo de proyectos](${siteUrl}/projects)
- [Override, empresa de software](${siteUrl}/override)
- [Spot, producto de geocaching emocional](${siteUrl}/spot)
- [Daelia, laboratorio de experimentos](${siteUrl}/daelia)
- [Lumi, experimento de IA y códigos QR](${siteUrl}/lumi)
- [Parse, lector Android](${siteUrl}/parse)

## Archivos para agentes

- [Sitemap XML](${siteUrl}/sitemap.xml)
- [Robots.txt](${siteUrl}/robots.txt)
- [Contenido completo en Markdown](${siteUrl}/llms-full.txt)
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
