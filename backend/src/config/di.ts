// Dependency Injection Container
import { MockProductRepository } from "../repositories/MockProductRepository";
import { CreateProductController } from "../controllers/products/create/CreateProductController";
import { ReadProductController } from "../controllers/products/read/ReadProductController";
import { UpdateProductController } from "../controllers/products/update/UpdateProductController";
import { DeleteProductController } from "../controllers/products/delete/DeleteProductController";
import { StatsController } from "../controllers/products/stats/StatsController";

// Repository instances
const mockRepository = new MockProductRepository();

// Controller instances with DI
export const createProductController = new CreateProductController(
  mockRepository
);
export const readProductController = new ReadProductController(mockRepository);
export const updateProductController = new UpdateProductController(
  mockRepository
);
export const deleteProductController = new DeleteProductController(
  mockRepository
);
export const statsController = new StatsController(
  mockRepository,
  mockRepository
);
