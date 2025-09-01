import { Product } from "../types/Product";

export interface IReadProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
  findInStock(): Promise<Product[]>;
}
