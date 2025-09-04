'use client';
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  Fuel, 
  Settings, 
  Shield,
  Star,
  Car,
  Zap,
  FileText,
  Check,
  Timer
} from 'lucide-react';
import { Header } from '@/components/ui/Header';
import axiosInstance from '@/service/api';
import { inspectionData, numberWithCommas } from '@/lib/utils';
import CarBodySvgView from '@/components/ui/CarBodyView';
import { Badge } from '@/components/ui/badge';
import { UserProfileMenu } from '@/components/ui/UserProfileMenu';
import { useRouter } from 'next/navigation';




const CarDetail: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'inspection' | 'financing'>('overview');
  const [showContactForm, setShowContactForm] = useState(false);
  const [car, setCar] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [inspectionDetails,setInspectionDetails]: any = useState(null);
  const [inspectionSchema,setInspectionSchema] = useState(null);
  const [auctionDetails,setAuctionDetails] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const router = useRouter();



  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const auctionId = urlParams.get('auctionId') || window.location.pathname.split('/').pop();
    getAuctionDetails(auctionId); 
  },[])
  
  // Effect to update the timer every second
  useEffect(() => {
    if (!auctionDetails?.endTime) return;
    
    // Update timer immediately
    const updateTimer = () => {
      const timeLeft = calculateTimeLeft(auctionDetails.endTime);
      setTimeRemaining(timeLeft.text);
      
      // If auction ended, redirect to home page
      if (timeLeft.seconds <= 0) {
        console.log('Auction has ended, redirecting to listing page');
        router.push('/');
      }
    };
    
    // Initial update
    updateTimer();
    
    // Set up interval to update every second
    const timerId = setInterval(updateTimer, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(timerId);
  }, [auctionDetails?.endTime, router])


  const getAuctionDetails = (auctionId: any) => {
    axiosInstance.get('/1.0/auction/' + auctionId).then((res)=>{
      console.log(res.data);
      
      // Check if auction has ended based on endTime
      const endTime = new Date(res.data.endTime);
      const currentTime = new Date();
      
      if (currentTime > endTime || res.data.status === 'ENDED') {
        // Auction has ended, redirect to listing page
        console.log('Auction has ended, redirecting to listing page');
        router.push('/');
      } else {
        // Auction is still active, continue with displaying details
        // You can add additional logic here to handle the auction data
        setAuctionDetails(res.data);
      }
    }).catch((err)=>{
      console.log(err);
    })
  }

  const nextImage = () => {
    const imagesArray = images.length > 0 ? images : [];
    setCurrentImageIndex((prev) => (prev + 1) % imagesArray.length);
  };

  const prevImage = () => {
    const imagesArray = images.length > 0 ? images : [];
    setCurrentImageIndex((prev) => (prev - 1 + imagesArray.length) % imagesArray.length);
  };





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


   useEffect(()=>{
      // Extract car ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id') || window.location.pathname.split('/').pop();
      
      if (id) {
        console.log(id);
         carDetails(id);
      }
   },[]);

   const carDetails = (id: any) => {
          axiosInstance.get('/1.0/car/car-details/' + id).then((res)=>{
              // Process car data
              let _car = res?.data?.car;
              let _inspectionData = inspectionData;
              
              // Process inspection data if available
              if(_car['Inspection']){
                  _car['InspectionData'] = _car?.Inspection?.[0]?.inspectionJson;
                  _inspectionData.map((i: any)=>{
                      i.fields.map((_i: any)=>{
                          Object.keys(_car['InspectionData']).map((cKey)=>{
                              if(cKey.replace(/_/g, " ") == _i.fieldName){
                                  if(cKey == 'Warranty_Valid_Till'){
                                      _i.value = _car['InspectionData'][cKey] ? new Date(_car['InspectionData'][cKey]).toDateString() : 'N/A';
                                  }
                                  else if(cKey == 'Service_Plan_Valid_Till'){
                                      _i.value = _car['InspectionData'][cKey] ? new Date(_car['InspectionData'][cKey]).toDateString(): 'N/A';
                                  }
                                  else{
                                      _i.value = _car['InspectionData'][cKey] ;
                                  }
                              }
                          })
                      })
                      i['isHidden'] = i.name != 'General Information';
  
                      if(_car['InspectionData'].overview){
                          i['overview'] = _car['InspectionData'].overview[i.name];
                      }
                  })
              }
              _car['InspectionData'] = _inspectionData;
              
              // Set car data
              setCar(_car);

              setInspectionDetails(res?.data?.car?.Inspection?.[0]);
              setInspectionSchema(res?.data?.car?.Inspection?.[0]?.inspectionJson);
              
              // Process images
              if (res?.data?.images && res.data.images.length > 0) {
                  // Reorder images if needed
                  const imageUrls = res.data.images.map((img: any) => img.url || img.imageUrl || img);
                  setImages(imageUrls);
              } else if (_car.images && _car.images.length > 0) {
                  // Use car images if available
                  setImages(_car.images);
              }
              
              // Process car videos if available
              if (res?.data?.carImages) {
                  const videos = res.data.carImages.filter((i: any) => i.fileType && i.fileType.includes('video'));
                  if (videos.length > 0) {
                      // Handle videos if needed
                      console.log('Videos available:', videos.length);
                  }
              }
          }).catch((err)=>{
              console.log('err',err);
          })
      };


 
      if(!car || !inspectionDetails || !inspectionSchema){
        return <div>Loading...</div>
      }


  return (
    <div className="min-h-screen bg-[#f8f9fa]">

      <Header />
      

      <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-[#7f8c8d]">
            <a href="/buy" className="hover:text-[#f39c12] transition">Cars for Sale</a>
            <ChevronRight className="h-4 w-4" />
            <a href="/buy" className="hover:text-[#f39c12] transition">{car?.make}</a>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#2c3e50]">{car?.model}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Slider */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={images.length > 0 ? images[currentImageIndex] : car?.images[currentImageIndex]}
                  alt={car ? `${car.year || ''} ${car.make || ''} ${car.model || ''}` : `${car?.year} ${car?.make} ${car?.model}`}
                  className="w-full h-96 object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length > 0 ? images.length : 0}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition"
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>

                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-1 text-red-600">
                          <Timer className="w-4 h-4" />
                          <span className="font-mono text-sm font-bold">
                            {timeRemaining || 'Loading...'}
                          </span>
                        </div>
                   </div>

                </div>
              </div>


            
              {/* Thumbnail Strip */}
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {(images.length > 0 ? images : []).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition ${
                        index === currentImageIndex ? 'border-[#f78f37]' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Car Title and Basic Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {car ? `${car.year || ''} ${car.make || ''} ${car.model || ''}` : `${car?.year} ${car?.make} ${car?.model}`}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2 text-gray-600">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {car?.location || 'Saudi Arabia'}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(car?.createdAt).toDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#3d3d40]">
                    SAR {numberWithCommas(car?.bookValue)}
                  </div>
    
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Settings className="h-6 w-6 mx-auto text-gray-600 mb-1" />
                  <div className="font-semibold">{car?.mileage ? car.mileage.toLocaleString() : '0'} km</div>
                  <div className="text-sm text-gray-600">Mileage</div>
                </div>
                <div className="text-center">
                  <Fuel className="h-6 w-6 mx-auto text-gray-600 mb-1" />
                  <div className="font-semibold">{car?.fuelType || 'Petrol'}</div>
                  <div className="text-sm text-gray-600">Fuel Type</div>
                </div>
                <div className="text-center">
                  <Zap className="h-6 w-6 mx-auto text-gray-600 mb-1" />
                  <div className="font-semibold">{car?.transmission || 'Automatic'}</div>
                  <div className="text-sm text-gray-600">Transmission</div>
                </div>
                <div className="text-center">
                  <Car className="h-6 w-6 mx-auto text-gray-600 mb-1" />
                  <div className="font-semibold">{car?.bodyType}</div>
                  <div className="text-sm text-gray-600">Body Type</div>
                </div>
              </div>
            </div>


           

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: FileText },
                    { id: 'inspection', label: 'Inspection', icon: Shield },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as any)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition ${
                        activeTab === id
                          ? 'border-[#f39c12] text-[#f39c12]'
                          : 'border-transparent text-[#7f8c8d] hover:text-[#2c3e50]'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Vehicle Overview Section */}
                    <div className="bg-[#f8f9fa] rounded-xl p-6 border border-[#e9ecef]">
                      <h3 className="text-xl font-semibold text-[#2c3e50] mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-[#3498db]" />
                        Vehicle Overview
                      </h3>
                      
                      <div className="prose max-w-none text-[#2c3e50]">
                        <p>
                          This {car.year} {car.make} {car.model} is in excellent condition with {car?.mileage ? car.mileage.toLocaleString() : '0'} km on the odometer. 
                          It features a powerful {car?.engine || 'engine'} with {car?.transmission || 'Automatic'} transmission, providing a smooth and responsive driving experience.
                        </p>
                        <p className="mt-4">
                          The vehicle comes with a comprehensive service history and has been well-maintained by its previous owner.
                          It has undergone a thorough inspection by our certified technicians to ensure it meets our quality standards.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="bg-white rounded-lg p-4 border border-[#e9ecef] shadow-sm">
                          <div className="flex items-center mb-3">
                            <Shield className="h-5 w-5 text-[#2ecc71] mr-2" />
                            <h4 className="font-semibold text-[#2c3e50]">Warranty</h4>
                          </div>
                          <p className="text-sm text-[#7f8c8d]">
                            Remaining manufacturer warranty until {new Date().getFullYear() + 1}
                          </p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-[#e9ecef] shadow-sm">
                          <div className="flex items-center mb-3">
                            <Check className="h-5 w-5 text-[#2ecc71] mr-2" />
                            <h4 className="font-semibold text-[#2c3e50]">Inspection</h4>
                          </div>
                          <p className="text-sm text-[#7f8c8d]">
                            Passed our 150-point inspection process
                          </p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-[#e9ecef] shadow-sm">
                          <div className="flex items-center mb-3">
                            <Car className="h-5 w-5 text-[#2ecc71] mr-2" />
                            <h4 className="font-semibold text-[#2c3e50]">Service</h4>
                          </div>
                          <p className="text-sm text-[#7f8c8d]">
                            Full service history available
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* USP Section */}
                    <div className="bg-gradient-to-r from-[#2c3e50] to-[#34495e] rounded-xl p-6 text-white">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Star className="h-5 w-5 mr-2 text-[#f39c12]" />
                        Unique Selling Points
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                          <h4 className="font-semibold flex items-center">
                            <Check className="h-4 w-4 mr-2 text-[#f39c12]" />
                            Premium Features
                          </h4>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              Premium leather interior
                            </li>
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              Panoramic sunroof
                            </li>
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              Advanced driver assistance systems
                            </li>
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              Premium sound system
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                          <h4 className="font-semibold flex items-center">
                            <Check className="h-4 w-4 mr-2 text-[#f39c12]" />
                            Performance & Efficiency
                          </h4>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              Fuel-efficient engine
                            </li>
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              Sport-tuned suspension
                            </li>
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              All-wheel drive capability
                            </li>
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              Smooth acceleration and handling
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                          <h4 className="font-semibold flex items-center">
                            <Check className="h-4 w-4 mr-2 text-[#f39c12]" />
                            Safety Features
                          </h4>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              360° camera system
                            </li>
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              Blind spot monitoring
                            </li>
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              Lane keeping assist
                            </li>
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              Adaptive cruise control
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                          <h4 className="font-semibold flex items-center">
                            <Check className="h-4 w-4 mr-2 text-[#f39c12]" />
                            Technology
                          </h4>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              Wireless smartphone integration
                            </li>
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              Digital instrument cluster
                            </li>
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              Touchscreen infotainment system
                            </li>
                            <li className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f39c12] mr-2"></div>
                              Voice-activated controls
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Vehicle Details Section */}
                    <div className="bg-[#f8f9fa] rounded-xl p-6 border border-[#e9ecef]">
                      <h3 className="text-xl font-semibold text-[#2c3e50] mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-[#3498db]" />
                        Vehicle Specifications
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <div className="flex justify-between py-2 border-b border-[#e9ecef]">
                          <span className="font-medium text-[#7f8c8d]">VIN:</span>
                          <span className="font-mono text-[#2c3e50]">100 100 100 100</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#e9ecef]">
                          <span className="font-medium text-[#7f8c8d]">Exterior Color:</span>
                          <span className="text-[#2c3e50]">Black</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#e9ecef]">
                          <span className="font-medium text-[#7f8c8d]">Interior Color:</span>
                          <span className="text-[#2c3e50]">Black</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#e9ecef]">
                          <span className="font-medium text-[#7f8c8d]">Drive Type:</span>
                          <span className="text-[#2c3e50]">4WD</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#e9ecef]">
                          <span className="font-medium text-[#7f8c8d]">Engine:</span>
                          <span className="text-[#2c3e50]">{car?.engine || 'V6'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#e9ecef]">
                          <span className="font-medium text-[#7f8c8d]">Horsepower:</span>
                          <span className="text-[#2c3e50]">300 HP</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#e9ecef]">
                          <span className="font-medium text-[#7f8c8d]">Torque:</span>
                          <span className="text-[#2c3e50]">295 lb-ft</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#e9ecef]">
                          <span className="font-medium text-[#7f8c8d]">Fuel Economy:</span>
                          <span className="text-[#2c3e50]">9.8L/100km combined</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

          

                {/* Inspection Tab */}
                {activeTab === 'inspection' && (
                  <div className="bg-white shadow overflow-hidden rounded-xl border border-[#e9ecef]">
                    <div className="px-6 py-5">
                      <h3 className="text-xl font-semibold text-[#2c3e50] flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-[#f39c12]" />
                        Inspection Report
                      </h3>
                      <p className="mt-1 text-sm text-[#7f8c8d]">Comprehensive vehicle condition assessment</p>
                    </div>
                    
                    {!inspectionDetails?.inspectionJson ? (
                      <div className="px-6 py-8 text-center">
                        <div className="bg-[#f8f9fa] p-6 rounded-lg">
                          <Shield className="h-12 w-12 mx-auto text-[#7f8c8d] mb-3" />
                          <p className="text-[#7f8c8d] font-medium">No inspection report available for this vehicle.</p>
                        </div>
                      </div>
                    ) : !inspectionSchema ? (
                      <div className="px-6 py-12 flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#3498db]"></div>
                      </div>
                    ) : (
                      <div className="border-t border-[#e9ecef]">
                        {/* Inspection Content */}
                        <div className="px-6 py-5">
                          <div className="grid grid-cols-1 gap-6">
                            {/* Information Section */}
                            <div className="bg-[#f8f9fa] rounded-xl p-6 border border-[#e9ecef]">
                              <h4 className="text-lg font-semibold text-[#2c3e50] mb-4 flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-[#3498db]" />
                                Vehicle Information
                              </h4>
                              
                              {inspectionDetails ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {Object.keys(inspectionDetails?.inspectionJson).map((i, index) => {
                                    if(i === 'overview') return null;
                                    
                                    const value = typeof inspectionDetails?.inspectionJson[i] === 'object' && 
                                      inspectionDetails?.inspectionJson[i]?.length ? 
                                      inspectionDetails?.inspectionJson[i][0].value : 
                                      typeof inspectionDetails?.inspectionJson[i] === 'object' && 
                                      !inspectionDetails?.inspectionJson[i]?.length ? 
                                      inspectionDetails?.inspectionJson[i]?.value : 
                                      inspectionDetails?.inspectionJson[i] === "" ? "N/A" : 
                                      inspectionDetails?.inspectionJson[i];
                                    
                                    return (
                                      <div key={i + index} className="p-3 bg-white rounded-lg border border-[#e9ecef] transition-all hover:shadow-md">
                                        <p className="text-sm font-medium text-[#7f8c8d] mb-1">{i.replace(/_/g, " ")}</p>
                                        <p className="font-semibold text-[#2c3e50]">{value}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="flex justify-center py-6">
                                  <p className="text-[#7f8c8d]">Loading inspection details...</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Images Section */}
                            <div className="bg-[#f8f9fa] rounded-xl p-6 border border-[#e9ecef]">
                              <h4 className="text-lg font-semibold text-[#2c3e50] mb-4 flex items-center">
                                <img className="h-5 w-5 mr-2" src="/camera-icon.svg" alt="Camera" />
                                Vehicle Images
                              </h4>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {images?.length > 0 ? images?.map((img: any, index: number) => (
                                  <div key={`img-${index}`} className="group">
                                    <div className="overflow-hidden rounded-lg border border-[#e9ecef] bg-white shadow-sm transition-all hover:shadow-md">
                                      <div className="aspect-square relative">
                                        <img 
                                          className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105" 
                                          src={img} 
                                          alt={`Vehicle image ${index + 1}`} 
                                        />
                                      </div>
                                      {img.caption && (
                                        <div className="p-2 text-xs text-center text-[#7f8c8d] truncate">
                                          {img.caption}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )) : (
                                  <div className="col-span-full text-center py-8 text-[#7f8c8d]">
                                    No detailed images available
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Car Body Condition Section */}
                            <div className="bg-[#f8f9fa] rounded-xl p-6 border border-[#e9ecef]">
                              <h4 className="text-lg font-semibold text-[#2c3e50] mb-4 flex items-center">
                                <Car className="h-5 w-5 mr-2 text-[#f39c12]" />
                                Car Body Condition
                              </h4>
                              
                              <div className="bg-white p-4 rounded-lg border border-[#e9ecef]">
                                {inspectionDetails?.carBodyConditionJson ? (
                                  <CarBodySvgView data={inspectionDetails?.carBodyConditionJson}/>
                                ) : (
                                  <div className="text-center py-8 text-[#7f8c8d]">
                                    No body condition data available
                                  </div>
                                )}
                              </div>
                              
                              {/* Legend */}
                              <div className="mt-4 flex flex-wrap gap-3 justify-center">
                                <div className="flex items-center">
                                  <div className="w-4 h-4 bg-[#2ecc71] rounded-full mr-2"></div>
                                  <span className="text-sm text-[#7f8c8d]">Original</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-4 h-4 bg-[#f39c12] rounded-full mr-2"></div>
                                  <span className="text-sm text-[#7f8c8d]">Repainted</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-4 h-4 bg-[#e74c3c] rounded-full mr-2"></div>
                                  <span className="text-sm text-[#7f8c8d]">Damaged</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-4 h-4 bg-[#7f8c8d] rounded-full mr-2"></div>
                                  <span className="text-sm text-[#7f8c8d]">Not Available</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

            
              </div>
            </div>
          </div>

          {/* Right Column - Dealer Info and Actions */}
          <div className="space-y-6">
            {/* Place Bid Section */}
            <div className="bg-white rounded-xl shadow-md p-6 top-24 border border-[#e9ecef]">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#2c3e50] mb-2 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-[#f39c12]" />
                  Place Your Bid
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#7f8c8d]">Seller's Price:</span>
                  <span className="text-lg font-bold text-[#2c3e50]">SAR {numberWithCommas(car?.bookValue)}</span>
                </div>
              </div>
              
              {/* Bid Form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="bidAmount" className="block text-sm font-medium text-[#2c3e50] mb-1">Your Bid Amount (SAR)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#7f8c8d]">SAR</span>
                    <input 
                      type="number" 
                      id="bidAmount" 
                      className="block w-full pl-12 pr-3 py-2 border border-[#e9ecef] rounded-md shadow-sm focus:ring-[#f39c12] focus:border-[#f39c12]" 
                      placeholder="Enter amount" 
                      min={car?.bookValue} 
                      step="1000"
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value < car?.bookValue) {
                          e.target.setCustomValidity(`Bid must be at least SAR ${numberWithCommas(car?.bookValue)}`);
                        } else {
                          e.target.setCustomValidity('');
                        }
                      }}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum bid: SAR {numberWithCommas(car?.bookValue)}</p>
                </div>
          
              
                <button 
                  type="submit"
                  className="w-full bg-[#f39c12] hover:bg-[#e67e22] text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-md"
                  onClick={(e) => {
                    e.preventDefault();
                    const bidInput = document.getElementById('bidAmount') as HTMLInputElement;
                    const bidValue = parseFloat(bidInput.value);
                    
                    if (!bidValue || bidValue < car?.bookValue) {
                      alert(`Your bid must be at least SAR ${numberWithCommas(car?.bookValue)}`);
                      return false;
                    }
                    
                    // Get auction ID from URL or from auction details
                    const auctionId = auctionDetails?.id || 
                      new URLSearchParams(window.location.search).get('auctionId') || 
                      window.location.pathname.split('/').pop();
                    
                    // Submit bid to API
                    axiosInstance.post(`/1.0/auction/${auctionId}/bid`, {
                      amount: bidValue
                    })
                    .then(response => {
                      // Show success message
                      alert(`Your bid of SAR ${numberWithCommas(bidValue)} has been submitted successfully!`);
                      // Redirect to listing page
                      router.push('/');
                    })
                    .catch(error => {
                      console.error('Error submitting bid:', error);
                      alert(`Failed to submit bid: ${error.response?.data?.message || 'Please try again later'}`);
                    });
                  }}
                >
                  Submit Bid
                </button>
              </div>
            </div>

           

            {/* Quick Facts */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-[#e9ecef]">
              <h3 className="text-lg font-semibold mb-4 text-[#2c3e50] flex items-center">
                <FileText className="h-5 w-5 mr-2 text-[#3498db]" />
                Quick Facts
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-[#e9ecef]">
                  <span className="text-[#7f8c8d]">Condition</span>
                  <span className="font-medium text-[#2c3e50]">Good</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#e9ecef]">
                  <span className="text-[#7f8c8d]">Body Type</span>
                  <span className="font-medium text-[#2c3e50]">{car?.bodyType}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#e9ecef]">
                  <span className="text-[#7f8c8d]">Engine</span>
                  <span className="font-medium text-[#2c3e50]">{car?.engine}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#e9ecef]">
                  <span className="text-[#7f8c8d]">Drive Type</span>
                  <span className="font-medium text-[#2c3e50]">4WD</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#e9ecef]">
                  <span className="text-[#7f8c8d]">Fuel Type</span>
                  <span className="font-medium text-[#2c3e50]">Petrol</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CarDetail;