/**
 * Booking Result Page
 * Display booking confirmation or failure message with improved shadcn design
 */

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Loading } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils/validation';
import { Booking } from '@/types';
import {
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Users,
  Mail,
  Phone,
  Home,
  Printer,
  AlertCircle,
  RefreshCw,
  MapPin
} from 'lucide-react';

function BookingResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const success = searchParams.get('success') === 'true';
  const bookingRef = searchParams.get('ref');
  const errorMessage = searchParams.get('error');

  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (success) {
      const bookingResult = sessionStorage.getItem('bookingResult');
      if (bookingResult) {
        try {
          const data = JSON.parse(bookingResult);
          setBooking(data.booking);
        } catch (error) {
          console.error('Error parsing booking result:', error);
        }
      }
    }
  }, [success]);

  const handleBackToHome = () => {
    sessionStorage.removeItem('bookingResult');
    router.push('/');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 lg:py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Card className="shadow-xl border-0">
            <CardContent className="pt-8 pb-8">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Booking Confirmed!
                </h1>
                <p className="text-lg text-gray-600">
                  Your experience has been successfully booked
                </p>
              </div>

              {/* Booking Reference */}
              {bookingRef && (
                <Card className="mb-8 bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm text-blue-600 font-medium mb-2">
                        Booking Reference
                      </div>
                      <div className="text-3xl font-bold text-blue-900 font-mono tracking-wider">
                        {bookingRef}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Booking Details */}
              {booking && (
                <div className="space-y-6 mb-8">
                  {/* Experience Info */}
                  {booking.experience && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <MapPin className="w-5 h-5" />
                          Experience Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {booking.experience.title}
                            </h3>
                            <p className="text-gray-600 mb-3">{booking.experience.location}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary">{booking.experience.category}</Badge>
                              {booking.experience.difficulty && (
                                <Badge
                                  variant={
                                    booking.experience.difficulty === 'easy'
                                      ? 'success'
                                      : booking.experience.difficulty === 'moderate'
                                      ? 'warning'
                                      : 'danger'
                                  }
                                >
                                  {booking.experience.difficulty}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Date & Time */}
                  {booking.slot && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Calendar className="w-5 h-5" />
                          Date & Time
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Date</div>
                              <div className="font-semibold text-gray-900">
                                {formatDate(booking.slot.date, 'long')}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-600">Time</div>
                              <div className="font-semibold text-gray-900">
                                {formatTime(booking.slot.startTime)} - {formatTime(booking.slot.endTime)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Guest Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Users className="w-5 h-5" />
                        Guest Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Name</div>
                            <div className="font-semibold text-gray-900">
                              {booking.user.firstName} {booking.user.lastName}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Email
                            </div>
                            <div className="font-semibold text-gray-900">
                              {booking.user.email}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Phone
                            </div>
                            <div className="font-semibold text-gray-900">
                              {booking.user.phone}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Number of Guests
                            </div>
                            <div className="font-semibold text-gray-900">
                              {booking.numberOfGuests}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Price Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="text-gray-900">
                            {formatCurrency(booking.priceSummary.subtotal, booking.priceSummary.currency)}
                          </span>
                        </div>
                        {booking.priceSummary.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-green-600">Discount</span>
                            <span className="text-green-600">
                              -{formatCurrency(booking.priceSummary.discount, booking.priceSummary.currency)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tax</span>
                          <span className="text-gray-900">
                            {formatCurrency(booking.priceSummary.tax, booking.priceSummary.currency)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xl font-bold pt-4 border-t">
                          <span>Total Paid</span>
                          <span className="text-green-600">
                            {formatCurrency(booking.priceSummary.total, booking.priceSummary.currency)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Confirmation Message */}
              <Card className="mb-8 bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <div className="font-semibold mb-1">Check your email</div>
                      <p>
                        We've sent a confirmation email with your booking details and instructions.
                        Please check your inbox and spam folder.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleBackToHome}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => window.print()}
                  className="flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Confirmation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Failure State
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8 lg:py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <Card className="shadow-xl border-0">
          <CardContent className="pt-8 pb-8">
            {/* Error Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Booking Failed
              </h1>
              <p className="text-lg text-gray-600">
                Unfortunately, we couldn't complete your booking
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <Card className="mb-8 bg-red-50 border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-900">
                      <div className="font-semibold mb-1">Error Details</div>
                      <p>{decodeURIComponent(errorMessage)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">What you can do:</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <RefreshCw className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>Check if the slot is still available</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <RefreshCw className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>Try selecting a different date or time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <RefreshCw className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>Verify your payment information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <RefreshCw className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>Contact our support team if the issue persists</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleBackToHome}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function BookingResultPage() {
  return (
    <Suspense fallback={<Loading fullScreen text="Loading..." />}>
      <BookingResultContent />
    </Suspense>
  );
}
