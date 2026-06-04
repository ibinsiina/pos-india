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
        gstin: string;
        phone: string;
        balance: number;
        type: "customer" | "vendor";
    }

    interface Item {
        id: string;
        name: string;
        type: "product" | "service";
        price: number;
        hsn_sac: string;
        stock?: number;
        gst_rate: number;
    }

    interface Invoice {
        id: string;
        number: string;
        date: string;
        customerName: string;
        status: "Paid" | "Pending" | "Overdue";
        total: number;
    }

    interface Payment {
        id: string;
        date: string;
        amount: number;
        mode: "UPI" | "Bank Transfer" | "Cash" | "NEFT" | "RTGS" | "Cheque";
        type: "in" | "out";
        partyName: string;
    }
}
