import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Plus, Trash2, Save, FileText } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Colors from '@/constants/Colors';
import { generateUUID } from '@/utils/helpers';
import { getClients, getProducts, saveInvoice } from '@/utils/storage';
import { Invoice, Client, Product, InvoiceItem } from '@/types';
import InvoiceTemplate from '@/components/InvoiceTemplate';

export default function CreateInvoiceScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [issueDateVisible, setIssueDateVisible] = useState(false);
  const [dueDateVisible, setDueDateVisible] = useState(false);
  const [invoice, setInvoice] = useState<Invoice>({
    id: generateUUID(),
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    clientId: '',
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    issueDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    items: [],
    notes: '',
    terms: 'Payment due within 14 days',
    taxRate: '0',
    totalAmount: '0',
    status: 'DRAFT',
    templateId: 'professional',
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const loadedClients = await getClients();
      const loadedProducts = await getProducts();
      setClients(loadedClients);
      setProducts(loadedProducts);
    };
    
    loadData();
  }, []);

  const updateInvoice = (field: string, value: string) => {
    setInvoice({ ...invoice, [field]: value });
  };

  const updateClient = (clientId: string) => {
    const selectedClient = clients.find(client => client.id === clientId);
    if (selectedClient) {
      setInvoice({
        ...invoice,
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientAddress: selectedClient.address || '',
        clientEmail: selectedClient.email || '',
      });
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: generateUUID(),
      description: '',
      quantity: '1',
      price: '0',
      amount: '0',
    };
    
    setInvoice({
      ...invoice,
      items: [...invoice.items, newItem],
    });
  };

  const updateItem = (id: string, field: string, value: string) => {
    const updatedItems = invoice.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-calculate amount
        if (field === 'quantity' || field === 'price') {
          const quantity = parseFloat(updatedItem.quantity) || 0;
          const price = parseFloat(updatedItem.price) || 0;
          updatedItem.amount = (quantity * price).toFixed(2);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setInvoice({ ...invoice, items: updatedItems });
    calculateTotal(updatedItems);
  };

  const removeItem = (id: string) => {
    const updatedItems = invoice.items.filter(item => item.id !== id);
    setInvoice({ ...invoice, items: updatedItems });
    calculateTotal(updatedItems);
  };

  const calculateTotal = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0);
    const taxAmount = subtotal * (parseFloat(invoice.taxRate) / 100);
    const total = (subtotal + taxAmount).toFixed(2);
    
    setInvoice(prev => ({ ...prev, totalAmount: total }));
  };

  const handleSave = async (status: string = 'DRAFT') => {
    const invoiceToSave = {
      ...invoice,
      status,
      totalAmount: calculateTotalAmount(),
    };
    
    await saveInvoice(invoiceToSave);
    router.replace('/invoices');
  };

  const calculateTotalAmount = () => {
    const subtotal = invoice.items.reduce((sum, item) => {
      return sum + parseFloat(item.amount || '0');
    }, 0);
    
    const taxAmount = subtotal * (parseFloat(invoice.taxRate) / 100);
    return (subtotal + taxAmount).toFixed(2);
  };

  const handleDateChange = (field: string, date?: Date) => {
    if (date) {
      updateInvoice(field, date.toISOString());
    }
    
    if (field === 'issueDate') {
      setIssueDateVisible(false);
    } else {
      setDueDateVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {showPreview ? (
        <View style={styles.container}>
          <View style={styles.previewHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setShowPreview(false)}
            >
              <ArrowLeft size={20} color={Colors.neutral[800]} />
              <Text style={styles.backText}>Edit</Text>
            </TouchableOpacity>
            
            <View style={styles.previewActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.saveButton]}
                onPress={() => handleSave('PENDING')}
              >
                <Save size={18} color="#FFF" />
                <Text style={styles.saveButtonText}>Save & Send</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView style={styles.previewContainer}>
            <InvoiceTemplate invoice={invoice} templateId={selectedTemplate} />
          </ScrollView>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color={Colors.neutral[800]} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setShowPreview(true)}
              >
                <FileText size={18} color={Colors.primary[700]} />
                <Text style={styles.actionText}>Preview</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.saveButton]}
                onPress={() => handleSave('PENDING')}
              >
                <Save size={18} color="#FFF" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.form}>
            <Text style={styles.sectionTitle}>Invoice Information</Text>
            
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Invoice #</Text>
                <TextInput
                  style={styles.input}
                  value={invoice.invoiceNumber}
                  onChangeText={(value) => updateInvoice('invoiceNumber', value)}
                  placeholder="INV-0001"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Template</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedTemplate}
                    onValueChange={(value) => {
                      setSelectedTemplate(value);
                      updateInvoice('templateId', value);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Professional" value="professional" />
                    <Picker.Item label="Minimal" value="minimal" />
                    <Picker.Item label="Creative" value="creative" />
                  </Picker>
                </View>
              </View>
            </View>
            
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Issue Date</Text>
                <TouchableOpacity 
                  style={styles.dateInput}
                  onPress={() => setIssueDateVisible(true)}
                >
                  <Text>
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                
                {issueDateVisible && (
                  <DateTimePicker
                    value={new Date(invoice.issueDate)}
                    mode="date"
                    display="default"
                    onChange={(_, date) => handleDateChange('issueDate', date)}
                  />
                )}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Due Date</Text>
                <TouchableOpacity 
                  style={styles.dateInput}
                  onPress={() => setDueDateVisible(true)}
                >
                  <Text>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                
                {dueDateVisible && (
                  <DateTimePicker
                    value={new Date(invoice.dueDate)}
                    mode="date"
                    display="default"
                    onChange={(_, date) => handleDateChange('dueDate', date)}
                  />
                )}
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Client</Text>
            
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={invoice.clientId}
                onValueChange={updateClient}
                style={styles.picker}
              >
                <Picker.Item label="Select a client" value="" />
                {clients.map(client => (
                  <Picker.Item 
                    key={client.id} 
                    label={client.name} 
                    value={client.id} 
                  />
                ))}
              </Picker>
            </View>
            
            <Text style={styles.sectionTitle}>Items</Text>
            
            <View style={styles.itemsHeader}>
              <Text style={[styles.itemHeaderText, { flex: 3 }]}>Description</Text>
              <Text style={[styles.itemHeaderText, { flex: 1 }]}>Qty</Text>
              <Text style={[styles.itemHeaderText, { flex: 1 }]}>Price</Text>
              <Text style={[styles.itemHeaderText, { flex: 1 }]}>Amount</Text>
              <Text style={[styles.itemHeaderText, { width: 30 }]}></Text>
            </View>
            
            {invoice.items.map((item, index) => (
              <View key={item.id} style={styles.itemRow}>
                <TextInput
                  style={[styles.itemInput, { flex: 3 }]}
                  value={item.description}
                  onChangeText={(value) => updateItem(item.id, 'description', value)}
                  placeholder="Item description"
                />
                
                <TextInput
                  style={[styles.itemInput, { flex: 1 }]}
                  value={item.quantity}
                  onChangeText={(value) => updateItem(item.id, 'quantity', value)}
                  keyboardType="numeric"
                  placeholder="1"
                />
                
                <TextInput
                  style={[styles.itemInput, { flex: 1 }]}
                  value={item.price}
                  onChangeText={(value) => updateItem(item.id, 'price', value)}
                  keyboardType="numeric"
                  placeholder="0.00"
                />
                
                <TextInput
                  style={[styles.itemInput, { flex: 1 }]}
                  value={item.amount}
                  editable={false}
                  placeholder="0.00"
                />
                
                <TouchableOpacity
                  style={styles.deleteItemButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Trash2 size={16} color={Colors.error[500]} />
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.addItemButton}
              onPress={addItem}
            >
              <Plus size={16} color={Colors.primary[600]} />
              <Text style={styles.addItemText}>Add Item</Text>
            </TouchableOpacity>
            
            <View style={styles.totalsSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>
                  ${invoice.items.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0).toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.totalRow}>
                <View style={styles.taxContainer}>
                  <Text style={styles.totalLabel}>Tax</Text>
                  <TextInput
                    style={styles.taxInput}
                    value={invoice.taxRate}
                    onChangeText={(value) => {
                      updateInvoice('taxRate', value);
                      calculateTotal(invoice.items);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                  <Text style={styles.taxPercent}>%</Text>
                </View>
                
                <Text style={styles.totalValue}>
                  ${(invoice.items.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0) * (parseFloat(invoice.taxRate) / 100)).toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.totalRow}>
                <Text style={styles.totalAmountLabel}>Total</Text>
                <Text style={styles.totalAmountValue}>${calculateTotalAmount()}</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Additional Information</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={invoice.notes}
                onChangeText={(value) => updateInvoice('notes', value)}
                placeholder="Any additional notes for the client"
                multiline
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Terms & Conditions</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={invoice.terms}
                onChangeText={(value) => updateInvoice('terms', value)}
                placeholder="Payment terms and conditions"
                multiline
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => router.back()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveAsDraftButton}
                onPress={() => handleSave('DRAFT')}
              >
                <Text style={styles.saveAsDraftText}>Save as Draft</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={() => handleSave('PENDING')}
              >
                <Text style={styles.submitButtonText}>Create Invoice</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[800],
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
    backgroundColor: Colors.primary[50],
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[700],
    marginLeft: 6,
  },
  saveButton: {
    backgroundColor: Colors.primary[600],
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    marginTop: 24,
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  formGroup: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[700],
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[900],
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[900],
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 6,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  itemsHeader: {
    flexDirection: 'row',
    marginTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[300],
  },
  itemHeaderText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[500],
    marginRight: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  itemInput: {
    padding: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 8,
  },
  deleteItemButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.primary[50],
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 24,
  },
  addItemText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary[600],
  },
  totalsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[700],
  },
  totalValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[900],
  },
  taxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taxInput: {
    width: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[300],
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 8,
    textAlign: 'center',
  },
  taxPercent: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[700],
  },
  totalAmountLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
  },
  totalAmountValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.primary[600],
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 24,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[700],
  },
  saveAsDraftButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primary[600],
    marginRight: 8,
  },
  saveAsDraftText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary[600],
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary[600],
  },
  submitButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  // Preview styles
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    backgroundColor: '#FFFFFF',
  },
  previewActions: {
    flexDirection: 'row',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});