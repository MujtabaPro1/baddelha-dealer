'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, Building, Phone, FileText, MapPin, Globe } from 'lucide-react';

interface SignupFormProps {
  onSwitchToLogin: () => void;
  loading?: boolean;
  error?: string | null;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    companyPhone: '',
    location: '',
    licenseNumber: '',
    website: ''
  });
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{9}$/.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Please enter a valid 9-digit Saudi phone number';
    }

    if (formData.companyPhone && !/^[0-9]{9}$/.test(formData.companyPhone.replace(/\s+/g, ''))) {
      errors.companyPhone = 'Please enter a valid 9-digit Saudi phone number';
    }
    
    if (!formData.location.trim()) errors.location = 'Location is required';

    
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errors.website = 'Please enter a valid URL (starting with http:// or https://)';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await createUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: `+966${formData.phone}`,
        password: formData.password,
        company: formData.company,
        companyPhone: formData.companyPhone ?  `+966${formData.companyPhone}`: '',
        location: formData.location,
        licenseNumber: formData.licenseNumber,
        website: formData.website || undefined,
      });
      
      setSuccessMessage('Account created successfully! Your account is pending verification. Please login to complete your profile.');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Join our dealer network
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1  gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name
                <span className='!text-[#ff0000] ml-1 mr-1'>*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="firstName"
                  placeholder="Please enter first name"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={`pl-10 ${validationErrors.firstName ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.firstName}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name
                            <span className='!text-[#ff0000] ml-1 mr-1'>*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="lastName"
                  placeholder="Please enter last name"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`pl-10 ${validationErrors.lastName ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.lastName}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone
                            <span className='!text-[#ff0000] ml-1 mr-1'>*</span>
              </Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                  +966
                </span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="501 XXX XXX"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`rounded-l-none ${validationErrors.phone ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {validationErrors.phone && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.phone}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email
              <span className='!text-[#ff0000] ml-1 mr-1'>*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`pl-10 ${validationErrors.email ? 'border-red-500' : ''}`}
                required
              />
              {validationErrors.email && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="company"
                placeholder="Dealer Company LLC"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className={`pl-10 ${validationErrors.company ? 'border-red-500' : ''}`}
              />
              {validationErrors.company && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.company}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyPhone">Company Phone</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                +966
              </span>
              <Input
                id="companyPhone"
                type="tel"
                placeholder="511111111"
                value={formData.companyPhone}
                onChange={(e) => handleChange('companyPhone', e.target.value)}
                className={`rounded-l-none ${validationErrors.companyPhone ? 'border-red-500' : ''}`}
              />
            </div>
            {validationErrors.companyPhone && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.companyPhone}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location
                          <span className='!text-[#ff0000] ml-1 mr-1'>*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="location"
                placeholder="Riyadh, Saudi Arabia"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`pl-10 ${validationErrors.location ? 'border-red-500' : ''}`}
                required
              />
              {validationErrors.location && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.location}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="license">License Number</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="license"
                placeholder="a234234"
                value={formData.licenseNumber}
                onChange={(e) => handleChange('licenseNumber', e.target.value)}
                className={`pl-10 ${validationErrors.licenseNumber ? 'border-red-500' : ''}`}
              />
              {validationErrors.licenseNumber && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.licenseNumber}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="website"
                type="url"
                placeholder="https://dealer-company.example"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className={`pl-10 ${validationErrors.website ? 'border-red-500' : ''}`}
              />
              {validationErrors.website && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.website}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password
                            <span className='!text-[#ff0000] ml-1 mr-1'>*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`pl-10 ${validationErrors.password ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.password && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.password}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm
                            <span className='!text-[#ff0000] ml-1 mr-1'>*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={`pl-10 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>
          
          
          <Button 
            type="submit" 
            className="w-full bg-[#4b535b] hover:bg-[#4b535b] text-white" 
            disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}