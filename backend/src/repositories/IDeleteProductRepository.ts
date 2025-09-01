import { Product } from "../types/Product";

export interface IDeleteProductRepository {
  delete(id: number): Promise<boolean>;
  exists(id: number): Promise<boolean>;
}
