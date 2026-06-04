import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, ArrowLeft, ReceiptText } from "lucide-react-native";
import { useRouter } from "expo-router";
import Card from "../../../components/Card";
import { INVOICES } from "../../../constants/data";
import "../../../global.css";

export default function InvoiceScreen() {
    const router = useRouter();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Paid": return "bg-green-100 text-green-700";
            case "Pending": return "bg-amber-100 text-amber-700";
            case "Overdue": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10 mb-4">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <ArrowLeft color="#081126" size={24} />
                    </Pressable>
                    <Text className="text-2xl font-sans-bold text-primary">Invoices</Text>
                </View>
                <Pressable className="p-2 bg-primary rounded-full">
                    <Plus color="white" size={20} />
                </Pressable>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                {INVOICES.map((inv) => (
                    <Card key={inv.id} isPressable>
                        <View className="flex-row justify-between items-start mb-3">
                            <View>
                                <Text className="font-sans-bold text-base text-primary">{inv.customerName}</Text>
                                <Text className="font-sans-medium text-xs text-muted-foreground mt-1">{inv.number}</Text>
                            </View>
                            <View className={`px-2 py-1 rounded-md ${getStatusColor(inv.status).split(' ')[0]}`}>
                                <Text className={`font-sans-bold text-[10px] uppercase ${getStatusColor(inv.status).split(' ')[1]}`}>
                                    {inv.status}
                                </Text>
                            </View>
                        </View>
                        
                        <View className="h-[1px] w-full bg-border mb-3" />
                        
                        <View className="flex-row justify-between items-center">
                            <Text className="font-sans-regular text-xs text-muted-foreground">{inv.date}</Text>
                            <Text className="font-sans-bold text-lg text-primary">₹ {inv.total.toLocaleString('en-IN')}</Text>
                        </View>
                    </Card>
                ))}
            </ScrollView>

            <Pressable
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
