import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Modal, 
  TextInput, 
  Alert, 
  ActivityIndicator, 
  StatusBar,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Plus, Trash2, Edit, Phone, ShieldCheck, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseService } from '../services/supabaseService';

export default function WaitersScreen() {
  const [waiters, setWaiters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accountId, setAccountId] = useState<string | null>(null);

  // Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [editingWaiter, setEditingWaiter] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('active');

  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const router = useRouter();

  // Filtered Waiters Memo
  const filteredWaiters = useMemo(() => {
    if (filter === 'active') return waiters.filter(w => w.status === 'active');
    if (filter === 'inactive') return waiters.filter(w => w.status !== 'active');
    return waiters;
  }, [filter, waiters]);

  // Load account and waiters data
  const loadData = async () => {
    try {
      const savedAccId = await AsyncStorage.getItem('currentAccountId');
      if (!savedAccId) {
        router.replace('/login');
        return;
      }
      setAccountId(savedAccId);
      
      const waitersList = await supabaseService.getWaiters(savedAccId);
      setWaiters(waitersList);
    } catch (err) {
      console.error("Error loading waiters:", err);
      Alert.alert("Xatolik", "Ma'lumotlarni yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open modal for adding a new waiter
  const handleAddNew = () => {
    setEditingWaiter(null);
    setName('');
    setPhone('');
    setStatus('active');
    setModalVisible(true);
  };

  // Open modal for editing a waiter
  const handleEdit = (waiter: any) => {
    setEditingWaiter(waiter);
    setName(waiter.name);
    setPhone(waiter.phone || '');
    setStatus(waiter.status || 'active');
    setModalVisible(true);
  };

  // Save (Add or Update) Waiter
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Xatolik", "Iltimos, afitsant ismini kiriting.");
      return;
    }

    if (!accountId) return;
    setLoading(true);

    try {
      if (editingWaiter) {
        // Update existing waiter
        const success = await supabaseService.updateWaiter(
          accountId, 
          editingWaiter.id, 
          name.trim(), 
          phone.trim(), 
          status
        );
        if (success) {
          Alert.alert("Muvaffaqiyat", "Afitsant ma'lumotlari yangilandi!");
          setModalVisible(false);
          await loadData();
        } else {
          Alert.alert(
            "Xatolik", 
            "Supabase bazasiga saqlab bo'lmadi. Iltimos, Supabase SQL Editor'da 'ALTER TABLE restaurant_waiters DISABLE ROW LEVEL SECURITY;' so'rovini bajarganingizga ishonch hosil qiling."
          );
        }
      } else {
        // Add new waiter
        const success = await supabaseService.addWaiter(
          accountId, 
          name.trim(), 
          phone.trim()
        );
        if (success) {
          Alert.alert("Muvaffaqiyat", "Yangi afitsant qo'shildi!");
          setModalVisible(false);
          await loadData();
        } else {
          Alert.alert(
            "Xatolik", 
            "Supabase bazasiga saqlab bo'lmadi. Iltimos, Supabase SQL Editor'da 'ALTER TABLE restaurant_waiters DISABLE ROW LEVEL SECURITY;' so'rovini bajarganingizga ishonch hosil qiling."
          );
        }
      }
    } catch (err) {
      console.error("Error saving waiter:", err);
      Alert.alert("Xatolik", "Saqlash jarayonida muammo yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Waiter Status
  const handleToggleStatus = async (waiter: any) => {
    if (!accountId) return;
    const newStatus = waiter.status === 'active' ? 'inactive' : 'active';
    setLoading(true);
    try {
      const success = await supabaseService.updateWaiter(
        accountId, 
        waiter.id, 
        waiter.name, 
        waiter.phone || '', 
        newStatus
      );
      if (success) {
        await loadData();
      } else {
        Alert.alert(
          "Xatolik", 
          "Holatni yangilab bo'lmadi. Iltimos SQL sozlamalarini tekshiring."
        );
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      Alert.alert("Xatolik", "Holatni o'zgartirishda muammo yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Waiter
  const handleDelete = (waiter: any) => {
    Alert.alert(
      "Afitsantni o'chirish",
      `Haqiqatan ham "${waiter.name}"ni ro'yxatdan o'chirmoqchimisiz?`,
      [
        { text: "Yo'q", style: "cancel" },
        { 
          text: "Ha, o'chirilsin", 
          style: "destructive",
          onPress: async () => {
            if (!accountId) return;
            setLoading(true);
            try {
              const success = await supabaseService.deleteWaiter(accountId, waiter.id, waiter.name);
              if (success) {
                Alert.alert("Muvaffaqiyat", "Afitsant o'chirildi!");
                await loadData();
              }
            } catch (err) {
              console.error("Error deleting waiter:", err);
              Alert.alert("Xatolik", "O'chirishda muammo yuz berdi.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const activeCount = waiters.filter(w => w.status === 'active').length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#120e1f" />
      
      {/* Header */}
      <LinearGradient 
        colors={['#d80056', '#7d1f5e', '#1e1333']}
        start={[0, 0]} end={[1, 0]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/')}>
          <ChevronLeft size={24} color="#fff" />
          <Text style={styles.backBtnText}>Ortga</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Afitsantlar</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddNew}>
          <Plus size={20} color="#fff" />
          <Text style={styles.addBtnText}>Qo'shish</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Info Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Umumiy</Text>
          <Text style={styles.statValue}>{waiters.length}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Faol</Text>
          <Text style={[styles.statValue, { color: '#10b981' }]}>{activeCount}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Nofaol</Text>
          <Text style={[styles.statValue, { color: '#ef4444' }]}>{waiters.length - activeCount}</Text>
        </View>
      </View>

      {/* Filters Segment Control */}
      {waiters.length > 0 && (
        <View style={styles.filterTabContainer}>
          {[
            { key: 'all' as const, label: 'Barchasi', count: waiters.length },
            { key: 'active' as const, label: 'Faollar', count: activeCount },
            { key: 'inactive' as const, label: 'Nofaollar', count: waiters.length - activeCount }
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterTabBtn, filter === tab.key && styles.filterTabBtnActive]}
              onPress={() => setFilter(tab.key)}
            >
              <Text style={[styles.filterTabBtnText, filter === tab.key && styles.filterTabBtnTextActive]}>
                {tab.label} ({tab.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Content */}
      {loading && waiters.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#e91e63" />
        </View>
      ) : waiters.length === 0 ? (
        <View style={styles.centerContainer}>
          <View style={styles.emptyIconContainer}>
            <User size={48} color="#6b7280" />
          </View>
          <Text style={styles.emptyText}>Afitsantlar mavjud emas</Text>
          <Text style={styles.emptySubText}>O'ng yuqoridagi "Qo'shish" tugmasi orqali yangi afitsant qo'shishingiz mumkin.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {filteredWaiters.length === 0 ? (
            <View style={[styles.centerContainer, { minHeight: 250, marginTop: 40 }]}>
              <View style={styles.emptyIconContainer}>
                <User size={36} color="#9ca3af" />
              </View>
              <Text style={[styles.emptyText, { fontSize: 15 }]}>Ushbu bo'limda afitsantlar yo'q</Text>
              <Text style={[styles.emptySubText, { fontSize: 12 }]}>Tanlangan filtr bo'yicha hech qanday afitsant topilmadi.</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {filteredWaiters.map((w) => (
              <View key={w.id} style={styles.waiterCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.avatarCircle, w.status !== 'active' && styles.avatarCircleInactive]}>
                    <User size={24} color={w.status === 'active' ? '#e91e63' : '#9ca3af'} />
                  </View>
                  <View style={styles.headerInfo}>
                    <Text style={styles.waiterName} numberOfLines={1}>{w.name}</Text>
                    <View style={[
                      styles.statusBadge, 
                      w.status === 'active' ? styles.statusBadgeActive : styles.statusBadgeInactive
                    ]}>
                      <Text style={[
                        styles.statusBadgeText,
                        w.status === 'active' ? styles.statusBadgeTextActive : styles.statusBadgeTextInactive
                      ]}>
                        {w.status === 'active' ? 'FAOL' : 'NOFAOL'}
                      </Text>
                    </View>
                  </View>
                </View>

                {w.phone ? (
                  <View style={styles.phoneRow}>
                    <Phone size={14} color="#6b7280" style={{ marginRight: 6 }} />
                    <Text style={styles.phoneText}>{w.phone}</Text>
                  </View>
                ) : (
                  <View style={styles.phoneRow}>
                    <Phone size={14} color="#d1d5db" style={{ marginRight: 6 }} />
                    <Text style={[styles.phoneText, { color: '#9ca3af', fontStyle: 'italic' }]}>Telefon kiritilmagan</Text>
                  </View>
                )}

                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleToggleStatus(w)}>
                    <ShieldCheck size={16} color={w.status === 'active' ? '#10b981' : '#6b7280'} />
                    <Text style={[styles.actionBtnText, { color: w.status === 'active' ? '#10b981' : '#6b7280' }]}>
                      {w.status === 'active' ? 'Faol' : 'Nofaol'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(w)}>
                    <Edit size={16} color="#6b7280" />
                    <Text style={styles.actionBtnText}>Tahrirlash</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(w)}>
                    <Trash2 size={16} color="#ef4444" />
                    <Text style={[styles.actionBtnText, { color: '#ef4444' }]}>O'chirish</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          )}
        </ScrollView>
      )}

      {/* Add / Edit Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingWaiter ? "Afitsantni tahrirlash" : "Yangi afitsant qo'shish"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Waiter Name */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>F.I.SH. (Ism va familiya) *</Text>
              <View style={styles.inputContainer}>
                <User size={18} color="#6b7280" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Masalan: Sardor Rahimov"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Waiter Phone */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Telefon raqami</Text>
              <View style={styles.inputContainer}>
                <Phone size={18} color="#6b7280" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Masalan: +998901234567"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Waiter Status (only show when editing) */}
            {editingWaiter && (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Holati</Text>
                <View style={styles.statusSelectRow}>
                  <TouchableOpacity 
                    style={[
                      styles.statusSelectBtn, 
                      status === 'active' && styles.statusSelectBtnActive
                    ]}
                    onPress={() => setStatus('active')}
                  >
                    <Text style={[
                      styles.statusSelectText,
                      status === 'active' && styles.statusSelectTextActive
                    ]}>FAOL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.statusSelectBtn, 
                      status === 'inactive' && styles.statusSelectBtnInactive
                    ]}
                    onPress={() => setStatus('inactive')}
                  >
                    <Text style={[
                      styles.statusSelectText,
                      status === 'inactive' && styles.statusSelectTextInactive
                    ]}>NOFAOL</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Bekor qilish</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.saveBtn]} 
                onPress={handleSave}
              >
                <Text style={styles.saveBtnText}>Saqlash</Text>
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
    backgroundColor: '#e9ecef',
  },
  header: {
    height: Platform.OS === 'web' ? 56 : 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  statCard: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#120e1f',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#120e1f',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 18,
  },
  scrollContent: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  waiterCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
    padding: 16,
    width: Platform.OS === 'web' ? '29.5%' : '47%',
    minWidth: 200,
    flexGrow: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.2)',
  },
  avatarCircleInactive: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    borderColor: 'rgba(156, 163, 175, 0.2)',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  waiterName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#120e1f',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  statusBadgeInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  statusBadgeTextActive: {
    color: '#10b981',
  },
  statusBadgeTextInactive: {
    color: '#ef4444',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  phoneText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4b5563',
  },
  deleteBtn: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(14, 8, 27, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#120e1f',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#4b5563',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
    height: 46,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: '#212529',
    fontSize: 14,
    height: '100%',
  },
  statusSelectRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statusSelectBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#dee2e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusSelectBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10b981',
  },
  statusSelectBtnInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#ef4444',
  },
  statusSelectText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
  },
  statusSelectTextActive: {
    color: '#10b981',
  },
  statusSelectTextInactive: {
    color: '#ef4444',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  cancelBtnText: {
    color: '#4b5563',
    fontWeight: '700',
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: '#e91e63',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  filterTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 5,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
    gap: 6,
  },
  filterTabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  filterTabBtnActive: {
    backgroundColor: '#120e1f',
  },
  filterTabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4b5563',
  },
  filterTabBtnTextActive: {
    color: '#fff',
  },
});
