'use client';

import { AuthenticatedRoute } from '@/components/common/authenticated-route';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { ErrorAlert } from '@/components/common/error-alert';
import Image from 'next/image';
import Link from 'next/link';
import { useMentors } from '@/hooks/useMentor';

export default function MentorMarketplacePage() {
  const { mentors, isLoading, error } = useMentors();

  if (isLoading) {
    return <LoadingSkeleton count={1} />;
  }
  if (error) {
    return <ErrorAlert message={error.message} />;
  }

  return (
    <AuthenticatedRoute>
      <div className="mx-auto mt-10 min-h-screen max-w-7xl flex-col items-center bg-background">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">Choose Your Mentor</h1>
        </div>

        {/* Search and Filter */}
        <div className="w-full mb-8">
          <div className="flex">
            <input 
              type="text" 
              placeholder="Search for mentors..."
              className="w-full p-3 rounded-l-lg border border-gray-300"
            />
            <button className="p-3 bg-blue-600 text-white rounded-r-lg">Search</button>
          </div>
        </div>

        {/* Filters */}
        <div className="w-full flex flex-wrap gap-4 mb-8">
          {['Skills', 'Language', 'Software', 'Job Title', 'Discipline', 'Industry'].map((filter) => (
            <button key={filter} className="bg-gray-200 py-2 px-4 rounded-md">
              {filter}
            </button>
          ))}
        </div>

        {/* Total Number of Mentors */}
        <div className="mb-8 text-lg">
          Total Mentors on the Platform: {mentors.length}
        </div>

        {/* Mentor Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            <Link key={mentor.id} href={`/mentor-marketplace/${mentor.id}`}>
              <div className="cursor-pointer rounded-lg bg-white shadow-lg dark:bg-gray-800">
                <Image
                  src={mentor.profilePictureURL || '/images/default-profile.png'}
                  alt={mentor.name}
                  width={300}
                  height={200}
                  className="rounded-t-lg"
                />
                <div className="p-4">
                  {/* Mentor Rating */}
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">&#9733;&#9733;&#9733;&#9733;&#9734;</span>
                  </div>
                  
                  {/* Mentor Name and Country */}
                  <h3 className="text-xl font-bold mb-1">{mentor.name} <span className="ml-2"><img src={`/images/flags/${mentor.country}.png`} alt={mentor.country} className="inline-block w-6 h-4" /></span></h3>

                  {/* Specialization */}
                  <p className="text-gray-600 mb-2">{mentor.specialization}</p>

                  {/* Mentor Information Fields */}
                  <div className="flex flex-wrap gap-2">
                    {mentor.mentorAreas.slice(0, 2).map((area, index) => (
                      <span key={index} className="bg-gray-200 py-1 px-3 rounded-md">{area}</span>
                    ))}
                    {mentor.mentorAreas.length > 2 && (
                      <span className="bg-gray-200 py-1 px-3 rounded-md">
                        +{mentor.mentorAreas.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AuthenticatedRoute>
  );
}
