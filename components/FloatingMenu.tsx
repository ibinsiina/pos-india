import { useEffect } from "react";
import {
    Modal,
    Pressable,
    Text,
    View,
} from "react-native";

import { BlurView } from "expo-blur";

import { useRouter } from "expo-router";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import {
    Boxes,
    FileBarChart,
    LayoutDashboard,
    ReceiptText,
    Settings,
    Users,
    Wallet,
    ArrowDown,
} from "lucide-react-native";

type Props = {
    visible: boolean;
    onClose: () => void;
};

const menuItems = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/(app)/dashboard",
    },
    {
        label: "Customers | Vendors",
        icon: Users,
        href: "/(app)/customers-vendors",
    },
    {
        label: "Products | Services",
        icon: Boxes,
        href: "/(app)/products-services",
    },
    {
        label: "Invoice",
        icon: ReceiptText,
        href: "/(app)/invoice",
    },
    {
        label: "Payment",
        icon: Wallet,
        href: "/(app)/payment",
    },
    {
        label: "Reports",
        icon: FileBarChart,
        href: "/(app)/reports",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/(app)/settings",
    },
];

export default function FloatingMenu({
    visible,
    onClose,
}: Props) {
    const router = useRouter();
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            scale.value = withTiming(1, {
                duration: 250,
            });

            opacity.value = withTiming(1, {
                duration: 250,
            });
        } else {
            scale.value = withTiming(0.8, {
                duration: 180,
            });

            opacity.value = withTiming(0, {
                duration: 180,
            });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            {
                scale: scale.value,
            },
        ],
    }));

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
        >
            <Pressable
                className="flex-1"
                onPress={onClose}
            >
                <BlurView
                    intensity={12}
                    tint="light"
                    className="absolute inset-0"
                />

                <View className="flex-1 justify-end items-end px-5 pb-24">
                    <Animated.View
                        style={[
                            animatedStyle,
                            {
                                width: 300,
                                borderRadius: 32,
                                backgroundColor: "white",
                                padding: 20,
                                elevation: 15,
                                shadowOpacity: 0.15,
                                shadowRadius: 20,
                            },
                        ]}
                    >
                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Pressable
                                    key={item.label}
                                    className="flex-row items-center py-4"
                                    onPress={() => {
                                        onClose();
                                        router.push(item.href as any);
                                    }}
                                >
                                    <Icon
                                        color="#081126"
                                        size={22}
                                        strokeWidth={2}
                                    />

                                    <Text className="ml-4 text-base font-sans-medium text-primary">
                                        {item.label}
                                    </Text>
                                </Pressable>
                            );
                        })}

                        <Pressable className="mt-2 flex-row items-center justify-center rounded-3xl border border-primary py-3">
                            <ArrowDown size={18} color="#081126" />

                            <Text className="ml-2 text-sm font-sans-medium text-primary">
                                F.Y. 2026-2027
                            </Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </Pressable>
        </Modal>
    );
}