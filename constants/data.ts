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
    { id: "p16", name: "Nitesh Traders", gstin: "24AACCG2233D1Z2", phone: "+91 8080808080", balance: 56000, type: "both" },
    { id: "p17", name: "Vikas Automobiles", gstin: "03AABCV1234E1Z1", phone: "+91 9123456789", balance: 85000, type: "customer" },
    { id: "p18", name: "Kunal Stationers", gstin: "06AACCK5678F1Z2", phone: "+91 8123987654", balance: 12000, type: "customer" },
    { id: "p19", name: "Modern Plastics", gstin: "27AABCM9012G1Z3", phone: "+91 7098765432", balance: 135000, type: "vendor" },
    { id: "p20", name: "Priya Fashion Hub", gstin: "09AABCP3456H1Z4", phone: "+91 9988112233", balance: 45000, type: "customer" },
    { id: "p21", name: "Global Freight Forwarders", gstin: "24AACCG7890I1Z5", phone: "+91 8877990011", balance: 210000, type: "vendor" }
];

export const ITEMS: Item[] = [
    { id: "i1", name: "TMT Bars 12mm", type: "product", price: 450, hsn_sac: "7214", stock: 500, gst_rate: 18, barcode: "8901234567890" },
    { id: "i2", name: "Ambuja Cement 50kg", type: "product", price: 380, hsn_sac: "2523", stock: 1200, gst_rate: 28, barcode: "8901030755365" },
    { id: "i3", name: "Office Chair Ergonomic", type: "product", price: 4500, hsn_sac: "9401", stock: 45, gst_rate: 18, barcode: "123456789012" },
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

    { id: "i16", name: "Safety Shoes", type: "product", price: 1500, hsn_sac: "6403", stock: 120, gst_rate: 18 },
    { id: "i17", name: "Drill Machine Bosch", type: "product", price: 4200, hsn_sac: "8467", stock: 25, gst_rate: 18 },
    { id: "i18", name: "Website Development", type: "service", price: 35000, hsn_sac: "9983", gst_rate: 18 },
    { id: "i19", name: "Networking Cables Box", type: "product", price: 2100, hsn_sac: "8544", stock: 60, gst_rate: 18 },
    { id: "i20", name: "Tax Audit Services", type: "service", price: 18000, hsn_sac: "9982", gst_rate: 18 }
];

