import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - plantilla - prueba técnica",
      version: "1.0.0",
      description: "API REST para mini marketplace",
      contact: {
        name: "Diego",
        email: "diegoargottez@gmail.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          required: [
            "id",
            "name",
            "description",
            "price",
            "category",
            "image",
            "stock",
            "rating",
            "createdAt",
          ],
          properties: {
            id: {
              type: "string",
              description: "ID único del producto",
            },
            name: {
              type: "string",
              description: "Nombre del producto",
            },
            description: {
              type: "string",
              description: "Descripción detallada del producto",
            },
            price: {
              type: "number",
              format: "float",
              description: "Precio del producto en USD",
            },
            category: {
              type: "string",
              description: "Categoría del producto",
            },
            image: {
              type: "string",
              format: "uri",
              description: "URL de la imagen del producto",
            },
            stock: {
              type: "integer",
              minimum: 0,
              description: "Cantidad disponible en inventario",
            },
            rating: {
              type: "number",
              format: "float",
              minimum: 0,
              maximum: 5,
              description: "Calificación del producto (0-5)",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación del producto",
            },
          },
          example: {
            id: "1",
            name: "Wireless Bluetooth Headphones",
            description:
              "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
            price: 129.99,
            category: "Electronics",
            image:
              "https://via.placeholder.com/400x400/0066CC/FFFFFF?text=Headphones",
            stock: 25,
            rating: 4.5,
            createdAt: "2025-01-01T00:00:00Z",
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indica si la operación fue exitosa",
            },
            count: {
              type: "integer",
              description: "Número de elementos retornados (para listas)",
            },
            data: {
              description: "Datos de respuesta",
            },
            message: {
              type: "string",
              description: "Mensaje informativo o de error",
            },
          },
        },
        ProductsResponse: {
          allOf: [
            { $ref: "#/components/schemas/ApiResponse" },
            {
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          ],
        },
        ProductResponse: {
          allOf: [
            { $ref: "#/components/schemas/ApiResponse" },
            {
              type: "object",
              properties: {
                data: { $ref: "#/components/schemas/Product" },
              },
            },
          ],
        },
        PriceStatistics: {
          type: "object",
          properties: {
            min: {
              type: "number",
              format: "float",
              description: "Precio mínimo",
            },
            max: {
              type: "number",
              format: "float",
              description: "Precio máximo",
            },
            average: {
              type: "number",
              format: "float",
              description: "Precio promedio",
            },
            median: {
              type: "number",
              format: "float",
              description: "Precio mediano",
            },
          },
        },
        StatsResponse: {
          allOf: [
            { $ref: "#/components/schemas/ApiResponse" },
            {
              type: "object",
              properties: {
                data: {
                  type: "object",
                  properties: {
                    totalProducts: {
                      type: "integer",
                      description: "Número total de productos",
                    },
                    priceStats: {
                      $ref: "#/components/schemas/PriceStatistics",
                    },
                    categories: {
                      type: "array",
                      items: { type: "string" },
                      description: "Lista de categorías disponibles",
                    },
                  },
                },
              },
            },
          ],
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              description: "Mensaje de error",
            },
            error: {
              type: "string",
              description: "Detalles técnicos del error (solo en desarrollo)",
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "OK",
            },
            timestamp: {
              type: "string",
              format: "date-time",
            },
            uptime: {
              type: "number",
              format: "float",
              description: "Tiempo de actividad del servidor en segundos",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Products",
        description: "Operaciones relacionadas con productos",
      },
      {
        name: "Health",
        description: "Verificación del estado del servidor",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/server.ts"], // Rutas a los archivos que contienen las anotaciones
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
