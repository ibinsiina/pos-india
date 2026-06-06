import { useRouter } from "expo-router";
import { ArrowLeft, Plus, Receipt, Wallet, Search, X, Edit, Trash2, Box, Calendar, CreditCard, User } from "lucide-react-native";
import { useState, useRef, useEffect } from "react";
import { Pressable, ScrollView, Text, TextInput, View, Modal, RefreshControl, Alert, Animated, Dimensions, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedModal from "@/components/AnimatedModal";
import Card from "@/components/Card";
import { useAppContext } from "../../context/AppContext";
import "../../../global.css";



export default function ExpensesPurchasesScreen() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [mainTab, setMainTab] = useState<"expenses" | "purchases">("expenses");
    const [purchaseTab, setPurchaseTab] = useState<"All" | "Pending" | "Paid" | "Overdue" | "Draft" | "Sent">("All");

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    const { expenses, addExpense, updateExpense, deleteExpense, purchases, deletePurchase } = useAppContext();

    // Expense Form State
    const [isExpenseFormVisible, setIsExpenseFormVisible] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [expenseFormData, setExpenseFormData] = useState({
        category: "",
        amount: "",
        paymentMode: "UPI",
        vendorName: "",
    });

    // Details Modals State
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [selectedPurchase, setSelectedPurchase] = useState<Invoice | null>(null);

    // Filter Logic
    const filteredExpenses = expenses.filter(exp => {
        const vendor = exp.vendorName || "";
        const cat = exp.category || "";
        return vendor.toLowerCase().includes(search.toLowerCase()) || cat.toLowerCase().includes(search.toLowerCase());
    });

    const filteredPurchases = purchases.filter(pur => {
        const matchesTab = purchaseTab === "All" || pur.status === purchaseTab;
        const vendorName = pur.vendorName || pur.customerName || "";
        const matchesSearch = vendorName.toLowerCase().includes(search.toLowerCase()) || pur.number.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // Summaries
    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalPurchasesOutstanding = filteredPurchases.reduce((sum, pur) => {
        if (pur.status === "Pending" || pur.status === "Overdue" || pur.status === "Partially Paid") {
            return sum + pur.total;
        }
        return sum;
    }, 0);

    // Expense Handlers
    const openExpenseForm = (exp?: Expense) => {
        if (exp) {
            setEditingExpense(exp);
            setExpenseFormData({
                category: exp.category,
                amount: exp.amount.toString(),
                paymentMode: exp.paymentMode,
                vendorName: exp.vendorName || "",
            });
        } else {
            setEditingExpense(null);
            setExpenseFormData({ category: "", amount: "", paymentMode: "UPI", vendorName: "" });
        }
        setIsExpenseFormVisible(true);
        setSelectedExpense(null); // close details if open
    };

    const handleSaveExpense = () => {
        if (!expenseFormData.category || !expenseFormData.amount) {
            Alert.alert("Error", "Please fill category and amount.");
            return;
        }

        const expData: Expense = {
            id: editingExpense ? editingExpense.id : `exp-${Date.now()}`,
            date: editingExpense ? editingExpense.date : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            category: expenseFormData.category,
            amount: parseFloat(expenseFormData.amount),
            paymentMode: expenseFormData.paymentMode as any,
            vendorName: expenseFormData.vendorName,
        };

        if (editingExpense) updateExpense(expData);
        else addExpense(expData);

        setIsExpenseFormVisible(false);
    };

    const handleDeleteExpense = (id: string) => {
        Alert.alert("Delete Expense", "Are you sure you want to delete this expense?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => { deleteExpense(id); setSelectedExpense(null); } }
        ]);
    };

    // Purchase Handlers
    const handleDeletePurchase = (id: string) => {
        Alert.alert("Delete Purchase", "Are you sure you want to delete this purchase document?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => { deletePurchase(id); setSelectedPurchase(null); } }
        ]);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Paid": return "bg-green-100 text-green-700";
            case "Pending": return "bg-amber-100 text-amber-700";
            case "Overdue": return "bg-red-100 text-red-700";
            case "Draft": return "bg-slate-100 text-slate-700";
            case "Sent": return "bg-blue-100 text-blue-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center p-5 bg-white shadow-sm z-10">
                <Pressable onPress={() => router.back()} className="mr-4">
                    <ArrowLeft color="#081126" size={24} />
                </Pressable>
                <Text className="text-2xl font-sans-bold text-primary">Expenses & Purchases</Text>
            </View>

            {/* Main Tabs */}
            <View className="bg-white border-b border-border">
                <View className="flex-row px-5 py-3">
                    {[
                        { id: "expenses", label: "Expenses" },
                        { id: "purchases", label: "Purchases" }
                    ].map((t) => (
                        <Pressable 
                            key={t.id}
                            onPress={() => setMainTab(t.id as any)}
                            className={`mr-3 px-4 py-2 rounded-full border ${mainTab === t.id ? 'bg-primary border-primary' : 'bg-transparent border-border'}`}
                        >
                            <Text className={`font-sans-medium ${mainTab === t.id ? 'text-white' : 'text-muted-foreground'}`}>{t.label}</Text>
                        </Pressable>
                    ))}
                </View>

                {mainTab === 'purchases' && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 pb-3">
                        {["All", "Pending", "Paid", "Overdue", "Draft", "Sent"].map((t) => (
                            <Pressable 
                                key={t}
                                onPress={() => setPurchaseTab(t as any)}
                                className={`mr-2 px-3 py-1 rounded-md border ${purchaseTab === t ? 'bg-slate-200 border-slate-300' : 'bg-transparent border-transparent'}`}
                            >
                                <Text className={`font-sans-medium text-xs ${purchaseTab === t ? 'text-primary' : 'text-muted-foreground'}`}>{t}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* Summary Cards */}
            <View className="px-5 mt-4 mb-2">
                <View className="bg-white rounded-2xl p-4 flex-row border border-border shadow-sm">
                    {mainTab === 'expenses' ? (
                        <View className="flex-1 pl-2">
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Total Expenses</Text>
                            <Text className="font-sans-bold text-lg text-primary">₹ {totalExpenses.toLocaleString('en-IN')}</Text>
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mt-1">Based on current filters</Text>
                        </View>
                    ) : (
                        <View className="flex-1 pl-2">
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Total Outstanding Bills</Text>
                            <Text className="font-sans-bold text-lg text-red-500">₹ {totalPurchasesOutstanding.toLocaleString('en-IN')}</Text>
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mt-1">Based on current filters</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Search */}
            <View className="px-5 mt-2 mb-4">
                <View className="flex-row items-center bg-white px-4 h-12 rounded-xl border border-border">
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        className="flex-1 ml-3 h-full font-sans-regular text-base text-primary"
                        placeholder={`Search ${mainTab}...`}
                        placeholderTextColor="#9ca3af"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <ScrollView 
                className="flex-1 px-5" 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#208AEF" />}
            >
                {mainTab === 'expenses' ? (
                    <>
                        {filteredExpenses.map((exp) => (
                            <Card key={exp.id} className="mb-4" isPressable onPress={() => setSelectedExpense(exp)}>
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="flex-row items-center">
                                        <View className="bg-primary/10 p-2 rounded-full mr-3">
                                            <Receipt color="#081126" size={20} />
                                        </View>
                                        <View>
                                            <Text className="font-sans-bold text-base text-primary">{exp.category}</Text>
                                            {exp.vendorName ? (
                                                <Text className="font-sans-medium text-xs text-muted-foreground mt-0.5">{exp.vendorName}</Text>
                                            ) : null}
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className="font-sans-bold text-lg text-primary">₹ {exp.amount.toLocaleString('en-IN')}</Text>
                                        <Text className="font-sans-medium text-xs text-muted-foreground mt-0.5">{exp.date}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center mt-2 border-t border-border pt-2">
                                    <Wallet color="#64748b" size={14} />
                                    <Text className="font-sans-medium text-xs text-slate-500 ml-1.5 uppercase">{exp.paymentMode}</Text>
                                </View>
                            </Card>
                        ))}
                        {filteredExpenses.length === 0 && (
                            <View className="items-center justify-center py-10">
                                <Text className="font-sans-medium text-muted-foreground">No expenses found.</Text>
                            </View>
                        )}
                    </>
                ) : (
                    <>
                        {filteredPurchases.map((pur) => (
                            <Card key={pur.id} className="mb-4" isPressable onPress={() => setSelectedPurchase(pur)}>
                                <View className="flex-row justify-between items-start mb-3">
                                    <View>
                                        <Text className="font-sans-bold text-base text-primary">{pur.vendorName || pur.customerName}</Text>
                                        <Text className="font-sans-medium text-xs text-muted-foreground mt-1">{pur.number} • {pur.date}</Text>
                                    </View>
                                    <View className={`px-2 py-1 rounded-md ${getStatusColor(pur.status).split(' ')[0]}`}>
                                        <Text className={`font-sans-bold text-[10px] uppercase ${getStatusColor(pur.status).split(' ')[1]}`}>
                                            {pur.status}
                                        </Text>
                                    </View>
                                </View>

                                <View className="h-[1px] w-full bg-border mb-3" />

                                <View className="flex-row justify-between items-center">
                                    <View>
                                        <Text className="font-sans-medium text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Type</Text>
                                        <Text className="font-sans-bold text-sm text-primary">{pur.type}</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="font-sans-medium text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total Amount</Text>
                                        <Text className="font-sans-bold text-lg text-primary">₹ {pur.total.toLocaleString('en-IN')}</Text>
                                    </View>
                                </View>
                            </Card>
                        ))}
                        {filteredPurchases.length === 0 && (
                            <View className="items-center justify-center py-10">
                                <Text className="font-sans-medium text-muted-foreground">No purchases found.</Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            {/* Floating Action Button */}
            <Pressable
                onPress={() => {
                    if (mainTab === 'expenses') openExpenseForm();
                    else router.push('/(app)/create-purchase');
                }}
                className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-primary"
                style={{
                    elevation: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                }}
            >
                <Plus color="white" size={32} />
            </Pressable>

            {/* Expense Details Modal */}
            <AnimatedModal visible={!!selectedExpense} onClose={() => setSelectedExpense(null)}>
                <View className="bg-white rounded-t-3xl p-8 min-h-[350px]">
                    {selectedExpense && (
                        <>
                            <View className="flex-row justify-between items-start mb-6">
                                <View className="flex-1 mr-4">
                                    <Text className="font-sans-bold text-2xl text-primary mb-1">{selectedExpense.category}</Text>
                                    <Text className="font-sans-medium text-base text-muted-foreground">{selectedExpense.date}</Text>
                                </View>
                                <Pressable onPress={() => setSelectedExpense(null)} className="p-2 bg-muted rounded-full">
                                    <X color="#64748b" size={20} />
                                </Pressable>
                            </View>

                            <View className="bg-muted p-4 rounded-2xl mb-6">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Amount</Text>
                                <Text className="font-sans-bold text-3xl text-primary">
                                    ₹ {selectedExpense.amount.toLocaleString('en-IN')}
                                </Text>
                            </View>

                            <View className="mb-8">
                                <View className="flex-row items-center mb-6">
                                    <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                                        <User color="#208AEF" size={24} />
                                    </View>
                                    <View>
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Vendor / Payee</Text>
                                        <Text className="font-sans-bold text-base text-primary">{selectedExpense.vendorName || 'Not Specified'}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center">
                                    <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                                        <CreditCard color="#9333ea" size={24} />
                                    </View>
                                    <View>
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Payment Mode</Text>
                                        <Text className="font-sans-bold text-base text-primary uppercase">{selectedExpense.paymentMode}</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row space-x-4">
                                <Pressable
                                    onPress={() => openExpenseForm(selectedExpense)}
                                    className="flex-1 bg-blue-100 py-4 rounded-xl flex-row justify-center items-center mr-2"
                                >
                                    <Edit color="#208AEF" size={18} className="mr-2" />
                                    <Text className="font-sans-bold text-primary text-base">Edit</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => handleDeleteExpense(selectedExpense.id)}
                                    className="flex-1 border border-red-200 py-4 rounded-xl flex-row justify-center items-center ml-2"
                                >
                                    <Trash2 color="#ef4444" size={18} className="mr-2" />
                                    <Text className="font-sans-bold text-red-500 text-base">Delete</Text>
                                </Pressable>
                            </View>
                        </>
                    )}
                </View>
            </AnimatedModal>

            {/* Purchase Details Modal */}
            <AnimatedModal visible={!!selectedPurchase} onClose={() => setSelectedPurchase(null)}>
                <View className="bg-white rounded-t-3xl p-8 min-h-[400px]">
                    {selectedPurchase && (
                        <>
                            <View className="flex-row justify-between items-start mb-6">
                                <View className="flex-1 mr-4">
                                    <Text className="font-sans-bold text-2xl text-primary mb-1">{selectedPurchase.vendorName || selectedPurchase.customerName}</Text>
                                    <Text className="font-sans-medium text-base text-muted-foreground">{selectedPurchase.type} • {selectedPurchase.number}</Text>
                                </View>
                                <Pressable onPress={() => setSelectedPurchase(null)} className="p-2 bg-muted rounded-full">
                                    <X color="#64748b" size={20} />
                                </Pressable>
                            </View>

                            <View className="bg-muted p-4 rounded-2xl mb-6 flex-row justify-between items-center">
                                <View>
                                    <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Total Amount</Text>
                                    <Text className="font-sans-bold text-3xl text-primary">
                                        ₹ {selectedPurchase.total.toLocaleString('en-IN')}
                                    </Text>
                                </View>
                                <View className={`px-3 py-1.5 rounded-md ${getStatusColor(selectedPurchase.status).split(' ')[0]}`}>
                                    <Text className={`font-sans-bold text-xs uppercase ${getStatusColor(selectedPurchase.status).split(' ')[1]}`}>
                                        {selectedPurchase.status}
                                    </Text>
                                </View>
                            </View>

                            <View className="mb-8">
                                <View className="flex-row items-center mb-6">
                                    <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                                        <Calendar color="#208AEF" size={24} />
                                    </View>
                                    <View>
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Date</Text>
                                        <Text className="font-sans-bold text-base text-primary">{selectedPurchase.date}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center">
                                    <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                                        <Box color="#9333ea" size={24} />
                                    </View>
                                    <View>
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Items Included</Text>
                                        <Text className="font-sans-bold text-base text-primary">{selectedPurchase.items?.length || 0} Items</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row space-x-4">
                                <Pressable
                                    onPress={() => alert("Marking as Paid is mocked for now.")}
                                    className="flex-1 bg-primary py-4 rounded-xl flex-row justify-center items-center mr-2"
                                >
                                    <Wallet color="white" size={18} className="mr-2" />
                                    <Text className="font-sans-bold text-white text-base">Mark Paid</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => handleDeletePurchase(selectedPurchase.id)}
                                    className="flex-1 border border-red-200 py-4 rounded-xl flex-row justify-center items-center ml-2"
                                >
                                    <Trash2 color="#ef4444" size={18} className="mr-2" />
                                    <Text className="font-sans-bold text-red-500 text-base">Delete</Text>
                                </Pressable>
                            </View>
                        </>
                    )}
                </View>
            </AnimatedModal>

            {/* Form Modal for Add/Edit Expense */}
            <AnimatedModal visible={isExpenseFormVisible} onClose={() => setIsExpenseFormVisible(false)} avoidKeyboard>
                <View className="bg-white rounded-t-3xl h-[75%] p-5 pb-12 shadow-xl flex-col">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-sans-bold text-xl text-primary">
                            {editingExpense ? 'Edit Expense' : 'Add Expense'}
                        </Text>
                        <Pressable onPress={() => setIsExpenseFormVisible(false)} className="p-2 bg-muted rounded-full">
                            <X color="#64748b" size={20} />
                        </Pressable>
                    </View>
                    
                    <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                        <View className="mb-4">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Amount (₹)</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-4 py-3 font-sans-bold text-lg text-primary"
                                keyboardType="numeric"
                                placeholder="0.00"
                                value={expenseFormData.amount}
                                onChangeText={t => setExpenseFormData({...expenseFormData, amount: t})}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Category</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-4 py-3 font-sans-medium text-primary"
                                placeholder="e.g. Office Supplies, Travel"
                                value={expenseFormData.category}
                                onChangeText={t => setExpenseFormData({...expenseFormData, category: t})}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Vendor/Payee (Optional)</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-4 py-3 font-sans-medium text-primary"
                                placeholder="e.g. Amazon, Uber"
                                value={expenseFormData.vendorName}
                                onChangeText={t => setExpenseFormData({...expenseFormData, vendorName: t})}
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Payment Mode</Text>
                            <View className="flex-row flex-wrap gap-2 mt-1">
                                {["UPI", "Cash", "Credit Card", "Bank Transfer"].map(mode => (
                                    <Pressable 
                                        key={mode}
                                        onPress={() => setExpenseFormData({...expenseFormData, paymentMode: mode})}
                                        className={`px-4 py-2 rounded-full border ${expenseFormData.paymentMode === mode ? 'bg-primary border-primary' : 'bg-white border-border'}`}
                                    >
                                        <Text className={`font-sans-medium text-sm ${expenseFormData.paymentMode === mode ? 'text-white' : 'text-primary'}`}>
                                            {mode}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    <Pressable 
                        onPress={handleSaveExpense}
                        className="bg-primary rounded-xl py-4 items-center shadow-md shadow-primary/30"
                    >
                        <Text className="font-sans-bold text-white text-lg">Save Expense</Text>
                    </Pressable>
                </View>
            </AnimatedModal>
        </SafeAreaView>
    );
}
