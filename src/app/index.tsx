import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../../global.css";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulate loading/initialization, then navigate to onboarding
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-[#1c1c1e]">
      <StatusBar style="light" />
      
      {/* Central Logo Placeholder */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-[120px] font-sans-extrabold tracking-tighter leading-none">
          B
        </Text>
      </View>

      {/* Loading indicator at bottom */}
      <View className="pb-20">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </View>
  );
}