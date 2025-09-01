import { Product } from "../types/Product";

export interface IUpdateProductRepository {
  update(id: number, product: Partial<Product>): Promise<Product | null>;
  exists(id: number): Promise<boolean>;
}
