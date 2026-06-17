import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Users, DollarSign, ShoppingBag } from 'lucide-react-native';

// Mock Data for History
const historyData = {
  totalRevenue: "4 520 000 UZS",
  totalCustomers: 142,
  totalItemsSold: 356,
  items: [
    { id: 1, name: "Osh (Palov)", quantity: 45, price: "1 350 000 UZS" },
    { id: 2, name: "Qozon kabob", quantity: 30, price: "1 200 000 UZS" },
    { id: 3, name: "Shashlik (Qiyma)", quantity: 120, price: "960 000 UZS" },
    { id: 4, name: "Achchiq-chuchuk", quantity: 60, price: "300 000 UZS" },
    { id: 5, name: "Coca-Cola 1L", quantity: 40, price: "320 000 UZS" },
    { id: 6, name: "Choy (Qora)", quantity: 50, price: "100 000 UZS" },
    { id: 7, name: "Non", quantity: 80, price: "240 000 UZS" },
    { id: 8, name: "Manti", quantity: 20, price: "50 000 UZS" },
  ]
};

export default function HistoryPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#333" />
          <Text style={styles.backText}>Orqaga</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sotuvlar Tarixi</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#e3f2fd' }]}>
              <DollarSign size={24} color="#1976d2" />
            </View>
            <Text style={styles.statLabel}>Umumiy Daromad</Text>
            <Text style={styles.statValue}>{historyData.totalRevenue}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#e8f5e9' }]}>
              <Users size={24} color="#388e3c" />
            </View>
            <Text style={styles.statLabel}>Mijozlar Soni</Text>
            <Text style={styles.statValue}>{historyData.totalCustomers} ta</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#fff3e0' }]}>
              <ShoppingBag size={24} color="#f57c00" />
            </View>
            <Text style={styles.statLabel}>Sotilgan Mahsulotlar</Text>
            <Text style={styles.statValue}>{historyData.totalItemsSold} ta</Text>
          </View>
        </View>

        {/* Sold Items List */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Sotilgan Mahsulotlar Ro'yxati</Text>
          
          <View style={styles.listHeader}>
            <Text style={[styles.columnHeader, { flex: 2 }]}>Nomi</Text>
            <Text style={[styles.columnHeader, { flex: 1, textAlign: 'center' }]}>Soni</Text>
            <Text style={[styles.columnHeader, { flex: 1.5, textAlign: 'right' }]}>Summa</Text>
          </View>

          {historyData.items.map((item, index) => (
            <View key={item.id} style={[styles.listItem, index % 2 === 0 ? styles.listItemEven : styles.listItemOdd]}>
              <Text style={[styles.itemText, { flex: 2, fontWeight: '500' }]}>{item.name}</Text>
              <Text style={[styles.itemText, { flex: 1, textAlign: 'center', color: '#555' }]}>{item.quantity} ta</Text>
              <Text style={[styles.itemText, { flex: 1.5, textAlign: 'right', fontWeight: 'bold', color: '#2e7d32' }]}>{item.price}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  backText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#120e1f',
    marginBottom: 16,
  },
  listHeader: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#e9ecef',
    marginBottom: 8,
  },
  columnHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
  },
  listItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
    alignItems: 'center',
  },
  listItemEven: {
    backgroundColor: '#fff',
  },
  listItemOdd: {
    backgroundColor: '#f8f9fa',
  },
  itemText: {
    fontSize: 14,
    color: '#212529',
  },
});
