'use client';

import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  isMentor: boolean;
  isMentee: boolean;
}

interface EditUserModalProps {
  user: User | null; // User to edit
  onClose: () => void; // Function to close the modal
  onUserUpdated: () => void; // Function to call after updating the user
}

const EditUserModal = ({ user, onClose, onUserUpdated }: EditUserModalProps) => {
  const [formData, setFormData] = useState<User | null>(null);
  const [userType, setUserType] = useState<string>(''); // Track the selected user type

  useEffect(() => {
    if (user) {
      setFormData(user);
      // Set userType based on user data
      if (user.isMentor) setUserType('Mentor');
      else if (user.isMentee) setUserType('Mentee');
      else setUserType(''); // If neither, set it as blank
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => (prevData ? { ...prevData, [name]: value } : null));
  };

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUserType = e.target.value;
    setUserType(newUserType);
    if (formData) {
      // Update isMentor and isMentee based on the selected userType
      setFormData({
        ...formData,
        isMentor: newUserType === 'Mentor',
        isMentee: newUserType === 'Mentee',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      try {
        const response = await fetch(`/api/admin/updateuser/${formData.id}`, {
          // Corrected URL
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          onUserUpdated(); // Notify parent component to refresh user list
          onClose(); // Close the modal
        } else {
          console.error('Failed to update user:', await response.json());
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  if (!formData) return null; // Render nothing if no user data

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="rounded bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block">User Type</label>
            <select
              name="userType"
              value={userType}
              onChange={handleUserTypeChange}
              className="w-full border p-2"
              required
            >
              <option value="">Select Type</option>
              <option value="Mentor">Mentor</option>
              <option value="Mentee">Mentee</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 rounded bg-gray-300 p-2">
              Cancel
            </button>
            <button type="submit" className="rounded bg-green-700 p-2 text-white">
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
