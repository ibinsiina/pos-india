import { useRouter } from "expo-router";
import { ArrowLeft, Download, FileBarChart, FileText, TrendingDown, TrendingUp, X, CheckCircle, ArrowUpRight, ArrowDownLeft } from "lucide-react-native";
import { useState, useRef, useEffect } from "react";
import { Pressable, ScrollView, Text, View, RefreshControl, Modal, Animated, Dimensions, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedModal from "@/components/AnimatedModal";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { useAppContext } from "../../context/AppContext";
import "../../../global.css";



export default function ReportsScreen() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedReport, setSelectedReport] = useState<'pnl' | 'gst' | 'cashflow' | null>(null);

    const { invoices, purchases, expenses, payments } = useAppContext();

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    // --- PROFIT & LOSS CALCULATIONS ---
    const activeInvoices = invoices.filter(i => i.status !== 'Cancelled' && i.status !== 'Draft');
    const activePurchases = purchases.filter(p => p.status !== 'Cancelled' && p.status !== 'Draft');

    const revenue = activeInvoices.reduce((sum, i) => sum + i.subtotal, 0); // Excluding taxes for P&L
    const cogs = activePurchases.reduce((sum, p) => sum + p.subtotal, 0); // Cost of Goods Sold
    const operatingExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - operatingExpenses;

    // --- GST CALCULATIONS ---
    const outputCGST = activeInvoices.reduce((sum, i) => sum + i.cgstAmount, 0);
    const outputSGST = activeInvoices.reduce((sum, i) => sum + i.sgstAmount, 0);
    const outputIGST = activeInvoices.reduce((sum, i) => sum + i.igstAmount, 0);
    const totalOutputTax = outputCGST + outputSGST + outputIGST;

    const inputCGST = activePurchases.reduce((sum, p) => sum + p.cgstAmount, 0);
    const inputSGST = activePurchases.reduce((sum, p) => sum + p.sgstAmount, 0);
    const inputIGST = activePurchases.reduce((sum, p) => sum + p.igstAmount, 0);
    const totalInputTax = inputCGST + inputSGST + inputIGST;

    const estimatedLiability = totalOutputTax - totalInputTax;

    // --- CASHFLOW CALCULATIONS ---
    const cashIn = payments.filter(p => p.type === 'in').reduce((sum, p) => sum + p.amount, 0);
    const cashOut = payments.filter(p => p.type === 'out').reduce((sum, p) => sum + p.amount, 0);
    const netCashflow = cashIn - cashOut;

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

            <ScrollView 
                className="flex-1 px-5" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#208AEF" />}
            >
                {/* Profit & Loss Card */}
                <Card className="mb-4 p-5 rounded-2xl" isPressable onPress={() => setSelectedReport('pnl')}>
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <FileBarChart color="#081126" size={24} />
                            <Text className="font-sans-bold text-lg text-primary ml-2">Profit & Loss</Text>
                        </View>
                        <Text className="font-sans-medium text-xs text-muted-foreground uppercase">YTD</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="font-sans-medium text-muted-foreground">Gross Profit</Text>
                        <Text className={`font-sans-bold ${grossProfit >= 0 ? 'text-primary' : 'text-red-500'}`}>
                            ₹ {Math.abs(grossProfit).toLocaleString('en-IN')}
                        </Text>
                    </View>
                    <View className="flex-row justify-between mb-4">
                        <Text className="font-sans-medium text-muted-foreground">Net Profit</Text>
                        <Text className={`font-sans-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {netProfit < 0 ? '- ' : ''}₹ {Math.abs(netProfit).toLocaleString('en-IN')}
                        </Text>
                    </View>
                    <Button
                        title="View Detailed P&L"
                        variant="secondary"
                        className="py-3 h-12"
                        onPress={() => setSelectedReport('pnl')}
                    />
                </Card>

                {/* GST Returns Card */}
                <Card className="mb-4 p-5 rounded-2xl" isPressable onPress={() => setSelectedReport('gst')}>
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <FileText color="#081126" size={24} />
                            <Text className="font-sans-bold text-lg text-primary ml-2">GST Overview</Text>
                        </View>
                    </View>
                    
                    <View className="flex-row justify-between mb-2">
                        <Text className="font-sans-medium text-muted-foreground">Output Tax (Collected)</Text>
                        <Text className="font-sans-bold text-primary">₹ {totalOutputTax.toLocaleString('en-IN')}</Text>
                    </View>
                    <View className="flex-row justify-between mb-4">
                        <Text className="font-sans-medium text-muted-foreground">Input Tax (ITC)</Text>
                        <Text className="font-sans-bold text-primary">₹ {totalInputTax.toLocaleString('en-IN')}</Text>
                    </View>
                    <View className="h-[1px] bg-border mb-3" />
                    <View className="flex-row justify-between items-center">
                        <Text className="font-sans-bold text-primary">Est. Liability</Text>
                        <Text className={`font-sans-bold ${estimatedLiability > 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {estimatedLiability > 0 ? `Payable ₹ ${estimatedLiability.toLocaleString('en-IN')}` : `Refund ₹ ${Math.abs(estimatedLiability).toLocaleString('en-IN')}`}
                        </Text>
                    </View>
                </Card>

                {/* Cashflow Card */}
                <Card className="mb-6 p-5 rounded-2xl" isPressable onPress={() => setSelectedReport('cashflow')}>
                    <Text className="font-sans-bold text-lg text-primary mb-4">Cashflow</Text>
                    <View className="flex-row mb-4">
                        <View className="flex-1 mr-2 bg-green-50 p-4 rounded-xl border border-green-100">
                            <TrendingUp color="#16a34a" size={24} className="mb-2" />
                            <Text className="font-sans-medium text-xs text-muted-foreground mb-1">Cash In</Text>
                            <Text className="font-sans-bold text-base text-green-700">₹ {cashIn.toLocaleString('en-IN')}</Text>
                        </View>
                        <View className="flex-1 ml-2 bg-red-50 p-4 rounded-xl border border-red-100">
                            <TrendingDown color="#dc2626" size={24} className="mb-2" />
                            <Text className="font-sans-medium text-xs text-muted-foreground mb-1">Cash Out</Text>
                            <Text className="font-sans-bold text-base text-red-700">₹ {cashOut.toLocaleString('en-IN')}</Text>
                        </View>
                    </View>
                    <View className="flex-row justify-between items-center bg-slate-50 p-3 rounded-lg border border-border">
                        <Text className="font-sans-bold text-primary">Net Cashflow</Text>
                        <Text className={`font-sans-bold ${netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {netCashflow < 0 ? '- ' : ''}₹ {Math.abs(netCashflow).toLocaleString('en-IN')}
                        </Text>
                    </View>
                </Card>

            </ScrollView>

            {/* P&L Details Modal */}
            <AnimatedModal visible={selectedReport === 'pnl'} onClose={() => setSelectedReport(null)}>
                <View className="bg-white rounded-t-3xl p-6 min-h-[500px]">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-sans-bold text-2xl text-primary">Profit & Loss</Text>
                        <Pressable onPress={() => setSelectedReport(null)} className="p-2 bg-muted rounded-full">
                            <X color="#64748b" size={20} />
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="mb-6">
                            <Text className="font-sans-bold text-lg text-primary mb-3">Operating Income</Text>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">Total Sales Revenue</Text>
                                <Text className="font-sans-bold text-primary">₹ {revenue.toLocaleString('en-IN')}</Text>
                            </View>
                            <View className="h-[1px] bg-border my-2" />
                            <View className="flex-row justify-between">
                                <Text className="font-sans-bold text-primary">Total Income</Text>
                                <Text className="font-sans-bold text-primary">₹ {revenue.toLocaleString('en-IN')}</Text>
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="font-sans-bold text-lg text-primary mb-3">Cost of Goods Sold (COGS)</Text>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">Purchases / Bills</Text>
                                <Text className="font-sans-bold text-primary">₹ {cogs.toLocaleString('en-IN')}</Text>
                            </View>
                            <View className="h-[1px] bg-border my-2" />
                            <View className="flex-row justify-between">
                                <Text className="font-sans-bold text-primary">Total COGS</Text>
                                <Text className="font-sans-bold text-primary">₹ {cogs.toLocaleString('en-IN')}</Text>
                            </View>
                        </View>

                        <View className="bg-slate-50 p-4 rounded-xl border border-border mb-6 flex-row justify-between">
                            <Text className="font-sans-bold text-primary text-base">Gross Profit</Text>
                            <Text className="font-sans-bold text-primary text-base">₹ {grossProfit.toLocaleString('en-IN')}</Text>
                        </View>

                        <View className="mb-6">
                            <Text className="font-sans-bold text-lg text-primary mb-3">Operating Expenses</Text>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">Indirect Expenses</Text>
                                <Text className="font-sans-bold text-primary">₹ {operatingExpenses.toLocaleString('en-IN')}</Text>
                            </View>
                            <View className="h-[1px] bg-border my-2" />
                            <View className="flex-row justify-between">
                                <Text className="font-sans-bold text-primary">Total Expenses</Text>
                                <Text className="font-sans-bold text-primary">₹ {operatingExpenses.toLocaleString('en-IN')}</Text>
                            </View>
                        </View>

                        <View className={`p-4 rounded-xl border mb-8 flex-row justify-between ${netProfit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <Text className={`font-sans-bold text-lg ${netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>Net Profit</Text>
                            <Text className={`font-sans-bold text-lg ${netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                {netProfit < 0 ? '- ' : ''}₹ {Math.abs(netProfit).toLocaleString('en-IN')}
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </AnimatedModal>

            {/* GST Details Modal */}
            <AnimatedModal visible={selectedReport === 'gst'} onClose={() => setSelectedReport(null)}>
                <View className="bg-white rounded-t-3xl p-6 min-h-[450px]">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-sans-bold text-2xl text-primary">GST Overview</Text>
                        <Pressable onPress={() => setSelectedReport(null)} className="p-2 bg-muted rounded-full">
                            <X color="#64748b" size={20} />
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="mb-6 bg-slate-50 p-4 rounded-xl border border-border">
                            <Text className="font-sans-bold text-lg text-primary mb-4">Output Tax (Sales)</Text>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">CGST Collected</Text>
                                <Text className="font-sans-bold text-primary">₹ {outputCGST.toLocaleString('en-IN')}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">SGST Collected</Text>
                                <Text className="font-sans-bold text-primary">₹ {outputSGST.toLocaleString('en-IN')}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">IGST Collected</Text>
                                <Text className="font-sans-bold text-primary">₹ {outputIGST.toLocaleString('en-IN')}</Text>
                            </View>
                            <View className="h-[1px] bg-border my-2" />
                            <View className="flex-row justify-between">
                                <Text className="font-sans-bold text-primary">Total Output Tax</Text>
                                <Text className="font-sans-bold text-primary">₹ {totalOutputTax.toLocaleString('en-IN')}</Text>
                            </View>
                        </View>

                        <View className="mb-6 bg-slate-50 p-4 rounded-xl border border-border">
                            <Text className="font-sans-bold text-lg text-primary mb-4">Input Tax Credit (Purchases)</Text>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">CGST Paid</Text>
                                <Text className="font-sans-bold text-primary">₹ {inputCGST.toLocaleString('en-IN')}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">SGST Paid</Text>
                                <Text className="font-sans-bold text-primary">₹ {inputSGST.toLocaleString('en-IN')}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">IGST Paid</Text>
                                <Text className="font-sans-bold text-primary">₹ {inputIGST.toLocaleString('en-IN')}</Text>
                            </View>
                            <View className="h-[1px] bg-border my-2" />
                            <View className="flex-row justify-between">
                                <Text className="font-sans-bold text-primary">Total Input Tax</Text>
                                <Text className="font-sans-bold text-primary">₹ {totalInputTax.toLocaleString('en-IN')}</Text>
                            </View>
                        </View>

                        <View className={`p-4 rounded-xl border mb-8 flex-row justify-between ${estimatedLiability > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                            <Text className={`font-sans-bold text-lg ${estimatedLiability > 0 ? 'text-red-700' : 'text-green-700'}`}>Estimated Liability</Text>
                            <Text className={`font-sans-bold text-lg ${estimatedLiability > 0 ? 'text-red-700' : 'text-green-700'}`}>
                                {estimatedLiability > 0 ? `Payable ₹ ${estimatedLiability.toLocaleString('en-IN')}` : `Refund ₹ ${Math.abs(estimatedLiability).toLocaleString('en-IN')}`}
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </AnimatedModal>

            {/* Cashflow Details Modal */}
            <AnimatedModal visible={selectedReport === 'cashflow'} onClose={() => setSelectedReport(null)}>
                <View className="bg-white rounded-t-3xl p-6 min-h-[400px]">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-sans-bold text-2xl text-primary">Cashflow Summary</Text>
                        <Pressable onPress={() => setSelectedReport(null)} className="p-2 bg-muted rounded-full">
                            <X color="#64748b" size={20} />
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="mb-6">
                            <Text className="font-sans-bold text-lg text-primary mb-4">Cash Sources</Text>
                            <View className="flex-row items-center justify-between mb-3 bg-green-50 p-4 rounded-xl border border-green-100">
                                <View className="flex-row items-center">
                                    <View className="bg-green-100 p-2 rounded-full mr-3">
                                        <ArrowDownLeft color="#16a34a" size={20} />
                                    </View>
                                    <Text className="font-sans-bold text-green-800">Total Money In</Text>
                                </View>
                                <Text className="font-sans-bold text-lg text-green-700">₹ {cashIn.toLocaleString('en-IN')}</Text>
                            </View>

                            <View className="flex-row items-center justify-between mb-3 bg-red-50 p-4 rounded-xl border border-red-100">
                                <View className="flex-row items-center">
                                    <View className="bg-red-100 p-2 rounded-full mr-3">
                                        <ArrowUpRight color="#dc2626" size={20} />
                                    </View>
                                    <Text className="font-sans-bold text-red-800">Total Money Out</Text>
                                </View>
                                <Text className="font-sans-bold text-lg text-red-700">₹ {cashOut.toLocaleString('en-IN')}</Text>
                            </View>
                        </View>

                        <View className="bg-slate-50 p-4 rounded-xl border border-border mb-8">
                            <Text className="font-sans-bold text-primary mb-2">Net Cash Movement</Text>
                            <Text className={`font-sans-bold text-3xl ${netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {netCashflow < 0 ? '- ' : ''}₹ {Math.abs(netCashflow).toLocaleString('en-IN')}
                            </Text>
                            <Text className="font-sans-medium text-xs text-muted-foreground mt-2">
                                {netCashflow >= 0 ? 'You have generated positive cash flow.' : 'You have burned more cash than you generated.'}
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </AnimatedModal>

        </SafeAreaView>
    );
}
