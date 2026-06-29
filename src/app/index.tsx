import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  useWindowDimensions,
  Platform,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { 
  QrCode, 
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
  Clock,
  History,
  Plus,
  Utensils,
  Lock,
  Unlock
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
];

// Mock Data (Translated to Uzbek)
const initialOrders = [
  { id: 5, table: "Stol 8", time: "17:43", amount: "156 000 UZS" },
  { id: 4, table: "Stol 10", time: "17:25", amount: "269 000 UZS" },
  { id: 3, table: "Stol 6", time: "17:14", amount: "177 000 UZS" },
  { id: 2, table: "Fotih D.", time: "16:52", amount: "645 000 UZS" },
  { id: 1, table: "Stol 2", time: "16:26", amount: "115 000 UZS" },
];

export const allTables: Record<string, any[]> = {
  "ZAL": [
    { id: 1, name: "Stol 1", status: "empty" },
    { id: 2, name: "Stol 2", status: "empty" },
    { id: 3, name: "Stol 3", status: "empty" },
    { id: 4, name: "Stol 4", status: "empty" },
    { id: 6, name: "Stol 6", status: "empty" },
    { id: 7, name: "Stol 7", status: "occupied", amount: "80 000 UZS", user: "Otabek", time: "19:00", people: 4 },
    { id: 8, name: "Stol 8", status: "occupied", amount: "40 000 UZS", user: "Otabek", time: "19:03" },
    { id: 9, name: "Stol 9", status: "special", amount: "95 000 UZS", user: "Otabek", time: "18:41", people: 2, hasCloud: true },
    { id: 10, name: "Stol 10", status: "occupied", amount: "80 000 UZS", user: "Otabek", time: "19:03" },
    { id: 11, name: "Stol 11", status: "empty" },
    { id: 12, name: "Stol 12", status: "empty" },
    { id: 14, name: "Stol 14", status: "empty" },
    { id: 141, name: "Stol 14", status: "reserved", subStatus: "Band qilingan", hasClock: true },
    { id: 15, name: "Stol 15", status: "occupied", amount: "90 000 UZS", user: "Otabek", time: "19:03", isLocked: true },
    { id: 16, name: "Stol 16", status: "empty" },
    { id: 17, name: "Stol 17", status: "empty" },
  ],
  "ZAL 2": [
    { id: 21, name: "Stol-2 1", status: "empty" },
    { id: 22, name: "Stol-2 2", status: "empty" },
    { id: 23, name: "Stol-2 3", status: "occupied", amount: "120 000 UZS", user: "Sardor", time: "18:30" },
    { id: 24, name: "Stol-2 4", status: "empty" },
    { id: 25, name: "Stol-2 5", status: "empty" },
    { id: 26, name: "Stol-2 6", status: "empty" },
  ]
};