export const INVOICES: Invoice[] = [
    { 
        id: "inv1", number: "INV-2026-001", date: "15 Jun 2026", type: "Tax Invoice", status: "Paid", 
        customerId: "p1", customerName: "Ramesh Traders", 
        items: [
            { id: "i1-inv1", productId: "i1", name: "Premium Cement Bag", hsn_sac: "2523", qty: 100, unit: "bags", rate: 350, gst_rate: 28, tax_amount: 9800, line_total: 44800 }
        ],
        subtotal: 35000, discountAmount: 0, cgstAmount: 4900, sgstAmount: 4900, igstAmount: 0, roundOff: 0, total: 44800 
    },
    { 
        id: "inv2", number: "INV-2026-002", date: "18 Jun 2026", type: "Tax Invoice", status: "Pending", 
        customerId: "p2", customerName: "Gupta Enterprises", 
        items: [
            { id: "i2-inv2", productId: "i2", name: "Steel TMT Bars 12mm", hsn_sac: "7214", qty: 2, unit: "tons", rate: 55000, gst_rate: 18, tax_amount: 19800, line_total: 129800 }
        ],
        subtotal: 110000, discountAmount: 0, cgstAmount: 9900, sgstAmount: 9900, igstAmount: 0, roundOff: 0, total: 129800 
    },
    { 
        id: "inv3", number: "INV-2026-003", date: "05 May 2026", type: "Tax Invoice", status: "Overdue", 
        customerId: "p3", customerName: "Sharma & Sons", 
        items: [
            { id: "i3-inv3", productId: "i8", name: "PVC Pipe 4 Inch", hsn_sac: "3917", qty: 20, unit: "pcs", rate: 1250, gst_rate: 18, tax_amount: 4500, line_total: 29500 }
        ],
        subtotal: 25000, discountAmount: 0, cgstAmount: 0, sgstAmount: 0, igstAmount: 4500, roundOff: 0, total: 29500 
    },
    { 
        id: "inv4", number: "INV-2026-004", date: "20 Jun 2026", type: "Tax Invoice", status: "Draft", 
        customerId: "p1", customerName: "Ramesh Traders", 
        items: [
            { id: "i4-inv4", productId: "i4", name: "Plywood 18mm", hsn_sac: "4412", qty: 50, unit: "sheets", rate: 1200, gst_rate: 18, tax_amount: 10800, line_total: 70800 }
        ],
        subtotal: 60000, discountAmount: 0, cgstAmount: 5400, sgstAmount: 5400, igstAmount: 0, roundOff: 0, total: 70800 
    },
    { 
        id: "inv5", number: "INV-2026-005", date: "25 Jun 2026", type: "Tax Invoice", status: "Partially Paid", 
        customerId: "p6", customerName: "Patel Hardware", 
        items: [
            { id: "i5-inv5", productId: "i9", name: "Copper Wire Bundle", hsn_sac: "7408", qty: 10, unit: "bundles", rate: 2850, gst_rate: 18, tax_amount: 5130, line_total: 33630 }
        ],
        subtotal: 28500, discountAmount: 0, cgstAmount: 2565, sgstAmount: 2565, igstAmount: 0, roundOff: 0, total: 33630 
    },
    { 
        id: "inv6", number: "INV-2026-006", date: "02 Jul 2026", type: "Tax Invoice", status: "Cancelled", 
        customerId: "p7", customerName: "Surat Textiles", 
        items: [
            { id: "i6-inv6", productId: "i10", name: "LED Panel Light", hsn_sac: "9405", qty: 50, unit: "pcs", rate: 950, gst_rate: 12, tax_amount: 5700, line_total: 53200 }
        ],
        subtotal: 47500, discountAmount: 0, cgstAmount: 2850, sgstAmount: 2850, igstAmount: 0, roundOff: 0, total: 53200 
    },
    { 
        id: "inv7", number: "INV-2026-007", date: "10 Jul 2026", type: "Tax Invoice", status: "Pending", 
        customerId: "p8", customerName: "Om Packaging", 
        items: [
            { id: "i7-inv7", productId: "i3", name: "Office Chair Ergonomic", hsn_sac: "9401", qty: 4, unit: "pcs", rate: 4500, gst_rate: 18, tax_amount: 3240, line_total: 21240 }
        ],
        subtotal: 18000, discountAmount: 0, cgstAmount: 1620, sgstAmount: 1620, igstAmount: 0, roundOff: 0, total: 21240 
    },
    { 
        id: "inv8", number: "INV-2026-008", date: "12 Jul 2026", type: "Tax Invoice", status: "Paid", 
        customerId: "p9", customerName: "Jain Electricals", 
        items: [
            { id: "i8-inv8", productId: "i11", name: "Desktop Computer", hsn_sac: "8471", qty: 1, unit: "pcs", rate: 42000, gst_rate: 18, tax_amount: 7560, line_total: 49560 }
        ],
        subtotal: 42000, discountAmount: 0, cgstAmount: 3780, sgstAmount: 3780, igstAmount: 0, roundOff: 0, total: 49560 
    },
    { 
        id: "inv9", number: "INV-2026-009", date: "15 Jul 2026", type: "Tax Invoice", status: "Overdue", 
        customerId: "p10", customerName: "Mahavir Traders", 
        items: [
            { id: "i9-inv9", productId: "i6", name: "TMT Bars 16mm", hsn_sac: "7214", qty: 10, unit: "tons", rate: 62000, gst_rate: 18, tax_amount: 111600, line_total: 731600 }
        ],
        subtotal: 620000, discountAmount: 0, cgstAmount: 55800, sgstAmount: 55800, igstAmount: 0, roundOff: 0, total: 731600 
    },
    { 
        id: "inv10", number: "INV-2026-010", date: "20 Jul 2026", type: "Proforma Invoice", status: "Sent", 
        customerId: "p1", customerName: "Ramesh Traders", 
        items: [
            { id: "i10-inv10", productId: "i13", name: "GST Filing Service", hsn_sac: "9982", qty: 1, unit: "service", rate: 3000, gst_rate: 18, tax_amount: 540, line_total: 3540 }
        ],
        subtotal: 3000, discountAmount: 0, cgstAmount: 270, sgstAmount: 270, igstAmount: 0, roundOff: 0, total: 3540 
    },
    { 
        id: "inv11", number: "INV-2026-011", date: "12 Jan 2026", type: "Tax Invoice", status: "Paid", 
        customerId: "p1", customerName: "Ramesh Traders", 
        items: [
            { id: "i1-inv11", productId: "i1", name: "Premium Cement Bag", hsn_sac: "2523", qty: 200, unit: "bags", rate: 350, gst_rate: 28, tax_amount: 19600, line_total: 89600 }
        ],
        subtotal: 70000, discountAmount: 0, cgstAmount: 9800, sgstAmount: 9800, igstAmount: 0, roundOff: 0, total: 89600 
    },
    { 
        id: "inv12", number: "INV-2026-012", date: "24 Feb 2026", type: "Tax Invoice", status: "Paid", 
        customerId: "p2", customerName: "Gupta Enterprises", 
        items: [
            { id: "i2-inv12", productId: "i2", name: "Steel TMT Bars 12mm", hsn_sac: "7214", qty: 1, unit: "tons", rate: 55000, gst_rate: 18, tax_amount: 9900, line_total: 64900 }
        ],
        subtotal: 55000, discountAmount: 0, cgstAmount: 4950, sgstAmount: 4950, igstAmount: 0, roundOff: 0, total: 64900 
    },
    { 
        id: "inv13", number: "INV-2026-013", date: "15 Mar 2026", type: "Tax Invoice", status: "Paid", 
        customerId: "p3", customerName: "Sharma & Sons", 
        items: [
            { id: "i3-inv13", productId: "i8", name: "PVC Pipe 4 Inch", hsn_sac: "3917", qty: 50, unit: "pcs", rate: 1250, gst_rate: 18, tax_amount: 11250, line_total: 73750 }
        ],
        subtotal: 62500, discountAmount: 0, cgstAmount: 0, sgstAmount: 0, igstAmount: 11250, roundOff: 0, total: 73750 
    },
    { 
        id: "inv14", number: "INV-2026-014", date: "02 Apr 2026", type: "Tax Invoice", status: "Paid", 
        customerId: "p6", customerName: "Patel Hardware", 
        items: [
            { id: "i4-inv14", productId: "i9", name: "Copper Wire Bundle", hsn_sac: "7408", qty: 20, unit: "bundles", rate: 2850, gst_rate: 18, tax_amount: 10260, line_total: 67260 }
        ],
        subtotal: 57000, discountAmount: 0, cgstAmount: 5130, sgstAmount: 5130, igstAmount: 0, roundOff: 0, total: 67260 
    }
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

    { id: "pay13", date: "11 Jul 2026", amount: 85000, mode: "NEFT", type: "in", partyName: "Vikas Automobiles" },
    { id: "pay14", date: "12 Jul 2026", amount: 135000, mode: "Bank Transfer", type: "out", partyName: "Modern Plastics" },
    { id: "pay15", date: "14 Jul 2026", amount: 45000, mode: "UPI", type: "in", partyName: "Priya Fashion Hub" },
    { id: "pay16", date: "16 Jul 2026", amount: 210000, mode: "RTGS", type: "out", partyName: "Global Freight Forwarders" },
    { id: "pay17", date: "18 Jul 2026", amount: 12000, mode: "Cash", type: "in", partyName: "Kunal Stationers" }
];

