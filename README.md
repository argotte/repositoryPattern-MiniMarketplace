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

## 🏃‍♂️ Ejecutar el Proyecto

### Opción 1: Ejecutar ambos servicios simultáneamente

```bash
npm run dev:backend
```

### Opción 2: Ejecutar por separado

**Terminal 1 - Backend (Puerto 3001):**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (Puerto 3000):**

```bash
npm run dev
```

## 📋 API Endpoints

### 📚 Documentación Interactiva con Swagger UI

El API incluye documentación interactiva completa con **Swagger UI**:

- **🔗 Swagger UI**: http://localhost:3001/api-docs
- **📄 Swagger JSON**: http://localhost:3001/swagger.json

### Productos

- **GET** `/api/products` - Obtener todos los productos

  - Query params: `category`, `search`, `maxPrice`
  - Ejemplo: `/api/products?category=Electronics&maxPrice=100`

- **GET** `/api/products/:id` - Obtener producto por ID

  - Ejemplo: `/api/products/1`

- **GET** `/api/products/cheapest` - Obtener productos más baratos

  - Query params: `limit` (default: 5)
  - Ejemplo: `/api/products/cheapest?limit=3`

- **GET** `/api/products/stats` - Estadísticas de precios
  - Retorna: min, max, promedio, mediana y categorías

### Health Check

- **GET** `/health` - Estado del servidor


## 🎨 Características del Frontend

### Páginas Implementadas

1. **Home** (`/`) - Página de bienvenida con navegación
2. **Products** (`/products`) - Lista de productos con:
   - Búsqueda por texto
   - Filtros por categoría
   - Cards responsivas con información del producto
3. **Product Detail** (`/products/[id]`) - Detalle del producto con:
   - Información completa del producto
   - Imagen, precio, stock, rating
   - Breadcrumb navigation


### Ejecutar tests del backend

```bash
cd backend
npm test
```

### Ejecutar tests del frontend

```bash
npm test
```