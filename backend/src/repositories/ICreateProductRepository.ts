import { Product } from "../types/Product";

export interface ICreateProductRepository {
  create(product: Omit<Product, "id" | "createdAt">): Promise<Product>;
}
