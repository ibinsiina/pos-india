import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRight } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
          <Image
            source={require("../../assets/images/icon-black.png")}
            style={{ width: 180, height: 180 }}
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 justify-end items-center pb-6">
          <View className="flex-row items-center mb-8 bg-primary/5 px-6 py-3 rounded-full border border-primary/10">
            <Text className="font-sans-bold text-primary mr-2">Tap anywhere to continue</Text>
            <ArrowRight color="#0f172a" size={20} />
          </View>
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
