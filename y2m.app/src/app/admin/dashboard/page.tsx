'use client';

import { useEffect, useState } from 'react';
import Sidebar from './components/sidebar';
import Header from './components/header';
import UserTable from './components/UserTable';
import UploadQuestions from './components/uploadquestions';
import AssessmentTable from './components/AssessmentTable';
import CategoryForm from './components/CategoryForm';
import CategoriesTable from './components/CategoriesTable';
import AssessmentForm from './components/AssessmentForm';
import AddOrganization from './components/AddOrganization';
import CertificateTable from './components/CertificateTable';
import SuccessStories from './components/SuccessStories';
import AdminUserTable from './components/AdminUserTable';
import OrganizationDashboard from './components/OrganizationDashboard'; // Import the OrganizationDashboard
import Organization from './components/Organization';
import FeatureFlagDashboard from './components/FeatureFlagDashboard';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<string>(''); // Tracks current view
  const [userType, setUserType] = useState<'mentor' | 'mentee' | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false); // State to toggle the create assessment form
  const [userRole, setUserRole] = useState<string | null>(null); // Handle userRole here, but passed from Header

  useEffect(() => {
    refreshCategories(); // Fetch categories when the component mounts
  }, []);

  const refreshCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories); // Set the categories state with the fetched data
      } else {
        console.error('Failed to fetch categories:', data.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSelectView = (view: string) => {
    setCurrentView(view); // Set current view to the clicked section

    if (view === 'manageMentors') {
      setUserType('mentor');
    } else if (view === 'manageMentees') {
      setUserType('mentee');
    } else if (view === 'uploadQuestions') {
      setShowCategoryForm(false);
    } else if (view === 'createCategory') {
      setShowCategoryForm(true);
    } else if (view === 'createAssessment') {
      setShowCreateForm(true); // Show the assessment form
    } else if (view === 'addOrganization') {
      setShowCreateForm(false); // Ensure other forms are hidden when Add Organization is selected
    } else {
      setUserType(null);
      setShowCategoryForm(false);
      setShowCreateForm(false);
    }
  };

  const handleCreateAssessment = async (data: {
    title: string;
    description: string;
    objective: string;
    duration: number;
    categoryId: number;
  }) => {
    try {
      const response = await fetch('/api/admin/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error creating assessment');
      }

      console.log('Assessment created successfully');
      setShowCreateForm(false); // Hide form after submission
    } catch (error) {
      console.error('Failed to create assessment:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Pass userRole prop to Sidebar and handle from Header */}
      <Sidebar onSelect={handleSelectView} userRole={userRole} />
      <div className="flex-1">
        <Header setUserRole={setUserRole} /> {/* Pass setUserRole to Header */}
        <main className="p-6">
          <h2 className="mb-6 text-2xl font-bold">Welcome to Admin Dashboard</h2>

          {/* Render views conditionally based on the current selection */}
          {currentView === 'users' && <UserTable />}
          {currentView === 'manageMentors' && userType && <UserTable userType={userType} />}
          {currentView === 'manageMentees' && userType && <UserTable userType={userType} />}
          {currentView === 'uploadQuestions' && <UploadQuestions />}
          {currentView === 'skills' && <AssessmentTable />}

          {currentView === 'createCategory' && (
            <div>
              {showCategoryForm && <CategoryForm onCategoryAdded={refreshCategories} />}
              <CategoriesTable categories={categories} />
            </div>
          )}

          {currentView === 'createAssessment' && (
            <div>
              {showCreateForm && (
                <AssessmentForm onSubmit={handleCreateAssessment} categories={categories} />
              )}
              <AssessmentTable />
            </div>
          )}

          {/* Conditionally render AddOrganization component */}
          {currentView === 'addOrganization' && <AddOrganization />}
          {currentView === 'manageCertificates' && <CertificateTable />}
          {currentView === 'successStories' && <SuccessStories />}

          {/* Render the Admin User Management Table */}
          {currentView === 'manageAdminUsers' && <AdminUserTable />}

          {/* Render the Organization Dashboard */}
          {currentView === 'viewManageOrganizations' && <OrganizationDashboard />}
          {currentView === 'viewOrganizations' && <Organization />}
          {currentView === 'featureManagement' && <FeatureFlagDashboard />}
        </main>
      </div>
    </div>
  );
}
