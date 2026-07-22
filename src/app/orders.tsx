import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { ChevronLeft, Utensils, Coffee, Clock, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseService } from '../services/supabaseService';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [currency, setCurrency] = useState<string>("UZS");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const savedAccId = await AsyncStorage.getItem('currentAccountId');
      if (!savedAccId) {
        router.replace('/login');
        return;
      }
      
      const storedOrders = await supabaseService.getOrders(savedAccId);
      setOrders(storedOrders || []);
      
      const storedCurrency = await supabaseService.getCurrency(savedAccId);
      if (storedCurrency) {
        setCurrency(storedCurrency);
      }
    } catch (err) {
      console.error("Error loading orders in notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 1500);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#120e1f" />
      
      {/* Header */}
      <LinearGradient 
        colors={['#d80056', '#7d1f5e', '#1e1333']}
        start={[0, 0]} end={[1, 0]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
        }}>
          <ChevronLeft size={28} color="#fff" />
          <Text style={styles.headerTitle}>Faol Buyurtmalar (Eslatmalar)</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageSubtitle}>Bugungi faol buyurtmalar ro'yxati va ularning tarkibi:</Text>
        
        {orders.length > 0 ? (
          <View style={styles.ordersGrid}>
            {orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerRow}>
                    <View style={styles.orderBadge}>
                      <Text style={styles.orderBadgeText}>{order.id}</Text>
                    </View>
                    <Text style={styles.tableName}>{order.table}</Text>
                  </View>
                  <View style={styles.headerRow}>
                    <Clock size={14} color="#868e96" />
                    <Text style={styles.timeText}>{order.time}</Text>
                  </View>
                </View>

                <View style={styles.waiterRow}>
                  <Text style={styles.waiterText}>Xizmat ko'rsatuvchi: <Text style={styles.waiterName}>{order.waiter || "Mijoz (QR)"}</Text></Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.itemsList}>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item: any, idx: number) => {
                      const isDrink = /choy|cola|fanta|limon|coca|suv/i.test(item.name);
                      const IconComponent = isDrink ? Coffee : Utensils;
                      
                      const formattedItemPrice = typeof item.price === 'number'
                        ? (item.price * item.qty).toLocaleString('uz-UZ') + " " + currency
                        : item.price;

                      return (
                        <View key={idx} style={styles.itemRow}>
                          <View style={styles.itemNameWrapper}>
                            <IconComponent size={12} color="#6c757d" style={{marginRight: 6}} />
                            <Text style={styles.itemNameText}>{item.qty}x {item.name}</Text>
                          </View>
                          <Text style={styles.itemPriceText}>{formattedItemPrice}</Text>
                        </View>
                      );
                    })
                  ) : (
                    <Text style={{ fontSize: 13, color: '#868e96', fontStyle: 'italic' }}>Taomlar kiritilmagan</Text>
                  )}
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                  <Text style={styles.totalLabel}>Jami summa:</Text>
                  <Text style={styles.totalAmount}>{order.amount}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noOrdersContainer}>
            <FileText size={48} color="#cbd5e1" />
            <Text style={styles.noOrdersText}>Faol buyurtmalar mavjud emas</Text>
            <Text style={styles.noOrdersSub}>Mijozlar buyurtma berishsa, bu yerda ko'rinadi.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 40 : 0, 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginLeft: 10 },
  content: { padding: 20 },
  pageSubtitle: { fontSize: 14, color: '#495057', marginBottom: 20, fontStyle: 'italic' },
  ordersGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 20, 
    justifyContent: 'flex-start' 
  },
  orderCard: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 16, 
    minWidth: 300,
    flex: 1,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  orderBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#e91e63', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  orderBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  tableName: { fontSize: 16, fontWeight: '700', color: '#212529' },
  timeText: { fontSize: 13, color: '#868e96', marginLeft: 4, fontWeight: '500' },
  waiterRow: { marginBottom: 10 },
  waiterText: { fontSize: 12, color: '#6c757d' },
  waiterName: { fontWeight: '600', color: '#495057' },
  divider: { height: 1, backgroundColor: '#f1f3f5', marginVertical: 12 },
  itemsList: { gap: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemNameWrapper: { flexDirection: 'row', alignItems: 'center' },
  itemNameText: { fontSize: 14, color: '#343a40', fontWeight: '500' },
  itemPriceText: { fontSize: 13, color: '#868e96', fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  totalLabel: { fontSize: 14, color: '#495057', fontWeight: '600' },
  totalAmount: { fontSize: 18, color: '#d80056', fontWeight: '800' },
  noOrdersContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 20,
  },
  noOrdersText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 16,
  },
  noOrdersSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    textAlign: 'center',
  },
});
