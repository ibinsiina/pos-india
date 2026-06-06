import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRight } from "lucide-react-native";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthInput from "@/components/AuthInput";
import Button from "@/components/Button";
import "../../../global.css";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>

          <View className="mt-8 mb-8">
            <Text className="text-3xl font-sans-bold text-primary mb-2">
              Register an account
            </Text>
            <Text className="text-base font-sans-regular text-muted-foreground">
              Let's connect you with Billy!
            </Text>
          </View>

          <AuthInput
            label="First Name"
            placeholder="Enter your first name"
            required
          />

          <AuthInput
            label="Last Name"
            placeholder="Enter your last name"
            required
          />

          <AuthInput
            label="Company Name"
            placeholder="Enter your company name"
            required
          />

          <AuthInput
            label="Phone"
            placeholder="+91   Enter your phone number"
            keyboardType="phone-pad"
            required
          />

          <AuthInput
            label="GST"
            placeholder="Enter GST number (Optional)"
          />

          <Button
            title="Create Account"
            icon={<ArrowRight color="white" size={20} />}
            onPress={() => router.push("/(app)/dashboard")}
            className="w-full mt-4 mb-6"
            textClassName="mr-2"
          />

          <View className="flex-row justify-center mb-12">
            <Pressable onPress={() => router.push("/(auth)/sign-in")}>
              <Text className="text-base font-sans-regular text-muted-foreground">
                Already registered?
              </Text>
            </Pressable>
          </View>

          <View className="flex-1 justify-end items-center mb-4">
            <Text className="text-xs font-sans-regular text-muted-foreground text-center leading-relaxed">
              By signing up you agree to our <Text className="underline text-primary">Terms</Text>, <Text className="underline text-primary">Privacy Policy</Text>,{"\n"}
              and <Text className="underline text-primary">Cookies use</Text>
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
