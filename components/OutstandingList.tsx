import { Text, View } from "react-native";
import "../global.css";

type Props = {
    data: OutstandingSummary;
};

export default function OutstandingList({ data }: Props) {
    return (
        <View className="mb-6">
            <Text className="text-xl font-sans-medium text-primary mb-1">
                {data.title}
            </Text>
            <Text className="text-sm font-sans-medium text-primary mb-4">
                Total Receivables: {data.currency}{(data.totalReceivables).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>

            <View className="border-t border-border" />

            {data.items.map((item, index) => (
                <View key={index}>
                    <View className="flex-row items-center py-3">
                        {/* Dot */}
                        <View
                            className={`size-4 rounded-full mr-3 ${
                                item.status === 'current' ? 'bg-[#98e29a]' : 'bg-[#f09a9a]'
                            }`}
                        />
                        <Text className="flex-1 text-base font-sans-medium text-primary uppercase tracking-wide">
                            {item.label}
                        </Text>
                        <View className="items-end">
                            <Text className="text-base font-sans-medium text-primary">
                                {data.currency}{(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </Text>
                            {item.subtitle && (
                                <Text className="text-sm font-sans-medium text-primary mt-1">
                                    {item.subtitle}
                                </Text>
                            )}
                        </View>
                    </View>
                    {index < data.items.length - 1 && (
                        <View className="border-t border-border" />
                    )}
                </View>
            ))}
            <View className="border-t border-border" />
        </View>
    );
}
