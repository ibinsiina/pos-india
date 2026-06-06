import React, { createContext, useContext, useState } from 'react';
import { INVOICES, ITEMS, PARTIES, PURCHASES, EXPENSES, PAYMENTS } from '../../constants/data';

type AppContextType = {
    invoices: Invoice[];
    items: Item[];
    parties: Party[];
    purchases: Invoice[];
    expenses: Expense[];
    payments: Payment[];
    addInvoice: (invoice: Invoice) => void;
    updateInvoice: (invoice: Invoice) => void;
    deleteInvoice: (id: string) => void;
    addItem: (item: Item) => void;
    updateItem: (item: Item) => void;
    deleteItem: (id: string) => void;
    addParty: (party: Party) => void;
    updateParty: (party: Party) => void;
    deleteParty: (id: string) => void;
    addPurchase: (purchase: Invoice) => void;
    updatePurchase: (purchase: Invoice) => void;
    deletePurchase: (id: string) => void;
    addExpense: (expense: Expense) => void;
    updateExpense: (expense: Expense) => void;
    deleteExpense: (id: string) => void;
    addPayment: (payment: Payment) => void;
    updatePayment: (payment: Payment) => void;
    deletePayment: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);
    const [items, setItems] = useState<Item[]>(ITEMS);
    const [parties, setParties] = useState<Party[]>(PARTIES);
    const [purchases, setPurchases] = useState<Invoice[]>(PURCHASES);
    const [expenses, setExpenses] = useState<Expense[]>(EXPENSES);
    const [payments, setPayments] = useState<Payment[]>(PAYMENTS);

    const addInvoice = (invoice: Invoice) => setInvoices([invoice, ...invoices]);
    const updateInvoice = (invoice: Invoice) => setInvoices(invoices.map(i => i.id === invoice.id ? invoice : i));
    const deleteInvoice = (id: string) => setInvoices(invoices.filter(i => i.id !== id));

    const addItem = (item: Item) => setItems([item, ...items]);
    const updateItem = (item: Item) => setItems(items.map(i => i.id === item.id ? item : i));
    const deleteItem = (id: string) => setItems(items.filter(i => i.id !== id));

    const addParty = (party: Party) => setParties([party, ...parties]);
    const updateParty = (party: Party) => setParties(parties.map(p => p.id === party.id ? party : p));
    const deleteParty = (id: string) => setParties(parties.filter(p => p.id !== id));

    const addPurchase = (purchase: Invoice) => setPurchases([purchase, ...purchases]);
    const updatePurchase = (purchase: Invoice) => setPurchases(purchases.map(p => p.id === purchase.id ? purchase : p));
    const deletePurchase = (id: string) => setPurchases(purchases.filter(p => p.id !== id));

    const addExpense = (expense: Expense) => setExpenses([expense, ...expenses]);
    const updateExpense = (expense: Expense) => setExpenses(expenses.map(e => e.id === expense.id ? expense : e));
    const deleteExpense = (id: string) => setExpenses(expenses.filter(e => e.id !== id));

    const addPayment = (payment: Payment) => setPayments([payment, ...payments]);
    const updatePayment = (payment: Payment) => setPayments(payments.map(p => p.id === payment.id ? payment : p));
    const deletePayment = (id: string) => setPayments(payments.filter(p => p.id !== id));

    return (
        <AppContext.Provider value={{
            invoices, items, parties, purchases, expenses, payments,
            addInvoice, updateInvoice, deleteInvoice,
            addItem, updateItem, deleteItem,
            addParty, updateParty, deleteParty,
            addPurchase, updatePurchase, deletePurchase,
            addExpense, updateExpense, deleteExpense,
            addPayment, updatePayment, deletePayment
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
