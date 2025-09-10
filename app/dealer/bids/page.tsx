'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import axiosInstance from '@/service/api';

interface Bid {
  id: string;
  auctionId: string;
  userId: number;
  carId: string;
  amount: number;
  userJson: any;
  status: string;
  createdAt: string;
  // Additional fields we'll fetch from car details
  carDetails?: {
    make?: string;
    model?: string;
    year?: number;
    image?: string;
  };
}

export default function DealerBidsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 
  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/1.0/auction/bid/placed');
      if (response?.data) {
        console.log(response.data);
        // In a real implementation, we would use the actual API data
        // setBids(response.data);
        
        // For now, use our sample data
        setBids(response.data);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
      setError('Failed to fetch bids. Please try again later.');
      // Use sample data for development
      setBids([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'win':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Won</Badge>;
      case 'lose':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Lost</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    }
  };

  return (
    <>
      <Header title="Dealer Bids" />
      <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dealer Bids</h1>
          <p className="text-slate-500 mt-1">Manage your bids on vehicle auctions</p>
        </div>
  
      </div>

      <div className="mb-8">
        <Tabs defaultValue="all" className="w-full">
       
         
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search by make, model, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-slate-300 focus:border-[#3498db] focus:ring-[#3498db]"
              />
            </div>
            <Button variant="outline" className="h-12 px-6 border-slate-300 hover:bg-slate-50">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3498db]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
              {error}
            </div>
          ) : (
            <>
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 gap-6">
                  {bids.length > 0 ? (
                    bids.filter(bid => {
                      if (!searchTerm) return true;
                      if (!bid.carDetails) return false;
                      return `${bid.carDetails.make || ''} ${bid.carDetails.model || ''} ${bid.carDetails.year || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
                    }).map((bid) => (
                      <BidCard key={bid.id} bid={bid} formatCurrency={formatCurrency} getStatusBadge={getStatusBadge} />
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500">No bids found</div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <div className="grid grid-cols-1 gap-6">
                  {bids.filter(bid => bid.status === 'pending').map((bid) => (
                    <BidCard key={bid.id} bid={bid} formatCurrency={formatCurrency} getStatusBadge={getStatusBadge} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="win" className="mt-0">
                <div className="grid grid-cols-1 gap-6">
                  {bids.filter(bid => bid.status === 'win').map((bid) => (
                    <BidCard key={bid.id} bid={bid} formatCurrency={formatCurrency} getStatusBadge={getStatusBadge} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="lose" className="mt-0">
                <div className="grid grid-cols-1 gap-6">
                  {bids.filter(bid => bid.status === 'lose').map((bid) => (
                    <BidCard key={bid.id} bid={bid} formatCurrency={formatCurrency} getStatusBadge={getStatusBadge} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="other" className="mt-0">
                <div className="grid grid-cols-1 gap-6">
                  {bids.filter(bid => !['pending', 'win', 'lose'].includes(bid.status)).map((bid) => (
                    <BidCard key={bid.id} bid={bid} formatCurrency={formatCurrency} getStatusBadge={getStatusBadge} />
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{bids?.length}</div>
              <div className="p-2 bg-blue-100 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{bids?.filter(bid => bid.status === 'pending').length}</div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {Math.round((bids?.filter(bid => bid.status === 'won' || bid.status === 'accepted').length / bids?.length) * 100)}%
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}

const BidCard = ({ bid, formatCurrency, getStatusBadge }: { 
  bid: any, 
  formatCurrency: (amount: number) => string,
  getStatusBadge: (status: string) => JSX.Element
}) => {
  // Default image if car details are missing
  const defaultImage = "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800";
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4">
          <img
            src={bid?.Car?.media?.url || 'data:image/jpeg;base64,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'}
            alt={`${bid.carDetails?.year || 'Unknown'} ${bid.carDetails?.make || 'Unknown'} ${bid.carDetails?.model || 'Unknown'}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {bid.Car?.modelYear || '2020'} {bid.Car?.make || 'Audi'} {bid.Car?.model || 'A4'}
              </h3>
              <div className="flex flex-col mt-2 space-y-4">
                <p className="text-sm">Bid ID: {bid.id}</p>
                <p className="text-sm">Auction ID: {bid.auctionId}</p>
                <p className="text-sm">
                  {new Date(bid.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end">
              <div className="text-2xl font-bold text-[#2c3e50]">{formatCurrency(bid.amount)}</div>
              <div className="mt-2">{getStatusBadge(bid.status)}</div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            {bid.status === 'pending' && (
              <div className="flex items-center space-x-2 text-yellow-600">
                <Clock className="w-4 h-4" />
                <span>Awaiting response</span>
              </div>
            )}
            
            <div className="mt-4 md:mt-0 space-x-3">
              {bid.status === 'pending' && (
                <Button variant="destructive" className="bg-[#e74c3c] hover:bg-red-700">
                  Cancel Bid
                </Button>
              )}
              {bid.status === 'win' && (
                <Button className="bg-[#2ecc71] hover:bg-green-700">
                  Complete Purchase
                </Button>
              )}
              {bid.status === 'win' && (
                <Button className="bg-[#3498db] hover:bg-blue-700">
                  View Invoice
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
