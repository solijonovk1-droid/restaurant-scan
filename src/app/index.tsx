import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Platform,
  StatusBar,
  Modal,
  TextInput
} from 'react-native';
import { 
  Barcode, 
  Edit, 
  XOctagon, 
  Package, 
  FileText, 
  MoveRight, 
  ChevronLeft, 
  Bell, 
  Wifi, 
  Server, 
  User,
  MoreHorizontal,
  Clock,
  Plus
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Mock Data (Translated to Uzbek)
const orders = [
  { id: 5, table: "Zal 8", time: "17:43", amount: "156,00 UZS" },
  { id: 4, table: "Zal 10", time: "17:25", amount: "269,00 UZS" },
  { id: 3, table: "Zal 6", time: "17:14", amount: "177,00 UZS" },
  { id: 2, table: "Fotih D.", time: "16:52", amount: "645,00 UZS" },
  { id: 1, table: "Zal 2", time: "16:26", amount: "115,00 UZS" },
];

const initialTables: Record<string, any[]> = {
  "ZAL": [
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
  ],
  "ZAL 2": [
    { id: 21, name: "Zal-2 1", status: "empty" },
    { id: 22, name: "Zal-2 2", status: "empty" },
    { id: 23, name: "Zal-2 3", status: "occupied", amount: "120.00 UZS", user: "Sardor", time: "18:30" },
    { id: 24, name: "Zal-2 4", status: "empty" },
    { id: 25, name: "Zal-2 5", status: "empty" },
    { id: 26, name: "Zal-2 6", status: "empty" },
  ],
  "TERRASA": [
    { id: 31, name: "Terrasa 1", status: "empty" },
    { id: 32, name: "Terrasa 2", status: "empty" },
    { id: 33, name: "Terrasa 3", status: "occupied", amount: "250.00 UZS", user: "Jasur", time: "19:15" },
  ],
  "BOG'": [
    { id: 41, name: "Bog' 1", status: "empty" },
    { id: 42, name: "Bog' 2", status: "empty" },
  ]
};

export default function AdminPage() {
  const [activeCategory, setActiveCategory] = useState("BARCHA STOLLAR");
  
  const [tablesState, setTablesState] = useState(initialTables);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [newBarcode, setNewBarcode] = useState("");
  const [newColor, setNewColor] = useState("#ffffff");
  const [newCategory, setNewCategory] = useState("ZAL");

  const displayedTables = React.useMemo(() => {
    if (activeCategory === 'BARCHA STOLLAR') {
      return Object.values(tablesState).flat();
    }
    if (activeCategory === 'BAND STOLLAR') {
      return Object.values(tablesState).flat().filter(t => t.status !== 'empty');
    }
    return tablesState[activeCategory] || [];
  }, [activeCategory, tablesState]);

  const handleAddTable = () => {
    if(!newName) return;
    const newTable = {
      id: Date.now(),
      name: newName,
      number: newNum,
      barcode: newBarcode,
      color: newColor,
      status: "empty"
    };
    
    setTablesState(prev => ({
      ...prev,
      [newCategory]: [...(prev[newCategory] || []), newTable]
    }));
    
    setIsModalVisible(false);
    setNewName("");
    setNewNum("");
    setNewBarcode("");
    setNewColor("#ffffff");
    setNewCategory("ZAL");
  };

  // Determine number of columns for grid
  const mainWidth = width - 80 - 320 - 140; // Total width minus sidebars
  const colCount = Math.max(3, Math.floor(mainWidth / 140));
  const cardWidth = `${100 / colCount}%`;

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
            <XOctagon color="#fff" size={20} />
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
                  <Text style={styles.orderTable}>{o.table}</Text>
                  <Text style={styles.orderTime}>{o.time}</Text>
                  <Text style={styles.orderAmount}>{o.amount}</Text>
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
          <View style={[styles.tablesHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={styles.tablesHeaderBread}>Qavatlar &gt; <Text style={styles.tablesHeaderActive}>{activeCategory}</Text></Text>
            <TouchableOpacity 
              style={styles.addTableBtn} 
              onPress={() => {
                if (['ZAL', 'ZAL 2', 'TERRASA', 'BOG\''].includes(activeCategory)) {
                  setNewCategory(activeCategory);
                } else {
                  setNewCategory('ZAL');
                }
                setIsModalVisible(true);
              }}
            >
              <Plus size={16} color="#fff" />
              <Text style={styles.addTableBtnText}>Stol qo'shish</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.tablesGrid}>
            {displayedTables.map((t, idx) => {
              const customColor = t.color && t.color !== '#ffffff' ? t.color : null;
              const bgColors = customColor ? [customColor, customColor] :
                           t.status === 'occupied' ? ['#ff4081', '#c2185b'] 
                         : t.status === 'reserved' ? ['#e6b12a', '#d4a324']
                         : t.status === 'special' ? ['#5c6bc0', '#3f51b5']
                         : ['#ffffff', '#ffffff'];
              
              const isDark = customColor && customColor !== '#ffffff';
              const textColor = t.status === 'empty' && !isDark ? '#666' : '#fff';

              return (
                <TouchableOpacity key={idx} style={[styles.tableCardContainer, { width: cardWidth }]}>
                  <LinearGradient 
                    colors={bgColors as [string, string]}
                    style={styles.tableCard}
                  >
                    <Text style={[styles.tableName, { color: textColor }]}>{t.name}</Text>
                    {t.number ? <Text style={{fontSize: 10, color: textColor, opacity: 0.8}}>№: {t.number}</Text> : null}
                    {t.barcode ? <Text style={{fontSize: 9, color: textColor, opacity: 0.6}}>Kod: {t.barcode}</Text> : null}
                    
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
          {['BARCHA STOLLAR', 'BAND STOLLAR', 'ZAL', 'ZAL 2', 'TERRASA', 'BOG\''].map(cat => (
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

      {/* Modal */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yangi stol qo'shish</Text>

            <Text style={styles.inputLabel}>Bo'limni tanlang</Text>
            <View style={styles.catPickerRow}>
              {['ZAL', 'ZAL 2', 'TERRASA', 'BOG\''].map(cat => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.modalCatBtn, newCategory === cat && styles.modalCatBtnActive]} 
                  onPress={() => setNewCategory(cat)} 
                >
                  <Text style={[styles.modalCatBtnText, newCategory === cat && styles.modalCatBtnTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Stol nomi</Text>
            <TextInput style={styles.input} value={newName} onChangeText={setNewName} placeholder="Masalan: Zal 15" placeholderTextColor="#999" />

            <Text style={styles.inputLabel}>Raqami</Text>
            <TextInput style={styles.input} value={newNum} onChangeText={setNewNum} placeholder="Masalan: 15" keyboardType="numeric" placeholderTextColor="#999" />

            <Text style={styles.inputLabel}>Shtrix kodi</Text>
            <TextInput style={styles.input} value={newBarcode} onChangeText={setNewBarcode} placeholder="Masalan: 123456789" keyboardType="numeric" placeholderTextColor="#999" />

            <Text style={styles.inputLabel}>Rangi</Text>
            <View style={styles.colorPickerRow}>
              {['#ffffff', '#ff4081', '#e6b12a', '#5c6bc0', '#4caf50', '#9c27b0'].map(c => (
                <TouchableOpacity 
                  key={c} 
                  style={[styles.colorCircle, { backgroundColor: c }, newColor === c && styles.colorCircleActive]} 
                  onPress={() => setNewColor(c)} 
                />
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalCancelBtnText}>Bekor qilish</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalAddBtn} onPress={handleAddTable}>
                <Text style={styles.modalAddBtnText}>Qo'shish</Text>
              </TouchableOpacity>
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
    gap: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
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
    gap: 15,
    marginLeft: 15,
  },
  masalarText: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 1,
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
    width: 70,
    backgroundColor: '#1e1333',
    alignItems: 'center',
    paddingTop: 15,
  },
  toolbarBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    marginBottom: 10,
    borderRadius: 12,
  },
  toolbarBtnText: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  ordersPanel: {
    width: Platform.OS === 'web' ? 320 : 280,
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
    fontSize: 14,
  },
  ordersList: {
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e91e63',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  orderBadgeText: {
    color: '#fff',
    fontSize: 12,
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
    fontSize: 13,
    width: 60,
  },
  orderTime: {
    color: '#888',
    fontSize: 12,
  },
  orderAmount: {
    color: '#333',
    fontWeight: '700',
    fontSize: 13,
  },
  ordersFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ordersFooterLabel: {
    color: '#333',
    fontWeight: '700',
    fontSize: 15,
  },
  ordersFooterPrice: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 22,
  },
  tablesPanel: {
    flex: 1,
    backgroundColor: '#e9ecef',
  },
  tablesHeader: {
    padding: 15,
  },
  tablesHeaderBread: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  tablesHeaderActive: {
    color: '#333',
    fontWeight: '600',
  },
  addTableBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e91e63',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addTableBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  tablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  tableCardContainer: {
    padding: 5,
    minWidth: 130, // For smaller screens
  },
  tableCard: {
    height: 120,
    borderRadius: 12,
    padding: 10,
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
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  tableStatus: {
    fontSize: 12,
  },
  tableAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 4,
  },
  tableFooterInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableFooterText: {
    fontSize: 10,
    opacity: 0.8,
  },
  tableIconTop: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  tablePeopleText: {
    fontSize: 10,
  },
  catsPanel: {
    width: 120,
    backgroundColor: '#1e1333',
    paddingTop: 20,
  },
  catsHeader: {
    color: '#aaa',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  catBtn: {
    paddingVertical: 12,
    paddingHorizontal: 5,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
  },
  catBtnActive: {
    backgroundColor: '#f5f5f7',
  },
  catBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  catBtnTextActive: {
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333'
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600'
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    color: '#333',
    fontSize: 14
  },
  catPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15
  },
  modalCatBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee'
  },
  modalCatBtnActive: {
    backgroundColor: '#e91e63',
    borderColor: '#e91e63'
  },
  modalCatBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666'
  },
  modalCatBtnTextActive: {
    color: '#fff'
  },
  colorPickerRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  colorCircleActive: {
    borderWidth: 3,
    borderColor: '#333'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10
  },
  modalCancelBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5'
  },
  modalCancelBtnText: {
    color: '#666',
    fontWeight: 'bold'
  },
  modalAddBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e91e63'
  },
  modalAddBtnText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
