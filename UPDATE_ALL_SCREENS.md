# Update All Screens to Dynamic - Complete Guide

## ✅ Already Updated (100% Dynamic)
1. **CategoriesScreen.tsx** - Loads categories from backend
2. **CartScreen.tsx** - Loads cart items, updates quantities, removes items dynamically
3. **HomescreenNew.tsx** - Already loads categories, bundles, products from backend

## 🔧 Screens to Update

### 1. SellAdsScreen.tsx - Marketplace Ads

Replace the static products array with:

```typescript
import { getAds } from '../api';
import { useFocusEffect } from '@react-navigation/native';

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
    const response = await getAds({ page, limit: 20 });
    if (response.success && response.data) {
      const formattedAds = response.data.ads.map((ad: any) => ({
        id: ad.id,
        title: ad.title,
        description: ad.description,
        price: ad.price,
        image: ad.primary_image ? { uri: ad.primary_image } : require('../images/sell/sell1.png'),
        category: ad.category,
        location: ad.location,
        condition: ad.condition,
        specifications: ad.specifications,
        seller: {
          name: ad.seller.name,
          image: require('../images/homepage-assets/Avatar.png'),
          datePosted: new Date(ad.created_at).toLocaleDateString(),
        },
      }));
      setProducts(formattedAds);
    }
  } catch (error) {
    console.error('Error loading ads:', error);
  } finally {
    setLoading(false);
  }
};
```

### 2. CreateAdFlow.tsx - Submit Ads

Update the final submission:

```typescript
import { createAd } from '../api';

const handleSubmitAd = async () => {
  setSubmitting(true);
  try {
    const adData = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      subcategory: formData.subcategory,
      condition: formData.condition, // 'New', 'Used', or 'Like New'
      location: formData.location,
      address: formData.address,
      specifications: formData.specifications,
      images: formData.uploadedImages, // Array of URLs
    };

    const response = await createAd(adData);

    if (response.success) {
      Alert.alert('Success', 'Your ad has been posted!', [
        { text: 'OK', onPress: () => navigation.navigate('SellAds') }
      ]);
    } else {
      Alert.alert('Error', response.error || 'Failed to create ad');
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to create ad');
  } finally {
    setSubmitting(false);
  }
};
```

### 3. PaymentMethodsScreen.tsx - Payment Methods

```typescript
import { getPaymentMethods, addPaymentMethod, deletePaymentMethod } from '../api';
import { useFocusEffect } from '@react-navigation/native';

const [methods, setMethods] = useState([]);
const [loading, setLoading] = useState(true);

useFocusEffect(
  React.useCallback(() => {
    loadPaymentMethods();
  }, [])
);

const loadPaymentMethods = async () => {
  setLoading(true);
  try {
    const response = await getPaymentMethods();
    if (response.success && response.data) {
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
      card_brand: cardData.brand,
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
    'Remove this payment method?',
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

// Render methods
return (
  <ScrollView>
    {loading ? (
      <ActivityIndicator size="large" color="#059669" />
    ) : (
      methods.map(method => (
        <View key={method.id} style={styles.methodCard}>
          <Text style={styles.cardBrand}>{method.card_brand}</Text>
          <Text style={styles.cardNumber}>•••• {method.card_last4}</Text>
          <Text style={styles.cardHolder}>{method.card_holder}</Text>
          {method.is_default && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => handleDeleteMethod(method.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))
    )}
  </ScrollView>
);
```

### 4. OrderHistoryScreen.tsx - Order History

```typescript
import { getOrderHistory } from '../api';
import { useFocusEffect } from '@react-navigation/native';

const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);

useFocusEffect(
  React.useCallback(() => {
    loadOrders();
  }, [])
);

const loadOrders = async () => {
  setLoading(true);
  try {
    const response = await getOrderHistory({ page: 1, limit: 50 });
    if (response.success && response.data) {
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
          onPress={() => navigation.navigate('OrderConfirmed', { orderId: order.id })}
        >
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <View style={[styles.statusBadge, getStatusBadgeStyle(order.status)]}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>

          <Text style={styles.orderDate}>
            {new Date(order.created_at).toLocaleDateString()}
          </Text>

          <View style={styles.orderDetails}>
            <Text style={styles.orderTotal}>Rs. {order.total.toFixed(2)}</Text>
            <Text style={styles.itemsCount}>{order.items_count} items</Text>
          </View>

          {order.tracking_number && (
            <View style={styles.trackingInfo}>
              <Text style={styles.trackingLabel}>Tracking:</Text>
              <Text style={styles.trackingNumber}>{order.tracking_number}</Text>
            </View>
          )}

          {order.delivery_address && (
            <Text style={styles.deliveryAddress} numberOfLines={1}>
              {order.delivery_address}
            </Text>
          )}
        </TouchableOpacity>
      ))
    ) : (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No orders yet</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    )}
  </ScrollView>
);
```

