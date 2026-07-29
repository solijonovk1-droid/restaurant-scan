import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Image, 
  Modal, 
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus, Trash2, X, Image as ImageIcon, Edit } from 'lucide-react-native';
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

const CATEGORIES = ["Taomlar", "Kaboblar", "Shirinliklar", "Ichimliklar"];
const DEFAULT_IMAGE_PLACEHOLDER = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";

export default function AdminMenuPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Taomlar");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [currency, setCurrency] = useState("UZS");
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const savedAccId = await AsyncStorage.getItem('currentAccountId');
        if (!savedAccId) {
          router.replace('/login');
          return;
        }
        setAccountId(savedAccId);

        // Load currency
        const storedCurrency = await supabaseService.getCurrency(savedAccId);
        if (storedCurrency) {
          setCurrency(storedCurrency);
        }

        // Load menu items
        const stored = await supabaseService.getMenuItems(savedAccId);
        if (stored && stored.length > 0) {
          setMenuItems(stored);
        } else {
          await supabaseService.setMenuItems(savedAccId, DEFAULT_MENU_ITEMS);
          setMenuItems(DEFAULT_MENU_ITEMS);
        }
      } catch (err) {
        console.error("Error loading admin menu data:", err);
        Alert.alert("Xatolik", "Menyu ma'lumotlarini yuklashda xatolik yuz berdi.");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthAndLoad();
  }, []);

  const handleStartEdit = (item: any) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price.toString());
    setCategory(item.category);
    setDesc(item.desc);
    setImage(item.image);
    setModalVisible(true);
  };

  const handleStartAdd = () => {
    setEditingItem(null);
    setName("");
    setPrice("");
    setCategory("Taomlar");
    setDesc("");
    setImage("");
    setModalVisible(true);
  };

  const handleSaveItem = async () => {
    if (!name.trim()) {
      Alert.alert("Xatolik", "Iltimos, mahsulot nomini kiriting.");
      return;
    }
    if (!price.trim() || isNaN(parseFloat(price))) {
      Alert.alert("Xatolik", "Iltimos, narxni to'g'ri raqam formatida kiriting.");
      return;
    }

    try {
      let updatedList = [];
      if (editingItem) {
        // Tahrirlash rejimi
        updatedList = menuItems.map(item => {
          if (item.id === editingItem.id) {
            return {
              ...item,
              name: name.trim(),
              price: parseFloat(price),
              category: category,
              desc: desc.trim() || "Mazali va sarxil mahsulot.",
              image: image.trim() || DEFAULT_IMAGE_PLACEHOLDER
            };
          }
          return item;
        });
        Alert.alert("Muvaffaqiyat", "Mahsulot muvaffaqiyatli tahrirlandi!");
      } else {
        // Yangi qo'shish rejimi
        const newItem = {
          id: Date.now().toString(),
          name: name.trim(),
          price: parseFloat(price),
          category: category,
          desc: desc.trim() || "Mazali va sarxil mahsulot.",
          image: image.trim() || DEFAULT_IMAGE_PLACEHOLDER
        };
        updatedList = [...menuItems, newItem];
        Alert.alert("Muvaffaqiyat", "Yangi mahsulot menyuga qo'shildi!");
      }

      if (accountId) {
        await supabaseService.setMenuItems(accountId, updatedList);
      }
      setMenuItems(updatedList);
      
      // Reset form and close modal
      setName("");
      setPrice("");
      setCategory("Taomlar");
      setDesc("");
      setImage("");
      setEditingItem(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving menu item:", error);
      Alert.alert("Xatolik", "Ma'lumotni saqlashda xatolik yuz berdi.");
    }
  };

  const handleDeleteItem = (itemId: string, itemName: string) => {
    Alert.alert(
      "Mahsulotni o'chirish",
      `"${itemName}" mahsulotini menyudan butunlay o'chirishni xohlaysizmi?`,
      [
        { text: "Yo'q", style: "cancel" },
        { 
          text: "Ha, o'chirilsin", 
          onPress: async () => {
            try {
              const updatedList = menuItems.filter(item => item.id !== itemId);
              if (accountId) {
                await supabaseService.setMenuItems(accountId, updatedList);
              }
              setMenuItems(updatedList);
            } catch (error) {
              console.error("Error deleting item:", error);
              Alert.alert("Xatolik", "Mahsulotni o'chirishda xatolik yuz berdi.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/')}>
          <ChevronLeft size={24} color="#333" />
          <Text style={styles.backText}>Orqaga</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menyu Boshqaruvi</Text>
        
        <TouchableOpacity style={styles.addHeaderBtn} onPress={handleStartAdd}>
          <Plus size={16} color="#fff" />
          <Text style={styles.addHeaderBtnText}>Mahsulot</Text>
        </TouchableOpacity>
      </View>

      {/* Main List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e91e63" />
          <Text style={styles.loadingText}>Yuklanmoqda...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {menuItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ImageIcon size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>Hozircha mahsulotlar yo'q.</Text>
              <TouchableOpacity style={styles.addBtnLarge} onPress={handleStartAdd}>
                <Text style={styles.addBtnLargeText}>Birinchi mahsulotni qo'shish</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.grid}>
              {menuItems.map(item => (
                <View key={item.id} style={styles.itemCard}>
                  <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
                  
                  {/* Floating Edit and Delete Buttons */}
                  <View style={styles.cardActions}>
                    <TouchableOpacity 
                      style={[styles.floatingBtn, styles.editBtn]}
                      onPress={() => handleStartEdit(item)}
                      activeOpacity={0.8}
                    >
                      <Edit size={14} color="#e91e63" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.floatingBtn, styles.deleteBtn]}
                      onPress={() => handleDeleteItem(item.id, item.name)}
                      activeOpacity={0.8}
                    >
                      <Trash2 size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                    <Text style={styles.itemPrice}>{item.price.toLocaleString('uz-UZ')} {currency}</Text>
                    <Text style={styles.itemDesc} numberOfLines={2}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Add / Edit Item Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Form Input fields */}
              <Text style={styles.inputLabel}>Mahsulot nomi *</Text>
              <TextInput 
                style={styles.textInput} 
                placeholder="Masalan: Somsa (Tovuqli)" 
                value={name} 
                onChangeText={setName} 
              />

              <Text style={styles.inputLabel}>Narxi ({currency}) *</Text>
              <TextInput 
                style={styles.textInput} 
                placeholder="Masalan: 12000" 
                keyboardType="numeric" 
                value={price} 
                onChangeText={setPrice} 
              />

              <Text style={styles.inputLabel}>Kategoriya</Text>
              <View style={styles.categoryRow}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity 
                    key={cat} 
                    style={[styles.catSelectBtn, category === cat && styles.catSelectBtnActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.catSelectText, category === cat && styles.catSelectTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Rasm URL manzili</Text>
              <TextInput 
                style={styles.textInput} 
                placeholder="https://images.unsplash.com/... (Bo'sh bo'lsa default olinadi)" 
                value={image} 
                onChangeText={setImage} 
              />

              <Text style={styles.inputLabel}>Qisqacha tavsifi</Text>
              <TextInput 
                style={[styles.textInput, styles.textArea]} 
                placeholder="Mahsulot haqida ma'lumot kiriting..." 
                multiline={true} 
                numberOfLines={3}
                value={desc} 
                onChangeText={setDesc} 
              />
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.footerBtn, styles.cancelBtn]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Bekor qilish</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.footerBtn, styles.submitBtn]} 
                onPress={handleSaveItem}
              >
                <Text style={styles.submitBtnText}>
                  {editingItem ? "Saqlash" : "Qo'shish"}
                </Text>
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
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 90,
  },
  backText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  addHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e91e63',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  addHeaderBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '500',
  },
  addBtnLarge: {
    marginTop: 20,
    backgroundColor: '#1e1333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  addBtnLargeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: 250,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#f3f4f6',
  },
  cardInfo: {
    padding: 14,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f2937',
  },
  itemCategory: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#e91e63',
    marginTop: 6,
  },
  itemDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 6,
    lineHeight: 16,
  },
  cardActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 8,
  },
  floatingBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editBtn: {
    // Edit color theme adjustments
  },
  deleteBtn: {
    // Delete color theme adjustments
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 450,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
  },
  modalBody: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4b5563',
    marginBottom: 6,
    marginTop: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#212529',
    backgroundColor: '#f9fafb',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  catSelectBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  catSelectBtnActive: {
    backgroundColor: '#e91e63',
    borderColor: '#e91e63',
  },
  catSelectText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  catSelectTextActive: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    backgroundColor: '#f9fafb',
  },
  footerBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#e5e7eb',
  },
  cancelBtnText: {
    color: '#4b5563',
    fontWeight: '700',
    fontSize: 13,
  },
  submitBtn: {
    backgroundColor: '#e91e63',
    minWidth: 100,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
});
