'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building, User, FileText, Upload, MapPin, Loader2, CheckCircle, LogOut } from 'lucide-react';
import { uploadMedia, updateDealerProfile , dealerProfile} from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

type DealerType = 'company' | 'individual' | null;

interface CompanyFormData {
  crNumber: string;
  vatNumber: string;
  crName: string;
}

interface IndividualFormData {
  idImage: File | null;
  location: string;
}

interface DealerVerificationScreenProps {
  userStatus?: string;
}

export function DealerVerificationScreen({ userStatus }: DealerVerificationScreenProps = {}) {
  const router = useRouter();
  const { logout } = useAuth();
  const [dealerType, setDealerType] = useState<DealerType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(userStatus === 'Pending_Approval');
  
  const [companyData, setCompanyData] = useState<CompanyFormData>({
    crNumber: '',
    vatNumber: '',
    crName: '',
  });
  
  const [individualData, setIndividualData] = useState<IndividualFormData>({
    idImage: null,
    location: '',
  });

  const handleCompanyChange = (field: keyof CompanyFormData, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  const handleIndividualChange = (field: keyof IndividualFormData, value: string | File) => {
    setIndividualData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleIndividualChange('idImage', file);
    }
  };

  useEffect(()=>{
      getDealerDetails();
  },[])

  const getDealerDetails = () => [
     dealerProfile().then((res)=>{
          console.log(res);
          if(res.status == 'pending_approval'){
              setSuccess(true);
          }
          else if(res.status == 'active'){
              const user = localStorage.getItem('baddelha_user');
              const userData = user ? JSON.parse(user) : null;
              if(userData){
                userData['status'] = 'Active';
                localStorage.setItem('baddelha_user',JSON.stringify(userData));
              }
              setTimeout(()=>{
                 window.location.href = '/';
              },1000)

          }
     }).catch((err)=>{
         setError(err.message || 'Failed to get dealer detail. Please try again.');  
     })
  ]


  const validateCompanyForm = () => {
    if (!companyData.crNumber.trim()) {
      setError('CR Number is required');
      return false;
    }
    if (!companyData.vatNumber.trim()) {
      setError('VAT Number is required');
      return false;
    }
    if (!companyData.crName.trim()) {
      setError('CR Name is required');
      return false;
    }
    return true;
  };

  const validateIndividualForm = () => {
    if (!individualData.idImage) {
      setError('ID Image is required');
      return false;
    }
    if (!individualData.location.trim()) {
      setError('Location is required');
      return false;
    }
    return true;
  };

  const handleSignOut = async () => {
    await logout();
    router.push('/auth');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const user = localStorage.getItem('baddelha_user');
    const userData = user ? JSON.parse(user) : null;
    
    if (!dealerType) {
      setError('Please select a dealer type');
      return;
    }

    if (dealerType === 'company' && !validateCompanyForm()) {
      return;
    }

    if (dealerType === 'individual' && !validateIndividualForm()) {
      return;
    }

    if (!userData?.name) {
      setError('User information not found. Please login again.');
      return;
    }

    setLoading(true);

    try {
      let mediaId: string | undefined;

      // Step 1: Upload image if it exists (for individual type)
      if (dealerType === 'individual' && individualData.idImage) {
        const mediaResponse = await uploadMedia(
          individualData.idImage,
          userData.id,
          'Dealer',
          'ID Document'
        );
        mediaId = mediaResponse.id || mediaResponse.mediaId;
      }

      // Step 2: Prepare profile update data
      const profileData: any = {
        dealerType: dealerType === 'company' ? 'Company' : 'Individual',
        status: 'pending_approval'
      };


      if (dealerType === 'company') {
        profileData.companyRegName = companyData.crName;
        profileData.companyRegNumber = companyData.crNumber;
        // Store VAT number in a custom field or website field if needed
        profileData.companyVatNumber = companyData.vatNumber; // Temporary storage
      } else {
        profileData.location = individualData.location;
        if (mediaId) {
          profileData.mediaId = mediaId;
        }
      }

      // Step 3: Update dealer profile
      await updateDealerProfile(profileData,dealerType);

      setSuccess(true);
      
    } catch (err: any) {
      setError(err.message || 'Failed to submit verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-[#2ecc71]/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-[#2ecc71]" />
              </div>
              <h2 className="text-2xl font-bold text-[#2c3e50]">Verification Submitted!</h2>
              <p className="text-[#7f8c8d]">
                Your verification documents have been submitted successfully. Our team will review your information and activate your account within 24-48 hours.
              </p>
              <p className="text-sm text-[#7f8c8d]">
                You will receive an email notification once your account is approved.
              </p>
            </div>
          </CardContent>
        </Card>

   <Button
            variant="ghost"
            onClick={handleSignOut}
            className="absolute right-4 top-4 text-[#7f8c8d] hover:text-[#e74c3c] hover:bg-[#e74c3c]/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>

      </div>

    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center relative">
       
          <CardTitle className="text-3xl font-bold text-[#2c3e50]">Account Verification Required</CardTitle>
          <CardDescription className="text-[#7f8c8d] mt-2">
            Please complete your dealer verification to access the platform
          </CardDescription>
          <p className="text-xs text-[#7f8c8d] mt-2">
            Don't have the required documents? You can sign out and return later.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-6 border-[#e74c3c] bg-[#e74c3c]/10">
              <AlertDescription className="text-[#e74c3c]">{error}</AlertDescription>
            </Alert>
          )}

          {!dealerType ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#2c3e50] mb-4">Select Dealer Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setDealerType('company')}
                  className="p-6 border-2 border-[#e9ecef] rounded-lg hover:border-[#f39c12] hover:bg-[#f39c12]/5 transition-all duration-200 group"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-[#f39c12]/10 rounded-full flex items-center justify-center group-hover:bg-[#f39c12]/20 transition-colors">
                      <Building className="w-8 h-8 text-[#f39c12]" />
                    </div>
                    <h4 className="text-lg font-semibold text-[#2c3e50]">Company</h4>
                    <p className="text-sm text-[#7f8c8d] text-center">
                      Register as a company with CR and VAT documents
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setDealerType('individual')}
                  className="p-6 border-2 border-[#e9ecef] rounded-lg hover:border-[#3498db] hover:bg-[#3498db]/5 transition-all duration-200 group"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-[#3498db]/10 rounded-full flex items-center justify-center group-hover:bg-[#3498db]/20 transition-colors">
                      <User className="w-8 h-8 text-[#3498db]" />
                    </div>
                    <h4 className="text-lg font-semibold text-[#2c3e50]">Individual</h4>
                    <p className="text-sm text-[#7f8c8d] text-center">
                      Register as an individual with ID verification
                    </p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#2c3e50]">
                  {dealerType === 'company' ? 'Company' : 'Individual'} Verification
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDealerType(null)}
                  className="text-[#7f8c8d] hover:text-[#2c3e50]"
                >
                  Change Type
                </Button>
              </div>

              {dealerType === 'company' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="crNumber">Company Registration Number</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="crNumber"
                        placeholder="Enter your Company Registration Number"
                        value={companyData.crNumber}
                        onChange={(e) => handleCompanyChange('crNumber', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vatNumber">VAT Number</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="vatNumber"
                        placeholder="Enter your VAT Number"
                        value={companyData.vatNumber}
                        onChange={(e) => handleCompanyChange('vatNumber', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="crName">Company Registration Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="crName"
                        placeholder="Enter your Company Registration Name"
                        value={companyData.crName}
                        onChange={(e) => handleCompanyChange('crName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="idImage">ID Image Upload</Label>
                    <div className="border-2 border-dashed border-[#e9ecef] rounded-lg p-6 hover:border-[#3498db] transition-colors">
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="w-8 h-8 text-[#7f8c8d]" />
                        <div className="text-center">
                          <label htmlFor="idImage" className="cursor-pointer">
                            <span className="text-[#3498db] hover:text-[#2c3e50] font-medium">
                              Click to upload
                            </span>
                            <span className="text-[#7f8c8d]"> or drag and drop</span>
                          </label>
                          <p className="text-xs text-[#7f8c8d] mt-1">
                            PNG, JPG or PDF (max. 5MB)
                          </p>
                        </div>
                        <input
                          id="idImage"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          required
                        />
                        {individualData.idImage && (
                          <p className="text-sm text-[#2ecc71] font-medium">
                            ✓ {individualData.idImage.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="location"
                        placeholder="Enter your location"
                        value={individualData.location}
                        onChange={(e) => handleIndividualChange('location', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#f39c12] hover:bg-[#e67e22] text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Verification'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

   <Button
            variant="ghost"
            onClick={handleSignOut}
            className="absolute right-4 top-4 text-[#7f8c8d] hover:text-[#e74c3c] hover:bg-[#e74c3c]/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>

    </div>
  );
}
