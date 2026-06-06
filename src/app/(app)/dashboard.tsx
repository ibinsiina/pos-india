import { LinearGradient } from "expo-linear-gradient";
import { Bell, Boxes, ChevronDown, RefreshCcw } from "lucide-react-native";
import { useState, useMemo } from "react";
import { Image, Pressable, ScrollView, Text, View, Modal, StyleSheet, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../../context/AppContext";
import images from "../../../constants/images";

import BarChart from "@/components/BarChart";
import FloatingMenu from "@/components/FloatingMenu";
import OutstandingList from "@/components/OutstandingList";
import StatCard from "@/components/StatCard";
import "../../../global.css";

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("June 2026");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const monthOptions = [
    "June 2026",
    "May 2026",
    "April 2026",
    "March 2026",
    "February 2026",
    "January 2026",
  ];

  const { invoices, purchases, parties, payments } = useAppContext();

  const dashboardBalances = useMemo(() => {
    const totalSales = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
    const totalSalesGST = invoices.reduce((acc, inv) => acc + ((inv.cgstAmount || 0) + (inv.sgstAmount || 0) + (inv.igstAmount || 0)), 0);

    const totalPurchases = purchases.reduce((acc, pur) => acc + (pur.total || 0), 0);
    const totalPurchasesGST = purchases.reduce((acc, pur) => acc + ((pur.cgstAmount || 0) + (pur.sgstAmount || 0) + (pur.igstAmount || 0)), 0);

    return [
      {
        title: "Sales",
        amount: totalSales,
        gstAmount: totalSalesGST,
        currency: "₹",
      },
      {
        title: "Purchase",
        amount: totalPurchases,
        gstAmount: totalPurchasesGST,
        currency: "₹",
      }
    ];
  }, [invoices, purchases]);

  const outstandingData = useMemo(() => {
    let salesOutstanding = 0;
    let purchaseOutstanding = 0;

    parties.forEach(p => {
        if (p.type === 'customer') {
            salesOutstanding += Math.max(0, p.balance || 0);
        } else if (p.type === 'vendor') {
            purchaseOutstanding += Math.max(0, p.balance || 0);
        } else if (p.type === 'both') {
            if ((p.balance || 0) > 0) salesOutstanding += p.balance!;
            else purchaseOutstanding += Math.abs(p.balance || 0);
        }
    });

    return [
        {
            title: "Sales Outstanding",
            totalReceivables: salesOutstanding,
            currency: "₹",
            items: [
                { label: "CURRENT", amount: salesOutstanding, status: "current" as const },
                { label: "OVERDUE", amount: 0, subtitle: "30+ Days", status: "overdue" as const }
            ]
        },
        {
            title: "Purchase Outstanding",
            totalReceivables: purchaseOutstanding,
            currency: "₹",
            items: [
                { label: "CURRENT", amount: purchaseOutstanding, status: "current" as const },
                { label: "OVERDUE", amount: 0, subtitle: "1-15 Days", status: "overdue" as const }
            ]
        }
    ];
  }, [parties]);

  const activeMonthsToDisplay = useMemo(() => {
      const uniqueMonths = new Set<string>();
      [...invoices, ...purchases, ...payments].forEach(doc => {
          const parts = doc.date?.split(" ") || [];
          if(parts.length > 1) uniqueMonths.add(parts[1].substring(0, 3));
      });
      const ALL_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const activeMonths = ALL_MONTHS.filter(m => uniqueMonths.has(m));
      const monthsToDisplay = activeMonths.slice(-6);
      if(monthsToDisplay.length === 0) {
          monthsToDisplay.push(...["Jan", "Feb", "Mar", "Apr", "May", "Jun"]);
      }
      return monthsToDisplay;
  }, [invoices, purchases, payments]);

  const chartData = useMemo(() => {
    const aggregated = activeMonthsToDisplay.map(m => ({ label: m, value1: 0, value2: 0 }));

    invoices.forEach(inv => {
        const parts = inv.date?.split(" ") || [];
        const monthStr = parts.length > 1 ? parts[1].substring(0, 3) : "Unknown";
        const target = aggregated.find(a => a.label === monthStr);
        if (target) target.value1 += (inv.total || 0);
    });

    purchases.forEach(pur => {
        const parts = pur.date?.split(" ") || [];
        const monthStr = parts.length > 1 ? parts[1].substring(0, 3) : "Unknown";
        const target = aggregated.find(a => a.label === monthStr);
        if (target) target.value2 += (pur.total || 0);
    });

    return aggregated;
  }, [invoices, purchases, activeMonthsToDisplay]);

  const cashFlowData = useMemo(() => {
    const aggregated = activeMonthsToDisplay.map(m => ({ label: m, value1: 0, value2: 0 }));

    payments.forEach(pay => {
        const parts = pay.date?.split(" ") || [];
        const monthStr = parts.length > 1 ? parts[1].substring(0, 3) : "Unknown";
        const target = aggregated.find(a => a.label === monthStr);
        if (target) {
            if (pay.type === 'in') target.value1 += pay.amount;
            else target.value2 += pay.amount;
        }
    });

    return aggregated;
  }, [payments, activeMonthsToDisplay]);

  return (
    <LinearGradient
      colors={['#e3e8fc', '#f1f1f1']}
      className="flex-1"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 p-5 pb-0">
          <View className="mb-2.5 flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-3xl font-sans-bold text-primary leading-tight">{getGreeting()}</Text>
              <Text className="text-3xl font-sans-bold text-primary leading-tight">Axanees!</Text>
            </View>
            <View className="flex-row items-center gap-4">
              <View className="relative">
                <Bell color="#081126" fill="#081126" size={22} />
                <View className="absolute right-0 top-0 size-2.5 rounded-full bg-red-600 border border-white" />
              </View>
              <Image source={images.avatar} className="size-12 rounded-full" />
            </View>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            <View className="flex-row items-center justify-between mb-4">
              <RefreshCcw color="#000" size={24} />
              <Pressable 
                className="flex-row items-center bg-white rounded-lg px-3 py-2 border border-white/50 shadow-sm"
                onPress={() => setMonthModalVisible(true)}
              >
                <ChevronDown color="#000" size={16} className="mr-2" />
                <Text className="font-sans-medium text-base text-primary">{selectedMonth}</Text>
              </Pressable>
            </View>

            <View className="flex-row gap-4 mb-6">
              {dashboardBalances.map((balance: any, index: number) => (
                <StatCard key={index} {...balance} />
              ))}
            </View>

            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              snapToInterval={Dimensions.get('window').width - 40}
              decelerationRate="fast"
              contentContainerStyle={{ gap: 0 }}
            >
              <View style={{ width: Dimensions.get('window').width - 40 }}>
                <BarChart 
                  title="Revenue vs Purchases" 
                  data={chartData} 
                  legend1="Sales"
                  legend2="Purchases"
                  height={260} 
                />
              </View>
              <View style={{ width: Dimensions.get('window').width - 40 }}>
                <BarChart 
                  title="Cash Flow (In vs Out)" 
                  data={cashFlowData} 
                  legend1="Money In"
                  legend2="Money Out"
                  height={260} 
                />
              </View>
            </ScrollView>

            <View className="mt-4">
              {outstandingData.map((data: any, index: number) => (
                <OutstandingList key={index} data={data} />
              ))}
            </View>
          </ScrollView>

          <FloatingMenu
            visible={menuVisible}
            onClose={() =>
              setMenuVisible(false)
            }
          />

          <Pressable
            onPress={() =>
              setMenuVisible(true)
            }
            className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-white"
            style={{
              elevation: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
            }}
          >
            <Boxes
              color="#000"
              size={32}
              strokeWidth={2.5}
            />
          </Pressable>

          <Modal visible={monthModalVisible} transparent animationType="fade" statusBarTranslucent>
            <View className="flex-1 justify-center items-center">
              <Pressable className="absolute inset-0" onPress={() => setMonthModalVisible(false)}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
              </Pressable>

              <View className="bg-white rounded-3xl w-3/4 p-4 shadow-xl">
                <Text className="font-sans-bold text-lg text-primary mb-4 text-center">Select Month</Text>
                {monthOptions.map(month => (
                  <Pressable 
                    key={month} 
                    className="py-4 border-b border-border" 
                    onPress={() => { setSelectedMonth(month); setMonthModalVisible(false); }}
                  >
                    <Text className={`text-center text-base ${selectedMonth === month ? 'text-primary font-sans-bold' : 'text-muted-foreground font-sans-medium'}`}>
                      {month}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
