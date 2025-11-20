/**
 * OrderHistoryScreen - Order & Activity History
 * View past orders with details and status
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/MainStack';

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
  status: 'Delivered' | 'Pending' | 'Shipped' | 'Cancelled';
  items: OrderItem[];
  total: number;
}

const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<OrderHistoryScreenNavigationProp>();

  const orders: Order[] = [
    {
      id: '1',
      date: '16/12/2025',
      location: 'Street Address or PO Box (P.O. Box)',
      status: 'Delivered',
      items: [
        { name: 'Milk Pak - 100 Litre', qty: 2, price: 6000 },
        { name: 'Meat - 1KG', qty: 1, price: 800 },
        { name: 'Cheese Slices - 100g', qty: 6, price: 1000 },
      ],
      total: 7800,
    },
    {
      id: '2',
      date: '17/12/2025',
      location: 'Street Address or PO Box (P.O. Box)',
      status: 'Pending',
      items: [
        { name: 'Eggs - Dozen', qty: 3, price: 400 },
        { name: 'Bread - Whole Grain', qty: 2, price: 400 },
        { name: 'Butter - 250g', qty: 1, price: 300 },
      ],
      total: 1300,
    },
    {
      id: '3',
      date: '18/12/2025',
      location: 'City Center',
      status: 'Shipped',
      items: [
        { name: 'Milk - 1L', qty: 5, price: 500 },
        { name: 'Cheese - 200g', qty: 2, price: 700 },
        { name: 'Yogurt - 500g', qty: 4, price: 400 },
      ],
      total: 1600,
    },
    {
      id: '4',
      date: '10/12/2025',
      location: 'Downtown',
      status: 'Delivered',
      items: [
        { name: 'Chicken - 1kg', qty: 1, price: 1200 },
        { name: 'Rice - 5kg', qty: 1, price: 800 },
        { name: 'Vegetables - Mixed', qty: 2, price: 300 },
      ],
      total: 2300,
    },
    {
      id: '5',
      date: '20/12/2025',
      location: 'Uptown',
      status: 'Cancelled',
      items: [
        { name: 'Pasta - 500g', qty: 3, price: 450 },
        { name: 'Tomato Sauce - 300g', qty: 1, price: 250 },
        { name: 'Parmesan - 100g', qty: 1, price: 350 },
      ],
      total: 1050,
    },
  ];

  const getStatusColor = (status: string) => {
    return '#CFFCE3';
  };

  const getStatusTextColor = (status: string) => {
    return '#065F46';
  };

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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {orders.map((order) => (
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
});

export default OrderHistoryScreen;
