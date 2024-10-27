'use client';

import { useEffect, useState, useCallback } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  isMentor: boolean;
  isMentee: boolean;
}

interface UserTableProps {
  userType?: 'mentor' | 'mentee';
}

const UserTable = ({ userType }: UserTableProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/fetchusers');
      const data = await response.json();
      if (Array.isArray(data)) {
        if (userType === 'mentor') {
          setUsers(data.filter((user) => user.isMentor));
        } else if (userType === 'mentee') {
          setUsers(data.filter((user) => user.isMentee));
        } else {
          setUsers(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to fetch users.');
    }
  }, [userType]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof User) => {
    setEditData({
      ...editData,
      [field]: e.target.value,
    });
  };

  const handleEdit = (user: User) => {
    setIsEditing(user.id);
    setEditData(user);
  };

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/updateuser/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      setUsers((prev) => prev.map((item) => (item.id === id ? { ...item, ...editData } : item)));
      setIsEditing(null);
      setSuccessMessage('User updated successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      {successMessage && (
        <div className="mb-4 rounded border border-green-300 bg-green-100 p-2 text-green-700">
          {successMessage}
        </div>
      )}
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <h3 className="mb-6 text-2xl font-semibold text-gray-800">User List</h3>
      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">User Type</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-300">
                <td className="px-4 py-3">
                  {isEditing === user.id ? (
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => handleInputChange(e, 'name')}
                      className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span>{user.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isEditing === user.id ? (
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => handleInputChange(e, 'email')}
                      className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isEditing === user.id ? (
                    <select
                      value={editData.isMentor ? 'mentor' : 'mentee'}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          isMentor: e.target.value === 'mentor',
                          isMentee: e.target.value === 'mentee',
                        })
                      }
                      className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="mentor">Mentor</option>
                      <option value="mentee">Mentee</option>
                    </select>
                  ) : (
                    <span>{user.isMentor ? 'Mentor' : user.isMentee ? 'Mentee' : 'User'}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isEditing === user.id ? (
                    <span
                      onClick={() => handleSave(user.id)}
                      className="cursor-pointer text-green-600 hover:underline"
                    >
                      Save
                    </span>
                  ) : (
                    <span
                      onClick={() => handleEdit(user)}
                      className="cursor-pointer text-green-600 hover:underline"
                    >
                      Edit
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTable;
