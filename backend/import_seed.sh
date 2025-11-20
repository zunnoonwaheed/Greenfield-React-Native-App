#!/bin/bash

# Import seed data into database
# Usage: bash import_seed.sh

DB_HOST="localhost"
DB_USER="root"
DB_PASS=""
DB_NAME="greenfieldsuperm_db_local"

echo "======================================"
echo "Importing Seed Data to Database"
echo "======================================"
echo ""
echo "Database: $DB_NAME"
echo "File: WORKING_SEED.sql"
echo ""

# Import the seed file
mysql -h "$DB_HOST" -u "$DB_USER" "$DB_NAME" < WORKING_SEED.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Seed data imported successfully!"
    echo ""
    echo "Test Credentials:"
    echo "  Email: ali.hassan@test.com"
    echo "  Password: Test@123"
    echo ""
    echo "Product IDs: 10001 - 10010"
    echo "User IDs: 1000 - 1001"
    echo "Bundle IDs: 1000 - 1001"
    echo ""
else
    echo ""
    echo "❌ ERROR: Failed to import seed data"
    echo ""
fi
