import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Users, DollarSign, ShoppingBag, Calendar, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Seed data for history if empty
const MOCK_SEED_HISTORY = [
  // Today's orders (June 22, 2026)
  {
    id: 1201,
    table: "Stol 4",
    time: "10:30",
    date: "2026-06-22",
    amount: "115 000 UZS",
    items: [
      { name: "Osh (Palov)", qty: 2, price: 45000 },
      { name: "Non", qty: 2, price: 3000 },
      { name: "Coca-Cola 1.5L", qty: 1, price: 12000 },
      { name: "Ko'k choy", qty: 2, price: 5000 }
    ]
  },
  {
    id: 1202,
    table: "Stol 7",
    time: "12:15",
    date: "2026-06-22",
    amount: "280 000 UZS",
    items: [
      { name: "Qozon kabob", qty: 2, price: 95000 },
      { name: "Manti (5 dona)", qty: 2, price: 35000 },
      { name: "Limonli choy", qty: 2, price: 8000 },
      { name: "Non", qty: 1, price: 3000 }
    ]
  },
  {
    id: 1203,
    table: "Stol 12",
    time: "13:40",
    date: "2026-06-22",
    amount: "90 000 UZS",
    items: [
      { name: "Lag'mon", qty: 2, price: 32000 },
      { name: "Somsa (Qiyma)", qty: 2, price: 10000 },
      { name: "Ko'k choy", qty: 2, price: 5000 }
    ]
  },
  {
    id: 1204,
    table: "Stol 3",
    time: "14:20",
    date: "2026-06-22",
    amount: "63 000 UZS",
    items: [
      { name: "Somsa (Qiyma)", qty: 5, price: 10000 },
      { name: "Ko'k choy", qty: 2, price: 5000 },
      { name: "Non", qty: 1, price: 3000 }
    ]
  },
  {
    id: 1205,
    table: "Stol 8",
    time: "18:10",
    date: "2026-06-22",
    amount: "155 000 UZS",
    items: [
      { name: "Osh (Palov)", qty: 3, price: 45000 },
      { name: "Non", qty: 2, price: 3000 },
      { name: "Coca-Cola 1.5L", qty: 1, price: 12000 },
      { name: "Ko'k choy", qty: 1, price: 5000 }
    ]
  },

  // Yesterday's orders (June 21, 2026)
  {
    id: 1101,
    table: "Stol 6",
    time: "11:45",
    date: "2026-06-21",
    amount: "215 000 UZS",
    items: [
      { name: "Osh (Palov)", qty: 4, price: 45000 },
      { name: "Somsa (Qiyma)", qty: 2, price: 10000 },
      { name: "Limonli choy", qty: 1, price: 8000 },
      { name: "Non", qty: 2, price: 3000 }
    ]
  },
  {
    id: 1102,
    table: "Stol 10",
    time: "13:20",
    date: "2026-06-21",
    amount: "156 000 UZS",
    items: [
      { name: "Lag'mon", qty: 3, price: 32000 },
      { name: "Manti (5 dona)", qty: 1, price: 35000 },
      { name: "Coca-Cola 1.5L", qty: 2, price: 12000 }
    ]
  },
  {
    id: 1103,
    table: "Stol 2",
    time: "17:15",
    date: "2026-06-21",
    amount: "440 000 UZS",
    items: [
      { name: "Qozon kabob", qty: 4, price: 95000 },
      { name: "Medovik torti", qty: 2, price: 20000 },
      { name: "Limonli choy", qty: 2, price: 8000 },
      { name: "Non", qty: 2, price: 3000 }
    ]
  },
  {
    id: 1104,
    table: "Stol 9",
    time: "19:30",
    date: "2026-06-21",
    amount: "192 000 UZS",
    items: [
      { name: "Shashlik (Mol go'shti)", qty: 6, price: 22000 },
      { name: "Manti (5 dona)", qty: 1, price: 35000 },
      { name: "Non", qty: 3, price: 3000 },
      { name: "Ko'k choy", qty: 3, price: 5000 },
      { name: "Limonli choy", qty: 1, price: 8000 }
    ]
  },

  // Two days ago (June 20, 2026)
  {
    id: 1001,
    table: "Stol 1",
    time: "12:00",
    date: "2026-06-20",
    amount: "95 000 UZS",
    items: [
      { name: "Osh (Palov)", qty: 2, price: 45000 },
      { name: "Ko'k choy", qty: 1, price: 5000 }
    ]
  },
  {
    id: 1002,
    table: "Stol 14",
    time: "14:15",
    date: "2026-06-20",
    amount: "305 000 UZS",
    items: [
      { name: "Qozon kabob", qty: 2, price: 95000 },
      { name: "Shashlik (Mol go'shti)", qty: 4, price: 22000 },
      { name: "Napoleon torti", qty: 1, price: 25000 },
      { name: "Coca-Cola 1.5L", qty: 1, price: 12000 }
    ]
  },
  {
    id: 1003,
    table: "Stol 8",
    time: "19:00",
    date: "2026-06-20",
    amount: "185 000 UZS",
    items: [
      { name: "Manti (5 dona)", qty: 4, price: 35000 },
      { name: "Non", qty: 3, price: 3000 },
      { name: "Limonli choy", qty: 4, price: 8000 }
    ]
  }
];

