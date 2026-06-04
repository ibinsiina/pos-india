import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Search, Plus, ArrowLeft, Package, Briefcase } from "lucide-react-native";
import { useRouter } from "expo-router";
import Card from "../../../components/Card";
import { ITEMS } from "../../../constants/data";
import "../../../global.css";

export default function ProductsServicesScreen() {
    const router = useRouter();
    const [tab, setTab] = useState<"product" | "service">("product");
    const [search, setSearch] = useState("");

    const filteredItems = ITEMS.filter(
        i => i.type === tab && i.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <ArrowLeft color="#081126" size={24} />
                    </Pressable>
                    <Text className="text-2xl font-sans-bold text-primary">Catalog</Text>
                </View>
                <Pressable className="p-2 bg-primary rounded-full">
                    <Plus color="white" size={20} />
                </Pressable>
            </View>

            <View className="flex-row p-4">
                <Pressable 
                    onPress={() => setTab("product")}
                    className={`flex-1 items-center py-3 border-b-2 ${tab === "product" ? "border-primary" : "border-transparent"}`}
                >
                    <Text className={`font-sans-medium text-base ${tab === "product" ? "text-primary" : "text-muted-foreground"}`}>
                        Products
                    </Text>
                </Pressable>
                <Pressable 
                    onPress={() => setTab("service")}
                    className={`flex-1 items-center py-3 border-b-2 ${tab === "service" ? "border-primary" : "border-transparent"}`}
                >
                    <Text className={`font-sans-medium text-base ${tab === "service" ? "text-primary" : "text-muted-foreground"}`}>
                        Services
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
                {filteredItems.map((item) => (
                    <Card key={item.id} className="flex-row items-center" isPressable>
                        <View className="size-12 rounded-lg bg-[#e3e8fc] items-center justify-center mr-4">
                            {tab === "product" ? (
                                <Package color="#081126" size={24} />
                            ) : (
                                <Briefcase color="#081126" size={24} />
                            )}
                        </View>
                        <View className="flex-1">
                            <Text className="font-sans-bold text-lg text-primary mb-1">{item.name}</Text>
                            <Text className="font-sans-medium text-xs text-muted-foreground">
                                {tab === "product" ? "HSN" : "SAC"}: {item.hsn_sac} • GST @ {item.gst_rate}%
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="font-sans-bold text-base text-primary">
                                ₹ {item.price.toLocaleString('en-IN')}
                            </Text>
                            {tab === "product" && (
                                <Text className="font-sans-medium text-xs text-muted-foreground mt-1">
                                    Stock: <Text className={item.stock && item.stock > 100 ? "text-green-600" : "text-amber-500"}>{item.stock}</Text>
                                </Text>
                            )}
                        </View>
                    </Card>
                ))}
                
                {filteredItems.length === 0 && (
                    <View className="items-center justify-center py-10">
                        <Text className="font-sans-medium text-muted-foreground">No {tab}s found.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
