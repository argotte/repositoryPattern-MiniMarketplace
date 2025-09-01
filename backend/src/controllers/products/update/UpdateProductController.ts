import { Request, Response } from "express";
import { IUpdateProductRepository } from "../../../repositories/IUpdateProductRepository";

export class UpdateProductController {
  constructor(private updateRepository: IUpdateProductRepository) {}
  /**
   * PUT /api/products/:id
   * Update an existing product
   */
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (!id || typeof id !== "string" || id.trim() === "") {
        res.status(400).json({ success: false, message: "Invalid product ID" });
        return;
      }
      const exists = await this.updateRepository.exists(id.trim());
      if (!exists) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }
      const { validateProductUpdates } = await import(
        "../../../utils/ProductQueryUtils"
      );
      const validation = validateProductUpdates(updates);
      if (!validation.valid) {
        res
          .status(400)
          .json({
            success: false,
            message: validation.errors?.join("; ") || "Invalid updates",
          });
        return;
      }
      const updatedProduct = await this.updateRepository.update(
        id.trim(),
        validation.data
      );
      if (!updatedProduct) {
        res
          .status(404)
          .json({
            success: false,
            message: "Product not found or could not be updated",
          });
        return;
      }
      res.json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error in updateProduct:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Error updating product",
          error: error instanceof Error ? error.message : "Unknown error",
        });
    }
  }
}
