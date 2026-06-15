import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  useWindowDimensions,
  Platform,
  StatusBar
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
  { id: 5, table: "Zal 8", time: "17:43", amount: "156,00 UZS" },
  { id: 4, table: "Zal 10", time: "17:25", amount: "269,00 UZS" },
  { id: 3, table: "Zal 6", time: "17:14", amount: "177,00 UZS" },
  { id: 2, table: "Fotih D.", time: "16:52", amount: "645,00 UZS" },
  { id: 1, table: "Zal 2", time: "16:26", amount: "115,00 UZS" },
];

const tables = [
  { id: 1, name: "Zal 1", status: "empty" },
  { id: 2, name: "Zal 2", status: "empty" },
  { id: 3, name: "Zal 3", status: "empty" },
  { id: 4, name: "Zal 4", status: "empty" },
  { id: 6, name: "Zal 6", status: "empty" },
  { 
    id: 7, name: "Zal 7", status: "occupied", 
    amount: "80.00 UZS", user: "Otabek", time: "19:00", people: 4 
  },
  { 
    id: 8, name: "Zal 8", status: "occupied", 
    amount: "40.00 UZS", user: "Otabek", time: "19:03" 
  },
  { 
    id: 9, name: "Zal 9", status: "special", 
    amount: "95.00 UZS", user: "Otabek", time: "18:41", people: 2, hasCloud: true 
  },
  { 
    id: 10, name: "Zal 10", status: "occupied", 
    amount: "80.00 UZS", user: "Otabek", time: "19:03" 
  },
  { id: 11, name: "Zal 11", status: "empty" },
  { id: 12, name: "Zal 12", status: "empty" },
  { id: 14, name: "Zal 14", status: "empty" },
  { 
    id: 141, name: "Zal 14", status: "reserved", 
    subStatus: "Band qilingan", hasClock: true 
  },
  { 
    id: 15, name: "Zal 15", status: "occupied", 
    amount: "90.00 UZS", user: "Otabek", time: "19:03", isLocked: true 
  },
  { id: 16, name: "Zal 16", status: "empty" },
  { id: 17, name: "Zal 17", status: "empty" },
];

export default function AdminPage() {
  const [activeCategory, setActiveCategory] = useState("ZAL");
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
      <ScrollView horizontal bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
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
              <TouchableOpacity key={o.id} style={styles.orderItem}>
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
            <Text style={styles.tablesHeaderBread}>Qavatlar &gt; <Text style={styles.tablesHeaderActive}>Zal</Text></Text>
          </View>
          <ScrollView contentContainerStyle={styles.tablesGrid}>
            {tables.map((t, idx) => {
              const bgColors = t.status === 'occupied' ? ['#ff4081', '#c2185b'] 
                         : t.status === 'reserved' ? ['#e6b12a', '#d4a324']
                         : t.status === 'special' ? ['#5c6bc0', '#3f51b5']
                         : ['#ffffff', '#ffffff'];
              
              const textColor = t.status === 'empty' ? '#666' : '#fff';

              return (
                <TouchableOpacity key={idx} style={[styles.tableCardContainer, { width: Math.max(120, cardWidth) }]}>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120e1f',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 5,
  },
  logoTextLight: {
    fontWeight: '300',
    fontStyle: 'italic',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 10,
  },
  masalarText: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 1,
    fontSize: 12,
  },
  bellBtn: {
    backgroundColor: '#e91e63',
    padding: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeText: {
    color: '#e91e63',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 6,
    borderRadius: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusLabel: {
    color: '#ccc',
    fontSize: 10,
  },
  statusValue: {
    color: '#a5d6a7',
    fontWeight: 'bold',
    fontSize: 12,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 10,
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  userAction: {
    color: '#ccc',
    fontSize: 10,
    textAlign: 'right'
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  toolbar: {
    width: 60,
    backgroundColor: '#1e1333',
    alignItems: 'center',
    paddingTop: 15,
  },
  toolbarBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    marginBottom: 8,
    borderRadius: 10,
  },
  toolbarBtnText: {
    color: '#fff',
    fontSize: 8,
    marginTop: 2,
    textAlign: 'center',
  },
  ordersPanel: {
    width: 220,
    backgroundColor: '#f5f5f7',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  ordersHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  ordersHeaderText: {
    color: '#e91e63',
    fontWeight: '600',
    fontSize: 12,
  },
  ordersList: {
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e91e63',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  orderBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  orderDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTable: {
    color: '#333',
    fontWeight: '500',
    fontSize: 11,
    width: 45,
  },
  orderTime: {
    color: '#888',
    fontSize: 10,
  },
  orderAmount: {
    color: '#333',
    fontWeight: '700',
    fontSize: 11,
    textAlign: 'right',
    flex: 1,
  },
  ordersFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ordersFooterLabel: {
    color: '#333',
    fontWeight: '700',
    fontSize: 13,
  },
  ordersFooterPrice: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tablesPanel: {
    flex: 1,
    backgroundColor: '#e9ecef',
  },
  tablesHeader: {
    padding: 10,
  },
  tablesHeaderBread: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  tablesHeaderActive: {
    color: '#333',
    fontWeight: '600',
  },
  tablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  tableCardContainer: {
    padding: 5,
  },
  tableCard: {
    height: 100,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tableName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  tableStatus: {
    fontSize: 11,
  },
  tableAmount: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
  },
  tableFooterInfo: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableFooterText: {
    fontSize: 9,
    opacity: 0.8,
  },
  tableIconTop: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  tablePeopleText: {
    fontSize: 9,
  },
  catsPanel: {
    width: 80,
    backgroundColor: '#1e1333',
    paddingTop: 20,
  },
  catsHeader: {
    color: '#aaa',
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  catBtn: {
    paddingVertical: 10,
    paddingHorizontal: 2,
    marginHorizontal: 5,
    marginVertical: 4,
    borderRadius: 15,
    alignItems: 'center',
  },
  catBtnActive: {
    backgroundColor: '#f5f5f7',
  },
  catBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  catBtnTextActive: {
    color: '#333',
  }
});
