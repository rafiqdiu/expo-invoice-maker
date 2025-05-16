import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Search, Plus, Filter, FilePenLine } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { getInvoices } from '@/utils/storage';
import { Invoice } from '@/types';
import InvoiceCard from '@/components/InvoiceCard';

export default function InvoicesScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadInvoices = async () => {
        const storedInvoices = await getInvoices();
        setInvoices(storedInvoices);
      };
      
      loadInvoices();
    }, [])
  );

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchQuery === '' || 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === null || invoice.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <FilePenLine size={64} color={Colors.neutral[300]} />
      <Text style={styles.emptyTitle}>No invoices found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || filterStatus 
          ? "Try adjusting your search or filters"
          : "Create your first invoice to get started"}
      </Text>
      {!searchQuery && !filterStatus && (
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('/invoice/create')}
        >
          <Text style={styles.createButtonText}>Create Invoice</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const FilterButton = ({ status, label }: { status: string | null, label: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterStatus === status && styles.filterButtonActive
      ]}
      onPress={() => setFilterStatus(filterStatus === status ? null : status)}
    >
      <Text style={[
        styles.filterButtonText,
        filterStatus === status && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Invoices</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/invoice/create')}
        >
          <Plus size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.neutral[400]} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search invoices..."
          placeholderTextColor={Colors.neutral[400]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filterLabel}>
          <Filter size={16} color={Colors.neutral[500]} />
          <Text style={styles.filterLabelText}>Filter:</Text>
        </View>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          <FilterButton status={null} label="All" />
          <FilterButton status="DRAFT" label="Draft" />
          <FilterButton status="PENDING" label="Pending" />
          <FilterButton status="PAID" label="Paid" />
          <FilterButton status="OVERDUE" label="Overdue" />
        </ScrollView>
      </View>

      <FlatList
        data={filteredInvoices}
        renderItem={({ item }) => <InvoiceCard invoice={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
  },
  addButton: {
    backgroundColor: Colors.primary[600],
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[900],
  },
  filtersContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  filterLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  filterLabelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[500],
    marginLeft: 4,
  },
  filtersScrollContent: {
    paddingRight: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.neutral[100],
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[600],
  },
  filterButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  filterButtonTextActive: {
    color: '#FFF',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.neutral[700],
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[500],
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: Colors.primary[600],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});