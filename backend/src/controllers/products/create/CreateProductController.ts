import { Request, Response } from "express";
import { ICreateProductRepository } from "../../../repositories/ICreateProductRepository";

export class CreateProductController {
  constructor(private createRepository: ICreateProductRepository) {}

  /**
   * POST /api/products
   * Create a new product
   */
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { validateAndSanitizeProduct } = await import(
        "../../../utils/ProductQueryUtils"
      );
      const validation = validateAndSanitizeProduct(req.body);
      if (!validation.valid) {
        res.status(400).json({
          success: false,
          message: validation.errors?.join("; ") || "Invalid product data",
        });
        return;
      }
      const newProduct = await this.createRepository.create(validation.data);
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: newProduct,
      });
    } catch (error) {
      console.error("Error in createProduct:", error);
      res.status(500).json({
        success: false,
        message: "Error creating product",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
