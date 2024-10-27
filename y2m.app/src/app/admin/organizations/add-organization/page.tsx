'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function AddOrganization() {
  const [organizationName, setOrganizationName] = useState('');
  const [domain, setDomain] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // Final check to prevent double submissions
      if (isSubmitting) {
        console.log('Submission blocked due to ongoing request.');
        return;
      }

      setIsSubmitting(true);
      setError('');

      try {
        console.log('Starting organization submission...');
        const res = await fetch('/api/admin/organizations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ organizationName, domain, subdomain, contactEmail }),
        });

        const jsonResponse = await res.json();
        console.log('Response received:', jsonResponse);

        if (res.ok) {
          router.push('/admin/organizations');
        } else {
          setError(jsonResponse.error || 'Unknown error occurred.');
        }
      } catch (error) {
        console.error('Error adding organization:', error);
        setError('An error occurred while adding the organization.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, organizationName, domain, subdomain, contactEmail, router]
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Add Organization</h1>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Organization Name:
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            required
            className="block w-full rounded border p-2"
          />
        </label>
        <label className="block">
          Domain:
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
            className="block w-full rounded border p-2"
          />
        </label>
        <label className="block">
          Subdomain:
          <input
            type="text"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            required
            className="block w-full rounded border p-2"
          />
        </label>
        <label className="block">
          Contact Email:
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="block w-full rounded border p-2"
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {isSubmitting ? 'Adding Organization...' : 'Add Organization'}
        </button>
      </form>
    </div>
  );
}
