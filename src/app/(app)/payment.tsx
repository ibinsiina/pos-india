import { useRouter } from "expo-router";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Plus } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../../components/Card";
import { PAYMENTS } from "../../../constants/data";
import "../../../global.css";

export default function PaymentScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10 mb-4">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <ArrowLeft color="#081126" size={24} />
                    </Pressable>
                    <Text className="text-2xl font-sans-bold text-primary">Payments</Text>
                </View>
                <Pressable className="p-2 bg-primary rounded-full">
                    <Plus color="white" size={20} />
                </Pressable>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                {PAYMENTS.map((payment) => (
                    <Card key={payment.id} className="flex-row items-center">
                        <View className={`size-12 rounded-full items-center justify-center mr-4 ${payment.type === 'in' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {payment.type === 'in' ? (
                                <ArrowDownLeft color="#16a34a" size={24} />
                            ) : (
                                <ArrowUpRight color="#dc2626" size={24} />
                            )}
                        </View>
                        <View className="flex-1">
                            <Text className="font-sans-bold text-base text-primary mb-1">{payment.partyName}</Text>
                            <Text className="font-sans-medium text-xs text-muted-foreground">{payment.mode} • {payment.date}</Text>
                        </View>
                        <View className="items-end">
                            <Text className={`font-sans-bold text-lg ${payment.type === 'in' ? 'text-green-600' : 'text-primary'}`}>
                                {payment.type === 'in' ? '+' : '-'} ₹ {payment.amount.toLocaleString('en-IN')}
                            </Text>
                        </View>
                    </Card>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
