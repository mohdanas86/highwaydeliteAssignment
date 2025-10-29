/**
 * ExperienceCard Component
 * Displays individual travel experience with improved shadcn design
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Clock, Users, Star } from 'lucide-react';
import { Experience } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ExperienceCardProps {
    experience: Experience;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
    const router = useRouter();

    const handleViewDetails = () => {
        router.push(`/experiences/${experience.id}`);
    };

    const formatPrice = (price: string) => {
        return price;
    };

    return (
        <Card className='p-0 gap-0 border-none overflow-hidden'>
            <CardHeader className='p-0 h-[150px] sm:h-[170px] overflow-hidden'>
                {/* Image Container */}
                <div className="relative aspect-[4/3] ">
                    <Image
                        src={experience.imageUrl || '/placeholder-image.jpg'}
                        alt={experience.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                </div>
            </CardHeader>

            <CardContent className='p-3 sm:p-4 bg-[#F0F0F0]'>
                {/* Title */}


                {/* Location & Duration */}
                <div className="flex justify-between items-center gap-2 text-sm text-gray-600 mb-3 sm:mb-4">
                    <h1 className="text-sm sm:text-md font-semibold text-[var(--black-text)] text-center line-clamp-2 leading-tight">
                        {experience.title}
                    </h1>
                    <div className="flex items-center justify-center gap-1">
                        <Badge className='bg-[var(--badge-color)] rounded-[4px] text-[var(--black-text)] text-xs sm:text-sm' variant="secondary">{experience.location}</Badge>
                    </div>

                </div>

                {/* Description */}
                <p className="text-[var(--des-text)] text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                    {experience.shortDescription || 'Experience the best of local culture and adventure with expert guides.'}
                </p>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <span className='text-xs sm:text-sm text-[var(--black-text)]'>From</span>
                        <span className="text-lg sm:text-xl text-[var(--black-text)]">
                            {formatPrice(experience.price)}
                        </span>
                    </div>

                    <Button
                        onClick={handleViewDetails}
                        variant="primary"
                        size="sm"
                        className="shadow-sm hover:shadow-md transition-shadow text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                    >
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};