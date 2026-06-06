import { Stack } from "expo-router";

export default function AppLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="pos" />
            <Stack.Screen name="invoice" />
            <Stack.Screen name="create-invoice" />
            <Stack.Screen name="expenses-purchases" />
            <Stack.Screen name="create-purchase" />
            <Stack.Screen name="customers-vendors" />
            <Stack.Screen name="products-services" />
            <Stack.Screen name="payment" />
            <Stack.Screen name="reports" />
            <Stack.Screen name="settings" />
        </Stack>
    );
}
