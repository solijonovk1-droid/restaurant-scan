import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Printer } from 'lucide-react-native';
import * as Print from 'expo-print';
import { allTables } from './index';

export default function BarcodesPage() {
  const router = useRouter();

  // Barcha stollarni bitta arrayga yig'ib olamiz
  const tables = Object.values(allTables).flat();

  const handlePrint = async (tableName: string, qrValue: string) => {
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrValue)}`;
    
    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              text-align: center;
              padding: 40px;
              margin: 0;
              background-color: #fff;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              box-sizing: border-box;
            }
            .card {
              border: 3px dashed #e91e63;
              border-radius: 24px;
              padding: 40px;
              display: inline-block;
              background-color: #fff;
              max-width: 380px;
              width: 100%;
              box-sizing: border-box;
            }
            .logo {
              font-size: 16px;
              font-weight: 800;
              color: #7d1f5e;
              letter-spacing: 2px;
              margin-bottom: 20px;
              text-transform: uppercase;
            }
            h1 {
              font-size: 38px;
              font-weight: 800;
              color: #120e1f;
              margin-top: 0;
              margin-bottom: 10px;
            }
            .subtitle {
              font-size: 14px;
              color: #666;
              margin-bottom: 30px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .qr-container {
              margin: 25px 0;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            img {
              width: 250px;
              height: 250px;
            }
            .footer-text {
              font-size: 12px;
              color: #aaa;
              margin-top: 25px;
            }
            .value {
              font-size: 14px;
              font-weight: 600;
              color: #888;
              margin-top: 5px;
              letter-spacing: 2px;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
                height: auto;
              }
              .card {
                border: 3px dashed #e91e63;
                box-shadow: none;
                margin: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">Menulux POS</div>
            <h1>${tableName}</h1>
            <div class="subtitle">Menuni ko'rish uchun skanerlang</div>
            <div class="qr-container">
              <img src="${qrImageUrl}" />
            </div>
            <div class="value">${qrValue}</div>
            <div class="footer-text">Yoqimli ishtaha tilaymiz!</div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            }
          </script>
        </body>
      </html>
    `;

    try {
      if (Platform.OS === 'web') {
        const printWindow = window.open('', '_blank', 'width=600,height=700');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
        } else {
          Alert.alert(
            "Xatolik", 
            "Chop etish oynasini ochish bloklandi. Iltimos brauzer sozlamalarida pop-up oynalarga ruxsat bering."
          );
        }
      } else {
        await Print.printAsync({ html: htmlContent });
      }
    } catch (error) {
      console.error("Print error:", error);
      Alert.alert("Xatolik", "Chop etishda xatolik yuz berdi");
    }
  };

  const confirmPrint = (tableName: string, qrValue: string) => {
    Alert.alert(
      "QR-kodni chop etish",
      `"${tableName}" uchun QR-kodni chop etishni xohlaysizmi?`,
      [
        { text: "Bekor qilish", style: "cancel" },
        { 
          text: "Chop etish", 
          onPress: () => handlePrint(tableName, qrValue),
          style: "default"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#333" />
          <Text style={styles.backText}>Orqaga</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stollar QR-kodlari</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subHeader}>Chop etish uchun stol kartasini bosing</Text>
        <View style={styles.grid}>
          {tables.map((table) => {
            const qrValue = table.barcode || table.id.toString().padStart(12, '0');
            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrValue)}`;
            
            return (
              <TouchableOpacity 
                key={table.id} 
                style={styles.card} 
                onPress={() => confirmPrint(table.name, qrValue)}
                activeOpacity={0.7}
              >
                <Text style={styles.tableName}>{table.name}</Text>
                <View style={styles.qrWrapper}>
                  <Image 
                    source={{ uri: qrImageUrl }} 
                    style={{ width: 130, height: 130 }} 
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.qrValue}>{qrValue}</Text>
                
                <View style={styles.printAction}>
                  <Printer size={14} color="#e91e63" />
                  <Text style={styles.printActionText}>Chop etish</Text>
                </View>
              </TouchableOpacity>
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
    width: 80,
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  subHeader: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  tableName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    color: '#1f2937',
  },
  qrWrapper: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrValue: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 2,
  },
  printAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    backgroundColor: '#fff5f7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffd0db',
    width: '100%',
  },
  printActionText: {
    color: '#e91e63',
    fontWeight: '700',
    fontSize: 12,
  },
});
