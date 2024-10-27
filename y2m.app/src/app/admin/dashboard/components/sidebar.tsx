'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdDashboard,
  MdPeople,
  MdBusiness,
  MdAssignment,
  MdPersonAdd,
  MdPersonSearch,
  MdCloudUpload,
  MdConfirmationNumber,
  MdAdd,
  MdCreate,
  MdStar,
  MdFlag,
} from 'react-icons/md';

interface SidebarProps {
  onSelect: (section: string) => void;
  userRole: string | null;
}

export default function Sidebar({ onSelect, userRole }: SidebarProps) {
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const [showOrganizationsDropdown, setShowOrganizationsDropdown] = useState(false);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);

  const handleSectionToggle = (section: string) => {
    // Reset other dropdowns when a new section is selected
    setShowUsersDropdown(section === 'users' ? !showUsersDropdown : false);
    setShowOrganizationsDropdown(section === 'organizations' ? !showOrganizationsDropdown : false);
    setShowSkillsDropdown(section === 'skills' ? !showSkillsDropdown : false);
    onSelect(section);
  };

  return (
    <aside className="h-screen w-64 bg-white text-black shadow-lg">
      <nav className="p-4">
        <ul className="space-y-4">
          {/* Dashboard */}
          <li>
            <Link href="/admin/dashboard">
              <button
                onClick={() => handleSectionToggle('dashboard')}
                className="flex w-full items-center rounded px-4 py-2 text-left hover:bg-green-600 hover:text-white"
              >
                <MdDashboard className="mr-2" />
                Dashboard
              </button>
            </Link>
          </li>

          {/* Users Dropdown */}
          <li>
            <button
              onClick={() => handleSectionToggle('users')}
              className="flex w-full items-center justify-between rounded px-4 py-2 text-left hover:bg-green-600 hover:text-white"
            >
              <span className="flex items-center">
                <MdPeople className="mr-2" />
                Users
              </span>
              {showUsersDropdown ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </button>
            {showUsersDropdown && (
              <ul className="ml-4 mt-2 space-y-2">
                <li>
                  <button
                    onClick={() => onSelect('manageMentors')}
                    className="flex items-center rounded px-4 py-2 text-black hover:bg-green-600 hover:text-white"
                  >
                    <MdPersonAdd className="mr-2" />
                    Manage Mentors
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelect('manageMentees')}
                    className="flex items-center rounded px-4 py-2 text-black hover:bg-green-600 hover:text-white"
                  >
                    <MdPersonSearch className="mr-2" />
                    Manage Mentees
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelect('manageAdminUsers')}
                    className="flex items-center rounded px-4 py-2 text-black hover:bg-green-600 hover:text-white"
                  >
                    <MdPersonSearch className="mr-2" />
                    ManageAdminUsers
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Organizations Dropdown (Visible to Admin only) */}
          {userRole?.toLowerCase() === 'admin' && (
            <li>
              <button
                onClick={() => handleSectionToggle('organizations')}
                className="flex w-full items-center justify-between rounded px-4 py-2 text-left hover:bg-green-600 hover:text-white"
              >
                <span className="flex items-center">
                  <MdBusiness className="mr-2" />
                  Organizations
                </span>
                {showOrganizationsDropdown ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
              </button>
              {showOrganizationsDropdown && (
                <ul className="ml-4 mt-2 space-y-2">
                  <li>
                    <button
                      onClick={() => onSelect('viewOrganizations')}
                      className="flex items-center rounded px-4 py-2 text-black hover:bg-green-600 hover:text-white"
                    >
                      <MdBusiness className="mr-2" />
                      View Organizations
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onSelect('addOrganization')}
                      className="flex items-center rounded px-4 py-2 text-black hover:bg-green-600 hover:text-white"
                    >
                      <MdAdd className="mr-2" />
                      Add Organization
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onSelect('viewManageOrganizations')}
                      className="flex items-center rounded px-4 py-2 text-black hover:bg-green-600 hover:text-white"
                    >
                      <MdBusiness className="mr-2" />
                      ManageOrganizations
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onSelect('featureManagement')}
                      className="flex items-center rounded px-4 py-2 text-black hover:bg-green-600 hover:text-white"
                    >
                      <MdFlag className="mr-2" />
                      FeatureManagement
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Skills Dropdown */}
          <li>
            <button
              onClick={() => handleSectionToggle('skills')}
              className="flex w-full items-center justify-between rounded px-4 py-2 text-left hover:bg-green-600 hover:text-white"
            >
              <span className="flex items-center">
                <MdAssignment className="mr-2" />
                Skill Assessment & Certification
              </span>
              {showSkillsDropdown ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </button>
            {showSkillsDropdown && (
              <ul className="ml-4 mt-2 space-y-2">
                <li>
                  <button
                    onClick={() => onSelect('createCategory')}
                    className="flex items-center rounded px-4 py-2 text-black hover:bg-green-600 hover:text-white"
                  >
                    <MdAdd className="mr-2" />
                    Add Categories
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelect('createAssessment')}
                    className="flex items-center rounded px-4 py-2 text-black hover:bg-green-600 hover:text-white"
                  >
                    <MdCreate className="mr-2" />
                    CreateAssessments
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelect('uploadQuestions')}
                    className="flex items-center rounded px-4 py-2 text-black hover:bg-green-600 hover:text-white"
                  >
                    <MdCloudUpload className="mr-2" />
                    Upload Questions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelect('manageCertificates')}
                    className="flex items-center rounded px-4 py-2 text-black hover:bg-green-600 hover:text-white"
                  >
                    <MdConfirmationNumber className="mr-2" />
                    Certificates
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Success Stories */}
          <li>
            <button
              onClick={() => onSelect('successStories')}
              className="flex w-full items-center rounded px-4 py-2 text-left hover:bg-green-600 hover:text-white"
            >
              <MdStar className="mr-2" />
              Success Stories
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
