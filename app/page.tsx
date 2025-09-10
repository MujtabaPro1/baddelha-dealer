'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Filter, Timer, TrendingUp, TrendingDown, DollarSign, Car, X, Calendar, Gauge, Fuel, Settings, MapPin, FileText, History, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axiosInstance from '@/service/api';
import { UserProfileMenu } from '@/components/ui/UserProfileMenu';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Header } from '@/components/ui/Header';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  image: string;
  startingBid: number;
  currentBid: number;
  highestBid: number;
  lowestBid: number;
  bidCount: number;
  timeRemaining: number;
  vin: string;
  engine: string;
  transmission: string;
  location: string;
  color: string;
  fuelType: string;
  drivetrain: string;
  bodyType: string;
  doors: number;
  seats: number;
  features: string[];
  inspectionReport: {
    exterior: string;
    interior: string;
    mechanical: string;
    notes: string;
  };
  bidHistory: {
    amount: number;
    bidder: string;
    timestamp: string;
  }[];
}


const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function CarAuctionPlatform() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCarDetails, setSelectedCarDetails] = useState<Car | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, authLoading, router]);
  

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/1.0/auction?status=LIVE&search=&page=1&limit=10');
      
      if(!response?.data){
        throw new Error('Failed to fetch auction data');
      }
      
      // Map API response to Car interface
      if (response?.data && response.data.data && Array.isArray(response.data.data)) {
        const mappedCars: Car[] = response.data.data.map((item: any) => {
          // Calculate time remaining in seconds from endDate
          
          return {
            carId: item.car?.id,
            id: item.id.toString(),
            make: item.car?.make || 'Unknown',
            model: item.car?.model || 'Unknown',
            year: item.car?.year || new Date().getFullYear(),
            mileage: item.car?.mileage || 0,
            condition: item.car?.condition || 'Unknown',
            image: item.coverImage || 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800',
            startingBid: item.startingPrice || 0,
            currentBid: item.currentBid || item.startPrice || 0,
            highestBid: item.highestBid || item.currentBid || item.startPrice || 0,
            lowestBid: item.startPrice || 0,
            bidCount: item.bidCount || 0,
            timeRemaining: item.endTime,
            vin: item.car?.vin || 'Unknown',
            engine: item.car?.engine || 'Unknown',
            transmission: item.car?.transmission || 'Automatic',
            location: item.car?.location || 'Saudi Arabia',
            color: item.car?.color || 'Unknown',
            fuelType: item.car?.fuelType || 'Petrol',
            drivetrain: item.car?.drivetrain || 'Unknown',
            bodyType: item.car?.bodyType || 'Unknown',
            doors: item.car?.doors || 4,
            seats: item.car?.seats || 5,
            features: item.car?.features || [],
            inspectionReport: {
              exterior: item.car?.inspectionReport?.exterior || 'No data available',
              interior: item.car?.inspectionReport?.interior || 'No data available',
              mechanical: item.car?.inspectionReport?.mechanical || 'No data available',
              notes: item.car?.inspectionReport?.notes || 'No additional notes'
            },
            bidHistory: item.bidHistory?.map((bid: any) => ({
              amount: bid.amount || 0,
              bidder: bid.bidder || 'Unknown',
              timestamp: bid.timestamp || new Date().toISOString()
            })) || []
          };
        });
        
        setCars(mappedCars);
      } else {
        console.error('Invalid API response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching auction data:', error);
    } finally {
      setLoading(false);
    }
  };
  


  useEffect(() => {
    // Initial fetch
    fetchAuctions();

  }, []);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      // Only continue polling if there are auctions with cars
      if (cars.length > 0) {
        fetchAuctions();
      }
    }, 30000); // Poll every 30 seconds
    
    // Clean up interval when component unmounts
    return () => clearInterval(pollInterval);
  }, [cars]);


  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }




  const filteredCars = cars.filter(car =>
    `${car.make} ${car.model} ${car.year}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const placeBid = (carId: string, amount: number) => {
    setCars(prevCars =>
      prevCars.map(car =>
        car.id === carId
          ? {
              ...car,
              currentBid: amount,
              highestBid: Math.max(car.highestBid, amount),
              bidCount: car.bidCount + 1
            }
          : car
      )
    );
    setBidAmount('');
    setSelectedCar(null);
  };

  const openCarDetails = (car: any) => {
    // setSelectedCarDetails(car);
    // setDetailsModalOpen(true);
    router.push(`/details?id=${car.carId}&auctionId=${car.id}`);

  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <Header title="Live Auction" rightContent={<UserProfileMenu />} />

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d] w-5 h-5" />
            <Input
              placeholder="Search by make, model, or year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-[#e9ecef] focus:border-[#3498db] focus:ring-[#3498db]"
            />
          </div>
          <Button variant="outline" className="h-12 px-6 border-[#e9ecef] bg-white hover:bg-[#f8f9fa] text-[#2c3e50]">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2c3e50]"></div>
          </div>
        ) : cars.length === 0 ? (
          <div className="flex justify-center items-center h-64 w-full">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#2c3e50]">No auctions available</h3>
              <p className="text-[#7f8c8d] mt-2">There are currently no live auctions.</p>
            </div>
          </div>
        ) : (
          /* Auction Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
                <CarCard 
                openCarDetails={() => openCarDetails(car)}
                placeBid={placeBid}
                bidAmount={bidAmount}
                setBidAmount={setBidAmount}
                selectedCar={selectedCar}
                setSelectedCar={setSelectedCar}
                key={car.id} car={car} />
          ))}
        </div>
        )}

        {/* Car Details Modal */}
        <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedCarDetails && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-slate-900">
                    {selectedCarDetails.year} {selectedCarDetails.make} {selectedCarDetails.model}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Main Image */}
                  <div className="relative">
                    <img
                      src={selectedCarDetails.image}
                      alt={`${selectedCarDetails.year} ${selectedCarDetails.make} ${selectedCarDetails.model}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-slate-900 text-white">
                        {selectedCarDetails.condition}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-1 text-red-600">
                          <Timer className="w-4 h-4" />
                          <span className="font-mono text-sm font-bold">
                            {formatTime(selectedCarDetails.timeRemaining)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Car className="w-5 h-5" />
                          <span>Vehicle Details</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Year</p>
                            <p className="font-semibold">{selectedCarDetails.year}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Mileage</p>
                            <p className="font-semibold">{selectedCarDetails.mileage.toLocaleString()} miles</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Color</p>
                            <p className="font-semibold">{selectedCarDetails.color}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Body Type</p>
                            <p className="font-semibold">{selectedCarDetails.bodyType}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Doors</p>
                            <p className="font-semibold">{selectedCarDetails.doors}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Seats</p>
                            <p className="font-semibold">{selectedCarDetails.seats}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Technical Specifications */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Settings className="w-5 h-5" />
                          <span>Technical Specs</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Engine</p>
                            <p className="font-semibold">{selectedCarDetails.engine}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Transmission</p>
                            <p className="font-semibold">{selectedCarDetails.transmission}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Drivetrain</p>
                            <p className="font-semibold">{selectedCarDetails.drivetrain}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Fuel Type</p>
                            <p className="font-semibold">{selectedCarDetails.fuelType}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">VIN</p>
                            <p className="font-mono text-xs">{selectedCarDetails.vin}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Features */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Features & Equipment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedCarDetails.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Inspection Report */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Inspection Report</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Exterior Condition</h4>
                        <p className="text-sm text-slate-600">{selectedCarDetails.inspectionReport.exterior}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Interior Condition</h4>
                        <p className="text-sm text-slate-600">{selectedCarDetails.inspectionReport.interior}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Mechanical Condition</h4>
                        <p className="text-sm text-slate-600">{selectedCarDetails.inspectionReport.mechanical}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Additional Notes</h4>
                        <p className="text-sm text-slate-600">{selectedCarDetails.inspectionReport.notes}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current Bidding Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <DollarSign className="w-5 h-5" />
                          <span>Current Auction Status</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-500">Current Bid</p>
                            <p className="text-2xl font-bold text-blue-900">{formatCurrency(selectedCarDetails.currentBid)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-500">Total Bids</p>
                            <p className="text-lg font-semibold text-slate-700">{selectedCarDetails.bidCount}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600">Highest</span>
                            </div>
                            <p className="font-bold text-green-700">{formatCurrency(selectedCarDetails.highestBid)}</p>
                          </div>
                          <div className="bg-red-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <TrendingDown className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-red-600">Starting</span>
                            </div>
                            <p className="font-bold text-red-700">{formatCurrency(selectedCarDetails.startingBid)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bid History */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <History className="w-5 h-5" />
                          <span>Bid History</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {selectedCarDetails.bidHistory.map((bid, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                              <div>
                                <p className="font-semibold text-slate-900">{formatCurrency(bid.amount)}</p>
                                <p className="text-xs text-slate-500">{bid.bidder}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-slate-500">
                                  {new Date(bid.timestamp).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {new Date(bid.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Location */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5" />
                        <span>Location</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-900 font-semibold">{selectedCarDetails.location}</p>
                      <p className="text-sm text-slate-500 mt-1">Vehicle available for inspection by appointment</p>
                    </CardContent>
                  </Card>

                  {/* Bidding Interface in Modal */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Place Your Bid</h3>
                        <div className="flex space-x-3">
                          <Input
                            type="number"
                            placeholder="Enter bid amount"
                            value={selectedCar?.id === selectedCarDetails.id ? bidAmount : ''}
                            onChange={(e) => {
                              setBidAmount(e.target.value);
                              setSelectedCar(selectedCarDetails);
                            }}
                            className="flex-1"
                            min={selectedCarDetails.currentBid + 500}
                          />
                          <Button
                            onClick={() => {
                              const amount = parseInt(bidAmount);
                              if (amount > selectedCarDetails.currentBid) {
                                placeBid(selectedCarDetails.id, amount);
                                setDetailsModalOpen(false);
                              }
                            }}
                            disabled={!bidAmount || parseInt(bidAmount) <= selectedCarDetails.currentBid || selectedCarDetails.timeRemaining === 0}
                            className="bg-blue-900 hover:bg-blue-800 text-white px-8"
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Place Bid
                          </Button>
                        </div>
                        <p className="text-sm text-slate-600">
                          Minimum bid: {formatCurrency(selectedCarDetails.currentBid + 500)}
                        </p>
                        <div className={`text-center py-3 rounded-lg ${
                          selectedCarDetails.timeRemaining > 3600 
                            ? 'bg-green-100 text-green-700' 
                            : selectedCarDetails.timeRemaining > 1800 
                            ? 'bg-yellow-100 text-yellow-700'
                            : selectedCarDetails.timeRemaining > 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedCarDetails.timeRemaining > 0 ? (
                            <span className="font-semibold">
                              Auction ends in {formatTime(selectedCarDetails.timeRemaining)}
                            </span>
                          ) : (
                            <span className="font-bold">AUCTION ENDED</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-[#2c3e50] to-[#34495e] text-white border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#f8f9fa] text-sm">Total Vehicles</p>
                  <p className="text-3xl font-bold">{cars.length}</p>
                </div>
                <Car className="w-8 h-8 text-[#f8f9fa]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#2ecc71] to-[#27ae60] text-white border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#f8f9fa] text-sm">Active Auctions</p>
                  <p className="text-3xl font-bold">{cars.filter(car => car.timeRemaining > 0).length}</p>
                </div>
                <Timer className="w-8 h-8 text-[#f8f9fa]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#f39c12] to-[#e67e22] text-white border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#f8f9fa] text-sm">Total Bids</p>
                  <p className="text-3xl font-bold">{cars.reduce((sum, car) => sum + car.bidCount, 0)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#f8f9fa]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#3498db] to-[#2980b9] text-white border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#f8f9fa] text-sm">Avg. Bid Value</p>
                  <p className="text-3xl font-bold">
                    {cars?.length ? formatCurrency(cars.reduce((sum, car) => sum + car.currentBid, 0) / cars.length) : '0'}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-[#f8f9fa]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


const CarCard = ({ car, openCarDetails, placeBid, bidAmount, setBidAmount, selectedCar, setSelectedCar }: { car: any, openCarDetails: (car: Car) => void, placeBid: (carId: string, amount: number) => void, bidAmount: string, setBidAmount: (amount: string) => void, selectedCar: Car | null, setSelectedCar: (car: Car | null) => void }) => {

  const [timeRemainingText, setTimeRemainingText] = useState('00:00:00');
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);

  useEffect(() => {
    const { text, seconds } = calculateTimeLeft(car.timeRemaining);
    setTimeRemainingText(text);
    setTimeRemainingSeconds(seconds);
  }, [car.timeRemaining]);

  const calculateTimeLeft = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { text: 'ENDED', seconds: 0 };
    }
    
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    // Format with leading zeros for better readability
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    
    let text;
    if (days > 0) {
      text = `${days}d ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      text = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
    
    return { text, seconds: totalSeconds };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const { text, seconds } = calculateTimeLeft(car.timeRemaining);
      setTimeRemainingText(text);
      setTimeRemainingSeconds(seconds);
    }, 1000);
    return () => clearInterval(timer);
  }, [car.timeRemaining]);


  return (
    <Card key={car.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-[#e9ecef] shadow-md bg-white cursor-pointer" onClick={() => openCarDetails(car)}>
    <div className="relative">
      <img
        src={car.image}
        alt={`${car.year} ${car.make} ${car.model}`}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-4 left-4">
        <Badge className="bg-[#2c3e50] text-white">
          {car.condition}
        </Badge>
      </div>
      <div className="absolute top-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
          <div className="flex items-center space-x-1 text-[#2c3e50]">
            <Timer className="w-4 h-4" />
            <span className="font-mono text-sm font-bold">
              {timeRemainingText}
            </span>
          </div>
        </div>
      </div>
    </div>

    <CardHeader className="pb-3 pt-4">
      <CardTitle className="text-xl text-[#2c3e50]">
        {car.year} {car.make} {car.model}
      </CardTitle>
      <div className="flex items-center justify-between text-sm text-[#7f8c8d] mt-1">
        <span>{car.mileage.toLocaleString()} miles</span>
        <span>{car.location}</span>
      </div>
    </CardHeader>

    <CardContent className="space-y-5">
      {/* Vehicle Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-[#7f8c8d]">Engine</p>
          <p className="font-semibold text-[#2c3e50]">{car.engine}</p>
        </div>
        <div>
          <p className="text-[#7f8c8d]">Transmission</p>
          <p className="font-semibold text-[#2c3e50]">{car.transmission}</p>
        </div>
      </div>

      {/* Bid Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#7f8c8d]">Current Bid</p>
            <p className="text-2xl font-bold text-[#2c3e50]">{formatCurrency(car.currentBid)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#7f8c8d]">Bids</p>
            <p className="text-lg font-semibold text-[#34495e]">{car.bidCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#f8f9fa] rounded-lg p-3 border border-[#e9ecef]">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#3498db]" />
              <span className="text-sm text-[#34495e]">Highest</span>
            </div>
            <p className="font-bold text-[#2c3e50]">{formatCurrency(car.highestBid)}</p>
          </div>
          <div className="bg-[#f8f9fa] rounded-lg p-3 border border-[#e9ecef]">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-[#34495e]" />
              <span className="text-sm text-[#34495e]">Starting</span>
            </div>
            <p className="font-bold text-[#2c3e50]">{formatCurrency(car.lowestBid)}</p>
          </div>
        </div>

     
        {/* Time Status */}
        <div className={`text-center py-2 rounded-lg border ${timeRemainingSeconds > 0 ? 'border-[#e9ecef]' : 'border-[#e9ecef]'} ${timeRemainingSeconds === 0 ? 'bg-[#f8f9fa] text-[#7f8c8d]' : 'bg-[#f8f9fa] text-[#2c3e50]'}`}>
          {timeRemainingSeconds > 0 ? (
            <span className="font-semibold">
              AUCTION RUNNING
            </span>
          ) : (
            <span className="font-bold">AUCTION ENDED</span>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
  );
};