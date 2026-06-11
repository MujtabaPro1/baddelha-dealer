'use client';

import React, { useState } from 'react';
import { createUser } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, Building, MapPin, FileText, ChevronRight, ChevronLeft } from 'lucide-react';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const KSA_CITIES = [
  'Riyadh', 'Jeddah', 'Dammam', 'Medina', 'Mecca', 'Khobar', 'Dhahran', 'Qatif',
  'Buraydah', 'Tabuk', 'Hail', 'Al Khobar', 'Yanbu', 'Jizan', 'Abha', 'Najran', 'Arar', 'Sakaka', 'Afif', 'Dilam'
];

type FormStep = 'personal' | 'contact' | 'company' | 'security';

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [step, setStep] = useState<FormStep>('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    companyPhone: '', company: '', location: '', licenseNumber: '', website: '',
    password: '', confirmPassword: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setStepErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = (currentStep: FormStep): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 'personal') {
      if (!formData.firstName.trim()) errors.firstName = 'First name required';
      if (!formData.lastName.trim()) errors.lastName = 'Last name required';
      if (!formData.email.trim()) {
        errors.email = 'Email required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = 'Invalid email';
      }
    } else if (currentStep === 'contact') {
      if (!formData.phone.trim()) {
        errors.phone = 'Phone required';
      } else if (!/^[0-9]{9}$/.test(formData.phone.replace(/\s+/g, ''))) {
        errors.phone = 'Invalid phone (9 digits)';
      }
      if (formData.companyPhone && !/^[0-9]{9}$/.test(formData.companyPhone.replace(/\s+/g, ''))) {
        errors.companyPhone = 'Invalid phone (9 digits)';
      }
    } else if (currentStep === 'company') {
      if (!formData.location.trim()) errors.location = 'City required';
      if (formData.website && !/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/.test(formData.website)) {
        errors.website = 'Invalid domain';
      }
    } else if (currentStep === 'security') {
      if (!formData.password) {
        errors.password = 'Password required';
      } else if (formData.password.length < 6) {
        errors.password = 'Min 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    const steps: FormStep[] = ['personal', 'contact', 'company', 'security'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
  };

  const prevStep = () => {
    const steps: FormStep[] = ['personal', 'contact', 'company', 'security'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) setStep(steps[currentIndex - 1]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateStep('security')) return;

    setLoading(true);
    try {
      await createUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: `+966${formData.phone}`,
        password: formData.password,
        company: formData.company,
        companyPhone: formData.companyPhone ? `+966${formData.companyPhone}` : '',
        location: formData.location,
        licenseNumber: formData.licenseNumber,
        website: formData.website ? `https://${formData.website}` : undefined,
      });
      setSuccessMessage('Account created! Pending verification.');
      setTimeout(() => onSwitchToLogin(), 2000);
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || err?.message || 'Failed to create account';
      let displayError = apiMessage;

      if (apiMessage.toLowerCase().includes('credentials') || apiMessage.toLowerCase().includes('taken') || apiMessage.toLowerCase().includes('already')) {
        displayError = `${apiMessage}. Already have an account? Sign in instead.`;
      }

      setError(displayError);
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex justify-between mb-6">
      {(['personal', 'contact', 'company', 'security'] as FormStep[]).map((s, i) => (
        <div key={s} className="flex flex-col items-center flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mb-1 ${
            step === s ? 'bg-[#ee3c48] text-white' : i < ['personal', 'contact', 'company', 'security'].indexOf(step) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {i + 1}
          </div>
          <span className="text-xs text-gray-600 text-center">
            {s === 'personal' && 'Personal'} {s === 'contact' && 'Contact'} {s === 'company' && 'Company'} {s === 'security' && 'Security'}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        <p className="text-xs text-muted-foreground text-center mt-1">Join our dealer network</p>
        <StepIndicator />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          {successMessage && <Alert className="bg-green-50 border-green-200"><AlertDescription className="text-green-800">{successMessage}</AlertDescription></Alert>}

          {step === 'personal' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="firstName" placeholder="John" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} className={`pl-10 ${stepErrors.firstName ? 'border-red-500' : ''}`} />
                </div>
                {stepErrors.firstName && <p className="text-xs text-red-500">{stepErrors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} className={`pl-10 ${stepErrors.lastName ? 'border-red-500' : ''}`} />
                </div>
                {stepErrors.lastName && <p className="text-xs text-red-500">{stepErrors.lastName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className={`pl-10 ${stepErrors.email ? 'border-red-500' : ''}`} />
                </div>
                {stepErrors.email && <p className="text-xs text-red-500">{stepErrors.email}</p>}
              </div>
            </>
          )}

          {step === 'contact' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">+966</span>
                  <Input id="phone" type="tel" placeholder="501234567" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} className={`rounded-l-none ${stepErrors.phone ? 'border-red-500' : ''}`} />
                </div>
                {stepErrors.phone && <p className="text-xs text-red-500">{stepErrors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyPhone">Company Phone</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">+966</span>
                  <Input id="companyPhone" type="tel" placeholder="501111111" value={formData.companyPhone} onChange={(e) => handleChange('companyPhone', e.target.value)} className={`rounded-l-none ${stepErrors.companyPhone ? 'border-red-500' : ''}`} />
                </div>
                {stepErrors.companyPhone && <p className="text-xs text-red-500">{stepErrors.companyPhone}</p>}
              </div>
            </>
          )}

          {step === 'company' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="company" placeholder="Dealer Company LLC" value={formData.company} onChange={(e) => handleChange('company', e.target.value)} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">City <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  <select id="location" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm bg-white ${stepErrors.location ? 'border-red-500' : 'border-gray-300'}`}>
                    <option value="">Select city</option>
                    {KSA_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
                {stepErrors.location && <p className="text-xs text-red-500">{stepErrors.location}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="license" placeholder="a234234" value={formData.licenseNumber} onChange={(e) => handleChange('licenseNumber', e.target.value)} className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">https://</span>
                  <Input id="website" type="text" placeholder="example.com" value={formData.website} onChange={(e) => handleChange('website', e.target.value)} className={`rounded-l-none ${stepErrors.website ? 'border-red-500' : ''}`} />
                </div>
                {stepErrors.website && <p className="text-xs text-red-500">{stepErrors.website}</p>}
              </div>
            </>
          )}

          {step === 'security' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="password" type="password" placeholder="Min 6 characters" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} className={`pl-10 ${stepErrors.password ? 'border-red-500' : ''}`} />
                </div>
                {stepErrors.password && <p className="text-xs text-red-500">{stepErrors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="confirmPassword" type="password" placeholder="Confirm password" value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} className={`pl-10 ${stepErrors.confirmPassword ? 'border-red-500' : ''}`} />
                </div>
                {stepErrors.confirmPassword && <p className="text-xs text-red-500">{stepErrors.confirmPassword}</p>}
              </div>
            </>
          )}

          <div className="flex gap-2 pt-4">
            {step !== 'personal' && (
              <Button type="button" variant="outline" className="flex-1" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            )}
            {step !== 'security' ? (
              <Button type="button" className="flex-1 bg-[#ee3c48] hover:bg-[#d4343e]" onClick={nextStep}>
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" className="flex-1 bg-[#ee3c48] hover:bg-[#d4343e]" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : 'Create Account'}
              </Button>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground pt-2">
            Already have an account? <button type="button" onClick={onSwitchToLogin} className="text-[#ee3c48] hover:underline font-medium">Sign in</button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}