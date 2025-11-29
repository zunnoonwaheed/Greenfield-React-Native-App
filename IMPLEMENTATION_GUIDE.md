# Greenfield Integration - Complete Dynamic Implementation Guide

## Overview

This guide provides step-by-step instructions to make your Greenfield app **100% dynamic** with all data coming from the backend and database.

## ✅ What's Been Completed

### Backend Infrastructure
1. **Database Schema**
   - ✅ Marketplace/Ads tables (`marketplace_ads`, `marketplace_ad_images`)
   - ✅ Payment methods table (`payment_methods`)
   - ✅ Enhanced orders table (with payment info, delivery tracking)
   - ✅ Marketplace categories (`marketplace_categories`)

2. **PHP API Endpoints Created**
   - ✅ `/api/ads.php` - List all ads with filters
   - ✅ `/api/ad-detail.php` - Get ad details
   - ✅ `/api/create-ad.php` - Create new ad
   - ✅ `/api/delete-ad.php` - Delete ad
   - ✅ `/api/payment-methods.php` - Get/Add payment methods
   - ✅ `/api/delete-payment-method.php` - Delete payment method
   - ✅ `/api/order-history.php` - Enhanced order history with details

3. **Frontend API Modules Created**
   - ✅ `marketplaceAPI.js` - All marketplace/ads functions
   - ✅ `paymentAPI.js` - Payment methods management
   - ✅ `orderHistoryAPI.js` - Order history with full details
   - ✅ Updated `api/index.js` to export all new modules

4. **Sample Data**
   - ✅ 70+ products (groceries, produce, dairy, snacks, beverages)
   - ✅ 10 sample marketplace ads
   - ✅ 5 payment methods
   - ✅ Categories, locations, bundles

## 📋 Implementation Steps

### Step 1: Database Setup (5 minutes)

```bash
cd /Users/mac/Greenfield-Integration

# 1. Import marketplace schema
mysql -u root -p greenfieldsuperm_db_local < backend/schema_ads_marketplace.sql

# 2. Import seed data (if COMPREHENSIVE_SEED exists, use it, otherwise use both)
mysql -u root -p greenfieldsuperm_db_local < backend/COMPREHENSIVE_SEED.sql
mysql -u root -p greenfieldsuperm_db_local < backend/seed_ads_marketplace.sql

# 3. Verify data
mysql -u root -p greenfieldsuperm_db_local -e "SELECT COUNT(*) FROM marketplace_ads;"
mysql -u root -p greenfieldsuperm_db_local -e "SELECT COUNT(*) FROM payment_methods;"
```

### Step 2: Update CategoriesScreen (10 minutes)

**Option A: Replace existing file**
```bash
mv frontend/screens/CategoriesScreen.tsx frontend/screens/CategoriesScreen_OLD.tsx
mv frontend/screens/CategoriesScreenDynamic.tsx frontend/screens/CategoriesScreen.tsx
```

**Option B: Update manually**

Add to CategoriesScreen.tsx:
```typescript
import { getCategories } from '../api/getCategories';
import { useFocusEffect } from '@react-navigation/native';

// Replace static categories array with state
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);

// Load from backend
useFocusEffect(
  React.useCallback(() => {
    loadCategories();
  }, [])
);

const loadCategories = async () => {
  const response = await getCategories();
  if (response.success) {
    setCategories(response.data.categories);
  }
  setLoading(false);
};
```

### Step 3: Update SellAdsScreen (15 minutes)

Replace static products array with dynamic data:

```typescript
// frontend/screens/SellAdsScreen.tsx
import { getAds } from '../api';
import { useFocusEffect } from '@react-navigation/native';

const SellAdsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useFocusEffect(
    React.useCallback(() => {
      loadAds();
    }, [])
  );

  const loadAds = async () => {
    setLoading(true);
    try {
      const response = await getAds({ page, limit: 20, featured: false });
      if (response.success) {
        setProducts(response.data.ads);
      }
    } catch (error) {
      console.error('Error loading ads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update product card to use API data
  const renderProductCard = (item) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('MarketplaceProductDetail', { adId: item.id })}
    >
      <Image
        source={item.primary_image ? { uri: item.primary_image } : require('../images/sell/sell1.png')}
        style={styles.productImage}
      />
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>Rs. {item.price.toLocaleString()}</Text>
      <Text style={styles.productLocation}>{item.location}</Text>
      <Text style={styles.productCondition}>{item.condition}</Text>
    </TouchableOpacity>
  );
};
```

