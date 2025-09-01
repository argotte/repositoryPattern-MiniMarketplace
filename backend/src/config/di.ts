// Dependency Injection Container
import { MockProductRepository } from "../repositories/MockProductRepository";
import { MongoProductRepository } from "../repositories/MongoProductRepository";
import { CreateProductController } from "../controllers/products/create/CreateProductController";
import { ReadProductController } from "../controllers/products/read/ReadProductController";
import { UpdateProductController } from "../controllers/products/update/UpdateProductController";
import { DeleteProductController } from "../controllers/products/delete/DeleteProductController";
import { StatsController } from "../controllers/products/stats/StatsController";

// Repository instances - switch between Mock and Mongo
const USE_MONGODB = process.env.USE_MONGODB === "true";
const repository = USE_MONGODB
  ? new MongoProductRepository()
  : new MockProductRepository();

console.log(`🔧 Using ${USE_MONGODB ? "MongoDB" : "Mock"} repository`);

// Controller instances with DI
export const createProductController = new CreateProductController(repository);
export const readProductController = new ReadProductController(repository);
export const updateProductController = new UpdateProductController(repository);
export const deleteProductController = new DeleteProductController(repository);
export const statsController = new StatsController(repository, repository);
