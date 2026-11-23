# Contribuir

Gracias por tu interés en este proyecto.

## Requisitos

- Node.js `>= 22`
- `pnpm` (`>= 10`)

## Flujo de trabajo

1. Haz fork del repositorio y crea una rama desde `main`:
   ```bash
   git checkout -b fix/nombre-del-cambio
   ```
2. Instala las dependencias y levanta el entorno local:
   ```bash
   pnpm install
   pnpm dev
   ```
3. Mantén la coherencia con el sistema visual descrito en [DESIGN.md](DESIGN.md) y [PRODUCT.md](PRODUCT.md) (paleta monocromática, accesibilidad por teclado, soporte `prefers-reduced-motion`, iconos SVG en lugar de emojis).
4. Verifica tipos y build antes de abrir el Pull Request:
   ```bash
   pnpm build
   ```

## Notas sobre secretos

Nunca incluyas archivos `.env`, `.dev.vars`, tokens ni credenciales en commits o Pull Requests. Usa `.dev.vars.example` como referencia local.
