'use client';

import MainSection from '@/components/common/main-section';
import MainSectionBody from '@/components/common/main-section-body';
import Title from '@/components/common/title';
import Subtitle from '@/components/common/subtitle';
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

  if (loading) {
    return <div>Loading organizations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainSection>
        <MainSectionBody className="space-y-6">
          <Title>Organization Management</Title>
          <Subtitle>Manage and view your organizations here.</Subtitle>
        </MainSectionBody>
      </MainSection>

      <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/admin/organizations/add-organization">
          <button className="mb-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Add New Organization
          </button>
        </Link>

        <table className="min-w-full border-collapse overflow-hidden rounded-lg border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border-b px-4 py-2">Organization Name</th>
              <th className="border-b px-4 py-2">Domain</th>
              <th className="border-b px-4 py-2">Subdomain</th>
              <th className="border-b px-4 py-2">Contact Email</th>
              <th className="border-b px-4 py-2">Status</th>
              <th className="border-b px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((organization) => (
              <tr
                key={organization.id}
                className={`border-t ${organization.isactive ? 'bg-white' : 'bg-gray-200'}`}
              >
                <td className="px-4 py-2 text-black">{organization.organizationname}</td>
                <td className="px-4 py-2 text-black">{organization.domain}</td>
                <td className="px-4 py-2 text-black">{organization.subdomain}</td>
                <td className="px-4 py-2 text-black">{organization.contactemail}</td>
                <td className="px-4 py-2 text-black">
                  {organization.isactive ? 'Active' : 'Inactive'}
                </td>
                <td className="flex space-x-2 px-4 py-2">
                  {organization.isactive && (
                    <button
                      onClick={() => deactivateOrganization(organization.id)}
                      className="mr-2 rounded bg-red-500 px-4 py-1 text-white hover:bg-red-600"
                    >
                      Deactivate
                    </button>
                  )}
                  <Link href={`/admin/organizations/${organization.id}/edit`}>
                    <button className="rounded bg-yellow-500 px-4 py-1 text-white hover:bg-yellow-600">
                      Edit
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add space at the bottom of the page */}
        <div className="mt-10" />
      </div>
    </div>
  );
}
