import { Request, Response } from "express";
import { IStatsRepository } from "../../../repositories/IStatsRepository";
import { IReadProductRepository } from "../../../repositories/IReadProductRepository";
import { Product } from "../../../types/Product";

export class StatsController {
  constructor(
    private statsRepository: IStatsRepository,
    private readRepository: IReadProductRepository
  ) {}
  /**
   * GET /api/products/stats
   * Get comprehensive product and price statistics
   */
  async getPriceStatistics(req: Request, res: Response): Promise<void> {
    try {
      const totalCount = await this.statsRepository.count();
      const averagePrice = await this.statsRepository.getAveragePrice();
      const categoryStats = await this.statsRepository.getCategoryStats();

      // Get all products to calculate min, max, median
      const allProducts = await this.readRepository.findAll();
      const prices = allProducts
        .map((p: Product) => p.price)
        .sort((a: number, b: number) => a - b);

      const stats = {
        totalProducts: totalCount,
        averagePrice: averagePrice,
        priceStats: {
          min: prices.length > 0 ? Math.min(...prices) : 0,
          max: prices.length > 0 ? Math.max(...prices) : 0,
          average: averagePrice,
          median: prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0,
        },
        categories: categoryStats,
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error in getPriceStatistics:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching statistics",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
