import { Request, Response } from "express";
import { ProductModel } from "../../../models/Product";
import productsData from "../../../data/products.json";

export class SeedController {
  /**
   * POST /api/products/seed
   * Re-seed the MongoDB products collection from the canonical JSON
   */
  async runSeed(req: Request, res: Response): Promise<void> {
    try {
      if (process.env.USE_MONGODB !== "true") {
        res.status(400).json({
          success: false,
          message:
            "Seeding is only available when USE_MONGODB=true (Mongo repository)",
        });
        return;
      }

      // Clear and insert
      const deleteResult = await ProductModel.deleteMany({});
      const inserted = await ProductModel.insertMany(productsData);

      // Build category summary
      const categories = [...new Set(productsData.map((p) => p.category))];
      const categorySummary = categories.reduce<Record<string, number>>(
        (acc, cat) => {
          acc[cat] = productsData.filter((p) => p.category === cat).length;
          return acc;
        },
        {}
      );

      res.status(201).json({
        success: true,
        message: "Database seeded successfully",
        deleted: deleteResult.deletedCount || 0,
        inserted: inserted.length,
        categories: categorySummary,
      });
    } catch (error) {
      console.error("Error in runSeed:", error);
      res.status(500).json({
        success: false,
        message: "Error seeding database",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
