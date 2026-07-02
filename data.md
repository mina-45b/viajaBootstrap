# Optimización de carga de imágenes

## Problema
El sitio cargaba 26 imágenes al abrir la página (24 de carruseles + 2 backgrounds), lo que ralentizaba la carga inicial.

## Soluciones implementadas

### 1. Precarga del hero background (`index.html` - `<head>`)
Se añadió `<link rel="preload">` para el background del hero, dándole máxima prioridad de descarga desde el inicio.

### 2. Lazy loading nativo
Las 8 imágenes del primer slide de cada carrusel (las que se ven inicialmente) usan `loading="lazy"`. El navegador las descarga solo cuando la sección está cerca del viewport.

### 3. Carga bajo demanda con `data-src`
Las 16 imágenes de slides 2 y 3 de cada carrusel NO tienen `src`. En su lugar usan `data-src`. Solo se descargan cuando el usuario navega a ese slide, mediante el evento `slide.bs.carousel` de Bootstrap.

### 4. Spinner de carga (`css/style.css`)
Cada slide del carrusel contiene un spinner de Bootstrap (`spinner-border`) centrado absolutamente. Mientras la imagen no se ha descargado:
- Spinner visible
- Imagen oculta (`opacity: 0`)
  
Al cargar la imagen:
- Se añade clase `.loaded` al `.carousel-item`
- Spinner se desvanece (`opacity: 0`, `pointer-events: none`)
- Imagen aparece con transición (`opacity: 1`)

### 5. JavaScript (`js/main.js`)
- `markLoaded(img)`: añade clase `.loaded` al `.carousel-item` contenedor
- Todos los `<img>` del carrusel tienen listeners `load`/`error` desde el inicio
- Imágenes con `src`: si `img.complete` (caché) se marcan al instante
- Imágenes con `data-src`: en `slide.bs.carousel` se asigna `img.src` y se comprueba caché
- `IntersectionObserver` con 200px de margen: al acercarse a la sección #destinos, precarga la imagen activa
- `content-visibility: auto` en `#destinos` + `footer`: el navegador omite renderizado hasta que están cerca del viewport

## Archivos modificados

### `index.html`
- `<link rel="preload">` para backgrounds del hero
- `loading="lazy"` + `width`/`height` en todas las imágenes del carrusel
- `data-src` en slides 2 y 3 (16 imágenes)
- Spinner HTML dentro de cada `.carousel-item`

### `js/main.js`
- Función `markLoaded()` para controlar spinner/imagen
- Listeners `load`/`error` en todas las imágenes del carrusel
- Evento `slide.bs.carousel` para carga bajo demanda
- `IntersectionObserver` para precarga al hacer scroll

### `css/style.css`
- `content-visibility: auto` en `#destinos`
- Reglas para `.carousel-item img` (opacity, transición)
- Reglas para `.spinner-wrapper`
- Reglas para `.carousel-item.loaded` (muestra imagen, oculta spinner)
