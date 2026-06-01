'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, MapPin, Building, Shield, Star, Edit, Upload, Save, X } from 'lucide-react';
import axiosInstance from '@/service/api';
import { useLanguage } from '@/contexts/LanguageContext';
import lang from '@/locale';


export default function DealerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { language } = useLanguage();
  const t = lang[language];

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await axiosInstance.get('1.0/dealer/profile');
      if (response?.data) {
        setProfile({
          address: '123 King Fahd Road',
          city: 'Riyadh',
          country: 'Saudi Arabia',
          postalCode: '12345',
          companyName: 'Badelha Motors',
          taxId: 'TX-9876543210',
          licenseNumber: 'DL-2025-0123',
          bio: 'Premium car dealer with over 15 years of experience in luxury and high-end vehicles.',
          avatar: 'https://img3.stockfresh.com/files/k/kraska/m/97/808337_stock-photo-user-icon.jpg',
          website: 'www.badelha-motors.com',
          foundedYear: 0,
          totalSales: 0,
          rating: 5,
          verificationStatus: 'verified',
          ...response?.data
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const [profile, setProfile] = useState<any>({});
  const [editedProfile, setEditedProfile] = useState<any>({ ...profile });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t.dealerProfile}</h1>
            <p className="text-slate-500 mt-1">{t.manageDealerInfo}</p>
          </div>
          {!isEditing ? (
            <Button
              className="mt-4 md:mt-0 bg-gradient-to-r from-amber-500 to-amber-400 text-white"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4 me-2" />
              {t.editProfile}
            </Button>
          ) : (
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 me-2" />
                {t.cancel}
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 me-2" />
                {t.saveChanges}
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
                      <AvatarFallback>{profile?.firstName?.charAt(0) || 'D'}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="absolute bottom-0 end-0">
                        <Button size="sm" className="rounded-full w-8 h-8 p-0 bg-[#f78f37]">
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-slate-900">
                    {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : 'User'}
                  </h2>
                  <p className="text-slate-500">{profile?.companyName || 'N/A'}</p>

                  {profile.verificationStatus === 'verified' && (
                    <div className="flex items-center mt-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                      <Shield className="w-4 h-4 me-1" />
                      <span className="text-xs font-medium">{t.verifiedDealer}</span>
                    </div>
                  )}

                  <div className="flex items-center mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(profile.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                      />
                    ))}
                    <span className="ms-2 text-slate-700 font-medium">{profile.rating || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-slate-600">
                    <Mail className="w-5 h-5 me-3 text-slate-400" />
                    <span>{profile.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Phone className="w-5 h-5 me-3 text-slate-400" />
                    <span>{profile.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <MapPin className="w-5 h-5 me-3 text-slate-400" />
                    <span>{profile.city || 'N/A'}, {profile.country || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Building className="w-5 h-5 me-3 text-slate-400" />
                    <span>Est. {profile.foundedYear || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">{profile.totalSales || 'N/A'}</p>
                      <p className="text-sm text-slate-500">{t.totalSales}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">{new Date().getFullYear() - profile.foundedYear}</p>
                      <p className="text-sm text-slate-500">{t.yearsActive}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.verificationDetails}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">{t.licenseNumber}</p>
                  <p className="font-medium">{profile.licenseNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t.taxId}</p>
                  <p className="font-medium">{profile.taxId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t.verificationStatus}</p>
                  <div className={`flex items-center mt-1 ${
                    profile.verificationStatus === 'verified'
                      ? 'text-green-600'
                      : profile.verificationStatus === 'pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    <Shield className="w-4 h-4 me-1" />
                    <span className="font-medium capitalize">
                      {profile.verificationStatus === 'verified' ? t.verified : t.pending || profile.verificationStatus || 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Details */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t.profileInformation}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="personal">{t.personal}</TabsTrigger>
                    <TabsTrigger value="business">{t.business}</TabsTrigger>
                    <TabsTrigger value="documents">{t.documents}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">{t.fullName}</label>
                        {isEditing ? (
                          <Input name="firstName" value={editedProfile.firstName} onChange={handleInputChange} />
                        ) : (
                          <p className="text-slate-900">{profile.firstName || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">{t.emailAddress}</label>
                        {isEditing ? (
                          <Input name="email" value={editedProfile.email} onChange={handleInputChange} type="email" />
                        ) : (
                          <p className="text-slate-900">{profile.email || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">{t.phoneNumber}</label>
                        {isEditing ? (
                          <Input name="phone" value={editedProfile.phone} onChange={handleInputChange} />
                        ) : (
                          <p className="text-slate-900">{profile.phone || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">{t.website}</label>
                        {isEditing ? (
                          <Input name="website" value={editedProfile.website} onChange={handleInputChange} />
                        ) : (
                          <p className="text-slate-900">{profile.website || 'N/A'}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">{t.bio}</label>
                      {isEditing ? (
                        <Textarea name="bio" value={editedProfile.bio} onChange={handleInputChange} rows={4} />
                      ) : (
                        <p className="text-slate-900">{profile.bio || 'N/A'}</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="business" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">{t.companyName}</label>
                        {isEditing ? (
                          <Input name="companyName" value={editedProfile.companyName} onChange={handleInputChange} />
                        ) : (
                          <p className="text-slate-900">{profile.companyName || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">{t.taxId}</label>
                        {isEditing ? (
                          <Input name="taxId" value={editedProfile.taxId} onChange={handleInputChange} />
                        ) : (
                          <p className="text-slate-900">{profile.taxId || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">{t.licenseNumber}</label>
                        {isEditing ? (
                          <Input name="licenseNumber" value={editedProfile.licenseNumber} onChange={handleInputChange} />
                        ) : (
                          <p className="text-slate-900">{profile.licenseNumber || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">{t.foundedYear}</label>
                        {isEditing ? (
                          <Input name="foundedYear" value={editedProfile.foundedYear?.toString()} onChange={handleInputChange} type="number" />
                        ) : (
                          <p className="text-slate-900">{profile.foundedYear || 'N/A'}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1 block">{t.address}</label>
                      {isEditing ? (
                        <Textarea name="address" value={editedProfile.address} onChange={handleInputChange} rows={2} />
                      ) : (
                        <p className="text-slate-900">{profile.address || 'N/A'}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">{t.city}</label>
                        {isEditing ? (
                          <Input name="city" value={editedProfile.city} onChange={handleInputChange} />
                        ) : (
                          <p className="text-slate-900">{profile.city || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">{t.country}</label>
                        {isEditing ? (
                          <Input name="country" value={editedProfile.country} onChange={handleInputChange} />
                        ) : (
                          <p className="text-slate-900">{profile.country || 'N/A'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">{t.postalCode}</label>
                        {isEditing ? (
                          <Input name="postalCode" value={editedProfile.postalCode} onChange={handleInputChange} />
                        ) : (
                          <p className="text-slate-900">{profile.postalCode || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">{t.requiredDocuments}</h3>

                      <div className="space-y-4">
                        {[
                          { icon: User, label: t.dealerLicense },
                          { icon: Building, label: t.businessRegistration },
                          { icon: Shield, label: t.taxCertificate },
                          { icon: User, label: t.idVerification },
                        ].map(({ icon: Icon, label }) => (
                          <div key={label} className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center me-3">
                                <Icon className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{label}</p>
                                <p className="text-sm text-slate-500">{t.pdfOrImageFile}</p>
                              </div>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{t.pending}</Badge>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <Button className="bg-[#f78f37] hover:bg-[#e67d25] text-white">
                          <Upload className="w-4 h-4 me-2" />
                          {t.uploadNewDocument}
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
