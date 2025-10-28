/**
 * Home Page - Experience Listing
 * Highway Delite design with improved shadcn components and better spacing
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Experience } from '@/types';
import { experienceService } from '@/lib/services/api';
import { ExperienceCard } from '@/components/ExperienceCard';
import { Button } from '@/components/ui/Button';
import { ExperienceCardSkeleton } from '@/components/ui/Loading';
import { Card, CardContent } from '@/components/ui/Card';
import { AlertCircle, Search, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const searchParams = useSearchParams();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get search query from URL on mount
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Fetch experiences on mount
  useEffect(() => {
    fetchExperiences();
  }, []);

  // Apply filters when category or search changes
  useEffect(() => {
    filterExperiences();
  }, [selectedCategory, searchQuery, experiences]);

  const fetchExperiences = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await experienceService.getExperiences();
      setExperiences(data);
      setFilteredExperiences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load experiences');
    } finally {
      setIsLoading(false);
    }
  };

  const filterExperiences = () => {
    let filtered = [...experiences];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (exp) =>
          exp.title.toLowerCase().includes(query) ||
          exp.location.toLowerCase().includes(query) ||
          exp.description?.toLowerCase().includes(query) ||
          exp.shortDescription.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (exp) => exp.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredExperiences(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    // Update URL to remove search parameter
    window.history.replaceState({}, '', window.location.pathname);
  };

  const categories = [
    'all',
    ...Array.from(new Set(experiences.map((exp) => exp.category))),
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 max-w-7xl">
        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto mb-12">
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Something went wrong
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">{error}</p>
                  <Button
                    onClick={fetchExperiences}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(6)].map((_, index) => (
              <ExperienceCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Experience Grid */}
        {!isLoading && !error && filteredExperiences.length > 0 && (
          <>
            {/* Search Results Header */}
            {/* {searchQuery.trim() && (
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-gray-600">
                  Found {filteredExperiences.length} experience{filteredExperiences.length !== 1 ? 's' : ''}
                </p>
                <Button
                  onClick={clearSearch}
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-gray-500 hover:text-gray-700"
                >
                  Clear search
                </Button>
              </div>
            )} */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredExperiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredExperiences.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchQuery.trim() ? 'No matching experiences found' : 'No experiences found'}
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {searchQuery.trim()
                  ? `No experiences match "${searchQuery}". Try a different search term.`
                  : 'Try selecting a different category to find what you\'re looking for'
                }
              </p>
              <div className="flex gap-3 justify-center">
                {searchQuery.trim() && (
                  <Button
                    onClick={clearSearch}
                    variant="outline"
                    size="lg"
                  >
                    Clear Search
                  </Button>
                )}
                <Button
                  onClick={() => setSelectedCategory('all')}
                  variant="primary"
                  size="lg"
                >
                  Show All Experiences
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}