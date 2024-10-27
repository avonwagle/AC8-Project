'use client';

import { useEffect, useState } from 'react';

type Organization = {
  id: number | string;
  organizationname: string;
  domain: string;
  subdomain: string;
  contactemail: string;
  isactive: boolean;
};

export default function OrganizationDashboardViewOnly() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return <div>Loading organizations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl rounded-lg bg-white p-8 shadow-lg">
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
        Currently Available Organizations
      </h1>

      <table className="min-w-full table-auto border-collapse overflow-hidden rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700">
            <th className="px-6 py-3">Organization Name</th>
            <th className="px-6 py-3">Domain</th>
            <th className="px-6 py-3">Subdomain</th>
            <th className="px-6 py-3">Contact Email</th>
            <th className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {organizations.map((organization) => (
            <tr key={organization.id}>
              <td className="px-6 py-4 text-gray-800">{organization.organizationname}</td>
              <td className="px-6 py-4 text-gray-600">{organization.domain}</td>
              <td className="px-6 py-4 text-gray-600">{organization.subdomain}</td>
              <td className="px-6 py-4 text-gray-600">{organization.contactemail}</td>
              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${organization.isactive ? 'text-black-800 bg-green-300' : 'text-black-800 bg-red-300'}`}
                >
                  {organization.isactive ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
