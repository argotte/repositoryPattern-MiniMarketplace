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
      const { category, search, maxPrice } = req.query;
      let products = await this.readRepository.findAll();

      // Apply category filter if provided
      if (category && typeof category === "string" && category.trim() !== "") {
        products = await this.readRepository.findByCategory(category.trim());
      }

      // Apply search filter if provided
      if (search && typeof search === "string" && search.trim() !== "") {
        products = await this.readRepository.search(search.trim());
      }

      // Apply price filter if provided
      if (maxPrice && typeof maxPrice === "string") {
        const priceLimit = parseFloat(maxPrice);
        if (!isNaN(priceLimit) && priceLimit > 0) {
          products = await this.readRepository.findByPriceRange(0, priceLimit);
        }
      }

      res.json({
        success: true,
        count: products.length,
        data: products,
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
}
