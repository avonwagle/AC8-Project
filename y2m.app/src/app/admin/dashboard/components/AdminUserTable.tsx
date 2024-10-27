import React, { useEffect, useState } from 'react';

interface AdminUser {
  id: number;
  email: string;
  role: string;
}

const AdminUserTable: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null); // For editing
  const [isEditing, setIsEditing] = useState(false); // Toggle modal

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/adminusers');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setIsEditing(true); // Open modal
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(`/api/admin/adminusers/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: selectedUser.email, role: selectedUser.role }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      if (data.success) {
        // Update the users list with the edited user
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id
              ? { ...user, email: selectedUser.email, role: selectedUser.role }
              : user
          )
        );
        setIsEditing(false); // Close modal
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.role}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button onClick={() => handleEdit(user)} className="text-green-600 hover:underline">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing user */}
      {isEditing && selectedUser && (
        <div className="bg-opacity/50 fixed inset-0 flex items-center justify-center bg-gray-600">
          <div className="rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl">Edit User</h2>
            <label className="mb-2 block">
              Email:
              <input
                type="email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                className="w-full border border-gray-300 px-2 py-1"
              />
            </label>
            <label className="mb-4 block">
              Role:
              <input
                type="text"
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                className="w-full border border-gray-300 px-2 py-1"
              />
            </label>
            <button onClick={handleSave} className="rounded bg-green-600 px-4 py-2 text-white">
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="ml-2 rounded bg-gray-500 px-4 py-2 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserTable;
