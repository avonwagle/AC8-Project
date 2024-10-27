'use client';
import { AuthenticatedRoute } from '@/components/common/authenticated-route';
import { LoadingSkeleton } from '@/components/common/loading-skeleton';
import { ErrorAlert } from '@/components/common/error-alert';
import Image from 'next/image';
import { useMentorDetail } from '@/hooks/useMentorDetail';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import CustomCarousel from '../components/CustomCarousel';
import SuccessStories from '../components/SuccessStories';

interface MentorDetailProps {
  params: {
    id: string;
  };
}

type Review = {
  content: string;
  // Add other properties if needed
};

type Education = {
  degree: string;
  institution: string;
  // Add other properties if necessary
};

type Skill = {
  name: string;
  // Add other properties if necessary
};

export default function MentorDetail({ params }: MentorDetailProps) {
  const { mentor, skills, education, reviews, isLoading, error } = useMentorDetail(params.id);
  const [activeTab, setActiveTab] = useState('about');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showSuccessStories, setShowSuccessStories] = useState(false); // New state for success stories visibility

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorAlert message={error.message} />;
  if (!mentor) return <p>Mentor not found.</p>;

  // Mentor availability example data (modify as per your needs)
  type Availability = {
    [key: string]: string;
  };

  const availability: Availability = {
    Monday: 'Available',
    Tuesday: 'Available',
    Wednesday: 'Not Available',
    Thursday: 'Available',
    Friday: 'Available',
    Saturday: 'Not Available',
    Sunday: 'Available',
  };

  type DayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

  const getAvailability = (date: Date) => {
    const dayName: DayName = format(date, 'EEEE') as DayName; // Assert as DayName
    return availability[dayName] || 'Not Available';
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const availabilityText = getAvailability(date);

    // Apply different classes based on the availability
    return availabilityText === 'Available' ? 'available' : 'unavailable';
  };

  const handleDateClick = (date: Date) => {
    const availability = getAvailability(date);
    alert(`Selected Date: ${format(date, 'PPP')}, Availability: ${availability}`);
  };

  // Toggle success stories visibility
  const toggleSuccessStories = () => {
    setShowSuccessStories(!showSuccessStories);
  };

  return (
    <AuthenticatedRoute>
      <div className="mx-auto mt-10 flex min-h-screen max-w-7xl flex-col bg-background lg:flex-row">
        {/* Mentor info */}
        <div className="w-full rounded-lg bg-white p-8 shadow-md lg:mr-4 lg:w-2/3">
          <div className="flex flex-col items-center">
            <Image
              src={mentor.profilePictureURL || '/images/default-profile.png'}
              alt={mentor.name}
              width={200}
              height={200}
              className="mb-4 rounded-full"
            />
            <h1 className="text-3xl font-bold">{mentor.name}</h1>
            <p className="text-lg">{mentor.email}</p>
            <p className="mt-4">{mentor.aboutMe || 'No information available.'}</p>

            {/* Tabs */}
            <div className="mt-8 w-full border-b border-gray-200">
              <nav className="flex space-x-4">
                <button
                  className={`px-4 py-2 ${activeTab === 'about' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('about')}
                >
                  About
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </nav>
            </div>

            {/* About */}
            {activeTab === 'about' && (
              <div id="about" className="mt-6">
                <h3 className="mb-2 text-xl font-bold">About</h3>
                <p>{mentor.aboutMe || 'No information available.'}</p>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div id="reviews" className="mt-6">
                <h3 className="mb-2 text-xl font-bold">Reviews</h3>
                <div>
                  {reviews?.length > 0 ? (
                    reviews.map((review: Review, index: number) => (
                      <p key={index}>&quot;{review.content}&quot;</p>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Education */}
          <div id="education" className="mt-8">
            <h3 className="mb-2 text-xl font-bold">Education</h3>
            <ul className="list-inside list-disc">
              {education?.length > 0 ? (
                education.map((edu: Education, index: number) => (
                  <li key={index}>
                    {edu.degree} from {edu.institution}
                  </li>
                ))
              ) : (
                <li>No education details available.</li>
              )}
            </ul>
          </div>

          {/* Skills */}
          <div id="skills" className="mt-8">
            <h3 className="mb-2 text-xl font-bold">Skills</h3>
            <ul className="list-inside list-disc">
              {skills?.length > 0 ? (
                skills.map((skill: Skill, index: number) => <li key={index}>{skill.name}</li>)
              ) : (
                <li>No skills listed.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 w-full rounded-lg bg-white p-8 shadow-md lg:mt-0 lg:w-1/3">
          <h3 className="mb-4 text-xl font-bold">Demo Video</h3>
          <div className="mb-4">
            <video controls className="h-64 w-full rounded-lg">
              <source src={mentor.demoVideoUrl || '/videos/default-demo.mp4'} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="mt-8 w-full rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-4 text-xl font-bold">Availability</h3>

            <div className="calendar-container">
              <Calendar
                onChange={(value) => {
                  if (Array.isArray(value)) {
                    // Handle range by taking the start date
                    setSelectedDate(value[0] || new Date());
                  } else {
                    // Handle single date
                    setSelectedDate(value || new Date());
                  }
                }}
                value={selectedDate}
                tileClassName={tileClassName}
                tileContent={({ date }) => {
                  const availabilityText = getAvailability(date);
                  return (
                    <div>
                      <span
                        className={`text-sm ${availabilityText === 'Not Available' ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {availabilityText === 'Not Available' ? 'N/A' : 'Available'}
                      </span>
                    </div>
                  );
                }}
                onClickDay={handleDateClick}
              />
            </div>

            <div className="mt-4 border-t border-gray-200 p-4">
              <h4 className="text-lg font-bold">
                Selected Date: {selectedDate ? format(selectedDate, 'PPP') : 'No date selected'}
              </h4>
              <p className="mt-2 text-gray-700">
                Availability:{' '}
                {selectedDate ? getAvailability(selectedDate) : 'No availability info'}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-4">
            <button
              className="w-full rounded-lg bg-green-600 p-3 text-white"
              onClick={toggleSuccessStories} // Toggle success stories on button click
            >
              My Success Stories
            </button>
            <button className="w-full rounded-lg bg-green-600 p-3 text-white">
              Request Appointment
            </button>
            <button className="w-full rounded-lg bg-green-600 p-3 text-white">Give Review</button>
          </div>
        </div>
      </div>

      {/* Conditionally render Success Stories */}
      {showSuccessStories && <SuccessStories mentorId={params.id} />}

      {/* Courses Carousel Section */}
      <CustomCarousel />
    </AuthenticatedRoute>
  );
}
