'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, FileText, Calendar, CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Invoice {
  id: string;
  carId: string;
  carMake: string;
  carModel: string;
  carYear: number;
  carImage: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
  invoiceNumber: string;
}

export default function DealerInvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  
  // Dummy data for invoices
  const dummyInvoices: Invoice[] = [
    {
      id: 'inv-001',
      carId: 'car-001',
      carMake: 'Toyota',
      carModel: 'Land Cruiser',
      carYear: 2022,
      carImage: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800',
      amount: 180000,
      status: 'paid',
      date: '2025-08-15',
      dueDate: '2025-08-30',
      invoiceNumber: 'INV-20250815-001',
    },
    {
      id: 'inv-002',
      carId: 'car-002',
      carMake: 'Mercedes-Benz',
      carModel: 'S-Class',
      carYear: 2023,
      carImage: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800',
      amount: 350000,
      status: 'pending',
      date: '2025-08-25',
      dueDate: '2025-09-10',
      invoiceNumber: 'INV-20250825-002',
    },
    {
      id: 'inv-003',
      carId: 'car-003',
      carMake: 'BMW',
      carModel: 'X7',
      carYear: 2023,
      carImage: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800',
      amount: 290000,
      status: 'overdue',
      date: '2025-08-01',
      dueDate: '2025-08-15',
      invoiceNumber: 'INV-20250801-003',
    },
    {
      id: 'inv-004',
      carId: 'car-004',
      carMake: 'Lexus',
      carModel: 'LX',
      carYear: 2024,
      carImage: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800',
      amount: 320000,
      status: 'paid',
      date: '2025-07-20',
      dueDate: '2025-08-05',
      invoiceNumber: 'INV-20250720-004',
    },
    {
      id: 'inv-005',
      carId: 'car-005',
      carMake: 'Audi',
      carModel: 'Q8',
      carYear: 2023,
      carImage: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800',
      amount: 275000,
      status: 'pending',
      date: '2025-08-30',
      dueDate: '2025-09-15',
      invoiceNumber: 'INV-20250830-005',
    },
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const filteredInvoices = dummyInvoices.filter(invoice =>
    `${invoice.carMake} ${invoice.carModel} ${invoice.carYear} ${invoice.invoiceNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewInvoiceDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceModalOpen(true);
  };

  return (
    <>
      <Header title="Dealer Invoices" />
      <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dealer Invoices</h1>
          <p className="text-slate-500 mt-1">Manage your invoices and payments</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-[#f78f37] hover:bg-[#e67d25] text-white">
          <FileText className="w-4 h-4 mr-2" />
          Generate New Invoice
        </Button>
      </div>

      <div className="mb-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="all">All Invoices</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search by invoice number, make, model, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" className="h-12 px-6 border-slate-300 hover:bg-slate-50">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {filteredInvoices.map((invoice) => (
                <InvoiceCard 
                  key={invoice.id} 
                  invoice={invoice} 
                  formatCurrency={formatCurrency} 
                  getStatusBadge={getStatusBadge} 
                  viewInvoiceDetails={viewInvoiceDetails}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="paid" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {filteredInvoices.filter(invoice => invoice.status === 'paid').map((invoice) => (
                <InvoiceCard 
                  key={invoice.id} 
                  invoice={invoice} 
                  formatCurrency={formatCurrency} 
                  getStatusBadge={getStatusBadge}
                  viewInvoiceDetails={viewInvoiceDetails}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {filteredInvoices.filter(invoice => invoice.status === 'pending').map((invoice) => (
                <InvoiceCard 
                  key={invoice.id} 
                  invoice={invoice} 
                  formatCurrency={formatCurrency} 
                  getStatusBadge={getStatusBadge}
                  viewInvoiceDetails={viewInvoiceDetails}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="overdue" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {filteredInvoices.filter(invoice => invoice.status === 'overdue').map((invoice) => (
                <InvoiceCard 
                  key={invoice.id} 
                  invoice={invoice} 
                  formatCurrency={formatCurrency} 
                  getStatusBadge={getStatusBadge}
                  viewInvoiceDetails={viewInvoiceDetails}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{dummyInvoices.length}</div>
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {formatCurrency(
                  dummyInvoices
                    .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
                    .reduce((sum, invoice) => sum + invoice.amount, 0)
                )}
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Paid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {formatCurrency(
                  dummyInvoices
                    .filter(invoice => invoice.status === 'paid')
                    .reduce((sum, invoice) => sum + invoice.amount, 0)
                )}
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Details Modal */}
      <Dialog open={invoiceModalOpen} onOpenChange={setInvoiceModalOpen}>
        <DialogContent className="max-w-4xl">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  Invoice {selectedInvoice.invoiceNumber}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">Badelha Dealer</h3>
                    <p className="text-slate-500">123 Dealer Street</p>
                    <p className="text-slate-500">Riyadh, Saudi Arabia</p>
                    <p className="text-slate-500">info@badelha.com</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">Invoice</div>
                    <p className="text-slate-500">#{selectedInvoice.invoiceNumber}</p>
                    <p className="text-slate-500">Date: {new Date(selectedInvoice.date).toLocaleDateString()}</p>
                    <p className="text-slate-500">Due Date: {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                    <div className="mt-2">{getStatusBadge(selectedInvoice.status)}</div>
                  </div>
                </div>
                
                <div className="border-t border-b border-slate-200 py-4 my-6">
                  <h3 className="font-semibold mb-4">Vehicle Details</h3>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                      <img
                        src={selectedInvoice.carImage}
                        alt={`${selectedInvoice.carYear} ${selectedInvoice.carMake} ${selectedInvoice.carModel}`}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900">
                        {selectedInvoice.carYear} {selectedInvoice.carMake} {selectedInvoice.carModel}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-slate-500">Vehicle ID</p>
                          <p className="font-semibold">{selectedInvoice.carId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Year</p>
                          <p className="font-semibold">{selectedInvoice.carYear}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Invoice Details</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {selectedInvoice.carYear} {selectedInvoice.carMake} {selectedInvoice.carModel} - Purchase
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-900">
                            {formatCurrency(selectedInvoice.amount)}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            Processing Fee
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-900">
                            {formatCurrency(500)}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            Documentation Fee
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-900">
                            {formatCurrency(300)}
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                            Total
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-slate-900">
                            {formatCurrency(selectedInvoice.amount + 800)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="text-sm text-slate-500">
                  <p className="font-semibold">Payment Terms:</p>
                  <p>Payment is due within 15 days of invoice date. Please include the invoice number with your payment.</p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setInvoiceModalOpen(false)}>
                  Close
                </Button>
                <Button className="bg-[#f78f37] hover:bg-[#e67d25] text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                {selectedInvoice.status !== 'paid' && (
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Now
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}

const InvoiceCard = ({ 
  invoice, 
  formatCurrency, 
  getStatusBadge,
  viewInvoiceDetails
}: { 
  invoice: Invoice, 
  formatCurrency: (amount: number) => string,
  getStatusBadge: (status: string) => JSX.Element,
  viewInvoiceDetails: (invoice: Invoice) => void
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/6">
          <img
            src={invoice.carImage}
            alt={`${invoice.carYear} ${invoice.carMake} ${invoice.carModel}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Invoice #{invoice.invoiceNumber}
              </h3>
              <p className="text-slate-700 mt-1">
                {invoice.carYear} {invoice.carMake} {invoice.carModel}
              </p>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center space-x-1 text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Issued: {new Date(invoice.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    Due: {new Date(invoice.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end">
              <div className="text-2xl font-bold text-blue-900">{formatCurrency(invoice.amount)}</div>
              <div className="mt-2">{getStatusBadge(invoice.status)}</div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            {invoice.status === 'overdue' && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>Payment overdue by {Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days</span>
              </div>
            )}
            
            <div className="mt-4 md:mt-0 space-x-3">
              <Button variant="outline" className="border-slate-300" onClick={() => viewInvoiceDetails(invoice)}>
                <FileText className="w-4 h-4 mr-2" />
                View Invoice
              </Button>
              <Button variant="outline" className="border-slate-300">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              {invoice.status !== 'paid' && (
                <Button className="bg-green-600 hover:bg-green-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