export const PURCHASES: Invoice[] = [
    {
        id: "po1", number: "PO-2026-001", date: "10 Jul 2026", type: "Purchase Order", status: "Sent",
        customerId: "p4", customerName: "Tata Steel Wholesale", // Fallbacks for old references
        vendorId: "p4", vendorName: "Tata Steel Wholesale",
        items: [
            { id: "i2-po1", productId: "i2", name: "Ambuja Cement 50kg", hsn_sac: "2523", qty: 200, unit: "bags", rate: 380, gst_rate: 28, tax_amount: 21280, line_total: 97280 }
        ],
        subtotal: 76000, discountAmount: 0, cgstAmount: 10640, sgstAmount: 10640, igstAmount: 0, roundOff: 0, total: 97280
    },
    {
        id: "bill1", number: "BILL-2026-001", date: "15 Jul 2026", type: "Vendor Bill", status: "Pending",
        customerId: "p11", customerName: "Ultra Cement Depot",
        vendorId: "p11", vendorName: "Ultra Cement Depot",
        items: [
            { id: "i7-bill1", productId: "i7", name: "ACC Cement 50kg", hsn_sac: "2523", qty: 100, unit: "bags", rate: 395, gst_rate: 28, tax_amount: 11060, line_total: 50560 }
        ],
        subtotal: 39500, discountAmount: 0, cgstAmount: 5530, sgstAmount: 5530, igstAmount: 0, roundOff: 0, total: 50560
    },
    {
        id: "bill2", number: "BILL-2026-002", date: "20 Jul 2026", type: "Vendor Bill", status: "Paid",
        customerId: "p12", customerName: "Prime Logistics",
        vendorId: "p12", vendorName: "Prime Logistics",
        items: [
            { id: "i12-bill2", productId: "i12", name: "Transport Charges", hsn_sac: "9965", qty: 1, unit: "service", rate: 15000, gst_rate: 5, tax_amount: 750, line_total: 15750 }
        ],
        subtotal: 15000, discountAmount: 0, cgstAmount: 375, sgstAmount: 375, igstAmount: 0, roundOff: 0, total: 15750
    },
    {
        id: "po4", number: "PO-2026-004", date: "01 Aug 2026", type: "Purchase Order", status: "Draft",
        customerId: "p15", customerName: "Green Energy Systems",
        vendorId: "p15", vendorName: "Green Energy Systems",
        items: [
            { id: "i10-po4", productId: "i10", name: "LED Panel Light", hsn_sac: "9405", qty: 100, unit: "pcs", rate: 950, gst_rate: 12, tax_amount: 11400, line_total: 106400 }
        ],
        subtotal: 95000, discountAmount: 0, cgstAmount: 5700, sgstAmount: 5700, igstAmount: 0, roundOff: 0, total: 106400
    },
    {
        id: "po5", number: "PO-2026-005", date: "05 Jan 2026", type: "Vendor Bill", status: "Paid",
        customerId: "p4", customerName: "Tata Steel Wholesale",
        vendorId: "p4", vendorName: "Tata Steel Wholesale",
        items: [
            { id: "i2-po5", productId: "i2", name: "Ambuja Cement 50kg", hsn_sac: "2523", qty: 100, unit: "bags", rate: 380, gst_rate: 28, tax_amount: 10640, line_total: 48640 }
        ],
        subtotal: 38000, discountAmount: 0, cgstAmount: 5320, sgstAmount: 5320, igstAmount: 0, roundOff: 0, total: 48640
    },
    {
        id: "po6", number: "PO-2026-006", date: "18 Feb 2026", type: "Vendor Bill", status: "Paid",
        customerId: "p11", customerName: "Ultra Cement Depot",
        vendorId: "p11", vendorName: "Ultra Cement Depot",
        items: [
            { id: "i7-po6", productId: "i7", name: "ACC Cement 50kg", hsn_sac: "2523", qty: 150, unit: "bags", rate: 395, gst_rate: 28, tax_amount: 16590, line_total: 75840 }
        ],
        subtotal: 59250, discountAmount: 0, cgstAmount: 8295, sgstAmount: 8295, igstAmount: 0, roundOff: 0, total: 75840
    },
    {
        id: "po7", number: "PO-2026-007", date: "22 Mar 2026", type: "Vendor Bill", status: "Paid",
        customerId: "p12", customerName: "Prime Logistics",
        vendorId: "p12", vendorName: "Prime Logistics",
        items: [
            { id: "i8-po7", productId: "i12", name: "Transport Service", hsn_sac: "9965", qty: 1, unit: "trip", rate: 12500, gst_rate: 5, tax_amount: 625, line_total: 13125 }
        ],
        subtotal: 12500, discountAmount: 0, cgstAmount: 312.5, sgstAmount: 312.5, igstAmount: 0, roundOff: 0, total: 13125
    },
    {
        id: "po8", number: "PO-2026-008", date: "10 Apr 2026", type: "Vendor Bill", status: "Paid",
        customerId: "p13", customerName: "National Metals",
        vendorId: "p13", vendorName: "National Metals",
        items: [
            { id: "i9-po8", productId: "i15", name: "Aluminum Sheets", hsn_sac: "7606", qty: 50, unit: "sheets", rate: 850, gst_rate: 18, tax_amount: 7650, line_total: 50150 }
        ],
        subtotal: 42500, discountAmount: 0, cgstAmount: 3825, sgstAmount: 3825, igstAmount: 0, roundOff: 0, total: 50150
    }
];

export const EXPENSES: Expense[] = [
    { id: "exp1", date: "01 Jul 2026", category: "Office Supplies", amount: 2500, paymentMode: "UPI", vendorName: "Stationery Mart" },
    { id: "exp2", date: "05 Jul 2026", category: "Internet Bill", amount: 1200, paymentMode: "Credit Card", vendorName: "Jio Fiber" },
    { id: "exp3", date: "10 Jul 2026", category: "Travel", amount: 4500, paymentMode: "Cash" },
    { id: "exp4", date: "15 Jul 2026", category: "Electricity", amount: 8000, paymentMode: "Bank Transfer", vendorName: "MSEB" },
    { id: "exp5", date: "20 Jul 2026", category: "Refreshments", amount: 800, paymentMode: "UPI" },
    { id: "exp6", date: "25 Jul 2026", category: "Software Subscriptions", amount: 3500, paymentMode: "Credit Card", vendorName: "Adobe" },
];