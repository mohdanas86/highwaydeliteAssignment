/**
 * Checkout Page
 * Collect user information and process booking
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Experience, TimeSlot, BookingFormData, FormErrors } from '@/types';
import { bookingService } from '@/lib/services/api';
import { Button, Card, CardContent, Input } from '@/components/ui';
import { Loading } from '@/components/ui/Loading';
import { formatCurrency, formatDate, formatTime, parsePrice } from '@/lib/utils/validation';
import { ArrowLeft, Check } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    promoCode: '',
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Retrieve booking data from sessionStorage
    const bookingData = sessionStorage.getItem('bookingData');
    if (!bookingData) {
      router.push('/');
      return;
    }

    try {
      const data = JSON.parse(bookingData);
      setExperience(data.experience);
      setSlot(data.slot);
      setNumberOfGuests(data.numberOfGuests);
    } catch (error) {
      console.error('Error parsing booking data:', error);
      router.push('/');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!experience || !slot) {
      alert('Booking information is missing');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingRequest = {
        experienceId: experience.id,
        slotId: slot.id,
        user: {
          firstName: formData.firstName,
          lastName: '',
          email: formData.email,
          phone: '',
          specialRequests: '',
          numberOfGuests,
        },
        numberOfGuests,
        promoCode: formData.promoCode || undefined,
      };

      const response = await bookingService.createBooking(bookingRequest);

      if (response.success && response.booking) {
        sessionStorage.setItem('bookingResult', JSON.stringify(response));
        sessionStorage.removeItem('bookingData');
        router.push(`/booking/result?success=true&ref=${response.booking.bookingReference}`);
      } else {
        router.push(`/booking/result?success=false&error=${encodeURIComponent(response.message)}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      router.push('/booking/result?success=false&error=An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!experience || !slot) {
    return <Loading fullScreen text="Loading checkout..." />;
  }

  const subtotal = parsePrice(experience.price) * numberOfGuests;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] pt-4 sm:pt-6 pb-2 sm:pb-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-12 max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#EFEFEF] rounded-xl">
              <Card className="w-full border-none rounded-xl shadow-none">
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {/* First Name and Email */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1">
                      <Input
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        error={errors.firstName}
                        placeholder="Enter your first name"
                        className="rounded-md p-[20px] bg-[#DDDDDD] border-none outline-none focus:ring-0 focus:ring-transparent focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={errors.email}
                        placeholder="your@email.com"
                        className="rounded-md p-[20px] bg-[#DDDDDD] border-none outline-none focus:ring-0 focus:ring-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
                    <div className="flex-1">
                      <Input
                        label="Promo Code"
                        name="promoCode"
                        value={formData.promoCode}
                        onChange={handleInputChange}
                        placeholder="Promo code"
                        className="rounded-md p-[20px] bg-[#DDDDDD] border-none outline-none focus:ring-0 focus:ring-transparent focus:outline-none"
                      />
                    </div>
                    <Button
                      className="rounded-lg px-4 py-2.5 bg-black text-white h-auto w-full sm:w-auto"
                    >
                      Apply
                    </Button>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="w-4 h-4 text-[#FFD11A] border-gray-300 rounded focus:ring-[#FFD11A]"
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm text-gray-700 cursor-pointer"
                      style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '12px', letterSpacing: '0%' }}
                    >
                      I agree to the terms and safety policy
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="bg-[#EFEFEF] border-none rounded-xl shadow-none overflow-hidden w-full max-w-[387px] lg:w-[387px]">
                <CardContent className="p-3 sm:p-2 space-y-2 sm:space-y-3">
                  {/* Experience */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}>Experience</span>
                    <span className="font-semibold text-gray-900 text-right" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', letterSpacing: '0%' }}>
                      {experience?.title || 'Experience Name'}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}>Date</span>
                    <span className="font-semibold text-gray-900 text-right" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', letterSpacing: '0%' }}>
                      {slot?.date ? formatDate(slot.date, 'short') : 'Date'}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}>Time</span>
                    <span className="font-semibold text-gray-900 text-right" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', letterSpacing: '0%' }}>
                      {slot?.startTime ? formatTime(slot.startTime) : 'Time'}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}>Qty</span>
                    <span className="font-semibold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', letterSpacing: '0%' }}>
                      {numberOfGuests}
                    </span>
                  </div>

                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}>Subtotal</span>
                    <span className="font-semibold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', letterSpacing: '0%' }}>
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  {/* Taxes */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}>Taxes</span>
                    <span className="font-semibold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '14px', letterSpacing: '0%' }}>
                      {formatCurrency(tax)}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                    <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}>Total</span>
                    <span className="" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '18px', letterSpacing: '0%' }}>
                      {formatCurrency(total)}
                    </span>
                  </div>

                  {/* Pay and Confirm Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={!agreeToTerms || isSubmitting}
                    className={`font-semibold py-3 rounded-lg ${agreeToTerms && !isSubmitting
                      ? 'bg-[#FFD11A] hover:bg-[#FFD11A]/90 text-black'
                      : 'bg-[#D7D7D7] text-gray-500 cursor-not-allowed'
                      }`}
                    style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}
                  >
                    {isSubmitting ? 'Processing...' : 'Pay and Confirm'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
