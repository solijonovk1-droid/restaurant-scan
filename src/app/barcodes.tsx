import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { allTables } from './index';

export default function BarcodesPage() {
  const router = useRouter();

  // Barcha stollarni bitta arrayga yig'ib olamiz
  const tables = Object.values(allTables).flat();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#333" />
          <Text style={styles.backText}>Orqaga</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stollar Shtrix-kodlari</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {tables.map((table) => {
            // Har bir stol uchun unikal 12 xonali kod yaratamiz (Stol ID sining oldiga nollar qo'shiladi)
            const barcodeValue = table.id.toString().padStart(12, '0');
            
            return (
              <View key={table.id} style={styles.card}>
                <Text style={styles.tableName}>{table.name}</Text>
                <View style={styles.barcodeWrapper}>
                  <Image 
                    source={{ uri: `https://bwipjs-api.metafloor.com/?bcid=code128&text=${barcodeValue}&scale=2&height=15` }} 
                    style={{ width: 150, height: 60 }} 
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.barcodeValue}>{barcodeValue}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  backText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#120e1f',
  },
  barcodeWrapper: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeValue: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 3,
  },
});
