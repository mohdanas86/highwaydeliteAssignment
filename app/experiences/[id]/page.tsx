/**
 * Experience Details Page
 * Shows detailed information about an experience with improved shadcn design
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Experience, TimeSlot, DateAvailability } from '@/types';
import { experienceService, slotService } from '@/lib/services/api';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { formatCurrency, formatDate, formatTime, parsePrice } from '@/lib/utils/validation';
import {
  MapPin,
  Clock,
  Users,
  Star,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Calendar,
  IndianRupee
} from 'lucide-react';

export default function ExperienceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const experienceId = params.id as string;

  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<DateAvailability[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (experienceId) {
      fetchExperienceDetails();
    }
  }, [experienceId]);

  const fetchExperienceDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [experienceData, slotsData] = await Promise.all([
        experienceService.getExperienceById(experienceId),
        slotService.getSlots(experienceId),
      ]);

      if (!experienceData) {
        setError('Experience not found');
        return;
      }

      setExperience(experienceData);
      const groupedSlots = slotService.groupSlotsByDate(slotsData);
      setSlots(groupedSlots);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load experience');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!selectedSlot) {
      alert('Please select a date and time slot');
      return;
    }

    // Store booking data in sessionStorage
    sessionStorage.setItem(
      'bookingData',
      JSON.stringify({
        experience,
        slot: selectedSlot,
        numberOfGuests,
      })
    );

    router.push('/checkout');
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading experience..." />;
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error || 'Experience not found'}
            </h2>
            <p className="text-gray-600 mb-6">
              The experience you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/')} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPrice = parsePrice(experience.price) * numberOfGuests;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Section */}
      <section className="relative h-[50vh] lg:h-[60vh] bg-gray-900">
        <Image
          src={experience.imageUrl || '/placeholder-image.jpg'}
          alt={experience.title}
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="bg-white/90 hover:bg-white text-black backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-white/90 text-gray-800">
                {experience.category}
              </Badge>
              {experience.difficulty && (
                <Badge
                  variant={
                    experience.difficulty === 'easy'
                      ? 'success'
                      : experience.difficulty === 'moderate'
                      ? 'warning'
                      : 'danger'
                  }
                >
                  {experience.difficulty}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {experience.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{experience.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-lg">{experience.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold">
                  {experience.rating} ({experience.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">About This Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {experience.description}
                </p>
              </CardContent>
            </Card>

            {/* Highlights */}
            {experience.highlights && experience.highlights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {experience.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* What's Included/Excluded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {experience.included && experience.included.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-green-700">What's Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {experience.included.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {experience.excluded && experience.excluded.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-red-700">What's Not Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {experience.excluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Price Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="text-sm text-gray-600 mb-1">Starting from</div>
                    <div className="text-4xl font-bold text-[#FFD11A] mb-1">
                      {experience.price}
                    </div>
                    <div className="text-sm text-gray-600">per person</div>
                  </div>

                  {/* Guest Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Number of Guests
                    </label>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}
                        disabled={numberOfGuests <= 1}
                      >
                        −
                      </Button>
                      <span className="text-2xl font-bold min-w-[3rem] text-center">
                        {numberOfGuests}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setNumberOfGuests(Math.min(experience.maxGroupSize || 20, numberOfGuests + 1))}
                        disabled={numberOfGuests >= (experience.maxGroupSize || 20)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Date & Time Selection */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Select Date & Time
                    </h3>
                    <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                      {slots.slice(0, 7).map((dateAvail) => (
                        <div key={dateAvail.date} className="space-y-3">
                          <div className="text-sm font-semibold text-gray-900 border-b pb-2">
                            {formatDate(dateAvail.date, 'long')}
                          </div>
                          <div className="space-y-2">
                            {dateAvail.slots.map((slot) => (
                              <button
                                key={slot.id}
                                onClick={() => slot.status === 'available' && setSelectedSlot(slot)}
                                disabled={slot.status !== 'available'}
                                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                                  selectedSlot?.id === slot.id
                                    ? 'border-[#FFD11A] bg-[#FFD11A]/10 shadow-md'
                                    : slot.status === 'available'
                                    ? 'border-gray-200 hover:border-[#FFD11A] hover:bg-[#FFD11A]/5'
                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-semibold text-gray-900 mb-1">
                                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {slot.availableSpots} spots available
                                    </div>
                                  </div>
                                  <Badge
                                    variant={slot.status === 'available' ? 'success' : 'secondary'}
                                  >
                                    {slot.status}
                                  </Badge>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="border-t pt-6 mb-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {experience.price} × {numberOfGuests} guest{numberOfGuests > 1 ? 's' : ''}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-3 border-t">
                      <span>Total</span>
                      <span className="text-[#FFD11A]">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleBookNow}
                    disabled={!selectedSlot}
                    className="text-lg py-6"
                  >
                    {selectedSlot ? 'Proceed to Checkout' : 'Select Date & Time'}
                  </Button>

                  {experience.cancellationPolicy && (
                    <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
                      {experience.cancellationPolicy}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
