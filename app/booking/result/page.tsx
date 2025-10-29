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
  MapPin,
  Check
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
      <div className="min-h-screen bg-gray-50 flex items-start justify-center py-22 px-4">
        <div className="max-w-md w-full text-center">
          {/* Success Circle with Tick */}
          <div className="inline-flex items-center justify-center w-[80px] h-[80px] rounded-full mb-8" style={{ backgroundColor: '#24AC39' }}>
            <Check className="w-12 h-12 text-white font-bold" />

          </div>

          {/* Booking Confirmed Text */}
          <h1 className="text-gray-900 mb-4" style={{
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: '32px',
            lineHeight: '40px',
            letterSpacing: '0%'
          }}>
            Booking Confirmed
          </h1>

          {/* Reference ID */}
          {bookingRef && (
            <p className="text-gray-700 mb-8" style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '24px',
              letterSpacing: '0%'
            }}>
              Ref ID: {bookingRef}
            </p>
          )}

          {/* Back to Home Button */}
          <Button
            onClick={handleBackToHome}
            className="bg-[#E3E3E3] text-black border-none rounded-md"
            style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '20px',
              letterSpacing: '0%'
            }}
          >
            Back to Home
          </Button>
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
