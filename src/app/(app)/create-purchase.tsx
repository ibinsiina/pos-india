import { useRouter } from "expo-router";
import { useAppContext } from "../../context/AppContext";
import DocumentBuilder from "@/components/DocumentBuilder";


export default function CreatePurchaseScreen() {
    const router = useRouter();
    const { addPurchase } = useAppContext();

    const handleSave = (documentData: any) => {
        const newPurchase = {
            id: `po-${Date.now()}`,
            number: documentData.header.number,
            date: documentData.header.date,
            dueDate: documentData.header.dueDate,
            type: documentData.header.type,
            status: "Draft",
            customerId: documentData.selectedParty.id, // Fallback
            customerName: documentData.selectedParty.name,
            vendorId: documentData.selectedParty.id,
            vendorName: documentData.selectedParty.name,
            items: documentData.items,
            subtotal: documentData.totals.subtotal,
            discountAmount: documentData.totals.discount,
            cgstAmount: documentData.totals.cgst,
            sgstAmount: documentData.totals.sgst,
            igstAmount: documentData.totals.igst,
            roundOff: documentData.totals.roundOff,
            total: documentData.totals.total,
            paymentTerms: documentData.payment.terms,
            paymentMode: documentData.payment.mode,
            notes: documentData.notes.external,
            internalNotes: documentData.notes.internal,
        };

        addPurchase(newPurchase as any);
        console.log("Saved Purchase!");
        router.back();
    };

    return (
        <DocumentBuilder
            title="New Purchase"
            defaultType="Purchase Order"
            defaultPrefix="PO-"
            partyLabel="Vendor"
            partyFilter="vendor"
            hasTransport={false}
            defaultNotes="Please deliver goods within 7 days."
            onSave={handleSave}
        />
    );
}
