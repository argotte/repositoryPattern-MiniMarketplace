import { Product } from "../types/Product";
import { ICreateProductRepository } from "./ICreateProductRepository";
import { IReadProductRepository } from "./IReadProductRepository";
import { IUpdateProductRepository } from "./IUpdateProductRepository";
import { IDeleteProductRepository } from "./IDeleteProductRepository";
import { IStatsRepository } from "./IStatsRepository";
import { PriceUtils } from "../utils/PriceUtils";

// Mock product data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 14 Pro",
    description: "Latest Apple smartphone with Pro camera system",
    price: 999.99,
    category: "Electronics",
    image: "https://example.com/iphone14pro.jpg",
    stock: 25,
    rating: 4.8,
    createdAt: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "2",
    name: "MacBook Air M2",
    description: "Lightweight laptop with Apple M2 chip",
    price: 1299.99,
    category: "Electronics",
    image: "https://example.com/macbook-air.jpg",
    stock: 15,
    rating: 4.9,
    createdAt: "2024-01-20T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Air Max technology",
    price: 150.0,
    category: "Sports",
    image: "https://example.com/nike-airmax.jpg",
    stock: 50,
    rating: 4.5,
    createdAt: "2024-02-01T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Sony WH-1000XM5",
    description: "Premium noise-canceling wireless headphones",
    price: 399.99,
    category: "Electronics",
    image: "https://example.com/sony-headphones.jpg",
    stock: 30,
    rating: 4.7,
    createdAt: "2024-02-10T00:00:00.000Z",
  },
  {
    id: "5",
    name: "Levi's 501 Original Jeans",
    description: "Classic straight-leg jeans",
    price: 89.99,
    category: "Clothing",
    image: "https://example.com/levis-jeans.jpg",
    stock: 100,
    rating: 4.3,
    createdAt: "2024-02-15T00:00:00.000Z",
  },
  {
    id: "6",
    name: "KitchenAid Stand Mixer",
    description: "Professional 5-quart stand mixer",
    price: 379.99,
    category: "Home & Kitchen",
    image: "https://example.com/kitchenaid-mixer.jpg",
    stock: 12,
    rating: 4.8,
    createdAt: "2024-03-01T00:00:00.000Z",
  },
  {
    id: "7",
    name: "Adidas Ultraboost 22",
    description: "Energy-returning running shoes",
    price: 180.0,
    category: "Sports",
    image: "https://example.com/adidas-ultraboost.jpg",
    stock: 40,
    rating: 4.6,
    createdAt: "2024-03-05T00:00:00.000Z",
  },
  {
    id: "8",
    name: 'Samsung 65" QLED TV',
    description: "4K Smart TV with Quantum Dot technology",
    price: 1499.99,
    category: "Electronics",
    image: "https://example.com/samsung-tv.jpg",
    stock: 8,
    rating: 4.7,
    createdAt: "2024-03-10T00:00:00.000Z",
  },
];

// In-memory store to simulate database state changes
let productStore: Product[] = [...mockProducts];
let nextId = 9;

export class MockProductRepository
  implements
    ICreateProductRepository,
    IReadProductRepository,
    IUpdateProductRepository,
    IDeleteProductRepository,
    IStatsRepository
{
  // Read operations
  async findAll(): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...productStore]), 10);
    });
  }

  async findById(id: string): Promise<Product | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = productStore.find((p) => p.id === id) || null;
        resolve(product);
      }, 10);
    });
  }

  async findByCategory(category: string): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = productStore.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );
        resolve(products);
      }, 10);
    });
  }

  async search(query: string): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchTerm = query.toLowerCase();
        const products = productStore.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        resolve(products);
      }, 10);
    });
  }

  async findByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = productStore.filter(
          (product) => product.price >= minPrice && product.price <= maxPrice
        );
        resolve(products);
      }, 10);
    });
  }

  async findInStock(): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = productStore.filter((product) => product.stock > 0);
        resolve(products);
      }, 10);
    });
  }

  // Create operations
  async create(
    productData: Omit<Product, "id" | "createdAt">
  ): Promise<Product> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct: Product = {
          ...productData,
          id: nextId.toString(),
          createdAt: new Date().toISOString(),
        };

        productStore.push(newProduct);
        nextId++;
        resolve(newProduct);
      }, 10);
    });
  }

  // Update operations
  async update(
    id: string,
    productData: Partial<Product>
  ): Promise<Product | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = productStore.findIndex((p) => p.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }

        productStore[index] = { ...productStore[index], ...productData };
        resolve(productStore[index]);
      }, 10);
    });
  }

  // Delete operations
  async delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = productStore.findIndex((p) => p.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }

        productStore.splice(index, 1);
        resolve(true);
      }, 10);
    });
  }

  // Utility operations
  async exists(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const exists = productStore.some((p) => p.id === id);
        resolve(exists);
      }, 10);
    });
  }

  async count(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(productStore.length), 10);
    });
  }

  // Stats operations
  async getAveragePrice(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (productStore.length === 0) {
          resolve(0);
          return;
        }

        const total = productStore.reduce(
          (sum, product) => sum + product.price,
          0
        );
        const average = total / productStore.length;
        resolve(average);
      }, 10);
    });
  }

  async getCategoryStats(): Promise<Record<string, number>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats: Record<string, number> = {};

        productStore.forEach((product) => {
          stats[product.category] = (stats[product.category] || 0) + 1;
        });

        resolve(stats);
      }, 10);
    });
  }
}
