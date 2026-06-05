import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { ArrowLeft, Briefcase, Package, Plus, Search, X, Save, Edit, Trash2 } from "lucide-react-native";
import { useState, useRef, useEffect } from "react";
import { Pressable, ScrollView, Text, TextInput, View, Animated, Dimensions, Modal, KeyboardAvoidingView, Platform, StyleSheet, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../../components/Card";
import { useAppContext } from "../../context/AppContext";
import "../../../global.css";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedModal = ({ visible, onClose, children, avoidKeyboard }: any) => {
    const [show, setShow] = useState(visible);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setShow(true);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 90
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start(() => setShow(false));
        }
    }, [visible]);

    if (!show) return null;

    const content = (
        <View className="flex-1 justify-end">
            <Pressable className="absolute inset-0" onPress={onClose}>
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
                </Animated.View>
            </Pressable>
            <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
                {children}
            </Animated.View>
        </View>
    );

    return (
        <Modal visible={show} transparent={true} animationType="none" onRequestClose={onClose} statusBarTranslucent>
            {avoidKeyboard && Platform.OS === 'ios' ? (
                <KeyboardAvoidingView behavior="padding" className="flex-1 m-0 p-0">
                    {content}
                </KeyboardAvoidingView>
            ) : (
                <View className="flex-1 m-0 p-0">
                    {content}
                </View>
            )}
        </Modal>
    );
};

