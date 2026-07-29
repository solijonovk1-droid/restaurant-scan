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
import { User, Lock, Utensils, Eye, EyeOff } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseService } from '../services/supabaseService';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert("Xatolik", "Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    setLoading(true);

    try {
      // Load registered users from Supabase/local cache
      const users = await supabaseService.getUsers();

      // Find user
      const user = users.find(
        (u: any) => u.username.toLowerCase() === username.trim().toLowerCase()
      );

      if (!user || user.password !== password) {
        Alert.alert("Xatolik", "Foydalanuvchi nomi yoki parol noto'g'ri.");
        setLoading(false);
        return;
      }

      // Save current login session
      await AsyncStorage.setItem('currentAccountId', user.accountId);

      // Redirect to main admin page
      router.replace('/');
    } catch (err) {
      console.error(err);
      Alert.alert("Xatolik", "Kirish tizimida muammo yuz berdi.");
    } finally {
      setLoading(false);
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
              <Text style={styles.cardTitle}>Tizimga Kirish</Text>
              <Text style={styles.cardSubtitle}>Tizimga kirish va stollarni boshqarish</Text>
            </View>

            {/* Username Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Foydalanuvchi Nomi</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Foydalanuvchi nomini kiriting"
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
                  placeholder="Parolni kiriting"
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

            {/* Action Button */}
            <TouchableOpacity 
              style={styles.loginBtn} 
              onPress={handleLogin}
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
                  <Text style={styles.btnText}>TIZIMGA KIRISH</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Switch to Register */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Hisobingiz yo'qmi? </Text>
              <TouchableOpacity onPress={() => router.replace('/register')}>
                <Text style={styles.linkText}>Ro'yxatdan o'tish</Text>
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
  loginBtn: {
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