### Step 4: Update CreateAd Flow (20 minutes)

Update `CreateAdFlow.tsx` or individual steps to submit to backend:

```typescript
// frontend/screens/CreateAd/CreateAdStep3.tsx or CreateAdFlow.tsx
import { createAd } from '../api';

const handleSubmitAd = async () => {
  try {
    setSubmitting(true);

    const adData = {
      title: adTitle,
      description: adDescription,
      price: parseFloat(adPrice),
      category: selectedCategory,
      subcategory: selectedSubcategory,
      condition: adCondition, // 'New', 'Used', or 'Like New'
      location: adLocation,
      address: adAddress,
      specifications: specifications, // Array of strings
      images: uploadedImageUrls, // Array of image URLs
    };

    const response = await createAd(adData);

    if (response.success) {
      Alert.alert('Success', 'Your ad has been posted!', [
        { text: 'OK', onPress: () => navigation.navigate('SellAds') }
      ]);
    } else {
      Alert.alert('Error', response.error);
    }
  } catch (error) {
    console.error('Error creating ad:', error);
    Alert.alert('Error', 'Failed to create ad');
  } finally {
    setSubmitting(false);
  }
};
```

### Step 5: Update CartScreen (15 minutes)

The cart API endpoints already exist. Update CartScreen to use them:

```typescript
// frontend/screens/CartScreen.tsx
import { getCartContents, addToCart, updateCart, removeFromCart } from '../api';
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadCart();
    }, [])
  );

  const loadCart = async () => {
    try {
      const response = await getCartContents();
      if (response.success) {
        setItems(response.data.cart_items || []);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeQty = async (itemId, delta) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const newQty = Math.max(0, item.quantity + delta);

    if (newQty === 0) {
      // Remove item
      await removeFromCart(item.product_id);
    } else {
      // Update quantity
      await updateCart(item.product_id, newQty);
    }

    // Reload cart
    loadCart();
  };

  // Make sure to use dynamic data in rendering
  const renderItem = (item) => (
    <View style={styles.card}>
      <Image
        source={item.image_url ? { uri: item.image_url } : require('../images/homepage-assets/salt.png')}
        style={styles.thumb}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.title}>{item.product_name}</Text>
        <Text style={styles.meta}>Price: Rs. {item.price}</Text>
        {/* Quantity controls */}
        <View style={styles.qtyBar}>
          <TouchableOpacity onPress={() => changeQty(item.id, -1)}>
            <Text>-</Text>
          </TouchableOpacity>
          <Text>{item.quantity}</Text>
          <TouchableOpacity onPress={() => changeQty(item.id, 1)}>
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
```

### Step 6: Update PaymentMethodsScreen (15 minutes)

```typescript
// frontend/screens/PaymentMethodsScreen.tsx
import { getPaymentMethods, addPaymentMethod, deletePaymentMethod } from '../api';
import { useFocusEffect } from '@react-navigation/native';

const PaymentMethodsScreen = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadPaymentMethods();
    }, [])
  );

  const loadPaymentMethods = async () => {
    try {
      const response = await getPaymentMethods();
      if (response.success) {
        setMethods(response.data.payment_methods || []);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (cardData) => {
    try {
      const response = await addPaymentMethod({
        method_type: 'card',
        card_last4: cardData.number.slice(-4),
        card_holder: cardData.holderName,
        card_brand: cardData.brand, // Visa, Mastercard, etc.
        is_default: cardData.setAsDefault
      });

      if (response.success) {
        Alert.alert('Success', 'Card added successfully');
        loadPaymentMethods();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add card');
    }
  };

  const handleDeleteMethod = async (methodId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const response = await deletePaymentMethod(methodId);
            if (response.success) {
              loadPaymentMethods();
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView>
      {loading ? (
        <ActivityIndicator size="large" color="#059669" />
      ) : (
        methods.map(method => (
          <View key={method.id} style={styles.methodCard}>
            <Text>{method.card_brand} •••• {method.card_last4}</Text>
            <Text>{method.card_holder}</Text>
            {method.is_default && <Text style={styles.defaultBadge}>Default</Text>}
            <TouchableOpacity onPress={() => handleDeleteMethod(method.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
      <TouchableOpacity onPress={() => {/* Show add card modal */}}>
        <Text>+ Add New Card</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
```

