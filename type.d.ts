import type { ImageSourcePropType } from "react-native";

declare module "*.png" {
    const value: ImageSourcePropType;
    export default value;
}

declare global {
    interface AppTab {
        name: string;
        title: string;
        icon: ImageSourcePropType;
    }

    interface TabIconProps {
        focused: boolean;
        icon: ImageSourcePropType;
    }

    interface Subscription {
        id: string;
        icon: ImageSourcePropType;
        name: string;
        plan?: string;
        category?: string;
        paymentMethod?: string;
        status?: string;
        startDate?: string;
        price: number;
        currency?: string;
    }

    interface BalanceCardData {
        title: string;
        amount: number;
        gstAmount: number;
        currency: string;
    }

    interface OutstandingItem {
        label: string;
        amount: number;
        subtitle?: string;
        status: "current" | "overdue";
    }

    interface OutstandingSummary {
        title: string;
        totalReceivables: number;
        currency: string;
        items: OutstandingItem[];
    }

    interface Party {
        id: string;
        name: string;
        gstin?: string;
        phone: string;
        balance: number;
        type: "customer" | "vendor" | "both";
        pan?: string;
        contactPerson?: string;
        alternatePhone?: string;
        email?: string;
        billingAddress?: {
            street?: string;
            city?: string;
            state?: string;
            pinCode?: string;
        };
        shippingAddress?: {
            sameAsBilling?: boolean;
            street?: string;
            city?: string;
            state?: string;
            pinCode?: string;
        };
        balanceType?: "receivable" | "payable";
        creditLimit?: number;
        creditPeriod?: number;
        priceList?: "retail" | "wholesale" | "dealer";
        bankDetails?: {
            holderName?: string;
            bankName?: string;
            accountNumber?: string;
            ifsc?: string;
        };
        paymentTerms?: string;
        supplierCode?: string;
        businessCategory?: string;
        msmeNumber?: string;
        website?: string;
        notes?: string;
        tags?: string;
        salesperson?: string;
        partyCode?: string;
        documents?: {
            gst?: boolean;
            pan?: boolean;
            other?: boolean;
        };
    }

    interface Item {
        id: string;
        name: string;
        type: "product" | "service";
        price: number;
        hsn_sac: string;
        stock?: number;
        gst_rate: number;
        unit?: string;
        purchasePrice?: number;
        description?: string;
        sku?: string;
        barcode?: string;
        category?: string;
        minimumStock?: number;
        taxType?: "exclusive" | "inclusive";
        cess?: number;
        openingStock?: number;
        images?: boolean;
    }

    interface InvoiceItem {
        id: string;
        productId?: string;
        name: string;
        hsn_sac?: string;
        qty: number;
        unit: string;
        rate: number;
        discount?: number;
        discountType?: "percentage" | "flat";
        gst_rate: number;
        tax_amount: number;
        line_total: number;
    }

    interface Invoice {
        id: string;
        number: string;
        date: string;
        dueDate?: string;
        financialYear?: string;
        type: "Tax Invoice" | "Proforma Invoice" | "Credit Note" | "Debit Note" | "Export Invoice" | "Delivery Challan" | "Purchase Order" | "Vendor Bill";
        status: "Draft" | "Sent" | "Partially Paid" | "Paid" | "Overdue" | "Cancelled" | "Pending";
        
        customerId: string;
        customerName: string;
        vendorId?: string;
        vendorName?: string;
        
        items: InvoiceItem[];
        
        subtotal: number;
        discountAmount: number;
        cgstAmount: number;
        sgstAmount: number;
        igstAmount: number;
        roundOff: number;
        total: number;

        paymentTerms?: string;
        paymentMode?: string;
        
        transport?: {
            deliveryDate?: string;
            vehicleNumber?: string;
            transporterName?: string;
            lrNumber?: string;
            dispatchFrom?: string;
            dispatchThrough?: string;
            ewayBillNumber?: string;
            ewayBillDate?: string;
        };
        
        notes?: string;
        internalNotes?: string;
        
        metadata?: {
            createdAt?: string;
            createdBy?: string;
            approvedStatus?: "Pending" | "Approved" | "Rejected";
            approvedBy?: string;
            approvedAt?: string;
        };
    }

    interface Payment {
        id: string;
        date: string;
        amount: number;
        mode: "UPI" | "Bank Transfer" | "Cash" | "NEFT" | "RTGS" | "Cheque";
        type: "in" | "out";
        partyName: string;
    }

    interface Expense {
        id: string;
        date: string;
        category: string;
        amount: number;
        paymentMode: "UPI" | "Bank Transfer" | "Cash" | "Credit Card" | "Debit Card";
        vendorName?: string;
        notes?: string;
        receiptImage?: string;
    }
}
