import React, { useState, useMemo, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TextInput, 
    Pressable, 
    StyleSheet, 
    Dimensions, 
    Platform, 
    Alert, 
    FlatList,
    useWindowDimensions,
    KeyboardAvoidingView
} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { 
    ShoppingCart, 
    Plus, 
    Minus, 
    Search, 
    Trash2, 
    ArrowLeft, 
    RefreshCw, 
    Layers, 
    Check, 
    CreditCard, 
    Landmark, 
    DollarSign, 
    UserPlus, 
    CheckCircle, 
    ChevronDown, 
    Sparkles, 
    X,
    FileText,
    Camera
} from "lucide-react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import Animated, { 
    FadeIn, 
    FadeOut, 
    Layout, 
    SlideInRight, 
    SlideInDown,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../../context/AppContext";
import Button from "@/components/Button";
import AnimatedModal from "@/components/AnimatedModal";
import "../../../global.css";

interface CartItem {
    id: string;
    product: Item;
    qty: number;
    rate: number;
}

interface HeldSale {
    id: string;
    date: string;
    items: CartItem[];
    customer: { id: string; name: string; phone: string; gstin?: string };
    gstMode: 'local' | 'interstate';
    total: number;
}

export default function PosCashierScreen() {
    const router = useRouter();
    const { items, parties, addInvoice, addPayment, addParty } = useAppContext();
    const { width } = useWindowDimensions();
    const isTablet = width > 768;

    // States
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [scannerVisible, setScannerVisible] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string; phone: string; gstin?: string }>({
        id: 'cash',
        name: 'Walk-in Customer',
        phone: ''
    });
    const [gstMode, setGstMode] = useState<'local' | 'interstate'>('local');
    const [heldSales, setHeldSales] = useState<HeldSale[]>([]);
    
    // Modals
    const [cartModalVisible, setCartModalVisible] = useState(false);
    const [checkoutVisible, setCheckoutVisible] = useState(false);
    const [customerModalVisible, setCustomerModalVisible] = useState(false);
    const [heldSalesModalVisible, setHeldSalesModalVisible] = useState(false);
    const [addCustomerVisible, setAddCustomerVisible] = useState(false);
    
    // Add customer form
    const [newCustName, setNewCustName] = useState('');
    const [newCustPhone, setNewCustPhone] = useState('');
    const [newCustGstin, setNewCustGstin] = useState('');

    // Checkout form
    const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card'>('Cash');
    const [cashReceived, setCashReceived] = useState('');
    const [successVisible, setSuccessVisible] = useState(false);
    const [successInvoiceNo, setSuccessInvoiceNo] = useState('');
    const [successChange, setSuccessChange] = useState(0);

    // Helpers
    const getItemCategory = (item: Item) => {
        if (item.category) return item.category;
        const name = item.name.toLowerCase();
        if (name.includes('cement')) return 'Cement';
        if (name.includes('bar') || name.includes('pipe') || name.includes('wire') || name.includes('metal')) return 'Steel & Hardware';
        if (name.includes('chair') || name.includes('light') || name.includes('furniture')) return 'Interior & Lights';
        if (item.type === 'service' || name.includes('fees') || name.includes('advisory') || name.includes('service') || name.includes('licence') || name.includes('development') || name.includes('audit') || name.includes('maintenance')) return 'Services';
        if (name.includes('computer') || name.includes('printer') || name.includes('drill')) return 'Tools & Electronics';
        return 'General';
    };

    const formatDate = (date: Date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = date.getDate();
        const m = months[date.getMonth()];
        const y = date.getFullYear();
        return `${d < 10 ? '0' + d : d} ${m} ${y}`;
    };

    // Derived Carts & Items lists
    const categories = useMemo(() => {
        const cats = new Set<string>();
        items.forEach(item => {
            cats.add(getItemCategory(item));
        });
        return ["All", ...Array.from(cats)];
    }, [items]);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const cat = getItemCategory(item);
            const matchesCategory = selectedCategory === 'All' || cat === selectedCategory;
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = 
                item.name.toLowerCase().includes(searchLower) || 
                item.hsn_sac.includes(searchLower) || 
                (item.sku && item.sku.toLowerCase().includes(searchLower)) ||
                cat.toLowerCase().includes(searchLower);
            return matchesCategory && matchesSearch;
        });
    }, [items, searchQuery, selectedCategory]);

    const customers = useMemo(() => {
        return parties.filter(p => p.type === 'customer' || p.type === 'both');
    }, [parties]);

    // Totals calculations
    const cartTotals = useMemo(() => {
        let subtotal = 0;
        let totalGST = 0;
        let cgstAmount = 0;
        let sgstAmount = 0;
        let igstAmount = 0;

        cart.forEach(item => {
            const qty = item.qty;
            const rate = item.rate;
            const amountBeforeTax = qty * rate;
            subtotal += amountBeforeTax;

            const taxRate = item.product.gst_rate || 0;
            const taxAmt = amountBeforeTax * (taxRate / 100);
            totalGST += taxAmt;

            if (gstMode === 'local') {
                cgstAmount += taxAmt / 2;
                sgstAmount += taxAmt / 2;
            } else {
                igstAmount += taxAmt;
            }
        });

        const rawTotal = subtotal + totalGST;
        const grandTotal = Math.round(rawTotal);
        const roundOff = grandTotal - rawTotal;

        return {
            subtotal,
            totalGST,
            cgstAmount,
            sgstAmount,
            igstAmount,
            roundOff,
            grandTotal
        };
    }, [cart, gstMode]);

    const { subtotal, totalGST, cgstAmount, sgstAmount, igstAmount, roundOff, grandTotal } = cartTotals;

    // Cart actions
    const handleAddToCart = (product: Item) => {
        const existing = cart.find(c => c.product.id === product.id);
        if (existing) {
            setCart(cart.map(c => c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c));
        } else {
            // eslint-disable-next-line react-hooks/purity
            setCart([...cart, { id: `cart-${Date.now()}-${product.id}`, product, qty: 1, rate: product.price }]);
        }
    };

    const handleDecrement = (productId: string) => {
        const existing = cart.find(c => c.product.id === productId);
        if (existing) {
            if (existing.qty === 1) {
                setCart(cart.filter(c => c.product.id !== productId));
            } else {
                setCart(cart.map(c => c.product.id === productId ? { ...c, qty: c.qty - 1 } : c));
            }
        }
    };

    const handleIncrement = (productId: string) => {
        setCart(cart.map(c => c.product.id === productId ? { ...c, qty: c.qty + 1 } : c));
    };

    const handleRemove = (productId: string) => {
        setCart(cart.filter(c => c.product.id !== productId));
    };

    const handleClearCart = () => {
        if (cart.length === 0) return;
        Alert.alert("Clear Cart", "Are you sure you want to remove all items from the cart?", [
            { text: "Cancel", style: "cancel" },
            { text: "Clear", style: "destructive", onPress: () => {
                setCart([]);
                setSelectedCustomer({ id: 'cash', name: 'Walk-in Customer', phone: '' });
                setGstMode('local');
            }}
        ]);
    };

    // Hold Sale actions
    const handleHoldSale = () => {
        if (cart.length === 0) {
            Alert.alert("Empty Cart", "Cannot hold an empty sale");
            return;
        }
        const newHold: HeldSale = {
            id: `hold-${Date.now()}`,
            date: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            items: [...cart],
            customer: selectedCustomer,
            gstMode: gstMode,
            total: grandTotal
        };
        setHeldSales([newHold, ...heldSales]);
        setCart([]);
        setSelectedCustomer({ id: 'cash', name: 'Walk-in Customer', phone: '' });
        setCartModalVisible(false);
        Alert.alert("Sale Held", "Current cart has been saved to held sales.");
    };

    const handleRestoreHold = (hold: HeldSale) => {
        if (cart.length > 0) {
            Alert.alert(
                "Overwrite Cart?",
                "You have items in your current cart. Restoring will replace them. Proceed?",
                [
                    { text: "Cancel", style: "cancel" },
                    { 
                        text: "Restore", 
                        onPress: () => {
                            setCart(hold.items);
                            setSelectedCustomer(hold.customer);
                            setGstMode(hold.gstMode);
                            setHeldSales(heldSales.filter(h => h.id !== hold.id));
                            setHeldSalesModalVisible(false);
                        } 
                    }
                ]
            );
        } else {
            setCart(hold.items);
            setSelectedCustomer(hold.customer);
            setGstMode(hold.gstMode);
            setHeldSales(heldSales.filter(h => h.id !== hold.id));
            setHeldSalesModalVisible(false);
        }
    };

    const handleDeleteHold = (id: string) => {
        setHeldSales(prev => prev.filter(h => h.id !== id));
    };

    // Inline Customer Create
    const handleCreateCustomer = () => {
        if (!newCustName.trim()) {
            Alert.alert("Validation Error", "Name is required.");
            return;
        }
        const newParty: Party = {
            id: `party-${Date.now()}`,
            name: newCustName,
            phone: newCustPhone || '+91 ',
            gstin: newCustGstin || undefined,
            balance: 0,
            type: 'customer'
        };
        addParty(newParty);
        setSelectedCustomer({
            id: newParty.id,
            name: newParty.name,
            phone: newParty.phone,
            gstin: newParty.gstin
        });
        // Check state code for GST setting
        if (newCustGstin && newCustGstin.length >= 2) {
            // Maharashtra is 27, Delhi 07, etc. Assume default is local (e.g. 27). 
            // If the code is different, we can switch to interstate
            const stateCode = newCustGstin.substring(0, 2);
            if (stateCode !== '27') {
                setGstMode('interstate');
            } else {
                setGstMode('local');
            }
        }
        setNewCustName('');
        setNewCustPhone('');
        setNewCustGstin('');
        setAddCustomerVisible(false);
    };

    // Complete Sale Checkout
    const handleCheckout = () => {
        if (cart.length === 0) {
            Alert.alert("Empty Cart", "Cannot checkout with an empty cart");
            return;
        }
        setCashReceived(grandTotal.toString());
        setPaymentMethod('Cash');
        setCheckoutVisible(true);
    };

    const handleConfirmPayment = () => {
        const invoiceNo = `INV-POS-${Date.now().toString().slice(-6)}`;
        const currentDate = formatDate(new Date());
        
        // Map cart items to invoice format
        const invoiceItems = cart.map(item => {
            const qty = item.qty;
            const rate = item.rate;
            const amountBeforeTax = qty * rate;
            const taxRate = item.product.gst_rate || 0;
            const taxAmt = amountBeforeTax * (taxRate / 100);
            
            return {
                id: `invitem-${Date.now()}-${item.product.id}`,
                productId: item.product.id,
                name: item.product.name,
                hsn_sac: item.product.hsn_sac,
                qty: qty,
                unit: item.product.unit || 'pcs',
                rate: rate,
                discount: 0,
                discountType: 'flat' as const,
                gst_rate: taxRate,
                tax_amount: taxAmt,
                line_total: amountBeforeTax + taxAmt
            };
        });

        const newInvoice = {
            id: `inv-${Date.now()}`,
            number: invoiceNo,
            date: currentDate,
            dueDate: currentDate,
            type: "Tax Invoice" as const,
            status: "Paid" as const,
            customerId: selectedCustomer.id,
            customerName: selectedCustomer.name,
            items: invoiceItems,
            subtotal,
            discountAmount: 0,
            cgstAmount,
            sgstAmount,
            igstAmount,
            roundOff,
            total: grandTotal,
            paymentMode: paymentMethod,
            notes: "POS Cashier Billing"
        };

        addInvoice(newInvoice as any);

        // Update ledger flow
        addPayment({
            id: `pay-${Date.now()}`,
            date: currentDate,
            amount: grandTotal,
            mode: paymentMethod === 'Card' ? 'Bank Transfer' : paymentMethod === 'UPI' ? 'UPI' : 'Cash',
            type: 'in',
            partyName: selectedCustomer.name
        });

        // Set success states
        setSuccessInvoiceNo(invoiceNo);
        setSuccessChange(paymentMethod === 'Cash' ? Math.max(0, parseFloat(cashReceived || '0') - grandTotal) : 0);
        
        setCheckoutVisible(false);
        setCartModalVisible(false);
        setSuccessVisible(true);
    };

    const handleSuccessDone = () => {
        setCart([]);
        setSelectedCustomer({ id: 'cash', name: 'Walk-in Customer', phone: '' });
        setGstMode('local');
        setSuccessVisible(false);
    };

    // Barcode Scanner Permissions on Mount
    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, []);

    // Handle Scanned Barcode
    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (!scannerVisible) return;
        const product = items.find(item => item.barcode === data);
        if (product) {
            handleAddToCart(product);
            Alert.alert("Product Found", `${product.name} has been added to cart.`);
            setScannerVisible(false);
        } else {
            Alert.alert("Product not found");
            setScannerVisible(false);
        }
    };

    // Components
    const renderProductTile = ({ item }: { item: Item }) => {
        const cartItem = cart.find(c => c.product.id === item.id);
        const qtyInCart = cartItem ? cartItem.qty : 0;
        const category = getItemCategory(item);

        return (
            <Pressable 
                onPress={() => handleAddToCart(item)}
                className={`flex-1 m-2 p-4 bg-white rounded-2xl border ${qtyInCart > 0 ? 'border-primary border-[2px]' : 'border-border'} shadow-sm relative`}
            >
                {qtyInCart > 0 && (
                    <Animated.View 
                        entering={FadeIn.duration(150)} 
                        className="absolute -top-2 -right-2 bg-primary px-2.5 py-1 rounded-full items-center justify-center shadow-md"
                    >
                        <Text className="text-[10px] text-white font-sans-bold">{qtyInCart}x</Text>
                    </Animated.View>
                )}
                
                <View className="mb-2">
                    <Text className="text-[10px] uppercase font-sans-bold text-accent tracking-wide mb-0.5">{category}</Text>
                    <Text className="text-base font-sans-bold text-primary leading-tight" numberOfLines={2}>{item.name}</Text>
                </View>
                
                <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-border/40">
                    <View>
                        <Text className="text-[10px] text-muted-foreground uppercase font-sans-medium">HSN: {item.hsn_sac}</Text>
                        <Text className="text-base font-sans-bold text-primary">₹ {item.price}</Text>
                    </View>
                    <View className="bg-muted px-2.5 py-1.5 rounded-xl border border-muted-foreground/5">
                        <Text className="text-[10px] font-sans-semibold text-primary/80">{item.gst_rate}% GST</Text>
                    </View>
                </View>

                {item.stock !== undefined && (
                    <View className="mt-2.5 flex-row items-center">
                        <View className={`size-1.5 rounded-full mr-1.5 ${item.stock > 50 ? 'bg-green-500' : item.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                        <Text className={`text-[10px] font-sans-medium ${item.stock > 0 ? 'text-muted-foreground' : 'text-red-500 font-sans-bold'}`}>
                            {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                        </Text>
                    </View>
                )}
            </Pressable>
        );
    };

    const cartPanelContent = (
        <View className="flex-1 bg-white justify-between">
            {/* Cart Header */}
            <View className="p-5 border-b border-border">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-sans-bold text-primary">Cart Items ({cart.reduce((sum, item) => sum + item.qty, 0)})</Text>
                    {cart.length > 0 && (
                        <Pressable onPress={handleClearCart} className="flex-row items-center px-3 py-1.5 rounded-xl bg-red-50 border border-red-100">
                            <Trash2 size={14} color="#dc2626" />
                            <Text className="text-xs text-red-600 font-sans-bold ml-1">Clear</Text>
                        </Pressable>
                    )}
                </View>

                {/* Customer Selector */}
                <View className="mb-4">
                    <Text className="text-xs font-sans-semibold text-muted-foreground mb-1.5">CUSTOMER</Text>
                    <Pressable 
                        onPress={() => setCustomerModalVisible(true)}
                        className="flex-row items-center justify-between border border-border rounded-xl p-3 bg-[#f9f9f9]"
                    >
                        <View className="flex-row items-center flex-1 pr-4">
                            <View className="bg-primary/5 p-2 rounded-lg mr-2.5">
                                <UserPlus size={16} color="#081126" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-sans-bold text-primary" numberOfLines={1}>
                                    {selectedCustomer.name}
                                </Text>
                                {selectedCustomer.phone && (
                                    <Text className="text-[10px] font-sans-medium text-muted-foreground mt-0.5">
                                        {selectedCustomer.phone} {selectedCustomer.gstin ? `| GSTIN: ${selectedCustomer.gstin}` : ''}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <ChevronDown size={16} color="#081126" />
                    </Pressable>
                </View>

                {/* GST Mode Selector */}
                <View>
                    <Text className="text-xs font-sans-semibold text-muted-foreground mb-1.5">GST TRANSACTION TYPE</Text>
                    <View className="flex-row bg-[#f1f1f1] p-1 rounded-xl">
                        <Pressable 
                            onPress={() => setGstMode('local')}
                            className={`flex-1 py-2 rounded-lg items-center ${gstMode === 'local' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
                        >
                            <Text className={`text-xs ${gstMode === 'local' ? 'text-primary font-sans-bold' : 'text-muted-foreground font-sans-medium'}`}>Local (CGST + SGST)</Text>
                        </Pressable>
                        <Pressable 
                            onPress={() => setGstMode('interstate')}
                            className={`flex-1 py-2 rounded-lg items-center ${gstMode === 'interstate' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
                        >
                            <Text className={`text-xs ${gstMode === 'interstate' ? 'text-primary font-sans-bold' : 'text-muted-foreground font-sans-medium'}`}>Inter-State (IGST)</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* Cart Items List */}
            <ScrollView className="flex-1 px-5 py-3" showsVerticalScrollIndicator={false}>
                {cart.length === 0 ? (
                    <View className="flex-1 py-20 items-center justify-center">
                        <View className="bg-primary/5 p-6 rounded-full mb-4">
                            <ShoppingCart size={40} color="#081126" opacity={0.3} />
                        </View>
                        <Text className="text-base font-sans-bold text-primary mb-1">Cart is Empty</Text>
                        <Text className="text-sm font-sans-regular text-muted-foreground text-center px-6">
                            Tap products on the grid to add them to this sale list.
                        </Text>
                    </View>
                ) : (
                    cart.map(item => {
                        const lineTax = (item.qty * item.rate) * (item.product.gst_rate / 100);
                        const totalWithTax = (item.qty * item.rate) + lineTax;
                        return (
                            <Animated.View 
                                key={item.product.id} 
                                layout={Layout.springify()} 
                                className="mb-4 bg-[#f9f9f9] border border-border/60 p-3.5 rounded-2xl"
                            >
                                <View className="flex-row justify-between items-start mb-2.5">
                                    <View className="flex-1 pr-3">
                                        <Text className="text-sm font-sans-bold text-primary leading-tight">{item.product.name}</Text>
                                        <Text className="text-[10px] font-sans-medium text-muted-foreground mt-0.5">
                                            HSN: {item.product.hsn_sac} • ₹ {item.rate} ({item.product.gst_rate}% GST)
                                        </Text>
                                    </View>
                                    <Pressable onPress={() => handleRemove(item.product.id)} className="p-1">
                                        <Trash2 size={16} color="#dc2626" opacity={0.7} />
                                    </Pressable>
                                </View>

                                <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-border/30">
                                    {/* Quantity controls */}
                                    <View className="flex-row items-center bg-white border border-border/80 rounded-xl px-1 py-1">
                                        <Pressable 
                                            onPress={() => handleDecrement(item.product.id)}
                                            className="size-7 justify-center items-center rounded-lg bg-[#f1f1f1] active:bg-[#e3e8fc]"
                                        >
                                            <Minus size={14} color="#081126" />
                                        </Pressable>
                                        <Text className="w-8 text-center font-sans-bold text-primary text-sm">{item.qty}</Text>
                                        <Pressable 
                                            onPress={() => handleIncrement(item.product.id)}
                                            className="size-7 justify-center items-center rounded-lg bg-[#f1f1f1] active:bg-[#e3e8fc]"
                                        >
                                            <Plus size={14} color="#081126" />
                                        </Pressable>
                                    </View>

                                    {/* Line taxes and totals */}
                                    <View className="items-end">
                                        <Text className="text-[10px] font-sans-medium text-muted-foreground">
                                            {gstMode === 'local' ? (
                                                `CGST+SGST: ₹ ${(lineTax).toFixed(1)}`
                                            ) : (
                                                `IGST: ₹ ${(lineTax).toFixed(1)}`
                                            )}
                                        </Text>
                                        <Text className="text-sm font-sans-bold text-primary">₹ {totalWithTax.toFixed(2)}</Text>
                                    </View>
                                </View>
                            </Animated.View>
                        );
                    })
                )}
            </ScrollView>

            {/* Cart Footer */}
            <View className="p-5 border-t border-border bg-[#f9f9f9]">
                <View className="space-y-1 mb-4">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-xs font-sans-regular text-muted-foreground">Subtotal</Text>
                        <Text className="text-sm font-sans-medium text-primary">₹ {subtotal.toFixed(2)}</Text>
                    </View>
                    
                    {gstMode === 'local' ? (
                        <>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-xs font-sans-regular text-muted-foreground">CGST</Text>
                                <Text className="text-xs font-sans-medium text-primary">₹ {cgstAmount.toFixed(2)}</Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-xs font-sans-regular text-muted-foreground">SGST</Text>
                                <Text className="text-xs font-sans-medium text-primary">₹ {sgstAmount.toFixed(2)}</Text>
                            </View>
                        </>
                    ) : (
                        <View className="flex-row justify-between items-center">
                            <Text className="text-xs font-sans-regular text-muted-foreground">IGST</Text>
                            <Text className="text-xs font-sans-medium text-primary">₹ {igstAmount.toFixed(2)}</Text>
                        </View>
                    )}

                    <View className="flex-row justify-between items-center">
                        <Text className="text-xs font-sans-regular text-muted-foreground">Round Off</Text>
                        <Text className="text-xs font-sans-medium text-primary">
                            {roundOff >= 0 ? '+' : ''} {roundOff.toFixed(2)}
                        </Text>
                    </View>

                    <View className="h-[1px] bg-border my-2" />

                    <View className="flex-row justify-between items-center">
                        <Text className="text-base font-sans-bold text-primary">Grand Total</Text>
                        <Text className="text-2xl font-sans-bold text-accent">₹ {grandTotal.toLocaleString('en-IN')}</Text>
                    </View>
                </View>

                {/* Footer buttons */}
                <View className="flex-row gap-2 mt-2">
                    <Pressable 
                        onPress={handleHoldSale}
                        className="flex-1 h-12 rounded-xl bg-white border border-border flex-row items-center justify-center active:bg-slate-50"
                    >
                        <Layers size={16} color="#081126" />
                        <Text className="text-xs font-sans-bold text-primary ml-1.5">Hold Sale</Text>
                    </Pressable>
                    <Pressable 
                        onPress={handleCheckout}
                        disabled={cart.length === 0}
                        className={`flex-[1.5] h-12 rounded-xl flex-row items-center justify-center ${cart.length === 0 ? 'bg-primary/40' : 'bg-primary active:bg-primary/95'}`}
                    >
                        <ShoppingCart size={16} color="white" />
                        <Text className="text-xs font-sans-bold text-white ml-1.5">Charge ₹ {grandTotal}</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={['#e3e8fc', '#f1f1f1']}
            className="flex-1"
        >
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                {/* Header */}
                <View className="flex-row items-center justify-between p-5 bg-white border-b border-border/60 shadow-sm z-10">
                    <View className="flex-row items-center">
                        <Pressable onPress={() => router.back()} className="mr-3 p-1 rounded-full active:bg-[#f1f1f1]">
                            <ArrowLeft color="#081126" size={24} />
                        </Pressable>
                        <View>
                            <Text className="text-xl font-sans-bold text-primary">POS Cashier</Text>
                            <Text className="text-[10px] font-sans-semibold text-accent uppercase tracking-wider">AXANEES DIGITAL POS</Text>
                        </View>
                    </View>

                    {/* Actions and Hold list button */}
                    <View className="flex-row items-center gap-3">
                        <Pressable 
                            onPress={() => setHeldSalesModalVisible(true)}
                            className="relative flex-row items-center bg-[#f1f1f1] border border-border/80 px-3.5 py-2 rounded-xl"
                        >
                            <Layers size={16} color="#081126" />
                            <Text className="text-xs font-sans-bold text-primary ml-1.5">Recall Sale</Text>
                            {heldSales.length > 0 && (
                                <View className="absolute -top-1.5 -right-1.5 bg-accent rounded-full size-5 items-center justify-center">
                                    <Text className="text-[10px] text-white font-sans-bold">{heldSales.length}</Text>
                                </View>
                            )}
                        </Pressable>
                    </View>
                </View>

                {/* Main Body */}
                <View className="flex-1 flex-row">
                    
                    {/* Left Catalog Column */}
                    <View className="flex-1 p-3">
                        {/* Search and Filters */}
                        <View className="mb-3 px-2">
                            <View className="flex-row items-center gap-2 mb-3">
                                <View className="flex-1 flex-row items-center bg-white px-4 h-12 rounded-xl border border-border shadow-sm">
                                    <Search color="#9ca3af" size={20} />
                                    <TextInput
                                        className="flex-1 ml-3 h-full font-sans-regular text-base text-primary"
                                        placeholder="Search by name, category, HSN..."
                                        placeholderTextColor="#9ca3af"
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                    {searchQuery.length > 0 && (
                                        <Pressable onPress={() => setSearchQuery('')} className="p-1">
                                            <X size={18} color="#9ca3af" />
                                        </Pressable>
                                    )}
                                </View>
                                <Pressable 
                                    onPress={() => setScannerVisible(true)}
                                    className="bg-white border border-border size-12 rounded-xl items-center justify-center shadow-sm active:bg-slate-50"
                                >
                                    <Camera color="#081126" size={22} />
                                </Pressable>
                            </View>

                            {/* Horizontal Categories */}
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 5, gap: 8 }}
                            >
                                {categories.map(cat => (
                                    <Pressable
                                        key={cat}
                                        onPress={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-full border ${selectedCategory === cat ? 'bg-primary border-primary shadow-sm' : 'bg-white border-border'}`}
                                    >
                                        <Text className={`text-xs ${selectedCategory === cat ? 'text-white font-sans-bold' : 'text-primary font-sans-medium'}`}>
                                            {cat}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Product Catalog Grid */}
                        {filteredItems.length === 0 ? (
                            <View className="flex-1 justify-center items-center py-20">
                                <Text className="font-sans-bold text-base text-primary mb-1">No products found</Text>
                                <Text className="font-sans-regular text-sm text-muted-foreground text-center px-10">
                                    Try adjusting your search criteria or choosing a different category.
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                key={isTablet ? 'tablet-grid' : 'mobile-grid'}
                                data={filteredItems}
                                renderItem={renderProductTile}
                                keyExtractor={item => item.id}
                                numColumns={isTablet ? 3 : 2}
                                contentContainerStyle={{ paddingBottom: 100 }}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>

                    {/* Right Cart Sidebar (Tablets only) */}
                    {isTablet && (
                        <Animated.View 
                            entering={SlideInRight}
                            className="w-[380px] bg-white border-l border-border shadow-lg"
                        >
                            {cartPanelContent}
                        </Animated.View>
                    )}
                </View>

                {/* Mobile Active Cart Float bar */}
                {!isTablet && cart.length > 0 && (
                    <Pressable 
                        onPress={() => setCartModalVisible(true)}
                        className="absolute bottom-4 left-4 right-4 bg-primary rounded-2xl p-4 flex-row items-center justify-between shadow-lg z-20"
                    >
                        <View className="flex-row items-center">
                            <View className="bg-white/20 p-2.5 rounded-xl mr-3">
                                <ShoppingCart color="white" size={20} />
                                <View className="absolute -top-1.5 -right-1.5 bg-accent rounded-full size-5 items-center justify-center">
                                    <Text className="text-[10px] text-white font-sans-bold">
                                        {cart.reduce((sum, item) => sum + item.qty, 0)}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Text className="text-white/60 text-[10px] font-sans-bold uppercase tracking-wider">Active Cart</Text>
                                <Text className="text-white text-base font-sans-bold">₹ {grandTotal.toLocaleString('en-IN')}</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center bg-white/20 px-3.5 py-1.5 rounded-full">
                            <Text className="text-white font-sans-bold text-xs mr-1">View Cart</Text>
                            <ChevronDown color="white" size={14} className="rotate-180" />
                        </View>
                    </Pressable>
                )}

                {/* MOBILE CART DRAWER MODAL */}
                <AnimatedModal
                    visible={!isTablet && cartModalVisible}
                    onClose={() => setCartModalVisible(false)}
                >
                    <View style={{ height: Dimensions.get('window').height * 0.8 }} className="bg-white rounded-t-3xl overflow-hidden">
                        {/* Drawer pull/dismiss */}
                        <View className="h-1.5 w-12 bg-slate-200 rounded-full mx-auto my-3" />
                        <View className="flex-1">
                            {cartPanelContent}
                        </View>
                    </View>
                </AnimatedModal>

                {/* CUSTOMER SELECTOR MODAL */}
                <AnimatedModal
                    visible={customerModalVisible}
                    onClose={() => setCustomerModalVisible(false)}
                >
                    <View style={{ height: Dimensions.get('window').height * 0.7 }} className="bg-white rounded-t-3xl p-5 justify-between">
                        <View className="flex-1">
                            {/* Modal Header */}
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-sans-bold text-primary">Select Customer</Text>
                                <Pressable onPress={() => setCustomerModalVisible(false)} className="p-1">
                                    <X size={20} color="#081126" />
                                </Pressable>
                            </View>

                            {/* Quick Add Toggle */}
                            {!addCustomerVisible ? (
                                <Pressable 
                                    onPress={() => setAddCustomerVisible(true)}
                                    className="flex-row items-center justify-center border border-dashed border-primary/40 rounded-xl p-3.5 mb-4 bg-primary/5 active:bg-primary/10"
                                >
                                    <UserPlus size={18} color="#081126" />
                                    <Text className="text-sm font-sans-bold text-primary ml-2">Add New Customer</Text>
                                </Pressable>
                            ) : (
                                <View className="bg-[#f9f9f9] border border-border p-4 rounded-2xl mb-4">
                                    <Text className="text-sm font-sans-bold text-primary mb-3">New Customer Form</Text>
                                    <TextInput 
                                        className="h-11 bg-white border border-border px-3 rounded-xl font-sans-regular text-sm text-primary mb-2.5"
                                        placeholder="Full Name (Required)"
                                        value={newCustName}
                                        onChangeText={setNewCustName}
                                    />
                                    <TextInput 
                                        className="h-11 bg-white border border-border px-3 rounded-xl font-sans-regular text-sm text-primary mb-2.5"
                                        placeholder="Phone Number (+91 ...)"
                                        keyboardType="phone-pad"
                                        value={newCustPhone}
                                        onChangeText={setNewCustPhone}
                                    />
                                    <TextInput 
                                        className="h-11 bg-white border border-border px-3 rounded-xl font-sans-regular text-sm text-primary mb-3.5"
                                        placeholder="GSTIN (Optional)"
                                        autoCapitalize="characters"
                                        value={newCustGstin}
                                        onChangeText={setNewCustGstin}
                                    />
                                    <View className="flex-row gap-2">
                                        <Pressable 
                                            onPress={() => {
                                                setAddCustomerVisible(false);
                                                setNewCustName('');
                                                setNewCustPhone('');
                                                setNewCustGstin('');
                                            }}
                                            className="flex-1 py-2.5 rounded-xl border border-border bg-white items-center"
                                        >
                                            <Text className="text-xs font-sans-bold text-primary">Cancel</Text>
                                        </Pressable>
                                        <Pressable 
                                            onPress={handleCreateCustomer}
                                            className="flex-1 py-2.5 rounded-xl bg-primary items-center"
                                        >
                                            <Text className="text-xs font-sans-bold text-white">Save & Select</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            )}

                            {/* Customer List */}
                            <Text className="text-xs font-sans-semibold text-muted-foreground uppercase mb-2">CHOOSE FROM LIST</Text>
                            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                                {/* Default Cash customer */}
                                <Pressable 
                                    onPress={() => {
                                        setSelectedCustomer({ id: 'cash', name: 'Walk-in Customer', phone: '' });
                                        setCustomerModalVisible(false);
                                    }}
                                    className={`flex-row justify-between items-center py-3.5 border-b border-border ${selectedCustomer.id === 'cash' ? 'bg-primary/5 px-2.5 rounded-xl' : ''}`}
                                >
                                    <View>
                                        <Text className="text-sm font-sans-bold text-primary">Walk-in Customer (Cash)</Text>
                                        <Text className="text-xs font-sans-medium text-muted-foreground mt-0.5">Default anonymous buyer</Text>
                                    </View>
                                    {selectedCustomer.id === 'cash' && <Check size={18} color="#081126" />}
                                </Pressable>

                                {customers.map(c => (
                                    <Pressable 
                                        key={c.id}
                                        onPress={() => {
                                            setSelectedCustomer(c);
                                            // Auto GST Mode based on GSTIN state
                                            if (c.gstin && c.gstin.length >= 2) {
                                                const stateCode = c.gstin.substring(0, 2);
                                                if (stateCode !== '27') setGstMode('interstate');
                                                else setGstMode('local');
                                            }
                                            setCustomerModalVisible(false);
                                        }}
                                        className={`flex-row justify-between items-center py-3.5 border-b border-border ${selectedCustomer.id === c.id ? 'bg-primary/5 px-2.5 rounded-xl' : ''}`}
                                    >
                                        <View className="flex-1 pr-4">
                                            <Text className="text-sm font-sans-bold text-primary" numberOfLines={1}>{c.name}</Text>
                                            <Text className="text-xs font-sans-medium text-muted-foreground mt-0.5" numberOfLines={1}>
                                                {c.phone} {c.gstin ? `• GSTIN: ${c.gstin}` : ''}
                                            </Text>
                                        </View>
                                        {selectedCustomer.id === c.id && <Check size={18} color="#081126" />}
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </AnimatedModal>

                {/* RECALL HELD SALES MODAL */}
                <AnimatedModal
                    visible={heldSalesModalVisible}
                    onClose={() => setHeldSalesModalVisible(false)}
                >
                    <View style={{ height: Dimensions.get('window').height * 0.6 }} className="bg-white rounded-t-3xl p-5 justify-between">
                        <View className="flex-1">
                            <View className="flex-row justify-between items-center mb-5">
                                <Text className="text-lg font-sans-bold text-primary">Recall Held Sales</Text>
                                <Pressable onPress={() => setHeldSalesModalVisible(false)} className="p-1">
                                    <X size={20} color="#081126" />
                                </Pressable>
                            </View>

                            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                                {heldSales.length === 0 ? (
                                    <View className="py-20 items-center justify-center">
                                        <Text className="font-sans-bold text-base text-primary mb-1">No Held Sales</Text>
                                        <Text className="font-sans-regular text-sm text-muted-foreground text-center px-10">
                                            Keep active transactions on hold. They will show up here to recall later.
                                        </Text>
                                    </View>
                                ) : (
                                    heldSales.map(hold => (
                                        <View key={hold.id} className="mb-4 bg-[#f9f9f9] border border-border p-4 rounded-2xl flex-row justify-between items-center">
                                            <View className="flex-1 pr-4">
                                                <Text className="text-sm font-sans-bold text-primary">{hold.customer.name}</Text>
                                                <Text className="text-xs font-sans-medium text-muted-foreground mt-0.5">
                                                    {hold.items.reduce((sum, i) => sum + i.qty, 0)} Items • {hold.date}
                                                </Text>
                                                <Text className="text-base font-sans-bold text-accent mt-1">₹ {hold.total.toLocaleString('en-IN')}</Text>
                                            </View>
                                            <View className="flex-row gap-2">
                                                <Pressable 
                                                    onPress={() => handleDeleteHold(hold.id)}
                                                    className="size-10 rounded-xl bg-red-50 border border-red-100 justify-center items-center active:bg-red-100"
                                                >
                                                    <Trash2 size={16} color="#dc2626" />
                                                </Pressable>
                                                <Pressable 
                                                    onPress={() => handleRestoreHold(hold)}
                                                    className="px-4 h-10 rounded-xl bg-primary justify-center items-center active:bg-primary/95"
                                                >
                                                    <Text className="text-xs font-sans-bold text-white">Recall</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    ))
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </AnimatedModal>

                {/* CHECKOUT MODAL (CHARGE) */}
                <AnimatedModal
                    visible={checkoutVisible}
                    onClose={() => setCheckoutVisible(false)}
                    avoidKeyboard
                >
                    <View className="bg-white rounded-t-3xl p-5 justify-between">
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            <View className="flex-row justify-between items-center mb-5">
                                <Text className="text-lg font-sans-bold text-primary">Checkout & Payment</Text>
                                <Pressable onPress={() => setCheckoutVisible(false)} className="p-1">
                                    <X size={20} color="#081126" />
                                </Pressable>
                            </View>

                            {/* Summary info */}
                            <View className="bg-primary/5 p-4 rounded-2xl mb-5 border border-primary/10">
                                <Text className="text-xs font-sans-bold text-muted-foreground uppercase tracking-wide">TOTAL AMOUNT DUE</Text>
                                <Text className="text-3xl font-sans-extrabold text-primary mt-1">₹ {grandTotal.toLocaleString('en-IN')}</Text>
                                
                                <View className="h-[1px] bg-border my-2.5" />
                                
                                <Text className="text-xs font-sans-semibold text-primary/80">
                                    Customer: <Text className="font-sans-bold">{selectedCustomer.name}</Text>
                                </Text>
                                <Text className="text-[10px] font-sans-medium text-muted-foreground mt-0.5">
                                    Tax Rate Type: {gstMode === 'local' ? 'Intra-State CGST+SGST' : 'Inter-State IGST'}
                                </Text>
                            </View>

                            {/* Payment Methods */}
                            <Text className="text-xs font-sans-semibold text-muted-foreground uppercase mb-2.5">PAYMENT METHOD</Text>
                            <View className="flex-row gap-2.5 mb-5">
                                <Pressable 
                                    onPress={() => setPaymentMethod('Cash')}
                                    className={`flex-1 py-3.5 border rounded-2xl items-center ${paymentMethod === 'Cash' ? 'border-primary bg-primary/5 border-[2px]' : 'border-border bg-white'}`}
                                >
                                    <DollarSign size={20} color={paymentMethod === 'Cash' ? '#081126' : '#9ca3af'} />
                                    <Text className={`text-xs font-sans-bold mt-1.5 ${paymentMethod === 'Cash' ? 'text-primary text-sans-bold' : 'text-muted-foreground text-sans-medium'}`}>Cash</Text>
                                </Pressable>
                                <Pressable 
                                    onPress={() => setPaymentMethod('UPI')}
                                    className={`flex-1 py-3.5 border rounded-2xl items-center ${paymentMethod === 'UPI' ? 'border-primary bg-primary/5 border-[2px]' : 'border-border bg-white'}`}
                                >
                                    <Sparkles size={20} color={paymentMethod === 'UPI' ? '#081126' : '#9ca3af'} />
                                    <Text className={`text-xs font-sans-bold mt-1.5 ${paymentMethod === 'UPI' ? 'text-primary text-sans-bold' : 'text-muted-foreground text-sans-medium'}`}>UPI QR</Text>
                                </Pressable>
                                <Pressable 
                                    onPress={() => setPaymentMethod('Card')}
                                    className={`flex-1 py-3.5 border rounded-2xl items-center ${paymentMethod === 'Card' ? 'border-primary bg-primary/5 border-[2px]' : 'border-border bg-white'}`}
                                >
                                    <CreditCard size={20} color={paymentMethod === 'Card' ? '#081126' : '#9ca3af'} />
                                    <Text className={`text-xs font-sans-bold mt-1.5 ${paymentMethod === 'Card' ? 'text-primary text-sans-bold' : 'text-muted-foreground text-sans-medium'}`}>Card</Text>
                                </Pressable>
                            </View>

                            {/* Cash tender details */}
                            {paymentMethod === 'Cash' && (
                                <Animated.View entering={FadeIn.duration(200)} className="mb-6 bg-slate-50 border border-border p-4 rounded-2xl">
                                    <Text className="text-xs font-sans-semibold text-muted-foreground mb-2">AMOUNT RECEIVED (CASH TENDER)</Text>
                                    
                                    <View className="flex-row items-center bg-white px-3.5 h-12 rounded-xl border border-border mb-3">
                                        <Text className="font-sans-bold text-primary text-base mr-2">₹</Text>
                                        <TextInput
                                            className="flex-1 h-full font-sans-bold text-lg text-primary"
                                            placeholder="Enter amount"
                                            keyboardType="numeric"
                                            value={cashReceived}
                                            onChangeText={setCashReceived}
                                        />
                                    </View>

                                    {/* Quick Cash Buttons */}
                                    <View className="flex-row flex-wrap gap-2 mb-3.5">
                                        {[grandTotal, 100, 200, 500, 1000, 2000].map(amt => {
                                            const label = amt === grandTotal ? 'Exact' : `+₹${amt}`;
                                            const targetAmt = amt === grandTotal ? grandTotal : (parseFloat(cashReceived || '0') + amt);
                                            return (
                                                <Pressable
                                                    key={amt}
                                                    onPress={() => setCashReceived(targetAmt.toString())}
                                                    className="bg-white border border-border/80 px-3 py-1.5 rounded-xl active:bg-[#e3e8fc]"
                                                >
                                                    <Text className="text-xs font-sans-semibold text-primary">{label}</Text>
                                                </Pressable>
                                            );
                                        })}
                                    </View>

                                    {/* Return calculator */}
                                    <View className="flex-row justify-between items-center pt-2 border-t border-border/40">
                                        <Text className="text-xs font-sans-bold text-muted-foreground">CHANGE TO RETURN</Text>
                                        <Text className="text-xl font-sans-extrabold text-green-600">
                                            ₹ {Math.max(0, parseFloat(cashReceived || '0') - grandTotal).toFixed(2)}
                                        </Text>
                                    </View>
                                </Animated.View>
                            )}

                            {/* Action confirmation button */}
                            <Button 
                                title={`Confirm & Save Sale (₹${grandTotal})`}
                                variant="primary"
                                className="w-full"
                                disabled={paymentMethod === 'Cash' && parseFloat(cashReceived || '0') < grandTotal}
                                onPress={handleConfirmPayment}
                            />
                        </KeyboardAvoidingView>
                    </View>
                </AnimatedModal>

                {/* CHECKOUT SUCCESS MODAL */}
                <AnimatedModal
                    visible={successVisible}
                    onClose={handleSuccessDone}
                >
                    <View className="bg-white rounded-t-3xl p-6 items-center">
                        <View className="bg-green-100 p-5 rounded-full mb-4.5 mt-4">
                            <CheckCircle size={48} color="#16a34a" />
                        </View>
                        
                        <Text className="text-2xl font-sans-bold text-primary mb-1">Billing Completed!</Text>
                        <Text className="text-sm font-sans-regular text-muted-foreground text-center mb-5.5">
                            Invoice has been successfully recorded in the ledger database.
                        </Text>

                        {/* Invoice reference summary card */}
                        <View className="w-full bg-[#f9f9f9] border border-border p-4.5 rounded-2xl mb-6">
                            <View className="flex-row justify-between items-center mb-2.5">
                                <Text className="text-xs font-sans-medium text-muted-foreground">INVOICE NO.</Text>
                                <Text className="text-sm font-sans-bold text-primary">{successInvoiceNo}</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-2.5">
                                <Text className="text-xs font-sans-medium text-muted-foreground">PAYMENT METHOD</Text>
                                <Text className="text-sm font-sans-bold text-primary">{paymentMethod}</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-2.5">
                                <Text className="text-xs font-sans-medium text-muted-foreground">AMOUNT PAID</Text>
                                <Text className="text-sm font-sans-bold text-primary">₹ {grandTotal.toLocaleString('en-IN')}</Text>
                            </View>
                            {paymentMethod === 'Cash' && (
                                <View className="flex-row justify-between items-center pt-2.5 border-t border-border/40">
                                    <Text className="text-xs font-sans-bold text-green-700">CHANGE RETURNED</Text>
                                    <Text className="text-base font-sans-bold text-green-700">₹ {successChange.toFixed(2)}</Text>
                                </View>
                            )}
                        </View>

                        <Button 
                            title="Done & New Sale" 
                            variant="primary" 
                            className="w-full mb-3"
                            onPress={handleSuccessDone}
                        />
                    </View>
                </AnimatedModal>

            </SafeAreaView>

            {/* BARCODE SCANNER OVERLAY */}
            {scannerVisible && (
                <View className="absolute inset-0 bg-black z-50 justify-center items-center">
                    {hasPermission === null ? (
                        <View className="items-center px-6">
                            <Text className="text-white text-base font-sans-bold text-center">Requesting camera permission...</Text>
                        </View>
                    ) : hasPermission === false ? (
                        <View className="items-center px-6">
                            <Text className="text-white text-base font-sans-bold text-center mb-4">No access to camera</Text>
                            <Pressable 
                                onPress={() => setScannerVisible(false)}
                                className="bg-white/20 px-4 py-2 rounded-xl"
                            >
                                <Text className="text-white font-sans-bold text-xs">Close</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <>
                            <BarCodeScanner
                                onBarCodeScanned={handleBarCodeScanned}
                                style={StyleSheet.absoluteFill}
                            />
                            
                            {/* Overlay UI */}
                            <SafeAreaView className="flex-1 justify-between p-6 w-full h-full">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-white font-sans-bold text-lg">Scan Barcode</Text>
                                    <Pressable 
                                        onPress={() => setScannerVisible(false)}
                                        className="bg-white/20 p-2.5 rounded-full"
                                    >
                                        <X color="white" size={22} />
                                    </Pressable>
                                </View>
                                
                                {/* Target frame indicator */}
                                <View className="items-center justify-center">
                                    <View className="border-2 border-accent w-64 h-64 rounded-3xl opacity-80" />
                                    <Text className="text-white/80 text-xs font-sans-medium mt-4 text-center">
                                        Align barcode within the frame to scan
                                    </Text>
                                </View>
                                
                                <View className="mb-6 items-center">
                                    <Pressable 
                                        onPress={() => setScannerVisible(false)}
                                        className="bg-red-500 px-6 py-3 rounded-full shadow-lg active:bg-red-600"
                                    >
                                        <Text className="text-white font-sans-bold text-sm">Cancel Scan</Text>
                                    </Pressable>
                                </View>
                            </SafeAreaView>
                        </>
                    )}
                </View>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({});
