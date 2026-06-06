import AnimatedModal from "@/components/AnimatedModal";
import { useRouter } from "expo-router";
import { ArrowLeft, Edit, Phone, Plus, Save, Search, Trash2, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions, KeyboardAvoidingView, Linking, Modal, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "@/components/Card";
import { useAppContext } from "../../context/AppContext";
import "../../../global.css";



export default function CustomersVendorsScreen() {
    const router = useRouter();
    const [tab, setTab] = useState<"customer" | "vendor" | "both">("customer");
    const [search, setSearch] = useState("");

    // State for refreshing
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    // State for data
    const { parties, addParty, updateParty, deleteParty } = useAppContext();

    // State for Details Modal
    const [selectedParty, setSelectedParty] = useState<Party | null>(null);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

    // State for Form Modal
    const [isFormModalVisible, setIsFormModalVisible] = useState(false);
    const [editingParty, setEditingParty] = useState<Party | null>(null);
    const [formData, setFormData] = useState<Partial<Party> & { balanceString: string; balanceType: string }>({
        name: "",
        gstin: "",
        phone: "",
        balanceString: "0",
        type: "customer",
        balanceType: "receivable"
    });
    const [showMoreDetails, setShowMoreDetails] = useState(false);

    const filteredParties = parties.filter(
        p => p.type === tab && p.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalReceivable = filteredParties.reduce((sum, p) => p.balance > 0 ? sum + p.balance : sum, 0);
    const totalPayable = filteredParties.reduce((sum, p) => p.balance < 0 ? sum + Math.abs(p.balance) : sum, 0);

    const openDetailsModal = (party: Party) => {
        setSelectedParty(party);
        setIsDetailsModalVisible(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalVisible(false);
        setSelectedParty(null);
    };

    const openFormModal = (party?: Party) => {
        if (party) {
            setEditingParty(party);
            setFormData({
                ...party,
                balanceString: Math.abs(party.balance).toString(),
                balanceType: party.balance > 0 ? "receivable" : "payable",
                type: party.type
            });
            setShowMoreDetails(false); // Default to quick view even on edit, user can expand if needed
        } else {
            setEditingParty(null);
            setFormData({
                name: "",
                gstin: "",
                phone: "",
                balanceString: "0",
                type: tab,
                balanceType: "receivable"
            });
            setShowMoreDetails(false);
        }
        setIsFormModalVisible(true);
        setIsDetailsModalVisible(false); // Close details if open
    };

    const closeFormModal = () => {
        setIsFormModalVisible(false);
        setEditingParty(null);
    };

    const handleCloseFormModal = () => {
        const isDirty = editingParty 
            ? formData.name !== editingParty.name || formData.phone !== editingParty.phone 
            : !!(formData.name || formData.phone);

        if (isDirty) {
            Alert.alert(
                "Discard Changes?",
                "You have unsaved changes. Are you sure you want to discard them?",
                [
                    { text: "Keep Editing", style: "cancel" },
                    { text: "Discard", style: "destructive", onPress: closeFormModal }
                ]
            );
        } else {
            closeFormModal();
        }
    };

    const handleSave = () => {
        if (!formData.name?.trim()) {
            Alert.alert("Error", "Name is required");
            return;
        }
        if (!formData.phone?.trim()) {
            Alert.alert("Error", "Mobile Number is required");
            return;
        }

        const numericBalance = parseFloat(formData.balanceString) || 0;
        const finalBalance = formData.balanceType === "payable" ? -Math.abs(numericBalance) : Math.abs(numericBalance);

        const partyData: Party = {
            ...formData,
            id: editingParty ? editingParty.id : `p${Date.now()}`,
            name: formData.name,
            gstin: formData.gstin,
            phone: formData.phone,
            balance: finalBalance,
            type: formData.type || "customer",
        } as Party;

        delete (partyData as any).balanceString;

        if (editingParty) {
            updateParty(partyData);
        } else {
            addParty(partyData);
        }

        closeFormModal();
        // If we were editing from details modal, update selected party to show new details
        if (editingParty && selectedParty?.id === editingParty.id) {
            setSelectedParty(partyData);
            setIsDetailsModalVisible(true);
        }
    };

    const handleDelete = (partyId: string) => {
        Alert.alert(
            "Delete Party",
            "Are you sure you want to delete this party?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteParty(partyId);
                        closeDetailsModal();
                    }
                }
            ]
        );
    };

    const handleCall = (phone: string) => {
        if (phone) {
            Linking.openURL(`tel:${phone}`);
        } else {
            Alert.alert("No Phone Number", "This party does not have a phone number saved.");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            {/* Header */}
            <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <ArrowLeft color="#081126" size={24} />
                    </Pressable>
                    <Text className="text-2xl font-sans-bold text-primary">Directory</Text>
                </View>
                <Pressable onPress={() => openFormModal()} className="p-2 bg-primary rounded-full">
                    <Plus color="white" size={20} />
                </Pressable>
            </View>

            {/* Tabs */}
            <View className="bg-white">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 py-3 border-b border-border">
                    {[
                        { id: "customer", label: "Customers" },
                        { id: "vendor", label: "Vendors" },
                        { id: "both", label: "Both" }
                    ].map((t) => (
                        <Pressable 
                            key={t.id}
                            onPress={() => setTab(t.id as any)}
                            className={`mr-3 px-4 py-2 rounded-full border ${tab === t.id ? 'bg-primary border-primary' : 'bg-transparent border-border'}`}
                        >
                            <Text className={`font-sans-medium ${tab === t.id ? 'text-white' : 'text-muted-foreground'}`}>{t.label}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Summary Card */}
            <View className="px-5 mb-4">
                <View className="bg-white rounded-2xl p-4 flex-row border border-border shadow-sm">
                    <View className="flex-1 border-r border-border pl-2">
                        <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Total Receivable</Text>
                        <Text className="font-sans-bold text-lg text-green-600">₹ {totalReceivable.toLocaleString('en-IN')}</Text>
                        {tab === 'vendor' && totalReceivable > 0 && (
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mt-1">(Advance: ₹{totalReceivable.toLocaleString('en-IN')})</Text>
                        )}
                    </View>
                    <View className="flex-1 pl-4">
                        <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Total Payable</Text>
                        <Text className="font-sans-bold text-lg text-red-500">₹ {totalPayable.toLocaleString('en-IN')}</Text>
                        {tab === 'customer' && totalPayable > 0 && (
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mt-1">(Advance: ₹{totalPayable.toLocaleString('en-IN')})</Text>
                        )}
                    </View>
                </View>
            </View>

            {/* Search */}
            <View className="px-5 mb-4">
                <View className="flex-row items-center bg-white px-4 h-12 rounded-xl border border-border">
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        className="flex-1 ml-3 h-full font-sans-regular text-base text-primary"
                        placeholder={`Search ${tab}s...`}
                        placeholderTextColor="#9ca3af"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            {/* List */}
            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#208AEF" />
                }
            >
                {filteredParties.map((party) => (
                    <Card key={party.id} className="flex-row justify-between items-center mb-4" isPressable onPress={() => openDetailsModal(party)}>
                        <View className="flex-1">
                            <Text className="font-sans-bold text-lg text-primary mb-1">{party.name}</Text>
                            <Text className="font-sans-regular text-sm text-muted-foreground">GSTIN: {party.gstin}</Text>
                        </View>
                        <View className="items-end">
                            <Text className={`font-sans-bold text-base ${party.balance > 0 ? (tab === 'customer' ? 'text-green-600' : 'text-red-500') : 'text-primary'}`}>
                                ₹ {Math.abs(party.balance).toLocaleString('en-IN')}
                            </Text>
                            <Text className="font-sans-medium text-xs text-muted-foreground">
                                {party.balance > 0 ? (tab === 'customer' ? 'To Receive' : 'To Pay') : 'Advance'}
                            </Text>
                        </View>
                    </Card>
                ))}

                {filteredParties.length === 0 && (
                    <View className="items-center justify-center py-10">
                        <Text className="font-sans-medium text-muted-foreground">No {tab}s found.</Text>
                    </View>
                )}
            </ScrollView>

            {/* Details Modal */}
            <AnimatedModal visible={isDetailsModalVisible} onClose={closeDetailsModal}>
                <View className="bg-white rounded-t-3xl p-8 min-h-[400px]">
                    {selectedParty && (
                        <>
                            <View className="flex-row justify-between items-start mb-6">
                                <View className="flex-1 mr-4">
                                    <Text className="font-sans-bold text-2xl text-primary mb-1">{selectedParty.name}</Text>
                                    <Text className="font-sans-medium text-base text-muted-foreground capitalize">{selectedParty.type}</Text>
                                </View>
                                <Pressable onPress={closeDetailsModal} className="p-2 bg-muted rounded-full">
                                    <X color="#64748b" size={20} />
                                </Pressable>
                            </View>

                            <View className="bg-muted p-4 rounded-2xl mb-6">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Current Balance</Text>
                                <Text className={`font-sans-bold text-3xl ${selectedParty.balance > 0 ? (selectedParty.type === 'customer' ? 'text-green-600' : 'text-red-500') : 'text-primary'}`}>
                                    ₹ {Math.abs(selectedParty.balance).toLocaleString('en-IN')}
                                </Text>
                                <Text className="font-sans-medium text-sm mt-1 text-muted-foreground">
                                    {selectedParty.balance > 0 ? (selectedParty.type === 'customer' ? 'To Receive' : 'To Pay') : 'Advance'}
                                </Text>
                            </View>

                            <View className="mb-8">
                                <View className="flex-row items-center mb-6">
                                    <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                                        <Phone color="#208AEF" size={24} />
                                    </View>
                                    <View>
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Phone Number</Text>
                                        <Text className="font-sans-bold text-base text-primary">{selectedParty.phone || 'N/A'}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center">
                                    <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                                        <Text className="font-sans-bold text-lg text-purple-600">G</Text>
                                    </View>
                                    <View>
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">GSTIN</Text>
                                        <Text className="font-sans-bold text-base text-primary">{selectedParty.gstin || 'N/A'}</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row space-x-4">
                                <Pressable
                                    onPress={() => handleCall(selectedParty.phone)}
                                    className="flex-1 bg-primary py-4 rounded-xl flex-row justify-center items-center mr-2"
                                >
                                    <Phone color="white" size={18} className="mr-2" />
                                    <Text className="font-sans-bold text-white text-base">Call</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => openFormModal(selectedParty)}
                                    className="flex-1 bg-blue-100 py-4 rounded-xl flex-row justify-center items-center ml-2"
                                >
                                    <Edit color="#208AEF" size={18} className="mr-2" />
                                    <Text className="font-sans-bold text-primary text-base">Edit</Text>
                                </Pressable>
                            </View>

                            <Pressable
                                onPress={() => handleDelete(selectedParty.id)}
                                className="mt-4 py-4 rounded-xl flex-row justify-center items-center border border-red-200"
                            >
                                <Trash2 color="#ef4444" size={18} className="mr-2" />
                                <Text className="font-sans-bold text-red-500 text-base">Delete {selectedParty.type === 'customer' ? 'Customer' : 'Vendor'}</Text>
                            </Pressable>
                        </>
                    )}
                </View>
            </AnimatedModal>

            {/* Form Modal */}
            <AnimatedModal visible={isFormModalVisible} onClose={handleCloseFormModal} avoidKeyboard>
                <View className="bg-white rounded-t-3xl p-6 pb-12 h-[92%] flex-col">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-sans-bold text-2xl text-primary">
                            {editingParty ? 'Edit' : 'Add'} {formData.type === 'customer' ? 'Customer' : formData.type === 'vendor' ? 'Vendor' : 'Party'}
                        </Text>
                        <Pressable onPress={handleCloseFormModal} className="p-2 bg-muted rounded-full">
                            <X color="#64748b" size={20} />
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                        {!editingParty && (
                            <View className="flex-row mb-6 bg-muted p-1 rounded-xl">
                                <Pressable
                                    onPress={() => setFormData({ ...formData, type: "customer" })}
                                    className={`flex-1 py-3 items-center rounded-lg ${formData.type === "customer" ? "bg-white shadow-sm" : ""}`}
                                >
                                    <Text className={`font-sans-bold ${formData.type === "customer" ? "text-primary" : "text-muted-foreground"}`}>Customer</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => setFormData({ ...formData, type: "vendor" })}
                                    className={`flex-1 py-3 items-center rounded-lg ${formData.type === "vendor" ? "bg-white shadow-sm" : ""}`}
                                >
                                    <Text className={`font-sans-bold ${formData.type === "vendor" ? "text-primary" : "text-muted-foreground"}`}>Vendor</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => setFormData({ ...formData, type: "both" })}
                                    className={`flex-1 py-3 items-center rounded-lg ${formData.type === "both" ? "bg-white shadow-sm" : ""}`}
                                >
                                    <Text className={`font-sans-bold ${formData.type === "both" ? "text-primary" : "text-muted-foreground"}`}>Both</Text>
                                </Pressable>
                            </View>
                        )}

                        <View className="mb-4">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Business / Person Name *</Text>
                            <TextInput
                                className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                placeholder="Enter name"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Mobile Number *</Text>
                            <TextInput
                                className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                placeholder="e.g. +91 9876543210"
                                keyboardType="phone-pad"
                                value={formData.phone}
                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-2">GSTIN</Text>
                            <TextInput
                                className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                placeholder="e.g. 27AADCR2311G1Z1"
                                autoCapitalize="characters"
                                value={formData.gstin}
                                onChangeText={(text) => setFormData({ ...formData, gstin: text })}
                            />
                        </View>

                        <View className="mb-2">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-4">Opening Balance (₹)</Text>
                            <View className="flex-row items-center mb-4">
                                <Pressable 
                                    onPress={() => setFormData({...formData, balanceType: 'receivable'})}
                                    className="flex-row items-center mr-6"
                                >
                                    <View className={`w-5 h-5 rounded-full border-2 mr-2 items-center justify-center ${formData.balanceType === 'receivable' ? 'border-primary' : 'border-slate-300'}`}>
                                        {formData.balanceType === 'receivable' && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                    </View>
                                    <Text className="font-sans-medium text-primary">Receivable</Text>
                                </Pressable>
                                <Pressable 
                                    onPress={() => setFormData({...formData, balanceType: 'payable'})}
                                    className="flex-row items-center"
                                >
                                    <View className={`w-5 h-5 rounded-full border-2 mr-2 items-center justify-center ${formData.balanceType === 'payable' ? 'border-primary' : 'border-slate-300'}`}>
                                        {formData.balanceType === 'payable' && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                    </View>
                                    <Text className="font-sans-medium text-primary">Payable</Text>
                                </Pressable>
                            </View>
                            <TextInput
                                className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                placeholder="Amount"
                                keyboardType="numeric"
                                value={formData.balanceString}
                                onChangeText={(text) => setFormData({ ...formData, balanceString: text })}
                            />
                        </View>

                        {!showMoreDetails ? (
                            <Pressable 
                                onPress={() => setShowMoreDetails(true)}
                                className="py-6 items-center"
                            >
                                <Text className="font-sans-bold text-primary text-base">+ Add More Details</Text>
                            </Pressable>
                        ) : (
                            <View className="mt-6 border-t border-border pt-6 pb-6">
                                <Text className="font-sans-bold text-lg text-primary mb-4">Recommended Information</Text>
                                
                                <View className="mb-4">
                                    <Text className="font-sans-medium text-sm text-muted-foreground mb-2">PAN (Optional)</Text>
                                    <TextInput
                                        className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                        placeholder="Enter PAN"
                                        autoCapitalize="characters"
                                        value={formData.pan}
                                        onChangeText={(text) => setFormData({ ...formData, pan: text })}
                                    />
                                </View>
                                
                                <Text className="font-sans-bold text-lg text-primary mb-4 mt-6">Contact Details</Text>
                                <View className="mb-4">
                                    <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Contact Person Name</Text>
                                    <TextInput
                                        className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                        placeholder="Name"
                                        value={formData.contactPerson}
                                        onChangeText={(text) => setFormData({ ...formData, contactPerson: text })}
                                    />
                                </View>
                                <View className="mb-4">
                                    <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Email</Text>
                                    <TextInput
                                        className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                        placeholder="Email"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={formData.email}
                                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                                    />
                                </View>

                                <Text className="font-sans-bold text-lg text-primary mb-4 mt-6">Internal Information</Text>
                                <View className="mb-6">
                                    <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Notes</Text>
                                    <TextInput
                                        className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base h-24"
                                        placeholder="Add notes..."
                                        multiline
                                        textAlignVertical="top"
                                        value={formData.notes}
                                        onChangeText={(text) => setFormData({ ...formData, notes: text })}
                                    />
                                </View>

                                <View className="mb-6 p-4 bg-muted rounded-2xl items-center border border-dashed border-slate-300">
                                    <Text className="font-sans-medium text-primary mb-2">Upload Documents</Text>
                                    <Text className="font-sans-regular text-sm text-muted-foreground text-center mb-4">Attach GST Certificate, PAN Card, etc.</Text>
                                    <Pressable className="bg-white px-6 py-3 rounded-full border border-border shadow-sm">
                                        <Text className="font-sans-bold text-primary">Browse Files</Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    <Pressable
                        onPress={handleSave}
                        className="bg-primary py-4 rounded-xl flex-row justify-center items-center shadow-md shadow-primary/30"
                    >
                        <Save color="white" size={20} className="mr-2" />
                        <Text className="font-sans-bold text-white text-lg">Save {formData.type === 'customer' ? 'Customer' : 'Vendor'}</Text>
                    </Pressable>
                </View>
            </AnimatedModal>
        </SafeAreaView>
    );
}

