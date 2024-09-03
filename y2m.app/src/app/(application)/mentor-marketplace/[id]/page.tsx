'use client';

import { AuthenticatedRoute } from '@/components/common/authenticated-route';
import { useMentorDetail } from '@/hooks/useMentorDetail';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { ErrorAlert } from '@/components/common/error-alert';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MentorDetailPage() {
  const router = useRouter();
  const mentorId = router.query?.id as string;  // Get the mentor ID from the route

  const { mentor, isLoading, error } = useMentorDetail(mentorId);  // Use the new hook to fetch mentor data

  if (!mentorId) {
    return <div>Loading...</div>;  // Display a loading state if the ID is not yet available
  }

  if (isLoading) {
    return <LoadingSkeleton count={1} />;  // Show loading skeleton while data is being fetched
  }

  if (error) {
    return <ErrorAlert message={error.message} />;  // Display error message if fetching fails
  }

  return (
    <AuthenticatedRoute>
      <div className="mx-auto mt-10 min-h-screen max-w-7xl flex bg-background">
        
        {/* Left Side: Mentor Information */}
        <div className="w-2/3 p-8 bg-white shadow-md rounded-lg mr-4">
          <div className="flex flex-col items-center">
            <Image
              src={mentor?.profilePictureURL || '/images/default-profile.png'}
              alt={mentor?.name}
              width={200}
              height={200}
              className="rounded-full mb-4"
            />
            <h1 className="text-3xl font-bold">{mentor?.name}</h1>
            <p className="text-lg">{mentor?.email}</p>
            <p className="mt-4">{mentor?.aboutMe}</p>

            {/* Tabs for About and Reviews */}
            <div className="w-full mt-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-4">
                  <a className="text-gray-500 hover:text-gray-700" href="#about">About</a>
                  <a className="text-gray-500 hover:text-gray-700" href="#reviews">Reviews</a>
                </nav>
              </div>

              {/* About Tab Content */}
              <div id="about" className="mt-6">
                <h3 className="text-xl font-bold mb-2">About</h3>
                <p>{mentor?.aboutMe}</p>
              </div>

              {/* Reviews Tab Content */}
              <div id="reviews" className="mt-6">
                <h3 className="text-xl font-bold mb-2">Reviews</h3>
                {/* Placeholder for reviews */}
                <p>No reviews yet.</p>
              </div>
            </div>

            {/* Education Section */}
            <div id="education" className="mt-8">
              <h3 className="text-xl font-bold mb-2">Education</h3>
              <ul className="list-disc list-inside">
                {mentor?.education?.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>
            </div>

            {/* Skills Section */}
            <div id="skills" className="mt-8">
              <h3 className="text-xl font-bold mb-2">Skills</h3>
              <ul className="list-disc list-inside">
                {mentor?.skills?.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side: Calendar and Appointment Request */}
        <div className="w-1/3 p-8 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-bold mb-4">Book an Appointment</h3>
          {/* Placeholder for Calendar */}
          <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
          <button className="w-full p-3 bg-blue-600 text-white rounded-lg">Request Appointment</button>
        </div>
      </div>
    </AuthenticatedRoute>
  );
}
