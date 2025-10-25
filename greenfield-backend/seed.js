// ============================================
// DATABASE SEED FILE (MySQL Version)
// Populates database with initial/sample data
// ============================================

const { query, pool } = require('./config/database');
const bcrypt = require('bcrypt');

// ============================================
// SEED DATA
// ============================================

const seedData = {
  // Locations - DHA Phases and Sectors
  locations: [
    { name: 'DHA Phase 2', type: 'phase', parent_id: null },
    { name: 'DHA Phase 5', type: 'phase', parent_id: null },
    { name: 'DHA Emaar - Canyon Views', type: 'phase', parent_id: null },
  ],

  sectors: [
    // Phase 2 sectors (parent_id will be set dynamically)
    { name: 'Sector A', type: 'sector', phase: 'DHA Phase 2' },
    { name: 'Sector B', type: 'sector', phase: 'DHA Phase 2' },
    { name: 'Sector C', type: 'sector', phase: 'DHA Phase 2' },
    { name: 'Sector D', type: 'sector', phase: 'DHA Phase 2' },
    { name: 'Sector E', type: 'sector', phase: 'DHA Phase 2' },
    { name: 'Sector F', type: 'sector', phase: 'DHA Phase 2' },
    { name: 'Sector G', type: 'sector', phase: 'DHA Phase 2' },
    { name: 'Sector H', type: 'sector', phase: 'DHA Phase 2' },
    
    // Phase 5 sectors
    { name: 'Sector A', type: 'sector', phase: 'DHA Phase 5' },
    { name: 'Sector B', type: 'sector', phase: 'DHA Phase 5' },
    { name: 'Sector C', type: 'sector', phase: 'DHA Phase 5' },
    { name: 'Sector D', type: 'sector', phase: 'DHA Phase 5' },
    { name: 'Sector E', type: 'sector', phase: 'DHA Phase 5' },
    
    // Canyon Views sectors
    { name: 'Mirador 1', type: 'sector', phase: 'DHA Emaar - Canyon Views' },
    { name: 'Mirador 3', type: 'sector', phase: 'DHA Emaar - Canyon Views' },
    { name: 'Mirador 5', type: 'sector', phase: 'DHA Emaar - Canyon Views' },
    { name: 'Mirador 7', type: 'sector', phase: 'DHA Emaar - Canyon Views' },
    { name: 'Prados 1', type: 'sector', phase: 'DHA Emaar - Canyon Views' },
    { name: 'Prados 2', type: 'sector', phase: 'DHA Emaar - Canyon Views' },
    { name: 'Alma 1', type: 'sector', phase: 'DHA Emaar - Canyon Views' },
    { name: 'CVR', type: 'sector', phase: 'DHA Emaar - Canyon Views' },
  ],

  // Sample admin user
  users: [
    {
      name: 'Admin User',
      email: 'admin@greenfield.com',
      password: 'admin123', // Will be hashed
      phone: '03001234567'
    },
    {
      name: 'Test Customer',
      email: 'customer@test.com',
      password: 'test123',
      phone: '03009876543'
    }
  ],

  // Product Categories
  categories: [
    { name: 'Fresh Fruits', slug: 'fresh-fruits' },
    { name: 'Fresh Vegetables', slug: 'fresh-vegetables' },
    { name: 'Dairy Products', slug: 'dairy-products' },
    { name: 'Bakery Items', slug: 'bakery-items' },
    { name: 'Beverages', slug: 'beverages' },
    { name: 'Frozen Foods', slug: 'frozen-foods' },
    { name: 'Cooking Oil & Ghee', slug: 'cooking-oil-and-ghee' },
    { name: 'Spices & Seasonings', slug: 'spices-and-seasonings' },
    { name: 'Snacks & Chocolates', slug: 'snacks-and-chocolates' },
    { name: 'Personal Care', slug: 'personal-care' },
    { name: 'Home Care', slug: 'home-care' },
    { name: 'Pet Food', slug: 'pet-food' }
  ],

  // Sample Products
  products: [
    {
      name: 'Fresh Mango 1kg',
      slug: 'fresh-mango-1kg',
      category: 'Fresh Fruits',
      price: 350.00,
      sale_price: 320.00,
      stock: 100,
      description: 'Fresh juicy mangoes'
    },
    {
      name: 'Organic Tomatoes 1kg',
      slug: 'organic-tomatoes-1kg',
      category: 'Fresh Vegetables',
      price: 120.00,
      sale_price: 0,
      stock: 150,
      description: 'Farm fresh organic tomatoes'
    },
    {
      name: 'Full Cream Milk 1L',
      slug: 'full-cream-milk-1l',
      category: 'Dairy Products',
      price: 280.00,
      sale_price: 0,
      stock: 200,
      description: 'Fresh full cream milk'
    },
    {
      name: 'White Bread',
      slug: 'white-bread',
      category: 'Bakery Items',
      price: 120.00,
      sale_price: 110.00,
      stock: 80,
      description: 'Freshly baked white bread'
    },
    {
      name: 'Coca Cola 1.5L',
      slug: 'coca-cola-15l',
      category: 'Beverages',
      price: 180.00,
      sale_price: 0,
      stock: 300,
      description: 'Chilled Coca Cola'
    }
  ],

  // Brands
  brands: [
    { name: 'Greenfield', slug: 'greenfield' },
    { name: 'National', slug: 'national' },
    { name: 'Shangrila', slug: 'shangrila' },
    { name: 'Nurpur', slug: 'nurpur' },
    { name: 'Coca Cola', slug: 'coca-cola' },
    { name: 'Pepsi', slug: 'pepsi' },
    { name: 'Nestle', slug: 'nestle' },
  ],

  // Marketplace Ad Categories (for Sell/Ads section)
  adCategories: [
    { name: 'Electronics', icon: 'laptop' },
    { name: 'Furniture', icon: 'bed' },
    { name: 'Grocery', icon: 'basket' },
    { name: 'Vehicles', icon: 'car' },
    { name: 'Clothing', icon: 'shirt' },
    { name: 'Books', icon: 'book' },
  ],

  // Subcategories for marketplace ads
  adSubcategories: {
    'Electronics': ['Mobile Phones', 'Laptops', 'Cameras', 'Gaming', 'TVs', 'Audio Systems'],
    'Furniture': ['Chairs', 'Tables', 'Beds', 'Storage', 'Sofas', 'Wardrobes'],
    'Grocery': ['Fruits', 'Vegetables', 'Grains', 'Dairy', 'Bakery', 'Beverages'],
    'Vehicles': ['Cars', 'Motorcycles', 'Bicycles', 'Parts & Accessories'],
    'Clothing': ['Men', 'Women', 'Kids', 'Shoes', 'Accessories'],
    'Books': ['Fiction', 'Non-Fiction', 'Academic', 'Comics', 'Magazines'],
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if table exists
 */
const tableExists = async (tableName) => {
  try {
    const result = await query(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = ?`,
      [tableName]
    );
    return result[0].count > 0;
  } catch (err) {
    return false;
  }
};

// ============================================
// SEED FUNCTIONS
// ============================================

/**
 * Clear all tables (use with caution!)
 */
const clearTables = async () => {
  console.log('🗑️  Clearing existing data...');

  const tables = [
    'ad_images',
    'ads',
    'subcategories',
    'categories',
    'order_items',
    'orders',
    'user_locations',
    'proe', // products table
    'sizee', // categories table
    'brands',
    'bundles',
    'locations',
    'users'
  ];

  for (const table of tables) {
    try {
      const exists = await tableExists(table);
      if (!exists) {
        console.log(`⚠️  Table ${table} does not exist, skipping...`);
        continue;
      }

      await query(`DELETE FROM ${table}`);
      // Reset auto increment for MySQL
      await query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
      console.log(`✅ Cleared ${table}`);
    } catch (err) {
      console.log(`⚠️  Could not clear ${table}:`, err.message);
    }
  }
};

/**
 * Seed locations (phases and sectors)
 */
const seedLocations = async () => {
  console.log('📍 Seeding locations...');
  
  // Check if table exists
  const exists = await tableExists('locations');
  if (!exists) {
    console.log('⚠️  Table "locations" does not exist. Creating it...');
    
    await query(`
      CREATE TABLE IF NOT EXISTS locations (
        id INT(11) NOT NULL AUTO_INCREMENT,
        parent_id INT(11) DEFAULT NULL,
        name VARCHAR(255) NOT NULL,
        type ENUM('phase','sector') NOT NULL DEFAULT 'phase',
        PRIMARY KEY (id),
        KEY fk_parent (parent_id),
        CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES locations (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1
    `);
    console.log('✅ Created locations table');
  }
  
  const phaseMap = {};

  // Insert phases first
  for (const location of seedData.locations) {
    const result = await query(
      'INSERT INTO locations (name, type, parent_id) VALUES (?, ?, ?)',
      [location.name, location.type, location.parent_id]
    );
    phaseMap[location.name] = result.insertId;
    console.log(`  ✅ Created phase: ${location.name} (ID: ${result.insertId})`);
  }

  // Insert sectors
  for (const sector of seedData.sectors) {
    const parentId = phaseMap[sector.phase];
    await query(
      'INSERT INTO locations (name, type, parent_id) VALUES (?, ?, ?)',
      [sector.name, sector.type, parentId]
    );
  }
  
  console.log(`  ✅ Created ${seedData.sectors.length} sectors`);
};

/**
 * Check if column exists in table
 */
const columnExists = async (tableName, columnName) => {
  try {
    const result = await query(
      `SELECT COUNT(*) as count FROM information_schema.columns 
       WHERE table_schema = DATABASE() 
       AND table_name = ? 
       AND column_name = ?`,
      [tableName, columnName]
    );
    return result[0].count > 0;
  } catch (err) {
    return false;
  }
};

/**
 * Seed users
 */
const seedUsers = async () => {
  console.log('👤 Seeding users...');
  
  const exists = await tableExists('users');
  if (!exists) {
    console.log('⚠️  Table "users" does not exist. Please run the schema first.');
    return;
  }

  // Check which columns exist
  const hasPhone = await columnExists('users', 'phone');
  const hasAddress = await columnExists('users', 'address');
  
  for (const user of seedData.users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    // Build dynamic query based on available columns
    let sql = 'INSERT INTO users (name, email, password';
    const values = [user.name, user.email, hashedPassword];
    
    if (hasPhone) {
      sql += ', phone';
      values.push(user.phone);
    }
    
    if (hasAddress) {
      sql += ', address';
      values.push('');
    }
    
    sql += ') VALUES (' + values.map(() => '?').join(', ') + ')';
    
    await query(sql, values);
    console.log(`  ✅ Created user: ${user.email}`);
  }
};

/**
 * Seed categories
 */
const seedCategories = async () => {
  console.log('📂 Seeding categories...');
  
  const exists = await tableExists('sizee');
  if (!exists) {
    console.log('⚠️  Table "sizee" does not exist. Skipping categories...');
    return {};
  }
  
  const categoryMap = {};
  
  for (const category of seedData.categories) {
    const result = await query(
      `INSERT INTO sizee (name, title, slug, keyword, catID, websiteID, mainID)
       VALUES (?, ?, ?, ?, 2, 1, 2)`,
      [category.name, category.name, category.slug, category.slug]
    );
    categoryMap[category.name] = result.insertId;
    console.log(`  ✅ Created category: ${category.name}`);
  }
  
  return categoryMap;
};

/**
 * Seed brands
 */
const seedBrands = async () => {
  console.log('🏷️  Seeding brands...');
  
  const exists = await tableExists('brands');
  if (!exists) {
    console.log('⚠️  Table "brands" does not exist. Creating it...');
    
    await query(`
      CREATE TABLE IF NOT EXISTS brands (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        image VARCHAR(255) DEFAULT NULL,
        status TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1
    `);
    console.log('✅ Created brands table');
  }
  
  for (const brand of seedData.brands) {
    await query(
      'INSERT INTO brands (name, slug) VALUES (?, ?)',
      [brand.name, brand.slug]
    );
    console.log(`  ✅ Created brand: ${brand.name}`);
  }
};

/**
 * Seed products
 */
const seedProducts = async (categoryMap) => {
  console.log('🛍️  Seeding products...');

  const exists = await tableExists('proe');
  if (!exists) {
    console.log('⚠️  Table "proe" does not exist. Skipping products...');
    return;
  }

  if (Object.keys(categoryMap).length === 0) {
    console.log('⚠️  No categories found. Skipping products...');
    return;
  }

  for (const product of seedData.products) {
    const categoryId = categoryMap[product.category];

    if (!categoryId) {
      console.log(`⚠️  Category not found for ${product.name}, skipping...`);
      continue;
    }

    await query(
      `INSERT INTO proe (name, slug, catid, price, sale_price, qty, details, websiteID, mainID, catID)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 2, 2)`,
      [
        product.name,
        product.slug,
        categoryId,
        product.price,
        product.sale_price,
        product.stock,
        product.description
      ]
    );
    console.log(`  ✅ Created product: ${product.name}`);
  }
};

/**
 * Create marketplace ad tables
 */
const createAdTables = async () => {
  console.log('📦 Creating ad marketplace tables...');

  // Create categories table
  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      icon VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('  ✅ Created categories table');

  // Create subcategories table
  await query(`
    CREATE TABLE IF NOT EXISTS subcategories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);
  console.log('  ✅ Created subcategories table');

  // Create ads table
  await query(`
    CREATE TABLE IF NOT EXISTS ads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category_id INT NOT NULL,
      subcategory_id INT,
      \`condition\` ENUM('new', 'used') NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      negotiable BOOLEAN DEFAULT FALSE,
      specifications TEXT,
      city VARCHAR(255),
      address TEXT,
      phone VARCHAR(20),
      email VARCHAR(255),
      status ENUM('active', 'sold', 'inactive') DEFAULT 'active',
      views INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
      FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL
    )
  `);
  console.log('  ✅ Created ads table');

  // Create ad_images table
  await query(`
    CREATE TABLE IF NOT EXISTS ad_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ad_id INT NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      is_primary BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE
    )
  `);
  console.log('  ✅ Created ad_images table');
};

/**
 * Seed ad categories and subcategories
 */
const seedAdCategories = async () => {
  console.log('🏷️  Seeding ad categories...');

  const categoryMap = {};

  for (const category of seedData.adCategories) {
    const result = await query(
      'INSERT INTO categories (name, icon) VALUES (?, ?)',
      [category.name, category.icon]
    );
    categoryMap[category.name] = result.insertId;
    console.log(`  ✅ Created category: ${category.name}`);
  }

  // Seed subcategories
  console.log('📋 Seeding ad subcategories...');
  for (const [categoryName, subcategories] of Object.entries(seedData.adSubcategories)) {
    const categoryId = categoryMap[categoryName];

    for (const subcategoryName of subcategories) {
      await query(
        'INSERT INTO subcategories (category_id, name) VALUES (?, ?)',
        [categoryId, subcategoryName]
      );
    }
    console.log(`  ✅ Created ${subcategories.length} subcategories for ${categoryName}`);
  }
};

// ============================================
// MAIN SEED FUNCTION
// ============================================

const seedDatabase = async () => {
  try {
    console.log('\n🌱 Starting database seed...\n');

    // Clear existing data (optional - comment out in production)
    await clearTables();
    console.log('');

    // Seed in order (respecting foreign keys)
    await seedLocations();
    await seedUsers();
    // const categoryMap = await seedCategories(); // Skip grocery categories for now
    // await seedBrands(); // Skip brands for now
    // await seedProducts(categoryMap); // Skip grocery products for now

    // Create and seed marketplace ad tables
    await createAdTables();
    await seedAdCategories();

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('📝 Default login credentials:');
    console.log('   Admin: admin@greenfield.com / admin123');
    console.log('   Customer: customer@test.com / test123\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, clearTables };