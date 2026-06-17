import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import { ChevronLeft, Utensils, Coffee, Clock, Package, MapPin, Phone, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const deliveryOrders = [
  {
    id: 2, 
    customer: "Fotih D.", 
    phone: "+998 90 123 45 67",
    address: "Chilonzor 8-kv, 15-uy, 42-xonadon",
    time: "16:52", 
    amount: "645,00 UZS",
    status: "Yo'lda",
    courier: "Akmal K.",
    items: [
      { name: "Set 'Katta Oila'", qty: 1, price: "500,00 UZS", icon: Utensils },
      { name: "Fanta 1.5L", qty: 2, price: "38,00 UZS", icon: Coffee },
      { name: "Somsalar", qty: 5, price: "50,00 UZS", icon: Utensils },
      { name: "Yetkazib berish", qty: 1, price: "57,00 UZS", icon: Package }
    ]
  },
  {
    id: 6, 
    customer: "Aziz M.", 
    phone: "+998 93 987 65 43",
    address: "Yunusobod 12-kv, 5-uy",
    time: "17:30", 
    amount: "120,00 UZS",
    status: "Tayyorlanmoqda",
    courier: "Biriktirilmagan",
    items: [
      { name: "Osh", qty: 2, price: "60,00 UZS", icon: Utensils },
      { name: "Choy", qty: 2, price: "10,00 UZS", icon: Coffee },
      { name: "Somsalar", qty: 5, price: "50,00 UZS", icon: Utensils }
    ]
  }
];

export default function DeliveryPage() {
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
          <Text style={styles.headerTitle}>Dastavka Buyurtmalari</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageSubtitle}>Yetkazib beriladigan barcha buyurtmalar ro'yxati:</Text>
        
        <View style={styles.ordersGrid}>
          {deliveryOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <View style={styles.headerRow}>
                  <View style={styles.orderBadge}>
                    <Text style={styles.orderBadgeText}>{order.id}</Text>
                  </View>
                  <Text style={styles.tableName}>{order.customer}</Text>
                </View>
                <View style={[styles.statusBadge, order.status === "Yo'lda" ? styles.statusOnWay : styles.statusPreparing]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>

              <View style={styles.customerInfo}>
                <View style={styles.infoRow}>
                  <Phone size={14} color="#6c757d" />
                  <Text style={styles.infoText}>{order.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MapPin size={14} color="#6c757d" />
                  <Text style={styles.infoText}>{order.address}</Text>
                </View>
                <View style={styles.infoRow}>
                  <User size={14} color="#6c757d" />
                  <Text style={styles.infoText}>Kuryer: <Text style={{fontWeight: '600'}}>{order.courier}</Text></Text>
                </View>
                <View style={styles.infoRow}>
                  <Clock size={14} color="#6c757d" />
                  <Text style={styles.infoText}>Vaqt: {order.time}</Text>
                </View>
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
    minWidth: 320,
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  orderBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#e91e63', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  orderBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  tableName: { fontSize: 16, fontWeight: '700', color: '#212529' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusOnWay: { backgroundColor: '#e3f2fd' },
  statusPreparing: { backgroundColor: '#fff3cd' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#495057' },
  customerInfo: { gap: 6, marginBottom: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, color: '#495057' },
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
