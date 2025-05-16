import { Invoice } from '@/types';
import { formatCurrency, formatDate } from './formatters';

export const generateInvoiceHTML = (invoice: Invoice): string => {
  const itemsHTML = invoice.items.map(item => `
    <tr>
      <td>${item.description}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">${formatCurrency(parseFloat(item.price))}</td>
      <td style="text-align: right;">${formatCurrency(parseFloat(item.amount))}</td>
    </tr>
  `).join('');

  const subtotal = invoice.items.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0);
  const taxAmount = subtotal * (parseFloat(invoice.taxRate) / 100);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 50px;
        }
        .invoice-title {
          font-size: 28px;
          font-weight: bold;
          color: #0066CC;
          margin: 0;
        }
        .invoice-number {
          font-size: 16px;
          color: #666;
          margin-top: 5px;
        }
        .company-info {
          text-align: right;
        }
        .company-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .company-detail {
          font-size: 14px;
          color: #666;
          margin: 0;
          line-height: 1.4;
        }
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .info-column {
          max-width: 45%;
        }
        .info-label {
          font-size: 12px;
          color: #888;
          margin-bottom: 5px;
          text-transform: uppercase;
        }
        .info-value {
          font-size: 16px;
          margin-bottom: 15px;
        }
        .info-detail {
          font-size: 14px;
          color: #666;
          margin: 0;
          line-height: 1.4;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          background-color: #f9f9f9;
          padding: 10px;
          text-align: left;
          font-size: 12px;
          text-transform: uppercase;
          border-bottom: 2px solid #ddd;
          color: #666;
        }
        td {
          padding: 15px 10px;
          border-bottom: 1px solid #eee;
        }
        .totals {
          width: 250px;
          margin-left: auto;
          margin-bottom: 40px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .total-label {
          font-size: 14px;
          color: #666;
        }
        .total-value {
          font-size: 14px;
          text-align: right;
        }
        .grand-total {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
        }
        .grand-total-label {
          font-size: 16px;
          font-weight: bold;
        }
        .grand-total-value {
          font-size: 16px;
          font-weight: bold;
          text-align: right;
          color: #0066CC;
        }
        .footer {
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .notes-label, .terms-label {
          font-size: 14px;
          font-weight: bold;
          color: #666;
          margin-bottom: 10px;
        }
        .notes-text, .terms-text {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 500;
          margin-top: 5px;
        }
        .status-paid {
          background-color: #D1FAE5;
          color: #047857;
        }
        .status-pending {
          background-color: #FEF3C7;
          color: #B45309;
        }
        .status-overdue {
          background-color: #FEE2E2;
          color: #B91C1C;
        }
        .status-draft {
          background-color: #F3F4F6;
          color: #4B5563;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div>
            <h1 class="invoice-title">INVOICE</h1>
            <div class="invoice-number">${invoice.invoiceNumber}</div>
          </div>
          <div class="company-info">
            <div class="company-name">Your Company Name</div>
            <p class="company-detail">123 Business Street</p>
            <p class="company-detail">City, State ZIP</p>
            <p class="company-detail">contact@yourcompany.com</p>
            <p class="company-detail">(123) 456-7890</p>
          </div>
        </div>
        
        <div class="info-section">
          <div class="info-column">
            <div class="info-label">BILL TO</div>
            <div class="info-value">${invoice.clientName}</div>
            <p class="info-detail">${invoice.clientAddress}</p>
            <p class="info-detail">${invoice.clientEmail}</p>
          </div>
          
          <div class="info-column">
            <div>
              <div class="info-label">INVOICE DATE</div>
              <div class="info-value">${formatDate(invoice.issueDate)}</div>
            </div>
            
            <div>
              <div class="info-label">DUE DATE</div>
              <div class="info-value">${formatDate(invoice.dueDate)}</div>
            </div>
            
            <div>
              <div class="info-label">STATUS</div>
              <div class="status-badge status-${invoice.status.toLowerCase()}">${invoice.status}</div>
            </div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 50%;">DESCRIPTION</th>
              <th style="width: 10%; text-align: center;">QTY</th>
              <th style="width: 20%; text-align: right;">PRICE</th>
              <th style="width: 20%; text-align: right;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-row">
            <div class="total-label">Subtotal</div>
            <div class="total-value">${formatCurrency(subtotal)}</div>
          </div>
          
          ${parseFloat(invoice.taxRate) > 0 ? `
            <div class="total-row">
              <div class="total-label">Tax (${invoice.taxRate}%)</div>
              <div class="total-value">${formatCurrency(taxAmount)}</div>
            </div>
          ` : ''}
          
          <div class="grand-total">
            <div class="grand-total-label">Total</div>
            <div class="grand-total-value">${formatCurrency(parseFloat(invoice.totalAmount))}</div>
          </div>
        </div>
        
        ${(invoice.notes || invoice.terms) ? `
          <div class="footer">
            ${invoice.notes ? `
              <div>
                <div class="notes-label">Notes</div>
                <div class="notes-text">${invoice.notes}</div>
              </div>
            ` : ''}
            
            ${invoice.terms ? `
              <div>
                <div class="terms-label">Terms & Conditions</div>
                <div class="terms-text">${invoice.terms}</div>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
};