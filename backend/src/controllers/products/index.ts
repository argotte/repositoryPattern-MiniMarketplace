// Product Controllers - Dependency Injection Architecture
// Each controller receives repository interfaces through constructor injection

// Export controller classes
export { CreateProductController } from "./create/CreateProductController";
export { ReadProductController } from "./read/ReadProductController";
export { UpdateProductController } from "./update/UpdateProductController";
export { DeleteProductController } from "./delete/DeleteProductController";
export { StatsController } from "./stats/StatsController";
export { SeedController } from "./seed/SeedController";

// Export controller instances with dependency injection
export {
  createProductController,
  readProductController,
  updateProductController,
  deleteProductController,
  statsController,
} from "../../config/di";
export { seedController } from "../../config/di";

// Export combined controller object for convenience
import {
  createProductController,
  readProductController,
  updateProductController,
  deleteProductController,
  statsController,
} from "../../config/di";
import { seedController } from "../../config/di";

export const ProductControllers = {
  create: createProductController,
  read: readProductController,
  update: updateProductController,
  delete: deleteProductController,
  stats: statsController,
  seed: seedController,
};
