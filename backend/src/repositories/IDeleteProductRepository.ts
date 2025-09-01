import { Product } from "../types/Product";

export interface IDeleteProductRepository {
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}
