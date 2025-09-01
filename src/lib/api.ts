import { Product, ApiResponse } from "../types/Product";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export class ApiClient {
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Product[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  static async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Product> = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  static async getCheapestProducts(limit: number = 5): Promise<Product[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/cheapest?limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Product[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching cheapest products:", error);
      throw error;
    }
  }

  static async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products?search=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Product[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }
}
