import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import { ChevronLeft, Utensils, Coffee, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const detailedOrders = [
  {
    id: 5, table: "Stol 8", time: "17:43", amount: "156,00 UZS",
    waiter: "Otabek A.",
    items: [
      { name: "Osh", qty: 2, price: "60,00 UZS", icon: Utensils },
      { name: "Achchiq-chuchuk", qty: 2, price: "30,00 UZS", icon: Utensils },
      { name: "Qora choy", qty: 1, price: "6,00 UZS", icon: Coffee }
    ]
  },
  {
    id: 4, table: "Stol 10", time: "17:25", amount: "269,00 UZS",
    waiter: "Jasur",
    items: [
      { name: "Shashlik (Qiyma)", qty: 4, price: "120,00 UZS", icon: Utensils },
      { name: "Non", qty: 2, price: "10,00 UZS", icon: Utensils },
      { name: "Cola 1.5L", qty: 1, price: "19,00 UZS", icon: Coffee }
    ]
  },
  {
    id: 3, table: "Stol 6", time: "17:14", amount: "177,00 UZS",
    waiter: "Otabek A.",
    items: [
      { name: "Lag'mon", qty: 2, price: "80,00 UZS", icon: Utensils },
      { name: "Salat (Bahor)", qty: 1, price: "17,00 UZS", icon: Utensils }
    ]
  },
  {
    id: 2, table: "Fotih D. (Dastavka)", time: "16:52", amount: "645,00 UZS",
    waiter: "Dastavshik",
    items: [
      { name: "Set 'Katta Oila'", qty: 1, price: "500,00 UZS", icon: Utensils },
      { name: "Fanta 1.5L", qty: 2, price: "38,00 UZS", icon: Coffee },
      { name: "Somsalar", qty: 5, price: "50,00 UZS", icon: Utensils },
      { name: "Yetkazib berish", qty: 1, price: "57,00 UZS", icon: Utensils }
    ]
  },
  {
    id: 1, table: "Stol 2", time: "16:26", amount: "115,00 UZS",
    waiter: "Sardor",
    items: [
      { name: "Qozon kabob", qty: 1, price: "95,00 UZS", icon: Utensils },
      { name: "Ko'k choy", qty: 1, price: "5,00 UZS", icon: Coffee },
      { name: "Limon", qty: 1, price: "15,00 UZS", icon: Utensils }
    ]
  }
];

export default function OrdersPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#120e1f" />
      
      {/* Header */}
      <LinearGradient 
        colors={['#d80056', '#7d1f5e', '#1e1333']}
        start={[0, 0]} end={[1, 0]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={28} color="#fff" />
          <Text style={styles.headerTitle}>Barcha Buyurtmalar (Eslatmalar)</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageSubtitle}>Bugungi faol buyurtmalar ro'yxati va ularning tarkibi:</Text>
        
        <View style={styles.ordersGrid}>
          {detailedOrders.map((order) => (
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
                <Text style={styles.waiterText}>Xizmat ko'rsatuvchi: <Text style={styles.waiterName}>{order.waiter}</Text></Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.itemsList}>
                {order.items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <View style={styles.itemNameWrapper}>
                      <item.icon size={12} color="#6c757d" style={{marginRight: 6}} />
                      <Text style={styles.itemNameText}>{item.qty}x {item.name}</Text>
                    </View>
                    <Text style={styles.itemPriceText}>{item.price}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                <Text style={styles.totalLabel}>Jami summa:</Text>
                <Text style={styles.totalAmount}>{order.amount}</Text>
              </View>
            </View>
          ))}
        </View>
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
  totalAmount: { fontSize: 18, color: '#d80056', fontWeight: '800' }
});
