import { useRouter } from "expo-router";
import { ArrowLeft, Save, Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react-native";
import { useState, useMemo } from "react";
import { Pressable, ScrollView, Text, TextInput, View, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useAppContext } from "../../context/AppContext";
import "../../../global.css";

type SectionProps = {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    summary?: string;
};

const Section = ({ title, isExpanded, onToggle, children, summary }: SectionProps) => (
    <View className="bg-white rounded-xl shadow-sm mb-4 border border-border overflow-hidden">
        <Pressable 
            className={`flex-row justify-between items-center p-4 ${isExpanded ? 'border-b border-border bg-slate-50' : ''}`}
            onPress={onToggle}
        >
            <View>
                <Text className="font-sans-bold text-base text-primary">{title}</Text>
                {!isExpanded && summary && <Text className="font-sans-medium text-xs text-muted-foreground mt-1">{summary}</Text>}
            </View>
            {isExpanded ? <ChevronUp color="#081126" size={20} /> : <ChevronDown color="#081126" size={20} />}
        </Pressable>
        {isExpanded && (
            <View className="p-4">
                {children}
            </View>
        )}
    </View>
);

export default function CreateInvoiceScreen() {
    const router = useRouter();
    const { parties, items, addInvoice } = useAppContext();

    const [expandedSections, setExpandedSections] = useState({
        header: true,
        party: false,
        items: false,
        payment: false,
        transport: false,
        notes: false,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Form State
    const [header, setHeader] = useState({
        type: "Tax Invoice",
        number: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: "",
        status: "Draft",
    });

    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [customerModalVisible, setCustomerModalVisible] = useState(false);

    const [invoiceItems, setInvoiceItems] = useState<Partial<InvoiceItem>[]>([]);
    const [itemModalVisible, setItemModalVisible] = useState(false);

    const [payment, setPayment] = useState({ mode: "UPI", terms: "Immediate" });
    const [transport, setTransport] = useState({ vehicleNo: "", ewayBill: "", deliveryDate: "" });
    const [notes, setNotes] = useState({ internal: "", customer: "Goods once sold will not be taken back." });

    // Computed totals
    const totals = useMemo(() => {
        let subtotal = 0;
        let discount = 0;
        let cgst = 0;
        let sgst = 0;
        let igst = 0;

        invoiceItems.forEach(item => {
            const qty = item.qty || 1;
            const rate = item.rate || 0;
            const lineDiscount = item.discount || 0;
            
            const amountBeforeTax = (qty * rate) - lineDiscount;
            subtotal += amountBeforeTax;

            // Simplified GST: assuming Intra-state (CGST + SGST) for now. In real ERP, this depends on customer state code.
            const taxRate = item.gst_rate || 0;
            const taxAmt = amountBeforeTax * (taxRate / 100);
            
            cgst += taxAmt / 2;
            sgst += taxAmt / 2;
        });

        const total = subtotal + cgst + sgst + igst;
        const roundOff = Math.round(total) - total;

        return { subtotal, discount, cgst, sgst, igst, total: Math.round(total), roundOff };
    }, [invoiceItems]);

    const handleSave = () => {
        if (!selectedCustomer) {
            alert("Please select a customer");
            return;
        }

        const newInvoice: Invoice = {
            id: `inv-${Date.now()}`,
            number: header.number,
            date: header.date,
            dueDate: header.dueDate,
            type: header.type as any,
            status: "Draft",
            customerId: selectedCustomer.id,
            customerName: selectedCustomer.name,
            items: invoiceItems as InvoiceItem[],
            subtotal: totals.subtotal,
            discountAmount: totals.discount,
            cgstAmount: totals.cgst,
            sgstAmount: totals.sgst,
            igstAmount: totals.igst,
            roundOff: totals.roundOff,
            total: totals.total,
            paymentTerms: payment.terms,
            paymentMode: payment.mode,
            transport: transport,
            notes: notes.customer,
            internalNotes: notes.internal,
        };

        addInvoice(newInvoice);
        console.log("Saved Invoice!");
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <ArrowLeft color="#081126" size={24} />
                    </Pressable>
                    <Text className="text-2xl font-sans-bold text-primary">New Invoice</Text>
                </View>
                <Pressable onPress={handleSave} className="flex-row items-center bg-primary px-4 py-2 rounded-full">
                    <Save color="white" size={16} className="mr-2" />
                    <Text className="font-sans-bold text-white">Save</Text>
                </Pressable>
            </View>

            <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                
                {/* 1. Header Details */}
                <Section 
                    title="Invoice Details" 
                    isExpanded={expandedSections.header} 
                    onToggle={() => toggleSection('header')}
                    summary={`${header.number} • ${header.date}`}
                >
                    <View className="mb-4">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Invoice Type</Text>
                        <TextInput 
                            className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                            value={header.type}
                            onChangeText={t => setHeader({...header, type: t})}
                        />
                    </View>
                    <View className="flex-row gap-4 mb-4">
                        <View className="flex-1">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Invoice No</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                                value={header.number}
                                onChangeText={t => setHeader({...header, number: t})}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Invoice Date</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                                value={header.date}
                                onChangeText={t => setHeader({...header, date: t})}
                            />
                        </View>
                    </View>
                </Section>

                {/* 2. Customer Details */}
                <Section 
                    title="Customer Details" 
                    isExpanded={expandedSections.party} 
                    onToggle={() => toggleSection('party')}
                    summary={selectedCustomer ? `${selectedCustomer.name} (${selectedCustomer.gstin || 'Unregistered'})` : 'No customer selected'}
                >
                    {selectedCustomer ? (
                        <View className="bg-slate-50 p-3 rounded-lg border border-border mb-3">
                            <Text className="font-sans-bold text-primary text-base">{selectedCustomer.name}</Text>
                            <Text className="font-sans-medium text-muted-foreground text-sm mt-1">{selectedCustomer.mobile}</Text>
                            {selectedCustomer.gstin && <Text className="font-sans-bold text-green-700 text-xs mt-1">GSTIN: {selectedCustomer.gstin}</Text>}
                        </View>
                    ) : null}
                    
                    <Pressable 
                        className="bg-primary/10 border border-primary/20 rounded-lg p-3 items-center justify-center flex-row"
                        onPress={() => setCustomerModalVisible(true)}
                    >
                        <Text className="font-sans-bold text-primary">{selectedCustomer ? "Change Customer" : "Select Customer"}</Text>
                    </Pressable>
                </Section>

                {/* 3. Items Grid */}
                <Section 
                    title="Invoice Items" 
                    isExpanded={expandedSections.items} 
                    onToggle={() => toggleSection('items')}
                    summary={`${invoiceItems.length} items • ₹${totals.total.toLocaleString('en-IN')}`}
                >
                    {invoiceItems.map((item, index) => (
                        <View key={index} className="bg-slate-50 border border-border rounded-lg p-3 mb-3">
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1">
                                    <Text className="font-sans-bold text-primary">{item.name}</Text>
                                    <Text className="font-sans-medium text-xs text-muted-foreground">HSN/SAC: {item.hsn_sac}</Text>
                                </View>
                                <Pressable onPress={() => setInvoiceItems(invoiceItems.filter((_, i) => i !== index))} className="p-1">
                                    <Trash2 color="#ef4444" size={18} />
                                </Pressable>
                            </View>
                            <View className="flex-row justify-between items-center mt-2 border-t border-border pt-2">
                                <View className="flex-1">
                                    <Text className="font-sans-medium text-xs text-muted-foreground">Qty</Text>
                                    <View className="flex-row items-center mt-1">
                                        <TextInput 
                                            className="bg-white border border-border rounded px-2 py-1 font-sans-bold text-primary w-16 text-center"
                                            value={item.qty !== undefined ? String(item.qty) : ''}
                                            keyboardType="numeric"
                                            onChangeText={t => {
                                                const newItems = [...invoiceItems];
                                                newItems[index].qty = t ? parseFloat(t) : 0;
                                                setInvoiceItems(newItems);
                                            }}
                                        />
                                        <Text className="font-sans-medium text-xs text-muted-foreground ml-1">{item.unit}</Text>
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <Text className="font-sans-medium text-xs text-muted-foreground">Rate</Text>
                                    <TextInput 
                                        className="bg-white border border-border rounded px-2 py-1 font-sans-bold text-primary w-20 mt-1"
                                        value={item.rate !== undefined ? String(item.rate) : ''}
                                        keyboardType="numeric"
                                        onChangeText={t => {
                                            const newItems = [...invoiceItems];
                                            newItems[index].rate = t ? parseFloat(t) : 0;
                                            setInvoiceItems(newItems);
                                        }}
                                    />
                                </View>
                                <View className="flex-1 items-end">
                                    <Text className="font-sans-medium text-xs text-muted-foreground">Total (incl. GST)</Text>
                                    <Text className="font-sans-bold text-primary mt-2">
                                        ₹{((item.qty || 0) * (item.rate || 0) * (1 + (item.gst_rate || 0)/100)).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    <Pressable 
                        className="bg-primary/10 border border-primary/20 rounded-lg p-3 items-center justify-center flex-row mb-4"
                        onPress={() => setItemModalVisible(true)}
                    >
                        <Plus color="#0f172a" size={16} className="mr-2" />
                        <Text className="font-sans-bold text-primary">Add Item from Catalog</Text>
                    </Pressable>

                    {/* Tax Summary inside Items Section */}
                    {invoiceItems.length > 0 && (
                        <View className="bg-slate-100 rounded-lg p-4 border border-border">
                            <Text className="font-sans-bold text-primary mb-2">Tax Summary</Text>
                            <View className="flex-row justify-between mb-1">
                                <Text className="font-sans-medium text-muted-foreground">Subtotal</Text>
                                <Text className="font-sans-bold text-primary">₹{totals.subtotal.toFixed(2)}</Text>
                            </View>
                            <View className="flex-row justify-between mb-1">
                                <Text className="font-sans-medium text-muted-foreground">CGST</Text>
                                <Text className="font-sans-bold text-primary">₹{totals.cgst.toFixed(2)}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">SGST</Text>
                                <Text className="font-sans-bold text-primary">₹{totals.sgst.toFixed(2)}</Text>
                            </View>
                            <View className="h-[1px] w-full bg-border mb-2" />
                            <View className="flex-row justify-between items-center">
                                <Text className="font-sans-bold text-lg text-primary">Grand Total</Text>
                                <Text className="font-sans-bold text-xl text-primary">₹{totals.total.toLocaleString('en-IN')}</Text>
                            </View>
                        </View>
                    )}
                </Section>

                {/* 4. Payment Info */}
                <Section 
                    title="Payment Information" 
                    isExpanded={expandedSections.payment} 
                    onToggle={() => toggleSection('payment')}
                    summary={`${payment.mode} • ${payment.terms}`}
                >
                    <View className="flex-row gap-4 mb-4">
                        <View className="flex-1">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Payment Mode</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                                value={payment.mode}
                                onChangeText={t => setPayment({...payment, mode: t})}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Payment Terms</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                                value={payment.terms}
                                onChangeText={t => setPayment({...payment, terms: t})}
                            />
                        </View>
                    </View>
                </Section>

                {/* 5. Transport Info */}
                <Section 
                    title="Transport & E-Way Bill" 
                    isExpanded={expandedSections.transport} 
                    onToggle={() => toggleSection('transport')}
                    summary={transport.vehicleNo || 'Not specified'}
                >
                    <View className="flex-row gap-4 mb-4">
                        <View className="flex-1">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Vehicle No</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                                value={transport.vehicleNo}
                                onChangeText={t => setTransport({...transport, vehicleNo: t})}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">E-Way Bill No</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                                value={transport.ewayBill}
                                onChangeText={t => setTransport({...transport, ewayBill: t})}
                            />
                        </View>
                    </View>
                </Section>

                {/* 6. Notes */}
                <Section 
                    title="Notes & Remarks" 
                    isExpanded={expandedSections.notes} 
                    onToggle={() => toggleSection('notes')}
                >
                    <View className="mb-4">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Customer Notes (Printed on Invoice)</Text>
                        <TextInput 
                            className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary h-20"
                            multiline
                            textAlignVertical="top"
                            value={notes.customer}
                            onChangeText={t => setNotes({...notes, customer: t})}
                        />
                    </View>
                </Section>

            </ScrollView>

            {/* Modals for Selection */}
            {/* Customer Selector Modal */}
            <Modal visible={customerModalVisible} transparent animationType="slide">
                <View className="flex-1 justify-end">
                    <Pressable className="absolute inset-0" onPress={() => setCustomerModalVisible(false)}>
                        <BlurView intensity={20} tint="dark" style={{flex: 1}} />
                        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}} />
                    </Pressable>
                    <View className="bg-white rounded-t-3xl h-[60%] p-5 shadow-xl">
                        <Text className="font-sans-bold text-xl text-primary mb-4">Select Customer</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {parties.filter(p => p.type === 'customer' || p.type === 'both').map(party => (
                                <Pressable 
                                    key={party.id} 
                                    className="p-4 border-b border-border flex-row justify-between items-center"
                                    onPress={() => { setSelectedCustomer(party); setCustomerModalVisible(false); }}
                                >
                                    <View>
                                        <Text className="font-sans-bold text-primary">{party.name}</Text>
                                        <Text className="font-sans-medium text-muted-foreground text-xs mt-1">
                                            {party.gstin ? `GST: ${party.gstin}` : 'Unregistered'}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Item Selector Modal */}
            <Modal visible={itemModalVisible} transparent animationType="slide">
                <View className="flex-1 justify-end">
                    <Pressable className="absolute inset-0" onPress={() => setItemModalVisible(false)}>
                        <BlurView intensity={20} tint="dark" style={{flex: 1}} />
                        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}} />
                    </Pressable>
                    <View className="bg-white rounded-t-3xl h-[70%] p-5 shadow-xl">
                        <Text className="font-sans-bold text-xl text-primary mb-4">Add Item to Invoice</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {items.map(item => (
                                <Pressable 
                                    key={item.id} 
                                    className="p-4 border-b border-border flex-row justify-between items-center"
                                    onPress={() => { 
                                        setInvoiceItems([...invoiceItems, {
                                            productId: item.id,
                                            name: item.name,
                                            hsn_sac: item.hsn_sac,
                                            qty: 1,
                                            unit: item.unit || 'pcs',
                                            rate: item.price,
                                            gst_rate: item.gst_rate,
                                            discount: 0
                                        }]); 
                                        setItemModalVisible(false); 
                                    }}
                                >
                                    <View>
                                        <Text className="font-sans-bold text-primary">{item.name}</Text>
                                        <Text className="font-sans-medium text-muted-foreground text-xs mt-1">
                                            ₹{item.price} • Stock: {item.stock || 0}
                                        </Text>
                                    </View>
                                    <View className="bg-primary/10 px-2 py-1 rounded">
                                        <Text className="font-sans-bold text-[10px] text-primary">ADD</Text>
                                    </View>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}
