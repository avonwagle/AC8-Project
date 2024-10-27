'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Organization {
  id: number;
  organizationname: string;
  domain: string;
  subdomain: string;
  contactemail: string;
}

const OrganizationPage = () => {
  const { organizationId } = useParams();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!organizationId) return;

    const fetchOrganization = async () => {
      try {
        const res = await fetch(`/api/organizations/${organizationId}`);
        if (!res.ok) {
          throw new Error(`Error fetching organization: ${res.statusText}`);
        }
        const data: Organization = await res.json();
        setOrganization(data);
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

    fetchOrganization();
  }, [organizationId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{organization?.organizationname}</h1>
      <p>Domain: {organization?.domain}</p>
      <p>Subdomain: {organization?.subdomain}</p>
      <p>Contact Email: {organization?.contactemail}</p>
    </div>
  );
};

export default OrganizationPage;
