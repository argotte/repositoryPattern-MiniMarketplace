import { Product } from "../types/Product";
import { IProductRepository } from "../repositories/IProductRepository";
import { MockProductRepository } from "../repositories/MockProductRepository";
import { PriceUtils } from "../utils/PriceUtils";

// Dependency injection - Repository can be swapped easily
export class ProductService {
  private productRepository: IProductRepository;

  constructor(repository?: IProductRepository) {
    // Default to MockRepository if none provided
    this.productRepository = repository || new MockProductRepository();
  }

  // Basic CRUD operations
  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async createProduct(
    productData: Omit<Product, "id" | "createdAt">
  ): Promise<Product> {
    return this.productRepository.create(productData);
  }

  async updateProduct(
    id: string,
    productData: Partial<Product>
  ): Promise<Product | null> {
    return this.productRepository.update(id, productData);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }

  // Query operations
  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.productRepository.findByCategory(category);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.productRepository.search(query);
  }

  async getProductsByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<Product[]> {
    return this.productRepository.findByPriceRange(minPrice, maxPrice);
  }

  async getProductsInStock(): Promise<Product[]> {
    return this.productRepository.findInStock();
  }

  // Business logic operations using PriceUtils
  async getCheapestProducts(limit: number = 5): Promise<Product[]> {
    const allProducts = await this.productRepository.findAll();
    return PriceUtils.getCheapestProducts(allProducts, limit);
  }

  async getCheapestInCategory(category: string): Promise<Product | null> {
    const categoryProducts = await this.productRepository.findByCategory(
      category
    );
    return PriceUtils.getCheapestInCategory(categoryProducts, category) || null;
  }

  async getPriceStatistics(): Promise<{
    totalProducts: number;
    priceStats: {
      min: number;
      max: number;
      average: number;
      median: number;
    };
    categories: string[];
  }> {
    const allProducts = await this.productRepository.findAll();
    const priceStats = PriceUtils.getPriceStatistics(allProducts);
    const categories = [...new Set(allProducts.map((p) => p.category))];

    return {
      totalProducts: allProducts.length,
      priceStats,
      categories,
    };
  }

  async getProductsUnderPrice(maxPrice: number): Promise<Product[]> {
    const allProducts = await this.productRepository.findAll();
    return PriceUtils.getProductsUnderPrice(allProducts, maxPrice);
  }

  // Utility operations
  async productExists(id: string): Promise<boolean> {
    return this.productRepository.exists(id);
  }

  async getTotalProductCount(): Promise<number> {
    return this.productRepository.count();
  }

  // Method to change repository implementation (useful for switching databases)
  setRepository(repository: IProductRepository): void {
    this.productRepository = repository;
  }

  // Method to get current repository (useful for testing)
  getRepository(): IProductRepository {
    return this.productRepository;
  }
}

// Export singleton instance for convenience
export const productService = new ProductService();
