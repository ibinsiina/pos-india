import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import "../../global.css";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      <Pressable 
        className="flex-1 p-8"
        onPress={() => router.push("/(auth)/sign-in")}
      >
        <View className="flex-1 pt-12">
          <Text className="text-4xl font-sans-bold text-primary leading-tight">
            One place solution for all your business needs!
          </Text>
        </View>

        <View className="flex-[2] justify-center items-center">
          {/* Logo Placeholder */}
          <Text className="text-[160px] font-sans-extrabold text-primary tracking-tighter leading-none">
            B
          </Text>
        </View>

        <View className="flex-1 justify-end items-center pb-6">
          <Text className="text-sm font-sans-regular text-muted-foreground text-center leading-relaxed">
            Copyright © 2026{"\n"}
            Billy - Omnity Industries Software{"\n"}
            All rights reserved.
          </Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}