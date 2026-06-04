import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Search, Plus, ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import Card from "../../../components/Card";
import { PARTIES } from "../../../constants/data";
import "../../../global.css";

export default function CustomersVendorsScreen() {
    const router = useRouter();
    const [tab, setTab] = useState<"customer" | "vendor">("customer");
    const [search, setSearch] = useState("");

    const filteredParties = PARTIES.filter(
        p => p.type === tab && p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <ArrowLeft color="#081126" size={24} />
                    </Pressable>
                    <Text className="text-2xl font-sans-bold text-primary">Directory</Text>
                </View>
                <Pressable className="p-2 bg-primary rounded-full">
                    <Plus color="white" size={20} />
                </Pressable>
            </View>

            <View className="flex-row p-4">
                <Pressable 
                    onPress={() => setTab("customer")}
                    className={`flex-1 items-center py-3 border-b-2 ${tab === "customer" ? "border-primary" : "border-transparent"}`}
                >
                    <Text className={`font-sans-medium text-base ${tab === "customer" ? "text-primary" : "text-muted-foreground"}`}>
                        Customers
                    </Text>
                </Pressable>
                <Pressable 
                    onPress={() => setTab("vendor")}
                    className={`flex-1 items-center py-3 border-b-2 ${tab === "vendor" ? "border-primary" : "border-transparent"}`}
                >
                    <Text className={`font-sans-medium text-base ${tab === "vendor" ? "text-primary" : "text-muted-foreground"}`}>
                        Vendors
                    </Text>
                </Pressable>
            </View>

            <View className="px-5 mb-4">
                <View className="flex-row items-center bg-white px-4 h-12 rounded-xl border border-border">
                    <Search color="#9ca3af" size={20} />
                    <TextInput 
                        className="flex-1 ml-3 h-full font-sans-regular text-base text-primary"
                        placeholder={`Search ${tab}s...`}
                        placeholderTextColor="#9ca3af"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                {filteredParties.map((party) => (
                    <Card key={party.id} className="flex-row justify-between items-center" isPressable>
                        <View className="flex-1">
                            <Text className="font-sans-bold text-lg text-primary mb-1">{party.name}</Text>
                            <Text className="font-sans-regular text-sm text-muted-foreground">GSTIN: {party.gstin}</Text>
                        </View>
                        <View className="items-end">
                            <Text className={`font-sans-bold text-base ${party.balance > 0 ? (tab === 'customer' ? 'text-green-600' : 'text-red-500') : 'text-primary'}`}>
                                ₹ {Math.abs(party.balance).toLocaleString('en-IN')}
                            </Text>
                            <Text className="font-sans-medium text-xs text-muted-foreground">
                                {party.balance > 0 ? (tab === 'customer' ? 'To Receive' : 'To Pay') : 'Advance'}
                            </Text>
                        </View>
                    </Card>
                ))}
                
                {filteredParties.length === 0 && (
                    <View className="items-center justify-center py-10">
                        <Text className="font-sans-medium text-muted-foreground">No {tab}s found.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
