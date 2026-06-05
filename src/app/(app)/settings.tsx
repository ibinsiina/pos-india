import { useRouter } from "expo-router";
import { ArrowLeft, Building2, ChevronRight, LogOut, Receipt, User, Users } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../../global.css";

export default function SettingsScreen() {
    const router = useRouter();

    const SettingItem = ({ icon: Icon, title, subtitle, isDestructive = false }: any) => (
        <Pressable className="flex-row items-center p-4 bg-white border-b border-black/5">
            <View className={`p-2 rounded-lg ${isDestructive ? 'bg-red-50' : 'bg-[#e3e8fc]'} mr-4`}>
                <Icon color={isDestructive ? '#dc2626' : '#081126'} size={24} />
            </View>
            <View className="flex-1">
                <Text className={`font-sans-bold text-base ${isDestructive ? 'text-red-600' : 'text-primary'}`}>{title}</Text>
                {subtitle && <Text className="font-sans-medium text-xs text-muted-foreground">{subtitle}</Text>}
            </View>
            {!isDestructive && <ChevronRight color="#9ca3af" size={20} />}
        </Pressable>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center p-5 bg-white shadow-sm z-10 mb-4">
                <Pressable onPress={() => router.back()} className="mr-4">
                    <ArrowLeft color="#081126" size={24} />
                </Pressable>
                <Text className="text-2xl font-sans-bold text-primary">Settings</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="mb-6">
                    <Text className="font-sans-bold text-sm text-muted-foreground uppercase px-5 mb-2 tracking-wider">Account</Text>
                    <View className="bg-white border-y border-black/5">
                        <SettingItem icon={User} title="Personal Profile" subtitle="Update your name, phone, password" />
                        <SettingItem icon={Building2} title="Business Details" subtitle="GSTIN, Address, Bank Accounts" />
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="font-sans-bold text-sm text-muted-foreground uppercase px-5 mb-2 tracking-wider">Preferences</Text>
                    <View className="bg-white border-y border-black/5">
                        <SettingItem icon={Receipt} title="Invoice Customization" subtitle="Prefixes, Terms & Conditions, Logo" />
                        <SettingItem icon={Users} title="User Management" subtitle="Manage staff roles and permissions" />
                    </View>
                </View>

                <View className="mb-8">
                    <View className="bg-white border-y border-black/5">
                        <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
                            <SettingItem icon={LogOut} title="Log Out" isDestructive />
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
