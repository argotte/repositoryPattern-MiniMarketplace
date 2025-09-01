import { getTopCheapestAvailable } from "./ProductQueryUtils";

describe("ProductQueryUtils - getTopCheapestAvailable", () => {
  const sampleProducts = [
    { id: "1", name: "Product A", price: 50, stock: 5 },
    { id: "2", name: "Product B", price: 20, stock: 0 }, // Out of stock
    { id: "3", name: "Product C", price: 30, stock: 2 },
    { id: "4", name: "Product D", price: 10, stock: 1 },
    { id: "5", name: "Product E", price: 40, stock: 3 },
    { id: "6", name: "Product F", price: 15, stock: 0 }, // Out of stock
  ];

  test("should return top 3 cheapest products with stock by default", () => {
    const result = getTopCheapestAvailable(sampleProducts);

    expect(result).toHaveLength(3);
    expect(result[0].price).toBe(10); // Product D
    expect(result[1].price).toBe(30); // Product C
    expect(result[2].price).toBe(40); // Product E

    // All should have stock > 0
    result.forEach((product) => {
      expect(product.stock).toBeGreaterThan(0);
    });
  });

  test("should return specified number of products", () => {
    const result = getTopCheapestAvailable(sampleProducts, 2);

    expect(result).toHaveLength(2);
    expect(result[0].price).toBe(10); // Product D
    expect(result[1].price).toBe(30); // Product C
  });

  test("should filter out products without stock", () => {
    const result = getTopCheapestAvailable(sampleProducts, 10);

    // Should return only 4 products (excluding the 2 out of stock)
    expect(result).toHaveLength(4);

    // Should not include products with stock = 0
    const outOfStockProducts = result.filter((p) => p.stock === 0);
    expect(outOfStockProducts).toHaveLength(0);
  });

  test("should return empty array when no products have stock", () => {
    const outOfStockProducts = [
      { id: "1", name: "Product A", price: 50, stock: 0 },
      { id: "2", name: "Product B", price: 20, stock: 0 },
    ];

    const result = getTopCheapestAvailable(outOfStockProducts);
    expect(result).toHaveLength(0);
  });

  test("should handle empty array input", () => {
    const result = getTopCheapestAvailable([]);
    expect(result).toHaveLength(0);
  });

  test("should sort by price correctly", () => {
    const result = getTopCheapestAvailable(sampleProducts, 4);

    // Should be sorted by price ascending
    for (let i = 1; i < result.length; i++) {
      expect(result[i].price).toBeGreaterThanOrEqual(result[i - 1].price);
    }
  });
});
