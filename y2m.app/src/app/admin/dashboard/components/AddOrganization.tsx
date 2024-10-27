'use client';

import { useState, useCallback } from 'react';

export default function AddOrganization() {
  const [organizationName, setOrganizationName] = useState('');
  const [domain, setDomain] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setOrganizationName('');
    setDomain('');
    setSubdomain('');
    setContactEmail('');
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

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
          alert(`Organization ${organizationName} added successfully`);
          resetForm(); // Reset form after successful submission
        } else {
          setError(jsonResponse.error);
          alert(`Error adding organization: ${jsonResponse.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error adding organization:', error);
        setError('An error occurred while adding the organization.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, organizationName, domain, subdomain, contactEmail]
  );

  return (
    <div className="mx-auto mt-10 max-w-lg rounded-md bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Add Organization</h1>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block font-semibold text-gray-700">Organization Name</label>
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            required
            className="block w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">Domain</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
            className="block w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">Subdomain</label>
          <input
            type="text"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            required
            className="block w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">Contact Email</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="block w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`focus:ring-opacity/50 w-full rounded-md bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isSubmitting ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isSubmitting ? 'Adding Organization...' : 'Add Organization'}
        </button>
      </form>
    </div>
  );
}
