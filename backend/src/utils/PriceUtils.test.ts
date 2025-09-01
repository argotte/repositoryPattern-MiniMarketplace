import { PriceUtils } from "../utils/PriceUtils";
import { Product } from "../types/Product";

// Mock products for testing
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Cheap Product",
    description: "A cheap product",
    price: 10.99,
    category: "Electronics",
    image: "test.jpg",
    stock: 5,
    rating: 4.0,
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Expensive Product",
    description: "An expensive product",
    price: 199.99,
    category: "Electronics",
    image: "test2.jpg",
    stock: 0, // Out of stock
    rating: 4.5,
    createdAt: "2025-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "Medium Product",
    description: "A medium-priced product",
    price: 50.0,
    category: "Home",
    image: "test3.jpg",
    stock: 10,
    rating: 3.5,
    createdAt: "2025-01-03T00:00:00Z",
  },
  {
    id: "4",
    name: "Another Cheap Product",
    description: "Another cheap product",
    price: 15.99,
    category: "Home",
    image: "test4.jpg",
    stock: 3,
    rating: 4.2,
    createdAt: "2025-01-04T00:00:00Z",
  },
];

describe("PriceUtils", () => {
  describe("getCheapestProducts", () => {
    it("should return products sorted by price ascending", () => {
      const result = PriceUtils.getCheapestProducts(mockProducts, 3);

      expect(result).toHaveLength(3);
      expect(result[0].price).toBe(10.99);
      expect(result[1].price).toBe(15.99);
      expect(result[2].price).toBe(50.0);
    });

    it("should only return products with stock > 0", () => {
      const result = PriceUtils.getCheapestProducts(mockProducts, 5);

      const outOfStockProduct = result.find((p) => p.stock === 0);
      expect(outOfStockProduct).toBeUndefined();
    });

    it("should limit results correctly", () => {
      const result = PriceUtils.getCheapestProducts(mockProducts, 2);
      expect(result).toHaveLength(2);
    });
  });

  describe("getCheapestInCategory", () => {
    it("should return cheapest product in Electronics category", () => {
      const result = PriceUtils.getCheapestInCategory(
        mockProducts,
        "Electronics"
      );

      expect(result).toBeDefined();
      expect(result!.category).toBe("Electronics");
      expect(result!.price).toBe(10.99);
    });

    it("should return undefined for empty category", () => {
      const result = PriceUtils.getCheapestInCategory(
        mockProducts,
        "NonExistent"
      );
      expect(result).toBeUndefined();
    });

    it("should ignore out of stock products", () => {
      const electronicsProducts = mockProducts.filter(
        (p) => p.category === "Electronics"
      );
      const result = PriceUtils.getCheapestInCategory(
        electronicsProducts,
        "Electronics"
      );

      expect(result!.stock).toBeGreaterThan(0);
    });
  });

  describe("getPriceStatistics", () => {
    it("should calculate correct price statistics", () => {
      const stats = PriceUtils.getPriceStatistics(mockProducts);

      expect(stats.min).toBe(10.99);
      expect(stats.max).toBe(199.99);
      expect(stats.average).toBeCloseTo(69.2425);
      expect(stats.median).toBe(32.995); // (15.99 + 50.00) / 2
    });

    it("should handle empty array", () => {
      const stats = PriceUtils.getPriceStatistics([]);

      expect(stats.min).toBe(0);
      expect(stats.max).toBe(0);
      expect(stats.average).toBe(0);
      expect(stats.median).toBe(0);
    });
  });

  describe("getProductsUnderPrice", () => {
    it("should return products under specified price", () => {
      const result = PriceUtils.getProductsUnderPrice(mockProducts, 30);

      expect(result).toHaveLength(2);
      expect(result.every((p) => p.price <= 30)).toBe(true);
      expect(result.every((p) => p.stock > 0)).toBe(true);
    });

    it("should return empty array when no products under price", () => {
      const result = PriceUtils.getProductsUnderPrice(mockProducts, 5);
      expect(result).toHaveLength(0);
    });
  });

  describe("applyDiscount", () => {
    it("should apply discount correctly", () => {
      const result = PriceUtils.applyDiscount(100, 20);
      expect(result).toBe(80);
    });

    it("should handle decimal results correctly", () => {
      const result = PriceUtils.applyDiscount(99.99, 15);
      expect(result).toBe(84.99);
    });

    it("should handle 0% discount", () => {
      const result = PriceUtils.applyDiscount(50, 0);
      expect(result).toBe(50);
    });

    it("should handle 100% discount", () => {
      const result = PriceUtils.applyDiscount(50, 100);
      expect(result).toBe(0);
    });
  });
});