export default function AdminPage() {
  const [activeCategory, setActiveCategory] = useState("BARCHA STOLLAR");
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [tablesData, setTablesData] = useState(allTables);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [restaurantName, setRestaurantName] = useState("MENULUX");
  const [restaurantNameInput, setRestaurantNameInput] = useState("MENULUX");
  
  // Checkout Modal states
  const [selectedTableForModal, setSelectedTableForModal] = useState<any>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<any>(null);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [addTableVisible, setAddTableVisible] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [newTableSeats, setNewTableSeats] = useState("");

  // Move Table Modal States
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [selectedSourceTable, setSelectedSourceTable] = useState<any>(null);
  const [selectedTargetTable, setSelectedTargetTable] = useState<any>(null);
  
  // New States
  const [currency, setCurrency] = useState("UZS");
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [accountId, setAccountId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Profile Edit States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [profileUsername, setProfileUsername] = useState("");
  const [profileRestaurantName, setProfileRestaurantName] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [profileConfirmPassword, setProfileConfirmPassword] = useState("");
  const [showProfilePassword, setShowProfilePassword] = useState(false);

  const { width } = useWindowDimensions();
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const savedAccId = await AsyncStorage.getItem('currentAccountId');
        if (!savedAccId) {
          router.replace('/login');
          return;
        }
        setAccountId(savedAccId);
        setAuthChecked(true);

        // Load current user details
        const storedUsers = await AsyncStorage.getItem('savedUsers');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        const user = users.find((u: any) => u.accountId === savedAccId);
        if (user) {
          setCurrentUser(user);
        }

        // Load restaurant name
        const savedName = await AsyncStorage.getItem(`savedRestaurantName_${savedAccId}`);
        if (savedName) {
          setRestaurantName(savedName);
          setRestaurantNameInput(savedName);
        }

        // Load currency
        const savedCurrency = await AsyncStorage.getItem(`savedCurrency_${savedAccId}`);
        if (savedCurrency) {
          setCurrency(savedCurrency);
        }

        // Load tables
        const storedTables = await AsyncStorage.getItem(`savedTables_${savedAccId}`);
        if (storedTables) {
          const parsedTables = JSON.parse(storedTables);
          setTablesData(parsedTables);
          for (const key in allTables) delete allTables[key];
          Object.assign(allTables, parsedTables);
        }

        // Load orders
        const storedOrders = await AsyncStorage.getItem(`savedOrders_${savedAccId}`);
        if (storedOrders) {
          const parsedOrders = JSON.parse(storedOrders);
          setOrdersList(parsedOrders);
        } else {
          await AsyncStorage.setItem(`savedOrders_${savedAccId}`, JSON.stringify([]));
          setOrdersList([]);
        }
      } catch (error) {
        console.error("Error syncing data:", error);
      }
    };

    checkAuthAndLoad();
    const interval = setInterval(checkAuthAndLoad, 1500);
    return () => clearInterval(interval);
  }, []);

  const openProfileEdit = () => {
    if (currentUser) {
      setProfileUsername(currentUser.username || "");
      setProfileRestaurantName(currentUser.restaurantName || "");
      setProfilePassword(currentUser.password || "");
      setProfileConfirmPassword(currentUser.password || "");
      setShowProfilePassword(false);
      setProfileModalVisible(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileUsername.trim() || !profileRestaurantName.trim() || !profilePassword) {
      Alert.alert("Xatolik", "Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    if (profileUsername.trim().length < 3) {
      Alert.alert("Xatolik", "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    if (profilePassword.length < 4) {
      Alert.alert("Xatolik", "Parol kamida 4 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    if (profilePassword !== profileConfirmPassword) {
      Alert.alert("Xatolik", "Parollar mos kelmadi. Iltimos qaytadan tekshirib kiring.");
      return;
    }

    try {
      const storedUsers = await AsyncStorage.getItem('savedUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const usernameExists = users.some(
        (u: any) => 
          u.username.toLowerCase() === profileUsername.trim().toLowerCase() && 
          u.accountId !== accountId
      );

      if (usernameExists) {
        Alert.alert("Xatolik", "Ushbu foydalanuvchi nomi band. Boshqa nom tanlang.");
        return;
      }

      const updatedUsers = users.map((u: any) => {
        if (u.accountId === accountId) {
          return {
            ...u,
            username: profileUsername.trim(),
            restaurantName: profileRestaurantName.trim(),
            password: profilePassword
          };
        }
        return u;
      });

      await AsyncStorage.setItem('savedUsers', JSON.stringify(updatedUsers));
      await AsyncStorage.setItem(`savedRestaurantName_${accountId}`, profileRestaurantName.trim());

      const updatedUser = updatedUsers.find((u: any) => u.accountId === accountId);
      setCurrentUser(updatedUser);
      setRestaurantName(profileRestaurantName.trim());
      setRestaurantNameInput(profileRestaurantName.trim());

      setProfileModalVisible(false);
      Alert.alert("Muvaffaqiyat", "Profil muvaffaqiyatli tahrirlandi!");
    } catch (err) {
      console.error("Error saving profile:", err);
      Alert.alert("Xatolik", "Profilni saqlashda xatolik yuz berdi.");
    }
  };

  const handleCheckoutOrder = async (orderId: number) => {
    try {
      if (!accountId) return;
      const orderToPay = ordersList.find(o => o.id === orderId);
      if (!orderToPay) return;

      const storedHistory = await AsyncStorage.getItem(`savedOrderHistory_${accountId}`);
      const currentHistory = storedHistory ? JSON.parse(storedHistory) : [];

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const currentDateStr = `${year}-${month}-${day}`;

      let itemsToSave = orderToPay.items || [];
      if (itemsToSave.length === 0) {
        const digits = orderToPay.amount.replace(/[^0-9]/g, '');
        const numericAmount = parseInt(digits, 10) || 0;
        
        itemsToSave = [
          { name: "Osh (Palov)", qty: Math.max(1, Math.floor(numericAmount / 45000)), price: 45000 }
        ];
        const currentSum = itemsToSave[0].qty * itemsToSave[0].price;
        if (numericAmount - currentSum >= 10000) {
          itemsToSave.push({
            name: "Non",
            qty: Math.max(1, Math.floor((numericAmount - currentSum) / 3000)),
            price: 3000
          });
        }
      }

      const completedOrder = {
        ...orderToPay,
        date: currentDateStr,
        items: itemsToSave
      };

      const updatedHistory = [completedOrder, ...currentHistory];
      await AsyncStorage.setItem(`savedOrderHistory_${accountId}`, JSON.stringify(updatedHistory));

      const updatedOrders = ordersList.filter(o => o.id !== orderId);
      await AsyncStorage.setItem(`savedOrders_${accountId}`, JSON.stringify(updatedOrders));
      setOrdersList(updatedOrders);

      const resetTables = { ...tablesData };
      let tableUpdated = false;
      for (const category in resetTables) {
        const idx = resetTables[category].findIndex((t: any) => t.name === orderToPay.table);
        if (idx !== -1) {
          resetTables[category][idx] = {
            ...resetTables[category][idx],
            status: 'empty',
            amount: undefined,
            user: undefined,
            time: undefined,
            people: undefined
          };
          tableUpdated = true;
        }
      }

      if (tableUpdated) {
        await AsyncStorage.setItem(`savedTables_${accountId}`, JSON.stringify(resetTables));
        setTablesData(resetTables);
        for (const key in allTables) delete allTables[key];
        Object.assign(allTables, resetTables);
      }

      setCheckoutModalVisible(false);
      setSelectedTableForModal(null);
      setSelectedOrderForModal(null);
      
      Alert.alert("To'lov qabul qilindi", `${orderToPay.table} uchun to'lov muvaffaqiyatli amalga oshirildi va buyurtma tarixga saqlandi.`);
    } catch (err) {
      console.error("Error checking out:", err);
      Alert.alert("Xatolik", "To'lovni amalga oshirishda muammo yuz berdi.");
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    Alert.alert(
      "Buyurtmani bekor qilish",
      "Haqiqatan ham ushbu buyurtmani bekor qilmoqchimisiz? (Tarixga yozilmaydi)",
      [
        { text: "Yo'q", style: "cancel" },
        {
          text: "Ha, bekor qilinsin",
          onPress: async () => {
            try {
              if (!accountId) return;
              const orderToCancel = ordersList.find(o => o.id === orderId);
              if (!orderToCancel) return;

              const updatedOrders = ordersList.filter(o => o.id !== orderId);
              await AsyncStorage.setItem(`savedOrders_${accountId}`, JSON.stringify(updatedOrders));
              setOrdersList(updatedOrders);

              const resetTables = { ...tablesData };
              let tableUpdated = false;
              for (const category in resetTables) {
                const idx = resetTables[category].findIndex((t: any) => t.name === orderToCancel.table);
                if (idx !== -1) {
                  resetTables[category][idx] = {
                    ...resetTables[category][idx],
                    status: 'empty',
                    amount: undefined,
                    user: undefined,
                    time: undefined,
                    people: undefined
                  };
                  tableUpdated = true;
                }
              }

              if (tableUpdated) {
                await AsyncStorage.setItem(`savedTables_${accountId}`, JSON.stringify(resetTables));
                setTablesData(resetTables);
                for (const key in allTables) delete allTables[key];
                Object.assign(allTables, resetTables);
              }

              setCheckoutModalVisible(false);
              setSelectedTableForModal(null);
              setSelectedOrderForModal(null);
              Alert.alert("Muvaffaqiyat", "Buyurtma bekor qilindi.");
            } catch (err) {
              console.error(err);
            }
          }
        }
      ]
    );
  };

  const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setModalVisible(true);
  };

  const formatPrice = (amount: number) => {
    return amount.toLocaleString('uz-UZ') + " " + currency;
  };

  const formatAmountString = (amountStr: string | undefined) => {
    if (!amountStr) return "";
    return amountStr.replace("UZS", currency).replace("USD", currency).replace("EUR", currency);
  };

  const totalOrdersAmount = React.useMemo(() => {
    let total = 0;
    ordersList.forEach(o => {
      const digits = o.amount.replace(/[^0-9]/g, '');
      const val = parseInt(digits, 10);
      if (!isNaN(val)) {
        total += val;
      }
    });
    return total;
  }, [ordersList]);

  const handleSaveRestaurantName = async () => {
    if (!restaurantNameInput.trim() || !accountId) {
      Alert.alert("Xatolik", "Restoran nomi bo'sh bo'lishi mumkin emas.");
      return;
    }
    try {
      await AsyncStorage.setItem(`savedRestaurantName_${accountId}`, restaurantNameInput.trim());
      setRestaurantName(restaurantNameInput.trim());

      const storedUsers = await AsyncStorage.getItem('savedUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const updatedUsers = users.map((u: any) => {
        if (u.accountId === accountId) {
          return { ...u, restaurantName: restaurantNameInput.trim() };
        }
        return u;
      });
      await AsyncStorage.setItem('savedUsers', JSON.stringify(updatedUsers));
      
      const updatedUser = updatedUsers.find((u: any) => u.accountId === accountId);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }

      Alert.alert("Muvaffaqiyat", "Restoran nomi saqlandi!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCurrency = async (cur: string) => {
    if (!accountId) return;
    try {
      await AsyncStorage.setItem(`savedCurrency_${accountId}`, cur);
      setCurrency(cur);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setSettingsVisible(false);
    Alert.alert(
      "Tizimdan chiqish",
      "Haqiqatan ham POS tizimidan chiqmoqchimisiz?",
      [
        { text: "Yo'q", style: "cancel" },
        { 
          text: "Ha, chiqilsin", 
          onPress: () => {
            setIsLoggedOut(true);
          }
        }
      ]
    );
  };

  const handleKeypadPress = (key: string) => {
    setPinError(false);
    if (key === 'C') {
      setPinInput("");
    } else if (key === '⌫') {
      setPinInput(prev => prev.slice(0, -1));
    } else {
      if (pinInput.length < 4) {
        const newVal = pinInput + key;
        setPinInput(newVal);
        if (newVal.length === 4) {
          if (newVal === '1234') {
            setIsLoggedOut(false);
            setPinInput("");
          } else {
            setPinError(true);
            setTimeout(() => {
              setPinInput("");
              setPinError(false);
            }, 1000);
          }
        }
      }
    }
  };

  const handleClearAllTables = async () => {
    Alert.alert(
      "Stollarni bo'shatish",
      "Barcha stollar holatini 'Bo'sh' holatga keltirishni xohlaysizmi?",
      [
        { text: "Yo'q", style: "cancel" },
        {
          text: "Ha, bo'shatilsin",
          onPress: async () => {
            try {
              if (!accountId) return;
              const resetTables = { ...tablesData };
              for (const category in resetTables) {
                resetTables[category] = resetTables[category].map((t: any) => ({
                  ...t,
                  status: 'empty',
                  amount: undefined,
                  user: undefined,
                  time: undefined,
                  people: undefined
                }));
              }
              await AsyncStorage.setItem(`savedTables_${accountId}`, JSON.stringify(resetTables));
              await AsyncStorage.setItem(`savedOrders_${accountId}`, JSON.stringify([]));
              setTablesData(resetTables);
              setOrdersList([]);
              for (const key in allTables) delete allTables[key];
              Object.assign(allTables, resetTables);
              setSettingsVisible(false);
              Alert.alert("Muvaffaqiyat", "Barcha stollar bo'shatildi va buyurtmalar tozalandi!");
            } catch (err) {
              console.error(err);
            }
          }
        }
      ]
    );
  };

  const handleResetAllData = () => {
    Alert.alert(
      "Tizimni tozalash",
      "Barcha stollar, buyurtmalar va menyu ma'lumotlarini o'chirib, dastlabki holatga qaytarishni xohlaysizmi?",
      [
        { text: "Yo'q", style: "cancel" },
        { 
          text: "Ha, tozalansin", 
          onPress: async () => {
            try {
              if (!accountId) return;
              
              const initialTables: Record<string, any[]> = {
                "ZAL": Array.from({ length: 10 }, (_, i) => ({
                  id: `${accountId}_t${i + 1}`,
                  name: `Stol ${i + 1}`,
                  status: "empty"
                }))
              };
              
              await AsyncStorage.setItem(`savedTables_${accountId}`, JSON.stringify(initialTables));
              await AsyncStorage.setItem(`savedOrders_${accountId}`, JSON.stringify([]));
              await AsyncStorage.setItem(`savedOrderHistory_${accountId}`, JSON.stringify([]));
              await AsyncStorage.setItem(`savedMenuItems_${accountId}`, JSON.stringify(DEFAULT_MENU_ITEMS));
              
              setTablesData(initialTables);
              for (const key in allTables) delete allTables[key];
              Object.assign(allTables, initialTables);
              setOrdersList([]);
              setSettingsVisible(false);
              
              Alert.alert("Muvaffaqiyat", "Hisob ma'lumotlari tozalab boshlang'ich holatga qaytarildi!");
            } catch (error) {
              console.error(error);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleAccountLogout = async () => {
    Alert.alert(
      "Hisobdan chiqish",
      "Haqiqatan ham hisobdan chiqib, kirish sahifasiga qaytmoqchimisiz?",
      [
        { text: "Yo'q", style: "cancel" },
        {
          text: "Ha, chiqilsin",
          onPress: async () => {
            try {
              setSettingsVisible(false);
              await AsyncStorage.removeItem('currentAccountId');
              router.replace('/login');
            } catch (err) {
              console.error(err);
            }
          }
        }
      ]
    );
  };

  const handleMoveTable = async (source: any, target: any) => {
    if (!source || !target) {
      Alert.alert("Xatolik", "Iltimos, manba va mo'ljal stollarni tanlang.");
      return;
    }
    
    try {
      if (!accountId) return;
      
      // 1. Move active orders in ordersList
      const updatedOrders = ordersList.map(o => {
        if (o.table === source.name) {
          return { ...o, table: target.name };
        }
        return o;
      });

      // 2. Update tablesData
      const updatedTables = { ...tablesData };
      let sourceCategory = '';
      let sourceIdx = -1;
      let targetCategory = '';
      let targetIdx = -1;

      // Find source and target in categories
      for (const cat in updatedTables) {
        const sIdx = updatedTables[cat].findIndex(t => t.id === source.id);
        if (sIdx !== -1) {
          sourceCategory = cat;
          sourceIdx = sIdx;
        }
        const tIdx = updatedTables[cat].findIndex(t => t.id === target.id);
        if (tIdx !== -1) {
          targetCategory = cat;
          targetIdx = tIdx;
        }
      }

      if (sourceIdx !== -1 && targetIdx !== -1) {
        const sourceTable = updatedTables[sourceCategory][sourceIdx];
        const targetTable = updatedTables[targetCategory][targetIdx];

        // Transfer source properties to target
        updatedTables[targetCategory][targetIdx] = {
          ...targetTable,
          status: sourceTable.status,
          subStatus: sourceTable.subStatus,
          hasClock: sourceTable.hasClock,
          amount: sourceTable.amount,
          user: sourceTable.user,
          time: sourceTable.time,
          people: sourceTable.people,
          isLocked: sourceTable.isLocked
        };

        // Reset source table
        updatedTables[sourceCategory][sourceIdx] = {
          ...sourceTable,
          status: 'empty',
          subStatus: undefined,
          hasClock: undefined,
          amount: undefined,
          user: undefined,
          time: undefined,
          people: undefined,
          isLocked: undefined
        };
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem(`savedOrders_${accountId}`, JSON.stringify(updatedOrders));
      await AsyncStorage.setItem(`savedTables_${accountId}`, JSON.stringify(updatedTables));

      // Update React State
      setOrdersList(updatedOrders);
      setTablesData(updatedTables);
      
      // Update global allTables
      for (const key in allTables) delete allTables[key];
      Object.assign(allTables, updatedTables);

      // Reset selection and close modal
      setSelectedSourceTable(null);
      setSelectedTargetTable(null);
      setMoveModalVisible(false);

      Alert.alert(
        "Muvaffaqiyat", 
        `Buyurtma "${source.name}"dan "${target.name}"ga muvaffaqiyatli ko'chirildi!`
      );
    } catch (err) {
      console.error("Error moving table:", err);
      Alert.alert("Xatolik", "Stolni ko'chirishda xatolik yuz berdi.");
    }
  };

  const displayedTables = React.useMemo(() => {
    if (activeCategory === 'BARCHA STOLLAR') {
      return Object.values(tablesData).flat();
    }
    if (activeCategory === 'BAND STOLLAR') {
      return Object.values(tablesData).flat().filter(t => t.status !== 'empty');
    }
    if (activeCategory === 'BO\'SH STOLLAR') {
      return Object.values(tablesData).flat().filter(t => t.status === 'empty');
    }
    return tablesData[activeCategory] || [];
  }, [activeCategory, tablesData]);

  // Determine number of columns for grid
  const sidebarWidth = 55;
  const ordersPanelWidth = 200;
  const catsPanelWidth = 90;
  
  const mainWidth = width - sidebarWidth - ordersPanelWidth - catsPanelWidth; 
  const colCount = Math.max(2, Math.floor(mainWidth / 140));

  if (!authChecked) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0e081b', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  if (isLoggedOut) {
    return (
      <LinearGradient 
        colors={['#1e1333', '#0e081b']} 
        style={styles.lockScreenContainer}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.lockScreenContent}>
          {/* Time & Date */}
          <Text style={styles.lockTime}>
            {new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.lockDate}>
            {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>

          {/* User Profile */}
          <View style={styles.lockUserContainer}>
            <View style={styles.lockAvatar}>
              <User size={40} color="#e91e63" />
            </View>
            <Text style={styles.lockUserName}>{currentUser?.username || "Otabek A."}</Text>
            <Text style={styles.lockUserRole}>Kassir (Admin)</Text>
          </View>

          {/* PIN Indicators */}
          <View style={styles.pinDotsRow}>
            {[1, 2, 3, 4].map((dotIndex) => (
              <View 
                key={dotIndex} 
                style={[
                  styles.pinDot,
                  pinInput.length >= dotIndex && styles.pinDotFilled,
                  pinError && styles.pinDotError
                ]} 
              />
            ))}
          </View>
          {pinError && <Text style={styles.pinErrorText}>Noto'g'ri PIN! (PIN: 1234)</Text>}
          {!pinError && <Text style={styles.pinHintText}>Kirish uchun PIN-kodni kiriting (PIN: 1234)</Text>}

          {/* Keypad */}
          <View style={styles.keypadGrid}>
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
              ['C', '0', '⌫']
            ].map((row, rowIndex) => (
              <View key={rowIndex} style={styles.keypadRow}>
                {row.map((key) => {
                  const isSpecial = key === 'C' || key === '⌫';
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.keypadBtn,
                        isSpecial && styles.keypadBtnSpecial
                      ]}
                      onPress={() => handleKeypadPress(key)}
                    >
                      <Text style={styles.keypadBtnText}>{key}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    );
  }

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
            <Text style={styles.logoText}>{restaurantName} <Text style={styles.logoTextLight}>Pos</Text></Text>
          </TouchableOpacity>

        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setMenuVisible(true)}>
            <MoreHorizontal size={18} color="#fff" />
          </TouchableOpacity>

          {width > 600 && (
            <TouchableOpacity style={styles.userProfile} onPress={openProfileEdit}>
              <User size={20} color="#fff" />
              <View>
                <Text style={styles.userName}>{currentUser?.username || "Otabek A."}</Text>
                <Text style={styles.userAction}>TAHRIRLASH</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        
        {/* Left Toolbar */}
        <View style={styles.toolbar}>
          {[
            { icon: QrCode, text: 'QR-kod', action: () => router.push('/barcodes') },
            { icon: History, text: 'Tarix', action: () => router.push('/history') },
            { icon: Utensils, text: 'Menyu', action: () => router.push('/admin-menu') },
            { icon: FileText, text: 'Eslatmalar', action: () => router.push('/orders') }
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.toolbarBtn} onPress={item.action}>
              <item.icon color="#fff" size={20} />
              <Text style={styles.toolbarBtnText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Orders Panel */}
        <View style={styles.ordersPanel}>
          <View style={styles.ordersHeader}>
            <Text style={styles.ordersHeaderText}>{ordersList.length} BUYURTMA</Text>
          </View>
          <ScrollView style={styles.ordersList}>
            {ordersList.map((o) => (
              <TouchableOpacity key={o.id} style={styles.orderItem} onPress={() => {
                setSelectedOrderForModal(o);
                const matchingTable = Object.values(tablesData).flat().find(t => t.name === o.table);
                setSelectedTableForModal(matchingTable || null);
                setCheckoutModalVisible(true);
              }}>
                <View style={styles.orderBadge}>
                  <Text style={styles.orderBadgeText}>{o.id}</Text>
                </View>
                <View style={styles.orderDetails}>
                  <Text style={styles.orderTable} numberOfLines={1}>{o.table}</Text>
                  <Text style={styles.orderTime}>{o.time}</Text>
                  <Text style={styles.orderAmount} numberOfLines={1}>{formatAmountString(o.amount)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.ordersFooter}>
            <Text style={styles.ordersFooterLabel}>JAMI</Text>
            <Text style={styles.ordersFooterPrice}>{formatPrice(totalOrdersAmount)}</Text>
          </View>
        </View>

        {/* Center Tables Grid */}
        <View style={styles.tablesPanel}>
          <View style={[styles.tablesHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={styles.tablesHeaderBread}><Text style={styles.tablesHeaderActive}>{activeCategory === 'BARCHA STOLLAR' ? 'Asosiy Zal' : activeCategory}</Text></Text>
            {activeCategory === 'BARCHA STOLLAR' && (
              <TouchableOpacity style={[styles.newTableBtn, { backgroundColor: '#e91e63' }]} onPress={() => setAddTableVisible(true)}>
                <Plus size={16} color="#fff" />
                <Text style={styles.newTableBtnText}>Yangi stol</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView contentContainerStyle={styles.tablesGrid}>
            {displayedTables.map((t, idx) => {
              const hasActiveOrder = ordersList.some(o => o.table === t.name);
              const effectiveStatus = (t.status === 'occupied' || t.status === 'special' || t.status === 'reserved') && !hasActiveOrder ? 'empty' : t.status;

              const bgColors = effectiveStatus === 'occupied' ? ['#ff4081', '#c2185b'] 
                         : effectiveStatus === 'reserved' ? ['#e6b12a', '#d4a324']
                         : effectiveStatus === 'special' ? ['#5c6bc0', '#3f51b5']
                         : ['#ffffff', '#ffffff'];
              
              const textColor = effectiveStatus === 'empty' ? '#666' : '#fff';

              return (
                <View key={idx} style={styles.tableCardContainer}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                    if (hasActiveOrder) {
                      const matchingOrder = ordersList.find(o => o.table === t.name);
                      if (matchingOrder) {
                        setSelectedOrderForModal(matchingOrder);
                        setSelectedTableForModal(t);
                        setCheckoutModalVisible(true);
                      } else {
                        const tempOrder = {
                          id: Math.floor(1000 + Math.random() * 9000),
                          table: t.name,
                          time: t.time || "12:00",
                          amount: t.amount || "0 UZS",
                          items: []
                        };
                        setSelectedOrderForModal(tempOrder);
                        setSelectedTableForModal(t);
                        setCheckoutModalVisible(true);
                      }
                    } else {
                      showModal("Stol", `${t.name} tanlandi. Holati: ${effectiveStatus === 'empty' ? 'Bo\'sh' : effectiveStatus === 'reserved' ? 'Band' : effectiveStatus}`);
                    }
                  }}>
                    <LinearGradient 
                      colors={bgColors as [string, string]}
                      style={styles.tableCard}
                    >
                    <Text style={[styles.tableName, { color: textColor }]}>{t.name}</Text>
                    
                    {effectiveStatus === 'empty' ? (
                      <Text style={[styles.tableStatus, { color: '#aaa' }]}>Bo'sh</Text>
                    ) : effectiveStatus === 'reserved' ? (
                      <>
                        <Text style={[styles.tableStatus, { color: textColor }]}>{t.subStatus}</Text>
                        {t.hasClock && <Clock size={24} color={textColor} style={{opacity: 0.8, marginTop: 5}}/>}
                      </>
                    ) : (
                      <>
                        <Text style={[styles.tableAmount, { color: textColor }]}>{formatAmountString(t.amount)}</Text>
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
          {['BARCHA STOLLAR', 'BAND STOLLAR', 'BO\'SH STOLLAR'].map(cat => (
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

      {/* Checkout and Detailed Order Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={checkoutModalVisible}
        onRequestClose={() => {
          setCheckoutModalVisible(false);
          setSelectedOrderForModal(null);
          setSelectedTableForModal(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: '90%', maxWidth: 450, padding: 24, borderRadius: 20 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 16 }}>
              <Text style={[styles.modalTitle, { marginBottom: 0, fontSize: 18 }]}>
                {selectedOrderForModal?.table} &gt; #{selectedOrderForModal?.id}
              </Text>
              <TouchableOpacity onPress={() => {
                setCheckoutModalVisible(false);
                setSelectedOrderForModal(null);
                setSelectedTableForModal(null);
              }}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={{ width: '100%', marginBottom: 16, backgroundColor: '#f8f9fa', padding: 12, borderRadius: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 12, color: '#6c757d' }}>Buyurtma vaqti:</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#333' }}>{selectedOrderForModal?.time}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, color: '#6c757d' }}>Mijoz:</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#333' }}>
                  {selectedTableForModal?.user || "Mijoz (QR)"}
                </Text>
              </View>
            </View>

            <Text style={{ alignSelf: 'flex-start', fontSize: 13, fontWeight: 'bold', color: '#4b5563', marginBottom: 8, textTransform: 'uppercase' }}>
              Buyurtma Tarkibi
            </Text>

            <ScrollView style={{ width: '100%', maxHeight: 200, marginBottom: 16 }}>
              {selectedOrderForModal?.items && selectedOrderForModal.items.length > 0 ? (
                selectedOrderForModal.items.map((item: any, idx: number) => (
                  <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f3f5' }}>
                    <Text style={{ fontSize: 14, color: '#212529', fontWeight: '500' }}>
                      {item.qty}x {item.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6c757d', fontWeight: '600' }}>
                      {formatAmountString(typeof item.price === 'number' ? (item.price * item.qty).toLocaleString('uz-UZ') + " UZS" : item.price)}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                  <Text style={{ color: '#868e96', fontSize: 13, fontStyle: 'italic' }}>
                    Taomlar ro'yxati mavjud emas (Kassir buyurtmasi)
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={{ width: '100%', height: 1, backgroundColor: '#e5e7eb', marginBottom: 16 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 24, alignItems: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#333' }}>JAMI SUMMA:</Text>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#e91e63' }}>
                {formatAmountString(selectedOrderForModal?.amount)}
              </Text>
            </View>

            <View style={{ flexDirection: 'column', gap: 10, width: '100%' }}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#10b981', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 44, borderRadius: 12 }]} 
                onPress={() => handleCheckoutOrder(selectedOrderForModal.id)}
              >
                <Text style={[styles.modalButtonText, { fontSize: 14 }]}>💳 To'lovni Qabul Qilish (Checkout)</Text>
              </TouchableOpacity>
              
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity 
                  style={[styles.modalButton, { flex: 1, backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fee2e2', height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }]} 
                  onPress={() => handleCancelOrder(selectedOrderForModal.id)}
                >
                  <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 13 }}>❌ Bekor qilish</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalButton, { flex: 1, backgroundColor: '#adb5bd', height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }]} 
                  onPress={() => {
                    setCheckoutModalVisible(false);
                    setSelectedOrderForModal(null);
                    setSelectedTableForModal(null);
                  }}
                >
                  <Text style={[styles.modalButtonText, { fontSize: 13 }]}>Yopish</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Modal for Alerts */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalMessage}>{modalContent.message}</Text>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Yopish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Edit Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.settingsModalContent}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <User size={22} color="#e91e63" />
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#120e1f' }}>Profil Sozlamalari</Text>
              </View>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Restaurant Name */}
            <View style={styles.settingsRow}>
              <Text style={styles.settingsLabel}>Restoran Nomi</Text>
              <View style={[styles.inputContainer, { backgroundColor: '#f9fafb', borderColor: '#dee2e6', borderWidth: 1 }]}>
                <Utensils size={18} color="#6b7280" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  value={profileRestaurantName}
                  onChangeText={setProfileRestaurantName}
                  placeholder="Restoran nomi"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Username */}
            <View style={styles.settingsRow}>
              <Text style={styles.settingsLabel}>Foydalanuvchi nomi (Login)</Text>
              <View style={[styles.inputContainer, { backgroundColor: '#f9fafb', borderColor: '#dee2e6', borderWidth: 1 }]}>
                <User size={18} color="#6b7280" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  value={profileUsername}
                  onChangeText={setProfileUsername}
                  placeholder="Foydalanuvchi nomi"
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.settingsRow}>
              <Text style={styles.settingsLabel}>Yangi Parol</Text>
              <View style={[styles.inputContainer, { backgroundColor: '#f9fafb', borderColor: '#dee2e6', borderWidth: 1 }]}>
                <Lock size={18} color="#6b7280" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  value={profilePassword}
                  onChangeText={setProfilePassword}
                  placeholder="Parol"
                  secureTextEntry={!showProfilePassword}
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity onPress={() => setShowProfilePassword(!showProfilePassword)} style={{ padding: 4 }}>
                  <Text style={{ fontSize: 12, color: '#e91e63', fontWeight: 'bold' }}>
                    {showProfilePassword ? "Yashirish" : "Ko'rsatish"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.settingsRow}>
              <Text style={styles.settingsLabel}>Parolni Tasdiqlang</Text>
              <View style={[styles.inputContainer, { backgroundColor: '#f9fafb', borderColor: '#dee2e6', borderWidth: 1 }]}>
                <Lock size={18} color="#6b7280" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  value={profileConfirmPassword}
                  onChangeText={setProfileConfirmPassword}
                  placeholder="Parolni tasdiqlash"
                  secureTextEntry={!showProfilePassword}
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <TouchableOpacity 
                style={[styles.modalButton, { flex: 1, backgroundColor: '#adb5bd', height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }]} 
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Bekor qilish</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ flex: 1, height: 44, borderRadius: 10, overflow: 'hidden' }}
                onPress={handleSaveProfile}
              >
                <LinearGradient
                  colors={['#d80056', '#7d1f5e']}
                  start={[0, 0]} end={[1, 0]}
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text style={styles.modalButtonText}>Saqlash</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Table Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={addTableVisible}
        onRequestClose={() => setAddTableVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yangi stol qo'shish</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Stol nomi"
              value={newTableName}
              onChangeText={setNewTableName}
            />
            <TextInput
              style={[styles.textInput, { marginTop: 10 }]}
              placeholder="Stol soni (odam sig'imi)"
              value={newTableSeats}
              onChangeText={setNewTableSeats}
              keyboardType="numeric"
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#adb5bd' }]} 
                onPress={() => setAddTableVisible(false)}
              >
                <Text style={styles.modalButtonText}>Bekor qilish</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => {
                  if (newTableName.trim()) {
                    const newTable = { 
                      id: Date.now(), 
                      name: newTableName, 
                      status: "empty",
                      people: newTableSeats ? parseInt(newTableSeats) : undefined,
                      barcode: Math.floor(100000000000 + Math.random() * 900000000000).toString()
                    };
                    
                    // Mutate global object so barcodes page can see the new table
                    if (!allTables["ZAL"]) allTables["ZAL"] = [];
                    allTables["ZAL"].push(newTable);

                    setTablesData(prev => {
                      const newData = {
                        ...prev,
                        "ZAL": [
                          ...(prev["ZAL"] || []),
                          newTable
                        ]
                      };
                      if (accountId) {
                        AsyncStorage.setItem(`savedTables_${accountId}`, JSON.stringify(newData)).catch(err => console.error(err));
                      }
                      return newData;
                    });
                    setNewTableName("");
                    setNewTableSeats("");
                    setAddTableVisible(false);
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Qo'shish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Dropdown Menu Modal */}
      <Modal visible={menuVisible} transparent={true} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={styles.dropdownMenu}>
             <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuVisible(false); setSettingsVisible(true); }}>
              <Text style={styles.dropdownItemText}>⚙️ Sozlamalar</Text>
             </TouchableOpacity>
             <TouchableOpacity style={[styles.dropdownItem, { borderBottomWidth: 0 }]} onPress={() => { 
               setMenuVisible(false); 
               setOrdersList([]); 
               if (accountId) {
                 AsyncStorage.setItem(`savedOrders_${accountId}`, JSON.stringify([])).catch(err => console.error(err));
               }
               showModal("Muvaffaqiyat", "Barcha buyurtmalar bekor qilindi."); 
             }}>
               <Text style={styles.dropdownItemText}>❌ Buyurtmalarni o'chirish</Text>
             </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* System Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.settingsModalContent}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#120e1f' }}>⚙️ Tizim Sozlamalari</Text>
              <TouchableOpacity onPress={() => setSettingsVisible(false)}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Restaurant Name Setting */}
            <View style={styles.settingsRow}>
              <Text style={styles.settingsLabel}>Restoran nomi</Text>
              <View style={styles.settingsInputRow}>
                <TextInput
                  style={styles.settingsInput}
                  value={restaurantNameInput}
                  onChangeText={setRestaurantNameInput}
                  placeholder="Restoran nomi"
                />
                <TouchableOpacity style={styles.settingsSaveBtn} onPress={handleSaveRestaurantName}>
                  <Text style={styles.settingsSaveText}>Saqlash</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Currency Selector Setting */}
            <View style={[styles.settingsRow, { marginTop: 12 }]}>
              <Text style={styles.settingsLabel}>Valyuta belgisi</Text>
              <View style={styles.currencySelector}>
                {['UZS', 'USD', 'EUR'].map(cur => (
                  <TouchableOpacity
                    key={cur}
                    style={[
                      styles.currencySelectorBtn,
                      currency === cur && styles.currencySelectorBtnActive
                    ]}
                    onPress={() => handleSaveCurrency(cur)}
                  >
                    <Text
                      style={[
                        styles.currencySelectorText,
                        currency === cur && styles.currencySelectorTextActive
                      ]}
                    >
                      {cur === 'USD' ? 'USD ($)' : cur === 'EUR' ? 'EUR (€)' : 'UZS (so\'m)'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: '#e5e7eb', marginVertical: 15 }} />

            {/* Quick Actions */}
            <Text style={[styles.settingsLabel, { marginBottom: 10 }]}>Tezkor amallar</Text>
            
            <TouchableOpacity 
              style={[styles.settingsActionBtn, styles.clearTablesBtn]} 
              onPress={handleClearAllTables}
            >
              <Text style={styles.clearTablesText}>🧹 Barcha stollarni bo'shatish</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingsActionBtn, styles.resetDataBtn]} 
              onPress={handleResetAllData}
            >
              <Text style={styles.resetDataText}>🚨 Tizim ma'lumotlarini tozalash</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingsActionBtn, styles.logoutBtn]} 
              onPress={handleAccountLogout}
            >
              <Text style={styles.logoutBtnText}>🚪 Hisobdan chiqish (Log Out)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, { marginTop: 24, width: '100%', alignItems: 'center' }]} 
              onPress={() => setSettingsVisible(false)}
            >
              <Text style={styles.modalButtonText}>Yopish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Move Table Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={moveModalVisible}
        onRequestClose={() => {
          setMoveModalVisible(false);
          setSelectedSourceTable(null);
          setSelectedTargetTable(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.moveTableModalContent}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#120e1f' }}>🔄 Stolni ko'chirish</Text>
              <TouchableOpacity onPress={() => {
                setMoveModalVisible(false);
                setSelectedSourceTable(null);
                setSelectedTargetTable(null);
              }}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Selection Status indicator */}
            <View style={styles.moveFlowContainer}>
              <View style={[styles.moveFlowCard, selectedSourceTable && styles.moveFlowCardActive]}>
                <Text style={styles.moveFlowLabel}>Manba stol</Text>
                <Text style={styles.moveFlowValue}>
                  {selectedSourceTable ? selectedSourceTable.name : "Tanlanmagan"}
                </Text>
                {selectedSourceTable && (
                  <Text style={styles.moveFlowSubValue}>
                    {formatAmountString(selectedSourceTable.amount || ordersList.find(o => o.table === selectedSourceTable.name)?.amount || "0 UZS")}
                  </Text>
                )}
              </View>

              <View style={styles.moveFlowArrow}>
                <MoveRight size={24} color="#e91e63" />
              </View>

              <View style={[styles.moveFlowCard, selectedTargetTable && styles.moveFlowCardActive]}>
                <Text style={styles.moveFlowLabel}>Mo'ljal stol</Text>
                <Text style={styles.moveFlowValue}>
                  {selectedTargetTable ? selectedTargetTable.name : "Tanlanmagan"}
                </Text>
                {selectedTargetTable && (
                  <Text style={styles.moveFlowSubValue}>Bo'sh</Text>
                )}
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 16, height: 260 }}>
              {/* Left Column: Occupied Tables */}
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>1. Band stol (Manba)</Text>
                <ScrollView style={styles.moveTableScroll} nestedScrollEnabled={true}>
                  {Object.values(tablesData).flat().filter(t => {
                    const hasActiveOrder = ordersList.some(o => o.table === t.name);
                    return t.status === 'occupied' || t.status === 'special' || t.status === 'reserved' || hasActiveOrder;
                  }).length > 0 ? (
                    Object.values(tablesData).flat().filter(t => {
                      const hasActiveOrder = ordersList.some(o => o.table === t.name);
                      return t.status === 'occupied' || t.status === 'special' || t.status === 'reserved' || hasActiveOrder;
                    }).map(t => {
                      const isSelected = selectedSourceTable?.id === t.id;
                      return (
                        <TouchableOpacity
                          key={t.id}
                          style={[
                            styles.moveTableSelectorItem,
                            isSelected && styles.moveTableSelectorItemActive
                          ]}
                          onPress={() => setSelectedSourceTable(t)}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.moveTableSelectorText, isSelected && styles.moveTableSelectorTextActive]}>
                              {t.name}
                            </Text>
                            <Text style={[styles.moveTableSelectorSubtext, isSelected && styles.moveTableSelectorTextActive]}>
                              {formatAmountString(t.amount || ordersList.find(o => o.table === t.name)?.amount || "0 UZS")}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <Text style={styles.emptyText}>Band stollar mavjud emas.</Text>
                  )}
                </ScrollView>
              </View>

              {/* Right Column: Empty Tables */}
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>2. Bo'sh stol (Mo'ljal)</Text>
                <ScrollView style={styles.moveTableScroll} nestedScrollEnabled={true}>
                  {Object.values(tablesData).flat().filter(t => {
                    const hasActiveOrder = ordersList.some(o => o.table === t.name);
                    return t.status === 'empty' && !hasActiveOrder;
                  }).length > 0 ? (
                    Object.values(tablesData).flat().filter(t => {
                      const hasActiveOrder = ordersList.some(o => o.table === t.name);
                      return t.status === 'empty' && !hasActiveOrder;
                    }).map(t => {
                      const isSelected = selectedTargetTable?.id === t.id;
                      return (
                        <TouchableOpacity
                          key={t.id}
                          style={[
                            styles.moveTableSelectorItem,
                            isSelected && styles.moveTableSelectorItemActive
                          ]}
                          onPress={() => setSelectedTargetTable(t)}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.moveTableSelectorText, isSelected && styles.moveTableSelectorTextActive]}>
                              {t.name}
                            </Text>
                            <Text style={[styles.moveTableSelectorSubtext, isSelected && styles.moveTableSelectorTextActive]}>
                              Bo'sh
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <Text style={styles.emptyText}>Bo'sh stollar mavjud emas.</Text>
                  )}
                </ScrollView>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' }}>
              <TouchableOpacity 
                style={[styles.modalButton, { flex: 1, backgroundColor: '#adb5bd', alignItems: 'center' }]} 
                onPress={() => {
                  setMoveModalVisible(false);
                  setSelectedSourceTable(null);
                  setSelectedTargetTable(null);
                }}
              >
                <Text style={styles.modalButtonText}>Yopish</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  { 
                    flex: 1, 
                    backgroundColor: (selectedSourceTable && selectedTargetTable) ? '#e91e63' : '#adb5bd',
                    alignItems: 'center' 
                  }
                ]} 
                disabled={!selectedSourceTable || !selectedTargetTable}
                onPress={() => handleMoveTable(selectedSourceTable, selectedTargetTable)}
              >
                <Text style={styles.modalButtonText}>Ko'chirish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoText: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
  logoTextLight: { fontWeight: '300' },
  headerActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  masalarText: { color: '#fff', fontWeight: '600', fontSize: 11, letterSpacing: 0.5 },
  bellBtn: { backgroundColor: '#e91e63', padding: 5, borderRadius: 15, marginLeft: 8 },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 3, minWidth: 14, alignItems: 'center' },
  badgeText: { color: '#e91e63', fontSize: 9, fontWeight: '800' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  newTableBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  newTableBtnText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  iconBtn: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 5, borderRadius: 15 },
  statusItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusLabel: { color: '#eee', fontSize: 8 },
  statusValue: { color: '#a5d6a7', fontWeight: '700', fontSize: 10 },
  userProfile: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  userAction: { color: '#ddd', fontSize: 8, textAlign: 'right' },
  mainContent: { flex: 1, flexDirection: 'row' },
  toolbar: { width: 55, backgroundColor: '#1a112d', alignItems: 'center', paddingTop: 10 },
  toolbarBtn: { alignItems: 'center', justifyContent: 'center', width: 45, height: 45, marginBottom: 6, borderRadius: 8 },
  toolbarBtnText: { color: '#fff', fontSize: 7, marginTop: 2, textAlign: 'center' },
  ordersPanel: { width: 200, backgroundColor: '#f1f3f5', borderRightWidth: 1, borderRightColor: '#dee2e6' },
  ordersHeader: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#dee2e6' },
  ordersHeaderText: { color: '#e91e63', fontWeight: '700', fontSize: 10, textTransform: 'uppercase' },
  ordersList: { flex: 1 },
  orderItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  orderBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#e91e63', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  orderBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  orderDetails: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTable: { color: '#495057', fontWeight: '600', fontSize: 10, width: 40 },
  orderTime: { color: '#868e96', fontSize: 9 },
  orderAmount: { color: '#212529', fontWeight: '700', fontSize: 10, textAlign: 'right' },
  ordersFooter: { padding: 12, borderTopWidth: 1, borderTopColor: '#dee2e6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' },
  ordersFooterLabel: { color: '#212529', fontWeight: '700', fontSize: 11 },
  ordersFooterPrice: { color: '#212529', fontWeight: '800', fontSize: 14 },
  tablesPanel: { flex: 1, backgroundColor: '#e9ecef' },
  tablesHeader: { paddingVertical: 10, paddingHorizontal: 15 },
  tablesHeaderBread: { color: '#868e96', fontSize: 10, fontWeight: '500' },
  tablesHeaderActive: { color: '#212529', fontWeight: '700' },
  tablesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 },
  tableCardContainer: { width: '12.5%', padding: 4, minHeight: 85 },
  tableCard: { flex: 1, borderRadius: 8, padding: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#dee2e6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  tableName: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  tableStatus: { fontSize: 9, opacity: 0.7 },
  tableAmount: { fontSize: 11, fontWeight: '800', marginTop: 2 },
  tableFooterInfo: { position: 'absolute', bottom: 4, left: 4, right: 4, flexDirection: 'row', justifyContent: 'space-between' },
  tableFooterText: { fontSize: 8, opacity: 0.9 },
  tableIconTop: { position: 'absolute', top: 4, right: 4, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 3, paddingVertical: 1, borderRadius: 4 },
  tablePeopleText: { fontSize: 7, fontWeight: 'bold' },
  catsPanel: { width: 90, backgroundColor: '#1a112d', paddingTop: 15 },
  catsHeader: { color: '#adb5bd', fontSize: 8, textAlign: 'center', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' },
  catBtn: { paddingVertical: 8, marginHorizontal: 8, marginVertical: 3, borderRadius: 12, alignItems: 'center' },
  catBtnActive: { backgroundColor: '#fff' },
  catBtnText: { color: '#fff', fontSize: 9, fontWeight: '600', textAlign: 'center' },
  catBtnTextActive: { color: '#212529' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 12, minWidth: 250, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 3.84 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#120e1f', marginBottom: 10 },
  modalMessage: { fontSize: 14, color: '#495057', textAlign: 'center', marginBottom: 20 },
  modalButton: { backgroundColor: '#e91e63', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  dropdownOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdownMenu: { position: 'absolute', top: 50, right: 16, backgroundColor: '#fff', borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 3.84, minWidth: 160 },
  dropdownItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
  dropdownItemText: { fontSize: 14, color: '#343a40', fontWeight: '500' },
  textInput: { width: '100%', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 8, padding: 10, fontSize: 14, color: '#212529' },
  settingsModalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  settingsRow: {
    marginBottom: 16,
    width: '100%',
  },
  settingsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4b5563',
    marginBottom: 6,
  },
  settingsInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  settingsInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: '#212529',
    backgroundColor: '#f9fafb',
  },
  settingsSaveBtn: {
    backgroundColor: '#1e1333',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsSaveText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  settingsActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
    marginTop: 10,
  },
  clearTablesBtn: {
    backgroundColor: '#fff5f7',
    borderColor: '#ffd0db',
  },
  clearTablesText: {
    color: '#e91e63',
    fontWeight: '700',
    fontSize: 13,
  },
  resetDataBtn: {
    backgroundColor: '#fef2f2',
    borderColor: '#fee2e2',
  },
  resetDataText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 13,
  },
  currencySelector: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  currencySelectorBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySelectorBtnActive: {
    backgroundColor: '#e91e63',
    borderColor: '#e91e63',
  },
  currencySelectorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  currencySelectorTextActive: {
    color: '#fff',
  },
  logoutBtn: {
    backgroundColor: '#fef2f2',
    borderColor: '#fee2e2',
  },
  logoutBtnText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 13,
  },
  lockScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockScreenContent: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  lockTime: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  lockDate: {
    fontSize: 14,
    color: '#a78bfa',
    fontWeight: '600',
    marginBottom: 30,
    textTransform: 'capitalize',
  },
  lockUserContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  lockAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  lockUserName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  lockUserRole: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  pinDotsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    height: 16,
    alignItems: 'center',
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  pinDotError: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  pinErrorText: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 20,
  },
  pinHintText: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 20,
  },
  keypadGrid: {
    width: '100%',
    gap: 12,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  keypadBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  keypadBtnSpecial: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  keypadBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  moveTableModalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    width: '90%',
    maxWidth: 550,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  moveFlowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  moveFlowCard: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#dee2e6',
  },
  moveFlowCardActive: {
    borderColor: '#e91e63',
    backgroundColor: '#fff5f7',
  },
  moveFlowLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#868e96',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  moveFlowValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#212529',
  },
  moveFlowSubValue: {
    fontSize: 11,
    color: '#e91e63',
    fontWeight: '700',
    marginTop: 2,
  },
  moveFlowArrow: {
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 8,
  },
  moveTableScroll: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    padding: 8,
    flex: 1,
  },
  moveTableSelectorItem: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moveTableSelectorItemActive: {
    backgroundColor: '#e91e63',
    borderColor: '#e91e63',
  },
  moveTableSelectorText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212529',
  },
  moveTableSelectorSubtext: {
    fontSize: 11,
    fontWeight: '600',
    color: '#868e96',
  },
  moveTableSelectorTextActive: {
    color: '#fff',
  },
  emptyText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#868e96',
    textAlign: 'center',
    paddingVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
    height: 48,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    color: '#212529',
    fontSize: 14,
    height: '100%',
  },
});
