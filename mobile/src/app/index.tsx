import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  StatusBar,
  Modal
} from 'react-native';
import {
  Barcode,
  X,
  Package,
  FileText,
  MoveRight,
  ChevronLeft,
  User,
  MoreHorizontal,
  Clock,
  History,
  Utensils,
  Coffee,
  CheckCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// ─── Har bir stol uchun buyurtma ma'lumotlari ───────────────────────────────
const tableOrdersData: Record<number, { name: string; qty: number; price: number; unit: string }[]> = {
  // Stol 7
  7: [
    { name: 'Osh (Palov)',        qty: 4, price: 35000, unit: 'ta' },
    { name: 'Achchiq-chuchuk',   qty: 2, price: 8000,  unit: 'ta' },
    { name: 'Non',                qty: 4, price: 3000,  unit: 'ta' },
    { name: 'Qora choy',          qty: 4, price: 4000,  unit: 'ta' },
  ],
  // Stol 8
  8: [
    { name: 'Lag\'mon',           qty: 2, price: 22000, unit: 'ta' },
    { name: 'Coca-Cola 0.5L',    qty: 2, price: 6000,  unit: 'ta' },
    { name: 'Non',                qty: 2, price: 3000,  unit: 'ta' },
  ],
  // Stol 9 (special)
  9: [
    { name: 'Qozon kabob',        qty: 2, price: 45000, unit: 'ta' },
    { name: 'Salat (Bahor)',      qty: 1, price: 12000, unit: 'ta' },
    { name: 'Ko\'k choy',         qty: 2, price: 5000,  unit: 'ta' },
  ],
  // Stol 10
  10: [
    { name: 'Shashlik (Qiyma)',  qty: 4, price: 30000, unit: 'ta' },
    { name: 'Non',                qty: 2, price: 3000,  unit: 'ta' },
    { name: 'Fanta 1L',           qty: 2, price: 9000,  unit: 'ta' },
  ],
  // Stol 15
  15: [
    { name: 'Manti',              qty: 2, price: 28000, unit: 'ta' },
    { name: 'Limon choy',         qty: 2, price: 6000,  unit: 'ta' },
  ],
  // Stol-2 3
  23: [
    { name: 'Osh (Palov)',        qty: 2, price: 35000, unit: 'ta' },
    { name: 'Pepsi 1L',           qty: 2, price: 8000,  unit: 'ta' },
    { name: 'Non',                qty: 2, price: 3000,  unit: 'ta' },
  ],
  // Terrasa 3
  33: [
    { name: 'Set "Katta Oila"',  qty: 1, price: 180000, unit: 'ta' },
    { name: 'Shashlik (Qiyma)',  qty: 4, price: 30000,  unit: 'ta' },
    { name: 'Fanta 1.5L',         qty: 3, price: 12000,  unit: 'ta' },
    { name: 'Non',                qty: 4, price: 3000,   unit: 'ta' },
    { name: 'Achchiq-chuchuk',   qty: 2, price: 8000,   unit: 'ta' },
  ],
};

// ─── Stollar ma'lumotlari ────────────────────────────────────────────────────
const initialOrders = [
  { id: 5, table: 'Stol 8',   time: '17:43', amount: '40 000 UZS' },
  { id: 4, table: 'Stol 10',  time: '17:25', amount: '80 000 UZS' },
  { id: 3, table: 'Stol 6',   time: '17:14', amount: "95 000 UZS" },
  { id: 2, table: 'Stol 7',   time: '16:52', amount: '80 000 UZS' },
  { id: 1, table: 'Stol 15',  time: '16:26', amount: '90 000 UZS' },
];

export const allTables: Record<string, any[]> = {
  'ZAL': [
    { id: 1,  name: 'Stol 1',  status: 'empty' },
    { id: 2,  name: 'Stol 2',  status: 'empty' },
    { id: 3,  name: 'Stol 3',  status: 'empty' },
    { id: 4,  name: 'Stol 4',  status: 'empty' },
    { id: 6,  name: 'Stol 6',  status: 'empty' },
    { id: 7,  name: 'Stol 7',  status: 'occupied', user: 'Otabek', time: '19:00', people: 4 },
    { id: 8,  name: 'Stol 8',  status: 'occupied', user: 'Otabek', time: '19:03' },
    { id: 9,  name: 'Stol 9',  status: 'special',  user: 'Otabek', time: '18:41', people: 2, hasCloud: true },
    { id: 10, name: 'Stol 10', status: 'occupied', user: 'Otabek', time: '19:03' },
    { id: 11, name: 'Stol 11', status: 'empty' },
    { id: 12, name: 'Stol 12', status: 'empty' },
    { id: 14, name: 'Stol 14', status: 'empty' },
    { id: 141, name: 'Stol 14', status: 'reserved', subStatus: 'Band qilingan', hasClock: true },
    { id: 15, name: 'Stol 15', status: 'occupied', user: 'Otabek', time: '19:03', isLocked: true },
    { id: 16, name: 'Stol 16', status: 'empty' },
    { id: 17, name: 'Stol 17', status: 'empty' },
  ],
  'ZAL 2': [
    { id: 21, name: 'Stol-2 1', status: 'empty' },
    { id: 22, name: 'Stol-2 2', status: 'empty' },
    { id: 23, name: 'Stol-2 3', status: 'occupied', user: 'Sardor', time: '18:30' },
    { id: 24, name: 'Stol-2 4', status: 'empty' },
    { id: 25, name: 'Stol-2 5', status: 'empty' },
    { id: 26, name: 'Stol-2 6', status: 'empty' },
  ],
  'TERRASA': [
    { id: 31, name: 'Terrasa 1', status: 'empty' },
    { id: 32, name: 'Terrasa 2', status: 'empty' },
    { id: 33, name: 'Terrasa 3', status: 'occupied', user: 'Jasur', time: '19:15' },
  ],
  "BOG'": [
    { id: 41, name: "Bog' 1", status: 'empty' },
    { id: 42, name: "Bog' 2", status: 'empty' },
  ],
};

// ─── Summa formatlash ────────────────────────────────────────────────────────
const formatSum = (n: number) =>
  n.toLocaleString('uz-UZ').replace(/,/g, ' ') + ' UZS';

// ─── Jami hisoblash ──────────────────────────────────────────────────────────
const calcTotal = (items: { qty: number; price: number }[]) =>
  items.reduce((s, i) => s + i.qty * i.price, 0);

// ─── Stol nomi bo'yicha ID topish ────────────────────────────────────────────
const getTableIdByName = (tableName: string): number | null => {
  for (const zone of Object.values(allTables)) {
    const found = (zone as any[]).find((t) => t.name === tableName);
    if (found) return found.id as number;
  }
  return null;
};

// ─── Stol rangi ─────────────────────────────────────────────────────────────
const getTableColors = (status: string): [string, string] => {
  if (status === 'occupied') return ['#ff4081', '#c2185b'];
  if (status === 'reserved') return ['#ff8f00', '#e65100'];
  if (status === 'special')  return ['#5c6bc0', '#3f51b5'];
  return ['#f0f4ff', '#dde6f9'];
};

// ─── Komponent ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [activeCategory, setActiveCategory] = useState('BARCHA STOLLAR');
  const [menuVisible, setMenuVisible]         = useState(false);
  const [ordersList, setOrdersList]           = useState(initialOrders);
  const [tableRefresh, setTableRefresh]       = useState(0);
  const { width } = useWindowDimensions();
  const router    = useRouter();

  // ── Oddiy xabar modali ──
  const [infoModal, setInfoModal]   = useState(false);
  const [infoContent, setInfoContent] = useState({ title: '', message: '' });
  const showInfo = (title: string, message: string) => {
    setInfoContent({ title, message });
    setInfoModal(true);
  };

  // ── Stol hisob modali ──
  const [billModal, setBillModal]  = useState(false);
  const [billTable, setBillTable]  = useState<{ id: number; name: string; user: string; time: string; items: typeof tableOrdersData[number] } | null>(null);

  // ── Stol bosilganda ─────────────────────────────────────────────────────
  const onTablePress = (t: any) => {
    if (t.status === 'empty') {
      showInfo('Stol', `${t.name} — Bo'sh`);
      return;
    }
    if (t.status === 'reserved') {
      showInfo('Band stol', `${t.name} — ${t.subStatus ?? 'Band qilingan'}`);
      return;
    }
    // occupied / special → hisob modali
    const items = tableOrdersData[t.id] ?? [];
    setBillTable({ id: t.id, name: t.name, user: t.user ?? '—', time: t.time ?? '—', items });
    setBillModal(true);
  };

  // ── Buyurtma panelidan stol hisobi ──────────────────────────────────────
  const onOrderPress = (o: typeof initialOrders[0]) => {
    const tableId = getTableIdByName(o.table);
    if (tableId === null) return;
    const allFlat = Object.values(allTables).flat() as any[];
    const table = allFlat.find((t) => t.id === tableId);
    if (!table) return;
    const items = tableOrdersData[tableId] ?? [];
    setBillTable({ id: tableId, name: table.name, user: table.user ?? '—', time: table.time ?? o.time, items });
    setBillModal(true);
  };

  // ── Stol yopish ─────────────────────────────────────────────────────────
  const closeTable = (tableId: number) => {
    const zone = Object.keys(allTables).find(z =>
      allTables[z].some(t => t.id === tableId)
    );
    if (!zone) return;

    const updated = allTables[zone].map(t =>
      t.id === tableId
        ? { ...t, status: 'empty', user: undefined, time: undefined, people: undefined, subStatus: undefined, hasClock: false }
        : t
    );
    (allTables as any)[zone] = updated;

    // buyurtmalar panelidan o'chiramiz
    const tableName = billTable?.name ?? '';
    setOrdersList(prev => prev.filter(o => o.table !== tableName));
    setTableRefresh(prev => prev + 1);
    setBillModal(false);
  };

  // ── Ko'rsatiladigan stollar ──────────────────────────────────────────────
  const displayedTables = React.useMemo(() => {
    if (activeCategory === 'BARCHA STOLLAR') return Object.values(allTables).flat();
    if (activeCategory === 'BAND STOLLAR')   return Object.values(allTables).flat().filter(t => t.status !== 'empty');
    return allTables[activeCategory] ?? [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, tableRefresh]);

  // ── Stol karta ──────────────────────────────────────────────────────────
  const renderTableCard = (t: any, idx: number) => {
    const colors = getTableColors(t.status);
    const items  = tableOrdersData[t.id] ?? [];
    const total  = calcTotal(items);

    return (
      <View key={`${t.id}-${idx}`} style={styles.tableCardContainer}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => onTablePress(t)}>
          <LinearGradient colors={colors as [string, string]} style={styles.tableCard}>

            {/* ── BO'SH STOL ── */}
            {t.status === 'empty' && (
              <>
                {/* + badge */}
                <View style={styles.emptyPlusBadge}>
                  <Text style={styles.emptyPlusText}>+</Text>
                </View>
                <Text style={styles.emptyTableName}>{t.name}</Text>
                <View style={styles.emptyLabel}>
                  <Text style={styles.emptyLabelText}>OCHIQ</Text>
                </View>
              </>
            )}

            {/* ── BAND STOL ── */}
            {t.status === 'reserved' && (
              <>
                {/* BAND badge */}
                <View style={styles.reservedBadge}>
                  <Text style={styles.reservedBadgeText}>BAND</Text>
                </View>
                <Text style={[styles.tableName, { color: '#fff', marginTop: 6 }]}>{t.name}</Text>
                {/* Clock box */}
                <View style={styles.reservedClockBox}>
                  <Clock size={14} color="#fff" />
                  <Text style={styles.reservedClockText}>
                    {t.subStatus ?? 'Band qilingan'}
                  </Text>
                </View>
              </>
            )}

            {/* ── BAND (occupied / special) ── */}
            {(t.status === 'occupied' || t.status === 'special') && (
              <>
                <Text style={[styles.tableName, { color: '#fff' }]}>{t.name}</Text>
                <Text style={[styles.tableAmount, { color: '#fff' }]}>
                  {items.length > 0 ? formatSum(total) : '—'}
                </Text>
                <View style={styles.tableFooterInfo}>
                  <Text style={[styles.tableFooterText, { color: '#fff' }]}>{t.user}</Text>
                  <Text style={[styles.tableFooterText, { color: '#fff' }]}>{t.time}</Text>
                </View>
              </>
            )}

            {t.people && (
              <View style={styles.tableIconTop}>
                <User size={10} color="#fff" />
                <Text style={[styles.tablePeopleText, { color: '#fff' }]}>{t.people}</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#120e1f" />

      {/* Header */}
      <LinearGradient colors={['#d80056', '#7d1f5e', '#1e1333']} start={[0, 0]} end={[1, 0]} style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.logoContainer}>
            <ChevronLeft size={24} color="#fff" />
            <Text style={styles.logoText}>MENULUX <Text style={styles.logoTextLight}>Pos</Text></Text>
          </TouchableOpacity>
        </View>
        {width > 600 && (
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setMenuVisible(true)}>
              <MoreHorizontal size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.userProfile} onPress={() => showInfo('Profil', 'Foydalanuvchi profili.')}>
              <User size={20} color="#fff" />
              <View>
                <Text style={styles.userName}>Otabek A.</Text>
                <Text style={styles.userAction}>ALMASHTIRISH</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.mainContent}>

        {/* Left Toolbar */}
        <View style={styles.toolbar}>
          {[
            { icon: Barcode,   text: "Shtrix-kod", action: () => router.push('/barcodes') },
            { icon: History,   text: 'Tarix',       action: () => router.push('/history') },
            { icon: X,         text: 'Bekor',        action: () => { setOrdersList([]); showInfo('Bekor qilish', 'Barcha buyurtmalar bekor qilindi.'); } },
            { icon: Package,   text: 'Dastavka',     action: () => router.push('/delivery') },
            { icon: FileText,  text: 'Eslatmalar',   action: () => router.push('/orders') },
            { icon: MoveRight, text: "Ko'chirish",   action: () => showInfo("Ko'chirish", "Stolni ko'chirish bo'limi.") },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.toolbarBtn} onPress={item.action}>
              <item.icon color="#fff" size={20} />
              <Text style={styles.toolbarBtnText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Orders Panel */}
        <View style={styles.ordersPanel}>
          {/* ─ Sarlavha ─ */}
          <LinearGradient
            colors={['#d80056', '#9c1166', '#6a0f4e']}
            start={[0, 0]} end={[1, 1]}
            style={styles.ordersHeader}
          >
            <View style={styles.ordersHeaderTop}>
              <View style={styles.ordersPulseDot} />
              <Text style={styles.ordersHeaderText}>{ordersList.length} BUYURTMA</Text>
            </View>
            <Text style={styles.ordersHeaderSub}>Hozir faol stollar</Text>
          </LinearGradient>

          {/* ─ Ro'yxat ─ */}
          <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
            {ordersList.map((o, index) => {
              const ACCENT_COLORS = ['#e91e63', '#7c4dff', '#00acc1', '#ff7043', '#43a047'];
              const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];
              const tid = getTableIdByName(o.table);
              const items = tid ? (tableOrdersData[tid] ?? []) : [];
              const dynTotal = calcTotal(items);
              const itemCount = items.reduce((s, i) => s + i.qty, 0);
              return (
                <TouchableOpacity
                  key={o.id}
                  style={styles.orderItem}
                  activeOpacity={0.75}
                  onPress={() => onOrderPress(o)}
                >
                  <View style={[styles.orderAccentBar, { backgroundColor: accentColor }]} />
                  <View style={[styles.orderBadge, { backgroundColor: accentColor }]}>
                    <Text style={styles.orderBadgeText}>{o.id}</Text>
                  </View>
                  <View style={styles.orderDetails}>
                    <View style={styles.orderTopRow}>
                      <Text style={styles.orderTable} numberOfLines={1}>{o.table}</Text>
                      <Text style={styles.orderTime}>🕐 {o.time}</Text>
                    </View>
                    <View style={styles.orderBottomRow}>
                      <Text style={styles.orderItemCount}>
                        {itemCount > 0 ? `${itemCount} taom` : '—'}
                      </Text>
                      <Text style={[styles.orderAmount, { color: accentColor }]}>
                        {dynTotal > 0 ? formatSum(dynTotal) : o.amount}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.orderArrow, { borderLeftColor: accentColor + '33' }]}>
                    <Text style={{ color: accentColor, fontSize: 12, fontWeight: '700' }}>›</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            {ordersList.length === 0 && (
              <View style={styles.ordersEmpty}>
                <Coffee size={28} color="#dee2e6" />
                <Text style={styles.ordersEmptyText}>Hozircha buyurtma yo'q</Text>
              </View>
            )}
          </ScrollView>

          {/* ─ Footer ─ */}
          <View style={styles.ordersFooter}>
            <View>
              <Text style={styles.ordersFooterLabel}>JAMI TUSHUM</Text>
              <Text style={styles.ordersFooterSub}>{ordersList.length} ta stol</Text>
            </View>
            <Text style={styles.ordersFooterPrice}>
              {ordersList.length > 0
                ? formatSum(
                    ordersList.reduce((sum, o) => {
                      const tid = getTableIdByName(o.table);
                      return sum + calcTotal(tid ? (tableOrdersData[tid] ?? []) : []);
                    }, 0)
                  )
                : '0 UZS'}
            </Text>
          </View>
        </View>

        {/* Center Tables Grid */}
        <View style={styles.tablesPanel}>
          <View style={styles.tablesHeader}>
            <Text style={styles.tablesHeaderBread}>
              Qavatlar &gt;{' '}
              <Text style={styles.tablesHeaderActive}>
                {activeCategory === 'BARCHA STOLLAR' ? 'Asosiy Zal' : activeCategory}
              </Text>
            </Text>
          </View>
          <ScrollView contentContainerStyle={styles.tablesGrid}>
            {displayedTables.map((t, idx) => renderTableCard(t, idx))}
          </ScrollView>
        </View>

        {/* Right Categories */}
        <View style={styles.catsPanel}>
          <Text style={styles.catsHeader}>STOLLAR</Text>
          {["BARCHA STOLLAR", "BAND STOLLAR", "ZAL", "ZAL 2", "TERRASA", "BOG'"].map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catBtn, activeCategory === cat && styles.catBtnActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catBtnText, activeCategory === cat && styles.catBtnTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── HISOB MODALI (Stol yopish) ──────────────────────────────────── */}
      <Modal animationType="slide" transparent visible={billModal} onRequestClose={() => setBillModal(false)}>
        <View style={styles.billOverlay}>
          <View style={styles.billCard}>
            {/* Modal sarlavha */}
            <LinearGradient colors={['#d80056', '#7d1f5e']} start={[0, 0]} end={[1, 0]} style={styles.billHeader}>
              <View>
                <Text style={styles.billTableName}>{billTable?.name}</Text>
                <Text style={styles.billMeta}>Ofitsiant: {billTable?.user}  •  {billTable?.time}</Text>
              </View>
              <TouchableOpacity onPress={() => setBillModal(false)} style={styles.billCloseBtn}>
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            {/* Buyurtmalar ro'yxati */}
            <ScrollView style={styles.billScroll}>
              <Text style={styles.billSectionTitle}>🍽️ Buyurtma tarkibi</Text>

              {/* Jadval sarlavhasi */}
              <View style={styles.billRowHeader}>
                <Text style={[styles.billColHead, { flex: 3 }]}>Nomi</Text>
                <Text style={[styles.billColHead, { flex: 1, textAlign: 'center' }]}>Soni</Text>
                <Text style={[styles.billColHead, { flex: 1.5, textAlign: 'center' }]}>Narxi</Text>
                <Text style={[styles.billColHead, { flex: 1.8, textAlign: 'right' }]}>Jami</Text>
              </View>

              {(billTable?.items ?? []).map((item, i) => (
                <View key={i} style={[styles.billRow, i % 2 === 0 ? styles.billRowEven : styles.billRowOdd]}>
                  <View style={[{ flex: 3, flexDirection: 'row', alignItems: 'center' }]}>
                    <Utensils size={11} color="#6c757d" style={{ marginRight: 5 }} />
                    <Text style={styles.billItemName} numberOfLines={1}>{item.name}</Text>
                  </View>
                  <Text style={[styles.billItemVal, { flex: 1, textAlign: 'center' }]}>{item.qty} {item.unit}</Text>
                  <Text style={[styles.billItemVal, { flex: 1.5, textAlign: 'center' }]}>{formatSum(item.price)}</Text>
                  <Text style={[styles.billItemTotal, { flex: 1.8, textAlign: 'right' }]}>{formatSum(item.qty * item.price)}</Text>
                </View>
              ))}

              {(billTable?.items.length ?? 0) === 0 && (
                <Text style={styles.billEmpty}>Buyurtma ma'lumotlari mavjud emas</Text>
              )}
            </ScrollView>

            {/* Ajratuvchi chiziq */}
            <View style={styles.billDivider} />

            {/* Jami summa */}
            <View style={styles.billTotalRow}>
              <Text style={styles.billTotalLabel}>JAMI TO'LOV:</Text>
              <Text style={styles.billTotalAmount}>
                {formatSum(calcTotal(billTable?.items ?? []))}
              </Text>
            </View>

            {/* Tugmalar */}
            <View style={styles.billBtns}>
              <TouchableOpacity style={styles.billCancelBtn} onPress={() => setBillModal(false)}>
                <Text style={styles.billCancelBtnText}>Orqaga</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.billPayBtn}
                onPress={() => billTable && closeTable(billTable.id)}
              >
                <CheckCircle size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.billPayBtnText}>To'landi — Yopish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── ODDIY XABAR MODALI ──────────────────────────────────────────── */}
      <Modal animationType="fade" transparent visible={infoModal} onRequestClose={() => setInfoModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{infoContent.title}</Text>
            <Text style={styles.modalMessage}>{infoContent.message}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setInfoModal(false)}>
              <Text style={styles.modalButtonText}>Yopish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── DROPDOWN MENU ───────────────────────────────────────────────── */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={[styles.dropdownItem, { borderBottomWidth: 0 }]}
              onPress={() => { setMenuVisible(false); showInfo('Sozlamalar', 'Sozlamalar bo\'limi.'); }}>
              <Text style={styles.dropdownItemText}>⚙️ Sozlamalar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ─── Stillar ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Header
  header: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoText: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
  logoTextLight: { fontWeight: '300' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 5, borderRadius: 15 },
  userProfile: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  userAction: { color: '#ddd', fontSize: 8, textAlign: 'right' },

  // Layout
  mainContent: { flex: 1, flexDirection: 'row' },

  // Toolbar
  toolbar: { width: 55, backgroundColor: '#1a112d', alignItems: 'center', paddingTop: 10 },
  toolbarBtn: { alignItems: 'center', justifyContent: 'center', width: 45, height: 45, marginBottom: 6, borderRadius: 8 },
  toolbarBtnText: { color: '#fff', fontSize: 7, marginTop: 2, textAlign: 'center' },

  // Orders Panel
  ordersPanel: { width: 200, backgroundColor: '#f0f0f5', borderRightWidth: 1, borderRightColor: '#dee2e6' },
  ordersHeader: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 10 },
  ordersHeaderTop: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 3 },
  ordersPulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff', opacity: 0.9 },
  ordersHeaderText: { color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 0.6 },
  ordersHeaderSub: { color: 'rgba(255,255,255,0.65)', fontSize: 9, letterSpacing: 0.3 },
  ordersList: { flex: 1, paddingTop: 6 },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  orderAccentBar: { width: 4, alignSelf: 'stretch' },
  orderBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginHorizontal: 7 },
  orderBadgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  orderDetails: { flex: 1, paddingVertical: 9 },
  orderTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTable: { color: '#1a1a2e', fontWeight: '800', fontSize: 11 },
  orderTime: { color: '#adb5bd', fontSize: 8, fontWeight: '500' },
  orderItemCount: { color: '#ced4da', fontSize: 9 },
  orderAmount: { fontWeight: '800', fontSize: 11 },
  orderArrow: { paddingHorizontal: 8, paddingVertical: 4, borderLeftWidth: 1 },
  ordersEmpty: { alignItems: 'center', paddingTop: 40, gap: 10 },
  ordersEmptyText: { color: '#ced4da', fontSize: 11, fontWeight: '500' },
  ordersFooter: { padding: 12, borderTopWidth: 1, borderTopColor: '#dee2e6', backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  ordersFooterLabel: { color: '#868e96', fontWeight: '700', fontSize: 9, letterSpacing: 0.5 },
  ordersFooterSub: { color: '#ced4da', fontSize: 8, marginTop: 2 },
  ordersFooterPrice: { color: '#1a1a2e', fontWeight: '900', fontSize: 14 },

  // Tables Panel
  tablesPanel: { flex: 1, backgroundColor: '#e9ecef' },
  tablesHeader: { paddingVertical: 10, paddingHorizontal: 15 },
  tablesHeaderBread: { color: '#868e96', fontSize: 10, fontWeight: '500' },
  tablesHeaderActive: { color: '#212529', fontWeight: '700' },
  tablesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 },
  tableCardContainer: { width: '12.5%', padding: 4, minHeight: 85 },
  tableCard: { flex: 1, borderRadius: 10, padding: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent', elevation: 2 },
  tableName: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  tableStatus: { fontSize: 9, opacity: 0.7 },
  tableAmount: { fontSize: 10, fontWeight: '800', marginTop: 2, textAlign: 'center' },
  tableFooterInfo: { position: 'absolute', bottom: 4, left: 4, right: 4, flexDirection: 'row', justifyContent: 'space-between' },
  tableFooterText: { fontSize: 8, opacity: 0.9 },
  tableIconTop: { position: 'absolute', top: 4, right: 4, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.15)', paddingHorizontal: 3, paddingVertical: 1, borderRadius: 4 },
  tablePeopleText: { fontSize: 7, fontWeight: 'bold' },

  // Empty table card
  emptyPlusBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(100,130,200,0.18)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyPlusText: { color: '#7b9ed4', fontSize: 16, fontWeight: '300', lineHeight: 20 },
  emptyTableName: { fontSize: 10, fontWeight: '700', color: '#5a7ab5', textAlign: 'center' },
  emptyLabel: { marginTop: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: 'rgba(100,140,210,0.18)' },
  emptyLabelText: { fontSize: 7, fontWeight: '800', color: '#7b9ed4', letterSpacing: 0.5 },

  // Reserved table card
  reservedBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.25)' },
  reservedBadgeText: { fontSize: 8, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  reservedClockBox: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 6, backgroundColor: 'rgba(0,0,0,0.15)', paddingHorizontal: 5, paddingVertical: 3, borderRadius: 6 },
  reservedClockText: { fontSize: 8, fontWeight: '600', color: '#fff' },

  // Categories Panel
  catsPanel: { width: 90, backgroundColor: '#1a112d', paddingTop: 15 },
  catsHeader: { color: '#adb5bd', fontSize: 8, textAlign: 'center', marginBottom: 8, letterSpacing: 0.5 },
  catBtn: { paddingVertical: 8, marginHorizontal: 8, marginVertical: 3, borderRadius: 12, alignItems: 'center' },
  catBtnActive: { backgroundColor: '#fff' },
  catBtnText: { color: '#fff', fontSize: 9, fontWeight: '600', textAlign: 'center' },
  catBtnTextActive: { color: '#212529' },

  // ── Hisob Modali ──────────────────────────────────────────────────────────
  billOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  billCard: { backgroundColor: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90%', overflow: 'hidden', elevation: 10 },
  billHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  billTableName: { color: '#fff', fontSize: 20, fontWeight: '800' },
  billMeta: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  billCloseBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 6 },
  billScroll: { maxHeight: 320, paddingHorizontal: 16, paddingTop: 12 },
  billSectionTitle: { fontSize: 14, fontWeight: '700', color: '#212529', marginBottom: 12 },
  billRowHeader: { flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: '#e9ecef', marginBottom: 4 },
  billColHead: { fontSize: 11, fontWeight: '700', color: '#6c757d' },
  billRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 4, borderRadius: 6 },
  billRowEven: { backgroundColor: '#fff' },
  billRowOdd: { backgroundColor: '#f8f9fa' },
  billItemName: { fontSize: 13, color: '#212529', fontWeight: '500', flex: 1 },
  billItemVal: { fontSize: 12, color: '#495057' },
  billItemTotal: { fontSize: 13, color: '#212529', fontWeight: '700' },
  billEmpty: { textAlign: 'center', color: '#868e96', fontSize: 14, marginVertical: 20 },
  billDivider: { height: 1, backgroundColor: '#e9ecef', marginHorizontal: 16, marginTop: 8 },
  billTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  billTotalLabel: { fontSize: 14, fontWeight: '700', color: '#495057' },
  billTotalAmount: { fontSize: 24, fontWeight: '900', color: '#d80056' },
  billBtns: { flexDirection: 'row', gap: 10, padding: 16, paddingTop: 0 },
  billCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#dee2e6', alignItems: 'center' },
  billCancelBtnText: { color: '#495057', fontWeight: '600', fontSize: 14 },
  billPayBtn: { flex: 2, paddingVertical: 12, borderRadius: 10, backgroundColor: '#d80056', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  billPayBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // ── Oddiy xabar modali ───────────────────────────────────────────────────
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 12, minWidth: 250, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#120e1f', marginBottom: 10 },
  modalMessage: { fontSize: 14, color: '#495057', textAlign: 'center', marginBottom: 20 },
  modalButton: { backgroundColor: '#e91e63', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  // ── Dropdown ────────────────────────────────────────────────────────────
  dropdownOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdownMenu: { position: 'absolute', top: 50, right: 150, backgroundColor: '#fff', borderRadius: 8, elevation: 5, minWidth: 160 },
  dropdownItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
  dropdownItemText: { fontSize: 14, color: '#343a40', fontWeight: '500' },
});
