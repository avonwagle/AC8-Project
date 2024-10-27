'use client';

import React from 'react';

interface HeroSectionProps {
  title: string;
  description: string;
  backgroundImage: string; // URL of the background image
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, description, backgroundImage }) => {
  return (
    <section
      className="relative flex h-screen items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold">{title}</h1>
        <p className="mb-6 text-lg">{description}</p>
        <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
