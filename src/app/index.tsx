import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  useWindowDimensions,
  Platform,
  StatusBar,
  Modal
} from 'react-native';
import { 
  Barcode, 
  Edit, 
  X, 
  Package, 
  FileText, 
  MoveRight, 
  ChevronLeft, 
  Bell, 
  Wifi, 
  Server, 
  User,
  MoreHorizontal,
  Clock
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Mock Data (Translated to Uzbek)
const orders = [
  { 
    id: 5, table: "Stol 8", time: "17:43", amount: "156,00 UZS",
    items: [
      { name: "Osh", qty: 2, price: "60.00 UZS" },
      { name: "Choy", qty: 1, price: "5.00 UZS" },
      { name: "Salat (Achchiq-chuchuk)", qty: 2, price: "30.00 UZS" }
    ]
  },
  { 
    id: 4, table: "Stol 10", time: "17:25", amount: "269,00 UZS",
    items: [
      { name: "Shashlik (Qiyma)", qty: 5, price: "100.00 UZS" },
      { name: "Non", qty: 2, price: "10.00 UZS" },
      { name: "Cola 1L", qty: 1, price: "15.00 UZS" }
    ]
  },
  { id: 3, table: "Stol 6", time: "17:14", amount: "177,00 UZS", items: [{ name: "Manti", qty: 4, price: "40.00 UZS" }] },
  { id: 2, table: "Fotih D.", time: "16:52", amount: "645,00 UZS", items: [] },
  { id: 1, table: "Stol 2", time: "16:26", amount: "115,00 UZS", items: [] },
];

const tables = [
  { id: 1, name: "Stol 1", status: "empty" },
  { id: 2, name: "Stol 2", status: "empty" },
  { id: 3, name: "Stol 3", status: "empty" },
  { id: 4, name: "Stol 4", status: "empty" },
  { id: 6, name: "Stol 6", status: "empty" },
  { 
    id: 7, name: "Stol 7", status: "occupied", 
    amount: "80.00 UZS", user: "Otabek", time: "19:00", people: 4,
    items: [
      { name: "Norin", qty: 2, price: "60.00 UZS" },
      { name: "Choy", qty: 1, price: "5.00 UZS" }
    ]
  },
  { 
    id: 8, name: "Stol 8", status: "occupied", 
    amount: "40.00 UZS", user: "Otabek", time: "19:03",
    items: [
      { name: "Lag'mon", qty: 2, price: "40.00 UZS" }
    ]
  },
  { 
    id: 9, name: "Stol 9", status: "special", 
    amount: "95.00 UZS", user: "Otabek", time: "18:41", people: 2, hasCloud: true,
    items: [
      { name: "Somsa", qty: 5, price: "95.00 UZS" }
    ]
  },
  { 
    id: 10, name: "Stol 10", status: "occupied", 
    amount: "80.00 UZS", user: "Otabek", time: "19:03",
    items: []
  },
  { id: 11, name: "Stol 11", status: "empty" },
  { id: 12, name: "Stol 12", status: "empty" },
  { id: 14, name: "Stol 14", status: "empty" },
  { 
    id: 141, name: "Stol 14", status: "reserved", 
    subStatus: "Band qilingan", hasClock: true 
  },
  { 
    id: 15, name: "Stol 15", status: "occupied", 
    amount: "90.00 UZS", user: "Otabek", time: "19:03", isLocked: true 
  },
  { id: 16, name: "Stol 16", status: "empty" },
  { id: 17, name: "Stol 17", status: "empty" },
];

export default function AdminPage() {
  const [activeCategory, setActiveCategory] = useState("ZAL");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { width } = useWindowDimensions();

  // Determine number of columns for grid
  const sidebarWidth = 70;
  const ordersPanelWidth = Platform.OS === 'web' ? 320 : 280;
  const rightPanelWidth = 120;
  
  const mainWidth = width - sidebarWidth - ordersPanelWidth - rightPanelWidth; 
  const colCount = Math.max(2, Math.floor(mainWidth / 140));
  const cardWidth = Math.floor(mainWidth / colCount) - 10; // -10 for margins

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#120e1f" />
      
      {/* Header */}
      <LinearGradient 
        colors={['#d80056', '#7d1f5e', '#1e1333']}
        start={[0, 0]} end={[1, 0]}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.logoContainer}>
            <ChevronLeft size={24} color="#fff" />
            <Text style={styles.logoText}>MENULUX <Text style={styles.logoTextLight}>Pos</Text></Text>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <Text style={styles.masalarText}>STOLLAR</Text>
            <TouchableOpacity style={styles.bellBtn}>
              <Bell size={18} color="#fff" />
              <View style={styles.badge}><Text style={styles.badgeText}>12</Text></View>
            </TouchableOpacity>
          </View>
        </View>
        
        {width > 600 && (
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <MoreHorizontal size={18} color="#fff" />
            </TouchableOpacity>
            <View style={styles.statusItem}>
              <Wifi size={16} color="#a5d6a7" />
              <View>
                <Text style={styles.statusLabel}>Internet</Text>
                <Text style={styles.statusValue}>ULANGAN</Text>
              </View>
            </View>
            <View style={styles.statusItem}>
              <Server size={16} color="#a5d6a7" />
              <View>
                <Text style={styles.statusLabel}>Server</Text>
                <Text style={styles.statusValue}>ULANGAN</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.userProfile}>
              <User size={20} color="#fff" />
              <View>
                <Text style={styles.userName}>Otabek A.</Text>
                <Text style={styles.userAction}>ALMASHTIRISH</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        
        {/* Left Toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Barcode color="#fff" size={20} />
            <Text style={styles.toolbarBtnText}>Shtrix-kod</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Edit color="#fff" size={20} />
            <Text style={styles.toolbarBtnText}>Tahrirlash</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <X color="#fff" size={20} />
            <Text style={styles.toolbarBtnText}>Bekor qilish</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Package color="#fff" size={20} />
            <Text style={styles.toolbarBtnText}>Dastavka</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <FileText color="#fff" size={20} />
            <Text style={styles.toolbarBtnText}>Eslatmalar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <MoveRight color="#fff" size={20} />
            <Text style={styles.toolbarBtnText}>Ko'chirish</Text>
          </TouchableOpacity>
        </View>

        {/* Orders Panel */}
        <View style={styles.ordersPanel}>
          <View style={styles.ordersHeader}>
            <Text style={styles.ordersHeaderText}>5 BUYURTMA</Text>
          </View>
          <ScrollView style={styles.ordersList}>
            {orders.map((o) => (
              <TouchableOpacity key={o.id} style={styles.orderItem} onPress={() => setSelectedOrder(o)}>
                <View style={styles.orderBadge}>
                  <Text style={styles.orderBadgeText}>{o.id}</Text>
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderTable} numberOfLines={1}>{o.table}</Text>
                  <Text style={styles.orderTime}>{o.time}</Text>
                  <Text style={styles.orderAmount} numberOfLines={1}>{o.amount}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.ordersFooter}>
            <Text style={styles.ordersFooterLabel}>JAMI</Text>
            <Text style={styles.ordersFooterPrice}>1.362,00 UZS</Text>
          </View>
        </View>

        {/* Center Tables Grid */}
        <View style={styles.tablesPanel}>
          <View style={styles.tablesHeader}>
            <Text style={styles.tablesHeaderBread}>Qavatlar &gt; <Text style={styles.tablesHeaderActive}>Asosiy Zal</Text></Text>
          </View>
          <ScrollView contentContainerStyle={styles.tablesGrid}>
            {tables.map((t, idx) => {
              const bgColors = t.status === 'occupied' ? ['#ff4081', '#c2185b'] 
                         : t.status === 'reserved' ? ['#e6b12a', '#d4a324']
                         : t.status === 'special' ? ['#5c6bc0', '#3f51b5']
                         : ['#ffffff', '#ffffff'];
              
              const textColor = t.status === 'empty' ? '#666' : '#fff';

              return (
                <View key={idx} style={styles.tableCardContainer}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => t.status !== 'empty' && setSelectedOrder({ id: t.id, table: t.name, amount: t.amount, time: t.time, items: t.items || [] })}>
                    <LinearGradient 
                      colors={bgColors as [string, string]}
                      style={styles.tableCard}
                    >
                    <Text style={[styles.tableName, { color: textColor }]}>{t.name}</Text>
                    
                    {t.status === 'empty' ? (
                      <Text style={[styles.tableStatus, { color: '#aaa' }]}>Bo'sh</Text>
                    ) : t.status === 'reserved' ? (
                      <>
                        <Text style={[styles.tableStatus, { color: textColor }]}>{t.subStatus}</Text>
                        {t.hasClock && <Clock size={24} color={textColor} style={{opacity: 0.8, marginTop: 5}}/>}
                      </>
                    ) : (
                      <>
                        <Text style={[styles.tableAmount, { color: textColor }]}>{t.amount}</Text>
                        <View style={styles.tableFooterInfo}>
                          <Text style={[styles.tableFooterText, { color: textColor }]}>{t.user}</Text>
                          <Text style={[styles.tableFooterText, { color: textColor }]}>{t.time}</Text>
                        </View>
                      </>
                    )}

                    {t.people && (
                      <View style={styles.tableIconTop}>
                        <User size={10} color={textColor} />
                        <Text style={[styles.tablePeopleText, { color: textColor }]}>{t.people}</Text>
                      </View>
                    )}

                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )
            })}
          </ScrollView>
        </View>

        {/* Right Categories */}
        <View style={styles.catsPanel}>
          <Text style={styles.catsHeader}>STOLLAR</Text>
          {['BAND', 'ZAL', 'ZAL 2', 'TERRASA', 'BOG\''].map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.catBtn, activeCategory === cat && styles.catBtnActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catBtnText, activeCategory === cat && styles.catBtnTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Order Details Modal */}
      <Modal
        visible={!!selectedOrder}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedOrder?.id ? `Buyurtma #${selectedOrder.id}` : 'Buyurtma'}
                {selectedOrder?.table ? ` - ${selectedOrder.table}` : ''}
              </Text>
              <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                <X color="#333" size={24} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedOrder?.items?.length > 0 ? (
                selectedOrder.items.map((item: any, idx: number) => (
                  <View key={idx} style={styles.modalItemRow}>
                    <View>
                      <Text style={styles.modalItemName}>{item.name}</Text>
                      <Text style={styles.modalItemQty}>{item.qty} dona</Text>
                    </View>
                    <Text style={styles.modalItemPrice}>{item.price}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
                  Buyurtma tafsilotlari hozircha bo'sh
                </Text>
              )}
            </ScrollView>
            <View style={styles.modalFooter}>
              <Text style={styles.modalTotalLabel}>JAMI:</Text>
              <Text style={styles.modalTotalPrice}>{selectedOrder?.amount}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  logoTextLight: {
    fontWeight: '300',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  masalarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  bellBtn: {
    backgroundColor: '#e91e63',
    padding: 5,
    borderRadius: 15,
    marginLeft: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 3,
    minWidth: 14,
    alignItems: 'center',
  },
  badgeText: {
    color: '#e91e63',
    fontSize: 9,
    fontWeight: '800',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 5,
    borderRadius: 15,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusLabel: {
    color: '#eee',
    fontSize: 8,
  },
  statusValue: {
    color: '#a5d6a7',
    fontWeight: '700',
    fontSize: 10,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  userAction: {
    color: '#ddd',
    fontSize: 8,
    textAlign: 'right'
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  toolbar: {
    width: 55,
    backgroundColor: '#1a112d',
    alignItems: 'center',
    paddingTop: 10,
  },
  toolbarBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    marginBottom: 6,
    borderRadius: 8,
  },
  toolbarBtnText: {
    color: '#fff',
    fontSize: 7,
    marginTop: 2,
    textAlign: 'center',
  },
  ordersPanel: {
    width: 200,
    backgroundColor: '#f1f3f5',
    borderRightWidth: 1,
    borderRightColor: '#dee2e6',
  },
  ordersHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  ordersHeaderText: {
    color: '#e91e63',
    fontWeight: '700',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  ordersList: {
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  orderBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#e91e63',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  orderBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  orderDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTable: {
    color: '#495057',
    fontWeight: '600',
    fontSize: 10,
    width: 40,
  },
  orderTime: {
    color: '#868e96',
    fontSize: 9,
  },
  orderAmount: {
    color: '#212529',
    fontWeight: '700',
    fontSize: 10,
    textAlign: 'right',
  },
  ordersFooter: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  ordersFooterLabel: {
    color: '#212529',
    fontWeight: '700',
    fontSize: 11,
  },
  ordersFooterPrice: {
    color: '#212529',
    fontWeight: '800',
    fontSize: 14,
  },
  tablesPanel: {
    flex: 1,
    backgroundColor: '#e9ecef',
  },
  tablesHeader: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  tablesHeaderBread: {
    color: '#868e96',
    fontSize: 10,
    fontWeight: '500',
  },
  tablesHeaderActive: {
    color: '#212529',
    fontWeight: '700',
  },
  tablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  tableCardContainer: {
    width: '12.5%', // 8 columns for laptop/tablet view
    padding: 4,
    minHeight: 85,
  },
  tableCard: {
    flex: 1,
    borderRadius: 8,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tableName: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  tableStatus: {
    fontSize: 9,
    opacity: 0.7,
  },
  tableAmount: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  tableFooterInfo: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableFooterText: {
    fontSize: 8,
    opacity: 0.9,
  },
  tableIconTop: {
    position: 'absolute',
    top: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 4,
  },
  tablePeopleText: {
    fontSize: 7,
    fontWeight: 'bold',
  },
  catsPanel: {
    width: 90,
    backgroundColor: '#1a112d',
    paddingTop: 15,
  },
  catsHeader: {
    color: '#adb5bd',
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  catBtn: {
    paddingVertical: 8,
    marginHorizontal: 8,
    marginVertical: 3,
    borderRadius: 12,
    alignItems: 'center',
  },
  catBtnActive: {
    backgroundColor: '#fff',
  },
  catBtnText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  catBtnTextActive: {
    color: '#212529',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40'
  },
  modalBody: {
    maxHeight: 400,
    padding: 20
  },
  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
    paddingVertical: 12
  },
  modalItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#495057'
  },
  modalItemQty: {
    fontSize: 13,
    color: '#868e96',
    marginTop: 4
  },
  modalItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e91e63'
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f1f3f5',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef'
  },
  modalTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#495057'
  },
  modalTotalPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#e91e63'
  }
});
