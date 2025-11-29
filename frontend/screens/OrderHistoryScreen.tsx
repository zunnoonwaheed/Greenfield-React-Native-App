/**
 * OrderHistoryScreen - Order & Activity History
 * View past orders with details and status - Dynamic from Backend
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { getOrderHistory } from '../api/orderHistoryAPI';

type OrderHistoryScreenNavigationProp = StackNavigationProp<MainStackParamList>;

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  location: string;
  status: 'Delivered' | 'Pending' | 'Shipped' | 'Cancelled' | 'On the Way' | 'Returned';
  items: OrderItem[];
  total: number;
}

// Helper to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<OrderHistoryScreenNavigationProp>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      console.log('📦 Fetching order history...');
      const result = await getOrderHistory();
      console.log('📦 Order history response:', JSON.stringify(result, null, 2));

      if (result.success && result.data?.orders) {
        console.log('📦 Orders count:', result.data.orders.length);
        // Transform backend data to match frontend interface
        const transformedOrders: Order[] = result.data.orders.map((order: any) => ({
          id: String(order.id),
          date: formatDate(order.created_at),
          location: order.delivery_address || 'No address provided',
          status: order.status || 'Pending',
          items: (order.items || []).map((item: any) => ({
            name: item.product_name || 'Product',
            qty: item.quantity || 1,
            price: item.subtotal || item.price || 0,
          })),
          total: order.total || 0,
        }));
        setOrders(transformedOrders);
        console.log('📦 Transformed orders:', transformedOrders.length);
      } else {
        console.log('📦 No orders found or invalid response');
        setOrders([]);
      }
    } catch (error) {
      console.error('📦 Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch on mount and when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  // Pull to refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#CFFCE3';
      case 'Pending':
        return '#FEF3C7';
      case 'Shipped':
      case 'On the Way':
        return '#DBEAFE';
      case 'Cancelled':
      case 'Returned':
        return '#FEE2E2';
      default:
        return '#F3F4F6';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#065F46';
      case 'Pending':
        return '#92400E';
      case 'Shipped':
      case 'On the Way':
        return '#1E40AF';
      case 'Cancelled':
      case 'Returned':
        return '#991B1B';
      default:
        return '#374151';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Image
              source={require('../images/homepage-assets/arrow-back.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order History</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Image
            source={require('../images/homepage-assets/arrow-back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#059669']}
            tintColor="#059669"
          />
        }
      >
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
            <Text style={styles.emptySubtext}>Your order history will appear here</Text>
          </View>
        ) : orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            {/* Order Details */}
            <View style={styles.orderDetailsSection}>
              <Text style={styles.sectionTitle}>Order Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order Date</Text>
                <Text style={styles.detailValue}>{order.date}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{order.location}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(order.status) },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusTextColor(order.status) },
                    ]}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>
            </View>

            {/* Order Summary */}
            <View style={styles.orderSummarySection}>
              <Text style={styles.sectionTitle}>Order Summary</Text>

              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.itemColumn]}>Items</Text>
                <Text style={[styles.tableHeaderText, styles.qtyColumn]}>Qty</Text>
                <Text style={[styles.tableHeaderText, styles.priceColumn]}>Price</Text>
              </View>

              {/* Table Rows */}
              {order.items.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.itemColumn]}>{item.name}</Text>
                  <Text style={[styles.tableCell, styles.qtyColumn]}>{item.qty}</Text>
                  <Text style={[styles.tableCell, styles.priceColumn]}>Rs {item.price}</Text>
                </View>
              ))}

              {/* Total */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>Rs {order.total}</Text>
              </View>
            </View>

            {/* View Details Button */}
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => {
                // Navigate to order details
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
  },
  orderDetailsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  detailValue: {
    fontSize: 14,
    color: '#6C757D',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  orderSummarySection: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  tableCell: {
    fontSize: 14,
    color: '#6C757D',
  },
  itemColumn: {
    flex: 2,
  },
  qtyColumn: {
    flex: 0.5,
    textAlign: 'center',
  },
  priceColumn: {
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E53935',
  },
  viewDetailsButton: {
    backgroundColor: '#026A49',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748B',
  },
});

export default OrderHistoryScreen;