export default function ProductsServicesScreen() {
    const router = useRouter();
    const [tab, setTab] = useState<"product" | "service">("product");
    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    // Data State
    const { items, addItem, updateItem, deleteItem } = useAppContext();

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    const filteredItems = items.filter(
        i => i.type === tab && i.name.toLowerCase().includes(search.toLowerCase())
    );

    // Summary Logic
    const totalInventoryValue = filteredItems.reduce((sum, item) => sum + (item.price * (item.stock || 0)), 0);
    const topItem = filteredItems.length > 0 ? filteredItems.reduce((prev, current) => (prev.price > current.price) ? prev : current) : null;

    // Modal States
    const [isFormModalVisible, setIsFormModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [formData, setFormData] = useState<Partial<Item>>({
        name: "",
        type: "product",
        price: 0,
        openingStock: 0,
    });
    const [showMoreDetails, setShowMoreDetails] = useState(false);

    const openFormModal = (item?: Item) => {
        if (item) {
            setEditingItem(item);
            setFormData({ ...item, openingStock: item.stock || 0 });
            setShowMoreDetails(false);
        } else {
            setEditingItem(null);
            setFormData({
                name: "",
                type: tab,
                price: 0,
                openingStock: 0,
            });
            setShowMoreDetails(false);
        }
        setIsFormModalVisible(true);
    };

    const closeFormModal = () => {
        setIsFormModalVisible(false);
        setEditingItem(null);
    };

    const handleCloseFormModal = () => {
        const isDirty = editingItem
            ? formData.name !== editingItem.name || formData.price !== editingItem.price
            : !!(formData.name || formData.price);

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
            Alert.alert("Error", "Item Name is required");
            return;
        }

        const itemData: Item = {
            ...formData,
            id: editingItem ? editingItem.id : `i${Date.now()}`,
            name: formData.name,
            type: formData.type || "product",
            price: Number(formData.price) || 0,
            hsn_sac: formData.hsn_sac || "",
            gst_rate: Number(formData.gst_rate) || 0,
            stock: Number(formData.openingStock) || 0,
        } as Item;

        if (editingItem) {
            updateItem(itemData);
        } else {
            addItem(itemData);
        }

        closeFormModal();
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Item",
            "Are you sure you want to delete this item?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteItem(id)
                }
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <ArrowLeft color="#081126" size={24} />
                    </Pressable>
                    <Text className="text-2xl font-sans-bold text-primary">Catalog</Text>
                </View>
                <Pressable onPress={() => openFormModal()} className="p-2 bg-primary rounded-full">
                    <Plus color="white" size={20} />
                </Pressable>
            </View>

            <View className="bg-white">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 py-3 border-b border-border">
                    {[
                        { id: "product", label: "Products" },
                        { id: "service", label: "Services" }
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
                    {tab === 'product' ? (
                        <View className="flex-1 border-r border-border pl-2">
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Inventory Value</Text>
                            <Text className="font-sans-bold text-lg text-primary">₹ {totalInventoryValue.toLocaleString('en-IN')}</Text>
                        </View>
                    ) : (
                        <View className="flex-1 border-r border-border pl-2">
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Active Services</Text>
                            <Text className="font-sans-bold text-lg text-primary">{filteredItems.length}</Text>
                        </View>
                    )}
                    <View className="flex-1 pl-4 justify-center">
                        <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Top Valued</Text>
                        <Text className="font-sans-bold text-sm text-primary" numberOfLines={1}>{topItem?.name || "None"}</Text>
                        {topItem && <Text className="font-sans-medium text-[10px] text-green-600">₹{topItem.price.toLocaleString('en-IN')}</Text>}
                    </View>
                </View>
            </View>

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

            <ScrollView 
                className="flex-1 px-5" 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#208AEF" />}
            >
                {filteredItems.map((item) => (
                    <Card key={item.id} className="flex-row items-center mb-4 p-4" isPressable onPress={() => openFormModal(item)}>
                        <View className="size-12 rounded-lg bg-[#e3e8fc] items-center justify-center mr-4">
                            {tab === "product" ? (
                                <Package color="#081126" size={24} />
                            ) : (
                                <Briefcase color="#081126" size={24} />
                            )}
                        </View>
                        <View className="flex-1">
                            <Text className="font-sans-bold text-lg text-primary mb-1">{item.name}</Text>
                            <Text className="font-sans-medium text-xs text-muted-foreground">
                                {tab === "product" ? "HSN" : "SAC"}: {item.hsn_sac || "N/A"} • GST @ {item.gst_rate}%
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="font-sans-bold text-base text-primary">
                                ₹ {item.price.toLocaleString('en-IN')}
                            </Text>
                            {tab === "product" && (
                                <Text className="font-sans-medium text-xs text-muted-foreground mt-1">
                                    Stock: <Text className={item.stock && item.stock > 10 ? "text-green-600" : "text-amber-500"}>{item.stock || 0}</Text>
                                </Text>
                            )}
                        </View>
                    </Card>
                ))}

                {filteredItems.length === 0 && (
                    <View className="items-center justify-center py-10">
                        <Text className="font-sans-medium text-muted-foreground">No {tab}s found.</Text>
                    </View>
                )}
            </ScrollView>

            {/* Form Modal */}
            <AnimatedModal visible={isFormModalVisible} onClose={handleCloseFormModal} avoidKeyboard>
                <View className="bg-white rounded-t-3xl p-6 pb-12 h-[92%] flex-col">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-sans-bold text-2xl text-primary">
                            {editingItem ? 'Edit' : 'Add'} {formData.type === 'product' ? 'Product' : 'Service'}
                        </Text>
                        <View className="flex-row items-center">
                            {editingItem && (
                                <Pressable onPress={() => { closeFormModal(); handleDelete(editingItem.id); }} className="p-2 bg-red-50 rounded-full mr-2">
                                    <Trash2 color="#ef4444" size={20} />
                                </Pressable>
                            )}
                            <Pressable onPress={handleCloseFormModal} className="p-2 bg-muted rounded-full">
                                <X color="#64748b" size={20} />
                            </Pressable>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                        {!editingItem && (
                            <View className="flex-row mb-6 bg-muted p-1 rounded-xl">
                                <Pressable
                                    onPress={() => setFormData({ ...formData, type: "product" })}
                                    className={`flex-1 py-3 items-center rounded-lg ${formData.type === "product" ? "bg-white shadow-sm" : ""}`}
                                >
                                    <Text className={`font-sans-bold ${formData.type === "product" ? "text-primary" : "text-muted-foreground"}`}>Product</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => setFormData({ ...formData, type: "service" })}
                                    className={`flex-1 py-3 items-center rounded-lg ${formData.type === "service" ? "bg-white shadow-sm" : ""}`}
                                >
                                    <Text className={`font-sans-bold ${formData.type === "service" ? "text-primary" : "text-muted-foreground"}`}>Service</Text>
                                </Pressable>
                            </View>
                        )}

                        <View className="mb-4">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Item Name *</Text>
                            <TextInput
                                className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                placeholder="Enter product or service name"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />
                        </View>

                        <View className="mb-4 flex-row">
                            <View className="flex-1 mr-2">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Selling Price (₹) *</Text>
                                <TextInput
                                    className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={formData.price?.toString() || ""}
                                    onChangeText={(text) => setFormData({ ...formData, price: text ? parseFloat(text) : 0 })}
                                />
                            </View>
                            {formData.type === 'product' && (
                                <View className="flex-1 ml-2">
                                    <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Opening Stock</Text>
                                    <TextInput
                                        className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                        placeholder="0"
                                        keyboardType="numeric"
                                        value={formData.openingStock?.toString() || ""}
                                        onChangeText={(text) => setFormData({ ...formData, openingStock: text ? parseInt(text, 10) : 0 })}
                                    />
                                </View>
                            )}
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
                                <Text className="font-sans-bold text-lg text-primary mb-4">Pricing & Tax</Text>
                                
                                <View className="mb-4">
                                    <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Purchase Price (₹)</Text>
                                    <TextInput
                                        className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                        placeholder="0"
                                        keyboardType="numeric"
                                        value={formData.purchasePrice?.toString() || ""}
                                        onChangeText={(text) => setFormData({ ...formData, purchasePrice: text ? parseFloat(text) : 0 })}
                                    />
                                </View>

                                <View className="mb-4 flex-row">
                                    <View className="flex-1 mr-2">
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2">GST Rate (%)</Text>
                                        <TextInput
                                            className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                            placeholder="e.g. 18"
                                            keyboardType="numeric"
                                            value={formData.gst_rate?.toString() || ""}
                                            onChangeText={(text) => setFormData({ ...formData, gst_rate: text ? parseFloat(text) : 0 })}
                                        />
                                    </View>
                                    <View className="flex-1 ml-2">
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2">{formData.type === 'product' ? 'HSN Code' : 'SAC Code'}</Text>
                                        <TextInput
                                            className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                            placeholder="e.g. 8471"
                                            value={formData.hsn_sac}
                                            onChangeText={(text) => setFormData({ ...formData, hsn_sac: text })}
                                        />
                                    </View>
                                </View>
                                
                                <Text className="font-sans-bold text-lg text-primary mb-4 mt-6">Item Identity</Text>
                                <View className="mb-4 flex-row">
                                    <View className="flex-1 mr-2">
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Item Code / SKU</Text>
                                        <TextInput
                                            className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                            placeholder="SKU-123"
                                            value={formData.sku}
                                            onChangeText={(text) => setFormData({ ...formData, sku: text })}
                                        />
                                    </View>
                                    <View className="flex-1 ml-2">
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Unit</Text>
                                        <TextInput
                                            className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                            placeholder="e.g. pcs, kg"
                                            value={formData.unit}
                                            onChangeText={(text) => setFormData({ ...formData, unit: text })}
                                        />
                                    </View>
                                </View>

                                {formData.type === 'product' && (
                                    <View className="mb-4">
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Minimum Stock to Alert</Text>
                                        <TextInput
                                            className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                            placeholder="0"
                                            keyboardType="numeric"
                                            value={formData.minimumStock?.toString() || ""}
                                            onChangeText={(text) => setFormData({ ...formData, minimumStock: text ? parseInt(text, 10) : 0 })}
                                        />
                                    </View>
                                )}

                                <Text className="font-sans-bold text-lg text-primary mb-4 mt-6">Details</Text>
                                <View className="mb-6">
                                    <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Description</Text>
                                    <TextInput
                                        className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base h-24"
                                        placeholder="Add description..."
                                        multiline
                                        textAlignVertical="top"
                                        value={formData.description}
                                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                                    />
                                </View>

                                <View className="mb-6 p-4 bg-muted rounded-2xl items-center border border-dashed border-slate-300">
                                    <Text className="font-sans-medium text-primary mb-2">Upload Item Image</Text>
                                    <Pressable className="bg-white px-6 py-3 rounded-full border border-border shadow-sm mt-2">
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
                        <Text className="font-sans-bold text-white text-lg">Save {formData.type === 'product' ? 'Product' : 'Service'}</Text>
                    </Pressable>
                </View>
            </AnimatedModal>
        </SafeAreaView>
    );
}
