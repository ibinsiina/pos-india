import { useRouter } from "expo-router";
import { ArrowLeft, Download, FileBarChart, FileText, TrendingDown, TrendingUp } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import "../../../global.css";

export default function ReportsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10 mb-4">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <ArrowLeft color="#081126" size={24} />
                    </Pressable>
                    <Text className="text-2xl font-sans-bold text-primary">Reports</Text>
                </View>
                <Pressable className="p-2">
                    <Download color="#081126" size={24} />
                </Pressable>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                <Card className="mb-4 p-5 rounded-2xl">
                    <View className="flex-row items-center mb-4">
                        <FileBarChart color="#081126" size={24} />
                        <Text className="font-sans-bold text-lg text-primary ml-2">Profit & Loss</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="font-sans-medium text-muted-foreground">Gross Profit</Text>
                        <Text className="font-sans-bold text-primary">₹ 1,25,000</Text>
                    </View>
                    <View className="flex-row justify-between mb-4">
                        <Text className="font-sans-medium text-muted-foreground">Net Profit</Text>
                        <Text className="font-sans-bold text-green-600">₹ 85,500</Text>
                    </View>
                    <Button
                        title="View Detailed P&L"
                        variant="secondary"
                        className="py-3 h-12"
                    />
                </Card>

                <Card className="mb-4 p-5 rounded-2xl">
                    <View className="flex-row items-center mb-4">
                        <FileText color="#081126" size={24} />
                        <Text className="font-sans-bold text-lg text-primary ml-2">GST Returns</Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-3">
                        <View>
                            <Text className="font-sans-bold text-base text-primary">GSTR-1</Text>
                            <Text className="font-sans-medium text-xs text-muted-foreground">Sales Return</Text>
                        </View>
                        <Button
                            title="Generate"
                            className="h-9 px-4 rounded-lg"
                            textClassName="text-xs"
                        />
                    </View>
                    <View className="h-[1px] bg-border mb-3" />
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="font-sans-bold text-base text-primary">GSTR-3B</Text>
                            <Text className="font-sans-medium text-xs text-muted-foreground">Monthly Return</Text>
                        </View>
                        <Button
                            title="Generate"
                            className="h-9 px-4 rounded-lg"
                            textClassName="text-xs"
                        />
                    </View>
                </Card>

                <Card className="mb-6 p-5 rounded-2xl">
                    <Text className="font-sans-bold text-lg text-primary mb-4">Cashflow</Text>
                    <View className="flex-row">
                        <View className="flex-1 mr-2 bg-green-50 p-4 rounded-xl border border-green-100">
                            <TrendingUp color="#16a34a" size={24} className="mb-2" />
                            <Text className="font-sans-medium text-xs text-muted-foreground mb-1">Cash In</Text>
                            <Text className="font-sans-bold text-base text-green-700">₹ 4,50,000</Text>
                        </View>
                        <View className="flex-1 ml-2 bg-red-50 p-4 rounded-xl border border-red-100">
                            <TrendingDown color="#dc2626" size={24} className="mb-2" />
                            <Text className="font-sans-medium text-xs text-muted-foreground mb-1">Cash Out</Text>
                            <Text className="font-sans-bold text-base text-red-700">₹ 2,15,000</Text>
                        </View>
                    </View>
                </Card>

            </ScrollView>
        </SafeAreaView>
    );
}