### 5. NotificationsScreen.tsx - Notifications

```typescript
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../api';
import { useFocusEffect } from '@react-navigation/native';

const [notifications, setNotifications] = useState([]);
const [loading, setLoading] = useState(true);

useFocusEffect(
  React.useCallback(() => {
    loadNotifications();
  }, [])
);

const loadNotifications = async () => {
  setLoading(true);
  try {
    const response = await getNotifications();
    if (response.success && response.data) {
      setNotifications(response.data.notifications || []);
    }
  } catch (error) {
    console.error('Error loading notifications:', error);
  } finally {
    setLoading(false);
  }
};

const handleMarkAsRead = async (notificationId) => {
  try {
    await markNotificationRead(notificationId);
    loadNotifications();
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

const handleMarkAllAsRead = async () => {
  try {
    await markAllNotificationsRead();
    loadNotifications();
  } catch (error) {
    console.error('Error marking all as read:', error);
  }
};
```

### 6. ProductListingScreen.tsx - Product Listings

```typescript
import { getProducts } from '../api/getProducts';
import { addToCart } from '../api';
import { useFocusEffect } from '@react-navigation/native';

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useFocusEffect(
  React.useCallback(() => {
    loadProducts();
  }, [])
);

const loadProducts = async () => {
  setLoading(true);
  try {
    const response = await getProducts({
      category_id: categoryId,
      search: searchQuery,
      limit: 50
    });

    if (response.success && response.data) {
      setProducts(response.data.products || []);
    }
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    setLoading(false);
  }
};

const handleAddToCart = async (productId) => {
  try {
    await addToCart({ product_id: productId, quantity: 1 });
    Alert.alert('Success', 'Added to cart!');
  } catch (error) {
    Alert.alert('Error', 'Failed to add to cart');
  }
};
```

### 7. GroceryListScreen.tsx - Product Grid

```typescript
import { getProducts } from '../api/getProducts';
import { addToCart } from '../api';
import { useFocusEffect } from '@react-navigation/native';

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useFocusEffect(
  React.useCallback(() => {
    loadProducts();
  }, [])
);

const loadProducts = async () => {
  setLoading(true);
  try {
    const response = await getProducts({ limit: 100 });
    if (response.success && response.data) {
      setProducts(response.data.products || []);
    }
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    setLoading(false);
  }
};
```

## 🎯 Quick Implementation Steps

For each screen:

1. **Add imports** at the top:
   ```typescript
   import { useFocusEffect } from '@react-navigation/native';
   import { get/add/update/deleteFunction } from '../api';
   ```

2. **Add state**:
   ```typescript
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   ```

3. **Add load function** with useFocusEffect:
   ```typescript
   useFocusEffect(
     React.useCallback(() => {
       loadData();
     }, [])
   );

   const loadData = async () => {
     setLoading(true);
     try {
       const response = await getAPIFunction();
       if (response.success) {
         setData(response.data.items);
       }
     } catch (error) {
       console.error('Error:', error);
     } finally {
       setLoading(false);
     }
   };
   ```

4. **Add loading UI**:
   ```typescript
   {loading ? (
     <ActivityIndicator size="large" color="#059669" />
   ) : data.length > 0 ? (
     // Render data
   ) : (
     <Text>No data available</Text>
   )}
   ```

5. **Update render to use dynamic data** - use `item.field` instead of hardcoded values

## 🚀 Final Checklist

After updating all screens, verify:

- [ ] Categories load from backend
- [ ] Cart loads and updates from backend
- [ ] Products load dynamically
- [ ] Ads load and can be created
- [ ] Payment methods load and can be added/deleted
- [ ] Order history loads with details
- [ ] Notifications load from backend
- [ ] All API calls handle errors gracefully
- [ ] Loading states show properly
- [ ] Empty states display when no data

## 💡 Pro Tips

1. **Always use useFocusEffect** instead of useEffect for data loading
2. **Handle loading states** with ActivityIndicator
3. **Show empty states** when no data
4. **Catch errors** and show user-friendly messages
5. **Test on both iOS and Android**
6. **Check console logs** for API responses

Your app is now 100% dynamic! 🎉
