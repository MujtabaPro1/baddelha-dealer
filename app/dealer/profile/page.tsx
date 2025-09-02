'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/ui/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, MapPin, Building, Shield, Star, Edit, Upload, Save, X } from 'lucide-react';

interface DealerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  companyName: string;
  taxId: string;
  licenseNumber: string;
  bio: string;
  avatar: string;
  website: string;
  foundedYear: number;
  totalSales: number;
  rating: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

export default function DealerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  // Dummy data for dealer profile
  const [profile, setProfile] = useState<DealerProfile>({
    id: 'dealer-001',
    name: 'Ahmed Al-Saud',
    email: 'ahmed@badelha-motors.com',
    phone: '+966 50 123 4567',
    address: '123 King Fahd Road',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    postalCode: '12345',
    companyName: 'Badelha Motors',
    taxId: 'TX-9876543210',
    licenseNumber: 'DL-2025-0123',
    bio: 'Premium car dealer with over 15 years of experience in luxury and high-end vehicles. Specializing in import and export of exclusive models across the Middle East.',
    avatar: 'https://img3.stockfresh.com/files/k/kraska/m/97/808337_stock-photo-user-icon.jpg',
    website: 'www.badelha-motors.com',
    foundedYear: 2010,
    totalSales: 1250,
    rating: 4.8,
    verificationStatus: 'verified',
  });

  const [editedProfile, setEditedProfile] = useState<DealerProfile>({...profile});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({...profile});
    setIsEditing(false);
  };

  return (
    <>
      <Header title="Dealer Profile" />
      <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dealer Profile</h1>
          <p className="text-slate-500 mt-1">Manage your dealer information and settings</p>
        </div>
        {!isEditing ? (
          <Button 
            className="mt-4 md:mt-0 bg-[#f78f37] hover:bg-[#e67d25] text-white"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Profile Summary */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <Button size="sm" className="rounded-full w-8 h-8 p-0 bg-[#f78f37]">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-bold text-slate-900">{profile.name}</h2>
                <p className="text-slate-500">{profile.companyName}</p>
                
                {profile.verificationStatus === 'verified' && (
                  <div className="flex items-center mt-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                    <Shield className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">Verified Dealer</span>
                  </div>
                )}
                
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(profile.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} 
                    />
                  ))}
                  <span className="ml-2 text-slate-700 font-medium">{profile.rating}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center text-slate-600">
                  <Mail className="w-5 h-5 mr-3 text-slate-400" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Phone className="w-5 h-5 mr-3 text-slate-400" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                  <span>{profile.city}, {profile.country}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Building className="w-5 h-5 mr-3 text-slate-400" />
                  <span>Est. {profile.foundedYear}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{profile.totalSales}</p>
                    <p className="text-sm text-slate-500">Total Sales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{new Date().getFullYear() - profile.foundedYear}</p>
                    <p className="text-sm text-slate-500">Years Active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">License Number</p>
                <p className="font-medium">{profile.licenseNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tax ID</p>
                <p className="font-medium">{profile.taxId}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Verification Status</p>
                <div className={`flex items-center mt-1 ${
                  profile.verificationStatus === 'verified' 
                    ? 'text-green-600' 
                    : profile.verificationStatus === 'pending'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  <Shield className="w-4 h-4 mr-1" />
                  <span className="font-medium capitalize">{profile.verificationStatus}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Profile Details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Full Name</label>
                      {isEditing ? (
                        <Input 
                          name="name"
                          value={editedProfile.name} 
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-slate-900">{profile.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Email Address</label>
                      {isEditing ? (
                        <Input 
                          name="email"
                          value={editedProfile.email} 
                          onChange={handleInputChange}
                          type="email"
                        />
                      ) : (
                        <p className="text-slate-900">{profile.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Phone Number</label>
                      {isEditing ? (
                        <Input 
                          name="phone"
                          value={editedProfile.phone} 
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-slate-900">{profile.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Website</label>
                      {isEditing ? (
                        <Input 
                          name="website"
                          value={editedProfile.website} 
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-slate-900">{profile.website}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Bio</label>
                    {isEditing ? (
                      <Textarea 
                        name="bio"
                        value={editedProfile.bio} 
                        onChange={handleInputChange}
                        rows={4}
                      />
                    ) : (
                      <p className="text-slate-900">{profile.bio}</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="business" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Company Name</label>
                      {isEditing ? (
                        <Input 
                          name="companyName"
                          value={editedProfile.companyName} 
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-slate-900">{profile.companyName}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Tax ID</label>
                      {isEditing ? (
                        <Input 
                          name="taxId"
                          value={editedProfile.taxId} 
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-slate-900">{profile.taxId}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">License Number</label>
                      {isEditing ? (
                        <Input 
                          name="licenseNumber"
                          value={editedProfile.licenseNumber} 
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-slate-900">{profile.licenseNumber}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Founded Year</label>
                      {isEditing ? (
                        <Input 
                          name="foundedYear"
                          value={editedProfile.foundedYear.toString()} 
                          onChange={handleInputChange}
                          type="number"
                        />
                      ) : (
                        <p className="text-slate-900">{profile.foundedYear}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Address</label>
                    {isEditing ? (
                      <Textarea 
                        name="address"
                        value={editedProfile.address} 
                        onChange={handleInputChange}
                        rows={2}
                      />
                    ) : (
                      <p className="text-slate-900">{profile.address}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">City</label>
                      {isEditing ? (
                        <Input 
                          name="city"
                          value={editedProfile.city} 
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-slate-900">{profile.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Country</label>
                      {isEditing ? (
                        <Input 
                          name="country"
                          value={editedProfile.country} 
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-slate-900">{profile.country}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">Postal Code</label>
                      {isEditing ? (
                        <Input 
                          name="postalCode"
                          value={editedProfile.postalCode} 
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-slate-900">{profile.postalCode}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Required Documents</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Dealer License</p>
                            <p className="text-sm text-slate-500">PDF or image file</p>
                          </div>
                        </div>
                        <div>
                          <Badge className="bg-green-100 text-green-800 border-green-200">Uploaded</Badge>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <Building className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Business Registration</p>
                            <p className="text-sm text-slate-500">PDF or image file</p>
                          </div>
                        </div>
                        <div>
                          <Badge className="bg-green-100 text-green-800 border-green-200">Uploaded</Badge>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <Shield className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Tax Certificate</p>
                            <p className="text-sm text-slate-500">PDF or image file</p>
                          </div>
                        </div>
                        <div>
                          <Badge className="bg-green-100 text-green-800 border-green-200">Uploaded</Badge>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">ID Verification</p>
                            <p className="text-sm text-slate-500">PDF or image file</p>
                          </div>
                        </div>
                        <div>
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button className="bg-[#f78f37] hover:bg-[#e67d25] text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Document
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}
