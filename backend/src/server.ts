import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { connectDB } from "./config/database";
import productsRouter from "./routes/products";

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productsRouter);

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Vibes Marketplace API Documentation",
    swaggerOptions: {
      docExpansion: "list",
      filter: true,
      showRequestDuration: true,
    },
  })
);

// Swagger JSON endpoint
app.get("/swagger.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificación del estado del servidor
 *     description: Endpoint de health check que retorna el estado actual del servidor, timestamp y tiempo de actividad
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               status: "OK"
 *               timestamp: "2025-08-31T21:52:00.000Z"
 *               uptime: 123.456
 */
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((error: Error, req: Request, res: Response) => {
  console.error("Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

// Start server only if this file is run directly (not imported)
if (require.main === module) {
  // Initialize database connection if using MongoDB
  const initializeServer = async () => {
    if (process.env.USE_MONGODB === "true") {
      try {
        await connectDB();
      } catch (error) {
        console.error(
          "Failed to connect to MongoDB. Using fallback mock data."
        );
      }
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🛍️  Products API: http://localhost:${PORT}/api/products`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`📄 Swagger JSON: http://localhost:${PORT}/swagger.json`);
    });
  };

  initializeServer();
}

export default app;
