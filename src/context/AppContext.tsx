import React, { createContext, useContext, useState } from 'react';
import { INVOICES, ITEMS, PARTIES } from '../../constants/data';

type AppContextType = {
    invoices: Invoice[];
    items: Item[];
    parties: Party[];
    addInvoice: (invoice: Invoice) => void;
    updateInvoice: (invoice: Invoice) => void;
    deleteInvoice: (id: string) => void;
    addItem: (item: Item) => void;
    updateItem: (item: Item) => void;
    deleteItem: (id: string) => void;
    addParty: (party: Party) => void;
    updateParty: (party: Party) => void;
    deleteParty: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);
    const [items, setItems] = useState<Item[]>(ITEMS);
    const [parties, setParties] = useState<Party[]>(PARTIES);

    const addInvoice = (invoice: Invoice) => setInvoices([invoice, ...invoices]);
    const updateInvoice = (invoice: Invoice) => setInvoices(invoices.map(i => i.id === invoice.id ? invoice : i));
    const deleteInvoice = (id: string) => setInvoices(invoices.filter(i => i.id !== id));

    const addItem = (item: Item) => setItems([item, ...items]);
    const updateItem = (item: Item) => setItems(items.map(i => i.id === item.id ? item : i));
    const deleteItem = (id: string) => setItems(items.filter(i => i.id !== id));

    const addParty = (party: Party) => setParties([party, ...parties]);
    const updateParty = (party: Party) => setParties(parties.map(p => p.id === party.id ? party : p));
    const deleteParty = (id: string) => setParties(parties.filter(p => p.id !== id));

    return (
        <AppContext.Provider value={{
            invoices, items, parties,
            addInvoice, updateInvoice, deleteInvoice,
            addItem, updateItem, deleteItem,
            addParty, updateParty, deleteParty
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
