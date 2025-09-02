'use client';

import React, { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Bid {
  id: string;
  carId: string;
  carMake: string;
  carModel: string;
  carYear: number;
  carImage: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'won';
  date: string;
  expiresIn: string;
}

export default function DealerBidsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dummy data for bids
  const dummyBids: Bid[] = [
    {
      id: 'bid-001',
      carId: 'car-001',
      carMake: 'Toyota',
      carModel: 'Land Cruiser',
      carYear: 2022,
      carImage: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800',
      amount: 180000,
      status: 'pending',
      date: '2025-09-01T14:30:00',
      expiresIn: '23:45:10',
    },
    {
      id: 'bid-002',
      carId: 'car-002',
      carMake: 'Mercedes-Benz',
      carModel: 'S-Class',
      carYear: 2023,
      carImage: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800',
      amount: 350000,
      status: 'accepted',
      date: '2025-09-01T10:15:00',
      expiresIn: '00:00:00',
    },
    {
      id: 'bid-003',
      carId: 'car-003',
      carMake: 'BMW',
      carModel: 'X7',
      carYear: 2023,
      carImage: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800',
      amount: 290000,
      status: 'rejected',
      date: '2025-08-31T16:45:00',
      expiresIn: '00:00:00',
    },
    {
      id: 'bid-004',
      carId: 'car-004',
      carMake: 'Lexus',
      carModel: 'LX',
      carYear: 2024,
      carImage: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800',
      amount: 320000,
      status: 'won',
      date: '2025-08-30T09:20:00',
      expiresIn: '00:00:00',
    },
    {
      id: 'bid-005',
      carId: 'car-005',
      carMake: 'Audi',
      carModel: 'Q8',
      carYear: 2023,
      carImage: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800',
      amount: 275000,
      status: 'pending',
      date: '2025-09-02T08:10:00',
      expiresIn: '47:30:15',
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
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'won':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Won</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const filteredBids = dummyBids.filter(bid =>
    `${bid.carMake} ${bid.carModel} ${bid.carYear}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header title="Dealer Bids" />
      <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dealer Bids</h1>
          <p className="text-slate-500 mt-1">Manage your bids on vehicle auctions</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-[#f78f37] hover:bg-[#e67d25] text-white">
          <DollarSign className="w-4 h-4 mr-2" />
          Place New Bid
        </Button>
      </div>

      <div className="mb-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="all">All Bids</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="won">Won</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search by make, model, or year..."
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
              {filteredBids.map((bid) => (
                <BidCard key={bid.id} bid={bid} formatCurrency={formatCurrency} getStatusBadge={getStatusBadge} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {filteredBids.filter(bid => bid.status === 'pending').map((bid) => (
                <BidCard key={bid.id} bid={bid} formatCurrency={formatCurrency} getStatusBadge={getStatusBadge} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="accepted" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {filteredBids.filter(bid => bid.status === 'accepted').map((bid) => (
                <BidCard key={bid.id} bid={bid} formatCurrency={formatCurrency} getStatusBadge={getStatusBadge} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {filteredBids.filter(bid => bid.status === 'rejected').map((bid) => (
                <BidCard key={bid.id} bid={bid} formatCurrency={formatCurrency} getStatusBadge={getStatusBadge} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="won" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {filteredBids.filter(bid => bid.status === 'won').map((bid) => (
                <BidCard key={bid.id} bid={bid} formatCurrency={formatCurrency} getStatusBadge={getStatusBadge} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{dummyBids.length}</div>
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
              <div className="text-3xl font-bold">{dummyBids.filter(bid => bid.status === 'pending').length}</div>
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
                {Math.round((dummyBids.filter(bid => bid.status === 'won' || bid.status === 'accepted').length / dummyBids.length) * 100)}%
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
  bid: Bid, 
  formatCurrency: (amount: number) => string,
  getStatusBadge: (status: string) => JSX.Element
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4">
          <img
            src={bid.carImage}
            alt={`${bid.carYear} ${bid.carMake} ${bid.carModel}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {bid.carYear} {bid.carMake} {bid.carModel}
              </h3>
              <div className="flex items-center mt-2 space-x-4">
                <p className="text-sm text-slate-500">Bid ID: {bid.id}</p>
                <p className="text-sm text-slate-500">
                  {new Date(bid.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end">
              <div className="text-2xl font-bold text-blue-900">{formatCurrency(bid.amount)}</div>
              <div className="mt-2">{getStatusBadge(bid.status)}</div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            {bid.status === 'pending' && (
              <div className="flex items-center space-x-2 text-yellow-600">
                <Clock className="w-4 h-4" />
                <span>Expires in: {bid.expiresIn}</span>
              </div>
            )}
            
            <div className="mt-4 md:mt-0 space-x-3">
              <Button variant="outline" className="border-slate-300">
                View Details
              </Button>
              {bid.status === 'pending' && (
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  Cancel Bid
                </Button>
              )}
              {bid.status === 'accepted' && (
                <Button className="bg-green-600 hover:bg-green-700">
                  Complete Purchase
                </Button>
              )}
              {bid.status === 'won' && (
                <Button className="bg-blue-600 hover:bg-blue-700">
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
