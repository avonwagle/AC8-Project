import { useState } from 'react';
import Image from 'next/image';

const courses = [
  {
    imageUrl: '/courses/course1.png',
    title: 'Course 1',
    description: 'Introduction to Programming',
  },
  { imageUrl: '/courses/course2.png', title: 'Course 2', description: 'Advanced Web Development' },
  { imageUrl: '/courses/course3.png', title: 'Course 3', description: 'Data Science Essentials' },
  {
    imageUrl: '/courses/course4.png',
    title: 'Course 4',
    description: 'Project Management Techniques',
  },
  {
    imageUrl: '/courses/course5.png',
    title: 'Course 5',
    description: 'Marketing Strategy Mastery',
  },
  { imageUrl: '/courses/course6.png', title: 'Course 6', description: 'Product Design Principles' },
];

export default function CustomCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % courses.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length);
  };

  return (
    <div className="mt-12 w-full rounded-lg bg-white p-8 shadow-md">
      <h3 className="mb-4 text-xl font-bold">Courses</h3>
      <div className="relative">
        <div className="flex overflow-hidden">
          <div className="flex" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {courses.map((course, index) => (
              <div key={index} className="w-full flex-none px-2 md:w-1/3 lg:w-1/5">
                <div className="rounded-lg bg-gray-100 p-4">
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    width={300}
                    height={200}
                    className="mb-4 rounded-lg"
                  />
                  <h4 className="text-lg font-bold">{course.title}</h4>
                  <p className="text-sm text-gray-600">{course.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-gray-500 p-2 text-white"
        >
          &#10094;
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-gray-500 p-2 text-white"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}
