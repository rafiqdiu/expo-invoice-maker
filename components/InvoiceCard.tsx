import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Invoice } from '@/types';
import Colors from '@/constants/Colors';
import { formatCurrency, formatDate } from '@/utils/formatters';

type InvoiceCardProps = {
  invoice: Invoice;
};

export default function InvoiceCard({ invoice }: InvoiceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return Colors.success;
      case 'PENDING':
        return Colors.warning;
      case 'OVERDUE':
        return Colors.error;
      case 'DRAFT':
        return Colors.neutral;
      default:
        return Colors.neutral;
    }
  };

  const statusColors = getStatusColor(invoice.status);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push(`/invoice/${invoice.id}`)}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          <Text style={styles.clientName}>{invoice.clientName}</Text>
        </View>
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: statusColors[50] }
          ]}
        >
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
      
      <View style={styles.divider} />
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.detailValue}>{formatCurrency(parseFloat(invoice.totalAmount))}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{formatDate(invoice.dueDate)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  invoiceNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[600],
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[200],
    marginBottom: 14,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailRow: {
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[500],
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[800],
  },
});