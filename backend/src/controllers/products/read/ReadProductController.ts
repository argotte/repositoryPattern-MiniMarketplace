import { Request, Response } from "express";
import { IReadProductRepository } from "../../../repositories/IReadProductRepository";

export class ReadProductController {
  constructor(private readRepository: IReadProductRepository) {}

  /**
   * GET /api/products
   * Get all products with optional filtering by category, search, and maxPrice
   */
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.readRepository.findAll();
      // Importar la utilidad
      const { queryProducts } = await import(
        "../../../utils/ProductQueryUtils"
      );
      const result = queryProducts(products, req.query);
      res.json({
        success: true,
        count: result.count,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        data: result.data,
      });
    } catch (error) {
      console.error("Error in getAllProducts:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching products",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * GET /api/products/:id
   * Get product by ID
   */
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const parsedId = Number(id);
      if (!id || isNaN(parsedId)) {
        res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
        return;
      }
      const product = await this.readRepository.findById(parsedId);
      if (!product) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
        return;
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("Error in getProductById:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching product",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * GET /api/products/cheapest
   * Get cheapest products with optional limit
   */
  async getCheapestProducts(req: Request, res: Response): Promise<void> {
    try {
      const limitQuery = req.query.limit;
      let limit = 5; // Default limit

      // Validate and parse limit parameter
      if (limitQuery && typeof limitQuery === "string") {
        const parsedLimit = parseInt(limitQuery, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 50) {
          limit = parsedLimit;
        }
      }

      // Get all products and sort by price
      const products = await this.readRepository.findAll();
      const cheapestProducts = products
        .sort((a, b) => a.price - b.price)
        .slice(0, limit);

      res.json({
        success: true,
        count: cheapestProducts.length,
        data: cheapestProducts,
      });
    } catch (error) {
      console.error("Error in getCheapestProducts:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching cheapest products",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * GET /api/products/cheapest-available
   * Get the top N cheapest products with available stock
   */
  async getCheapestAvailable(req: Request, res: Response): Promise<void> {
    try {
      const limitQuery = req.query.limit;
      let limit = 3; // Default limit

      // Validate and parse limit parameter
      if (limitQuery && typeof limitQuery === "string") {
        const parsedLimit = parseInt(limitQuery, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 50) {
          limit = parsedLimit;
        }
      }

      // Get all products and use the utility function
      const products = await this.readRepository.findAll();
      const { getTopCheapestAvailable } = await import(
        "../../../utils/ProductQueryUtils"
      );
      const cheapestAvailable = getTopCheapestAvailable(products, limit);

      res.json({
        success: true,
        count: cheapestAvailable.length,
        data: cheapestAvailable,
      });
    } catch (error) {
      console.error("Error in getCheapestAvailable:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching cheapest available products",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
