import { Product } from "../types/Product";

export class PriceUtils {
  /**
   * Find the cheapest products available (in stock)
   * @param products Array of products
   * @param limit Maximum number of products to return
   * @returns Array of cheapest products sorted by price
   */
  static getCheapestProducts(
    products: Product[],
    limit: number = 5
  ): Product[] {
    return products
      .filter((product) => product.stock > 0) // Only available products
      .sort((a, b) => a.price - b.price) // Sort by price ascending
      .slice(0, limit); // Limit results
  }

  /**
   * Find the cheapest product in a specific category
   * @param products Array of products
   * @param category Category to filter by
   * @returns Cheapest product in category or undefined if none found
   */
  static getCheapestInCategory(
    products: Product[],
    category: string
  ): Product | undefined {
    const categoryProducts = products.filter(
      (product) =>
        product.category.toLowerCase() === category.toLowerCase() &&
        product.stock > 0
    );

    if (categoryProducts.length === 0) return undefined;

    return categoryProducts.reduce((cheapest, current) =>
      current.price < cheapest.price ? current : cheapest
    );
  }

  /**
   * Calculate price statistics for a list of products
   * @param products Array of products
   * @returns Object with min, max, average, and median prices
   */
  static getPriceStatistics(products: Product[]): {
    min: number;
    max: number;
    average: number;
    median: number;
  } {
    if (products.length === 0) {
      return { min: 0, max: 0, average: 0, median: 0 };
    }

    const prices = products.map((p) => p.price).sort((a, b) => a - b);
    const sum = prices.reduce((acc, price) => acc + price, 0);

    const median =
      prices.length % 2 === 0
        ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
        : prices[Math.floor(prices.length / 2)];

    return {
      min: prices[0],
      max: prices[prices.length - 1],
      average: sum / prices.length,
      median,
    };
  }

  /**
   * Find products under a specific price
   * @param products Array of products
   * @param maxPrice Maximum price threshold
   * @returns Array of products under the specified price
   */
  static getProductsUnderPrice(
    products: Product[],
    maxPrice: number
  ): Product[] {
    return products
      .filter((product) => product.price <= maxPrice && product.stock > 0)
      .sort((a, b) => a.price - b.price);
  }

  /**
   * Apply discount to price
   * @param price Original price
   * @param discountPercent Discount percentage (0-100)
   * @returns Discounted price
   */
  static applyDiscount(price: number, discountPercent: number): number {
    return Math.round(price * (1 - discountPercent / 100) * 100) / 100;
  }
}
