export function validateProductUpdates(updates: any): {
  valid: boolean;
  errors?: string[];
  data?: any;
} {
  const errors: string[] = [];
  const validatedUpdates: any = {};
  const allowedFields = [
    "name",
    "description",
    "price",
    "category",
    "image",
    "stock",
    "rating",
  ];
  for (const [key, value] of Object.entries(updates)) {
    if (!allowedFields.includes(key)) {
      errors.push(
        `Invalid field: ${key}. Allowed fields: ${allowedFields.join(", ")}`
      );
      continue;
    }
    switch (key) {
      case "price":
      case "stock":
      case "rating":
        if (typeof value !== "number" || isNaN(value)) {
          errors.push(`Field ${key} must be a valid number`);
          continue;
        }
        if (key === "price" && value <= 0) {
          errors.push("Price must be greater than 0");
          continue;
        }
        if (key === "stock" && value < 0) {
          errors.push("Stock cannot be negative");
          continue;
        }
        if (key === "rating" && (value < 0 || value > 5)) {
          errors.push("Rating must be between 0 and 5");
          continue;
        }
        validatedUpdates[key] = value;
        break;
      case "name":
      case "description":
      case "category":
      case "image":
        if (typeof value !== "string" || value.trim() === "") {
          errors.push(`Field ${key} must be a non-empty string`);
          continue;
        }
        validatedUpdates[key] = value.trim();
        break;
      default:
        validatedUpdates[key] = value;
    }
  }
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return { valid: true, data: validatedUpdates };
}
export function validateAndSanitizeProduct(body: any): {
  valid: boolean;
  errors?: string[];
  data?: any;
} {
  const errors: string[] = [];
  const { name, description, price, category, image, stock, rating } = body;
  if (
    !name ||
    !description ||
    !price ||
    !category ||
    !image ||
    stock === undefined ||
    rating === undefined
  ) {
    errors.push(
      "Missing required fields: name, description, price, category, image, stock, rating"
    );
  }
  if (
    typeof price !== "number" ||
    typeof stock !== "number" ||
    typeof rating !== "number"
  ) {
    errors.push("Invalid data types: price, stock, and rating must be numbers");
  }
  if (price <= 0 || stock < 0 || rating < 0 || rating > 5) {
    errors.push(
      "Invalid values: price must be > 0, stock must be >= 0, rating must be 0-5"
    );
  }
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return {
    valid: true,
    data: {
      name: String(name).trim(),
      description: String(description).trim(),
      price: Number(price),
      category: String(category).trim(),
      image: String(image).trim(),
      stock: Number(stock),
      rating: Number(rating),
    },
  };
}
import { Product } from "../types/Product";

export interface ProductQueryOptions {
  category?: string;
  search?: string;
  maxPrice?: string;
  sort?: "price" | "name";
  order?: "asc" | "desc";
  page?: string;
  limit?: string;
  available?: string;
}

export function queryProducts(
  products: Product[],
  options: ProductQueryOptions
): {
  data: Product[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
} {
  let result = [...products];

  // Category filter
  if (options.category && options.category.trim() !== "") {
    result = result.filter(
      (p) => p.category.toLowerCase() === options.category!.trim().toLowerCase()
    );
  }
  // Search filter
  if (options.search && options.search.trim() !== "") {
    const q = options.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  // Price filter
  if (options.maxPrice) {
    const priceLimit = parseFloat(options.maxPrice);
    if (!isNaN(priceLimit) && priceLimit > 0) {
      result = result.filter((p) => p.price <= priceLimit);
    }
  }
  // Available filter
  if (options.available === "true") {
    result = result.filter((p) => p.stock > 0);
  } else if (options.available === "false") {
    result = result.filter((p) => p.stock === 0);
  }
  // Sort
  if (options.sort === "price" || options.sort === "name") {
    result = result.sort((a, b) => {
      if (options.sort === "price") {
        return options.order === "desc" ? b.price - a.price : a.price - b.price;
      } else {
        return options.order === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      }
    });
  }
  // Pagination
  const pageNum = Math.max(1, parseInt(options.page || "1", 10) || 1);
  const limitNum = Math.max(1, parseInt(options.limit || "10", 10) || 10);
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  const paginated = result.slice(start, end);

  return {
    data: paginated,
    count: result.length,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(result.length / limitNum),
  };
}

/**
 * Get the top N cheapest products with available stock
 * @param products - Array of products to filter
 * @param top - Number of products to return (default: 3)
 * @returns Array of cheapest available products
 */
export function getTopCheapestAvailable(products: any[], top: number = 3): any[] {
  return products
    .filter(product => product.stock > 0) // Filter products with available stock
    .sort((a, b) => a.price - b.price)    // Sort by price ascending
    .slice(0, top);                       // Take top N cheapest
}
