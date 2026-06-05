import { useRouter } from "expo-router";
import { ArrowLeft, Plus, ReceiptText, Search } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../../components/Card";
import { useAppContext } from "../../context/AppContext";
import "../../../global.css";

export default function InvoiceScreen() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState<"All" | "Pending" | "Paid" | "Overdue" | "Draft">("All");
    const { invoices } = useAppContext();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Paid": return "bg-green-100 text-green-700";
            case "Pending": return "bg-amber-100 text-amber-700";
            case "Overdue": return "bg-red-100 text-red-700";
            case "Draft": return "bg-slate-100 text-slate-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesTab = tab === "All" || inv.status === tab;
        const matchesSearch = inv.customerName.toLowerCase().includes(search.toLowerCase()) || inv.number.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center p-5 bg-white shadow-sm z-10">
                <Pressable onPress={() => router.back()} className="mr-4">
                    <ArrowLeft color="#081126" size={24} />
                </Pressable>
                <Text className="text-2xl font-sans-bold text-primary">Invoices</Text>
            </View>

            <View className="bg-white">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 py-3 border-b border-border">
                    {["All", "Pending", "Paid", "Overdue", "Draft"].map((t) => (
                        <Pressable 
                            key={t}
                            onPress={() => setTab(t as any)}
                            className={`mr-3 px-4 py-2 rounded-full border ${tab === t ? 'bg-primary border-primary' : 'bg-transparent border-border'}`}
                        >
                            <Text className={`font-sans-medium ${tab === t ? 'text-white' : 'text-muted-foreground'}`}>{t}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            <View className="px-5 mt-4 mb-4">
                <View className="flex-row items-center bg-white px-4 h-12 rounded-xl border border-border">
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        className="flex-1 ml-3 h-full font-sans-regular text-base text-primary"
                        placeholder="Search by name or number..."
                        placeholderTextColor="#9ca3af"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {filteredInvoices.map((inv) => (
                    <Card key={inv.id} className="mb-4" isPressable>
                        <View className="flex-row justify-between items-start mb-3">
                            <View>
                                <Text className="font-sans-bold text-base text-primary">{inv.customerName}</Text>
                                <Text className="font-sans-medium text-xs text-muted-foreground mt-1">{inv.number} • {inv.date}</Text>
                            </View>
                            <View className={`px-2 py-1 rounded-md ${getStatusColor(inv.status).split(' ')[0]}`}>
                                <Text className={`font-sans-bold text-[10px] uppercase ${getStatusColor(inv.status).split(' ')[1]}`}>
                                    {inv.status}
                                </Text>
                            </View>
                        </View>

                        <View className="h-[1px] w-full bg-border mb-3" />

                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="font-sans-medium text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Items</Text>
                                <Text className="font-sans-bold text-sm text-primary">{inv.items ? inv.items.length : 0}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="font-sans-medium text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total Amount</Text>
                                <Text className="font-sans-bold text-lg text-primary">₹ {inv.total.toLocaleString('en-IN')}</Text>
                            </View>
                        </View>
                    </Card>
                ))}
                {filteredInvoices.length === 0 && (
                    <View className="items-center justify-center py-10">
                        <Text className="font-sans-medium text-muted-foreground">No invoices found.</Text>
                    </View>
                )}
            </ScrollView>

            <Pressable
                onPress={() => router.push('/(app)/create-invoice')}
                className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-primary"
                style={{
                    elevation: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                }}
            >
                <ReceiptText color="white" size={28} />
            </Pressable>
        </SafeAreaView>
    );
}
