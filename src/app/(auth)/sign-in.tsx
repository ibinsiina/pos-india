import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthInput from "../../../components/AuthInput";
import Button from "../../../components/Button";
import { icons } from "../../../constants/icons";
import "../../../global.css";

export default function SignInScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>

          <View className="mt-8 mb-10">
            <Text className="text-3xl font-sans-bold text-primary mb-2">
              Login to your account
            </Text>
            <Text className="text-base font-sans-regular text-muted-foreground">
              It's great to see you again.
            </Text>
          </View>

          <AuthInput
            label="Phone"
            placeholder="+91   Enter your phone number"
            keyboardType="phone-pad"
          />

          <AuthInput
            label="Password"
            placeholder="Enter password"
            isPassword
          />

          <View className="flex-row justify-start mt-2 mb-8">
            <Text className="text-sm font-sans-regular text-muted-foreground">
              Forgot your password?{" "}
            </Text>
            <Pressable>
              <Text className="text-sm font-sans-medium text-primary underline">
                Reset your password
              </Text>
            </Pressable>
          </View>

          <Button
            title="Login"
            onPress={() => router.push("/(app)/dashboard")}
            className="w-full mb-6"
          />

          <View className="flex-row justify-center mb-8">
            <Text className="text-sm font-sans-regular text-muted-foreground">
              Don't have an account?{" "}
            </Text>
            <Pressable onPress={() => router.push("/(auth)/sign-up")}>
              <Text className="text-sm font-sans-medium text-primary underline">
                Join
              </Text>
            </Pressable>
          </View>

          <View className="flex-row items-center mb-8">
            <View className="flex-1 h-[1px] bg-border" />
            <Text className="mx-4 text-sm font-sans-regular text-muted-foreground">Or</Text>
            <View className="flex-1 h-[1px] bg-border" />
          </View>

          <Pressable className="w-full h-14 bg-white border border-border items-center justify-center rounded-xl flex-row">
            <Image 
              source={icons.google} 
              style={{ width: 24, height: 24, marginRight: 12 }} 
              resizeMode="contain" 
            />
            <Text className="text-base font-sans-medium text-primary">
              Sign Up with Google
            </Text>
          </Pressable>

          <View className="flex-1 justify-end items-center mt-12 mb-4">
            <Text className="text-xs font-sans-regular text-muted-foreground text-center leading-relaxed">
              By signing in you agree to our <Text className="underline text-primary">Terms</Text>, <Text className="underline text-primary">Privacy Policy</Text>,{"\n"}
              and <Text className="underline text-primary">Cookies use</Text>
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}