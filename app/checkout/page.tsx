/**
 * Checkout Page
 * Collect user information and process booking with improved shadcn design
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Experience, TimeSlot, BookingFormData, PromoCode, FormErrors } from '@/types';
import { bookingService, promoService } from '@/lib/services/api';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, TextArea } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import {
  validateBookingForm,
  formatCurrency,
  formatDate,
  formatTime,
  parsePrice,
} from '@/lib/utils/validation';
import {
  ArrowLeft,
  CreditCard,
  User,
  Mail,
  Phone,
  Tag,
  Percent,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    numberOfGuests: 1,
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoError, setPromoError] = useState('');

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
      setFormData((prev) => ({ ...prev, numberOfGuests: data.numberOfGuests }));
    } catch (error) {
      console.error('Error parsing booking data:', error);
      router.push('/');
    }
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsValidatingPromo(true);
    setPromoError('');

    try {
      const promo = await promoService.validatePromoCode(promoCode, subtotal);

      if (promo && promo.isValid) {
        setAppliedPromo(promo);
        setPromoError('');
      } else {
        setPromoError('Invalid or expired promo code');
        setAppliedPromo(null);
      }
    } catch (error) {
      setPromoError('Failed to validate promo code');
      setAppliedPromo(null);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateBookingForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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
        user: formData,
        numberOfGuests,
        promoCode: appliedPromo?.code,
      };

      const response = await bookingService.createBooking(bookingRequest);

      if (response.success && response.booking) {
        // Store booking result
        sessionStorage.setItem('bookingResult', JSON.stringify(response));
        sessionStorage.removeItem('bookingData');

        // Redirect to result page
        router.push(`/booking/result?success=true&ref=${response.booking.bookingReference}`);
      } else {
        // Redirect to error result page
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
  const discount = appliedPromo ? promoService.calculateDiscount(appliedPromo, subtotal) : 0;
  const tax = (subtotal - discount) * 0.1;
  const total = subtotal - discount + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Complete Your Booking
            </h1>
            <p className="text-gray-600 text-lg">
              Just a few more details to secure your experience
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="w-6 h-6" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      error={errors.firstName}
                      required
                      placeholder="Enter your first name"
                    />

                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      error={errors.lastName}
                      required
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      required
                      placeholder="your@email.com"
                      helperText="We'll send your booking confirmation here"
                    />

                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      error={errors.phone}
                      required
                      placeholder="+91 98765 43210"
                      helperText="Include country code for international numbers"
                    />
                  </div>

                  <TextArea
                    label="Special Requests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                    helperText="Optional: Let us know about any special requirements"
                    rows={4}
                  />
                </form>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Tag className="w-6 h-6" />
                  Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-semibold text-green-900">
                          {appliedPromo.code} Applied!
                        </div>
                        <div className="text-sm text-green-700">
                          {appliedPromo.discountType === 'percentage'
                            ? `${appliedPromo.discountValue}% off`
                            : `${formatCurrency(appliedPromo.discountValue)} off`}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleRemovePromo}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        error={promoError}
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleApplyPromo}
                      isLoading={isValidatingPromo}
                      disabled={!promoCode.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                )}

                <div className="mt-4 text-sm text-gray-500">
                  Try: <span className="font-mono bg-gray-100 px-2 py-1 rounded">WELCOME10</span>,
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded ml-2">SUMMER25</span>, or
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded ml-2">SAVE20</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <CreditCard className="w-6 h-6" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Experience Details */}
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                      <Image
                        src={experience.imageUrl || '/placeholder-image.jpg'}
                        alt={experience.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                        {experience.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{experience.location}</p>
                      <Badge variant="secondary" className="text-xs">
                        {experience.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(slot.date, 'short')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Time</span>
                      <span className="font-medium text-gray-900">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-medium text-gray-900">{numberOfGuests}</span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {experience.price} × {numberOfGuests}
                      </span>
                      <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 flex items-center gap-1">
                          <Percent className="w-4 h-4" />
                          Discount
                        </span>
                        <span className="text-green-600">-{formatCurrency(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (10%)</span>
                      <span className="text-gray-900">{formatCurrency(tax)}</span>
                    </div>

                    <div className="flex justify-between text-xl font-bold pt-3 border-t">
                      <span>Total</span>
                      <span className="text-[#FFD11A]">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    className="text-lg py-6"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    By completing this booking, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
