# BeautyJess — Web oficial

Sitio web de **BeautyJess**, centro de estética avanzada y parafarmacia en Roses (Girona, Costa Brava).

One-page premium en **HTML + CSS + JS vanilla**, sin frameworks ni dependencias externas: las tipografías (Fraunces y Figtree) van autoalojadas en `/fonts`, así que la web no hace ninguna petición a terceros (mejor RGPD, mejor rendimiento, funciona incluso offline una vez cargada).

## Estructura

```
├── index.html            ← la web (todo el contenido editable está aquí)
├── css/styles.css        ← estilos (los colores de marca están en :root, al inicio)
├── js/main.js            ← menú móvil, filtros de tratamientos, animaciones
├── fonts/                ← Fraunces + Figtree (variable, subset latin)
├── img/
│   ├── favicon.svg / favicon-32.png / apple-touch-icon.png
│   └── og-cover.jpg      ← imagen al compartir por WhatsApp/redes (provisional)
├── aviso-legal.html      ← páginas legales (completar datos del titular)
├── privacidad.html
├── cookies.html
├── 404.html              ← página de error (GitHub Pages la usa automáticamente)
├── robots.txt
└── sitemap.xml
```

## ✅ Antes de publicar — checklist `[CONFIRMAR]`

Busca `[CONFIRMAR]` en el código (hay un resumen comentado al inicio de `index.html`):

| Qué | Dónde |
|---|---|
| **Reseñas reales de Google** (ahora hay placeholders) | `index.html` → sección Opiniones, busca "Pega aquí" |
| **Fotos reales** del centro y tratamientos | busca los comentarios `FOTO REAL` y los bloques "Foto real pendiente" |
| Instagram activo (¿@beautyjess.es o @beautyjess_oficial?) | `index.html` → footer y JSON-LD del `<head>` |
| Horario actual | `index.html` → Contacto + footer + JSON-LD |
| Marcas de aparatología y dermocosmética | secciones Tecnología y Parafarmacia |
| Datos del titular (razón social, NIF) | `aviso-legal.html` y `privacidad.html` (marcados en amarillo) |
| Imagen para compartir (foto real 1200×630) | sustituir `img/og-cover.jpg` |
| Coordenadas exactas del local | JSON-LD del `<head>` (`geo`), ahora aproximadas |

> ⚠️ Las reseñas son placeholders **a propósito**: no se ha inventado ningún testimonio. Cópialas palabra por palabra de la ficha de Google Business.

## ✏️ Ediciones habituales

- **Textos**: todo el copy está en `index.html`, en orden de aparición.
- **Teléfono/WhatsApp**: buscar y reemplazar `637332622` (aparece en enlaces `wa.me` y `tel:`).
- **Colores de marca**: variables al inicio de `css/styles.css` (`--porcelana`, `--tinta`, `--coral`…).
- **Añadir un tratamiento**: duplica un `<article class="card">` en la sección Tratamientos y ajusta `data-cat` (`facial`, `corporal`, `laser` o combinados).
- **Precios**: si se decide mostrarlos, usar el color coral solo para el precio/CTA (regla de marca).

## 🚀 Publicar en GitHub Pages (gratis)

1. Crea un repositorio en GitHub (por ejemplo `beautyjess-web`).
2. Desde esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "Web BeautyJess v1"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/beautyjess-web.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
4. En 1-2 minutos la web estará en `https://TU_USUARIO.github.io/beautyjess-web/`.

### Conectar el dominio beautyjess.es

Cuando quieras usar el dominio propio (no antes — si no, la URL de github.io redirigiría a un dominio sin configurar):

1. Crea en la raíz del repo un archivo llamado `CNAME` (sin extensión) con una sola línea: `beautyjess.es`, y haz push.
2. En el panel DNS del dominio, crea estos registros:
   - 4 registros **A** para `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - 1 registro **CNAME** para `www` → `TU_USUARIO.github.io`
3. En **Settings → Pages**, escribe `beautyjess.es` en *Custom domain* y, cuando valide, activa **Enforce HTTPS**.

La propagación DNS puede tardar de minutos a 24 h.

## 🔍 Qué está ya cuidado

- **SEO local**: title/description optimizados, JSON-LD `BeautySalon` con NAP completo, Open Graph + Twitter card, sitemap, robots, canonical, H1 único y H2/H3 con keywords de Roses.
- **Conversión**: 13 puntos de contacto a WhatsApp con mensaje precargado (y el tratamiento ya escrito en cada card), botón flotante, teléfono clicable.
- **Accesibilidad AA**: contraste verificado, focus visible, skip-link, navegación por teclado, `prefers-reduced-motion` respetado, ARIA en menú/filtros/acordeón.
- **Rendimiento**: cero dependencias, fuentes variables locales con `preload` + `font-display: swap`, JS de 2 KB, sin imágenes pesadas.
- **RGPD**: sin cookies ni peticiones a terceros (lo dice, con verdad, la política de cookies); páginas legales listas para completar.

---

© 2026 BeautyJess · Roses, Costa Brava. Código y contenidos para uso exclusivo de BeautyJess.
