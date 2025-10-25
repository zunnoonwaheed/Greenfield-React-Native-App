-- Create tables for Sell/Ads marketplace feature

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Ads table
CREATE TABLE IF NOT EXISTS ads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT NOT NULL,
  subcategory_id INT,
  condition ENUM('new', 'used') NOT NULL,
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
);

-- Ad images table
CREATE TABLE IF NOT EXISTS ad_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_ads_user_id ON ads(user_id);
CREATE INDEX idx_ads_category_id ON ads(category_id);
CREATE INDEX idx_ads_status ON ads(status);
CREATE INDEX idx_subcategories_category_id ON subcategories(category_id);
