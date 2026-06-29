import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Lock, Utensils, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default menu items for new accounts to start with
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

export default function RegisterScreen() {
  const [restaurantName, setRestaurantName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    console.log("handleRegister started", { restaurantName, username, password, confirmPassword });
    if (!restaurantName.trim() || !username.trim() || !password || !confirmPassword) {
      console.log("Validation failed: empty fields");
      Alert.alert("Xatolik", "Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    if (username.length < 3) {
      console.log("Validation failed: username too short");
      Alert.alert("Xatolik", "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    if (password.length < 4) {
      console.log("Validation failed: password too short");
      Alert.alert("Xatolik", "Parol kamida 4 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Validation failed: passwords do not match");
      Alert.alert("Xatolik", "Parollar mos kelmadi. Iltimos qaytadan tekshirib kiring.");
      return;
    }

    setLoading(true);
    console.log("Validation passed, setting loading to true");

    try {
      console.log("Fetching saved users...");
      // Get current users list
      const storedUsers = await AsyncStorage.getItem('savedUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      console.log("Existing users count:", users.length);

      // Check if username is taken (case-insensitive)
      const usernameExists = users.some((u: any) => u.username.toLowerCase() === username.trim().toLowerCase());
      if (usernameExists) {
        console.log("Registration failed: username exists");
        Alert.alert("Xatolik", "Ushbu foydalanuvchi nomi band. Boshqa nom tanlang.");
        setLoading(false);
        return;
      }

      // Generate a unique account ID
      const accountId = 'acc_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      console.log("Generated account ID:", accountId);

      // Create new user object
      const newUser = {
        accountId,
        username: username.trim(),
        password: password,
        restaurantName: restaurantName.trim()
      };

      // Generate 10 default tables for this account with distinct IDs
      const initialTables: Record<string, any[]> = {
        "ZAL": Array.from({ length: 10 }, (_, i) => ({
          id: `${accountId}_t${i + 1}`,
          name: `Stol ${i + 1}`,
          status: "empty"
        }))
      };

      console.log("Saving new user details to AsyncStorage...");
      // Save user specific initial states
      await AsyncStorage.setItem(`savedRestaurantName_${accountId}`, restaurantName.trim());
      await AsyncStorage.setItem(`savedCurrency_${accountId}`, 'UZS');
      await AsyncStorage.setItem(`savedTables_${accountId}`, JSON.stringify(initialTables));
      await AsyncStorage.setItem(`savedOrders_${accountId}`, JSON.stringify([]));
      await AsyncStorage.setItem(`savedOrderHistory_${accountId}`, JSON.stringify([]));
      await AsyncStorage.setItem(`savedMenuItems_${accountId}`, JSON.stringify(DEFAULT_MENU_ITEMS));

      // Append user to users list
      const updatedUsers = [...users, newUser];
      await AsyncStorage.setItem('savedUsers', JSON.stringify(updatedUsers));
      console.log("Successfully saved updated users list to AsyncStorage.");

      // Automatically log the user in
      await AsyncStorage.setItem('currentAccountId', accountId);

      Alert.alert(
        "Muvaffaqiyat", 
        "Tizimda muvaffaqiyatli ro'yxatdan o'tdingiz!",
        [
          { 
            text: "Bosh sahifaga o'tish", 
            onPress: () => {
              console.log("Alert onPress clicked, navigating to home page");
              router.replace('/');
            }
          }
        ]
      );
      
    } catch (err) {
      console.error("Error during registration:", err);
      Alert.alert("Xatolik", "Tizimga yozishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
      console.log("handleRegister completed (finally block)");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#120e1f" />
      
      {/* Top Header Bar */}
      <LinearGradient 
        colors={['#d80056', '#7d1f5e', '#1e1333']}
        start={[0, 0]} end={[1, 0]}
        style={styles.headerBar}
      >
        <Text style={styles.logoText}>MENULUX <Text style={styles.logoTextLight}>POS</Text></Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          <View style={styles.card}>
            {/* Header inside the card */}
            <View style={styles.cardHeader}>
              <View style={styles.logoCircle}>
                <Utensils size={36} color="#e91e63" />
              </View>
              <Text style={styles.cardTitle}>Ro'yxatdan O'tish</Text>
              <Text style={styles.cardSubtitle}>Yangi restoran hisobini yaratish</Text>
            </View>

            {/* Restaurant Name Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Restoran Nomi</Text>
              <View style={styles.inputContainer}>
                <Utensils size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Masalan: Rayhon Milliy Taomlar"
                  placeholderTextColor="#9ca3af"
                  value={restaurantName}
                  onChangeText={setRestaurantName}
                />
              </View>
            </View>

            {/* Username Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Foydalanuvchi Nomi (Login)</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Masalan: rayhon_admin"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Parol</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Parolni Tasdiqlang</Text>
              <View style={styles.inputContainer}>
                <ShieldCheck size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity 
              style={styles.registerBtn} 
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#d80056', '#7d1f5e', '#1e1333']}
                start={[0, 0]} end={[1, 0]}
                style={styles.gradientBtn}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.btnText}>RO'YXATDAN O'TISH</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Switch to Login */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Hisobingiz bormi? </Text>
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text style={styles.linkText}>Tizimga kirish</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9ecef',
  },
  headerBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  logoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  logoTextLight: {
    fontWeight: '300',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'web' ? 40 : 60,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#dee2e6',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 6,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(233, 30, 99, 0.3)',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#120e1f',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    color: '#4b5563',
    fontSize: 12,
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
    height: 48,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#212529',
    fontSize: 14,
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
  },
  registerBtn: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  gradientBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#4b5563',
    fontSize: 13,
  },
  linkText: {
    color: '#e91e63',
    fontWeight: '700',
    fontSize: 13,
  },
});
