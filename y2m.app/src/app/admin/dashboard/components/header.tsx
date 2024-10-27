'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  setUserRole: (role: string) => void; // Add prop to set userRole in Dashboard
}

export default function Header({ setUserRole }: HeaderProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRoleLocal] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('adminEmail');
    const role = localStorage.getItem('adminRole');
    if (email) {
      setUserEmail(email);
    }
    if (role) {
      setUserRoleLocal(role);
      setUserRole(role); // Pass userRole to Dashboard
    }
  }, [setUserRole]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminRole');
    router.push('/admin/auth/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-green-600 text-white">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-sm text-gray-700">{userRole}</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded bg-white py-2 shadow-lg">
              <p className="px-4 py-2 text-sm text-gray-700">Email: {userEmail}</p>
              <p className="px-4 py-2 text-sm text-gray-700">Role: {userRole}</p>
              <hr />
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