### Step 7: Update OrderHistoryScreen (10 minutes)

```typescript
// frontend/screens/OrderHistoryScreen.tsx
import { getOrderHistory } from '../api';
import { useFocusEffect } from '@react-navigation/native';

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadOrders();
    }, [])
  );

  const loadOrders = async () => {
    try {
      const response = await getOrderHistory({ page: 1, limit: 50 });
      if (response.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      {loading ? (
        <ActivityIndicator size="large" color="#059669" />
      ) : orders.length > 0 ? (
        orders.map(order => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
          >
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <Text style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString()}</Text>
            <Text style={styles.orderTotal}>Rs. {order.total.toLocaleString()}</Text>
            <Text style={styles.orderStatus}>{order.status}</Text>
            <Text style={styles.itemsCount}>{order.items_count} items</Text>
            {order.tracking_number && (
              <Text style={styles.tracking}>Tracking: {order.tracking_number}</Text>
            )}
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text>No orders yet</Text>
        </View>
      )}
    </ScrollView>
  );
};
```

### Step 8: Fix Homepage Address Selection (10 minutes)

In `HomescreenNew.tsx`, the address loading is already partially implemented. Update to refresh when new address is added:

```typescript
// frontend/screens/HomescreenNew.tsx

// In handleAddressAdded function:
const handleAddressAdded = () => {
  loadDefaultAddress(); // This already exists
  setShowAddNewAddress(false);
  // Force reload to show new address
  setTimeout(() => {
    loadAllData();
  }, 500);
};

// Ensure getUserAddress returns the newly added address
const loadDefaultAddress = async () => {
  try {
    const response = await getUserAddress();
    if (response.success && response.data && response.data.user) {
      // Get the most recent address or default address
      const address = response.data.user.address || 'Set delivery address';
      setDeliveryAddress(address);
      console.log('✅ Address loaded:', address);
    } else {
      setDeliveryAddress('Set delivery address');
    }
  } catch (error) {
    console.error('Error loading address:', error);
    setDeliveryAddress('Set delivery address');
  }
};
```

## 🔥 Testing Checklist

After implementation, test each feature:

### Categories
- [ ] Categories screen loads from backend
- [ ] All categories display with correct images
- [ ] Clicking category navigates to products
- [ ] Empty state shows if no categories

### Marketplace/Ads
- [ ] Ads list loads from backend
- [ ] Can view ad details
- [ ] Can create new ad
- [ ] Can delete own ad
- [ ] Search and filters work
- [ ] Images display correctly

### Cart
- [ ] Cart loads items from backend
- [ ] Can add items to cart
- [ ] Can update quantities
- [ ] Can remove items
- [ ] Cart count updates

### Payment Methods
- [ ] Payment methods list loads
- [ ] Can add new payment method
- [ ] Can delete payment method
- [ ] Default payment method marked

### Order History
- [ ] Orders list loads
- [ ] Order details show correctly
- [ ] Can view order items
- [ ] Tracking info displays

### Homepage
- [ ] Address updates after adding new address
- [ ] Categories load dynamically
- [ ] Bundles load dynamically
- [ ] Cart and notification badges work

## 🎯 Performance Tips

1. **Use useFocusEffect** instead of useEffect for data loading - ensures refresh when navigating back
2. **Add pull-to-refresh** on list screens
3. **Implement pagination** for long lists (ads, orders)
4. **Cache frequently accessed data** in AsyncStorage
5. **Add loading skeletons** instead of spinners for better UX

## 📝 Common Issues & Solutions

### Issue: API returns 404
**Solution**: Check PHP backend URL in `axiosConfig.js`, ensure backend server is running

### Issue: Empty data on screens
**Solution**: Verify database has seed data, check console logs for API errors

### Issue: Authentication errors
**Solution**: Ensure JWT token is stored and sent with requests, test login endpoint first

### Issue: Images not displaying
**Solution**: Use `{ uri: imageUrl }` format for remote images, or require() for local images

## 🚀 Next Steps

1. Run database setup script
2. Update each screen one by one
3. Test thoroughly on both iOS and Android
4. Add error boundaries for better error handling
5. Implement offline support with AsyncStorage caching
6. Add analytics to track user behavior

## 📞 Support

For implementation help:
1. Check console logs for detailed error messages
2. Verify database connection and seed data
3. Test API endpoints directly with Postman/curl
4. Review PHP error logs in `/var/log/php/error.log`
