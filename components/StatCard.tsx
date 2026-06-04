import { Text, View } from "react-native";
import "../global.css";

type Props = {
    title: string;
    amount: number;
    gstAmount: number;
    currency: string;
};

export default function StatCard({ title, amount, gstAmount, currency }: Props) {
    const formattedAmount = amount.toLocaleString('en-IN');
    const formattedGst = gstAmount.toLocaleString('en-IN');

    return (
        <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm border border-white/50" style={{ elevation: 2 }}>
            <Text className="text-base font-sans-medium text-primary mb-2">
                {title}
            </Text>
            <Text className="text-[22px] font-sans-bold text-primary mb-1">
                {currency} {formattedAmount}
            </Text>
            <Text className="text-sm font-sans-medium text-muted-foreground">
                +GST {currency}{formattedGst}
            </Text>
        </View>
    );
}
