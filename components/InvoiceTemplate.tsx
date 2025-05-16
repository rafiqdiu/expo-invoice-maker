import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Invoice, Business } from '@/types';
import Colors from '@/constants/Colors';
import { getBusiness } from '@/utils/storage';
import { formatCurrency, formatDate } from '@/utils/formatters';

type InvoiceTemplateProps = {
  invoice: Invoice;
  templateId: string;
};

export default function InvoiceTemplate({ invoice, templateId }: InvoiceTemplateProps) {
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    const loadBusiness = async () => {
      const businessData = await getBusiness();
      setBusiness(businessData);
    };
    
    loadBusiness();
  }, []);

  const renderProfessionalTemplate = () => (
    <View style={styles.professionalContainer}>
      <View style={styles.professionalHeader}>
        <View>
          <Text style={styles.professionalTitle}>INVOICE</Text>
          <Text style={styles.professionalInvoiceNumber}>{invoice.invoiceNumber}</Text>
        </View>
        
        {business && (
          <View style={styles.professionalCompanyInfo}>
            <Text style={styles.professionalCompanyName}>{business.name}</Text>
            <Text style={styles.professionalCompanyDetail}>{business.address}</Text>
            <Text style={styles.professionalCompanyDetail}>{business.email}</Text>
            <Text style={styles.professionalCompanyDetail}>{business.phone}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.professionalInfoSection}>
        <View style={styles.professionalInfoColumn}>
          <Text style={styles.professionalInfoLabel}>BILL TO</Text>
          <Text style={styles.professionalInfoValue}>{invoice.clientName}</Text>
          <Text style={styles.professionalInfoDetail}>{invoice.clientAddress}</Text>
          <Text style={styles.professionalInfoDetail}>{invoice.clientEmail}</Text>
        </View>
        
        <View style={styles.professionalInfoColumn}>
          <View style={styles.professionalInfoRow}>
            <Text style={styles.professionalInfoLabel}>INVOICE DATE</Text>
            <Text style={styles.professionalInfoValue}>{formatDate(invoice.issueDate)}</Text>
          </View>
          
          <View style={styles.professionalInfoRow}>
            <Text style={styles.professionalInfoLabel}>DUE DATE</Text>
            <Text style={styles.professionalInfoValue}>{formatDate(invoice.dueDate)}</Text>
          </View>
          
          <View style={styles.professionalInfoRow}>
            <Text style={styles.professionalInfoLabel}>STATUS</Text>
            <View style={[
              styles.professionalStatusBadge,
              { backgroundColor: getStatusColor(invoice.status)[50] }
            ]}>
              <Text style={[
                styles.professionalStatusText,
                { color: getStatusColor(invoice.status)[700] }
              ]}>
                {invoice.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.professionalTable}>
        <View style={styles.professionalTableHeader}>
          <Text style={[styles.professionalTableHeaderText, { flex: 3 }]}>DESCRIPTION</Text>
          <Text style={[styles.professionalTableHeaderText, { flex: 1, textAlign: 'center' }]}>QTY</Text>
          <Text style={[styles.professionalTableHeaderText, { flex: 1, textAlign: 'right' }]}>PRICE</Text>
          <Text style={[styles.professionalTableHeaderText, { flex: 1, textAlign: 'right' }]}>AMOUNT</Text>
        </View>
        
        {invoice.items.map((item, index) => (
          <View key={item.id} style={styles.professionalTableRow}>
            <Text style={[styles.professionalTableCellText, { flex: 3 }]}>{item.description}</Text>
            <Text style={[styles.professionalTableCellText, { flex: 1, textAlign: 'center' }]}>{item.quantity}</Text>
            <Text style={[styles.professionalTableCellText, { flex: 1, textAlign: 'right' }]}>{formatCurrency(parseFloat(item.price))}</Text>
            <Text style={[styles.professionalTableCellText, { flex: 1, textAlign: 'right' }]}>{formatCurrency(parseFloat(item.amount))}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.professionalTotals}>
        <View style={styles.professionalTotalRow}>
          <Text style={styles.professionalTotalLabel}>Subtotal</Text>
          <Text style={styles.professionalTotalValue}>
            {formatCurrency(invoice.items.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0))}
          </Text>
        </View>
        
        {parseFloat(invoice.taxRate) > 0 && (
          <View style={styles.professionalTotalRow}>
            <Text style={styles.professionalTotalLabel}>Tax ({invoice.taxRate}%)</Text>
            <Text style={styles.professionalTotalValue}>
              {formatCurrency(invoice.items.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0) * (parseFloat(invoice.taxRate) / 100))}
            </Text>
          </View>
        )}
        
        <View style={styles.professionalGrandTotal}>
          <Text style={styles.professionalGrandTotalLabel}>Total</Text>
          <Text style={styles.professionalGrandTotalValue}>{formatCurrency(parseFloat(invoice.totalAmount))}</Text>
        </View>
      </View>
      
      {(invoice.notes || invoice.terms) && (
        <View style={styles.professionalFooter}>
          {invoice.notes && (
            <View style={styles.professionalNotesSection}>
              <Text style={styles.professionalNotesLabel}>Notes</Text>
              <Text style={styles.professionalNotesText}>{invoice.notes}</Text>
            </View>
          )}
          
          {invoice.terms && (
            <View style={styles.professionalTermsSection}>
              <Text style={styles.professionalTermsLabel}>Terms & Conditions</Text>
              <Text style={styles.professionalTermsText}>{invoice.terms}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderMinimalTemplate = () => (
    <View style={styles.minimalContainer}>
      <View style={styles.minimalHeader}>
        <Text style={styles.minimalTitle}>INVOICE</Text>
      </View>
      
      <View style={styles.minimalInfo}>
        <View style={styles.minimalCompanySection}>
          {business && (
            <>
              <Text style={styles.minimalCompanyName}>{business.name}</Text>
              <Text style={styles.minimalCompanyDetail}>{business.address}</Text>
              <Text style={styles.minimalCompanyDetail}>{business.email}</Text>
              <Text style={styles.minimalCompanyDetail}>{business.phone}</Text>
            </>
          )}
        </View>
        
        <View style={styles.minimalDivider} />
        
        <View style={styles.minimalInvoiceInfoSection}>
          <View style={styles.minimalInvoiceInfoRow}>
            <Text style={styles.minimalLabel}>INVOICE #:</Text>
            <Text style={styles.minimalValue}>{invoice.invoiceNumber}</Text>
          </View>
          
          <View style={styles.minimalInvoiceInfoRow}>
            <Text style={styles.minimalLabel}>DATE:</Text>
            <Text style={styles.minimalValue}>{formatDate(invoice.issueDate)}</Text>
          </View>
          
          <View style={styles.minimalInvoiceInfoRow}>
            <Text style={styles.minimalLabel}>DUE DATE:</Text>
            <Text style={styles.minimalValue}>{formatDate(invoice.dueDate)}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.minimalClientSection}>
        <Text style={styles.minimalSectionTitle}>BILL TO</Text>
        <Text style={styles.minimalClientName}>{invoice.clientName}</Text>
        <Text style={styles.minimalClientDetail}>{invoice.clientAddress}</Text>
        <Text style={styles.minimalClientDetail}>{invoice.clientEmail}</Text>
      </View>
      
      <View style={styles.minimalTableContainer}>
        <View style={styles.minimalTableHeader}>
          <Text style={[styles.minimalTableHeaderText, { flex: 3 }]}>Item</Text>
          <Text style={[styles.minimalTableHeaderText, { flex: 1, textAlign: 'center' }]}>Qty</Text>
          <Text style={[styles.minimalTableHeaderText, { flex: 1, textAlign: 'right' }]}>Price</Text>
          <Text style={[styles.minimalTableHeaderText, { flex: 1, textAlign: 'right' }]}>Amount</Text>
        </View>
        
        {invoice.items.map((item) => (
          <View key={item.id} style={styles.minimalTableRow}>
            <Text style={[styles.minimalTableCellText, { flex: 3 }]}>{item.description}</Text>
            <Text style={[styles.minimalTableCellText, { flex: 1, textAlign: 'center' }]}>{item.quantity}</Text>
            <Text style={[styles.minimalTableCellText, { flex: 1, textAlign: 'right' }]}>{formatCurrency(parseFloat(item.price))}</Text>
            <Text style={[styles.minimalTableCellText, { flex: 1, textAlign: 'right' }]}>{formatCurrency(parseFloat(item.amount))}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.minimalTotalsSection}>
        <View style={styles.minimalTotalRow}>
          <Text style={styles.minimalTotalLabel}>Subtotal</Text>
          <Text style={styles.minimalTotalValue}>
            {formatCurrency(invoice.items.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0))}
          </Text>
        </View>
        
        {parseFloat(invoice.taxRate) > 0 && (
          <View style={styles.minimalTotalRow}>
            <Text style={styles.minimalTotalLabel}>Tax ({invoice.taxRate}%)</Text>
            <Text style={styles.minimalTotalValue}>
              {formatCurrency(invoice.items.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0) * (parseFloat(invoice.taxRate) / 100))}
            </Text>
          </View>
        )}
        
        <View style={styles.minimalGrandTotal}>
          <Text style={styles.minimalGrandTotalLabel}>Total</Text>
          <Text style={styles.minimalGrandTotalValue}>{formatCurrency(parseFloat(invoice.totalAmount))}</Text>
        </View>
      </View>
      
      {(invoice.notes || invoice.terms) && (
        <View style={styles.minimalFooter}>
          {invoice.notes && (
            <View style={styles.minimalNotesSection}>
              <Text style={styles.minimalSectionTitle}>Notes</Text>
              <Text style={styles.minimalNotes}>{invoice.notes}</Text>
            </View>
          )}
          
          {invoice.terms && (
            <View style={styles.minimalTermsSection}>
              <Text style={styles.minimalSectionTitle}>Terms & Conditions</Text>
              <Text style={styles.minimalTerms}>{invoice.terms}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderCreativeTemplate = () => (
    <View style={styles.creativeContainer}>
      <View style={styles.creativeHeader}>
        <View style={styles.creativeHeaderContent}>
          <Text style={styles.creativeTitle}>INVOICE</Text>
          <Text style={styles.creativeInvoiceNumber}>#{invoice.invoiceNumber}</Text>
        </View>
      </View>
      
      <View style={styles.creativeInfoSection}>
        <View style={styles.creativeCompanySection}>
          <Text style={styles.creativeSectionTitle}>FROM</Text>
          {business && (
            <>
              <Text style={styles.creativeCompanyName}>{business.name}</Text>
              <Text style={styles.creativeCompanyDetail}>{business.address}</Text>
              <Text style={styles.creativeCompanyDetail}>{business.email}</Text>
              <Text style={styles.creativeCompanyDetail}>{business.phone}</Text>
            </>
          )}
        </View>
        
        <View style={styles.creativeClientSection}>
          <Text style={styles.creativeSectionTitle}>TO</Text>
          <Text style={styles.creativeClientName}>{invoice.clientName}</Text>
          <Text style={styles.creativeClientDetail}>{invoice.clientAddress}</Text>
          <Text style={styles.creativeClientDetail}>{invoice.clientEmail}</Text>
        </View>
      </View>
      
      <View style={styles.creativeDateSection}>
        <View style={styles.creativeDateItem}>
          <Text style={styles.creativeDateLabel}>ISSUED</Text>
          <Text style={styles.creativeDateValue}>{formatDate(invoice.issueDate)}</Text>
        </View>
        
        <View style={styles.creativeDateItem}>
          <Text style={styles.creativeDateLabel}>DUE</Text>
          <Text style={styles.creativeDateValue}>{formatDate(invoice.dueDate)}</Text>
        </View>
        
        <View style={styles.creativeDateItem}>
          <Text style={styles.creativeDateLabel}>STATUS</Text>
          <View style={[
            styles.creativeStatusBadge,
            { backgroundColor: getStatusColor(invoice.status)[500] }
          ]}>
            <Text style={styles.creativeStatusText}>{invoice.status}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.creativeTableContainer}>
        <View style={styles.creativeTableHeader}>
          <Text style={[styles.creativeTableHeaderText, { flex: 3 }]}>SERVICE</Text>
          <Text style={[styles.creativeTableHeaderText, { flex: 1, textAlign: 'center' }]}>QTY</Text>
          <Text style={[styles.creativeTableHeaderText, { flex: 1, textAlign: 'right' }]}>RATE</Text>
          <Text style={[styles.creativeTableHeaderText, { flex: 1, textAlign: 'right' }]}>AMOUNT</Text>
        </View>
        
        {invoice.items.map((item) => (
          <View key={item.id} style={styles.creativeTableRow}>
            <Text style={[styles.creativeTableCellText, { flex: 3 }]}>{item.description}</Text>
            <Text style={[styles.creativeTableCellText, { flex: 1, textAlign: 'center' }]}>{item.quantity}</Text>
            <Text style={[styles.creativeTableCellText, { flex: 1, textAlign: 'right' }]}>{formatCurrency(parseFloat(item.price))}</Text>
            <Text style={[styles.creativeTableCellText, { flex: 1, textAlign: 'right' }]}>{formatCurrency(parseFloat(item.amount))}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.creativeTotalsWrapper}>
        <View style={styles.creativeTotalsSection}>
          <View style={styles.creativeTotalRow}>
            <Text style={styles.creativeTotalLabel}>Subtotal</Text>
            <Text style={styles.creativeTotalValue}>
              {formatCurrency(invoice.items.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0))}
            </Text>
          </View>
          
          {parseFloat(invoice.taxRate) > 0 && (
            <View style={styles.creativeTotalRow}>
              <Text style={styles.creativeTotalLabel}>Tax ({invoice.taxRate}%)</Text>
              <Text style={styles.creativeTotalValue}>
                {formatCurrency(invoice.items.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0) * (parseFloat(invoice.taxRate) / 100))}
              </Text>
            </View>
          )}
          
          <View style={styles.creativeGrandTotal}>
            <Text style={styles.creativeGrandTotalLabel}>Total Due</Text>
            <Text style={styles.creativeGrandTotalValue}>{formatCurrency(parseFloat(invoice.totalAmount))}</Text>
          </View>
        </View>
      </View>
      
      {(invoice.notes || invoice.terms) && (
        <View style={styles.creativeFooter}>
          {invoice.notes && (
            <View style={styles.creativeNotesSection}>
              <Text style={styles.creativeSectionTitle}>NOTES</Text>
              <Text style={styles.creativeNotesText}>{invoice.notes}</Text>
            </View>
          )}
          
          {invoice.terms && (
            <View style={styles.creativeTermsSection}>
              <Text style={styles.creativeSectionTitle}>TERMS & CONDITIONS</Text>
              <Text style={styles.creativeTermsText}>{invoice.terms}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

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

  // Render the appropriate template based on the templateId
  switch (templateId) {
    case 'minimal':
      return renderMinimalTemplate();
    case 'creative':
      return renderCreativeTemplate();
    case 'professional':
    default:
      return renderProfessionalTemplate();
  }
}

const styles = StyleSheet.create({
  // Professional Template Styles
  professionalContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  professionalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  professionalTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: Colors.primary[600],
    marginBottom: 8,
  },
  professionalInvoiceNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[600],
  },
  professionalCompanyInfo: {
    alignItems: 'flex-end',
  },
  professionalCompanyName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  professionalCompanyDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  professionalInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  professionalInfoColumn: {
    maxWidth: '45%',
  },
  professionalInfoRow: {
    marginBottom: 16,
  },
  professionalInfoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[500],
    marginBottom: 4,
  },
  professionalInfoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[900],
  },
  professionalInfoDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[600],
    marginTop: 2,
  },
  professionalStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 4,
  },
  professionalStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
  },
  professionalTable: {
    marginBottom: 40,
  },
  professionalTableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.neutral[200],
  },
  professionalTableHeaderText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[600],
  },
  professionalTableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  professionalTableCellText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[800],
  },
  professionalTotals: {
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  professionalTotalRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  professionalTotalLabel: {
    width: 100,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[600],
  },
  professionalTotalValue: {
    width: 100,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[900],
    textAlign: 'right',
  },
  professionalGrandTotal: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[300],
  },
  professionalGrandTotalLabel: {
    width: 100,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
  },
  professionalGrandTotalValue: {
    width: 100,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.primary[600],
    textAlign: 'right',
  },
  professionalFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    paddingTop: 20,
  },
  professionalNotesSection: {
    marginBottom: 20,
  },
  professionalNotesLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[600],
    marginBottom: 8,
  },
  professionalNotesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[700],
    lineHeight: 20,
  },
  professionalTermsSection: {},
  professionalTermsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[600],
    marginBottom: 8,
  },
  professionalTermsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[700],
    lineHeight: 20,
  },

  // Minimal Template Styles
  minimalContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  minimalHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  minimalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    letterSpacing: 4,
  },
  minimalInfo: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  minimalCompanySection: {
    flex: 1,
  },
  minimalCompanyName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    marginBottom: 8,
  },
  minimalCompanyDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  minimalDivider: {
    width: 1,
    backgroundColor: Colors.neutral[200],
    marginHorizontal: 24,
  },
  minimalInvoiceInfoSection: {
    flex: 1,
  },
  minimalInvoiceInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  minimalLabel: {
    width: 80,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[600],
  },
  minimalValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[900],
  },
  minimalClientSection: {
    marginBottom: 40,
  },
  minimalSectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[500],
    marginBottom: 8,
  },
  minimalClientName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  minimalClientDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  minimalTableContainer: {
    marginBottom: 24,
  },
  minimalTableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[300],
  },
  minimalTableHeaderText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[500],
  },
  minimalTableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  minimalTableCellText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[800],
  },
  minimalTotalsSection: {
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  minimalTotalRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  minimalTotalLabel: {
    width: 100,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[600],
  },
  minimalTotalValue: {
    width: 80,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[900],
    textAlign: 'right',
  },
  minimalGrandTotal: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[300],
  },
  minimalGrandTotalLabel: {
    width: 100,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
  },
  minimalGrandTotalValue: {
    width: 80,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    textAlign: 'right',
  },
  minimalFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    paddingTop: 24,
  },
  minimalNotesSection: {
    marginBottom: 24,
  },
  minimalNotes: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[700],
    lineHeight: 20,
  },
  minimalTermsSection: {},
  minimalTerms: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[700],
    lineHeight: 20,
  },

  // Creative Template Styles
  creativeContainer: {
    backgroundColor: '#FFFFFF',
  },
  creativeHeader: {
    backgroundColor: Colors.accent[600],
    padding: 24,
    marginBottom: 24,
  },
  creativeHeaderContent: {
    alignItems: 'center',
  },
  creativeTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  creativeInvoiceNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  creativeInfoSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  creativeCompanySection: {
    flex: 1,
    marginRight: 16,
  },
  creativeSectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: Colors.accent[600],
    marginBottom: 8,
    letterSpacing: 1,
  },
  creativeCompanyName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  creativeCompanyDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  creativeClientSection: {
    flex: 1,
  },
  creativeClientName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  creativeClientDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  creativeDateSection: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[100],
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  creativeDateItem: {
    flex: 1,
  },
  creativeDateLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[500],
    marginBottom: 4,
  },
  creativeDateValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[900],
  },
  creativeStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  creativeStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  creativeTableContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  creativeTableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.accent[200],
  },
  creativeTableHeaderText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: Colors.accent[600],
  },
  creativeTableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  creativeTableCellText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[800],
  },
  creativeTotalsWrapper: {
    backgroundColor: Colors.neutral[100],
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  creativeTotalsSection: {
    alignItems: 'flex-end',
  },
  creativeTotalRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  creativeTotalLabel: {
    width: 120,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[600],
  },
  creativeTotalValue: {
    width: 100,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[900],
    textAlign: 'right',
  },
  creativeGrandTotal: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[300],
  },
  creativeGrandTotalLabel: {
    width: 120,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
  },
  creativeGrandTotalValue: {
    width: 100,
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.accent[600],
    textAlign: 'right',
  },
  creativeFooter: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  creativeNotesSection: {
    marginBottom: 20,
  },
  creativeNotesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[700],
    lineHeight: 20,
  },
  creativeTermsSection: {},
  creativeTermsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[700],
    lineHeight: 20,
  },
});