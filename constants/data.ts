import { icons } from "./icons";

export const tabs: AppTab[] = [
    { name: "index", title: "Home", icon: icons.home },
    { name: "subscriptions", title: "Subscriptions", icon: icons.wallet },
    { name: "insights", title: "Insights", icon: icons.activity },
    { name: "settings", title: "Settings", icon: icons.setting },
];

export const HOME_USER = {
    name: "Anees | Axanees",
};

export const DASHBOARD_BALANCES: BalanceCardData[] = [
    {
        title: "Sales",
        amount: 360600,
        gstAmount: 64908,
        currency: "₹",
    },
    {
        title: "Purchase",
        amount: 57500,
        gstAmount: 0,
        currency: "₹",
    }
];

export const OUTSTANDING_DATA: OutstandingSummary[] = [
    {
        title: "Sales Outstanding",
        totalReceivables: 425508.00,
        currency: "₹",
        items: [
            {
                label: "CURRENT",
                amount: 425508.00,
                status: "current"
            },
            {
                label: "OVERDUE",
                amount: 0.00,
                subtitle: "30+ Days",
                status: "overdue"
            }
        ]
    },
    {
        title: "Purchase Outstanding",
        totalReceivables: 57500.00,
        currency: "₹",
        items: [
            {
                label: "CURRENT",
                amount: 57500.00,
                status: "current"
            },
            {
                label: "OVERDUE",
                amount: 0.00,
                subtitle: "1-15 Days",
                status: "overdue"
            }
        ]
    }
];

// INDIAN BUSINESS MOCK DATA

export const PARTIES: Party[] = [
    { id: "p1", name: "Ramesh Traders", gstin: "27AADCR2311G1Z1", phone: "+91 9876543210", balance: 45000, type: "customer" },
    { id: "p2", name: "Gupta Enterprises", gstin: "27AABCG4567H1Z5", phone: "+91 9812345678", balance: 12500, type: "customer" },
    { id: "p3", name: "Sharma & Sons", gstin: "09AAECS8899K1Z4", phone: "+91 9900112233", balance: -5000, type: "customer" },
    { id: "p4", name: "Tata Steel Wholesale", gstin: "21AAACT2233L1Z6", phone: "+91 8899001122", balance: 150000, type: "vendor" },
    { id: "p5", name: "Balaji Suppliers", gstin: "29AABCB3344M1Z2", phone: "+91 7766554433", balance: 25000, type: "vendor" },

    { id: "p6", name: "Patel Hardware", gstin: "24AABCP4455N1Z7", phone: "+91 9871112233", balance: 68000, type: "customer" },
    { id: "p7", name: "Surat Textiles", gstin: "24AACCS7766P1Z8", phone: "+91 9988776655", balance: 112000, type: "customer" },
    { id: "p8", name: "Om Packaging", gstin: "24AADCO9988Q1Z3", phone: "+91 9090909090", balance: 7500, type: "customer" },
    { id: "p9", name: "Jain Electricals", gstin: "07AAACJ5566R1Z9", phone: "+91 8877665544", balance: 34000, type: "customer" },
    { id: "p10", name: "Mahavir Traders", gstin: "08AAACM2233K1Z1", phone: "+91 8123456789", balance: 98000, type: "customer" },

    { id: "p11", name: "Ultra Cement Depot", gstin: "27AACCU8899T1Z5", phone: "+91 9898989898", balance: 220000, type: "vendor" },
    { id: "p12", name: "Prime Logistics", gstin: "24AACCP1122A1Z4", phone: "+91 7979797979", balance: 35000, type: "vendor" },
    { id: "p13", name: "National Metals", gstin: "19AACCN5566B1Z8", phone: "+91 7676767676", balance: 89000, type: "vendor" },
    { id: "p14", name: "Apex Office Solutions", gstin: "29AACCA6677C1Z6", phone: "+91 9099887766", balance: 14000, type: "vendor" },
    { id: "p15", name: "Green Energy Systems", gstin: "24AACCG2233D1Z2", phone: "+91 8080808080", balance: 56000, type: "vendor" },
];