export default function HistoryPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [historyOrders, setHistoryOrders] = useState<any[]>([]);
  const [currency, setCurrency] = useState<string>("UZS");
  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'items' | 'orders'>('items');

  // Manual inputs for date picker
  const [inputDay, setInputDay] = useState<string>("");
  const [inputMonth, setInputMonth] = useState<string>("");
  const [inputYear, setInputYear] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [accountId, setAccountId] = useState<string>("");

  // Get initial date
  useEffect(() => {
    const getTodayDateString = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    setSelectedDate(getTodayDateString());
  }, []);

  // Fetch or Seed Sales History
  const loadHistoryData = async () => {
    try {
      const savedAccId = await AsyncStorage.getItem('currentAccountId');
      if (!savedAccId) {
        router.replace('/login');
        return;
      }
      setAccountId(savedAccId);

      // 1. Get saved currency
      const savedCurrency = await AsyncStorage.getItem(`savedCurrency_${savedAccId}`);
      if (savedCurrency) {
        setCurrency(savedCurrency);
      }

      // 2. Get history orders
      const storedHistory = await AsyncStorage.getItem(`savedOrderHistory_${savedAccId}`);
      if (storedHistory) {
        setHistoryOrders(JSON.parse(storedHistory));
      } else {
        // Seed initial mock history data as empty for new accounts
        await AsyncStorage.setItem(`savedOrderHistory_${savedAccId}`, JSON.stringify([]));
        setHistoryOrders([]);
      }
    } catch (err) {
      console.error("Error loading sales history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistoryData();
    const interval = setInterval(loadHistoryData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Format date display for Uzbek language
  const formatDateUzbek = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const uzbekMonths = [
      "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
      "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
    ];

    // Compare with local today / yesterday
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (dateStr === todayStr) {
      return `Bugun, ${day}-${uzbekMonths[monthIndex]}`;
    }
    if (dateStr === yesterdayStr) {
      return `Kecha, ${day}-${uzbekMonths[monthIndex]}`;
    }

    return `${day}-${uzbekMonths[monthIndex]}, ${year}-yil`;
  };

  // Date Navigation logic
  const changeDateByDays = (days: number) => {
    if (!selectedDate) return;
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + days);
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };

  const handlePrevDay = () => changeDateByDays(-1);
  const handleNextDay = () => changeDateByDays(1);

  // Compute analytics dynamically based on selected date
  const filteredOrders = React.useMemo(() => {
    return historyOrders.filter(o => o.date === selectedDate);
  }, [historyOrders, selectedDate]);

  const analytics = React.useMemo(() => {
    let totalRevenue = 0;
    let totalCustomers = filteredOrders.length;
    let totalItemsSold = 0;
    const itemMap: Record<string, { quantity: number; priceSum: number }> = {};

    filteredOrders.forEach(order => {
      let orderSum = 0;
      if (order.items && order.items.length > 0) {
        order.items.forEach((item: any) => {
          const qty = item.qty || 0;
          const price = item.price || 0;
          const sum = price * qty;
          orderSum += sum;
          totalItemsSold += qty;

          if (!itemMap[item.name]) {
            itemMap[item.name] = { quantity: 0, priceSum: 0 };
          }
          itemMap[item.name].quantity += qty;
          itemMap[item.name].priceSum += sum;
        });
      } else {
        // Fallback to static text price if items aren't present
        const digits = order.amount.replace(/[^0-9]/g, '');
        const numericAmount = parseInt(digits, 10) || 0;
        orderSum = numericAmount;
      }
      totalRevenue += orderSum;
    });

    const sortedItems = Object.entries(itemMap).map(([name, data]) => ({
      name,
      quantity: data.quantity,
      priceSum: data.priceSum
    })).sort((a, b) => b.quantity - a.quantity);

    return {
      totalRevenue,
      totalCustomers,
      totalItemsSold,
      items: sortedItems
    };
  }, [filteredOrders]);

  const formatPrice = (val: number) => {
    return val.toLocaleString('uz-UZ') + " " + currency;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
        }}>
          <ChevronLeft size={24} color="#333" />
          <Text style={styles.backText}>Orqaga</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sotuvlar Tarixi</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Date Navigation Bar */}
      <View style={styles.dateBar}>
        <TouchableOpacity style={styles.dateNavBtn} onPress={handlePrevDay}>
          <ChevronLeft size={16} color="#e91e63" />
          <Text style={styles.dateNavText}>Oldingi kun</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateDisplayBtn} onPress={() => {
          if (selectedDate) {
            const [y, m, d] = selectedDate.split('-');
            setInputYear(y || "2026");
            setInputMonth(m || "06");
            setInputDay(d || "22");
          }
          setDatePickerVisible(true);
        }}>
          <Calendar size={16} color="#e91e63" style={{ marginRight: 6 }} />
          <Text style={styles.selectedDateText}>{formatDateUzbek(selectedDate)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateNavBtn} onPress={handleNextDay}>
          <Text style={styles.dateNavText}>Keyingi kun</Text>
          <ChevronRight size={16} color="#e91e63" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#e3f2fd' }]}>
              <DollarSign size={24} color="#1976d2" />
            </View>
            <Text style={styles.statLabel}>Umumiy Daromad</Text>
            <Text style={styles.statValue}>{formatPrice(analytics.totalRevenue)}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#e8f5e9' }]}>
              <Users size={24} color="#388e3c" />
            </View>
            <Text style={styles.statLabel}>Mijozlar Soni</Text>
            <Text style={styles.statValue}>{analytics.totalCustomers} ta</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: '#fff3e0' }]}>
              <ShoppingBag size={24} color="#f57c00" />
            </View>
            <Text style={styles.statLabel}>Sotilgan Mahsulotlar</Text>
            <Text style={styles.statValue}>{analytics.totalItemsSold} ta</Text>
          </View>
        </View>

        {/* Sold Items or Orders List Container */}
        {filteredOrders.length > 0 ? (
          <View style={styles.listContainer}>
            {/* Tab Selector */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tabBtn, activeTab === 'items' && styles.tabBtnActive]} 
                onPress={() => setActiveTab('items')}
              >
                <Text style={[styles.tabBtnText, activeTab === 'items' && styles.tabBtnTextActive]}>
                  Mahsulotlar kesimida
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tabBtn, activeTab === 'orders' && styles.tabBtnActive]} 
                onPress={() => setActiveTab('orders')}
              >
                <Text style={[styles.tabBtnText, activeTab === 'orders' && styles.tabBtnTextActive]}>
                  Buyurtmalar kesimida
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'items' ? (
              <>
                <Text style={[styles.listTitle, { marginBottom: 12 }]}>Sotilgan Mahsulotlar Ro'yxati</Text>
                
                <View style={styles.listHeader}>
                  <Text style={[styles.columnHeader, { flex: 2 }]}>Nomi</Text>
                  <Text style={[styles.columnHeader, { flex: 1, textAlign: 'center' }]}>Soni</Text>
                  <Text style={[styles.columnHeader, { flex: 1.5, textAlign: 'right' }]}>Summa</Text>
                </View>

                {analytics.items.map((item, index) => (
                  <View key={index} style={[styles.listItem, index % 2 === 0 ? styles.listItemEven : styles.listItemOdd]}>
                    <Text style={[styles.itemText, { flex: 2, fontWeight: '500' }]}>{item.name}</Text>
                    <Text style={[styles.itemText, { flex: 1, textAlign: 'center', color: '#555' }]}>{item.quantity} ta</Text>
                    <Text style={[styles.itemText, { flex: 1.5, textAlign: 'right', fontWeight: 'bold', color: '#2e7d32' }]}>{formatPrice(item.priceSum)}</Text>
                  </View>
                ))}
              </>
            ) : (
              <>
                <Text style={[styles.listTitle, { marginBottom: 12 }]}>Barcha Cheklar va Buyurtmalar</Text>
                
                <View style={styles.listHeader}>
                  <Text style={[styles.columnHeader, { flex: 1.5 }]}>Stol (ID)</Text>
                  <Text style={[styles.columnHeader, { flex: 2.5 }]}>Tarkibi</Text>
                  <Text style={[styles.columnHeader, { flex: 1.5, textAlign: 'right' }]}>Jami</Text>
                </View>

                {filteredOrders.map((order, index) => (
                  <View key={order.id || index} style={[styles.listItem, index % 2 === 0 ? styles.listItemEven : styles.listItemOdd, { alignItems: 'flex-start', paddingVertical: 14 }]}>
                    <View style={{ flex: 1.5 }}>
                      <Text style={{ fontWeight: 'bold', color: '#1e1333', fontSize: 13 }}>#{order.id}</Text>
                      <Text style={{ color: '#e91e63', fontWeight: '700', fontSize: 11, marginTop: 2 }}>{order.table}</Text>
                      <Text style={{ color: '#868e96', fontSize: 10, marginTop: 4 }}>⏱️ {order.time}</Text>
                    </View>
                    <View style={{ flex: 2.5, paddingRight: 8 }}>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((it: any, idx: number) => (
                          <Text key={idx} style={{ fontSize: 12, color: '#495057', marginBottom: 3 }}>
                            • {it.qty}x {it.name}
                          </Text>
                        ))
                      ) : (
                        <Text style={{ fontSize: 12, color: '#868e96', fontStyle: 'italic' }}>Taomlar kiritilmagan</Text>
                      )}
                    </View>
                    <Text style={[styles.itemText, { flex: 1.5, textAlign: 'right', fontWeight: '800', color: '#2e7d32' }]}>
                      {order.amount}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Calendar size={48} color="#9ca3af" />
            <Text style={styles.noDataText}>Ushbu kunda sotuvlar amalga oshirilmagan.</Text>
          </View>
        )}
      </ScrollView>

      {/* Custom Date Picker Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={datePickerVisible}
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#120e1f' }}>📅 Kunni Tanlash</Text>
              <TouchableOpacity onPress={() => setDatePickerVisible(false)}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Quick selectors */}
            <Text style={styles.modalSubTitle}>Tezkor tanlov:</Text>
            <View style={styles.quickSelectGrid}>
              {[
                { label: "Bugun", daysOffset: 0 },
                { label: "Kecha", daysOffset: -1 },
                { label: "2 kun oldin", daysOffset: -2 },
                { label: "3 kun oldin", daysOffset: -3 },
                { label: "4 kun oldin", daysOffset: -4 },
                { label: "5 kun oldin", daysOffset: -5 },
                { label: "6 kun oldin", daysOffset: -6 },
                { label: "1 hafta oldin", daysOffset: -7 }
              ].map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.quickSelectBtn}
                  onPress={() => {
                    const dateObj = new Date();
                    dateObj.setDate(dateObj.getDate() + opt.daysOffset);
                    const year = dateObj.getFullYear();
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    setSelectedDate(`${year}-${month}-${day}`);
                    setDatePickerVisible(false);
                  }}
                >
                  <Text style={styles.quickSelectText}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 1, backgroundColor: '#e5e7eb', marginVertical: 16, width: '100%' }} />

            {/* Manual input */}
            <Text style={styles.modalSubTitle}>Sanani kiriting (Yil-Oy-Kun):</Text>
            <View style={styles.manualInputRow}>
              <TextInput
                style={[styles.dateInput, { flex: 2 }]}
                placeholder="Yil"
                value={inputYear}
                onChangeText={setInputYear}
                keyboardType="numeric"
                maxLength={4}
              />
              <TextInput
                style={[styles.dateInput, { flex: 1.2 }]}
                placeholder="Oy"
                value={inputMonth}
                onChangeText={setInputMonth}
                keyboardType="numeric"
                maxLength={2}
              />
              <TextInput
                style={[styles.dateInput, { flex: 1.2 }]}
                placeholder="Kun"
                value={inputDay}
                onChangeText={setInputDay}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>

            <TouchableOpacity
              style={styles.setDateBtn}
              onPress={() => {
                const y = inputYear.trim();
                const m = inputMonth.trim().padStart(2, '0');
                const d = inputDay.trim().padStart(2, '0');
                
                if (!y || !m || !d || isNaN(Number(y)) || isNaN(Number(m)) || isNaN(Number(d)) || Number(m) < 1 || Number(m) > 12 || Number(d) < 1 || Number(d) > 31) {
                  Alert.alert("Xatolik", "Iltimos, sanani to'g'ri kiriting.");
                  return;
                }
                
                setSelectedDate(`${y}-${m}-${d}`);
                setDatePickerVisible(false);
              }}
            >
              <Text style={styles.setDateBtnText}>Sanani tasdiqlash</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  dateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  dateNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  dateNavText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e91e63',
  },
  dateDisplayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff0f3',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffccd5',
  },
  selectedDateText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#e91e63',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modalSubTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4b5563',
    marginBottom: 10,
    marginTop: 5,
  },
  quickSelectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  quickSelectBtn: {
    width: '48%',
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickSelectText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  manualInputRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: '#212529',
    backgroundColor: '#f9fafb',
    textAlign: 'center',
  },
  setDateBtn: {
    backgroundColor: '#e91e63',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  setDateBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noDataContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  noDataText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6c757d',
    marginTop: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f3f5',
    borderRadius: 10,
    padding: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
  },
  tabBtnTextActive: {
    color: '#e91e63',
  },
});
