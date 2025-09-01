import request from "supertest";
import app from "../server";

describe("Products API with Repository Pattern", () => {
  describe("GET /api/products", () => {
    it("should return all products", async () => {
      const response = await request(app).get("/api/products").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.count).toBeGreaterThan(0);
    });

    it("should filter products by category", async () => {
      const response = await request(app)
        .get("/api/products?category=Electronics")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(
        response.body.data.every((product: any) =>
          product.category.toLowerCase().includes("electronics")
        )
      ).toBe(true);
    });

    it("should search products by query", async () => {
      const response = await request(app)
        .get("/api/products?search=headphones")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(0);
    });

    it("should filter products by maxPrice", async () => {
      const response = await request(app)
        .get("/api/products?maxPrice=50")
        .expect(200);

      expect(response.body.success).toBe(true);
      if (response.body.data.length > 0) {
        expect(
          response.body.data.every((product: any) => product.price <= 50)
        ).toBe(true);
      }
    });
  });

  describe("POST /api/products", () => {
    it("should create a new product", async () => {
      const newProduct = {
        name: "Test Product",
        description: "A test product for unit testing",
        price: 99.99,
        category: "Test Category",
        image: "https://example.com/test-image.jpg",
        stock: 10,
        rating: 4.5,
      };

      const response = await request(app)
        .post("/api/products")
        .send(newProduct)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.name).toBe(newProduct.name);
      expect(response.body.data.price).toBe(newProduct.price);
    });

    it("should return 400 for invalid product data", async () => {
      const invalidProduct = {
        name: "Test Product",
        // Missing required fields like description, price, etc.
      };

      const response = await request(app)
        .post("/api/products")
        .send(invalidProduct)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/products/:id", () => {
    it("should return a specific product", async () => {
      const response = await request(app).get("/api/products/1").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id", "1");
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data).toHaveProperty("price");
    });

    it("should return 404 for non-existent product", async () => {
      const response = await request(app).get("/api/products/999").expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Product not found");
    });
  });

  describe("PUT /api/products/:id", () => {
    it("should update an existing product", async () => {
      const updates = {
        name: "Updated Product Name",
        price: 149.99,
      };

      const response = await request(app)
        .put("/api/products/1")
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updates.name);
      expect(response.body.data.price).toBe(updates.price);
    });

    it("should return 404 when updating non-existent product", async () => {
      const updates = {
        name: "Updated Product Name",
      };

      const response = await request(app)
        .put("/api/products/999")
        .send(updates)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("should delete an existing product", async () => {
      // First create a product to delete
      const newProduct = {
        name: "Product to Delete",
        description: "This product will be deleted in the test",
        price: 29.99,
        category: "Test",
        image: "https://example.com/delete-test.jpg",
        stock: 1,
        rating: 3.0,
      };

      const createResponse = await request(app)
        .post("/api/products")
        .send(newProduct);

      expect(createResponse.status).toBe(201);
      const productId = createResponse.body.data.id;

      // Now delete it
      const deleteResponse = await request(app)
        .delete(`/api/products/${productId}`)
        .expect(200);

      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe("Product deleted successfully");

      // Verify it's deleted
      await request(app).get(`/api/products/${productId}`).expect(404);
    });

    it("should return 404 when deleting non-existent product", async () => {
      const response = await request(app)
        .delete("/api/products/999")
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/products/cheapest", () => {
    it("should return cheapest products sorted by price", async () => {
      const response = await request(app)
        .get("/api/products/cheapest")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);

      // Verify products are sorted by price (ascending)
      const products = response.body.data;
      for (let i = 1; i < products.length; i++) {
        expect(products[i].price).toBeGreaterThanOrEqual(products[i - 1].price);
      }
    });

    it("should respect limit parameter", async () => {
      const limit = 3;
      const response = await request(app)
        .get(`/api/products/cheapest?limit=${limit}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(limit);
    });
  });

  describe("GET /api/products/cheapest-available", () => {
    it("should return cheapest products with available stock", async () => {
      const response = await request(app)
        .get("/api/products/cheapest-available")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);

      // All returned products should have stock > 0
      const products = response.body.data;
      products.forEach((product: any) => {
        expect(product.stock).toBeGreaterThan(0);
      });

      // Should be sorted by price (ascending)
      for (let i = 1; i < products.length; i++) {
        expect(products[i].price).toBeGreaterThanOrEqual(products[i - 1].price);
      }
    });

    it("should respect limit parameter", async () => {
      const limit = 2;
      const response = await request(app)
        .get(`/api/products/cheapest-available?limit=${limit}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(limit);
    });

    it("should default to 3 products when no limit specified", async () => {
      const response = await request(app)
        .get("/api/products/cheapest-available")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(3);
    });
  });

  describe("GET /api/products/stats", () => {
    it("should return comprehensive price statistics", async () => {
      const response = await request(app)
        .get("/api/products/stats")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("totalProducts");
      expect(response.body.data).toHaveProperty("priceStats");
      expect(response.body.data).toHaveProperty("categories");

      const { priceStats } = response.body.data;
      expect(priceStats).toHaveProperty("min");
      expect(priceStats).toHaveProperty("max");
      expect(priceStats).toHaveProperty("average");
      expect(priceStats).toHaveProperty("median");

      // Validate statistical values
      expect(typeof priceStats.min).toBe("number");
      expect(typeof priceStats.max).toBe("number");
      expect(typeof priceStats.average).toBe("number");
      expect(typeof priceStats.median).toBe("number");
      expect(priceStats.min).toBeLessThanOrEqual(priceStats.max);
    });
  });
});
