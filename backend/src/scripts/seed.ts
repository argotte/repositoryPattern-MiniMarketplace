import { connectDB, disconnectDB } from "../config/database";
import { ProductModel } from "../models/Product";
import productsData from "../data/products.json";

/**
 * Seed script to populate MongoDB with initial product data
 * Usage: npm run seed
 */
async function seedDatabase(): Promise<void> {
  try {
    console.log("🌱 Starting database seed...");

    // Connect to MongoDB
    await connectDB();

    // Clear existing products
    const deleteResult = await ProductModel.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing products`);

    // Insert new products
    const insertedProducts = await ProductModel.insertMany(productsData);
    console.log(`✅ Successfully seeded ${insertedProducts.length} products`);

    // Display summary
    console.log("\n📊 Seeded products summary:");
    const categories = [...new Set(productsData.map((p) => p.category))];
    categories.forEach((category) => {
      const count = productsData.filter((p) => p.category === category).length;
      console.log(`   ${category}: ${count} products`);
    });

    console.log("\n🎉 Database seed completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    // Disconnect from MongoDB
    await disconnectDB();
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
