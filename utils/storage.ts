import AsyncStorage from '@react-native-async-storage/async-storage';
import { Invoice, Client, Product, Business } from '@/types';

// Keys for AsyncStorage
const INVOICES_KEY = 'invoices';
const CLIENTS_KEY = 'clients';
const PRODUCTS_KEY = 'products';
const BUSINESS_KEY = 'business';

// Invoice Functions
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(INVOICES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting invoices:', e);
    return [];
  }
};

export const getInvoice = async (id: string): Promise<Invoice | null> => {
  try {
    const invoices = await getInvoices();
    return invoices.find(invoice => invoice.id === id) || null;
  } catch (e) {
    console.error('Error getting invoice:', e);
    return null;
  }
};

export const saveInvoice = async (invoice: Invoice): Promise<void> => {
  try {
    const invoices = await getInvoices();
    const index = invoices.findIndex(i => i.id === invoice.id);
    
    if (index >= 0) {
      // Update existing invoice
      invoices[index] = invoice;
    } else {
      // Add new invoice
      invoices.push(invoice);
    }
    
    await AsyncStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  } catch (e) {
    console.error('Error saving invoice:', e);
  }
};

export const updateInvoice = async (invoice: Invoice): Promise<void> => {
  try {
    const invoices = await getInvoices();
    const index = invoices.findIndex(i => i.id === invoice.id);
    
    if (index >= 0) {
      invoices[index] = invoice;
      await AsyncStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
    }
  } catch (e) {
    console.error('Error updating invoice:', e);
  }
};

export const deleteInvoice = async (id: string): Promise<void> => {
  try {
    const invoices = await getInvoices();
    const filtered = invoices.filter(invoice => invoice.id !== id);
    await AsyncStorage.setItem(INVOICES_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting invoice:', e);
  }
};

// Client Functions
export const getClients = async (): Promise<Client[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CLIENTS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting clients:', e);
    return [];
  }
};

export const getClient = async (id: string): Promise<Client | null> => {
  try {
    const clients = await getClients();
    return clients.find(client => client.id === id) || null;
  } catch (e) {
    console.error('Error getting client:', e);
    return null;
  }
};

export const saveClient = async (client: Client): Promise<void> => {
  try {
    const clients = await getClients();
    const index = clients.findIndex(c => c.id === client.id);
    
    if (index >= 0) {
      // Update existing client
      clients[index] = client;
    } else {
      // Add new client
      clients.push(client);
    }
    
    await AsyncStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  } catch (e) {
    console.error('Error saving client:', e);
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  try {
    const clients = await getClients();
    const filtered = clients.filter(client => client.id !== id);
    await AsyncStorage.setItem(CLIENTS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting client:', e);
  }
};

// Product Functions
export const getProducts = async (): Promise<Product[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PRODUCTS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting products:', e);
    return [];
  }
};

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const products = await getProducts();
    return products.find(product => product.id === id) || null;
  } catch (e) {
    console.error('Error getting product:', e);
    return null;
  }
};

export const saveProduct = async (product: Product): Promise<void> => {
  try {
    const products = await getProducts();
    const index = products.findIndex(p => p.id === product.id);
    
    if (index >= 0) {
      // Update existing product
      products[index] = product;
    } else {
      // Add new product
      products.push(product);
    }
    
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving product:', e);
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const products = await getProducts();
    const filtered = products.filter(product => product.id !== id);
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting product:', e);
  }
};

// Business Functions
export const getBusiness = async (): Promise<Business | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(BUSINESS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting business:', e);
    return null;
  }
};

export const saveBusiness = async (business: Business): Promise<void> => {
  try {
    await AsyncStorage.setItem(BUSINESS_KEY, JSON.stringify(business));
  } catch (e) {
    console.error('Error saving business:', e);
  }
};