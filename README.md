# Paloma & José Ramón — 23.01.2027

Landing de boda. Next.js (App Router) + SCSS, desplegada en Vercel.

## Desarrollo

```bash
npm install
npm run dev
```

## Stack

- **Next.js 16** — App Router, TypeScript
- **SCSS** — sistema de tokens en `src/styles/abstracts`
- **Resend** — aviso por email en cada confirmación
- **Google Sheets API** — destino del formulario de asistencia

## Estructura

```
src/
  app/          rutas y API
  components/   componentes de sección
  styles/
    abstracts/  variables y mixins
    globals.scss
public/assets/
  svg/  img/  audio/
```

## Variables de entorno

Copiar `.env.example` a `.env.local` y rellenar.

## Pendiente

- Assets definitivos del diseño (SVGs, foto, animación del sobre)
- Confirmar hex exactos de la paleta contra el archivo de Illustrator
- Dominio
