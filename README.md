# Beauty Jess — Web oficial

Sitio web de **Beauty Jess**, centro de estética avanzada y parafarmacia en Roses (Girona, Costa Brava).

One-page premium en **HTML + CSS + JS vanilla**, sin frameworks ni dependencias externas: las tipografías (Fraunces y Figtree) van autoalojadas en `/fonts`, así que la web no hace ninguna petición a terceros (mejor RGPD, mejor rendimiento).

## Estructura

```
├── index.html              ← la web (todo el copy editable está aquí)
├── css/style.css           ← estilos de la home (tokens de marca en :root)
├── js/script.js            ← menú, filtros, antes/después, reels, animaciones
├── assets/instagram/
│   ├── README-ASSETS.md    ← ⭐ guía: qué fotos/vídeos subir y con qué nombre
│   ├── images/             ← fotos reales (gallery-01.jpg, jess-retrato.jpg…)
│   └── videos/             ← vídeos verticales (hero-reel.mp4, reel-01.mp4…)
├── fonts/                  ← Fraunces + Figtree (variable, subset latin)
├── img/                    ← favicons + og-cover.jpg (imagen al compartir)
├── css/styles.css          ← estilos antiguos (los usan las páginas legales)
├── js/main.js              ← JS antiguo (lo usan las páginas legales)
├── aviso-legal.html · privacidad.html · cookies.html
├── 404.html · robots.txt · sitemap.xml
```

## 📸 Activar las fotos y vídeos reales

La web es publicable tal cual: cada hueco de imagen/vídeo muestra un
placeholder elegante de marca hasta que exista el archivo. Para activarlos:

1. Exporta el material de Instagram (o usa los originales, mejor calidad).
2. Renómbralo según la tabla de `assets/instagram/README-ASSETS.md`
   (p. ej. `hero-reel.mp4`, `gallery-01.jpg`, `resultado-01-antes.jpg`).
3. Súbelo a `assets/instagram/images/` o `/videos/` y haz push.
   Aparece automáticamente; no hay que tocar código.

## ✅ Pendiente antes/después de publicar

| Qué | Dónde |
|---|---|
| **Reseñas reales de Google** (ahora placeholders) | `index.html` → sección Opiniones, busca "Pega aquí" |
| **Fotos y vídeos reales** | `assets/instagram/` (ver guía) |
| Datos del titular (razón social, NIF) | `aviso-legal.html` y `privacidad.html` |
| Imagen para compartir (foto real 1200×630) | sustituir `img/og-cover.jpg` |
| Coordenadas exactas del local | JSON-LD del `<head>` (`geo`), ahora aproximadas |

> ⚠️ Las reseñas son placeholders **a propósito**: no se ha inventado ningún
> testimonio. Cópialas palabra por palabra de la ficha de Google Business.

## ✏️ Ediciones habituales

- **Textos**: todo el copy está en `index.html`, en orden de aparición.
- **Teléfono/WhatsApp**: buscar y reemplazar `637332622` (enlaces `wa.me` y `tel:`).
- **Colores de marca**: variables al inicio de `css/style.css` (`--cream`, `--blush`, `--gold`, `--ink`…).
- **Añadir un tratamiento**: duplica un `<article class="treat">` en la sección
  Tratamientos y ajusta `data-cat` (`facial`, `corporal`, `laser` o combinados).

## 🚀 Publicación

GitHub Pages sirve la rama `main` (**Settings → Pages → Deploy from a branch →
`main` / `(root)`**): cada push a `main` despliega automáticamente en 1-2
minutos. No hay paso de build.

### Conectar el dominio beautyjess.es

Cuando quieras usar el dominio propio (no antes — si no, la URL de github.io redirigiría a un dominio sin configurar):

1. Crea en la raíz del repo un archivo llamado `CNAME` (sin extensión) con una sola línea: `beautyjess.es`, y haz push.
2. En el panel DNS del dominio, crea estos registros:
   - 4 registros **A** para `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - 1 registro **CNAME** para `www` → `TU_USUARIO.github.io`
3. En **Settings → Pages**, escribe `beautyjess.es` en *Custom domain* y, cuando valide, activa **Enforce HTTPS**.

La propagación DNS puede tardar de minutos a 24 h.

## 🔍 Qué está ya cuidado

- **SEO local**: title/description optimizados, JSON-LD `BeautySalon` con NAP completo, Open Graph + Twitter card, sitemap, robots, canonical, H1 único.
- **Conversión**: WhatsApp con mensaje precargado en cada tratamiento, doble CTA en hero y cierre, botón flotante, teléfono clicable.
- **Accesibilidad**: skip-link, focus visible, navegación por teclado (incluido el comparador antes/después), ARIA en menú/filtros, `prefers-reduced-motion` respetado.
- **Rendimiento**: cero dependencias, fuentes variables locales con `preload` + `font-display: swap`, `loading="lazy"` en imágenes, vídeos con `preload="none"`.
- **RGPD**: sin cookies ni peticiones a terceros; páginas legales listas para completar.

---

© 2026 Beauty Jess · Roses, Costa Brava. Código y contenidos para uso exclusivo de Beauty Jess.
