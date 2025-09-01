import { Product } from "../types/Product";

export interface IUpdateProductRepository {
  update(id: string, product: Partial<Product>): Promise<Product | null>;
  exists(id: string): Promise<boolean>;
}
