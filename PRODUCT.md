# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Potenciales clientes y colaboradores que quieren evaluar el trabajo, la experiencia y la forma de pensar de Christopher Two.

## Product Purpose

Portfolio profesional para presentar proyectos reales, trayectoria y productos publicados, y facilitar el contacto para nuevas conversaciones.

## Positioning

Presenta el trabajo desde el resultado y el contexto de ingeniería, no como una colección de demos aisladas.

## Operating Context

La web se consulta principalmente desde navegador en escritorio y móvil durante una primera evaluación profesional.

## Capabilities and Constraints

- El contenido y las rutas existentes deben conservarse durante el rediseño.
- Las páginas incluyen inicio, biografía, proyectos, detalles de proyecto, productos y documentos de Spot.
- La navegación compartida permite explorar proyectos, conocer la historia, revisar Override y contactar.
- El proyecto usa Astro, TypeScript, CSS nativo y Cloudflare Workers.

## Brand Commitments

- Nombre: Christopher Two.
- Voz y contenido principales en español.
- Deben conservarse los proyectos, enlaces, imagen de perfil y contenido editorial existentes.
- La primera pantalla debe priorizar proyectos y contacto.

## Evidence on Hand

- Datos de proyectos en `src/data/portfolio.ts`.
- Contenido editorial en `src/features/` y `src/content/spot/`.
- Imagen de perfil en `src/assets/images/IMG_6195.jpg`.
- Rutas Astro en `src/pages/`.

## Product Principles

- Mostrar trabajo real antes que promesas abstractas.
- Hacer que explorar proyectos y contactar sea inmediato.
- Mantener el contenido legible en escritorio y móvil.
- Respetar las preferencias de movimiento y las interacciones de teclado.

## Accessibility & Inclusion

La interfaz debe conservar navegación por teclado, foco visible, contraste legible, composición responsive y una alternativa sin animaciones mediante `prefers-reduced-motion`.
