import { ProductModel, IProduct } from "../models/Product";
import { ICreateProductRepository } from "./ICreateProductRepository";
import { IReadProductRepository } from "./IReadProductRepository";
import { IUpdateProductRepository } from "./IUpdateProductRepository";
import { IDeleteProductRepository } from "./IDeleteProductRepository";
import { IStatsRepository } from "./IStatsRepository";
import { Product } from "../types/Product";

export class MongoProductRepository
  implements
    ICreateProductRepository,
    IReadProductRepository,
    IUpdateProductRepository,
    IDeleteProductRepository,
    IStatsRepository
{
  // CREATE operations
  async create(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
    const newProduct = new ProductModel({
      ...product,
      id: await this.generateNextId(),
      createdAt: new Date().toISOString(),
    });

    const savedProduct = await newProduct.save();
    return this.toProduct(savedProduct);
  }

  // READ operations
  async findAll(): Promise<Product[]> {
    const products = await ProductModel.find({}).sort({ createdAt: -1 });
    return products.map(this.toProduct);
  }

  async findById(id: number): Promise<Product | null> {
    const product = await ProductModel.findOne({ id });
    return product ? this.toProduct(product) : null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    const products = await ProductModel.find({
      category: { $regex: new RegExp(category, "i") },
    }).sort({ createdAt: -1 });
    return products.map(this.toProduct);
  }

  async search(query: string): Promise<Product[]> {
    const searchRegex = new RegExp(query, "i");
    const products = await ProductModel.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ],
    }).sort({ createdAt: -1 });
    return products.map(this.toProduct);
  }

  async findByMaxPrice(maxPrice: number): Promise<Product[]> {
    const products = await ProductModel.find({
      price: { $lte: maxPrice },
    }).sort({ price: 1 });
    return products.map(this.toProduct);
  }

  async findCheapest(limit: number): Promise<Product[]> {
    const products = await ProductModel.find({})
      .sort({ price: 1 })
      .limit(limit);
    return products.map(this.toProduct);
  }

  async findByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<Product[]> {
    const products = await ProductModel.find({
      price: { $gte: minPrice, $lte: maxPrice },
    }).sort({ price: 1 });
    return products.map(this.toProduct);
  }

  async findInStock(): Promise<Product[]> {
    const products = await ProductModel.find({ stock: { $gt: 0 } }).sort({
      createdAt: -1,
    });
    return products.map(this.toProduct);
  }

  // UPDATE operations
  async update(
    id: number,
    updates: Partial<Omit<Product, "id" | "createdAt">>
  ): Promise<Product | null> {
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    return updatedProduct ? this.toProduct(updatedProduct) : null;
  }

  async exists(id: number): Promise<boolean> {
    const count = await ProductModel.countDocuments({ id });
    return count > 0;
  }

  // DELETE operations
  async delete(id: number): Promise<boolean> {
    const result = await ProductModel.deleteOne({ id });
    return result.deletedCount === 1;
  }

  // STATS operations
  async getStats(): Promise<{
    totalProducts: number;
    categories: string[];
    priceStats: {
      min: number;
      max: number;
      average: number;
      median: number;
    };
  }> {
    const totalProducts = await ProductModel.countDocuments();

    // Get unique categories
    const categories = await ProductModel.distinct("category");

    // Get price statistics using aggregation
    const priceStats = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          avgPrice: { $avg: "$price" },
          prices: { $push: "$price" },
        },
      },
      {
        $project: {
          min: "$minPrice",
          max: "$maxPrice",
          average: { $round: ["$avgPrice", 2] },
          prices: 1,
        },
      },
    ]);

    let median = 0;
    if (priceStats.length > 0 && priceStats[0].prices) {
      const prices = priceStats[0].prices.sort((a: number, b: number) => a - b);
      const mid = Math.floor(prices.length / 2);
      median =
        prices.length % 2 === 0
          ? (prices[mid - 1] + prices[mid]) / 2
          : prices[mid];
      median = Math.round(median * 100) / 100;
    }

    return {
      totalProducts,
      categories: categories.sort(),
      priceStats: {
        min: priceStats[0]?.min || 0,
        max: priceStats[0]?.max || 0,
        average: priceStats[0]?.average || 0,
        median,
      },
    };
  }

  async count(): Promise<number> {
    return await ProductModel.countDocuments();
  }

  async getAveragePrice(): Promise<number> {
    const result = await ProductModel.aggregate([
      { $group: { _id: null, avgPrice: { $avg: "$price" } } },
    ]);
    return result[0]?.avgPrice || 0;
  }

  async getCategoryStats(): Promise<Record<string, number>> {
    const result = await ProductModel.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Convert array to Record<string, number>
    const stats: Record<string, number> = {};
    result.forEach((item) => {
      stats[item.category] = item.count;
    });

    return stats;
  }

  // Helper methods
  private toProduct(doc: IProduct): Product {
    return {
      id: doc.id,
      name: doc.name,
      description: doc.description,
      price: doc.price,
      category: doc.category,
      image: doc.image,
      stock: doc.stock,
      rating: doc.rating,
      createdAt: doc.createdAt,
    };
  }

  private async generateNextId(): Promise<number> {
    const lastProduct = await ProductModel.findOne(
      {},
      {},
      { sort: { id: -1 } }
    );
    if (!lastProduct) return 1;
    const lastId = lastProduct.id;
    return lastId + 1;
  }
}
