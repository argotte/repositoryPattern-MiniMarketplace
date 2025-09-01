import { Router } from "express";
import { ProductControllers } from "../controllers/products";

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     description: Retorna la lista completa de productos con opciones de filtrado por categoría, búsqueda por texto y precio máximo
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar productos por categoría
 *         example: Electronics
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar productos por nombre, descripción o categoría
 *         example: headphones
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Precio máximo para filtrar productos
 *         example: 100.00
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Crear un nuevo producto
 *     description: Crea un nuevo producto en el sistema
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, category, image, stock, rating]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Product"
 *               description:
 *                 type: string
 *                 example: "Product description"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 99.99
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/image.jpg"
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 10
 *               rating:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 5
 *                 example: 4.5
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  "/",
  ProductControllers.read.getAllProducts.bind(ProductControllers.read)
);
router.post(
  "/",
  ProductControllers.create.createProduct.bind(ProductControllers.create)
);

/**
 * @swagger
 * /api/products/cheapest:
 *   get:
 *     summary: Obtener productos más baratos
 *     description: Retorna los productos más económicos disponibles en stock, ordenados por precio ascendente
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 5
 *         description: Número máximo de productos a retornar
 *         example: 3
 *     responses:
 *       200:
 *         description: Lista de productos más baratos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/cheapest",
  ProductControllers.read.getCheapestProducts.bind(ProductControllers.read)
);

/**
 * @swagger
 * /api/products/cheapest-available:
 *   get:
 *     summary: Obtener productos más baratos con stock disponible
 *     description: Retorna los N productos más baratos que tienen stock disponible
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Número máximo de productos a retornar (default 3)
 *         example: 3
 *     responses:
 *       200:
 *         description: Lista de productos más baratos con stock disponible
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/cheapest-available",
  ProductControllers.read.getCheapestAvailable.bind(ProductControllers.read)
);

/**
 * @swagger
 * /api/products/stats:
 *   get:
 *     summary: Obtener estadísticas de precios
 *     description: Retorna estadísticas completas de precios incluyendo mínimo, máximo, promedio, mediana y lista de categorías disponibles
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Estadísticas de precios obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatsResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/stats",
  ProductControllers.stats.getPriceStatistics.bind(ProductControllers.stats)
);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     description: Retorna los detalles completos de un producto específico mediante su ID único
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del producto
 *         example: 1
 *     responses:
 *       200:
 *         description: Producto encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Product not found"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Actualizar un producto
 *     description: Actualiza los detalles de un producto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del producto a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Product"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 149.99
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/updated-image.jpg"
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 15
 *               rating:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 5
 *                 example: 4.8
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Producto no encontrado
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 *   delete:
 *     summary: Eliminar un producto
 *     description: Elimina un producto del sistema de forma permanente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del producto a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/:id",
  ProductControllers.read.getProductById.bind(ProductControllers.read)
);
router.put(
  "/:id",
  ProductControllers.update.updateProduct.bind(ProductControllers.update)
);
router.delete(
  "/:id",
  ProductControllers.delete.deleteProduct.bind(ProductControllers.delete)
);

export default router;
