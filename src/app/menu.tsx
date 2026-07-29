import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Image, 
  ActivityIndicator,
  Modal,
  Platform,
  Alert,
  TextInput
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingBag, ChevronLeft, Check, Plus, Minus, Search, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseService } from '../services/supabaseService';

const DEFAULT_MENU_ITEMS = [
  { id: "1", name: "Osh (Palov)", price: 45000, category: "Taomlar", desc: "Qo'y go'shti, zafarli guruch, mayiz va no'xat bilan tayyorlangan milliy palov.", image: "https://images.unsplash.com/photo-1626804475315-7744b475edfd?w=200" },
  { id: "2", name: "Manti (5 dona)", price: 35000, category: "Taomlar", desc: "To'g'ralgan mol go'shti va mayda piyozli xushbo'y manti.", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200" },
  { id: "3", name: "Lag'mon", price: 32000, category: "Taomlar", desc: "Qo'lda cho'zilgan xamir va maxsus go'shtli-sabzavotli qayla.", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: "4", name: "Somsa (Qiyma)", price: 10000, category: "Taomlar", desc: "Tandirda pishirilgan, mayda to'g'ralgan go'shtli issiq somsa.", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=200" },
  { id: "5", name: "Shashlik (Mol go'shti)", price: 22000, category: "Kaboblar", desc: "Yumshoq mol go'shtidan tayyorlangan klassik kabob.", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200" },
  { id: "6", name: "Tovuq shashlik", price: 18000, category: "Kaboblar", desc: "Piyozli marinadda pishirilgan tovuq filesidan mayin shashlik.", image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=200" },
  { id: "7", name: "Napoleon torti", price: 25000, category: "Shirinliklar", desc: "Uvoq qatlamli, mayin sutli-kremli klassik shirinlik.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200" },
  { id: "8", name: "Medovik torti", price: 20000, category: "Shirinliklar", desc: "Tabiiy asal va qaymoqli krem bilan pishirilgan asal torti.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200" },
  { id: "9", name: "Coca-Cola 1.5L", price: 12000, category: "Ichimliklar", desc: "Muzdek va tetiklashtiruvchi klassik gazli ichimlik.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200" },
  { id: "10", name: "Ko'k choy", price: 5000, category: "Ichimliklar", desc: "Choynakda damlangan an'anaviy ko'k choy.", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200" },
  { id: "11", name: "Limonli choy", price: 8000, category: "Ichimliklar", desc: "Limon bo'laklari va asal bilan damlangan xushbo'y ko'k/qora choy.", image: "https://images.unsplash.com/photo-1594631252845-29fc4586d52c?w=200" },
];

const CATEGORIES = ['BARCHA TAOMLAR', 'Taomlar', 'Kaboblar', 'Shirinliklar', 'Ichimliklar'];

export default function CustomerMenuPage() {
  const params = useLocalSearchParams();
  const [accountId, setAccountId] = useState<string>((params.accountId as string) || "");
  const [tableId, setTableId] = useState<string>((params.tableId as string) || "");
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('BARCHA TAOMLAR');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState("UZS");
  const [menuItems, setMenuItems] = useState<any[]>(DEFAULT_MENU_ITEMS);
  const [tablesData, setTablesData] = useState<any>({});

  // Direct sync from URL params
  useEffect(() => {
    if (params.accountId) setAccountId(params.accountId as string);
    if (params.tableId) setTableId(params.tableId as string);
  }, [params.accountId, params.tableId]);

  // Inject Telegram WebApp script and parse start_param if available
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    script.onload = () => {
      console.log("[Telegram WebApp] Script loaded successfully.");
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        
        const startParam = tg.initDataUnsafe?.start_param;
        if (startParam) {
          console.log("[Telegram WebApp] Detected start_param:", startParam);
          // startParam is formatted as accountId___tableId
          let delimiter = '___';
          if (startParam.includes('___')) delimiter = '___';
          else if (startParam.includes('--')) delimiter = '--';
          else if (startParam.includes('-')) delimiter = '-';

          const parts = startParam.split(delimiter);
          if (parts.length >= 2) {
            setAccountId(parts[0]);
            setTableId(parts.slice(1).join(delimiter));
          }
        }
      }
    };
    document.head.appendChild(script);
    return () => {
      try {
        document.head.removeChild(script);
      } catch (err) {
        // Safe check if script was already removed
      }
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!accountId) return;
      try {
        // Load menu items
        const stored = await supabaseService.getMenuItems(accountId);
        if (stored && stored.length > 0) {
          setMenuItems(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(stored)) {
              return stored;
            }
            return prev;
          });
        } else {
          await supabaseService.setMenuItems(accountId, DEFAULT_MENU_ITEMS);
          setMenuItems(DEFAULT_MENU_ITEMS);
        }

        // Load currency
        const storedCurrency = await supabaseService.getCurrency(accountId);
        if (storedCurrency) {
          setCurrency(storedCurrency);
        }
      } catch (error) {
        console.error("Error loading data in customer menu:", error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 1500);
    return () => clearInterval(interval);
  }, [accountId]);

  useEffect(() => {
    const loadTables = async () => {
      if (!accountId) return;
      try {
        const storedTables = await supabaseService.getTables(accountId);
        if (storedTables) {
          setTablesData(storedTables);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadTables();
    const interval = setInterval(loadTables, 2000);
    return () => clearInterval(interval);
  }, [accountId]);

  if (!accountId || !tableId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Noto'g'ri QR-kod</Text>
        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginTop: 10 }}>Iltimos, stol ustidagi QR-kodni qaytadan skanerlang.</Text>
      </SafeAreaView>
    );
  }

  // Stol nomini aniqlaymiz
  const table = Object.values(tablesData).flat().find((t: any) => t.id.toString() === tableId?.toString());
  const tableName = table ? (table as any).name : `Stol-${tableId || '?'}`;

  const handleAddToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'BARCHA TAOMLAR' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItemsCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  const totalAmount = Object.entries(cart).reduce((sum, [itemId, qty]) => {
    const item = menuItems.find(i => i.id === itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handlePlaceOrder = async () => {
    if (cartItemsCount === 0) return;
    setIsOrdering(true);

    try {
      // 1. Yangi buyurtma yaratish
      const newOrderId = Math.floor(1000 + Math.random() * 9000); // 4 xonali unikal buyurtma ID
      const currentTime = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
      const formattedAmount = totalAmount.toLocaleString('uz-UZ') + " " + currency;

      const newOrder = {
        id: newOrderId,
        table: tableName,
        time: currentTime,
        amount: formattedAmount,
        items: Object.entries(cart).map(([itemId, qty]) => {
          const item = menuItems.find(i => i.id === itemId);
          return { name: item?.name || "Noma'lum", qty, price: item?.price || 0 };
        })
      };

      // 2. Supabase/Local'dagi buyurtmalarni yangilash
      const currentOrders = await supabaseService.getOrders(accountId);
      
      // Yangi buyurtmani tepaga joylaymiz
      const updatedOrders = [newOrder, ...currentOrders];
      await supabaseService.setOrders(accountId, updatedOrders);

      // 3. Supabase/Local'dagi stollar holatini yangilash (stol band bo'ladi)
      const storedTables = await supabaseService.getTables(accountId);
      let currentTables = storedTables || { ...tablesData };

      // Barcha qavatlardagi stollardan mosini qidirib topamiz va band qilamiz
      let tableFound = false;
      for (const category in currentTables) {
        const idx = currentTables[category].findIndex((t: any) => t.id.toString() === tableId?.toString());
        if (idx !== -1) {
          currentTables[category][idx] = {
            ...currentTables[category][idx],
            status: 'occupied',
            amount: formattedAmount,
            user: 'Mijoz (QR)',
            time: currentTime
          };
          tableFound = true;
          break;
        }
      }

      // Agar stol topilmasa (masalan unikal ID dinamik bo'lsa), yangi stol yaratib band holatga qo'yamiz
      if (!tableFound) {
        if (!currentTables["ZAL"]) currentTables["ZAL"] = [];
        currentTables["ZAL"].push({
          id: tableId?.toString() || Date.now().toString(),
          name: tableName,
          status: 'occupied',
          amount: formattedAmount,
          user: 'Mijoz (QR)',
          time: currentTime
        });
      }

      await supabaseService.setTables(accountId, currentTables);
      
      // Muvaffaqiyat holatini saqlash
      setLastOrderDetails({
        id: newOrderId,
        table: tableName,
        amount: formattedAmount,
        items: Object.entries(cart).map(([itemId, qty]) => {
          const item = menuItems.find(i => i.id === itemId);
          return { name: item?.name, qty, price: item?.price };
        })
      });

      setCart({});
      setOrderSuccess(true);
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Xatolik", "Buyurtmani yuborishda muammo yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Premium Header */}
      <LinearGradient 
        colors={['#d80056', '#7d1f5e', '#1e1333']}
        start={[0, 0]} end={[1, 0]}
        style={styles.header}
      >
        {/* Chap tomondagi orqaga qaytish tugmasi */}
        <TouchableOpacity style={{ width: 80, paddingLeft: 10, justifyContent: 'center' }} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{tableName}</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: '#10b981' }]} />
            <Text style={styles.badgeText}>Onlayn menyu</Text>
          </View>
        </View>

        {/* O'ng tomondagi savatcha belgisi (chap tomon bilan tenglashtirilgan) */}
        <View style={{ width: 80, alignItems: 'flex-end' }}>
          <View style={styles.cartIconWrapper}>
            <ShoppingBag size={22} color="#fff" />
            {cartItemsCount > 0 && (
              <View style={styles.cartCountBadge}>
                <Text style={styles.cartCountText}>{cartItemsCount}</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Poisk (Qidiruv) Sistemasi */}
      <View style={styles.searchWrapper}>
        <Search size={18} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Taom yoki ichimlik qidirish..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearSearchBtn} onPress={() => setSearchQuery("")}>
            <X size={16} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories Horizontal Scroll */}
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.categoryBtn, activeCategory === cat && styles.categoryBtnActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Menu List */}
      <ScrollView contentContainerStyle={styles.menuScroll}>
        <Text style={styles.menuSectionTitle}>{activeCategory}</Text>
        
        {filteredItems.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Search size={40} color="#d1d5db" style={{ marginBottom: 10 }} />
            <Text style={styles.noResultsText}>Hech narsa topilmadi</Text>
            <Text style={styles.noResultsSub}>Boshqa qidiruv so'zini yozib ko'ring</Text>
          </View>
        ) : (
          filteredItems.map(item => {
            const qty = cart[item.id] || 0;
            
            return (
              <View key={item.id} style={styles.menuCard}>
                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDesc} numberOfLines={2}>{item.desc}</Text>
                  <Text style={styles.itemPrice}>{item.price.toLocaleString('uz-UZ')} {currency}</Text>
                </View>
                
                <View style={styles.actionContainer}>
                  {qty > 0 ? (
                    <View style={styles.quantityControl}>
                      <TouchableOpacity 
                        style={styles.controlBtn} 
                        onPress={() => handleRemoveFromCart(item.id)}
                      >
                        <Minus size={14} color="#e91e63" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{qty}</Text>
                      <TouchableOpacity 
                        style={styles.controlBtn} 
                        onPress={() => handleAddToCart(item.id)}
                      >
                        <Plus size={14} color="#e91e63" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.addBtn} 
                      onPress={() => handleAddToCart(item.id)}
                    >
                      <Plus size={14} color="#fff" style={{ marginRight: 4 }} />
                      <Text style={styles.addBtnText}>Qo'shish</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Cart Summary Floating Bar */}
      {cartItemsCount > 0 && (
        <View style={styles.cartFooter}>
          <View style={styles.cartFooterLeft}>
            <Text style={styles.cartFooterQty}>{cartItemsCount} taom tanlandi</Text>
            <Text style={styles.cartFooterPrice}>{totalAmount.toLocaleString('uz-UZ')} {currency}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.orderSubmitBtn} 
            onPress={handlePlaceOrder}
            disabled={isOrdering}
          >
            {isOrdering ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.orderSubmitText}>Buyurtma berish</Text>
                <Check size={18} color="#fff" style={{ marginLeft: 6 }} />
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Success Modal */}
      <Modal
        visible={orderSuccess}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.successOverlay}>
          <View style={styles.successContent}>
            <View style={styles.successIconWrapper}>
              <Check size={40} color="#fff" />
            </View>
            
            <Text style={styles.successTitle}>Buyurtmangiz Qabul Qilindi!</Text>
            <Text style={styles.successDesc}>Buyurtma to'g'ri Menulux POS paneliga yuborildi va stolingiz band qilindi.</Text>
            
            {lastOrderDetails && (
              <View style={styles.orderDetailsBox}>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.detailLabel}>Buyurtma ID:</Text>
                  <Text style={styles.detailValue}>#{lastOrderDetails.id}</Text>
                </View>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.detailLabel}>Stol:</Text>
                  <Text style={styles.detailValue}>{lastOrderDetails.table}</Text>
                </View>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.detailLabel}>Umumiy Summa:</Text>
                  <Text style={[styles.detailValue, { color: '#e91e63', fontWeight: '800' }]}>{lastOrderDetails.amount}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <Text style={styles.orderedItemsTitle}>Tanlangan taomlar:</Text>
                {lastOrderDetails.items.map((item: any, idx: number) => (
                  <View key={idx} style={styles.orderItemRow}>
                    <Text style={styles.orderItemName}>{item.name}</Text>
                    <Text style={styles.orderItemQty}>{item.qty} dona</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 10, width: '100%', marginTop: 24 }}>
              <TouchableOpacity 
                style={[styles.closeSuccessBtn, { flex: 1, marginTop: 0, backgroundColor: '#f3f4f6' }]} 
                onPress={() => {
                  setOrderSuccess(false);
                }}
              >
                <Text style={[styles.closeSuccessText, { color: '#4b5563' }]}>Menyuda qolish</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.closeSuccessBtn, { flex: 1, marginTop: 0, backgroundColor: '#e91e63' }]} 
                onPress={() => {
                  setOrderSuccess(false);
                  router.replace('/');
                }}
              >
                <Text style={[styles.closeSuccessText, { color: '#fff' }]}>Asosiy ekranga</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  backText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cartIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#fff',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#7d1f5e',
  },
  cartCountText: {
    color: '#7d1f5e',
    fontSize: 9,
    fontWeight: '800',
  },
  categoriesWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 10,
  },
  categoriesScroll: {
    paddingHorizontal: 12,
  },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryBtnActive: {
    backgroundColor: '#e91e63',
    borderColor: '#e91e63',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  categoryTextActive: {
    color: '#fff',
  },
  menuScroll: {
    padding: 16,
    paddingBottom: 100,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#f3f4f6',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  itemDesc: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
    lineHeight: 15,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#e91e63',
    marginTop: 6,
  },
  actionContainer: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e91e63',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f7',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffd0db',
    overflow: 'hidden',
  },
  controlBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 8,
  },
  cartFooter: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#1e1333',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  cartFooterLeft: {
    flex: 1,
  },
  cartFooterQty: {
    color: '#d1d5db',
    fontSize: 11,
    fontWeight: '600',
  },
  cartFooterPrice: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  orderSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e91e63',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  orderSubmitText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successContent: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  successIconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  orderDetailsBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    width: '100%',
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '500',
  },
  detailValue: {
    color: '#1f2937',
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  orderedItemsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4b5563',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  orderItemName: {
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '500',
  },
  orderItemQty: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  closeSuccessBtn: {
    backgroundColor: '#1e1333',
    paddingVertical: 14,
    width: '100%',
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  closeSuccessText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    position: 'relative',
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#1f2937',
    paddingVertical: 8,
  },
  clearSearchBtn: {
    padding: 6,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginTop: 10,
  },
  noResultsSub: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
});