export const ITEMS: Item[] = [
    { id: "i1", name: "TMT Bars 12mm", type: "product", price: 450, hsn_sac: "7214", stock: 500, gst_rate: 18 },
    { id: "i2", name: "Ambuja Cement 50kg", type: "product", price: 380, hsn_sac: "2523", stock: 1200, gst_rate: 28 },
    { id: "i3", name: "Office Chair Ergonomic", type: "product", price: 4500, hsn_sac: "9401", stock: 45, gst_rate: 18 },
    { id: "i4", name: "Accounting Software License", type: "service", price: 15000, hsn_sac: "9984", gst_rate: 18 },
    { id: "i5", name: "Consulting Fees", type: "service", price: 5000, hsn_sac: "9983", gst_rate: 18 },

    { id: "i6", name: "TMT Bars 16mm", type: "product", price: 620, hsn_sac: "7214", stock: 350, gst_rate: 18 },
    { id: "i7", name: "ACC Cement 50kg", type: "product", price: 395, hsn_sac: "2523", stock: 980, gst_rate: 28 },
    { id: "i8", name: "PVC Pipe 4 Inch", type: "product", price: 1250, hsn_sac: "3917", stock: 200, gst_rate: 18 },
    { id: "i9", name: "Copper Wire Bundle", type: "product", price: 2850, hsn_sac: "7408", stock: 160, gst_rate: 18 },
    { id: "i10", name: "LED Panel Light", type: "product", price: 950, hsn_sac: "9405", stock: 300, gst_rate: 12 },

    { id: "i11", name: "Desktop Computer", type: "product", price: 42000, hsn_sac: "8471", stock: 20, gst_rate: 18 },
    { id: "i12", name: "Laser Printer", type: "product", price: 18500, hsn_sac: "8443", stock: 15, gst_rate: 18 },
    { id: "i13", name: "GST Filing Service", type: "service", price: 3000, hsn_sac: "9982", gst_rate: 18 },
    { id: "i14", name: "Annual Maintenance Contract", type: "service", price: 25000, hsn_sac: "9987", gst_rate: 18 },
    { id: "i15", name: "Business Advisory", type: "service", price: 12000, hsn_sac: "9983", gst_rate: 18 },
];

export const INVOICES: Invoice[] = [
    { id: "inv1", number: "INV-2026-001", date: "15 Jun 2026", customerName: "Ramesh Traders", status: "Paid", total: 54000 },
    { id: "inv2", number: "INV-2026-002", date: "18 Jun 2026", customerName: "Gupta Enterprises", status: "Pending", total: 12500 },
    { id: "inv3", number: "INV-2026-003", date: "05 May 2026", customerName: "Sharma & Sons", status: "Overdue", total: 32000 },
    { id: "inv4", number: "INV-2026-004", date: "20 Jun 2026", customerName: "Ramesh Traders", status: "Pending", total: 45000 },

    { id: "inv5", number: "INV-2026-005", date: "22 Jun 2026", customerName: "Patel Hardware", status: "Paid", total: 68000 },
    { id: "inv6", number: "INV-2026-006", date: "24 Jun 2026", customerName: "Surat Textiles", status: "Pending", total: 112000 },
    { id: "inv7", number: "INV-2026-007", date: "27 Jun 2026", customerName: "Om Packaging", status: "Paid", total: 7500 },
    { id: "inv8", number: "INV-2026-008", date: "29 Jun 2026", customerName: "Jain Electricals", status: "Pending", total: 34000 },
    { id: "inv9", number: "INV-2026-009", date: "02 Jul 2026", customerName: "Mahavir Traders", status: "Overdue", total: 98000 },
    { id: "inv10", number: "INV-2026-010", date: "04 Jul 2026", customerName: "Surat Textiles", status: "Paid", total: 145000 },
    { id: "inv11", number: "INV-2026-011", date: "06 Jul 2026", customerName: "Patel Hardware", status: "Pending", total: 26000 },
    { id: "inv12", number: "INV-2026-012", date: "08 Jul 2026", customerName: "Om Packaging", status: "Paid", total: 19000 },
];

export const PAYMENTS: Payment[] = [
    { id: "pay1", date: "16 Jun 2026", amount: 54000, mode: "UPI", type: "in", partyName: "Ramesh Traders" },
    { id: "pay2", date: "10 Jun 2026", amount: 150000, mode: "Bank Transfer", type: "out", partyName: "Tata Steel Wholesale" },
    { id: "pay3", date: "21 Jun 2026", amount: 15000, mode: "Cash", type: "in", partyName: "Gupta Enterprises" },
    { id: "pay4", date: "22 Jun 2026", amount: 25000, mode: "UPI", type: "out", partyName: "Balaji Suppliers" },

    { id: "pay5", date: "23 Jun 2026", amount: 68000, mode: "NEFT", type: "in", partyName: "Patel Hardware" },
    { id: "pay6", date: "25 Jun 2026", amount: 45000, mode: "RTGS", type: "out", partyName: "Prime Logistics" },
    { id: "pay7", date: "28 Jun 2026", amount: 22000, mode: "UPI", type: "in", partyName: "Om Packaging" },
    { id: "pay8", date: "30 Jun 2026", amount: 78000, mode: "Bank Transfer", type: "out", partyName: "National Metals" },
    { id: "pay9", date: "03 Jul 2026", amount: 98000, mode: "Cheque", type: "in", partyName: "Mahavir Traders" },
    { id: "pay10", date: "05 Jul 2026", amount: 14000, mode: "Cash", type: "out", partyName: "Apex Office Solutions" },
    { id: "pay11", date: "07 Jul 2026", amount: 125000, mode: "RTGS", type: "out", partyName: "Ultra Cement Depot" },
    { id: "pay12", date: "09 Jul 2026", amount: 45000, mode: "UPI", type: "in", partyName: "Surat Textiles" },
];