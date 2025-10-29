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
  IndianRupee,
  Minus,
  Plus
} from 'lucide-react';

export default function ExperienceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const experienceId = params.id as string;

  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<DateAvailability[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
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

  const subtotal = parsePrice(experience.price) * numberOfGuests;
  const tax = subtotal * 0.1;
  const totalPrice = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2 max-w-[1440px]">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-12 max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Side - Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Image */}
            <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[406px] rounded-xl overflow-hidden bg-gray-200">
              <Image
                src={experience.imageUrl || '/placeholder-image.jpg'}
                alt={experience.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {experience.title}
              </h1>

            </div>

            {/* Description */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <p className="text-[#6C6C6C] leading-relaxed text-[16px]">
                  {experience.description || experience.shortDescription}
                </p>
              </div>

              {/* Choose Date */}
              <div>
                <h3 className="text-[16px] sm:text-[18px] font-semibold text-gray-900 mb-3 sm:mb-4">Choose Date</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {slots.slice(0, 7).map((dateAvail) => {
                    const date = new Date(dateAvail.date);
                    const isSelected = selectedDate === dateAvail.date;
                    return (
                      <button
                        key={dateAvail.date}
                        onClick={() => {
                          if (dateAvail.hasAvailability) {
                            setSelectedDate(dateAvail.date);
                            setSelectedSlot(null); // Reset time selection when date changes
                          }
                        }}
                        className={`px-3 sm:px-4 py-2 rounded-md border text-xs sm:text-sm font-medium transition-all ${isSelected
                          ? 'border-[#FFD11A] bg-[#FFD11A] text-black'
                          : dateAvail.hasAvailability
                            ? 'border-gray-300 hover:border-[#FFD11A] hover:bg-[#FFD11A]/10 text-gray-900'
                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                        disabled={!dateAvail.hasAvailability}
                      >
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Choose Time */}
              <div>
                <h3 className="text-[16px] sm:text-[18px] font-semibold text-gray-900 mb-3 sm:mb-4">Choose Time</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-2">
                  {selectedDate ?
                    slots.find(dateAvail => dateAvail.date === selectedDate)?.slots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => slot.status === 'available' && setSelectedSlot(slot)}
                        disabled={slot.status !== 'available'}
                        className={`px-3 sm:px-4 py-2 rounded-md border text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 ${selectedSlot?.id === slot.id
                          ? 'border-[#FFD11A] bg-[#FFD11A] text-black'
                          : slot.status === 'available'
                            ? 'border-gray-300 hover:border-[#FFD11A] hover:bg-[#FFD11A]/10 text-gray-900'
                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        {formatTime(slot.startTime)} <span className='text-[#FF4C0A] text-xs sm:text-sm'>{slot.availableSpots} left</span>
                      </button>
                    )) :
                    slots.flatMap(dateAvail =>
                      dateAvail.slots.map(slot => ({ ...slot, date: dateAvail.date }))
                    ).map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => {
                          if (slot.status === 'available') {
                            setSelectedDate(slot.date);
                            setSelectedSlot(slot);
                          }
                        }}
                        disabled={slot.status !== 'available'}
                        className={`px-3 sm:px-4 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 ${selectedSlot?.id === slot.id
                          ? 'border-[#FFD11A] bg-[#FFD11A] text-black'
                          : slot.status === 'available'
                            ? 'border-gray-300 hover:border-[#FFD11A] hover:bg-[#FFD11A]/10 text-gray-900'
                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        {formatTime(slot.startTime)} <span className='text-[#FF4C0A] text-xs sm:text-sm'>{slot.availableSpots} left</span>
                      </button>
                    ))
                  }
                </div>
                <p className="text-sm text-gray-500 mb-6">All times are in IST (GMT +5:30)</p>
              </div>

              {/* About */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
                <p className="text-[#838383] leading-relaxed bg-[#EEEEEE] rounded-md px-4 py-2 text-sm">
                  Scenic routes, trained guides, and safety briefing. Minimum age 10.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="bg-[#EFEFEF] border-none rounded-xl shadow-none overflow-hidden w-full max-w-[387px] lg:w-[387px]">
                <CardContent className="p-2 space-y-6">
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}>Starting at</div>
                    <div className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '18px', lineHeight: '22px', letterSpacing: '0%' }}>
                      ₹{parsePrice(experience.price)}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}>
                      Quantity
                    </label>
                    <div className="flex items-center gap-0 rounded">
                      <Button
                        size="icon"
                        onClick={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}
                        disabled={numberOfGuests <= 1}
                        className="w-4 h-4 rounded-none border-[0.2px] border-[var(--des-text)]"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-3 py-1 text-md min-w-[2rem] text-center" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}>
                        {numberOfGuests}
                      </span>
                      <Button
                        size="icon"
                        onClick={() => setNumberOfGuests(Math.min(experience.maxGroupSize || 20, numberOfGuests + 1))}
                        disabled={numberOfGuests >= (experience.maxGroupSize || 20)}
                        className="w-4 h-4 rounded-none border-[0.2px] border-[var(--des-text)]"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}>Subtotal</span>
                    <span className="font-semibold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '18px', lineHeight: '22px', letterSpacing: '0%' }}>
                      {formatCurrency(parsePrice(experience.price) * numberOfGuests)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}>Taxes</span>
                    <span className="font-semibold text-gray-900" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '18px', lineHeight: '22px', letterSpacing: '0%' }}>
                      {formatCurrency((parsePrice(experience.price) * numberOfGuests) * 0.1)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-300">
                    <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}>Total</span>
                    <span className="" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '18px', lineHeight: '22px', letterSpacing: '0%' }}>
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>

                  {/* Book Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleBookNow}
                    disabled={!selectedSlot}
                    className={`font-semibold py-3 rounded-lg ${selectedSlot
                      ? 'bg-[#FFD11A] hover:bg-[#FFD11A]/90 text-black'
                      : 'bg-[#D7D7D7] text-gray-500 cursor-not-allowed'
                      }`}
                    style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}
                  >
                    Confirm
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
