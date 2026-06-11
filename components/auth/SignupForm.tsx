'use client';

import React, { useState } from 'react';
import { createUser } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  const steps: FormStep[] = ['personal', 'contact', 'company', 'security'];
  const currentStepIndex = steps.indexOf(step);

  const StepIndicator = () => (
    <div className="space-y-3 mb-8">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-br from-[#001f4d] via-[#003B7E] to-[#0055b3] transition-all duration-300"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        ></div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mb-2 transition-all ${
                i < currentStepIndex
                  ? 'bg-green-500 text-white'
                  : i === currentStepIndex
                  ? 'bg-gradient-to-br from-[#001f4d] via-[#003B7E] to-[#0055b3] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {i < currentStepIndex ? '✓' : i + 1}
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">
              {s === 'personal' && 'Personal'} {s === 'contact' && 'Contact'} {s === 'company' && 'Company'} {s === 'security' && 'Security'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="space-y-3">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">Create Account</h1>
        <p className="text-lg text-gray-600 font-light">Join our dealer network</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step Indicator */}
        <StepIndicator />

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Personal Step */}
        {step === 'personal' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="firstName" className="text-sm font-bold text-gray-900">
                First Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={`ps-11 h-11 rounded-lg border transition-all ${
                    stepErrors.firstName ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                  }`}
                />
              </div>
              {stepErrors.firstName && <p className="text-xs text-red-500 font-medium">{stepErrors.firstName}</p>}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="lastName" className="text-sm font-semibold text-gray-900">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`ps-11 h-11 rounded-lg border transition-all ${
                    stepErrors.lastName ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                  }`}
                />
              </div>
              {stepErrors.lastName && <p className="text-xs text-red-500 font-medium">{stepErrors.lastName}</p>}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`ps-11 h-11 rounded-lg border transition-all ${
                    stepErrors.email ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                  }`}
                />
              </div>
              {stepErrors.email && <p className="text-xs text-red-500 font-medium">{stepErrors.email}</p>}
            </div>
          </div>
        )}

        {/* Contact Step */}
        {step === 'contact' && (
          <div className="space-y-4">
            <div className="space-y-2.5">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-900">
                Phone <span className="text-red-500">*</span>
              </Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 font-medium">+966</span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="501234567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`rounded-l-none h-11 border transition-all ${
                    stepErrors.phone ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                  }`}
                />
              </div>
              {stepErrors.phone && <p className="text-xs text-red-500 font-medium">{stepErrors.phone}</p>}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="companyPhone" className="text-sm font-semibold text-gray-900">
                Company Phone
              </Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 font-medium">+966</span>
                <Input
                  id="companyPhone"
                  type="tel"
                  placeholder="501111111"
                  value={formData.companyPhone}
                  onChange={(e) => handleChange('companyPhone', e.target.value)}
                  className={`rounded-l-none h-11 border transition-all ${
                    stepErrors.companyPhone ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                  }`}
                />
              </div>
              {stepErrors.companyPhone && <p className="text-xs text-red-500 font-medium">{stepErrors.companyPhone}</p>}
            </div>
          </div>
        )}

        {/* Company Step */}
        {step === 'company' && (
          <div className="space-y-4">
            <div className="space-y-2.5">
              <Label htmlFor="company" className="text-sm font-semibold text-gray-900">
                Company Name
              </Label>
              <div className="relative">
                <Building className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="company"
                  placeholder="Dealer Company LLC"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="ps-11 h-11 rounded-lg border border-gray-300 hover:border-gray-400 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="location" className="text-sm font-semibold text-gray-900">
                City <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <select
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className={`w-full ps-11 pr-3 h-11 rounded-lg border text-sm bg-white transition-all ${
                    stepErrors.location ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                  }`}
                >
                  <option value="">Select city</option>
                  {KSA_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              {stepErrors.location && <p className="text-xs text-red-500 font-medium">{stepErrors.location}</p>}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="license" className="text-sm font-semibold text-gray-900">
                License Number
              </Label>
              <div className="relative">
                <FileText className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="license"
                  placeholder="a234234"
                  value={formData.licenseNumber}
                  onChange={(e) => handleChange('licenseNumber', e.target.value)}
                  className="ps-11 h-11 rounded-lg border border-gray-300 hover:border-gray-400 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="website" className="text-sm font-semibold text-gray-900">
                Website
              </Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 font-medium">https://</span>
                <Input
                  id="website"
                  type="text"
                  placeholder="example.com"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className={`rounded-l-none h-11 border transition-all ${
                    stepErrors.website ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                  }`}
                />
              </div>
              {stepErrors.website && <p className="text-xs text-red-500 font-medium">{stepErrors.website}</p>}
            </div>
          </div>
        )}

        {/* Security Step */}
        {step === 'security' && (
          <div className="space-y-4">
            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-900">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`ps-11 h-11 rounded-lg border transition-all ${
                    stepErrors.password ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                  }`}
                />
              </div>
              {stepErrors.password && <p className="text-xs text-red-500 font-medium">{stepErrors.password}</p>}
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-900">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={`ps-11 h-11 rounded-lg border transition-all ${
                    stepErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                  }`}
                />
              </div>
              {stepErrors.confirmPassword && <p className="text-xs text-red-500 font-medium">{stepErrors.confirmPassword}</p>}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-xs text-blue-900 font-medium">
                ✓ Your account will be reviewed and verified by our team before activation.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-2">
          {step !== 'personal' && (
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
              onClick={prevStep}
            >
              <ChevronLeft className="w-5 h-5 me-2" /> Back
            </Button>
          )}
          {step !== 'security' ? (
            <Button
              type="button"
              className="flex-1 h-11  bg-gradient-to-br from-[#001f4d] via-[#003B7E] to-[#0055b3] hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
              onClick={nextStep}
            >
              Next <ChevronRight className="w-5 h-5 ms-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="flex-1 h-11  bg-gradient-to-br from-[#001f4d] via-[#003B7E] to-[#0055b3] hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-75 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 me-2 animate-spin" /> Creating...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          )}
        </div>

        {/* Sign In Link */}
        <div className="text-center border-t border-gray-200 pt-6">
          <p className="text-gray-700">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-500">© 2026 Badelha. All rights reserved.</p>
      </div>
    </div>
  );
}
