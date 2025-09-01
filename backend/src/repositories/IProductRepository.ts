import { Product } from "../types/Product";

export interface IProductRepository {
  // Basic CRUD operations
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(product: Omit<Product, "id" | "createdAt">): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;

  // Query methods
  findByCategory(category: string): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
  findInStock(): Promise<Product[]>;

  // Utility methods
  count(): Promise<number>;
  exists(id: string): Promise<boolean>;
}
