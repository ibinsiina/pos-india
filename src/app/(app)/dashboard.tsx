import { LinearGradient } from "expo-linear-gradient";
import { Bell, Boxes, ChevronDown, RefreshCcw } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View, Modal, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { DASHBOARD_BALANCES, OUTSTANDING_DATA } from "../../../constants/data";
import images from "../../../constants/images";

import DonutChart from "../../../components/DonutChart";
import FloatingMenu from "../../../components/FloatingMenu";
import OutstandingList from "../../../components/OutstandingList";
import StatCard from "../../../components/StatCard";
import "../../../global.css";

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("June 2026");

  const monthOptions = [
    "June 2026",
    "May 2026",
    "April 2026",
    "March 2026",
    "February 2026",
    "January 2026",
  ];

  return (
    <LinearGradient
      colors={['#e3e8fc', '#f1f1f1']}
      className="flex-1"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 p-5 pb-0">
          <View className="mb-2.5 flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-3xl font-sans-bold text-primary leading-tight">Good morning</Text>
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
              {DASHBOARD_BALANCES.map((balance, index) => (
                <StatCard key={index} {...balance} />
              ))}
            </View>

            <DonutChart size={240} />

            <View className="mt-4">
              {OUTSTANDING_DATA.map((data, index) => (
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