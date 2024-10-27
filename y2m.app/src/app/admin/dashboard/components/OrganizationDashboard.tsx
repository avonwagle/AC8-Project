'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Organization = {
  id: number | string;
  organizationname: string;
  domain: string;
  subdomain: string;
  contactemail: string;
  isactive: boolean;
};

export default function OrganizationDashboard() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editedOrg, setEditedOrg] = useState<Organization | null>(null);

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const res = await fetch('/api/admin/organizations/fetch');
        if (!res.ok) {
          throw new Error('Failed to fetch organizations');
        }
        const data = await res.json();
        setOrganizations(data.data);
      } catch (err) {
        setError('Error fetching organizations');
      } finally {
        setLoading(false);
      }
    }
    fetchOrganizations();
  }, []);

  const deactivateOrganization = async (organizationId: number | string) => {
    try {
      const res = await fetch(`/api/admin/organizations/${organizationId}/deactivate`, {
        method: 'POST',
      });
      if (res.ok) {
        setOrganizations((prevOrganizations) =>
          prevOrganizations.map((organization) =>
            organization.id === organizationId ? { ...organization, isactive: false } : organization
          )
        );
        alert('Organization deactivated successfully');
      } else {
        alert('Error deactivating organization');
      }
    } catch (error) {
      alert('Error deactivating organization');
    }
  };

  const handleEdit = (organization: Organization) => {
    setEditingId(organization.id);
    setEditedOrg({ ...organization });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedOrg) {
      setEditedOrg({
        ...editedOrg,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async () => {
    if (editedOrg) {
      try {
        const res = await fetch(`/api/admin/organizations/${editedOrg.id}/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedOrg),
        });

        if (res.ok) {
          setOrganizations((prevOrganizations) =>
            prevOrganizations.map((org) => (org.id === editedOrg.id ? { ...editedOrg } : org))
          );
          setEditingId(null);
          setEditedOrg(null);
          alert('Organization updated successfully');
        } else {
          alert('Error updating organization');
        }
      } catch (error) {
        alert('Error updating organization');
      }
    }
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSubmit(); // Call handleSubmit without event
  };

  if (loading) {
    return <div>Loading organizations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl rounded-lg bg-white p-8 shadow-lg">
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">Organization Management</h1>

      <table className="min-w-full table-auto border-collapse overflow-hidden rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700">
            <th className="px-6 py-3">Organization Name</th>
            <th className="px-6 py-3">Domain</th>
            <th className="px-6 py-3">Subdomain</th>
            <th className="px-6 py-3">Contact Email</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {organizations.map((organization) => (
            <tr key={organization.id}>
              <td className="px-6 py-4 text-gray-800">
                {editingId === organization.id ? (
                  <input
                    type="text"
                    name="organizationname"
                    value={editedOrg?.organizationname || ''}
                    onChange={handleChange}
                    className="rounded border p-1"
                  />
                ) : (
                  organization.organizationname
                )}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {editingId === organization.id ? (
                  <input
                    type="text"
                    name="domain"
                    value={editedOrg?.domain || ''}
                    onChange={handleChange}
                    className="rounded border p-1"
                  />
                ) : (
                  organization.domain
                )}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {editingId === organization.id ? (
                  <input
                    type="text"
                    name="subdomain"
                    value={editedOrg?.subdomain || ''}
                    onChange={handleChange}
                    className="rounded border p-1"
                  />
                ) : (
                  organization.subdomain
                )}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {editingId === organization.id ? (
                  <input
                    type="email"
                    name="contactemail"
                    value={editedOrg?.contactemail || ''}
                    onChange={handleChange}
                    className="rounded border p-1"
                  />
                ) : (
                  organization.contactemail
                )}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${organization.isactive ? 'text-black-800 bg-green-300' : 'text-black-800 bg-red-300'}`}
                >
                  {organization.isactive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4">
                {organization.isactive && editingId !== organization.id && (
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      deactivateOrganization(organization.id);
                    }}
                    className="mr-3 inline-block text-red-500 hover:underline"
                  >
                    Deactivate
                  </Link>
                )}
                {editingId === organization.id ? (
                  <button onClick={handleSaveClick} className="mr-3 text-green-600 hover:underline">
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(organization)}
                    className="mr-3 text-green-600 hover:underline"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
