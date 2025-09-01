import { Request, Response } from "express";
import { IDeleteProductRepository } from "../../../repositories/IDeleteProductRepository";

export class DeleteProductController {
  constructor(private deleteRepository: IDeleteProductRepository) {}
  /**
   * DELETE /api/products/:id
   * Delete a product by ID
   */
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validate product ID
      if (!id || typeof id !== "string" || id.trim() === "") {
        res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
        return;
      }

      // Check if product exists before deletion
      const existingProduct = await this.deleteRepository.exists(id.trim());
      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
        return;
      }

      // Attempt to delete the product
      const deleteSuccess = await this.deleteRepository.delete(id.trim());

      if (!deleteSuccess) {
        res.status(500).json({
          success: false,
          message: "Failed to delete product",
        });
        return;
      }

      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting product",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
