export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes: string;
  terms: string;
  taxRate: string;
  totalAmount: string;
  status: string; // 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE'
  templateId: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: string;
  price: string;
  amount: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  unit?: string;
  tax?: string;
}

export interface Business {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  taxId?: string;
  currency: string;
}