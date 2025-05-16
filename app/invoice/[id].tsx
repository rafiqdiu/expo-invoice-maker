import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Send, Download, Trash2, Edit, Clock, CheckCircle, AlertCircle } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Colors from '@/constants/Colors';
import { getInvoice, deleteInvoice, updateInvoice } from '@/utils/storage';
import { Invoice } from '@/types';
import InvoiceTemplate from '@/components/InvoiceTemplate';
import { generateInvoiceHTML } from '@/utils/invoiceGenerator';

export default function InvoiceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadInvoice();
    }
  }, [id]);

  const loadInvoice = async () => {
    setLoading(true);
    try {
      const loadedInvoice = await getInvoice(id);
      setInvoice(loadedInvoice);
    } catch (error) {
      console.error('Failed to load invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Invoice',
      'Are you sure you want to delete this invoice? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            if (invoice) {
              await deleteInvoice(invoice.id);
              router.replace('/invoices');
            }
          }
        },
      ]
    );
  };

  const handleUpdateStatus = async (status: string) => {
    if (invoice) {
      const updatedInvoice = { ...invoice, status };
      await updateInvoice(updatedInvoice);
      setInvoice(updatedInvoice);
    }
  };

  const handleShare = async () => {
    try {
      if (invoice) {
        const htmlContent = generateInvoiceHTML(invoice);
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Invoice ${invoice.invoiceNumber}`,
          UTI: 'com.adobe.pdf',
        });
      }
    } catch (error) {
      console.error('Error sharing invoice:', error);
      Alert.alert('Error', 'Failed to share invoice');
    }
  };

  const handleDownload = async () => {
    try {
      if (invoice) {
        const htmlContent = generateInvoiceHTML(invoice);
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Save Invoice ${invoice.invoiceNumber}`,
          UTI: 'com.adobe.pdf',
        });
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      Alert.alert('Error', 'Failed to download invoice');
    }
  };

  const getStatusIcon = () => {
    if (!invoice) return null;
    
    switch (invoice.status) {
      case 'PAID':
        return <CheckCircle size={20} color={Colors.success[500]} />;
      case 'PENDING':
        return <Clock size={20} color={Colors.warning[500]} />;
      case 'OVERDUE':
        return <AlertCircle size={20} color={Colors.error[500]} />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    if (!invoice) return Colors.neutral;
    
    switch (invoice.status) {
      case 'PAID':
        return Colors.success;
      case 'PENDING':
        return Colors.warning;
      case 'OVERDUE':
        return Colors.error;
      default:
        return Colors.neutral;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading invoice...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!invoice) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invoice not found</Text>
          <TouchableOpacity 
            style={styles.backToListButton}
            onPress={() => router.replace('/invoices')}
          >
            <Text style={styles.backToListText}>Back to Invoices</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColors = getStatusColor();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={Colors.neutral[800]} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Send size={18} color={Colors.primary[700]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleDownload}
          >
            <Download size={18} color={Colors.primary[700]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push(`/invoice/edit/${invoice.id}`)}
          >
            <Edit size={18} color={Colors.primary[700]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleDelete}
          >
            <Trash2 size={18} color={Colors.error[500]} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.infoBar}>
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{invoice.clientName}</Text>
          </View>
        </View>
        
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: statusColors[50] }
          ]}
        >
          {getStatusIcon()}
          <Text 
            style={[
              styles.statusText, 
              { color: statusColors[700] }
            ]}
          >
            {invoice.status}
          </Text>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <InvoiceTemplate invoice={invoice} templateId={invoice.templateId || 'professional'} />
      </ScrollView>
      
      <View style={styles.footer}>
        {invoice.status === 'DRAFT' && (
          <TouchableOpacity 
            style={[styles.statusButton, { backgroundColor: Colors.warning[500] }]}
            onPress={() => handleUpdateStatus('PENDING')}
          >
            <Text style={styles.statusButtonText}>Mark as Pending</Text>
          </TouchableOpacity>
        )}
        
        {invoice.status === 'PENDING' && (
          <TouchableOpacity 
            style={[styles.statusButton, { backgroundColor: Colors.success[500] }]}
            onPress={() => handleUpdateStatus('PAID')}
          >
            <Text style={styles.statusButtonText}>Mark as Paid</Text>
          </TouchableOpacity>
        )}
        
        {invoice.status === 'PENDING' && (
          <TouchableOpacity 
            style={[styles.statusButton, { backgroundColor: Colors.error[500] }]}
            onPress={() => handleUpdateStatus('OVERDUE')}
          >
            <Text style={styles.statusButtonText}>Mark as Overdue</Text>
          </TouchableOpacity>
        )}
        
        {(invoice.status === 'OVERDUE' || invoice.status === 'PAID') && (
          <TouchableOpacity 
            style={[styles.statusButton, { backgroundColor: Colors.warning[500] }]}
            onPress={() => handleUpdateStatus('PENDING')}
          >
            <Text style={styles.statusButtonText}>Mark as Pending</Text>
          </TouchableOpacity>
        )}
      </View>
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
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    marginLeft: 8,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[600],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  statusButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  statusButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[600],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[800],
    marginBottom: 16,
  },
  backToListButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.primary[600],
    borderRadius: 8,
  },
  backToListText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
});