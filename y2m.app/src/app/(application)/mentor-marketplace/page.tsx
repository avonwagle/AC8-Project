'use client';

import { useState } from 'react';
import { AuthenticatedRoute } from '@/components/common/authenticated-route';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { ErrorAlert } from '@/components/common/error-alert';
import Image from 'next/image';
import Link from 'next/link';
import { useMentors } from '@/hooks/useMentor';
import { useMentorFilters } from '@/hooks/useMentorFilters';

export default function MentorMarketplacePage() {
  const [selectedFilters, setSelectedFilters] = useState({
    specialization: '',
    availability: '',
    country: '',
    rating: '',
    price: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch mentors and filters, ensuring default values for filters
  const { mentors, isLoading: mentorsLoading, error: mentorsError } = useMentors();
  const {
    filters = {
      specialization: [],
      availability: [],
      country: [],
      rating: [],
      price: [],
    },
    isLoading: filtersLoading,
    error: filtersError,
  } = useMentorFilters();

  const handleFilterChange = (filterCategory: string, value: string) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterCategory]: value,
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  if (mentorsLoading || filtersLoading) {
    return <LoadingSkeleton count={1} />;
  }

  if (mentorsError || filtersError) {
    return (
      <ErrorAlert message={mentorsError?.message || filtersError?.message || 'An error occurred'} />
    );
  }

  // Filter mentors locally after fetching all data
  const filteredMentors = mentors.filter((mentor) => {
    const mentorPrice = mentor.price !== undefined ? Number(mentor.price) : undefined;
    const mentorRating = mentor.rating !== undefined ? Number(mentor.rating) : undefined;

    return (
      (selectedFilters.specialization === '' ||
        mentor.specialization === selectedFilters.specialization) &&
      (selectedFilters.availability === '' ||
        mentor.availability === selectedFilters.availability) &&
      (selectedFilters.country === '' || mentor.country === selectedFilters.country) &&
      (selectedFilters.price === '' ||
        (mentorPrice !== undefined && mentorPrice === Number(selectedFilters.price))) &&
      (selectedFilters.rating === '' ||
        (mentorRating !== undefined && mentorRating === Number(selectedFilters.rating))) &&
      (searchTerm === '' || mentor.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredMentors.length / itemsPerPage);
  const displayedMentors = filteredMentors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <AuthenticatedRoute>
      <div className="flex min-h-screen flex-col bg-background px-4 md:px-6 lg:px-8">
        <main className="grow">
          <div className="mx-auto mt-10 max-w-7xl">
            <div className="mb-8">
              <h1 className="text-center text-3xl font-bold">Choose Your Mentor</h1>
            </div>
            <div className="mb-8 w-full">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <input
                  type="text"
                  placeholder="Search for mentors..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full rounded-lg border border-gray-300 p-3 md:w-2/3"
                />
                <button className="w-full rounded-lg bg-blue-600 p-3 text-white md:w-1/3">
                  Search
                </button>
              </div>
            </div>
            <div className="mb-8 w-full">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Specialization Filter */}
                <select
                  className="rounded-md bg-gray-200 p-3"
                  value={selectedFilters.specialization}
                  onChange={(e) => handleFilterChange('specialization', e.target.value)}
                >
                  <option value="">Specialization</option>
                  {filters.specialization.map((specialization: string, index: number) => (
                    <option key={index} value={specialization}>
                      {specialization}
                    </option>
                  ))}
                </select>

                {/* Availability Filter */}
                <select
                  className="rounded-md bg-gray-200 p-3"
                  value={selectedFilters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                >
                  <option value="">Availability</option>
                  {filters.availability.map((availability: string, index: number) => (
                    <option key={index} value={availability}>
                      {availability}
                    </option>
                  ))}
                </select>

                {/* Country Filter */}
                <select
                  className="rounded-md bg-gray-200 p-3"
                  value={selectedFilters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                >
                  <option value="">Country</option>
                  {filters.country.map((country: string, index: number) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>

                {/* Rating Filter */}
                <select
                  className="rounded-md bg-gray-200 p-3"
                  value={selectedFilters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                >
                  <option value="">Rating</option>
                  {filters.rating.map((rating: number, index: number) => (
                    <option key={index} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>

                {/* Price Filter */}
                <select
                  className="rounded-md bg-gray-200 p-3"
                  value={selectedFilters.price}
                  onChange={(e) => handleFilterChange('price', e.target.value)}
                >
                  <option value="">Price</option>
                  {filters.price.map((price: number, index: number) => (
                    <option key={index} value={price}>
                      {price}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Display filtered mentors */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedMentors.map((mentor) => {
                const specializationList = mentor.mentorAreas ? mentor.mentorAreas.slice(0, 2) : [];
                const moreSpecializationsCount = mentor.mentorAreas
                  ? mentor.mentorAreas.length - 2
                  : 0;

                return (
                  <div key={mentor.id} className="rounded-lg bg-white p-6 shadow-md">
                    <div className="mb-4 flex items-center">
                      <Image
                        src={mentor.profilePictureURL || '/default-profile.png'}
                        alt={mentor.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div className="ml-4">
                        <Link
                          href={`/mentor-marketplace/${mentor.id}`}
                          className="text-lg font-semibold"
                        >
                          {mentor.name}
                        </Link>
                        <p className="text-gray-500">{mentor.country}</p>
                      </div>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {specializationList.map((specialization, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-gray-300 px-3 py-1 text-sm"
                        >
                          {specialization}
                        </span>
                      ))}
                      {moreSpecializationsCount > 0 && (
                        <span className="rounded-full border border-gray-300 px-3 py-1 text-sm">
                          +{moreSpecializationsCount} more
                        </span>
                      )}
                    </div>
                    <p>Rating: {mentor.rating}</p>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`mx-1 rounded-md px-3 py-2 ${
                    currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </AuthenticatedRoute>
  );
}
