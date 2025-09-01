# Vibes Marketplace

Un mini marketplace desarrollado con Express.js y Next.js 


## 🚀 Instalación y Configuración

### 1. Instalar dependencias del frontend

```bash
npm install
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
cd ..
```

### 3) Base de datos (MongoDB)

- Requisito: MongoDB local (o una instancia remota). Por defecto se usa:
  - `MONGODB_URI = mongodb://localhost:27017/vibes-marketplace`
- Variables de entorno relevantes (backend):
  - `USE_MONGODB=true` para activar el repositorio Mongo en el servidor.
  - `MONGODB_URI` (opcional) para apuntar a otra instancia.

Seed inicial (carga datos desde `backend/src/data/products.json`):

```bash
cd backend
npm run seed:mongo
cd ..
```

Notas Windows: ya está configurado `cross-env`, por lo que los scripts `dev:mongo` y `seed:mongo` funcionan sin pasos extra.


## 🏃‍♂️ Ejecutar el Proyecto

### Opción A: Ambos servicios simultáneamente (frontend + backend dev)

```bash
npm run dev:backend
```

> Nota: este comando arranca el backend en modo dev estándar. Para usar MongoDB en backend, ver Opción B.

### Opción B: Ejecutar por separado (recomendado con MongoDB)

**Terminal 1 - Backend (Puerto 3001):**

```bash
cd backend
npm run dev:mongo   # usa MongoDB
```

**Terminal 2 - Frontend (Puerto 3000):**

```bash
npm run dev
```


## 📋 API Endpoints

### 📚 Swagger UI

- UI: http://localhost:3001/api-docs
- JSON: http://localhost:3001/swagger.json

### Productos

- GET `/api/products` — listado (filtros: `category`, `search`, `maxPrice`)
  - Ej.: `/api/products?category=Electronics&maxPrice=100`
- GET `/api/products/:id` — detalle (IDs enteros)
  - Ej.: `/api/products/1`
- GET `/api/products/cheapest` — más baratos (query `limit`, default 5)
- GET `/api/products/stats` — estadísticas (min, max, promedio, mediana, categorías)

### Health

- GET `/health` — estado del servidor


## 🧱 Datos y seed

- `backend/src/data/products.json` es la fuente canónica de datos iniciales (IDs numéricos).
- `backend/src/scripts/seed.ts` lee ese JSON y carga la colección `products` en Mongo.
- En runtime, la API lee desde MongoDB (no desde el JSON).


## 🎨 Frontend

Páginas:

1. `/` — Home
2. `/products` — Lista con búsqueda y filtros
3. `/products/[id]` — Detalle (precio, stock, rating, categoría)


### Ejecutar tests del backend

```bash
cd backend
npm test
```

### Ejecutar tests del frontend

```bash
npm test
```


## ℹ️ Notas

- Puedes inspeccionar la data con MongoDB Compass o `mongosh` apuntando a la DB indicada en `MONGODB_URI`.