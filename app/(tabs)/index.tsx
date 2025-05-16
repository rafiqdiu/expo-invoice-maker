import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback } from 'react';
import { Plus, TrendingUp, Clock, AlertCircle, DollarSign, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { getInvoices } from '@/utils/storage';
import { Invoice } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import InvoiceCard from '@/components/InvoiceCard';
import { router } from 'expo-router';

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalOverdue, setTotalOverdue] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const loadInvoices = async () => {
        const storedInvoices = await getInvoices();
        setInvoices(storedInvoices);
        
        // Calculate totals
        let paid = 0;
        let pending = 0;
        let overdue = 0;
        
        storedInvoices.forEach(invoice => {
          const amount = parseFloat(invoice.totalAmount);
          switch(invoice.status) {
            case 'PAID':
              paid += amount;
              break;
            case 'PENDING':
              pending += amount;
              break;
            case 'OVERDUE':
              overdue += amount;
              break;
          }
        });
        
        setTotalPaid(paid);
        setTotalPending(pending);
        setTotalOverdue(overdue);
      };
      
      loadInvoices();
    }, [])
  );

  const recentInvoices = invoices.slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity 
            style={styles.createButton} 
            onPress={() => router.push('/invoice/create')}
          >
            <Plus size={20} color="#FFF" />
            <Text style={styles.createButtonText}>New Invoice</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCardsContainer}>
          <View style={[styles.summaryCard, { backgroundColor: Colors.success[500] }]}>
            <View style={styles.summaryIconContainer}>
              <TrendingUp size={24} color="#FFF" />
            </View>
            <Text style={styles.summaryLabel}>Paid</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalPaid)}</Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: Colors.warning[500] }]}>
            <View style={styles.summaryIconContainer}>
              <Clock size={24} color="#FFF" />
            </View>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalPending)}</Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: Colors.error[500] }]}>
            <View style={styles.summaryIconContainer}>
              <AlertCircle size={24} color="#FFF" />
            </View>
            <Text style={styles.summaryLabel}>Overdue</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalOverdue)}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Invoices</Text>
          <TouchableOpacity 
            style={styles.viewAllButton} 
            onPress={() => router.push('/invoices')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ArrowRight size={16} color={Colors.primary[600]} />
          </TouchableOpacity>
        </View>

        {recentInvoices.length > 0 ? (
          <View style={styles.recentInvoicesContainer}>
            {recentInvoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <DollarSign size={48} color={Colors.neutral[300]} />
            <Text style={styles.emptyStateText}>No invoices yet</Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => router.push('/invoice/create')}
            >
              <Text style={styles.emptyStateButtonText}>Create your first invoice</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[600],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFF',
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  summaryCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    width: '31%',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryIconContainer: {
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#FFF',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    color: '#FFF',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginRight: 4,
  },
  recentInvoicesContainer: {
    marginBottom: 24,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
    marginVertical: 16,
  },
  emptyStateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[500],
    marginTop: 16,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: Colors.primary[600],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});